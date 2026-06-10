import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AgendamentoStatus } from '../../../domain/entities/agendamento-status.enum';

export class ListAgendamentosDto {
  @ApiPropertyOptional({ description: 'Filtrar por data (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  data?: string;

  @ApiPropertyOptional({ description: 'Data inicial do intervalo' })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Data final do intervalo' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  profissionalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  pacienteId?: string;

  @ApiPropertyOptional({ enum: AgendamentoStatus })
  @IsOptional()
  @IsEnum(AgendamentoStatus)
  status?: AgendamentoStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;
}
