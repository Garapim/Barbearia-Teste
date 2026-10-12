import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, CheckCircle2, User, Phone, Check, RefreshCw, Scissors, ChevronRight } from 'lucide-react';
import { Appointment, Barber } from '../types';
import { formatCurrency, formatDatePtBR } from '../utils/helpers';

interface BarberDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  appointments: Appointment[];
  onUpdateStatus: (appointmentId: string, status: Appointment['status']) => void;
}

export const BarberDashboardModal: React.FC<BarberDashboardModalProps> = ({
  isOpen,
  onClose,
  barbers,
  appointments,
  onUpdateStatus
}) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const todayStr = '2026-10-14'; // Focused demo day

  if (!isOpen) return null;

  const filteredAppointments = appointments.filter(a => {
    if (selectedBarberId !== 'all' && a.barberId !== selectedBarberId) return false;
    return true;
  });

  const totalRevenue = filteredAppointments
    .filter(a => a.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const completedCount = filteredAppointments.filter(a => a.status === 'completed').length;
  const inProgressCount = filteredAppointments.filter(a => a.status === 'in_progress').length;
  const confirmedCount = filteredAppointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#171b26] to-[#1e2333] border-b border-[#272d3b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Painel da Barbearia & Gestão da Cadeira
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Visão operacional em tempo real dos barbeiros e faturamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 bg-[#141720] border-b border-[#212634]">
          <div className="bg-[#181c28] p-3.5 rounded-xl border border-[#272d3b]">
            <div className="text-[11px] uppercase tracking-wider text-[#9aa0a6]">Receita Prevista</div>
            <div className="text-xl font-bold text-[#e5b842] tabular-nums font-display mt-0.5">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[10px] text-[#9aa0a6] mt-1">Soma dos agendamentos</div>
          </div>

          <div className="bg-[#181c28] p-3.5 rounded-xl border border-[#272d3b]">
            <div className="text-[11px] uppercase tracking-wider text-[#9aa0a6]">Agendados</div>
            <div className="text-xl font-bold text-white tabular-nums font-display mt-0.5">
              {confirmedCount}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Aguardando na recepção</div>
          </div>

          <div className="bg-[#181c28] p-3.5 rounded-xl border border-[#272d3b]">
            <div className="text-[11px] uppercase tracking-wider text-[#9aa0a6]">Na Cadeira</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums font-display mt-0.5">
              {inProgressCount}
            </div>
            <div className="text-[10px] text-amber-300 mt-1">Cortes em andamento</div>
          </div>

          <div className="bg-[#181c28] p-3.5 rounded-xl border border-[#272d3b]">
            <div className="text-[11px] uppercase tracking-wider text-[#9aa0a6]">Finalizados</div>
            <div className="text-xl font-bold text-blue-400 tabular-nums font-display mt-0.5">
              {completedCount}
            </div>
            <div className="text-[10px] text-blue-300 mt-1">Atendimentos concluídos</div>
          </div>
        </div>

        {/* Filter by Barber */}
        <div className="px-5 py-3 bg-[#12151e] border-b border-[#212634] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedBarberId('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedBarberId === 'all'
                  ? 'bg-[#c5a059] text-[#0b0d11]'
                  : 'bg-[#1e2332] text-[#9aa0a6] hover:text-white'
              }`}
            >
              Todas as Cadeiras
            </button>
            {barbers.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBarberId(b.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBarberId === b.id
                    ? 'bg-[#c5a059] text-[#0b0d11]'
                    : 'bg-[#1e2332] text-[#9aa0a6] hover:text-white'
                }`}
              >
                <span>{b.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">(Cadeira {b.chairNumber})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Queue Table / Cards */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#9aa0a6]">
              Nenhum agendamento encontrado para o filtro selecionado.
            </div>
          ) : (
            filteredAppointments.map(appt => (
              <div
                key={appt.id}
                className="p-4 rounded-xl bg-[#161a25] border border-[#272d3b] hover:border-[#384154] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white bg-[#22293a] px-2 py-0.5 rounded">
                      {appt.time}
                    </span>
                    <span className="text-xs text-[#c5a059] font-mono">
                      #{appt.id}
                    </span>
                    <span className="text-xs text-[#9aa0a6]">·</span>
                    <span className="text-xs text-white font-medium">
                      Barbeiro: {appt.barberName}
                    </span>
                  </div>

                  <div className="font-semibold text-white font-display text-sm">
                    {appt.clientName}
                  </div>

                  <div className="text-xs text-[#9aa0a6] flex items-center gap-3">
                    <span>{appt.services.map(s => s.name).join(' + ')}</span>
                    <span>·</span>
                    <span className="text-[#e5b842] font-semibold tabular-nums">
                      {formatCurrency(appt.totalPrice)}
                    </span>
                    <span>·</span>
                    <span>{appt.clientPhone}</span>
                  </div>
                </div>

                {/* Status Switcher Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {appt.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(appt.id, 'in_progress')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-colors"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Iniciar Atendimento</span>
                    </button>
                  )}

                  {appt.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(appt.id, 'completed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Finalizar Corte</span>
                    </button>
                  )}

                  {appt.status === 'completed' && (
                    <span className="text-xs font-medium text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Atendimento Concluído
                    </span>
                  )}

                  {appt.status === 'cancelled' && (
                    <span className="text-xs font-medium text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800/60">
                      Cancelado
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
