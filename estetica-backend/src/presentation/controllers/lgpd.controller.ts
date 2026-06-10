import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuditService } from '../../application/use-cases/audit.service';
import { User } from '../../domain/entities/user.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Paciente } from '../../domain/entities/paciente.entity';

class ConsentimentoDto {
  @ApiProperty({ description: 'Aceite da política de privacidade' })
  @IsBoolean()
  aceitaPoliticaPrivacidade: boolean;

  @ApiPropertyOptional({ description: 'Aceite de comunicações de marketing' })
  @IsOptional()
  @IsBoolean()
  aceitaComunicacoes?: boolean;
}

class ExclusaoContaDto {
  @ApiProperty({ description: 'Confirmação — deve conter a palavra CONFIRMAR' })
  @IsString()
  confirmacao: string;
}

/**
 * Endpoints de conformidade LGPD (Lei 13.709/2018)
 * Art. 18 — Direitos do titular dos dados
 */
@ApiTags('LGPD')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('lgpd')
export class LgpdController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
    private readonly auditService: AuditService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Art. 18, II — Acesso aos dados
   * Art. 18, V — Portabilidade dos dados
   */
  @Get('meus-dados')
  @ApiOperation({ summary: 'LGPD — Exportar todos os meus dados (Art. 18, II e V)' })
  @ApiResponse({ status: 200, description: 'Dados pessoais do titular exportados' })
  async exportarMeusDados(
    @CurrentUser() user: { id: string; email: string; role: string },
  ) {
    const [userRecord, auditLogs] = await Promise.all([
      this.userRepo.findOne({ where: { id: user.id } }),
      this.auditRepo.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 200 }),
    ]);

    if (!userRecord) throw new NotFoundException('Usuário não encontrado');

    // Nunca retornar dados sensíveis de autenticação
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...userSafe } = userRecord as any;

    await this.auditService.log({
      userId: user.id,
      action: 'lgpd:exportar-dados',
      entity: 'users',
      entityId: user.id,
    });

    return {
      exportadoEm: new Date().toISOString(),
      titular: userSafe,
      historicDeAtividades: auditLogs.map((l) => ({
        acao: l.action,
        entidade: l.entity,
        data: l.createdAt,
        ip: l.ipAddress,
      })),
      aviso: 'Dados exportados conforme Art. 18, incisos II e V da LGPD (Lei 13.709/2018)',
    };
  }

  /**
   * Art. 18, IV — Portabilidade
   */
  @Get('portabilidade')
  @ApiOperation({ summary: 'LGPD — Portabilidade dos dados em formato estruturado (Art. 18, V)' })
  @ApiResponse({ status: 200, description: 'Dados exportados em JSON portável' })
  async portabilidade(
    @CurrentUser() user: { id: string },
  ) {
    const userRecord = await this.userRepo.findOne({ where: { id: user.id } });
    if (!userRecord) throw new NotFoundException('Usuário não encontrado');

    const { passwordHash, refreshTokenHash, ...userSafe } = userRecord as any;

    await this.auditService.log({
      userId: user.id,
      action: 'lgpd:portabilidade',
      entity: 'users',
      entityId: user.id,
    });

    return {
      versao: '1.0',
      formato: 'JSON',
      exportadoEm: new Date().toISOString(),
      sistema: 'Estética Natalia Salvador',
      dadosTitular: userSafe,
    };
  }

  /**
   * Art. 18, VI — Exclusão dos dados
   */
  @Delete('minha-conta')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'LGPD — Solicitar exclusão da conta (Art. 18, VI)' })
  @ApiResponse({ status: 204, description: 'Conta anonimizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Confirmação inválida — enviar CONFIRMAR' })
  async excluirConta(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: ExclusaoContaDto,
  ) {
    if (dto.confirmacao !== 'CONFIRMAR') {
      throw new NotFoundException('Confirmação inválida. Envie o texto CONFIRMAR para excluir a conta.');
    }

    // Anonimizar em vez de apagar — manter integridade referencial
    await this.userRepo.update(user.id, {
      email: `excluido_${user.id}@anonimizado.lgpd`,
      nome: 'Conta Excluída',
      ativo: false,
      refreshTokenHash: null,
    });

    await this.auditService.log({
      userId: user.id,
      action: 'lgpd:conta-anonimizada',
      entity: 'users',
      entityId: user.id,
      oldValue: { email: user.email },
      newValue: { status: 'anonimizado' },
    });
  }

  /**
   * Art. 7 e Art. 8 — Registro de consentimento
   */
  @Post('consentimento')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'LGPD — Registrar consentimento do titular (Art. 7 e 8)' })
  @ApiResponse({ status: 204, description: 'Consentimento registrado' })
  async registrarConsentimento(
    @CurrentUser() user: { id: string },
    @Body() dto: ConsentimentoDto,
  ) {
    await this.auditService.log({
      userId: user.id,
      action: 'lgpd:consentimento',
      entity: 'users',
      entityId: user.id,
      newValue: {
        aceitaPoliticaPrivacidade: dto.aceitaPoliticaPrivacidade,
        aceitaComunicacoes: dto.aceitaComunicacoes ?? false,
        registradoEm: new Date().toISOString(),
      },
    });
  }
}
