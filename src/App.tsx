import React, { useState, useEffect } from 'react';
import { 
  Scissors, Calendar, Clock, MapPin, Phone, Star, User, 
  LogIn, LogOut, CheckCircle, Shield, Sparkles, ChevronRight, 
  Coffee, Wifi, Car, Compass, LayoutDashboard
} from 'lucide-react';
import { Barber, BarberService, Appointment, User as UserType } from './types';
import { 
  INITIAL_SERVICES, INITIAL_BARBERS, INITIAL_APPOINTMENTS, 
  DEMO_CLIENTS, BARBERSHOP_INFO 
} from './data/mockData';
import { formatCurrency } from './utils/helpers';
import { BookingWizard } from './components/BookingWizard';
import { BarberCard } from './components/BarberCard';
import { BarberModal } from './components/BarberModal';
import { LoginModal } from './components/LoginModal';
import { ClientAppointmentsModal } from './components/ClientAppointmentsModal';
import { BarberDashboardModal } from './components/BarberDashboardModal';
import { ServiceReviewModal } from './components/ServiceReviewModal';

export default function App() {
  // Persistence state
  const [services] = useState<BarberService[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const saved = localStorage.getItem('cavalheiro_barbers');
      return saved ? JSON.parse(saved) : INITIAL_BARBERS;
    } catch {
      return INITIAL_BARBERS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('cavalheiro_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    try {
      const saved = localStorage.getItem('cavalheiro_current_user');
      return saved ? JSON.parse(saved) : DEMO_CLIENTS[0]; // Default logged in as demo client Fernando Braga
    } catch {
      return DEMO_CLIENTS[0];
    }
  });

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeBarberModal, setActiveBarberModal] = useState<Barber | null>(null);
  const [appointmentForReview, setAppointmentForReview] = useState<Appointment | null>(null);

  // Selected for booking from other sections
  const [targetBarberForBooking, setTargetBarberForBooking] = useState<Barber | null>(null);
  const [serviceFilter, setServiceFilter] = useState<'all' | 'cabelo' | 'barba' | 'combos' | 'tratamentos'>('all');

  // Save barbers to localStorage
  useEffect(() => {
    localStorage.setItem('cavalheiro_barbers', JSON.stringify(barbers));
  }, [barbers]);

  // Save appointments to localStorage
  useEffect(() => {
    localStorage.setItem('cavalheiro_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Save user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cavalheiro_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cavalheiro_current_user');
    }
  }, [currentUser]);

  const handleBookingCompleted = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a))
    );
  };

  const handleUpdateStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, status } : a))
    );
  };

  const handleSaveReview = (
    appointmentId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    const targetAppt = appointments.find(a => a.id === appointmentId);
    const reviewObj = {
      id: `rev-${Date.now()}`,
      rating,
      comment,
      tags,
      createdAt: new Date().toISOString()
    };

    // Update appointment with review
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, review: reviewObj } : a))
    );

    // Update barber profile with new review and update average rating
    if (targetAppt) {
      setBarbers(prev =>
        prev.map(barber => {
          if (barber.id === targetAppt.barberId) {
            const newReviewItem = {
              id: reviewObj.id,
              clientName: targetAppt.clientName,
              rating,
              date: 'Hoje',
              service: targetAppt.services.map(s => s.name).join(' + '),
              comment: comment || 'Atendimento excelente na barbearia.'
            };
            const updatedReviews = [newReviewItem, ...barber.reviews];
            const newReviewCount = barber.reviewCount + 1;
            const newRating = Number(
              ((barber.rating * barber.reviewCount + rating) / newReviewCount).toFixed(2)
            );
            return {
              ...barber,
              rating: newRating,
              reviewCount: newReviewCount,
              reviews: updatedReviews
            };
          }
          return barber;
        })
      );
    }
  };

  const scrollToBooking = (barber?: Barber) => {
    if (barber) {
      setTargetBarberForBooking(barber);
    }
    const elem = document.getElementById('agendamento-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredServices = serviceFilter === 'all' 
    ? services 
    : services.filter(s => s.category === serviceFilter);

  const userActiveAppointmentsCount = appointments.filter(
    a => currentUser && 
      (a.clientEmail.toLowerCase() === currentUser.email.toLowerCase() || a.clientId === currentUser.id) &&
      (a.status === 'confirmed' || a.status === 'in_progress')
  ).length;

  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#e8eaed] font-sans">
      {/* ================= TOP BAR CONTRACT ================= */}
      {/* 3 Zones: Brand Title — 4 Nav Links — 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-[#0b0d11]/90 backdrop-blur-md border-b border-[#1f2430]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-5 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display flex items-center gap-2"
          >
            <span className="text-[#c5a059]">✦</span>
            <span>Cavalheiro Barber Club</span>
          </a>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#9aa0a6]">
            <a href="#servicos" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Serviços
            </a>
            <a href="#barbeiros" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Barbeiros
            </a>
            <a href="#agendamento-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Agendamento
            </a>
            <a href="#localizacao" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Unidade & Horários
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAppointmentsOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#181c28] hover:bg-[#202636] border border-[#272d3b] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span className="truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</span>
                  {userActiveAppointmentsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#c5a059] text-[#0b0d11] text-[10px] font-bold">
                      {userActiveAppointmentsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentUser(null)}
                  title="Sair da conta"
                  className="p-2 text-[#9aa0a6] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#181c28] hover:bg-[#202636] border border-[#272d3b] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => scrollToBooking()}
              className="px-4 py-2 text-xs font-bold text-[#0b0d11] bg-[#c5a059] hover:bg-[#d8b46b] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Agendar Horário
            </button>
          </div>
        </div>
      </header>

      {/* Barbershop Management Toolbar / Banner */}
      <div className="bg-[#12151e] border-b border-[#1c212c] px-5 py-2 text-xs text-[#9aa0a6]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Oscar Freire · Jardins</span>
            <span className="text-[#3a4459]">|</span>
            <span>Aberto hoje até as 20h30</span>
            <span className="text-[#3a4459]">|</span>
            <span>Estacionamento Cortesia</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDashboardOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#c5a059] hover:text-[#d8b46b] font-medium transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Modo Barbeiro & Painel do Dia</span>
          </button>
        </div>
      </div>

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#1f2430]">
          {/* Subtle Ambient Light Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c5a059]/10 via-[#c5a059]/0 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headlines & Value Prop */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                  <Scissors className="w-4 h-4" />
                  <span>Alta Barbearia & Visagismo Masculino</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-display text-balance">
                  A precisão da navalha com a comodidade do agendamento em tempo real.
                </h1>

                <p className="text-base text-[#9aa0a6] max-w-xl leading-relaxed">
                  Escolha o barbeiro de sua confiança, selecione o horário exclusivo na cadeira e pague de forma instantânea via Pix ou Cartão. Sem filas de espera e com padrão de excelência artesanal.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToBooking()}
                    className="py-3 px-6 rounded-xl bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-sm transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Meu Horário Agora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#barbeiros"
                    className="py-3 px-5 rounded-xl bg-[#161a25] hover:bg-[#1e2332] text-white border border-[#272d3b] text-sm font-semibold transition-colors"
                  >
                    Conhecer a Equipe
                  </a>
                </div>

                {/* Social Proof adjacency */}
                <div className="pt-4 border-t border-[#1f2430] flex flex-wrap items-center gap-6 text-xs text-[#9aa0a6]">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current text-[#e5b842]" />
                    <span className="font-bold text-white tabular-nums">4.96 / 5.0</span>
                    <span>(740+ avaliações no Google)</span>
                  </div>
                  <span>·</span>
                  <div>
                    <strong className="text-white">100%</strong> Pontualidade
                  </div>
                  <span>·</span>
                  <div>
                    Lâminas descartáveis & toalhas esterilizadas
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Studio Showcase */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#161a25] to-[#12151e] border border-[#272d3b] p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#212634]">
                    <div>
                      <div className="text-xs text-[#9aa0a6] uppercase tracking-wider">Cadeira Principal</div>
                      <div className="text-base font-bold text-white font-display">Diego "Navalha" Santos</div>
                    </div>
                    <span className="text-xs text-[#c5a059] font-mono font-medium bg-[#c5a059]/10 px-2 py-0.5 rounded">
                      Cadeira 1
                    </span>
                  </div>

                  {/* Stylized craft visual preview */}
                  <div className="rounded-xl bg-[#0f121a] p-4 border border-[#1f2430] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-medium">Degradê Low Fade + Barboterapia</span>
                      <span className="text-[#e5b842] font-mono font-bold">R$ 110,00</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1e2433] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#c5a059] to-[#e5b842] w-[75%]" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
                      <span>Duração: 75 minutos</span>
                      <span className="text-emerald-400">Próxima vaga hoje: 15h15</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#9aa0a6]">
                    <div className="p-2 rounded-lg bg-[#181c28] border border-[#232938] flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Espresso & Chopp</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#181c28] border border-[#232938] flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Wi-Fi de Alta Velocidade</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#181c28] border border-[#232938] flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Valet Cortesia</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#181c28] border border-[#232938] flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Biossegurança Máxima</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToBooking()}
                    className="w-full py-2.5 px-4 bg-[#1f2434] hover:bg-[#283046] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#2e364a]"
                  >
                    <span>Ver Todos os Horários de Hoje</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE BOOKING WIZARD ================= */}
        <section id="agendamento-section" className="py-16 md:py-20 max-w-5xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
              Agendamento Inteligente Online
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Reserve seu Atendimento
            </h2>
            <p className="text-xs md:text-sm text-[#9aa0a6]">
              Escolha seu corte, confirme o horário e receba o comprovante com pagamento via Pix ou Cartão.
            </p>
          </div>

          <BookingWizard
            services={services}
            barbers={barbers}
            existingAppointments={appointments}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenBarberProfile={(b) => setActiveBarberModal(b)}
            onBookingCompleted={handleBookingCompleted}
            initialSelectedBarber={targetBarberForBooking}
          />
        </section>

        {/* ================= BARBER PROFILES SHOWCASE ================= */}
        <section id="barbeiros" className="py-16 md:py-20 border-t border-[#1f2430] bg-[#0e1017]">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                  Mestres Barbeiros
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display mt-1">
                  Nossos Profissionais de Destaque
                </h2>
                <p className="text-xs md:text-sm text-[#9aa0a6] mt-1 max-w-lg">
                  Clique em "Ver Perfil" para conferir a bio, histórico, fotos do portfólio e depoimentos de outros clientes.
                </p>
              </div>

              <div className="text-xs text-[#9aa0a6]">
                3 cadeiras ativas · Atendimento individualizado
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onSelect={(b) => scrollToBooking(b)}
                  onViewProfile={(b) => setActiveBarberModal(b)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= SERVICES CATALOG ================= */}
        <section id="servicos" className="py-16 md:py-20 border-t border-[#1f2430]">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                  Cardápio de Serviços
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display mt-1">
                  Procedimentos & Rituais de Cuidado
                </h2>
                <p className="text-xs md:text-sm text-[#9aa0a6] mt-1 max-w-lg">
                  Cortes na tesoura, degradês precisos, barboterapia com óleos essenciais e tratamentos reconstrutores.
                </p>
              </div>

              {/* Functional Category Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#141720] border border-[#272d3b] rounded-xl overflow-x-auto">
                {(['all', 'cabelo', 'barba', 'combos', 'tratamentos'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setServiceFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap capitalize ${
                      serviceFilter === cat
                        ? 'bg-[#c5a059] text-[#0b0d11]'
                        : 'text-[#9aa0a6] hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-xl bg-[#141720] border border-[#272d3b] hover:border-[#3a4358] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white font-display">
                        {srv.name}
                      </h3>
                      <span className="text-base font-bold text-[#e5b842] tabular-nums font-display shrink-0">
                        {formatCurrency(srv.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
                      <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{srv.duration} min</span>
                      <span>·</span>
                      <span className="capitalize">{srv.category}</span>
                    </div>

                    <p className="text-xs text-[#9aa0a6] leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="pt-2 space-y-1">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="text-[11px] text-[#c5c8d0] flex items-center gap-1.5">
                          <span className="text-[#c5a059]">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#212634]">
                    <button
                      type="button"
                      onClick={() => scrollToBooking()}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#272d3b] hover:bg-[#343c4e] text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Agendar Este Serviço</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LOCATION & INFO ================= */}
        <section id="localizacao" className="py-16 md:py-20 border-t border-[#1f2430] bg-[#0c0e14]">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                  Nossa Barbearia
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
                  Localização & Experiência
                </h2>
                <p className="text-xs md:text-sm text-[#9aa0a6] leading-relaxed">
                  Localizada em um dos pontos mais nobres dos Jardins em São Paulo, a Cavalheiro Barber Club une a arte tradicional da barbearia clássica a um ambiente contemporâneo, exclusivo e relaxante.
                </p>

                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-center gap-2.5 text-[#c5c8d0]">
                    <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span>{BARBERSHOP_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#c5c8d0]">
                    <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span>{BARBERSHOP_INFO.phone} · WhatsApp: {BARBERSHOP_INFO.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#c5c8d0]">
                    <Clock className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span>{BARBERSHOP_INFO.hours}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  {BARBERSHOP_INFO.amenities.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-[#161a25] border border-[#272d3b] text-[#9aa0a6] px-3 py-1 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map Preview Box */}
              <div className="p-6 rounded-2xl bg-[#141720] border border-[#272d3b] space-y-4">
                <div className="flex items-center justify-between border-b border-[#212634] pb-3">
                  <div>
                    <div className="text-sm font-bold text-white font-display">Jardins · São Paulo</div>
                    <div className="text-xs text-[#9aa0a6]">Próximo ao Metrô Oscar Freire (Linha 4 - Amarela)</div>
                  </div>
                  <Compass className="w-5 h-5 text-[#c5a059]" />
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#1f2430] space-y-2 text-xs text-[#9aa0a6]">
                  <div className="text-white font-medium">Como chegar:</div>
                  <div>· Estacionamento gratuito com manobrista na porta.</div>
                  <div>· A 3 minutos a pé da estação de metrô Oscar Freire.</div>
                  <div>· Lounge com sinuca e bar aberto para todos os clientes agendados.</div>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToBooking()}
                  className="w-full py-3 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-xs rounded-xl transition-colors shadow-md"
                >
                  Agendar Agora com Confirmação Imediata
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#1f2430] bg-[#090b0e] py-8 text-xs text-[#9aa0a6]">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-display font-semibold">
            <span className="text-[#c5a059]">✦</span>
            <span>Cavalheiro Barber Club & Grooming</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#9aa0a6]">
            <span>© 2026 Todos os direitos reservados</span>
            <span>·</span>
            <span>Agendamento & Pagamento Integrado</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDashboardOpen(true)}
            className="text-xs text-[#c5a059] hover:underline"
          >
            Painel Administrativo da Barbearia
          </button>
        </div>
      </footer>

      {/* ================= MODALS ================= */}
      <BarberModal
        barber={activeBarberModal}
        isOpen={!!activeBarberModal}
        onClose={() => setActiveBarberModal(null)}
        onSelectForBooking={(barber) => scrollToBooking(barber)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(user) => setCurrentUser(user)}
      />

      <ClientAppointmentsModal
        isOpen={isAppointmentsOpen}
        onClose={() => setIsAppointmentsOpen(false)}
        currentUser={currentUser}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onOpenReviewModal={(appt) => setAppointmentForReview(appt)}
      />

      <ServiceReviewModal
        appointment={appointmentForReview}
        isOpen={!!appointmentForReview}
        onClose={() => setAppointmentForReview(null)}
        onSubmitReview={handleSaveReview}
      />

      <BarberDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        barbers={barbers}
        appointments={appointments}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
