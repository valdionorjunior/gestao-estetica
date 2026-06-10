import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstoqueService } from '../application/use-cases/estoque.service';
import { EstoqueRepository } from '../infrastructure/repositories/estoque.repository';
import { Produto } from '../domain/entities/produto.entity';
import { MovimentacaoTipo } from '../domain/entities/movimentacao-tipo.enum';
import { MovimentacaoEstoque } from '../domain/entities/movimentacao-estoque.entity';

const mockProduto: Produto = {
  id: 'uuid-prod-1',
  clinicaId: 'uuid-clinica-1',
  categoriaId: null,
  nome: 'Ácido Hialurônico',
  descricao: null,
  unidade: 'ML',
  estoqueAtual: 50,
  estoqueMinimo: 10,
  precoCusto: null,
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EstoqueService', () => {
  let service: EstoqueService;
  let repo: jest.Mocked<EstoqueRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstoqueService,
        {
          provide: EstoqueRepository,
          useValue: {
            findProdutoById: jest.fn(),
            listProdutos: jest.fn(),
            createProduto: jest.fn(),
            updateProduto: jest.fn(),
            listMovimentacoes: jest.fn(),
            createMovimentacao: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EstoqueService>(EstoqueService);
    repo = module.get(EstoqueRepository);
  });

  describe('findOne', () => {
    it('deve retornar produto existente', async () => {
      repo.findProdutoById.mockResolvedValue(mockProduto);
      const result = await service.findOne('uuid-prod-1');
      expect(result.nome).toBe('Ácido Hialurônico');
    });

    it('deve lançar NotFoundException', async () => {
      repo.findProdutoById.mockResolvedValue(null);
      await expect(service.findOne('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('movimentar', () => {
    const mockMovimentacao: MovimentacaoEstoque = {
      id: 'uuid-mov-1',
      clinicaId: null,
      produtoId: 'uuid-prod-1',
      produto: mockProduto,
      tipo: MovimentacaoTipo.ENTRADA,
      quantidade: 20,
      estoqueAnterior: 50,
      estoquePosterior: 70,
      motivo: null,
      usuarioId: 'uuid-user-1',
      createdAt: new Date(),
    };

    it('deve registrar entrada e atualizar estoque', async () => {
      repo.findProdutoById.mockResolvedValue(mockProduto);
      repo.updateProduto.mockResolvedValue();
      repo.createMovimentacao.mockResolvedValue(mockMovimentacao);

      await service.movimentar('uuid-prod-1', { tipo: MovimentacaoTipo.ENTRADA, quantidade: 20 }, 'uuid-user-1', null);
      const updateCall = repo.updateProduto.mock.calls[0][1] as any;
      expect(updateCall.estoqueAtual).toBe(70);
    });

    it('deve registrar saída', async () => {
      repo.findProdutoById.mockResolvedValue(mockProduto);
      repo.updateProduto.mockResolvedValue();
      repo.createMovimentacao.mockResolvedValue({ ...mockMovimentacao, tipo: MovimentacaoTipo.SAIDA, quantidade: 10, estoquePosterior: 40 });

      await service.movimentar('uuid-prod-1', { tipo: MovimentacaoTipo.SAIDA, quantidade: 10 }, 'uuid-user-1', null);
      const updateCall = repo.updateProduto.mock.calls[0][1] as any;
      expect(updateCall.estoqueAtual).toBe(40);
    });

    it('deve lançar BadRequestException se estoque insuficiente', async () => {
      repo.findProdutoById.mockResolvedValue({ ...mockProduto, estoqueAtual: 5 });
      await expect(
        service.movimentar('uuid-prod-1', { tipo: MovimentacaoTipo.SAIDA, quantidade: 10 }, 'uuid-user-1', null),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve fazer ajuste setando estoque diretamente', async () => {
      repo.findProdutoById.mockResolvedValue(mockProduto);
      repo.updateProduto.mockResolvedValue();
      repo.createMovimentacao.mockResolvedValue(mockMovimentacao);

      await service.movimentar('uuid-prod-1', { tipo: MovimentacaoTipo.AJUSTE, quantidade: 30 }, 'uuid-user-1', null);
      const updateCall = repo.updateProduto.mock.calls[0][1] as any;
      expect(updateCall.estoqueAtual).toBe(30);
    });
  });

  describe('alertasEstoqueMinimo', () => {
    it('deve retornar produtos abaixo do mínimo', async () => {
      repo.listProdutos.mockResolvedValue({
        data: [{ ...mockProduto, estoqueAtual: 5, estoqueMinimo: 10 }],
        total: 1,
      });
      const result = await service.alertasEstoqueMinimo('uuid-clinica-1');
      expect(result).toHaveLength(1);
    });
  });
});
