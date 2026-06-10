import { apiFetch } from '../lib/api';

export type TipoFoto = 'ANTES' | 'DEPOIS' | 'DURANTE' | 'REFERENCIA';

export interface Anotacao {
  id: string;
  x: number;
  y: number;
  texto: string;
  cor?: string;
  forma?: 'circulo' | 'seta' | 'retangulo' | 'ponto';
}

export interface ConsultaFoto {
  id: string;
  pacienteId: string;
  prontuarioId: string | null;
  tipo: TipoFoto;
  fotoUrl: string;
  descricao: string | null;
  anotacoes: Anotacao[];
  dataConsulta: string | null;
  createdAt: string;
  updatedAt: string;
}

export const consultaService = {
  async listarPorPaciente(pacienteId: string, tipo?: TipoFoto): Promise<ConsultaFoto[]> {
    const params = tipo ? `?tipo=${tipo}` : '';
    return apiFetch<ConsultaFoto[]>(`/consulta-interativa/paciente/${pacienteId}${params}`);
  },

  async upload(formData: FormData): Promise<ConsultaFoto> {
    const token = typeof window !== 'undefined'
      ? (JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token ?? '')
      : '';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/consulta-interativa/upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Erro ao fazer upload');
    }
    return res.json() as Promise<ConsultaFoto>;
  },

  async salvarAnotacoes(id: string, anotacoes: Anotacao[]): Promise<ConsultaFoto> {
    return apiFetch<ConsultaFoto>(`/consulta-interativa/${id}/anotacoes`, {
      method: 'PATCH',
      body: JSON.stringify({ anotacoes }),
    });
  },

  async remover(id: string): Promise<void> {
    await apiFetch(`/consulta-interativa/${id}`, { method: 'DELETE' });
  },
};
