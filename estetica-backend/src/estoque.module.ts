import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './domain/entities/produto.entity';
import { MovimentacaoEstoque } from './domain/entities/movimentacao-estoque.entity';
import { EstoqueRepository } from './infrastructure/repositories/estoque.repository';
import { EstoqueService } from './application/use-cases/estoque.service';
import { EstoqueController } from './presentation/controllers/estoque.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, MovimentacaoEstoque]), AuthModule],
  providers: [EstoqueRepository, EstoqueService],
  controllers: [EstoqueController],
  exports: [EstoqueService],
})
export class EstoqueModule {}
