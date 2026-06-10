import { UserRole } from '../../../domain/entities/user-role.enum';
export declare class CreateUsuarioDto {
    email: string;
    password: string;
    nome: string;
    role: UserRole;
    clinicaId?: string;
}
export declare class UpdateUsuarioDto {
    nome?: string;
    role?: UserRole;
    ativo?: boolean;
}
export declare class UsuarioResponseDto {
    id: string;
    email: string;
    nome: string;
    role: UserRole;
    ativo: boolean;
    clinicaId?: string | null;
    createdAt: Date;
    ultimoLogin?: Date | null;
}
