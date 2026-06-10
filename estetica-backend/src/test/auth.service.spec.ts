import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../application/use-cases/auth.service';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserRole } from '../domain/entities/user-role.enum';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockUser: User = {
  id: 'uuid-1',
  email: 'test@clinica.com',
  passwordHash: '',
  nome: 'Teste',
  role: UserRole.ADMIN,
  clinicaId: null,
  ativo: true,
  refreshTokenHash: null,
  ultimoLogin: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateRefreshToken: jest.fn(),
            updateUltimoLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('deve registrar usuário e retornar tokens', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      const savedUser = { ...mockUser };
      userRepo.create.mockResolvedValue(savedUser);
      userRepo.updateRefreshToken.mockResolvedValue();
      userRepo.findById.mockResolvedValue(savedUser);

      const result = await service.register({
        email: 'test@clinica.com',
        password: 'Senha@123',
        nome: 'Teste',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(result.user.email).toBe('test@clinica.com');
      expect(userRepo.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ConflictException se e-mail já cadastrado', async () => {
      userRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@clinica.com', password: 'Senha@123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve retornar tokens com credenciais válidas', async () => {
      const hash = await bcrypt.hash('Senha@123', 12);
      const user = { ...mockUser, passwordHash: hash };
      userRepo.findByEmail.mockResolvedValue(user);
      userRepo.updateUltimoLogin.mockResolvedValue();
      userRepo.updateRefreshToken.mockResolvedValue();
      userRepo.findById.mockResolvedValue(user);

      const result = await service.login({
        email: 'test@clinica.com',
        password: 'Senha@123',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it('deve lançar UnauthorizedException com senha incorreta', async () => {
      const hash = await bcrypt.hash('correta', 12);
      userRepo.findByEmail.mockResolvedValue({ ...mockUser, passwordHash: hash });

      await expect(
        service.login({ email: 'test@clinica.com', password: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException com usuário inativo', async () => {
      userRepo.findByEmail.mockResolvedValue({ ...mockUser, ativo: false });

      await expect(
        service.login({ email: 'test@clinica.com', password: 'qualquer' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException com usuário não encontrado', async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nao@existe.com', password: 'qualquer' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('deve invalidar o refresh token', async () => {
      userRepo.updateRefreshToken.mockResolvedValue();
      await service.logout('uuid-1');
      expect(userRepo.updateRefreshToken).toHaveBeenCalledWith('uuid-1', null);
    });
  });

  describe('refresh', () => {
    it('deve lançar UnauthorizedException se refresh token não confere', async () => {
      const hash = await bcrypt.hash('token-valido', 12);
      userRepo.findById.mockResolvedValue({ ...mockUser, refreshTokenHash: hash });

      await expect(
        service.refresh('uuid-1', 'token-errado'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar novos tokens com refresh token válido', async () => {
      const rawToken = 'token-valido';
      const hash = await bcrypt.hash(rawToken, 12);
      const user = { ...mockUser, refreshTokenHash: hash };
      userRepo.findById.mockResolvedValue(user);
      userRepo.updateRefreshToken.mockResolvedValue();

      const result = await service.refresh('uuid-1', rawToken);
      expect(result.accessToken).toBeDefined();
    });
  });
});
