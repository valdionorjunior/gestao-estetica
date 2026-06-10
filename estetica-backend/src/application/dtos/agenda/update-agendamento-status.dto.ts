import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AgendamentoStatus } from '../../../domain/entities/agendamento-status.enum';

export class UpdateAgendamentoStatusDto {
  @ApiPropertyOptional({ enum: AgendamentoStatus })
  @IsEnum(AgendamentoStatus)
  status: AgendamentoStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  motivoCancelamento?: string;
}
