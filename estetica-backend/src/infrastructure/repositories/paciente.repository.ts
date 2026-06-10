import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Paciente } from '../../domain/entities/paciente.entity';
import { ListPacientesDto } from '../../application/dtos/pacientes/list-pacientes.dto';

@Injectable()
export class PacienteRepository {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  async findById(id: string): Promise<Paciente | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Paciente | null> {
    return this.repo.findOne({ where: { email } });
  }

  async list(
    clinicaId: string | null,
    filters: ListPacientesDto,
  ): Promise<{ data: Paciente[]; total: number }> {
    const { search, ativo, page = 1, limit = 20, orderBy = 'nome' } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (clinicaId) where.clinicaId = clinicaId;
    if (ativo !== undefined) where.ativo = ativo;
    if (search) {
      where.nome = ILike(`%${search}%`);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { [orderBy]: 'ASC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async create(data: Partial<Paciente>): Promise<Paciente> {
    const paciente = this.repo.create(data);
    return this.repo.save(paciente);
  }

  async update(id: string, data: Partial<Paciente>): Promise<void> {
    await this.repo.update(id, data);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { ativo: false });
  }
}
