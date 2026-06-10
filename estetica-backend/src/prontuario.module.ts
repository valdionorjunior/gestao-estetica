import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prontuario } from './domain/entities/prontuario.entity';
import { FichaAtendimento } from './domain/entities/ficha-atendimento.entity';
import { ProntuarioRepository } from './infrastructure/repositories/prontuario.repository';
import { ProntuarioService } from './application/use-cases/prontuario.service';
import { ProntuarioController } from './presentation/controllers/prontuario.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prontuario, FichaAtendimento]), AuthModule],
  providers: [ProntuarioRepository, ProntuarioService],
  controllers: [ProntuarioController],
  exports: [ProntuarioService],
})
export class ProntuarioModule {}
