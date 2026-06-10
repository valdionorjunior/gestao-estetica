import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComunicacaoMotivo, ComunicacaoTipo } from '../../../domain/entities/comunicacao-log.entity';

export class EnviarMensagemDto {
  @ApiProperty({ description: 'ID do paciente destinatário' })
  @IsUUID('4', { message: 'pacienteId deve ser um UUID válido' })
  pacienteId: string;

  @ApiPropertyOptional({ description: 'ID do agendamento relacionado (opcional)' })
  @IsOptional()
  @IsUUID('4')
  agendamentoId?: string;

  @ApiProperty({ enum: ComunicacaoTipo, example: ComunicacaoTipo.WHATSAPP })
  @IsEnum(ComunicacaoTipo, { message: 'Tipo inválido. Use EMAIL, SMS ou WHATSAPP' })
  tipo: ComunicacaoTipo;

  @ApiProperty({ enum: ComunicacaoMotivo, example: ComunicacaoMotivo.MANUAL })
  @IsEnum(ComunicacaoMotivo, { message: 'Motivo inválido' })
  motivo: ComunicacaoMotivo;

  @ApiProperty({ example: 'Olá {nome}, sua consulta está agendada para amanhã às {hora}.' })
  @IsString()
  @MinLength(5, { message: 'Mensagem muito curta' })
  @MaxLength(1600, { message: 'Mensagem excede 1600 caracteres' })
  mensagem: string;

  @ApiPropertyOptional({ example: 'Lembrete de consulta — Estética Natalia Salvador' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  assunto?: string;
}

export class EnviarCampanhaDto {
  @ApiProperty({ description: 'Lista de IDs de pacientes destinatários' })
  @IsUUID('4', { each: true, message: 'Cada pacienteId deve ser um UUID válido' })
  pacienteIds: string[];

  @ApiProperty({ enum: ComunicacaoTipo })
  @IsEnum(ComunicacaoTipo)
  tipo: ComunicacaoTipo;

  @ApiProperty({ example: 'Promoção Especial de Verão!' })
  @IsString()
  @MaxLength(200)
  assunto: string;

  @ApiProperty({ example: 'Olá {nome}, temos uma promoção especial para você! 🌟' })
  @IsString()
  @MinLength(5)
  @MaxLength(1600)
  mensagem: string;
}
