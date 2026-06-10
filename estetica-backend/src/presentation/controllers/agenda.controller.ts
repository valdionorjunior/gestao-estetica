import {
  Body,
  Controller,
  Delete,
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
import { AgendaService } from '../../application/use-cases/agenda.service';
import { CreateAgendamentoDto } from '../../application/dtos/agenda/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../../application/dtos/agenda/update-agendamento.dto';
import { ListAgendamentosDto } from '../../application/dtos/agenda/list-agendamentos.dto';
import { UpdateAgendamentoStatusDto } from '../../application/dtos/agenda/update-agendamento-status.dto';

@ApiTags('Agenda')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar agendamentos com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  list(
    @Query() filters: ListAgendamentosDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.agendaService.list(user.clinicaId, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento encontrado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendaService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Criar agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Conflito de horário' })
  create(
    @Body() dto: CreateAgendamentoDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.agendaService.create(dto, user.clinicaId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgendamentoDto,
  ) {
    return this.agendaService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgendamentoStatusDto,
  ) {
    return this.agendaService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Cancelar agendamento' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  @ApiResponse({ status: 204, description: 'Agendamento cancelado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendaService.cancel(id);
  }
}
