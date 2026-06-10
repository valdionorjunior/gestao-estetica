import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContaTipo, ContaStatus, FormaPagamento } from '../../../domain/entities/financeiro.enums';

export class CreateContaDto {
  @ApiProperty({ enum: ContaTipo })
  @IsEnum(ContaTipo)
  tipo: ContaTipo;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  descricao: string;

  @ApiProperty()
  @Type(() => Number)
  @Min(0)
  valor: number;

  @ApiProperty({ example: '2025-08-31' })
  @IsDateString()
  dataVencimento: string;

  @ApiPropertyOptional({ example: '2025-08-10' })
  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @ApiPropertyOptional({ enum: ContaStatus })
  @IsOptional()
  @IsEnum(ContaStatus)
  status?: ContaStatus;

  @ApiPropertyOptional({ enum: FormaPagamento })
  @IsOptional()
  @IsEnum(FormaPagamento)
  formaPagamento?: FormaPagamento;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  pacienteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  agendamentoId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class ListContasDto {
  @ApiPropertyOptional({ enum: ContaTipo })
  @IsOptional()
  @IsEnum(ContaTipo)
  tipo?: ContaTipo;

  @ApiPropertyOptional({ enum: ContaStatus })
  @IsOptional()
  @IsEnum(ContaStatus)
  status?: ContaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 30;
}

export class DashboardFinanceiroDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataFim?: string;
}
