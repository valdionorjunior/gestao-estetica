'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { agendaService, CreateAgendamentoDto } from '../../services/agenda.service';
import { pacientesService, Paciente } from '../../services/pacientes.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function formatDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function NovoAgendamentoModal({ open, onClose, onSuccess }: Props) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [buscaPaciente, setBuscaPaciente] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [carregandoPacientes, setCarregandoPacientes] = useState(false);

  const now = new Date();
  const nowPlus60 = new Date(now.getTime() + 60 * 60 * 1000);

  const [form, setForm] = useState({
    procedimento: '',
    dataHoraInicio: formatDateTimeLocal(now),
    dataHoraFim: formatDateTimeLocal(nowPlus60),
    observacoes: '',
    valor: '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    // Reset ao abrir
    setPacienteSelecionado(null);
    setBuscaPaciente('');
    setMostrarDropdown(false);
    setErros({});
    setErroGeral('');
    const nowR = new Date();
    const nowPlus60R = new Date(nowR.getTime() + 60 * 60 * 1000);
    setForm({
      procedimento: '',
      dataHoraInicio: formatDateTimeLocal(nowR),
      dataHoraFim: formatDateTimeLocal(nowPlus60R),
      observacoes: '',
      valor: '',
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (buscaRef.current) clearTimeout(buscaRef.current);
    if (!buscaPaciente.trim()) {
      setPacientes([]);
      setMostrarDropdown(false);
      return;
    }
    setCarregandoPacientes(true);
    buscaRef.current = setTimeout(() => {
      pacientesService
        .list({ search: buscaPaciente, limit: 10 })
        .then((res) => {
          setPacientes(res.data);
          setMostrarDropdown(true);
        })
        .catch(() => setPacientes([]))
        .finally(() => setCarregandoPacientes(false));
    }, 300);
  }, [buscaPaciente, open]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function validar() {
    const novosErros: Record<string, string> = {};
    if (!pacienteSelecionado) novosErros.paciente = 'Selecione um paciente';
    if (!form.dataHoraInicio) novosErros.dataHoraInicio = 'Data/hora de início obrigatória';
    if (!form.dataHoraFim) novosErros.dataHoraFim = 'Data/hora de fim obrigatória';
    if (form.dataHoraInicio && form.dataHoraFim && form.dataHoraFim <= form.dataHoraInicio) {
      novosErros.dataHoraFim = 'Término deve ser após o início';
    }
    if (form.valor && isNaN(parseFloat(form.valor))) {
      novosErros.valor = 'Valor inválido';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    setErroGeral('');
    try {
      const dto: CreateAgendamentoDto = {
        pacienteId: pacienteSelecionado!.id,
        procedimento: form.procedimento || undefined,
        dataHoraInicio: new Date(form.dataHoraInicio).toISOString(),
        dataHoraFim: new Date(form.dataHoraFim).toISOString(),
        observacoes: form.observacoes || undefined,
        valor: form.valor ? parseFloat(form.valor) : undefined,
      };
      await agendaService.create(dto);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      setErroGeral(msg);
    } finally {
      setSalvando(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DD]">
          <div>
            <h2 id="modal-titulo" className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Novo Agendamento
            </h2>
            <div className="w-8 h-0.5 bg-[#D4AF37] mt-1" />
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors p-1 rounded-md hover:bg-[#F8F7F4]"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="form-agendamento" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          {/* Paciente */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-[#1A1A1A] block mb-1.5">
              Paciente <span className="text-[#EF4444]">*</span>
            </label>

            {pacienteSelecionado ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#D4AF37] bg-[#D4AF37]/5 text-sm">
                <div>
                  <span className="font-medium text-[#1A1A1A]">{pacienteSelecionado.nome}</span>
                  {pacienteSelecionado.telefone && (
                    <span className="ml-2 text-[#6B6560]">— {pacienteSelecionado.telefone}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setPacienteSelecionado(null); setBuscaPaciente(''); }}
                  className="text-[#6B6560] hover:text-[#EF4444] text-xs ml-2 transition-colors"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  value={buscaPaciente}
                  onChange={(e) => setBuscaPaciente(e.target.value)}
                  onFocus={() => buscaPaciente.trim() && setMostrarDropdown(true)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1A1A] bg-white transition-all outline-none placeholder:text-[#6B6560]/60
                    ${erros.paciente ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' : 'border-[#E8E4DD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'}`}
                />
                {carregandoPacientes && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                )}
                {mostrarDropdown && pacientes.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E4DD] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {pacientes.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPacienteSelecionado(p);
                          setBuscaPaciente('');
                          setMostrarDropdown(false);
                          setErros((prev) => ({ ...prev, paciente: '' }));
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] transition-colors"
                      >
                        <span className="font-medium text-[#1A1A1A]">{p.nome}</span>
                        {p.telefone && (
                          <span className="ml-2 text-xs text-[#6B6560]">{p.telefone}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {mostrarDropdown && pacientes.length === 0 && !carregandoPacientes && buscaPaciente.trim() && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E4DD] rounded-lg shadow-lg px-4 py-3 text-sm text-[#6B6560]">
                    Nenhum paciente encontrado
                  </div>
                )}
              </div>
            )}
            {erros.paciente && <p className="text-xs text-[#EF4444] mt-1">{erros.paciente}</p>}
          </div>

          {/* Procedimento */}
          <Input
            label="Procedimento"
            placeholder="Ex: Limpeza de pele, Laser, Botox..."
            value={form.procedimento}
            onChange={(e) => setForm((f) => ({ ...f, procedimento: e.target.value }))}
          />

          {/* Data/Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">
                Início <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.dataHoraInicio}
                onChange={(e) => setForm((f) => ({ ...f, dataHoraInicio: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1A1A] bg-white transition-all outline-none
                  ${erros.dataHoraInicio ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' : 'border-[#E8E4DD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'}`}
              />
              {erros.dataHoraInicio && <p className="text-xs text-[#EF4444]">{erros.dataHoraInicio}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">
                Término <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.dataHoraFim}
                onChange={(e) => setForm((f) => ({ ...f, dataHoraFim: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1A1A] bg-white transition-all outline-none
                  ${erros.dataHoraFim ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' : 'border-[#E8E4DD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'}`}
              />
              {erros.dataHoraFim && <p className="text-xs text-[#EF4444]">{erros.dataHoraFim}</p>}
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#6B6560]">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.valor}
                onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm text-[#1A1A1A] bg-white transition-all outline-none placeholder:text-[#6B6560]/60
                  ${erros.valor ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' : 'border-[#E8E4DD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'}`}
              />
            </div>
            {erros.valor && <p className="text-xs text-[#EF4444]">{erros.valor}</p>}
          </div>

          {/* Observações */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Observações</label>
            <textarea
              rows={3}
              placeholder="Informações adicionais sobre o atendimento..."
              value={form.observacoes}
              onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E4DD] text-sm text-[#1A1A1A] bg-white transition-all outline-none resize-none
                placeholder:text-[#6B6560]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>

          {erroGeral && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {erroGeral}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E4DD]">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="form-agendamento"
            loading={salvando}
          >
            Salvar Agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}
