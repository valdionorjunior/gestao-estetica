import { UserRole } from '../../../domain/entities/user-role.enum';
export declare class RegisterDto {
    email: string;
    password: string;
    nome?: string;
    role?: UserRole;
    clinicaId?: string;
}
