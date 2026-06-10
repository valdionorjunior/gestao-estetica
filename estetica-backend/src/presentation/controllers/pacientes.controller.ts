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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { PacientesService } from '../../application/use-cases/pacientes.service';
import { CreatePacienteDto } from '../../application/dtos/pacientes/create-paciente.dto';
import { UpdatePacienteDto } from '../../application/dtos/pacientes/update-paciente.dto';
import { ListPacientesDto } from '../../application/dtos/pacientes/list-pacientes.dto';

@ApiTags('Pacientes')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar pacientes com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  list(
    @Query() filters: ListPacientesDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.pacientesService.list(user.clinicaId, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  @ApiParam({ name: 'id', description: 'UUID do paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Cadastrar novo paciente' })
  @ApiResponse({ status: 201, description: 'Paciente cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  create(
    @Body() dto: CreatePacienteDto,
    @CurrentUser() user: { clinicaId: string | null },
  ) {
    return this.pacientesService.create(dto, user.clinicaId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Atualizar dados do paciente' })
  @ApiParam({ name: 'id', description: 'UUID do paciente' })
  @ApiResponse({ status: 200, description: 'Paciente atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar paciente (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID do paciente' })
  @ApiResponse({ status: 204, description: 'Paciente desativado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas ADMIN)' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.remove(id);
  }
}
