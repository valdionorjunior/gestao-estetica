import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { EstoqueService } from '../../application/use-cases/estoque.service';
import {
  CreateProdutoDto,
  ListProdutosDto,
  MovimentarEstoqueDto,
} from '../../application/dtos/estoque/estoque.dto';

@ApiTags('Estoque')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get('alertas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Produtos abaixo do estoque mínimo' })
  @ApiResponse({ status: 200, description: 'Lista de produtos com estoque crítico' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  alertas(@CurrentUser() user: { clinicaId: string | null }) {
    return this.estoqueService.alertasEstoqueMinimo(user.clinicaId);
  }

  @Get('produtos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar produtos do estoque' })
  @ApiResponse({ status: 200, description: 'Lista paginada de produtos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  listProdutos(
    @Query() filters: ListProdutosDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.estoqueService.listProdutos(user.clinicaId, filters);
  }

  @Get('produtos/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estoqueService.findOne(id);
  }

  @Post('produtos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cadastrar produto no estoque' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateProdutoDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.estoqueService.create(dto, user.clinicaId);
  }

  @Post('produtos/:id/movimentar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Registrar entrada, saída ou ajuste de estoque' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 201, description: 'Movimentação registrada' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente para saída' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  movimentar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MovimentarEstoqueDto,
    @CurrentUser() user: { id: string; clinicaId: string | null },
  ) {
    return this.estoqueService.movimentar(id, dto, user.id, user.clinicaId);
  }

  @Get('produtos/:id/movimentacoes')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Histórico de movimentações do produto' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Histórico de movimentações' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  listMovimentacoes(@Param('id', ParseUUIDPipe) id: string) {
    return this.estoqueService.listMovimentacoes(id);
  }
}
