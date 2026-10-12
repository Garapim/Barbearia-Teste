import { Appointment, Barber, BarberService } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDatePtBR = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).format(date);
};

export const getNextDays = (count = 14) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Seg...
    const weekdayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d).replace('.', '');
    const dayOfMonth = d.getDate();
    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d).replace('.', '');

    days.push({
      dateStr,
      dayOfWeek,
      weekdayName: weekdayName.toUpperCase(),
      dayOfMonth,
      monthName,
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }
  return days;
};

export interface SlotInfo {
  time: string;
  period: 'manha' | 'tarde' | 'noite';
  available: boolean;
  reason?: string;
}

export const generateTimeSlotsForDate = (
  dateStr: string,
  barber: Barber | null,
  existingAppointments: Appointment[]
): SlotInfo[] => {
  const allSlots: { time: string; period: 'manha' | 'tarde' | 'noite' }[] = [
    // Manhã
    { time: '09:00', period: 'manha' },
    { time: '09:45', period: 'manha' },
    { time: '10:30', period: 'manha' },
    { time: '11:15', period: 'manha' },
    // Tarde
    { time: '13:00', period: 'tarde' },
    { time: '13:45', period: 'tarde' },
    { time: '14:30', period: 'tarde' },
    { time: '15:15', period: 'tarde' },
    { time: '16:00', period: 'tarde' },
    { time: '16:45', period: 'tarde' },
    { time: '17:30', period: 'tarde' },
    // Noite
    { time: '18:15', period: 'noite' },
    { time: '19:00', period: 'noite' },
    { time: '19:45', period: 'noite' }
  ];

  // If barber has specific work days
  if (barber) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    if (!barber.workDays.includes(dayOfWeek)) {
      return allSlots.map(s => ({
        ...s,
        available: false,
        reason: 'Folga do barbeiro neste dia'
      }));
    }
  }

  // Check booked slots for this date and barber
  const bookedTimes = new Set(
    existingAppointments
      .filter(a => a.date === dateStr && a.status !== 'cancelled' && (!barber || a.barberId === barber.id))
      .map(a => a.time)
  );

  return allSlots.map(slot => {
    const isBooked = bookedTimes.has(slot.time);
    return {
      time: slot.time,
      period: slot.period,
      available: !isBooked,
      reason: isBooked ? 'Horário já reservado' : undefined
    };
  });
};

export const generatePixCode = (appointmentId: string, amount: number): string => {
  const cleanAmount = amount.toFixed(2);
  return `00020126580014br.gov.bcb.pix0136barbeariacavalheiro@pix.com.br520400005303986540${cleanAmount.length < 10 ? '0' + cleanAmount.length : cleanAmount}${cleanAmount}5802BR5923CAVALHEIRO BARBER CLUB6009SAO PAULO62170513${appointmentId}6304E8A2`;
};

export const generateGoogleCalendarUrl = (appointment: Appointment): string => {
  const [year, month, day] = appointment.date.split('-');
  const [hours, minutes] = appointment.time.split(':');
  
  const start = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  const end = new Date(start.getTime() + appointment.totalDuration * 60000);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatUtc = (d: Date) => 
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const title = encodeURIComponent(`Agendamento - ${appointment.services.map(s => s.name).join(' + ')} (${appointment.barberName})`);
  const details = encodeURIComponent(
    `Barbearia Cavalheiro Barber Club\nProfissional: ${appointment.barberName}\nValor: ${formatCurrency(appointment.totalPrice)}\nEndereço: Rua Oscar Freire, 1420 - Jardins, São Paulo\nCódigo: ${appointment.id}`
  );
  const location = encodeURIComponent('Rua Oscar Freire, 1420 - Jardins, São Paulo - SP');
  const dates = `${formatUtc(start)}/${formatUtc(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
};
