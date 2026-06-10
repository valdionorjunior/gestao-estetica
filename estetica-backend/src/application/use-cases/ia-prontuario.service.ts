import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormDataNode = require('form-data') as typeof import('form-data');
import {
  IaConsultaLog,
  IaOperacao,
  IaStatus,
} from '../../domain/entities/ia-consulta-log.entity';

// ─── Interfaces de resultado ──────────────────────────────────────────────────

export interface ResultadoTranscricao {
  transcricao: string;
  duracao?: number;
  idioma?: string;
  simulado: boolean;
  logId: string;
}

export interface ResultadoResumo {
  resumo: string;
  topicos: string[];
  proximasAcoes: string[];
  simulado: boolean;
  logId: string;
}

export interface ResultadoHipotese {
  hipoteses: Array<{
    condicao: string;
    probabilidade: 'ALTA' | 'MEDIA' | 'BAIXA';
    descricao: string;
  }>;
  procedimentosSugeridos: string[];
  observacoesClinicas: string;
  simulado: boolean;
  logId: string;
}

// ─── Respostas simuladas ──────────────────────────────────────────────────────

const TRANSCRICAO_SIMULADA =
  'Paciente relata dor no local do procedimento realizado há 3 dias. ' +
  'Sem febre, sem sinais de infecção. Recomendada aplicação de compressa fria ' +
  'e retorno em 7 dias para avaliação. Prescrição de analgésico se necessário.';

const RESUMO_SIMULADO: Omit<ResultadoResumo, 'simulado' | 'logId'> = {
  resumo:
    'Consulta de retorno pós-procedimento. Paciente evoluindo bem sem intercorrências. ' +
    'Orientações de cuidados domiciliares fornecidas.',
  topicos: [
    'Avaliação pós-procedimento',
    'Queixa de desconforto local leve',
    'Ausência de sinais infecciosos',
    'Orientações de cuidados domiciliares',
  ],
  proximasAcoes: [
    'Retorno em 7 dias',
    'Aplicar compressa fria 3x/dia',
    'Analgésico se dor persistir',
    'Fotografar área para acompanhamento de evolução',
  ],
};

const HIPOTESE_SIMULADA: Omit<ResultadoHipotese, 'simulado' | 'logId'> = {
  hipoteses: [
    {
      condicao: 'Eritema pós-procedimento',
      probabilidade: 'ALTA',
      descricao:
        'Reação inflamatória esperada após procedimento estético. Normalmente resolve em 48–72h.',
    },
    {
      condicao: 'Edema transitório',
      probabilidade: 'ALTA',
      descricao:
        'Acúmulo temporário de fluído na região tratada. Sem necessidade de intervenção imediata.',
    },
    {
      condicao: 'Reação alérgica leve',
      probabilidade: 'BAIXA',
      descricao:
        'Hipersensibilidade ao produto utilizado. Investigar histórico de alergias e monitorar.',
    },
  ],
  procedimentosSugeridos: [
    'Laserterapia de baixa intensidade (redução de inflamação)',
    'Microagulhamento (estimular colágeno pós-cicatrização)',
    'Hidratação profunda com vitamina C',
  ],
  observacoesClinicas:
    'Paciente sem histórico de alergias conhecidas. Monitorar por 48h. ' +
    'Retornar imediatamente em caso de aumento de temperatura local ou prurido intenso.',
};

// ─── Serviço ──────────────────────────────────────────────────────────────────

@Injectable()
export class IaProntuarioService {
  private readonly logger = new Logger(IaProntuarioService.name);
  private readonly MODELO_CHAT = 'gpt-4o-mini';
  private readonly MODELO_AUDIO = 'whisper-1';

  constructor(
    @InjectRepository(IaConsultaLog)
    private readonly repo: Repository<IaConsultaLog>,
    private readonly config: ConfigService,
  ) {}

  // ─── Transcrição de áudio (Whisper) ─────────────────────────────────────────

  async transcreverAudio(params: {
    audioPath: string;
    audioNome: string;
    pacienteId?: string;
    prontuarioId?: string;
    profissionalId?: string;
  }): Promise<ResultadoTranscricao> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    let resultado = '';
    let status = IaStatus.SUCESSO;
    let modelo = this.MODELO_AUDIO;
    let tokens = 0;

    try {
      if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');

      const formData = new FormDataNode();
      formData.append('file', fs.createReadStream(params.audioPath), {
        filename: params.audioNome,
        contentType: 'audio/mpeg',
      });
      formData.append('model', this.MODELO_AUDIO);
      formData.append('language', 'pt');
      formData.append('response_format', 'verbose_json');

      const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData as unknown as BodyInit,
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Whisper API: ${resp.status} — ${err}`);
      }

      const data = (await resp.json()) as {
        text: string;
        duration?: number;
        language?: string;
      };
      resultado = data.text;
      this.logger.log(`Transcrição concluída: ${resultado.length} chars`);

      // Limpar arquivo temporário
      fs.unlink(params.audioPath, () => {});

      const log = await this.salvarLog({
        operacao: IaOperacao.TRANSCRICAO_AUDIO,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.audioNome,
        resultado,
        tokensUtilizados: tokens,
        modeloIa: modelo,
      });

      return { transcricao: resultado, simulado: false, logId: log.id };
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('não configurada') || msg.includes('not configured')) {
        status = IaStatus.SIMULADO;
        resultado = TRANSCRICAO_SIMULADA;
        modelo = 'SIMULADO';
        this.logger.warn('Transcrição SIMULADA — OpenAI não configurada');
      } else {
        status = IaStatus.FALHOU;
        resultado = '';
        this.logger.error(`Transcrição FALHOU: ${msg}`);
      }

      // Limpar arquivo temporário mesmo em caso de erro
      fs.unlink(params.audioPath, () => {});

      const log = await this.salvarLog({
        operacao: IaOperacao.TRANSCRICAO_AUDIO,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.audioNome,
        resultado: status === IaStatus.SIMULADO ? resultado : msg,
        tokensUtilizados: tokens,
        modeloIa: modelo,
      });

      if (status === IaStatus.FALHOU) {
        throw new Error(`Erro na transcrição: ${msg}`);
      }
      return { transcricao: resultado, simulado: true, logId: log.id };
    }
  }

  // ─── Resumo da consulta (GPT) ─────────────────────────────────────────────────

  async resumirConsulta(params: {
    texto: string;
    pacienteId?: string;
    prontuarioId?: string;
    profissionalId?: string;
  }): Promise<ResultadoResumo> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    let status = IaStatus.SUCESSO;
    let modelo = this.MODELO_CHAT;
    let tokens = 0;

    try {
      if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');
      if (!params.texto?.trim()) throw new Error('Texto para resumo não pode ser vazio');

      const prompt = `Você é um assistente clínico para uma clínica de estética médica.
Analise as notas da consulta abaixo e gere um resumo estruturado em JSON com os campos:
- "resumo": string com resumo em 2-3 frases
- "topicos": array de strings com os principais tópicos abordados
- "proximasAcoes": array de strings com as próximas ações a serem tomadas

Notas da consulta:
${params.texto}

Responda APENAS com JSON válido, sem markdown ou explicações extras.`;

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODELO_CHAT,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: 'json_object' },
        }),
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`OpenAI API: ${resp.status} — ${err}`);
      }

      const data = (await resp.json()) as {
        choices: Array<{ message: { content: string } }>;
        usage?: { total_tokens: number };
      };

      tokens = data.usage?.total_tokens ?? 0;
      const conteudo = data.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(conteudo) as Omit<ResultadoResumo, 'simulado' | 'logId'>;

      const log = await this.salvarLog({
        operacao: IaOperacao.RESUMO_CONSULTA,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.texto.substring(0, 500),
        resultado: conteudo,
        tokensUtilizados: tokens,
        modeloIa: modelo,
      });

      return { ...parsed, simulado: false, logId: log.id };
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('não configurada')) {
        status = IaStatus.SIMULADO;
        modelo = 'SIMULADO';
        this.logger.warn('Resumo SIMULADO — OpenAI não configurada');
        const log = await this.salvarLog({
          operacao: IaOperacao.RESUMO_CONSULTA,
          status,
          pacienteId: params.pacienteId,
          prontuarioId: params.prontuarioId,
          profissionalId: params.profissionalId,
          entrada: params.texto.substring(0, 500),
          resultado: JSON.stringify(RESUMO_SIMULADO),
          tokensUtilizados: 0,
          modeloIa: modelo,
        });
        return { ...RESUMO_SIMULADO, simulado: true, logId: log.id };
      }
      status = IaStatus.FALHOU;
      this.logger.error(`Resumo FALHOU: ${msg}`);
      const log = await this.salvarLog({
        operacao: IaOperacao.RESUMO_CONSULTA,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.texto.substring(0, 500),
        resultado: msg,
        tokensUtilizados: 0,
        modeloIa: modelo,
      });
      void log;
      throw new Error(`Erro ao gerar resumo: ${msg}`);
    }
  }

  // ─── Hipótese diagnóstica (GPT) ───────────────────────────────────────────────

  async sugerirHipotese(params: {
    queixas: string;
    historicoRelevante?: string;
    pacienteId?: string;
    prontuarioId?: string;
    profissionalId?: string;
  }): Promise<ResultadoHipotese> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    let status = IaStatus.SUCESSO;
    let modelo = this.MODELO_CHAT;
    let tokens = 0;

    try {
      if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');
      if (!params.queixas?.trim()) throw new Error('Queixas não podem ser vazias');

      const historico = params.historicoRelevante
        ? `\nHistórico relevante: ${params.historicoRelevante}`
        : '';

      const prompt = `Você é um assistente clínico especializado em medicina estética.
Com base nas queixas e histórico do paciente, sugira hipóteses diagnósticas em JSON com os campos:
- "hipoteses": array de objetos com { "condicao": string, "probabilidade": "ALTA"|"MEDIA"|"BAIXA", "descricao": string }
- "procedimentosSugeridos": array de strings com procedimentos estéticos recomendados
- "observacoesClinicas": string com observações importantes para o profissional

Queixas: ${params.queixas}${historico}

IMPORTANTE: 
- Estas são sugestões de apoio clínico, não diagnóstico definitivo
- Máximo de 4 hipóteses e 4 procedimentos
- Responda APENAS com JSON válido, sem markdown`;

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODELO_CHAT,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        }),
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`OpenAI API: ${resp.status} — ${err}`);
      }

      const data = (await resp.json()) as {
        choices: Array<{ message: { content: string } }>;
        usage?: { total_tokens: number };
      };

      tokens = data.usage?.total_tokens ?? 0;
      const conteudo = data.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(conteudo) as Omit<ResultadoHipotese, 'simulado' | 'logId'>;

      const log = await this.salvarLog({
        operacao: IaOperacao.HIPOTESE_DIAGNOSTICA,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.queixas.substring(0, 500),
        resultado: conteudo,
        tokensUtilizados: tokens,
        modeloIa: modelo,
      });

      return { ...parsed, simulado: false, logId: log.id };
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('não configurada')) {
        status = IaStatus.SIMULADO;
        modelo = 'SIMULADO';
        this.logger.warn('Hipótese SIMULADA — OpenAI não configurada');
        const log = await this.salvarLog({
          operacao: IaOperacao.HIPOTESE_DIAGNOSTICA,
          status,
          pacienteId: params.pacienteId,
          prontuarioId: params.prontuarioId,
          profissionalId: params.profissionalId,
          entrada: params.queixas.substring(0, 500),
          resultado: JSON.stringify(HIPOTESE_SIMULADA),
          tokensUtilizados: 0,
          modeloIa: modelo,
        });
        return { ...HIPOTESE_SIMULADA, simulado: true, logId: log.id };
      }
      status = IaStatus.FALHOU;
      this.logger.error(`Hipótese FALHOU: ${msg}`);
      const log = await this.salvarLog({
        operacao: IaOperacao.HIPOTESE_DIAGNOSTICA,
        status,
        pacienteId: params.pacienteId,
        prontuarioId: params.prontuarioId,
        profissionalId: params.profissionalId,
        entrada: params.queixas.substring(0, 500),
        resultado: msg,
        tokensUtilizados: 0,
        modeloIa: modelo,
      });
      void log;
      throw new Error(`Erro ao gerar hipótese: ${msg}`);
    }
  }

  // ─── Listar logs de IA ────────────────────────────────────────────────────────

  async listarLogs(params: {
    pacienteId?: string;
    operacao?: IaOperacao;
    page?: number;
    limit?: number;
  }): Promise<{ data: IaConsultaLog[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, params.limit ?? 20);
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('l')
      .orderBy('l.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (params.pacienteId) {
      qb.andWhere('l.pacienteId = :pacienteId', { pacienteId: params.pacienteId });
    }
    if (params.operacao) {
      qb.andWhere('l.operacao = :operacao', { operacao: params.operacao });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  // ─── Status de configuração ─────────────────────────────────────────────────

  statusConfig(): { openAiConfigurado: boolean; modelo: string } {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    return {
      openAiConfigurado: !!apiKey,
      modelo: apiKey ? this.MODELO_CHAT : 'SIMULADO',
    };
  }

  // ─── Helper ────────────────────────────────────────────────────────────────────

  private async salvarLog(data: {
    operacao: IaOperacao;
    status: IaStatus;
    pacienteId?: string;
    prontuarioId?: string;
    profissionalId?: string;
    entrada?: string;
    resultado?: string;
    tokensUtilizados?: number;
    modeloIa?: string;
  }): Promise<IaConsultaLog> {
    const log = this.repo.create({
      operacao: data.operacao,
      status: data.status,
      pacienteId: data.pacienteId ?? null,
      prontuarioId: data.prontuarioId ?? null,
      profissionalId: data.profissionalId ?? null,
      entrada: data.entrada ?? null,
      resultado: data.resultado ?? null,
      tokensUtilizados: data.tokensUtilizados ?? 0,
      modeloIa: data.modeloIa ?? null,
    });
    return this.repo.save(log);
  }
}
