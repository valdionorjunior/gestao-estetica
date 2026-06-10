import { UserRole } from './user-role.enum';
export declare class User {
    id: string;
    clinicaId: string | null;
    email: string;
    passwordHash: string;
    nome: string;
    role: UserRole;
    ativo: boolean;
    refreshTokenHash: string | null;
    ultimoLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
