import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessaoTelemedicina } from './domain/entities/sessao-telemedicina.entity';
import { TelemedicinavService } from './application/use-cases/telemedicina.service';
import { TelemediicinaController } from './presentation/controllers/telemedicina.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessaoTelemedicina])],
  controllers: [TelemediicinaController],
  providers: [TelemedicinavService],
  exports: [TelemedicinavService],
})
export class TelemediicinaModule {}
