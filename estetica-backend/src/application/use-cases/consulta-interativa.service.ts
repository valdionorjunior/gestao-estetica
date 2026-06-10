import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaFoto, TipoFotoConsulta } from '../../domain/entities/consulta-foto.entity';
import {
  AnotacaoDto,
  ConsultaFotoResponseDto,
  CreateConsultaFotoDto,
} from '../dtos/consulta/consulta-foto.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ConsultaInterativaService {
  constructor(
    @InjectRepository(ConsultaFoto)
    private readonly repo: Repository<ConsultaFoto>,
  ) {}

  // ─── Salvar upload ──────────────────────────────────────────────────────────

  async criarFoto(
    dto: CreateConsultaFotoDto,
    arquivo: Express.Multer.File | undefined,
    baseUrl: string,
  ): Promise<ConsultaFotoResponseDto> {
    if (!arquivo) {
      throw new BadRequestException('Arquivo de imagem é obrigatório');
    }

    const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(arquivo.originalname).toLowerCase();
    if (!extensoesPermitidas.includes(ext)) {
      throw new BadRequestException('Formato de imagem inválido. Use JPG, PNG ou WebP');
    }

    const fotoUrl = `${baseUrl}/uploads/${arquivo.filename}`;

    const foto = this.repo.create({
      pacienteId: dto.pacienteId,
      prontuarioId: dto.prontuarioId ?? null,
      profissionalId: dto.profissionalId ?? null,
      tipo: dto.tipo,
      descricao: dto.descricao ?? null,
      fotoUrl,
      dataConsulta: dto.dataConsulta ? (new Date(dto.dataConsulta) as Date) : null,
      anotacoesJson: null,
    });

    const salva = await this.repo.save(foto);
    return this.toResponse(salva);
  }

  // ─── Listar fotos do paciente ───────────────────────────────────────────────

  async listarPorPaciente(
    pacienteId: string,
    tipo?: TipoFotoConsulta,
  ): Promise<ConsultaFotoResponseDto[]> {
    const qb = this.repo
      .createQueryBuilder('cf')
      .where('cf.pacienteId = :pacienteId', { pacienteId })
      .orderBy('cf.dataConsulta', 'DESC')
      .addOrderBy('cf.createdAt', 'DESC');

    if (tipo) {
      qb.andWhere('cf.tipo = :tipo', { tipo });
    }

    const fotos = await qb.getMany();
    return fotos.map((f) => this.toResponse(f));
  }

  // ─── Buscar foto por ID ─────────────────────────────────────────────────────

  async buscarPorId(id: string): Promise<ConsultaFotoResponseDto> {
    const foto = await this.repo.findOne({ where: { id } });
    if (!foto) throw new NotFoundException('Foto de consulta não encontrada');
    return this.toResponse(foto);
  }

  // ─── Salvar anotações/marcações ─────────────────────────────────────────────

  async salvarAnotacoes(
    id: string,
    anotacoes: AnotacaoDto[],
  ): Promise<ConsultaFotoResponseDto> {
    const foto = await this.repo.findOne({ where: { id } });
    if (!foto) throw new NotFoundException('Foto de consulta não encontrada');

    foto.anotacoesJson = JSON.stringify(anotacoes);
    const atualizada = await this.repo.save(foto);
    return this.toResponse(atualizada);
  }

  // ─── Remover foto ───────────────────────────────────────────────────────────

  async remover(id: string): Promise<void> {
    const foto = await this.repo.findOne({ where: { id } });
    if (!foto) throw new NotFoundException('Foto de consulta não encontrada');

    // Remove arquivo físico se existir no diretório uploads/
    const filePath = path.join(
      process.cwd(),
      'uploads',
      path.basename(foto.fotoUrl),
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.repo.remove(foto);
  }

  // ─── Helper mapper ──────────────────────────────────────────────────────────

  private toResponse(foto: ConsultaFoto): ConsultaFotoResponseDto {
    let anotacoes: AnotacaoDto[] = [];
    if (foto.anotacoesJson) {
      try {
        anotacoes = JSON.parse(foto.anotacoesJson) as AnotacaoDto[];
      } catch {
        anotacoes = [];
      }
    }
    return {
      id: foto.id,
      pacienteId: foto.pacienteId,
      prontuarioId: foto.prontuarioId,
      tipo: foto.tipo,
      fotoUrl: foto.fotoUrl,
      descricao: foto.descricao,
      anotacoes,
      dataConsulta: foto.dataConsulta
        ? foto.dataConsulta.toISOString().split('T')[0]
        : null,
      createdAt: foto.createdAt,
      updatedAt: foto.updatedAt,
    };
  }
}
