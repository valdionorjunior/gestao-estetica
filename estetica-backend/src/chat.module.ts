import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatMensagem } from './domain/entities/chat-mensagem.entity';
import { ChatService } from './application/use-cases/chat.service';
import { ChatGateway } from './presentation/gateways/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMensagem]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'secret_change_me'),
      }),
    }),
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
