/**
 * Script para exportar o swagger.json sem precisar subir o servidor.
 * Uso: npx ts-node -r tsconfig-paths/register scripts/export-swagger.ts
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

async function exportSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Estética Natalia Salvador — API')
    .setDescription('API REST do sistema de gestão da clínica Estética Natalia Salvador')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputDir = join(__dirname, '..', 'api-docs');
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

  console.log(`✅ swagger.json exportado em: ${outputPath}`);
  await app.close();
}

exportSwagger().catch((err) => {
  console.error('❌ Erro ao exportar swagger:', err);
  process.exit(1);
});
