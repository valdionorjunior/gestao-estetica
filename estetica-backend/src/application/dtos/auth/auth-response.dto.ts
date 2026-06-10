import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/entities/user-role.enum';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    nome: string;
    role: UserRole;
    clinicaId: string | null;
  };
}
