import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PacienteRepository } from '../../infrastructure/repositories/paciente.repository';
import { CreatePacienteDto } from '../dtos/pacientes/create-paciente.dto';
import { UpdatePacienteDto } from '../dtos/pacientes/update-paciente.dto';
import { ListPacientesDto } from '../dtos/pacientes/list-pacientes.dto';
import { Paciente } from '../../domain/entities/paciente.entity';

const CIPHER = 'aes-256-gcm';

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(12);
  const keyBuffer = Buffer.from(key, 'hex');
  const cipher = crypto.createCipheriv(CIPHER, keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

@Injectable()
export class PacientesService {
  private readonly encryptKey: string;

  constructor(private readonly pacienteRepository: PacienteRepository) {
    // Chave AES-256 em hex (32 bytes = 64 chars hex) — vem do .env
    this.encryptKey = process.env.ENCRYPTION_KEY ?? '0'.repeat(64);
  }

  async list(clinicaId: string | null, filters: ListPacientesDto) {
    const { data, total } = await this.pacienteRepository.list(clinicaId, filters);
    const { page = 1, limit = 20 } = filters;
    return {
      data: data.map((p) => this.sanitize(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  async create(dto: CreatePacienteDto, clinicaId: string | null): Promise<Paciente> {
    const cpfEncrypted = dto.cpf ? encrypt(dto.cpf, this.encryptKey) : null;
    return this.pacienteRepository.create({
      nome: dto.nome,
      cpfEncrypted,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
      telefone: dto.telefone ?? null,
      email: dto.email ?? null,
      endereco: dto.endereco ?? null,
      cidade: dto.cidade ?? null,
      estado: dto.estado ?? null,
      cep: dto.cep ?? null,
      clinicaId,
    });
  }

  async update(id: string, dto: UpdatePacienteDto): Promise<Paciente> {
    const existing = await this.findOne(id);
    const cpfEncrypted = dto.cpf ? encrypt(dto.cpf, this.encryptKey) : existing.cpfEncrypted;

    await this.pacienteRepository.update(id, {
      ...(dto.nome && { nome: dto.nome }),
      cpfEncrypted,
      ...(dto.dataNascimento && { dataNascimento: new Date(dto.dataNascimento) }),
      ...(dto.telefone !== undefined && { telefone: dto.telefone }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.endereco !== undefined && { endereco: dto.endereco }),
      ...(dto.cidade !== undefined && { cidade: dto.cidade }),
      ...(dto.estado !== undefined && { estado: dto.estado }),
      ...(dto.cep !== undefined && { cep: dto.cep }),
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.pacienteRepository.softDelete(id);
  }

  private sanitize(p: Paciente): Omit<Paciente, 'cpfEncrypted'> & { cpfMasked: string | null } {
    const { cpfEncrypted, ...rest } = p;
    return { ...rest, cpfMasked: cpfEncrypted ? '***.***.***-**' : null };
  }
}
