import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProntuarioDto {
  @ApiPropertyOptional({ description: 'Histórico médico (será criptografado)' })
  @IsOptional()
  @IsString()
  historicoMedico?: string;

  @ApiPropertyOptional({ description: 'Alergias (será criptografado)' })
  @IsOptional()
  @IsString()
  alergias?: string;

  @ApiPropertyOptional({ description: 'Medicamentos em uso (será criptografado)' })
  @IsOptional()
  @IsString()
  medicamentosUso?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacoes?: string;
}
