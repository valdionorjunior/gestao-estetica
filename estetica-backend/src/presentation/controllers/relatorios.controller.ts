import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { AgendamentoStatus } from '../../domain/entities/agendamento-status.enum';
import { ContaFinanceira } from '../../domain/entities/conta-financeira.entity';
import { ContaStatus, ContaTipo } from '../../domain/entities/financeiro.enums';
import { Paciente } from '../../domain/entities/paciente.entity';

class RelatorioFiltroDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataFim?: string;
}

@ApiTags('Relatórios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatorios')
export class RelatoriosController {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentos: Repository<Agendamento>,
    @InjectRepository(ContaFinanceira)
    private readonly contas: Repository<ContaFinanceira>,
    @InjectRepository(Paciente)
    private readonly pacientes: Repository<Paciente>,
  ) {}

  @Get('agenda')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Relatório de agendamentos por período' })
  @ApiResponse({ status: 200, description: 'Array de { data, total, concluidos, cancelados }' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  async agenda(
    @Query() filters: RelatorioFiltroDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    const qb = this.agendamentos
      .createQueryBuilder('a')
      .select([
        "TO_CHAR(a.dataHoraInicio, 'YYYY-MM-DD') AS data",
        'COUNT(*) AS total',
        `SUM(CASE WHEN a.status = '${AgendamentoStatus.CONCLUIDO}' THEN 1 ELSE 0 END) AS concluidos`,
        `SUM(CASE WHEN a.status = '${AgendamentoStatus.CANCELADO}' THEN 1 ELSE 0 END) AS cancelados`,
      ])
      .groupBy('data')
      .orderBy('data', 'ASC');

    if (user.clinicaId) qb.andWhere('a.clinicaId = :c', { c: user.clinicaId });
    if (filters.dataInicio) qb.andWhere('a.dataHoraInicio >= :di', { di: filters.dataInicio });
    if (filters.dataFim) qb.andWhere('a.dataHoraInicio <= :df', { df: filters.dataFim });

    const rows = await qb.getRawMany();
    // Converter strings para números
    return rows.map(r => ({
      data: r.data,
      total: parseInt(r.total, 10),
      concluidos: parseInt(r.concluidos, 10),
      cancelados: parseInt(r.cancelados, 10),
    }));
  }

  @Get('financeiro')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Relatório financeiro por período (agrupado por mês)' })
  @ApiResponse({ status: 200, description: 'Array de { mes, totalReceitas, totalDespesas, saldo }' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  async financeiro(
    @Query() filters: RelatorioFiltroDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    const qb = this.contas
      .createQueryBuilder('c')
      .select([
        "TO_CHAR(c.dataVencimento, 'YYYY-MM') AS mes",
        `SUM(CASE WHEN c.tipo = '${ContaTipo.RECEITA}' AND c.status = '${ContaStatus.PAGO}' THEN c.valor ELSE 0 END) AS totalReceitas`,
        `SUM(CASE WHEN c.tipo = '${ContaTipo.DESPESA}' AND c.status = '${ContaStatus.PAGO}' THEN c.valor ELSE 0 END) AS totalDespesas`,
      ])
      .groupBy('mes')
      .orderBy('mes', 'ASC');

    if (user.clinicaId) qb.andWhere('c.clinicaId = :c', { c: user.clinicaId });
    if (filters.dataInicio) qb.andWhere('c.dataVencimento >= :di', { di: filters.dataInicio });
    if (filters.dataFim) qb.andWhere('c.dataVencimento <= :df', { df: filters.dataFim });

    const rows = await qb.getRawMany();
    // Converter e calcular saldo
    return rows.map(r => {
      const totalReceitas = parseFloat(r.totalreceitas || 0);
      const totalDespesas = parseFloat(r.totaldespesas || 0);
      return {
        mes: r.mes,
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas,
      };
    });
  }

  @Get('pacientes/novos')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Novos pacientes cadastrados por mês' })
  @ApiResponse({ status: 200, description: 'Array de { mes, total }' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  async novosPacientes(
    @Query() filters: RelatorioFiltroDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    const qb = this.pacientes
      .createQueryBuilder('p')
      .select(["TO_CHAR(p.createdAt, 'YYYY-MM') AS mes", 'COUNT(*) AS total'])
      .groupBy('mes')
      .orderBy('mes', 'ASC');

    if (user.clinicaId) qb.andWhere('p.clinicaId = :c', { c: user.clinicaId });
    if (filters.dataInicio) qb.andWhere('p.createdAt >= :di', { di: filters.dataInicio });
    if (filters.dataFim) qb.andWhere('p.createdAt <= :df', { df: filters.dataFim });

    const rows = await qb.getRawMany();
    // Converter total para número
    return rows.map(r => ({
      mes: r.mes,
      total: parseInt(r.total, 10),
    }));
  }
}
