import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { AgendamentoStatus } from '../../domain/entities/agendamento-status.enum';
import { Paciente } from '../../domain/entities/paciente.entity';
import { ComunicacaoService } from '../use-cases/comunicacao.service';
import {
  ComunicacaoMotivo,
  ComunicacaoTipo,
} from '../../domain/entities/comunicacao-log.entity';

@Injectable()
export class LembretesService {
  private readonly logger = new Logger(LembretesService.name);

  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentoRepo: Repository<Agendamento>,
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    private readonly comunicacaoService: ComunicacaoService,
  ) {}

  /**
   * Roda diariamente às 09:00 — envia lembretes para agendamentos do DIA SEGUINTE.
   * Marcados com lembreteEnviado=false para evitar duplicatas.
   */
  @Cron('0 9 * * *', { name: 'lembretes-agendamentos', timeZone: 'America/Sao_Paulo' })
  async enviarLembretesAgendamentos(): Promise<void> {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);

    const depoisAmanha = new Date(amanha);
    depoisAmanha.setDate(depoisAmanha.getDate() + 1);

    const agendamentos = await this.agendamentoRepo.find({
      where: {
        status: AgendamentoStatus.AGENDADO,
        dataHoraInicio: Between(amanha, depoisAmanha),
        lembreteEnviado: false,
      },
      relations: ['paciente'],
    });

    this.logger.log(`[Cron Lembretes] Encontrados ${agendamentos.length} agendamentos para amanhã`);

    for (const ag of agendamentos) {
      const paciente = ag.paciente;
      if (!paciente) continue;

      const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo',
      }).format(ag.dataHoraInicio);

      const mensagem = `Olá ${paciente.nome.split(' ')[0]}! 😊\n\nLembramos que você tem um agendamento na Estética Natalia Salvador:\n\n📅 ${dataFormatada}\n\nCaso precise reagendar, entre em contato conosco.\n\nAté logo! ✨`;

      // Prefere WhatsApp > SMS > Email
      const tipo =
        paciente.telefone ? ComunicacaoTipo.WHATSAPP : ComunicacaoTipo.EMAIL;
      const destinatario = paciente.telefone ?? paciente.email ?? '';

      if (!destinatario) {
        this.logger.warn(`Paciente ${paciente.id} sem contato — lembrete ignorado`);
        continue;
      }

      await this.comunicacaoService.enviar({
        pacienteId: paciente.id,
        agendamentoId: ag.id,
        tipo,
        motivo: ComunicacaoMotivo.LEMBRETE_AGENDAMENTO,
        destinatario,
        assunto: 'Lembrete de consulta — Estética Natalia Salvador',
        mensagem,
      });

      // Marcar como enviado para evitar duplicatas
      await this.agendamentoRepo.update(ag.id, { lembreteEnviado: true });
    }

    this.logger.log(`[Cron Lembretes] ${agendamentos.length} lembretes processados`);
  }

  /**
   * Roda às 10:00 todo dia — parabéns de aniversário.
   */
  @Cron('0 10 * * *', { name: 'aniversarios', timeZone: 'America/Sao_Paulo' })
  async enviarAniversarios(): Promise<void> {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth() + 1;

    const aniversariantes = await this.pacienteRepo
      .createQueryBuilder('p')
      .where('EXTRACT(DAY FROM p.data_nascimento) = :dia', { dia })
      .andWhere('EXTRACT(MONTH FROM p.data_nascimento) = :mes', { mes })
      .andWhere('p.ativo = true')
      .getMany();

    this.logger.log(`[Cron Aniversários] ${aniversariantes.length} aniversariante(s) hoje`);

    for (const paciente of aniversariantes) {
      const destinatario = paciente.telefone ?? paciente.email ?? '';
      if (!destinatario) continue;

      const tipo = paciente.telefone ? ComunicacaoTipo.WHATSAPP : ComunicacaoTipo.EMAIL;
      const mensagem = `Feliz aniversário, ${paciente.nome.split(' ')[0]}! 🎉🎂\n\nA equipe da Estética Natalia Salvador deseja um dia incrível para você!\n\nComo presente especial, você ganhou um desconto exclusivo na sua próxima visita. Entre em contato conosco! ✨`;

      await this.comunicacaoService.enviar({
        pacienteId: paciente.id,
        tipo,
        motivo: ComunicacaoMotivo.ANIVERSARIO,
        destinatario,
        assunto: 'Feliz Aniversário! 🎉 — Estética Natalia Salvador',
        mensagem,
      });
    }
  }
}
