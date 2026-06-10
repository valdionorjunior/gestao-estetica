import { Repository } from 'typeorm';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuditService } from '../../application/use-cases/audit.service';
import { User } from '../../domain/entities/user.entity';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { Paciente } from '../../domain/entities/paciente.entity';
declare class ConsentimentoDto {
    aceitaPoliticaPrivacidade: boolean;
    aceitaComunicacoes?: boolean;
}
declare class ExclusaoContaDto {
    confirmacao: string;
}
export declare class LgpdController {
    private readonly userRepo;
    private readonly pacienteRepo;
    private readonly auditRepo;
    private readonly auditService;
    private readonly userRepository;
    constructor(userRepo: Repository<User>, pacienteRepo: Repository<Paciente>, auditRepo: Repository<AuditLog>, auditService: AuditService, userRepository: UserRepository);
    exportarMeusDados(user: {
        id: string;
        email: string;
        role: string;
    }): Promise<{
        exportadoEm: string;
        titular: any;
        historicDeAtividades: {
            acao: string;
            entidade: string;
            data: Date;
            ip: string | null;
        }[];
        aviso: string;
    }>;
    portabilidade(user: {
        id: string;
    }): Promise<{
        versao: string;
        formato: string;
        exportadoEm: string;
        sistema: string;
        dadosTitular: any;
    }>;
    excluirConta(user: {
        id: string;
        email: string;
    }, dto: ExclusaoContaDto): Promise<void>;
    registrarConsentimento(user: {
        id: string;
    }, dto: ConsentimentoDto): Promise<void>;
}
export {};
