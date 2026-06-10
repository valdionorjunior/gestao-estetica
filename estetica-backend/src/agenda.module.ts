import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './domain/entities/agendamento.entity';
import { AgendaRepository } from './infrastructure/repositories/agenda.repository';
import { AgendaService } from './application/use-cases/agenda.service';
import { AgendaController } from './presentation/controllers/agenda.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agendamento]), AuthModule],
  providers: [AgendaRepository, AgendaService],
  controllers: [AgendaController],
  exports: [AgendaService, AgendaRepository],
})
export class AgendaModule {}
