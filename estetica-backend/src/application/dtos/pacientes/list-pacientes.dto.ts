import {
  IsBoolean,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListPacientesDto {
  @ApiPropertyOptional({ description: 'Busca por nome ou e-mail' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  ativo?: boolean;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ['nome', 'createdAt'], default: 'nome' })
  @IsOptional()
  @IsIn(['nome', 'createdAt'])
  orderBy?: 'nome' | 'createdAt' = 'nome';
}
