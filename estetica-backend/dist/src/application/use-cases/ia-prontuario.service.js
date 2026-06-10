"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IaProntuarioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IaProntuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const FormDataNode = require('form-data');
const ia_consulta_log_entity_1 = require("../../domain/entities/ia-consulta-log.entity");
const TRANSCRICAO_SIMULADA = 'Paciente relata dor no local do procedimento realizado há 3 dias. ' +
    'Sem febre, sem sinais de infecção. Recomendada aplicação de compressa fria ' +
    'e retorno em 7 dias para avaliação. Prescrição de analgésico se necessário.';
const RESUMO_SIMULADO = {
    resumo: 'Consulta de retorno pós-procedimento. Paciente evoluindo bem sem intercorrências. ' +
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
const HIPOTESE_SIMULADA = {
    hipoteses: [
        {
            condicao: 'Eritema pós-procedimento',
            probabilidade: 'ALTA',
            descricao: 'Reação inflamatória esperada após procedimento estético. Normalmente resolve em 48–72h.',
        },
        {
            condicao: 'Edema transitório',
            probabilidade: 'ALTA',
            descricao: 'Acúmulo temporário de fluído na região tratada. Sem necessidade de intervenção imediata.',
        },
        {
            condicao: 'Reação alérgica leve',
            probabilidade: 'BAIXA',
            descricao: 'Hipersensibilidade ao produto utilizado. Investigar histórico de alergias e monitorar.',
        },
    ],
    procedimentosSugeridos: [
        'Laserterapia de baixa intensidade (redução de inflamação)',
        'Microagulhamento (estimular colágeno pós-cicatrização)',
        'Hidratação profunda com vitamina C',
    ],
    observacoesClinicas: 'Paciente sem histórico de alergias conhecidas. Monitorar por 48h. ' +
        'Retornar imediatamente em caso de aumento de temperatura local ou prurido intenso.',
};
let IaProntuarioService = IaProntuarioService_1 = class IaProntuarioService {
    repo;
    config;
    logger = new common_1.Logger(IaProntuarioService_1.name);
    MODELO_CHAT = 'gpt-4o-mini';
    MODELO_AUDIO = 'whisper-1';
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    async transcreverAudio(params) {
        const apiKey = this.config.get('OPENAI_API_KEY');
        let resultado = '';
        let status = ia_consulta_log_entity_1.IaStatus.SUCESSO;
        let modelo = this.MODELO_AUDIO;
        let tokens = 0;
        try {
            if (!apiKey)
                throw new Error('OPENAI_API_KEY não configurada');
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
                body: formData,
            });
            if (!resp.ok) {
                const err = await resp.text();
                throw new Error(`Whisper API: ${resp.status} — ${err}`);
            }
            const data = (await resp.json());
            resultado = data.text;
            this.logger.log(`Transcrição concluída: ${resultado.length} chars`);
            fs.unlink(params.audioPath, () => { });
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.TRANSCRICAO_AUDIO,
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
        }
        catch (err) {
            const msg = err.message;
            if (msg.includes('não configurada') || msg.includes('not configured')) {
                status = ia_consulta_log_entity_1.IaStatus.SIMULADO;
                resultado = TRANSCRICAO_SIMULADA;
                modelo = 'SIMULADO';
                this.logger.warn('Transcrição SIMULADA — OpenAI não configurada');
            }
            else {
                status = ia_consulta_log_entity_1.IaStatus.FALHOU;
                resultado = '';
                this.logger.error(`Transcrição FALHOU: ${msg}`);
            }
            fs.unlink(params.audioPath, () => { });
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.TRANSCRICAO_AUDIO,
                status,
                pacienteId: params.pacienteId,
                prontuarioId: params.prontuarioId,
                profissionalId: params.profissionalId,
                entrada: params.audioNome,
                resultado: status === ia_consulta_log_entity_1.IaStatus.SIMULADO ? resultado : msg,
                tokensUtilizados: tokens,
                modeloIa: modelo,
            });
            if (status === ia_consulta_log_entity_1.IaStatus.FALHOU) {
                throw new Error(`Erro na transcrição: ${msg}`);
            }
            return { transcricao: resultado, simulado: true, logId: log.id };
        }
    }
    async resumirConsulta(params) {
        const apiKey = this.config.get('OPENAI_API_KEY');
        let status = ia_consulta_log_entity_1.IaStatus.SUCESSO;
        let modelo = this.MODELO_CHAT;
        let tokens = 0;
        try {
            if (!apiKey)
                throw new Error('OPENAI_API_KEY não configurada');
            if (!params.texto?.trim())
                throw new Error('Texto para resumo não pode ser vazio');
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
            const data = (await resp.json());
            tokens = data.usage?.total_tokens ?? 0;
            const conteudo = data.choices[0]?.message?.content ?? '{}';
            const parsed = JSON.parse(conteudo);
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.RESUMO_CONSULTA,
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
        }
        catch (err) {
            const msg = err.message;
            if (msg.includes('não configurada')) {
                status = ia_consulta_log_entity_1.IaStatus.SIMULADO;
                modelo = 'SIMULADO';
                this.logger.warn('Resumo SIMULADO — OpenAI não configurada');
                const log = await this.salvarLog({
                    operacao: ia_consulta_log_entity_1.IaOperacao.RESUMO_CONSULTA,
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
            status = ia_consulta_log_entity_1.IaStatus.FALHOU;
            this.logger.error(`Resumo FALHOU: ${msg}`);
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.RESUMO_CONSULTA,
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
    async sugerirHipotese(params) {
        const apiKey = this.config.get('OPENAI_API_KEY');
        let status = ia_consulta_log_entity_1.IaStatus.SUCESSO;
        let modelo = this.MODELO_CHAT;
        let tokens = 0;
        try {
            if (!apiKey)
                throw new Error('OPENAI_API_KEY não configurada');
            if (!params.queixas?.trim())
                throw new Error('Queixas não podem ser vazias');
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
            const data = (await resp.json());
            tokens = data.usage?.total_tokens ?? 0;
            const conteudo = data.choices[0]?.message?.content ?? '{}';
            const parsed = JSON.parse(conteudo);
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.HIPOTESE_DIAGNOSTICA,
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
        }
        catch (err) {
            const msg = err.message;
            if (msg.includes('não configurada')) {
                status = ia_consulta_log_entity_1.IaStatus.SIMULADO;
                modelo = 'SIMULADO';
                this.logger.warn('Hipótese SIMULADA — OpenAI não configurada');
                const log = await this.salvarLog({
                    operacao: ia_consulta_log_entity_1.IaOperacao.HIPOTESE_DIAGNOSTICA,
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
            status = ia_consulta_log_entity_1.IaStatus.FALHOU;
            this.logger.error(`Hipótese FALHOU: ${msg}`);
            const log = await this.salvarLog({
                operacao: ia_consulta_log_entity_1.IaOperacao.HIPOTESE_DIAGNOSTICA,
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
    async listarLogs(params) {
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
    statusConfig() {
        const apiKey = this.config.get('OPENAI_API_KEY');
        return {
            openAiConfigurado: !!apiKey,
            modelo: apiKey ? this.MODELO_CHAT : 'SIMULADO',
        };
    }
    async salvarLog(data) {
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
};
exports.IaProntuarioService = IaProntuarioService;
exports.IaProntuarioService = IaProntuarioService = IaProntuarioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ia_consulta_log_entity_1.IaConsultaLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], IaProntuarioService);
//# sourceMappingURL=ia-prontuario.service.js.map