import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAgendamentoDto {
  @ApiProperty()
  @IsUUID('4')
  pacienteId: string;

  @ApiProperty()
  @IsUUID('4')
  profissionalId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  procedimentoId?: string;

  @ApiProperty({ example: '2025-08-10T09:00:00-03:00' })
  @IsDateString({}, { message: 'Data/hora de início inválida' })
  dataHoraInicio: string;

  @ApiProperty({ example: '2025-08-10T10:00:00-03:00' })
  @IsDateString({}, { message: 'Data/hora de fim inválida' })
  dataHoraFim: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;

  @ApiPropertyOptional({ description: 'Valor em R$' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor inválido' })
  @Min(0)
  valor?: number;
}
