import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './domain/entities/agendamento.entity';
import { ContaFinanceira } from './domain/entities/conta-financeira.entity';
import { Paciente } from './domain/entities/paciente.entity';
import { RelatoriosController } from './presentation/controllers/relatorios.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agendamento, ContaFinanceira, Paciente]), AuthModule],
  controllers: [RelatoriosController],
})
export class RelatoriosModule {}
