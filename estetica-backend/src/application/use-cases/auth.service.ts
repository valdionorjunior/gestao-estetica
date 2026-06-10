import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { AuthResponseDto } from '../dtos/auth/auth-response.dto';
import { JwtPayload } from '../../presentation/guards/jwt.strategy';
import { UserRole } from '../../domain/entities/user-role.enum';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      nome: dto.nome,
      role: dto.role ?? UserRole.RECEPCIONISTA,
      clinicaId: dto.clinicaId ?? undefined,
    });

    return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.userRepository.updateUltimoLogin(user.id);
    return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
  }

  async refresh(userId: string, rawToken: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.ativo || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const valid = await bcrypt.compare(rawToken, user.refreshTokenHash);
    if (!valid) {
      // Reuse detected — invalidate token
      await this.userRepository.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Refresh token inválido ou reutilizado');
    }

    return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  private async buildTokens(
    userId: string,
    email: string,
    role: UserRole,
    clinicaId: string | null,
  ): Promise<AuthResponseDto> {
    const payload: JwtPayload = { sub: userId, email, role, clinicaId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.userRepository.updateRefreshToken(userId, refreshTokenHash);

    const user = await this.userRepository.findById(userId);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        nome: user?.nome ?? '',
        role,
        clinicaId,
      },
    };
  }
}
