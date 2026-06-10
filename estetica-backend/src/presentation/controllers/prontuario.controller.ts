import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { ProntuarioService } from '../../application/use-cases/prontuario.service';
import { UpdateProntuarioDto } from '../../application/dtos/prontuario/update-prontuario.dto';
import { CreateFichaDto, UpdateFichaDto } from '../../application/dtos/prontuario/ficha.dto';

@ApiTags('Prontuário')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pacientes/:pacienteId/prontuario')
export class ProntuarioController {
  constructor(private readonly prontuarioService: ProntuarioService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Obter prontuário do paciente (dados descriptografados)' })
  @ApiParam({ name: 'pacienteId', description: 'UUID do paciente' })
  @ApiResponse({ status: 200, description: 'Prontuário retornado (cria se não existir)' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN e MEDICO)' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  get(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.prontuarioService.getOrCreateByPacienteId(pacienteId, user.clinicaId);
  }

  @Patch()
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Atualizar prontuário do paciente' })
  @ApiParam({ name: 'pacienteId', description: 'UUID do paciente' })
  @ApiResponse({ status: 200, description: 'Prontuário atualizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Prontuário não encontrado' })
  update(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @Body() dto: UpdateProntuarioDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.prontuarioService.update(pacienteId, dto, user.clinicaId);
  }

  @Get('fichas')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Listar fichas de atendimento' })
  @ApiParam({ name: 'pacienteId', description: 'UUID do paciente' })
  @ApiResponse({ status: 200, description: 'Lista de fichas de atendimento' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  listFichas(@Param('pacienteId', ParseUUIDPipe) pacienteId: string) {
    return this.prontuarioService.listFichas(pacienteId);
  }

  @Post('fichas')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Criar nova ficha de atendimento' })
  @ApiParam({ name: 'pacienteId', description: 'UUID do paciente' })
  @ApiResponse({ status: 201, description: 'Ficha criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  createFicha(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @Body() dto: CreateFichaDto,
    @CurrentUser() user: { id: string; clinicaId: string | null },
  ) {
    return this.prontuarioService.createFicha(pacienteId, dto, user.id, user.clinicaId);
  }

  @Patch('fichas/:fichaId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Atualizar ficha de atendimento' })
  @ApiParam({ name: 'pacienteId', description: 'UUID do paciente' })
  @ApiParam({ name: 'fichaId', description: 'UUID da ficha' })
  @ApiResponse({ status: 200, description: 'Ficha atualizada' })
  @ApiResponse({ status: 400, description: 'Ficha já fechada ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Ficha não encontrada' })
  updateFicha(
    @Param('fichaId', ParseUUIDPipe) fichaId: string,
    @Body() dto: UpdateFichaDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.prontuarioService.updateFicha(fichaId, dto, user.id);
  }
}
