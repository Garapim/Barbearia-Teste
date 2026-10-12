import React, { useState } from 'react';
import { 
  Calendar, Clock, User as UserIcon, Check, ChevronRight, ChevronLeft, 
  Sparkles, CreditCard, QrCode, Building, ShieldCheck, MapPin, 
  CalendarPlus, ExternalLink, Scissors, AlertCircle, ArrowRight
} from 'lucide-react';
import { Barber, BarberService, Appointment, User, BookingStep } from '../types';
import { 
  formatCurrency, formatDatePtBR, getNextDays, 
  generateTimeSlotsForDate, generatePixCode, generateGoogleCalendarUrl 
} from '../utils/helpers';
import { ServiceCard } from './ServiceCard';
import { BarberCard } from './BarberCard';
import { PixQrCode } from './PixQrCode';
import { CreditCardForm } from './CreditCardForm';
import { BARBERSHOP_INFO } from '../data/mockData';

interface BookingWizardProps {
  services: BarberService[];
  barbers: Barber[];
  existingAppointments: Appointment[];
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenBarberProfile: (barber: Barber) => void;
  onBookingCompleted: (appointment: Appointment) => void;
  initialSelectedBarber?: Barber | null;
  initialSelectedService?: BarberService | null;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  barbers,
  existingAppointments,
  currentUser,
  onOpenLogin,
  onOpenBarberProfile,
  onBookingCompleted,
  initialSelectedBarber = null,
  initialSelectedService = null
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  
  // Selection States
  const [selectedServices, setSelectedServices] = useState<BarberService[]>(
    initialSelectedService ? [initialSelectedService] : [services[0]]
  );
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(
    initialSelectedBarber || barbers[0]
  );
  
  // Date and Time
  const nextDays = getNextDays(14);
  const [selectedDate, setSelectedDate] = useState<string>(nextDays[0].dateStr);
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  
  // Client identification
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'barbearia'>('pix');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Sync client details if current user changes
  React.useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientEmail(currentUser.email);
      setClientPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Totals calculation
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Slots calculation
  const timeSlots = generateTimeSlotsForDate(selectedDate, selectedBarber, existingAppointments);

  const toggleService = (service: BarberService) => {
    if (selectedServices.some(s => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleCreateAppointment = (
    method: 'pix' | 'credit_card' | 'barbearia',
    status: Appointment['status'],
    paymentStatus: Appointment['paymentStatus'],
    cardLastDigits?: string
  ) => {
    const apptId = `APPT-${Math.floor(1000 + Math.random() * 9000)}`;
    const pixCode = generatePixCode(apptId, totalPrice);

    const newAppointment: Appointment = {
      id: apptId,
      clientId: currentUser?.id || `client-${Date.now()}`,
      clientName: clientName.trim() || 'Cliente Cavalheiro',
      clientEmail: clientEmail.trim() || 'cliente@exemplo.com',
      clientPhone: clientPhone.trim() || '(11) 98765-4321',
      barberId: selectedBarber?.id || 'barber-diego',
      barberName: selectedBarber?.name || 'Diego Santos',
      services: selectedServices,
      date: selectedDate,
      time: selectedTime,
      totalPrice,
      totalDuration,
      paymentMethod: method,
      paymentStatus,
      status,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      pixQrCodePayload: pixCode,
      cardLastDigits
    };

    setCreatedAppointment(newAppointment);
    onBookingCompleted(newAppointment);
    setCurrentStep('confirmation');
  };

  return (
    <div className="bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-xl overflow-hidden">
      {/* Step Progress Navigation */}
      <div className="px-5 py-4 bg-[#151924] border-b border-[#212634] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] text-xs">
          <button
            onClick={() => setCurrentStep('services')}
            className={`flex items-center gap-2 font-medium transition-colors ${
              currentStep === 'services'
                ? 'text-[#c5a059]'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              currentStep === 'services' ? 'bg-[#c5a059] text-[#0b0d11]' : 'bg-[#222938] text-white'
            }`}>1</span>
            <span>Serviços ({selectedServices.length})</span>
          </button>

          <div className="w-8 h-[1px] bg-[#272d3b]" />

          <button
            onClick={() => setCurrentStep('barber')}
            className={`flex items-center gap-2 font-medium transition-colors ${
              currentStep === 'barber'
                ? 'text-[#c5a059]'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              currentStep === 'barber' ? 'bg-[#c5a059] text-[#0b0d11]' : 'bg-[#222938] text-white'
            }`}>2</span>
            <span>Barbeiro ({selectedBarber ? selectedBarber.name.split(' ')[0] : 'Qualquer'})</span>
          </button>

          <div className="w-8 h-[1px] bg-[#272d3b]" />

          <button
            onClick={() => setCurrentStep('datetime')}
            className={`flex items-center gap-2 font-medium transition-colors ${
              currentStep === 'datetime'
                ? 'text-[#c5a059]'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              currentStep === 'datetime' ? 'bg-[#c5a059] text-[#0b0d11]' : 'bg-[#222938] text-white'
            }`}>3</span>
            <span>Data e Horário</span>
          </button>

          <div className="w-8 h-[1px] bg-[#272d3b]" />

          <button
            onClick={() => setCurrentStep('checkout')}
            className={`flex items-center gap-2 font-medium transition-colors ${
              currentStep === 'checkout'
                ? 'text-[#c5a059]'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              currentStep === 'checkout' ? 'bg-[#c5a059] text-[#0b0d11]' : 'bg-[#222938] text-white'
            }`}>4</span>
            <span>Pagamento Integrado</span>
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-5 md:p-8">
        {/* ================= STEP 1: SERVICES ================= */}
        {currentStep === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                  Selecione os Serviços Desejados
                </h2>
                <p className="text-xs md:text-sm text-[#9aa0a6] mt-1">
                  Você pode combinar múltiplos procedimentos para realizar no mesmo horário.
                </p>
              </div>

              {/* Selection Summary Pill */}
              <div className="bg-[#181c28] border border-[#272d3b] rounded-xl px-4 py-2.5 text-right flex items-center justify-between md:justify-end gap-4">
                <div className="text-left md:text-right">
                  <div className="text-[11px] text-[#9aa0a6]">Tempo total previsto</div>
                  <div className="text-sm font-semibold text-white font-mono">{totalDuration} minutos</div>
                </div>
                <div className="border-l border-[#272d3b] pl-4">
                  <div className="text-[11px] text-[#9aa0a6]">Subtotal</div>
                  <div className="text-lg font-bold text-[#e5b842] tabular-nums font-display">
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  isSelected={selectedServices.some(s => s.id === srv.id)}
                  onToggle={toggleService}
                />
              ))}
            </div>

            {/* Bottom Next Bar */}
            <div className="pt-4 border-t border-[#212634] flex items-center justify-between">
              <div className="text-xs text-[#9aa0a6]">
                {selectedServices.length} {selectedServices.length === 1 ? 'serviço selecionado' : 'serviços selecionados'}
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep('barber')}
                className="py-3 px-6 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Escolher Barbeiro</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: BARBER ================= */}
        {currentStep === 'barber' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                  Escolha o Seu Barbeiro
                </h2>
                <p className="text-xs md:text-sm text-[#9aa0a6] mt-1">
                  Profissionais mestres em visagismo, lâmina tradicional e cortes modernos.
                </p>
              </div>

              <div className="text-xs text-[#9aa0a6]">
                Barbeiro atual: <strong className="text-white">{selectedBarber?.name}</strong>
              </div>
            </div>

            {/* Barber Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  isSelected={selectedBarber?.id === barber.id}
                  onSelect={(b) => setSelectedBarber(b)}
                  onViewProfile={onOpenBarberProfile}
                />
              ))}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-4 border-t border-[#212634] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('services')}
                className="py-2.5 px-4 bg-[#1e2332] hover:bg-[#272d3f] text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar aos Serviços</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('datetime')}
                className="py-3 px-6 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Escolher Data & Horário</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DATE & TIME ================= */}
        {currentStep === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                Escolha o Dia e Horário
              </h2>
              <p className="text-xs md:text-sm text-[#9aa0a6] mt-1">
                Agenda oficial em tempo real para a cadeira de <strong className="text-white">{selectedBarber?.name}</strong>.
              </p>
            </div>

            {/* Horizontal Day Selector (14 days) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold mb-3">
                1. Selecione o Dia:
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {nextDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        // Reset slot if not available
                      }}
                      className={`min-w-[76px] py-3 px-2 rounded-xl border flex flex-col items-center transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#c5a059] border-[#c5a059] text-[#0b0d11] shadow-lg shadow-[#c5a059]/10 font-bold'
                          : 'bg-[#161a25] border-[#272d3b] hover:border-[#3d455b] text-[#9aa0a6] hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] tracking-wider uppercase font-medium">
                        {day.weekdayName}
                      </span>
                      <span className="text-xl font-display font-bold my-0.5 tabular-nums">
                        {day.dayOfMonth}
                      </span>
                      <span className="text-[10px] tracking-wide uppercase opacity-80">
                        {day.monthName}
                      </span>
                      {day.isToday && (
                        <span className={`text-[9px] uppercase tracking-wider font-semibold mt-1 px-1 rounded ${
                          isSelected ? 'bg-black/20 text-[#0b0d11]' : 'bg-[#272d3b] text-[#c5a059]'
                        }`}>
                          Hoje
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker Divided by Shifts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                  2. Horários Disponíveis para <span className="text-white capitalize">{formatDatePtBR(selectedDate)}</span>:
                </label>
                <span className="text-xs text-[#9aa0a6]">
                  Duração estimada: <strong className="text-white font-mono">{totalDuration} min</strong>
                </span>
              </div>

              {/* Shifts: Manhã, Tarde, Noite */}
              {(['manha', 'tarde', 'noite'] as const).map((period) => {
                const slotsInPeriod = timeSlots.filter(s => s.period === period);
                if (slotsInPeriod.length === 0) return null;

                const periodNames = {
                  manha: 'Manhã (09h às 12h)',
                  tarde: 'Tarde (13h às 18h)',
                  noite: 'Noite (18h às 20h30)'
                };

                return (
                  <div key={period} className="p-4 rounded-xl bg-[#161a25] border border-[#272d3b] space-y-3">
                    <div className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{periodNames[period]}</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {slotsInPeriod.map((slot) => {
                        const isChosen = selectedTime === slot.time && slot.available;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                              !slot.available
                                ? 'bg-[#10131a] text-[#4b5563] cursor-not-allowed line-through border border-transparent'
                                : isChosen
                                ? 'bg-[#c5a059] text-[#0b0d11] font-bold shadow-md shadow-[#c5a059]/10 ring-1 ring-[#c5a059]'
                                : 'bg-[#1e2332] text-white hover:bg-[#272d3f] border border-[#2e364a]'
                            }`}
                            title={slot.reason || 'Disponível'}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-4 border-t border-[#212634] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('barber')}
                className="py-2.5 px-4 bg-[#1e2332] hover:bg-[#272d3f] text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao Barbeiro</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('checkout')}
                className="py-3 px-6 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Ir para Pagamento ({formatCurrency(totalPrice)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CHECKOUT & INTEGRATED PAYMENT ================= */}
        {currentStep === 'checkout' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                Identificação & Pagamento Integrado
              </h2>
              <p className="text-xs md:text-sm text-[#9aa0a6] mt-1">
                Revise seu agendamento, informe seus dados de contato e escolha sua forma de pagamento.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Client Details + Booking Summary */}
              <div className="lg:col-span-6 space-y-5">
                {/* Order Summary Box */}
                <div className="p-4 rounded-xl bg-[#161a25] border border-[#272d3b] space-y-3">
                  <div className="text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold flex items-center justify-between">
                    <span>Resumo do Agendamento</span>
                    <span className="text-[#c5a059]">{totalDuration} min no total</span>
                  </div>

                  <div className="space-y-2 border-y border-[#212634] py-3">
                    {selectedServices.map(srv => (
                      <div key={srv.id} className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{srv.name}</span>
                        <span className="text-[#e5b842] font-mono tabular-nums">{formatCurrency(srv.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 text-xs text-[#9aa0a6]">
                    <div className="flex items-center justify-between">
                      <span>Barbeiro Responsável:</span>
                      <strong className="text-white">{selectedBarber?.name} (Cadeira {selectedBarber?.chairNumber})</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data & Horário:</span>
                      <strong className="text-white capitalize font-mono">
                        {formatDatePtBR(selectedDate)} às {selectedTime}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#212634] flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total a Pagar:</span>
                    <span className="text-xl font-extrabold text-[#e5b842] font-display tabular-nums">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Client Identification Form */}
                <div className="p-4 rounded-xl bg-[#161a25] border border-[#272d3b] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                      Dados do Cliente
                    </span>
                    {!currentUser && (
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="text-xs text-[#c5a059] hover:underline font-medium"
                      >
                        Já tem conta? Fazer Login
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Fernando Braga"
                        className="w-full bg-[#11141c] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                          WhatsApp / Telefone *
                        </label>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="(11) 98765-4321"
                          className="w-full bg-[#11141c] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                          E-mail para Confirmação *
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="seuemail@exemplo.com"
                          className="w-full bg-[#11141c] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                        Observação para o Barbeiro (Opcional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Cabelo ralo na coroa, quero degradê bem baixo, etc."
                        className="w-full bg-[#11141c] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Methods */}
              <div className="lg:col-span-6 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                  Escolha a Forma de Pagamento Integrada:
                </label>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-[#181c28] border-[#c5a059] text-white ring-1 ring-[#c5a059]'
                        : 'bg-[#141720] border-[#272d3b] text-[#9aa0a6] hover:text-white'
                    }`}
                  >
                    <QrCode className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-[#00b494]' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold">PIX Instantâneo</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Aprovação imediata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'bg-[#181c28] border-[#c5a059] text-white ring-1 ring-[#c5a059]'
                        : 'bg-[#141720] border-[#272d3b] text-[#9aa0a6] hover:text-white'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'credit_card' ? 'text-[#c5a059]' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold">Cartão de Crédito</span>
                    <span className="text-[10px] text-[#9aa0a6]">Até 3x sem juros</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('barbearia')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'barbearia'
                        ? 'bg-[#181c28] border-[#c5a059] text-white ring-1 ring-[#c5a059]'
                        : 'bg-[#141720] border-[#272d3b] text-[#9aa0a6] hover:text-white'
                    }`}
                  >
                    <Building className={`w-5 h-5 ${paymentMethod === 'barbearia' ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold">Pagar no Local</span>
                    <span className="text-[10px] text-[#9aa0a6]">No balcão</span>
                  </button>
                </div>

                {/* Active Payment View */}
                {paymentMethod === 'pix' && (
                  <PixQrCode
                    code={generatePixCode('APPT-TEMP', totalPrice)}
                    amount={totalPrice}
                    appointmentId="APPT-TEMP"
                    onPaymentConfirmed={() =>
                      handleCreateAppointment('pix', 'confirmed', 'paid')
                    }
                  />
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="bg-[#141720] border border-[#272d3b] rounded-xl p-5">
                    <CreditCardForm
                      amount={totalPrice}
                      onPaymentConfirmed={(lastDigits) =>
                        handleCreateAppointment('credit_card', 'confirmed', 'paid', lastDigits)
                      }
                    />
                  </div>
                )}

                {paymentMethod === 'barbearia' && (
                  <div className="bg-[#141720] border border-[#272d3b] rounded-xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                      <Building className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        Garantir Agendamento e Pagar na Recepção
                      </h4>
                      <p className="text-xs text-[#9aa0a6] mt-1 max-w-sm mx-auto">
                        Seu horário com {selectedBarber?.name} ficará reservado exclusivamente para você. O pagamento de {formatCurrency(totalPrice)} poderá ser feito em dinheiro, débito, crédito ou Pix na barbearia.
                      </p>
                    </div>

                    <div className="p-3 bg-[#0f121a] rounded-lg text-xs text-[#9aa0a6] border border-[#1f2430] text-left space-y-1">
                      <div className="text-white font-medium">Condições da reserva presencial:</div>
                      <div>· Chegar com 5 minutos de antecedência.</div>
                      <div>· Tolerância máxima de 10 minutos para não atrasar a cadeira seguinte.</div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCreateAppointment('barbearia', 'confirmed', 'pay_on_arrival')
                      }
                      className="w-full py-3 px-4 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirmar Reserva com Pagamento no Local</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="pt-4 border-t border-[#212634] flex items-center justify-start">
              <button
                type="button"
                onClick={() => setCurrentStep('datetime')}
                className="py-2.5 px-4 bg-[#1e2332] hover:bg-[#272d3f] text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao Horário</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: CONFIRMATION & RECEIPT ================= */}
        {currentStep === 'confirmation' && createdAppointment && (
          <div className="space-y-6 max-w-xl mx-auto text-center py-4">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-mono font-semibold text-[#c5a059] uppercase tracking-wider">
                Reserva #{createdAppointment.id}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display mt-1">
                Agendamento Confirmado com Sucesso!
              </h2>
              <p className="text-xs md:text-sm text-[#9aa0a6] mt-2">
                Obrigado, <strong className="text-white">{createdAppointment.clientName}</strong>! Seu horário na cadeira de <strong className="text-white">{createdAppointment.barberName}</strong> está garantido.
              </p>
            </div>

            {/* Digital Voucher Receipt */}
            <div className="bg-[#161a25] border border-[#272d3b] rounded-2xl p-5 md:p-6 text-left space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c5a059] via-emerald-400 to-[#c5a059]" />

              <div className="flex items-center justify-between border-b border-[#212634] pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#9aa0a6]">Estabelecimento</span>
                  <div className="text-sm font-bold text-white font-display">{BARBERSHOP_INFO.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#9aa0a6]">Código do Voucher</span>
                  <div className="text-sm font-mono font-bold text-[#c5a059]">#{createdAppointment.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#9aa0a6]">Data:</span>
                  <div className="font-semibold text-white capitalize mt-0.5">
                    {formatDatePtBR(createdAppointment.date)}
                  </div>
                </div>
                <div>
                  <span className="text-[#9aa0a6]">Horário Reservado:</span>
                  <div className="font-semibold text-white font-mono mt-0.5">
                    {createdAppointment.time} ({createdAppointment.totalDuration} min)
                  </div>
                </div>
                <div>
                  <span className="text-[#9aa0a6]">Profissional:</span>
                  <div className="font-semibold text-white mt-0.5">
                    {createdAppointment.barberName}
                  </div>
                </div>
                <div>
                  <span className="text-[#9aa0a6]">Status do Pagamento:</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    {createdAppointment.paymentStatus === 'paid' ? 'Aprovado & Quitado' : 'Pagamento no Local'}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#212634] pt-3">
                <span className="text-xs text-[#9aa0a6]">Serviços Inclusos:</span>
                <div className="text-xs font-semibold text-white mt-1">
                  {createdAppointment.services.map(s => s.name).join(' + ')}
                </div>
              </div>

              <div className="border-t border-[#212634] pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#9aa0a6]">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{BARBERSHOP_INFO.address}</span>
                </div>
                <div className="text-sm font-bold text-[#e5b842] tabular-nums font-display">
                  {formatCurrency(createdAppointment.totalPrice)}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={generateGoogleCalendarUrl(createdAppointment)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 bg-[#1f2434] hover:bg-[#283046] text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#2e364a]"
              >
                <CalendarPlus className="w-4 h-4 text-[#c5a059]" />
                <span>Salvar no Google Agenda</span>
              </a>

              <a
                href={`https://wa.me/5511987654321?text=${encodeURIComponent(
                  `Olá! Meu nome é ${createdAppointment.clientName} e confirmei meu agendamento #${createdAppointment.id} no dia ${createdAppointment.date} às ${createdAppointment.time} com ${createdAppointment.barberName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Receber no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep('services');
                  setCreatedAppointment(null);
                }}
                className="w-full sm:w-auto py-2.5 px-4 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-xs rounded-xl transition-colors"
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
