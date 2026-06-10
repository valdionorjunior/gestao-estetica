import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto } from '../dtos/usuarios/usuario.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async listar(params: {
    page: number;
    limit: number;
    busca?: string;
  }): Promise<{ data: UsuarioResponseDto[]; total: number; page: number; limit: number }> {
    const { page, limit, busca } = params;
    const where = busca
      ? [{ nome: ILike(`%${busca}%`) }, { email: ILike(`%${busca}%`) }]
      : {};

    const [users, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map(this.toResponse),
      total,
      page,
      limit,
    };
  }

  async buscarPorId(id: string): Promise<UsuarioResponseDto> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.toResponse(user);
  }

  async criar(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const existente = await this.repo.findOne({ where: { email: dto.email } });
    if (existente) throw new ConflictException('E-mail já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = this.repo.create({
      email: dto.email,
      passwordHash,
      nome: dto.nome,
      role: dto.role,
      clinicaId: dto.clinicaId ?? undefined,
      ativo: true,
    });
    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  async atualizar(id: string, dto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.nome !== undefined) user.nome = dto.nome;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.ativo !== undefined) user.ativo = dto.ativo;

    const saved = await this.repo.save(user);
    return this.toResponse(saved);
  }

  async desativar(id: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.repo.update(id, { ativo: false });
  }

  private toResponse(user: User): UsuarioResponseDto {
    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      ativo: user.ativo,
      clinicaId: user.clinicaId,
      createdAt: user.createdAt,
      ultimoLogin: user.ultimoLogin,
    };
  }
}
