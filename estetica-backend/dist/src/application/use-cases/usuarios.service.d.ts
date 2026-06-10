import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto } from '../dtos/usuarios/usuario.dto';
export declare class UsuariosService {
    private readonly repo;
    constructor(repo: Repository<User>);
    listar(params: {
        page: number;
        limit: number;
        busca?: string;
    }): Promise<{
        data: UsuarioResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    buscarPorId(id: string): Promise<UsuarioResponseDto>;
    criar(dto: CreateUsuarioDto): Promise<UsuarioResponseDto>;
    atualizar(id: string, dto: UpdateUsuarioDto): Promise<UsuarioResponseDto>;
    desativar(id: string): Promise<void>;
    private toResponse;
}
