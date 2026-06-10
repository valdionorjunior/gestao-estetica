import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({ message: 'Refresh token obrigatório' })
  @MinLength(1)
  refreshToken: string;
}
