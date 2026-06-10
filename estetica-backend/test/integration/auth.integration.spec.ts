import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AuthModule } from '../../src/auth.module';
import { User } from '../../src/domain/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

/**
 * TESTE DE INTEGRAÇÃO — Autenticação com Banco Real
 * 
 * Este teste valida:
 * - Entidades TypeORM sincronizam corretamente com PostgreSQL
 * - Endpoints funcionam end-to-end
 * - Dados são persistidos no banco real
 * 
 * ⚠️ IMPORTANTE:
 * - Usar banco de testes separado (estetica_ns_test)
 * - Limpar dados antes/depois dos testes
 * - NÃO usar synchronize: true em produção
 */
describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test', // ⚠️ Usar .env.test separado
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USER || 'estetica_user',
          password: process.env.DB_PASSWORD || 'estetica_pass',
          database: 'estetica_ns_test', // ⚠️ Banco de testes
          synchronize: false, // ⚠️ NUNCA true em produção
          dropSchema: false, // ⚠️ NUNCA true com dados reais
          entities: [User], // Listar todas as entidades usadas
          logging: false,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Limpar dados de teste (opcional)
    // await getRepository(User).delete({ email: /validacao-integracao/ });
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('deve criar um usuário no banco real', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste Integração',
          email: `validacao-integracao-${Date.now()}@test.com`,
          password: 'Test123!',
          role: 'ADMIN',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toContain('validacao-integracao');
    });

    it('deve retornar 409 ao tentar criar usuário duplicado', async () => {
      const email = `duplicado-${Date.now()}@test.com`;

      // Criar primeira vez
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste Duplicado',
          email,
          password: 'Test123!',
          role: 'ADMIN',
        })
        .expect(201);

      // Tentar criar novamente
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste Duplicado 2',
          email,
          password: 'Test123!',
          role: 'ADMIN',
        })
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      email: `login-test-${Date.now()}@test.com`,
      password: 'Test123!',
    };

    beforeAll(async () => {
      // Criar usuário de teste
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste Login',
          email: testUser.email,
          password: testUser.password,
          role: 'ADMIN',
        });
    });

    it('deve autenticar usuário existente', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(testUser.email);

      authToken = response.body.accessToken;
    });

    it('deve rejeitar senha incorreta', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'SenhaErrada123!',
        })
        .expect(401);
    });

    it('deve rejeitar usuário inexistente', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nao-existe@test.com',
          password: 'Test123!',
        })
        .expect(401);
    });
  });

  describe('Proteção de rotas autenticadas', () => {
    it('deve rejeitar requisição sem token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .expect(401);
    });

    it('deve aceitar requisição com token válido', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('deve rejeitar token inválido', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });
  });
});
