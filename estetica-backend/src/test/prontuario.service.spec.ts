import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProntuarioService } from '../application/use-cases/prontuario.service';
import { ProntuarioRepository } from '../infrastructure/repositories/prontuario.repository';
import { Prontuario } from '../domain/entities/prontuario.entity';
import { FichaAtendimento, FichaStatus } from '../domain/entities/ficha-atendimento.entity';

const mockProntuario: Prontuario = {
  id: 'uuid-pron-1',
  clinicaId: 'uuid-clinica-1',
  pacienteId: 'uuid-pac-1',
  paciente: null as any,
  historicoMedicoEncrypted: null,
  alergiasEncrypted: null,
  medicamentosUsoEncrypted: null,
  observacoes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFicha: FichaAtendimento = {
  id: 'uuid-ficha-1',
  prontuarioId: 'uuid-pron-1',
  prontuario: null as any,
  agendamentoId: null,
  profissionalId: 'uuid-prof-1',
  titulo: 'Consulta inicial',
  conteudoEncrypted: null,
  status: FichaStatus.ABERTA,
  fechadaEm: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProntuarioService', () => {
  let service: ProntuarioService;
  let repo: jest.Mocked<ProntuarioRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProntuarioService,
        {
          provide: ProntuarioRepository,
          useValue: {
            findByPacienteId: jest.fn(),
            findById: jest.fn(),
            createProntuario: jest.fn(),
            updateProntuario: jest.fn(),
            listFichas: jest.fn(),
            findFichaById: jest.fn(),
            createFicha: jest.fn(),
            updateFicha: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProntuarioService>(ProntuarioService);
    repo = module.get(ProntuarioRepository);
  });

  describe('getOrCreateByPacienteId', () => {
    it('deve retornar prontuário existente descriptografado', async () => {
      repo.findByPacienteId.mockResolvedValue(mockProntuario);
      const result = await service.getOrCreateByPacienteId('uuid-pac-1', null);
      expect(result.id).toBe('uuid-pron-1');
      expect((result as any).historicoMedicoEncrypted).toBeUndefined();
    });

    it('deve criar prontuário se não existir', async () => {
      repo.findByPacienteId.mockResolvedValue(null);
      repo.createProntuario.mockResolvedValue(mockProntuario);
      await service.getOrCreateByPacienteId('uuid-pac-1', 'uuid-clinica-1');
      expect(repo.createProntuario).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve criptografar campos sensíveis ao atualizar', async () => {
      repo.findByPacienteId.mockResolvedValueOnce(mockProntuario).mockResolvedValueOnce(mockProntuario);
      repo.updateProntuario.mockResolvedValue();
      await service.update('uuid-pac-1', { historicoMedico: 'Hipertenso', alergias: 'Dipirona' }, null);
      const updateCall = repo.updateProntuario.mock.calls[0][1] as any;
      expect(updateCall.historicoMedicoEncrypted).not.toBe('Hipertenso');
      expect(updateCall.alergiasEncrypted).not.toBe('Dipirona');
    });
  });

  describe('createFicha', () => {
    it('deve criar ficha vinculada ao prontuário', async () => {
      repo.findByPacienteId.mockResolvedValue(mockProntuario);
      repo.createFicha.mockResolvedValue(mockFicha);
      const result = await service.createFicha('uuid-pac-1', { titulo: 'Consulta inicial' }, 'uuid-prof-1', null);
      expect(result.titulo).toBe('Consulta inicial');
    });
  });

  describe('updateFicha', () => {
    it('deve lançar NotFoundException para ficha inexistente', async () => {
      repo.findFichaById.mockResolvedValue(null);
      await expect(service.updateFicha('nao-existe', {}, 'uuid-prof-1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException para ficha fechada', async () => {
      repo.findFichaById.mockResolvedValue({ ...mockFicha, status: FichaStatus.FECHADA });
      await expect(service.updateFicha('uuid-ficha-1', { titulo: 'novo' }, 'uuid-prof-1')).rejects.toThrow(ForbiddenException);
    });

    it('deve fechar ficha e registrar data de fechamento', async () => {
      repo.findFichaById.mockResolvedValueOnce(mockFicha).mockResolvedValueOnce({ ...mockFicha, status: FichaStatus.FECHADA });
      repo.updateFicha.mockResolvedValue();
      await service.updateFicha('uuid-ficha-1', { status: FichaStatus.FECHADA }, 'uuid-prof-1');
      const updateCall = repo.updateFicha.mock.calls[0][1] as any;
      expect(updateCall.fechadaEm).toBeDefined();
    });
  });
});
