import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PacientesService } from '../application/use-cases/pacientes.service';
import { PacienteRepository } from '../infrastructure/repositories/paciente.repository';
import { Paciente } from '../domain/entities/paciente.entity';

const mockPaciente: Paciente = {
  id: 'uuid-pac-1',
  clinicaId: 'uuid-clinica-1',
  nome: 'Maria Silva',
  cpfEncrypted: null,
  dataNascimento: null,
  telefone: '(11) 99999-9999',
  email: 'maria@email.com',
  endereco: null,
  cidade: 'São Paulo',
  estado: 'SP',
  cep: null,
  fotoUrl: null,
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PacientesService', () => {
  let service: PacientesService;
  let repo: jest.Mocked<PacienteRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: PacienteRepository,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
    repo = module.get(PacienteRepository);
  });

  describe('findOne', () => {
    it('deve retornar paciente existente', async () => {
      repo.findById.mockResolvedValue(mockPaciente);
      const result = await service.findOne('uuid-pac-1');
      expect(result.id).toBe('uuid-pac-1');
    });

    it('deve lançar NotFoundException para paciente inexistente', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findOne('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar paciente com dados válidos', async () => {
      repo.create.mockResolvedValue(mockPaciente);
      const result = await service.create(
        { nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999' },
        'uuid-clinica-1',
      );
      expect(result.id).toBe('uuid-pac-1');
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criptografar CPF ao criar paciente', async () => {
      repo.create.mockResolvedValue(mockPaciente);
      await service.create({ nome: 'Maria', cpf: '123.456.789-00' }, null);
      const call = repo.create.mock.calls[0][0];
      // CPF deve estar criptografado, não em texto claro
      expect(call.cpfEncrypted).not.toBe('123.456.789-00');
      expect(call.cpfEncrypted).toBeTruthy();
    });
  });

  describe('list', () => {
    it('deve retornar lista paginada de pacientes', async () => {
      repo.list.mockResolvedValue({ data: [mockPaciente], total: 1 });
      const result = await service.list('uuid-clinica-1', { page: 1, limit: 20 });
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });

    it('resultado não deve expor cpfEncrypted', async () => {
      repo.list.mockResolvedValue({ data: [mockPaciente], total: 1 });
      const result = await service.list(null, {});
      const p = result.data[0] as any;
      expect(p.cpfEncrypted).toBeUndefined();
      expect('cpfMasked' in p).toBe(true);
    });
  });

  describe('remove', () => {
    it('deve fazer soft delete do paciente', async () => {
      repo.findById.mockResolvedValue(mockPaciente);
      repo.softDelete.mockResolvedValue();
      await service.remove('uuid-pac-1');
      expect(repo.softDelete).toHaveBeenCalledWith('uuid-pac-1');
    });

    it('deve lançar NotFoundException para id inexistente', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.remove('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });
});
