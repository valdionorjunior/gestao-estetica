import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { IaProntuarioService } from '../../application/use-cases/ia-prontuario.service';
import { IaOperacao } from '../../domain/entities/ia-consulta-log.entity';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

class ResumoDto {
  @ApiProperty({ description: 'Texto das notas da consulta a ser resumido' })
  @IsString()
  @MinLength(10, { message: 'Texto muito curto para resumir (mínimo 10 caracteres)' })
  @MaxLength(8000, { message: 'Texto muito longo (máximo 8000 caracteres)' })
  texto: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'pacienteId deve ser UUID válido' })
  pacienteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'prontuarioId deve ser UUID válido' })
  prontuarioId?: string;
}

class HipoteseDto {
  @ApiProperty({ description: 'Queixas e sintomas relatados pelo paciente' })
  @IsString()
  @MinLength(10, { message: 'Queixas muito curtas (mínimo 10 caracteres)' })
  @MaxLength(4000, { message: 'Queixas muito longas (máximo 4000 caracteres)' })
  queixas: string;

  @ApiPropertyOptional({ description: 'Histórico médico relevante' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  historicoRelevante?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  pacienteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  prontuarioId?: string;
}

// ─── Extensões permitidas para áudio ─────────────────────────────────────────
const AUDIO_EXT_PERMITIDAS = new Set(['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.ogg']);

@ApiTags('IA no Prontuário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ia')
export class IaProntuarioController {
  constructor(private readonly service: IaProntuarioService) {}

  // ─── Status de configuração ─────────────────────────────────────────────────

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Status da configuração da IA (OpenAI)' })
  statusConfig() {
    return this.service.statusConfig();
  }

  // ─── Transcrição de áudio ───────────────────────────────────────────────────

  @Post('transcrever')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transcrever áudio da consulta (Whisper AI)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: { type: 'string', format: 'binary', description: 'Arquivo de áudio (mp3, wav, m4a, webm — máx 25MB)' },
        pacienteId: { type: 'string', format: 'uuid' },
        prontuarioId: { type: 'string', format: 'uuid' },
      },
      required: ['audio'],
    },
  })
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'ia-audio'),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB (limite Whisper)
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (AUDIO_EXT_PERMITIDAS.has(ext)) {
          cb(null, true);
        } else {
          cb(new Error(`Formato não suportado: ${ext}. Use mp3, wav, m4a ou webm.`), false);
        }
      },
    }),
  )
  async transcrever(
    @UploadedFile() file: Express.Multer.File,
    @Body('pacienteId') pacienteId?: string,
    @Body('prontuarioId') prontuarioId?: string,
  ) {
    if (!file) {
      return { erro: 'Arquivo de áudio obrigatório' };
    }
    return this.service.transcreverAudio({
      audioPath: file.path,
      audioNome: file.originalname,
      pacienteId: pacienteId || undefined,
      prontuarioId: prontuarioId || undefined,
    });
  }

  // ─── Resumo da consulta ─────────────────────────────────────────────────────

  @Post('resumir')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gerar resumo estruturado das notas da consulta (GPT)' })
  async resumir(@Body() dto: ResumoDto) {
    return this.service.resumirConsulta({
      texto: dto.texto,
      pacienteId: dto.pacienteId,
      prontuarioId: dto.prontuarioId,
    });
  }

  // ─── Hipótese diagnóstica ───────────────────────────────────────────────────

  @Post('hipotese')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sugerir hipóteses diagnósticas com base nas queixas (GPT)' })
  async hipotese(@Body() dto: HipoteseDto) {
    return this.service.sugerirHipotese({
      queixas: dto.queixas,
      historicoRelevante: dto.historicoRelevante,
      pacienteId: dto.pacienteId,
      prontuarioId: dto.prontuarioId,
    });
  }

  // ─── Logs ───────────────────────────────────────────────────────────────────

  @Get('logs')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Histórico de operações de IA' })
  @ApiQuery({ name: 'pacienteId', required: false })
  @ApiQuery({ name: 'operacao', required: false, enum: IaOperacao })
  @ApiQuery({ name: 'page', required: false })
  async logs(
    @Query('pacienteId') pacienteId?: string,
    @Query('operacao') operacao?: IaOperacao,
    @Query('page') page?: string,
  ) {
    return this.service.listarLogs({
      pacienteId,
      operacao,
      page: page ? Number(page) : 1,
    });
  }
}
