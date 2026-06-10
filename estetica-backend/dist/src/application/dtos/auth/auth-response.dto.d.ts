import { UserRole } from '../../../domain/entities/user-role.enum';
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        nome: string;
        role: UserRole;
        clinicaId: string | null;
    };
}
