import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  clinicaId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'fallback-dev-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.ativo) {
      throw new UnauthorizedException('Usuário inativo ou não encontrado');
    }
    return { id: user.id, email: user.email, role: user.role, clinicaId: user.clinicaId };
  }
}
