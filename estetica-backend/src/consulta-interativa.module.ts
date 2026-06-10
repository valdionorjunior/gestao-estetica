import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ConsultaFoto } from './domain/entities/consulta-foto.entity';
import { ConsultaInterativaService } from './application/use-cases/consulta-interativa.service';
import { ConsultaInterativaController } from './presentation/controllers/consulta-interativa.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultaFoto]),
    MulterModule.register({
      dest: join(process.cwd(), 'uploads'),
    }),
  ],
  controllers: [ConsultaInterativaController],
  providers: [ConsultaInterativaService],
  exports: [ConsultaInterativaService],
})
export class ConsultaInterativaModule {}
