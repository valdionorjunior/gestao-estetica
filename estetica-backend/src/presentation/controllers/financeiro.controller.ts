import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { FinanceiroService } from '../../application/use-cases/financeiro.service';
import { CreateContaDto, ListContasDto, DashboardFinanceiroDto } from '../../application/dtos/financeiro/conta.dto';

@ApiTags('Financeiro')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Dashboard financeiro com totais agrupados' })
  @ApiResponse({ status: 200, description: 'Totais de receitas, despesas e saldo' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  dashboard(
    @Query() filters: DashboardFinanceiroDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.financeiroService.dashboard(user.clinicaId, filters);
  }

  @Get('contas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar contas a pagar e receber' })
  @ApiResponse({ status: 200, description: 'Lista paginada de contas financeiras' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  list(
    @Query() filters: ListContasDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.financeiroService.list(user.clinicaId, filters);
  }

  @Get('contas/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiParam({ name: 'id', description: 'UUID da conta financeira' })
  @ApiResponse({ status: 200, description: 'Conta financeira encontrada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeiroService.findOne(id);
  }

  @Post('contas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Registrar nova conta financeira' })
  @ApiResponse({ status: 201, description: 'Conta financeira criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateContaDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.financeiroService.create(dto, user.clinicaId);
  }

  @Patch('contas/:id/pagar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Marcar conta como paga' })
  @ApiParam({ name: 'id', description: 'UUID da conta' })
  @ApiResponse({ status: 200, description: 'Conta marcada como PAGO' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  markAsPaid(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeiroService.markAsPaid(id);
  }

  @Patch('contas/:id/cancelar')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancelar conta financeira' })
  @ApiParam({ name: 'id', description: 'UUID da conta' })
  @ApiResponse({ status: 200, description: 'Conta cancelada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeiroService.cancel(id);
  }
}
