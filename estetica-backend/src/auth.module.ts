import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuthService } from './application/use-cases/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/guards/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [UserRepository, AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [UserRepository, JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
