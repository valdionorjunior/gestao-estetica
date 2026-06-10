import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ProntuarioRepository } from '../../infrastructure/repositories/prontuario.repository';
import { UpdateProntuarioDto } from '../dtos/prontuario/update-prontuario.dto';
import { CreateFichaDto, UpdateFichaDto } from '../dtos/prontuario/ficha.dto';
import { FichaStatus } from '../../domain/entities/ficha-atendimento.entity';

const CIPHER = 'aes-256-gcm';

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(12);
  const keyBuffer = Buffer.from(key, 'hex');
  const cipher = crypto.createCipheriv(CIPHER, keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decrypt(encoded: string, key: string): string {
  try {
    const buf = Buffer.from(encoded, 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const content = buf.subarray(28);
    const keyBuffer = Buffer.from(key, 'hex');
    const decipher = crypto.createDecipheriv(CIPHER, keyBuffer, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

@Injectable()
export class ProntuarioService {
  private readonly encryptKey: string;

  constructor(private readonly prontuarioRepository: ProntuarioRepository) {
    this.encryptKey = process.env.ENCRYPTION_KEY ?? '0'.repeat(64);
  }

  async getOrCreateByPacienteId(pacienteId: string, clinicaId: string | null) {
    let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
    if (!prontuario) {
      prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
    }
    return this.decryptProntuario(prontuario);
  }

  async update(pacienteId: string, dto: UpdateProntuarioDto, clinicaId: string | null) {
    let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
    if (!prontuario) {
      prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
    }

    const updateData: any = {};
    if (dto.historicoMedico !== undefined)
      updateData.historicoMedicoEncrypted = dto.historicoMedico
        ? encrypt(dto.historicoMedico, this.encryptKey)
        : null;
    if (dto.alergias !== undefined)
      updateData.alergiasEncrypted = dto.alergias
        ? encrypt(dto.alergias, this.encryptKey)
        : null;
    if (dto.medicamentosUso !== undefined)
      updateData.medicamentosUsoEncrypted = dto.medicamentosUso
        ? encrypt(dto.medicamentosUso, this.encryptKey)
        : null;
    if (dto.observacoes !== undefined) updateData.observacoes = dto.observacoes;

    await this.prontuarioRepository.updateProntuario(prontuario.id, updateData);
    const updated = await this.prontuarioRepository.findByPacienteId(pacienteId);
    return this.decryptProntuario(updated!);
  }

  async listFichas(pacienteId: string) {
    const prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
    if (!prontuario) return [];
    return this.prontuarioRepository.listFichas(prontuario.id);
  }

  async createFicha(
    pacienteId: string,
    dto: CreateFichaDto,
    profissionalId: string,
    clinicaId: string | null,
  ) {
    let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
    if (!prontuario) {
      prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
    }

    const conteudoEncrypted = dto.conteudo
      ? encrypt(dto.conteudo, this.encryptKey)
      : null;

    return this.prontuarioRepository.createFicha({
      prontuarioId: prontuario.id,
      titulo: dto.titulo,
      conteudoEncrypted,
      agendamentoId: dto.agendamentoId ?? null,
      profissionalId,
    });
  }

  async updateFicha(fichaId: string, dto: UpdateFichaDto, profissionalId: string) {
    const ficha = await this.prontuarioRepository.findFichaById(fichaId);
    if (!ficha) throw new NotFoundException('Ficha não encontrada');
    if (ficha.status === FichaStatus.FECHADA) {
      throw new ForbiddenException('Ficha fechada não pode ser editada');
    }

    const updateData: any = {};
    if (dto.titulo) updateData.titulo = dto.titulo;
    if (dto.conteudo !== undefined)
      updateData.conteudoEncrypted = dto.conteudo
        ? encrypt(dto.conteudo, this.encryptKey)
        : null;
    if (dto.status) {
      updateData.status = dto.status;
      if (dto.status === FichaStatus.FECHADA) updateData.fechadaEm = new Date();
    }

    await this.prontuarioRepository.updateFicha(fichaId, updateData);
    return this.prontuarioRepository.findFichaById(fichaId);
  }

  private decryptProntuario(p: typeof this.prontuarioRepository extends { findByPacienteId: (...args: any) => Promise<infer R> } ? NonNullable<R> : any) {
    return {
      ...p,
      historicoMedico: p.historicoMedicoEncrypted
        ? decrypt(p.historicoMedicoEncrypted, this.encryptKey)
        : null,
      alergias: p.alergiasEncrypted
        ? decrypt(p.alergiasEncrypted, this.encryptKey)
        : null,
      medicamentosUso: p.medicamentosUsoEncrypted
        ? decrypt(p.medicamentosUsoEncrypted, this.encryptKey)
        : null,
      historicoMedicoEncrypted: undefined,
      alergiasEncrypted: undefined,
      medicamentosUsoEncrypted: undefined,
    };
  }
}
