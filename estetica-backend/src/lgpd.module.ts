import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LgpdController } from './presentation/controllers/lgpd.controller';
import { AuditService } from './application/use-cases/audit.service';
import { AuditLog } from './domain/entities/audit-log.entity';
import { User } from './domain/entities/user.entity';
import { Paciente } from './domain/entities/paciente.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, User, Paciente]),
  ],
  controllers: [LgpdController],
  providers: [AuditService, UserRepository],
  exports: [AuditService],
})
export class LgpdModule {}
