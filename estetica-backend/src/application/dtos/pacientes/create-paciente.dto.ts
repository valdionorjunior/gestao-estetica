import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MaxLength(200)
  nome: string;

  @ApiPropertyOptional({ example: '123.456.789-00', description: 'CPF (será criptografado)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { message: 'CPF inválido' })
  cpf?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  dataNascimento?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  endereco?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 letras (UF)' })
  estado?: string;

  @ApiPropertyOptional({ example: '01310-100' })
  @IsOptional()
  @IsString()
  @MaxLength(9)
  cep?: string;
}
