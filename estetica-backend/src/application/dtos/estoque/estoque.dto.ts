import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovimentacaoTipo } from '../../../domain/entities/movimentacao-tipo.enum';

export class CreateProdutoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ default: 'UN' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidade?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  estoqueMinimo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  precoCusto?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  categoriaId?: string;
}

export class MovimentarEstoqueDto {
  @ApiProperty({ enum: MovimentacaoTipo })
  @IsEnum(MovimentacaoTipo)
  tipo: MovimentacaoTipo;

  @ApiProperty({ minimum: 0.001 })
  @Type(() => Number)
  @Min(0.001)
  quantidade: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  motivo?: string;
}

export class ListProdutosDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'true = apenas abaixo do estoque mínimo' })
  @IsOptional()
  @Type(() => Boolean)
  abaixoMinimo?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 30;
}
