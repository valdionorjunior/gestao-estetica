export declare class Paciente {
    id: string;
    clinicaId: string | null;
    nome: string;
    cpfEncrypted: string | null;
    dataNascimento: Date | null;
    telefone: string | null;
    email: string | null;
    endereco: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
    fotoUrl: string | null;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
