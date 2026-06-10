import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaFinanceira } from './domain/entities/conta-financeira.entity';
import { FinanceiroRepository } from './infrastructure/repositories/financeiro.repository';
import { FinanceiroService } from './application/use-cases/financeiro.service';
import { FinanceiroController } from './presentation/controllers/financeiro.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContaFinanceira]), AuthModule],
  providers: [FinanceiroRepository, FinanceiroService],
  controllers: [FinanceiroController],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
