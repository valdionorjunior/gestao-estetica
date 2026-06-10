import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VideoCategoria, VideoTipo } from '../../../domain/entities/video-clinico.entity';

export class CreateVideoClinicoDto {
  @ApiProperty({ description: 'Título do vídeo', example: 'Botox — Técnica de Aplicação' })
  @IsString()
  @MaxLength(200, { message: 'Título máximo de 200 caracteres' })
  titulo: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do conteúdo' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'URL do vídeo (YouTube embed, Vimeo ou arquivo local)' })
  @IsString()
  @MaxLength(2000)
  videoUrl: string;

  @ApiPropertyOptional({ description: 'URL da miniatura (thumbnail)' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ enum: VideoCategoria })
  @IsEnum(VideoCategoria, { message: 'Categoria inválida' })
  categoria: VideoCategoria;

  @ApiProperty({ enum: VideoTipo })
  @IsEnum(VideoTipo, { message: 'Tipo inválido' })
  tipo: VideoTipo;

  @ApiPropertyOptional({ description: 'Nome do procedimento relacionado' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  procedimentoNome?: string;

  @ApiPropertyOptional({ description: 'Duração em segundos' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duracaoSegundos?: number;

  @ApiPropertyOptional({ description: 'Tags para busca, separadas por vírgula' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Visível para pacientes no portal', default: false })
  @IsOptional()
  @IsBoolean()
  visivelPaciente?: boolean;
}

export class UpdateVideoClinicoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ enum: VideoCategoria })
  @IsOptional()
  @IsEnum(VideoCategoria)
  categoria?: VideoCategoria;

  @ApiPropertyOptional({ enum: VideoTipo })
  @IsOptional()
  @IsEnum(VideoTipo)
  tipo?: VideoTipo;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  procedimentoNome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  duracaoSegundos?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visivelPaciente?: boolean;
}

export class VideoClinicoResponseDto {
  id: string;
  titulo: string;
  descricao: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  categoria: VideoCategoria;
  tipo: VideoTipo;
  procedimentoNome: string | null;
  duracaoSegundos: number | null;
  duracaoFormatada: string | null;
  tags: string[];
  ativo: boolean;
  visivelPaciente: boolean;
  totalVisualizacoes: number;
  createdAt: Date;
}
