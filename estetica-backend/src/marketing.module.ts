import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketingController } from './presentation/controllers/marketing.controller';
import { ComunicacaoService } from './application/use-cases/comunicacao.service';
import { LembretesService } from './application/use-cases/lembretes.service';
import { ComunicacaoLog } from './domain/entities/comunicacao-log.entity';
import { Paciente } from './domain/entities/paciente.entity';
import { Agendamento } from './domain/entities/agendamento.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ComunicacaoLog, Paciente, Agendamento]),
  ],
  controllers: [MarketingController],
  providers: [ComunicacaoService, LembretesService],
  exports: [ComunicacaoService],
})
export class MarketingModule {}
