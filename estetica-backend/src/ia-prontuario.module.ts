import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { IaConsultaLog } from './domain/entities/ia-consulta-log.entity';
import { IaProntuarioService } from './application/use-cases/ia-prontuario.service';
import { IaProntuarioController } from './presentation/controllers/ia-prontuario.controller';

// Garante que o diretório de upload de áudios existe
const uploadDir = join(process.cwd(), 'uploads', 'ia-audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forFeature([IaConsultaLog]),
    MulterModule.register({ dest: uploadDir }),
  ],
  controllers: [IaProntuarioController],
  providers: [IaProntuarioService],
  exports: [IaProntuarioService],
})
export class IaProntuarioModule {}
