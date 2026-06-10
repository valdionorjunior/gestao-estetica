import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../application/use-cases/usuarios.service';
import { User } from '../domain/entities/user.entity';
import { UserRole } from '../domain/entities/user-role.enum';

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'uuid-admin-1',
  email: 'admin@clinica.com',
  passwordHash: 'hash',
  nome: 'Admin Silva',
  role: UserRole.ADMIN,
  clinicaId: null,
  ativo: true,
  refreshTokenHash: null,
  ultimoLogin: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsuariosService);
    repo = module.get(getRepositoryToken(User));
  });

  it('deve listar usuários com paginação', async () => {
    const users = [makeUser(), makeUser({ id: 'uuid-2', email: 'outro@clinica.com' })];
    repo.findAndCount.mockResolvedValue([users, 2]);

    const result = await service.listar({ page: 1, limit: 10 });

    expect(result.total).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].email).toBe('admin@clinica.com');
  });

  it('deve buscar usuário por ID existente', async () => {
    repo.findOne.mockResolvedValue(makeUser());
    const result = await service.buscarPorId('uuid-admin-1');
    expect(result.email).toBe('admin@clinica.com');
  });

  it('deve lançar NotFoundException para ID inexistente', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.buscarPorId('uuid-inexistente')).rejects.toThrow(NotFoundException);
  });

  it('deve criar usuário com hash de senha', async () => {
    repo.findOne.mockResolvedValue(null); // e-mail não existente
    const created = makeUser({ role: UserRole.MEDICO, email: 'medico@clinica.com' });
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const result = await service.criar({
      email: 'medico@clinica.com',
      password: 'Senha@123',
      nome: 'Dr. Med',
      role: UserRole.MEDICO,
    });

    expect(result.role).toBe(UserRole.MEDICO);
    expect(repo.create).toHaveBeenCalled();
  });

  it('deve lançar ConflictException ao criar com e-mail duplicado', async () => {
    repo.findOne.mockResolvedValue(makeUser());
    await expect(
      service.criar({ email: 'admin@clinica.com', password: 'Senha@123', nome: 'X', role: UserRole.ADMIN }),
    ).rejects.toThrow(ConflictException);
  });

  it('deve atualizar role do usuário', async () => {
    const user = makeUser();
    repo.findOne.mockResolvedValue(user);
    repo.save.mockResolvedValue({ ...user, role: UserRole.RECEPCIONISTA });

    const result = await service.atualizar('uuid-admin-1', { role: UserRole.RECEPCIONISTA });
    expect(result.role).toBe(UserRole.RECEPCIONISTA);
  });

  it('deve desativar usuário (soft delete)', async () => {
    repo.findOne.mockResolvedValue(makeUser());
    repo.update.mockResolvedValue({ affected: 1 } as any);

    await expect(service.desativar('uuid-admin-1')).resolves.toBeUndefined();
    expect(repo.update).toHaveBeenCalledWith('uuid-admin-1', { ativo: false });
  });

  it('deve lançar NotFoundException ao desativar ID inexistente', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.desativar('uuid-inexistente')).rejects.toThrow(NotFoundException);
  });
});
