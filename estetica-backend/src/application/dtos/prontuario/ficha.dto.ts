import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FichaStatus } from '../../../domain/entities/ficha-atendimento.entity';

export class CreateFichaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  titulo: string;

  @ApiPropertyOptional({ description: 'Conteúdo da ficha (será criptografado)' })
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  agendamentoId?: string;
}

export class UpdateFichaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiPropertyOptional({ enum: FichaStatus })
  @IsOptional()
  @IsEnum(FichaStatus)
  status?: FichaStatus;
}
