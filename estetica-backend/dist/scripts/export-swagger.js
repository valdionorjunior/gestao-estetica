"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const app_module_1 = require("../src/app.module");
async function exportSwagger() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Estética Natalia Salvador — API')
        .setDescription('API REST do sistema de gestão da clínica Estética Natalia Salvador')
        .setVersion('1.0.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outputDir = (0, path_1.join)(__dirname, '..', 'api-docs');
    (0, fs_1.mkdirSync)(outputDir, { recursive: true });
    const outputPath = (0, path_1.join)(outputDir, 'swagger.json');
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(document, null, 2), 'utf8');
    console.log(`✅ swagger.json exportado em: ${outputPath}`);
    await app.close();
}
exportSwagger().catch((err) => {
    console.error('❌ Erro ao exportar swagger:', err);
    process.exit(1);
});
//# sourceMappingURL=export-swagger.js.map