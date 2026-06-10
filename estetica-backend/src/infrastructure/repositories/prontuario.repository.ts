import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prontuario } from '../../domain/entities/prontuario.entity';
import { FichaAtendimento } from '../../domain/entities/ficha-atendimento.entity';

@Injectable()
export class ProntuarioRepository {
  constructor(
    @InjectRepository(Prontuario)
    private readonly prontuarioRepo: Repository<Prontuario>,
    @InjectRepository(FichaAtendimento)
    private readonly fichaRepo: Repository<FichaAtendimento>,
  ) {}

  async findByPacienteId(pacienteId: string): Promise<Prontuario | null> {
    return this.prontuarioRepo.findOne({
      where: { pacienteId },
      relations: ['paciente'],
    });
  }

  async findById(id: string): Promise<Prontuario | null> {
    return this.prontuarioRepo.findOne({ where: { id }, relations: ['paciente'] });
  }

  async createProntuario(data: Partial<Prontuario>): Promise<Prontuario> {
    const p = this.prontuarioRepo.create(data);
    return this.prontuarioRepo.save(p);
  }

  async updateProntuario(id: string, data: Partial<Prontuario>): Promise<void> {
    await this.prontuarioRepo.update(id, data);
  }

  // Fichas
  async listFichas(prontuarioId: string): Promise<FichaAtendimento[]> {
    return this.fichaRepo.find({
      where: { prontuarioId },
      order: { createdAt: 'DESC' },
    });
  }

  async findFichaById(id: string): Promise<FichaAtendimento | null> {
    return this.fichaRepo.findOne({ where: { id } });
  }

  async createFicha(data: Partial<FichaAtendimento>): Promise<FichaAtendimento> {
    const f = this.fichaRepo.create(data);
    return this.fichaRepo.save(f);
  }

  async updateFicha(id: string, data: Partial<FichaAtendimento>): Promise<void> {
    await this.fichaRepo.update(id, data);
  }
}
