import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UsuariosController } from './presentation/controllers/usuarios.controller';
import { UsuariosService } from './application/use-cases/usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
