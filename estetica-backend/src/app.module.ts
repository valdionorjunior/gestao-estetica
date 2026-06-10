import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { PacientesModule } from './pacientes.module';
import { AgendaModule } from './agenda.module';
import { ProntuarioModule } from './prontuario.module';
import { FinanceiroModule } from './financeiro.module';
import { EstoqueModule } from './estoque.module';
import { RelatoriosModule } from './relatorios.module';
import { LgpdModule } from './lgpd.module';
import { UsuariosModule } from './usuarios.module';
import { MarketingModule } from './marketing.module';
import { ConsultaInterativaModule } from './consulta-interativa.module';
import { VideosClinicoModule } from './videos-clinico.module';
import { ChatModule } from './chat.module';
import { IntegracoesModule } from './integracoes.module';
import { IaProntuarioModule } from './ia-prontuario.module';
import { TelemediicinaModule } from './telemedicina.module';

@Module({
  imports: [
    // Configuração via .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Servir arquivos de upload (fotos de consulta)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),

    // Rate limiting global
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    // Banco de dados via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_NAME', 'estetica_ns'),
        username: config.get<string>('DB_USER', 'estetica_user'),
        password: config.get<string>('DB_PASSWORD', 'estetica_pass'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // sempre false em produção — usar Flyway
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    PacientesModule,
    AgendaModule,
    ProntuarioModule,
    FinanceiroModule,
    EstoqueModule,
    RelatoriosModule,
    LgpdModule,
    UsuariosModule,
    MarketingModule,
    ConsultaInterativaModule,
    VideosClinicoModule,
    ChatModule,
    IntegracoesModule,
    IaProntuarioModule,
    TelemediicinaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

