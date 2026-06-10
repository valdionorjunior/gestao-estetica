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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { ConsultaInterativaService } from '../../application/use-cases/consulta-interativa.service';
import {
  CreateConsultaFotoDto,
  UpdateAnotacoesDto,
} from '../../application/dtos/consulta/consulta-foto.dto';
import { TipoFotoConsulta } from '../../domain/entities/consulta-foto.entity';

@ApiTags('Consulta Interativa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consulta-interativa')
export class ConsultaInterativaController {
  constructor(private readonly service: ConsultaInterativaService) {}

  // ─── Upload de foto ─────────────────────────────────────────────────────────

  @Post('upload')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const nomeUnico = `consulta_${randomUUID()}${extname(file.originalname)}`;
          cb(null, nomeUnico);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (_req, file, cb) => {
        const permitidos = /image\/(jpeg|png|webp)/;
        if (permitidos.test(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Apenas imagens JPG, PNG e WebP são permitidas'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        foto: { type: 'string', format: 'binary', description: 'Imagem (JPG/PNG/WebP, max 10 MB)' },
        pacienteId: { type: 'string', format: 'uuid' },
        tipo: { type: 'string', enum: Object.values(TipoFotoConsulta) },
        descricao: { type: 'string' },
        dataConsulta: { type: 'string', example: '2026-04-17' },
      },
      required: ['foto', 'pacienteId', 'tipo'],
    },
  })
  @ApiOperation({ summary: 'Fazer upload de foto de consulta (antes/depois)' })
  @ApiResponse({ status: 201, description: 'Foto salva com sucesso' })
  async uploadFoto(
    @UploadedFile() arquivo: Express.Multer.File | undefined,
    @Body() dto: CreateConsultaFotoDto,
    @Req() req: import('express').Request,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.service.criarFoto(dto, arquivo, baseUrl);
  }

  // ─── Listar fotos do paciente ───────────────────────────────────────────────

  @Get('paciente/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar fotos de consulta de um paciente' })
  @ApiQuery({ name: 'tipo', required: false, enum: TipoFotoConsulta })
  async listarPorPaciente(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @Query('tipo') tipo?: TipoFotoConsulta,
  ) {
    return this.service.listarPorPaciente(pacienteId, tipo);
  }

  // ─── Buscar foto por ID ─────────────────────────────────────────────────────

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Buscar foto de consulta por ID' })
  async buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(id);
  }

  // ─── Salvar anotações ───────────────────────────────────────────────────────

  @Patch(':id/anotacoes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Salvar marcações/anotações em uma foto de consulta' })
  @ApiResponse({ status: 200, description: 'Anotações salvas com sucesso' })
  async salvarAnotacoes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnotacoesDto,
  ) {
    return this.service.salvarAnotacoes(id, dto.anotacoes);
  }

  // ─── Remover foto ───────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover foto de consulta e arquivo físico' })
  @ApiResponse({ status: 204, description: 'Foto removida com sucesso' })
  async remover(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remover(id);
  }
}
