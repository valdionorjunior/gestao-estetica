import {
  IsBoolean,
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

export class CreateUsuarioDto {
  @ApiProperty({ example: 'medico@clinica.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8, description: 'Senha temporária — exigir troca no primeiro login' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha muito longa' })
  password: string;

  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ enum: UserRole, description: 'Role do usuário no sistema' })
  @IsEnum(UserRole, { message: 'Role inválida' })
  role: UserRole;

  @ApiPropertyOptional({ description: 'UUID da clínica (opcional para multi-clínica)' })
  @IsOptional()
  @IsUUID('4', { message: 'clinicaId deve ser um UUID válido' })
  clinicaId?: string;
}

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Dr. João Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role inválida' })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Ativar ou desativar conta' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UsuarioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  ativo: boolean;

  @ApiPropertyOptional()
  clinicaId?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  ultimoLogin?: Date | null;
}
