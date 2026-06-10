import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@clinica.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'Senha@123' })
  @IsString({ message: 'Senha obrigatória' })
  @MinLength(1, { message: 'Senha obrigatória' })
  @MaxLength(100)
  password: string;
}
