import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../domain/entities/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'admin@clinica.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha muito longa' })
  password: string;

  @ApiPropertyOptional({ example: 'Maria Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.RECEPCIONISTA })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role inválida' })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'UUID da clínica' })
  @IsOptional()
  @IsUUID('4', { message: 'clinicaId deve ser um UUID válido' })
  clinicaId?: string;
}
