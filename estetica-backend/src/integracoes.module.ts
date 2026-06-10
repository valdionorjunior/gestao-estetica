import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegracaoLog } from './domain/entities/integracao-log.entity';
import { IntegracoesService } from './application/use-cases/integracoes.service';
import { IntegracoesController } from './presentation/controllers/integracoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntegracaoLog])],
  controllers: [IntegracoesController],
  providers: [IntegracoesService],
  exports: [IntegracoesService],
})
export class IntegracoesModule {}
