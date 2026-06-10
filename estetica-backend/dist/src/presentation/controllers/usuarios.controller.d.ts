import { UsuariosService } from '../../application/use-cases/usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto } from '../../application/dtos/usuarios/usuario.dto';
export declare class UsuariosController {
    private readonly service;
    constructor(service: UsuariosService);
    listar(page?: number, limit?: number, busca?: string): Promise<{
        data: UsuarioResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    buscarPorId(id: string): Promise<UsuarioResponseDto>;
    criar(dto: CreateUsuarioDto): Promise<UsuarioResponseDto>;
    atualizar(id: string, dto: UpdateUsuarioDto): Promise<UsuarioResponseDto>;
    desativar(id: string): Promise<void>;
}
