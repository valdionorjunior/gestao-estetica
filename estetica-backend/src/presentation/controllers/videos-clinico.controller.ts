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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { VideosClinicoService } from '../../application/use-cases/videos-clinico.service';
import {
  CreateVideoClinicoDto,
  UpdateVideoClinicoDto,
} from '../../application/dtos/videos/video-clinico.dto';
import { VideoCategoria, VideoTipo } from '../../domain/entities/video-clinico.entity';

@ApiTags('Vídeos Interativos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('videos')
export class VideosClinicoController {
  constructor(private readonly service: VideosClinicoService) {}

  // ─── Listar vídeos ──────────────────────────────────────────────────────────

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Listar vídeos da biblioteca com filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'busca', required: false, type: String })
  @ApiQuery({ name: 'categoria', required: false, enum: VideoCategoria })
  @ApiQuery({ name: 'tipo', required: false, enum: VideoTipo })
  @ApiQuery({ name: 'visivelPaciente', required: false, type: Boolean })
  async listar(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('busca') busca?: string,
    @Query('categoria') categoria?: VideoCategoria,
    @Query('tipo') tipo?: VideoTipo,
    @Query('visivelPaciente') visivelPaciente?: string,
  ) {
    return this.service.listar({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      busca,
      categoria,
      tipo,
      apenasVisivelPaciente: visivelPaciente === 'true',
    });
  }

  // ─── Estatísticas ───────────────────────────────────────────────────────────

  @Get('estatisticas')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Estatísticas de visualizações por categoria' })
  async estatisticas() {
    return this.service.estatisticas();
  }

  // ─── Buscar por ID + registrar visualização ─────────────────────────────────

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Buscar vídeo por ID e registrar visualização' })
  async buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    const video = await this.service.buscarPorId(id);
    this.service.registrarVisualizacao(id);
    return video;
  }

  // ─── Criar ──────────────────────────────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Adicionar vídeo à biblioteca (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Vídeo criado com sucesso' })
  async criar(@Body() dto: CreateVideoClinicoDto) {
    return this.service.criar(dto);
  }

  // ─── Atualizar ───────────────────────────────────────────────────────────────

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar dados do vídeo (ADMIN)' })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVideoClinicoDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  // ─── Remover ─────────────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar vídeo da biblioteca (ADMIN)' })
  async remover(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remover(id);
  }
}
