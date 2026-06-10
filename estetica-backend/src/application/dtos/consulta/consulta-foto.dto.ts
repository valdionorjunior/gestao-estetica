import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoFotoConsulta } from '../../../domain/entities/consulta-foto.entity';

export class AnotacaoDto {
  @ApiProperty({ description: 'ID único da anotação' })
  id: string;

  @ApiProperty({ description: 'Posição X relativa (0–100%)', example: 45.2 })
  x: number;

  @ApiProperty({ description: 'Posição Y relativa (0–100%)', example: 30.1 })
  y: number;

  @ApiProperty({ description: 'Texto da marcação', example: 'Aplicar bioestimulador' })
  texto: string;

  @ApiPropertyOptional({ description: 'Cor da marcação', example: '#D4AF37' })
  cor?: string;

  @ApiPropertyOptional({ enum: ['circulo', 'seta', 'retangulo', 'ponto'], description: 'Forma da marcação' })
  forma?: 'circulo' | 'seta' | 'retangulo' | 'ponto';
}

export class CreateConsultaFotoDto {
  @ApiProperty({ description: 'ID do paciente (UUID)' })
  @IsUUID('4', { message: 'pacienteId deve ser um UUID válido' })
  pacienteId: string;

  @ApiPropertyOptional({ description: 'ID do prontuário vinculado' })
  @IsOptional()
  @IsUUID('4', { message: 'prontuarioId deve ser um UUID válido' })
  prontuarioId?: string;

  @ApiPropertyOptional({ description: 'ID do profissional' })
  @IsOptional()
  @IsUUID('4', { message: 'profissionalId deve ser um UUID válido' })
  profissionalId?: string;

  @ApiProperty({ enum: TipoFotoConsulta, description: 'Tipo da foto' })
  @IsEnum(TipoFotoConsulta, { message: 'tipo deve ser ANTES, DEPOIS, DURANTE ou REFERENCIA' })
  tipo: TipoFotoConsulta;

  @ApiPropertyOptional({ description: 'Descrição da foto / contexto clínico' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Descrição máxima de 200 caracteres' })
  descricao?: string;

  @ApiPropertyOptional({ description: 'Data da consulta (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataConsulta?: string;
}

export class UpdateAnotacoesDto {
  @ApiProperty({ type: [AnotacaoDto], description: 'Lista de anotações/marcações na foto' })
  anotacoes: AnotacaoDto[];
}

export class ConsultaFotoResponseDto {
  id: string;
  pacienteId: string;
  prontuarioId: string | null;
  tipo: TipoFotoConsulta;
  fotoUrl: string;
  descricao: string | null;
  anotacoes: AnotacaoDto[];
  dataConsulta: string | null;
  createdAt: Date;
  updatedAt: Date;
}
