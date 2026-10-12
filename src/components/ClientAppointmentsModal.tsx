import React, { useState } from 'react';
import { X, Calendar, Clock, Scissors, MapPin, CheckCircle, AlertCircle, Trash2, ExternalLink, CalendarPlus, Check, ArrowRight, Star } from 'lucide-react';
import { Appointment, User } from '../types';
import { formatCurrency, formatDatePtBR, generateGoogleCalendarUrl } from '../utils/helpers';
import { BARBERSHOP_INFO } from '../data/mockData';

interface ClientAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
  onSelectForPixPayment?: (appointment: Appointment) => void;
  onOpenReviewModal: (appointment: Appointment) => void;
}

export const ClientAppointmentsModal: React.FC<ClientAppointmentsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  appointments,
  onCancelAppointment,
  onSelectForPixPayment,
  onOpenReviewModal
}) => {
  const [filter, setFilter] = useState<'active' | 'history'>('active');

  if (!isOpen || !currentUser) return null;

  // Filter appointments for this user
  const userAppointments = appointments.filter(
    (a) => a.clientEmail.toLowerCase() === currentUser.email.toLowerCase() || a.clientId === currentUser.id
  );

  const activeAppointments = userAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'in_progress'
  );

  const historyAppointments = userAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const displayedList = filter === 'active' ? activeAppointments : historyAppointments;

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            Confirmado
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            Em Atendimento
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
            Concluído
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-semibold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
            Cancelado
          </span>
        );
    }
  };

  const getPaymentBadge = (method: Appointment['paymentMethod'], status: Appointment['paymentStatus']) => {
    let methodText = 'Pix';
    if (method === 'credit_card') methodText = 'Cartão de Crédito';
    if (method === 'barbearia') methodText = 'No Local';

    if (status === 'paid') {
      return (
        <span className="text-[11px] text-emerald-400 font-medium">
          Pago via {methodText}
        </span>
      );
    }
    if (status === 'pay_on_arrival') {
      return (
        <span className="text-[11px] text-[#e5b842] font-medium">
          Pagar na Barbearia ({methodText})
        </span>
      );
    }
    return (
      <span className="text-[11px] text-amber-400 font-medium">
        Pendente ({methodText})
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#171b26] to-[#1e2333] border-b border-[#272d3b] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Meus Agendamentos
            </h3>
            <p className="text-xs text-[#9aa0a6] mt-0.5">
              Cliente: <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 p-4 bg-[#141720] border-b border-[#212634]">
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'active'
                ? 'bg-[#c5a059] text-[#0b0d11]'
                : 'bg-[#1e2332] text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span>Próximos Horários</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {activeAppointments.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'history'
                ? 'bg-[#c5a059] text-[#0b0d11]'
                : 'bg-[#1e2332] text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span>Histórico de Cortes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {historyAppointments.length}
            </span>
          </button>
        </div>

        {/* Appointments List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {displayedList.length === 0 ? (
            <div className="text-center py-12 text-[#9aa0a6] space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-[#2e364a]" />
              <div className="text-sm font-medium text-white">Nenhum agendamento nesta aba</div>
              <p className="text-xs max-w-xs mx-auto">
                {filter === 'active'
                  ? 'Você não possui horários agendados pendentes no momento. Escolha seu barbeiro e faça uma reserva!'
                  : 'Nenhum histórico anterior de agendamentos arquivado.'}
              </p>
            </div>
          ) : (
            displayedList.map((appt) => (
              <div
                key={appt.id}
                className="bg-[#161a25] border border-[#272d3b] hover:border-[#384154] rounded-xl p-4 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#c5a059]">
                        #{appt.id}
                      </span>
                      {getStatusBadge(appt.status)}
                    </div>
                    <h4 className="text-base font-bold text-white font-display mt-1">
                      {appt.services.map((s) => s.name).join(' + ')}
                    </h4>
                    <div className="text-xs text-[#9aa0a6] flex items-center gap-1 mt-0.5">
                      <span>Barbeiro:</span>
                      <span className="text-white font-medium">{appt.barberName}</span>
                      <span>·</span>
                      <span>Duração: {appt.totalDuration} min</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-[#e5b842] tabular-nums font-display">
                      {formatCurrency(appt.totalPrice)}
                    </div>
                    <div>{getPaymentBadge(appt.paymentMethod, appt.paymentStatus)}</div>
                  </div>
                </div>

                {/* Date & Time pill */}
                <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-lg bg-[#0f121a] border border-[#1f2430] text-xs">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span className="capitalize">{formatDatePtBR(appt.date)}</span>
                  </div>
                  <span className="text-[#3a4459]">·</span>
                  <div className="flex items-center gap-1.5 text-white font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{appt.time}</span>
                  </div>
                </div>

                {/* Notes if available */}
                {appt.notes && (
                  <div className="text-xs text-[#9aa0a6] bg-[#12151e] p-2 rounded border border-[#212634]">
                    <span className="font-semibold text-[#c5c8d0]">Observações: </span>
                    {appt.notes}
                  </div>
                )}

                {/* Review section for completed appointments */}
                {appt.status === 'completed' && (
                  <div className="p-3 rounded-xl bg-[#12151e] border border-[#232938] space-y-2">
                    {appt.review ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#e5b842]">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < appt.review!.rating ? 'fill-current text-[#e5b842]' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-white tabular-nums">{appt.review.rating}.0</span>
                            <span className="text-[#9aa0a6] text-[11px]">· Sua avaliação registrada</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenReviewModal(appt)}
                            className="text-[11px] text-[#c5a059] hover:underline font-medium"
                          >
                            Editar
                          </button>
                        </div>

                        {appt.review.tags && appt.review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {appt.review.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-[#1a202c] border border-[#2d3748] text-[#c5c8d0] px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {appt.review.comment && (
                          <p className="text-[#9aa0a6] text-xs italic bg-[#0d1017] p-2 rounded border border-[#1a1f2b]">
                            "{appt.review.comment}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-white">Como foi sua experiência com {appt.barberName}?</div>
                          <div className="text-[11px] text-[#9aa0a6]">
                            Ajude a manter a excelência avaliando o corte e o profissional.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenReviewModal(appt)}
                          className="py-1.5 px-3 rounded-lg text-xs font-bold bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Avaliar Atendimento</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-[#212634] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={generateGoogleCalendarUrl(appt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#9aa0a6] hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1f2434] hover:bg-[#283046] transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Google Agenda</span>
                    </a>

                    <a
                      href={`https://wa.me/5511987654321?text=${encodeURIComponent(
                        `Olá! Gostaria de confirmar meu agendamento #${appt.id} no dia ${appt.date} às ${appt.time} com ${appt.barberName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#9aa0a6] hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1f2434] hover:bg-[#283046] transition-colors"
                    >
                      <span>WhatsApp da Barbearia</span>
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </a>
                  </div>

                  {appt.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja cancelar o agendamento #${appt.id}?`)) {
                          onCancelAppointment(appt.id);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
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
