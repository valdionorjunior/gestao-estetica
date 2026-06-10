import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './domain/entities/paciente.entity';
import { PacienteRepository } from './infrastructure/repositories/paciente.repository';
import { PacientesService } from './application/use-cases/pacientes.service';
import { PacientesController } from './presentation/controllers/pacientes.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente]), AuthModule],
  providers: [PacienteRepository, PacientesService],
  controllers: [PacientesController],
  exports: [PacientesService, PacienteRepository],
})
export class PacientesModule {}
