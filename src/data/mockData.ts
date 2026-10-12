import { Barber, BarberService, Appointment, User } from '../types';

export const INITIAL_SERVICES: BarberService[] = [
  {
    id: 'srv-combo-vip',
    name: 'Combo VIP: Corte + Barba + Sobrancelha',
    category: 'combos',
    description: 'A experiência completa Cavalheiro. Corte moderno ou clássico, toalha quente com massagem facial na barba e alinhamento de sobrancelha.',
    price: 110,
    duration: 75,
    popular: true,
    features: ['Lavagem com shampoo mentolado', 'Modelagem e finalização premium', 'Toalha quente aromática e navalha descartável', 'Alinhamento na tesoura/pinça']
  },
  {
    id: 'srv-corte-fade',
    name: 'Corte Degradê & Visagismo',
    category: 'cabelo',
    description: 'Fade milimétrico (Low, Mid, High ou Taper Fade) com consultoria visagista adequada ao formato do seu rosto e acabamento com navalha.',
    price: 65,
    duration: 45,
    popular: true,
    features: ['Análise de formato do rosto', 'Degradê na tesoura e máquina', 'Lavagem e secagem', 'Penteado com pomada fosca ou efeito brilho']
  },
  {
    id: 'srv-barboterapia',
    name: 'Barboterapia & Toalha Quente',
    category: 'barba',
    description: 'Ritual clássico italiano com óleos essenciais, duas toalhas quentes, creme amaciante, navalha afiada e massagem estimulante.',
    price: 55,
    duration: 40,
    popular: true,
    features: ['Vapor de ozônio e óleos essenciais', 'Navalhete com lâmina 100% descartável', 'Bálsamo pós-barba refrescante', 'Massagem facial relaxante']
  },
  {
    id: 'srv-corte-classico',
    name: 'Corte Tradicional na Tesoura',
    category: 'cabelo',
    description: 'Corte refinado 100% manual na tesoura para cavalheiros que preferem elegância atemporal, volume controlado e linhas sóbrias.',
    price: 60,
    duration: 45,
    features: ['Alinhamento minucioso na tesoura', 'Pézinho alinhado na navalha', 'Lavagem com massagem craniana', 'Secagem e fixador suave']
  },
  {
    id: 'srv-barba-express',
    name: 'Barba Express Alinhada',
    category: 'barba',
    description: 'Aparo de volume com máquina e alinhamento rápido das bochechas e pescoço na navalha para quem está com o tempo contado.',
    price: 38,
    duration: 25,
    features: ['Aparação uniforme na máquina', 'Marcação das linhas na lâmina', 'Loção pós-barba calmante']
  },
  {
    id: 'srv-combo-master',
    name: 'Combo Master: Corte + Barba + Hidratação',
    category: 'combos',
    description: 'Transformação premium total. Inclui corte, barboterapia e hidratação profunda reconstrutora com máscara de carvão ativado.',
    price: 150,
    duration: 90,
    features: ['Corte completo com lavagem', 'Barboterapia relaxante', 'Máscara capilar regeneradora', 'Café especial ou cerveja artesanal cortesia']
  },
  {
    id: 'srv-selagem',
    name: 'Selagem Orgânica Antifrizz',
    category: 'tratamentos',
    description: 'Alinhamento térmico de redução de volume sem formol. Deixa o cabelo alinhado, macio e com brilho natural sem danificar a raiz.',
    price: 95,
    duration: 60,
    features: ['Produto orgânico livre de formol', 'Redução de volume e frizz rebelde', 'Durabilidade média de até 60 dias']
  },
  {
    id: 'srv-pigmentacao',
    name: 'Camuflagem & Pigmentação de Barba',
    category: 'tratamentos',
    description: 'Tonalização precisa para disfarçar falhas e fios brancos com efeito ultra natural e acabamento de alta definição.',
    price: 50,
    duration: 30,
    features: ['Cor personalizada para seu tom', 'Não mancha a pele', 'Aspecto denso e uniforme']
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-diego',
    name: 'Diego Santos',
    nickname: 'Diego Navalha',
    role: 'Master Barber & Visagista',
    experience: '9 anos',
    rating: 4.98,
    reviewCount: 248,
    bio: 'Formado pelas melhores academias de barbearia de São Paulo e Londres. Especialista em visagismo facial masculino e degradês limpos com acabamento cirúrgico.',
    specialties: ['Degradê Americano', 'Visagismo Masculino', 'Tesoura Clássica', 'Penteados Pompadour'],
    avatarUrl: '',
    chairNumber: 1,
    workDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
    workHours: { start: '09:00', end: '20:00' },
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Rodrigo Medeiros',
        rating: 5,
        date: 'Ontem',
        service: 'Combo VIP: Corte + Barba + Sobrancelha',
        comment: 'Atendimento de outro nível! O Diego entendeu perfeitamente o corte que combinava com meu rosto. A barboterapia é relaxamento puro.'
      },
      {
        id: 'rev-2',
        clientName: 'Guilherme Salles',
        rating: 5,
        date: 'Há 3 dias',
        service: 'Corte Degradê & Visagismo',
        comment: 'Degradê impecável, sem marcação nenhuma. Barbeiro muito pontual e lugar com ambiente incrível.'
      },
      {
        id: 'rev-3',
        clientName: 'Felipe Santana',
        rating: 5,
        date: 'Há 1 semana',
        service: 'Barboterapia & Toalha Quente',
        comment: 'Melhor barba de São Paulo. A toalha quente e a massagem facial fazem toda a diferença.'
      }
    ],
    portfolio: [
      { id: 'p1', title: 'Mid Fade Texturizado', style: 'Corte Moderno', description: 'Degradê médio com topo em mechas desestruturadas e pomada mate.' },
      { id: 'p2', title: 'Barba Lenhador Alinhada', style: 'Barboterapia', description: 'Alinhamento cirúrgico de mandíbula com gradiente lateral limpo.' },
      { id: 'p3', title: 'Executive Contour Clássico', style: 'Old School', description: 'Corte executivo na tesoura com divisão lateral marcada na lâmina.' }
    ]
  },
  {
    id: 'barber-rafael',
    name: 'Rafael Oliveira',
    nickname: 'Rafa Fade',
    role: 'Especialista em Fades & Freestyle',
    experience: '6 anos',
    rating: 4.94,
    reviewCount: 182,
    bio: 'Referência em cortes urbanos, Low Fade, Taper Fade, linhas nítidas e texturas modernas. Atento aos mínimos detalhes com navalha e tesoura desfiadeira.',
    specialties: ['Taper Fade', 'Low Fade', 'Freestyle / Desenhos', 'Texturização Francesa'],
    avatarUrl: '',
    chairNumber: 2,
    workDays: [1, 2, 3, 4, 5, 6],
    workHours: { start: '09:30', end: '19:30' },
    reviews: [
      {
        id: 'rev-4',
        clientName: 'Marcelo Castro',
        rating: 5,
        date: 'Há 2 dias',
        service: 'Corte Degradê & Visagismo',
        comment: 'O Rafa é monstro no fade! Cabelo ficou sensacional, recebi elogio no trabalho o dia todo.'
      },
      {
        id: 'rev-5',
        clientName: 'Eduardo Lima',
        rating: 5,
        date: 'Há 4 dias',
        service: 'Combo VIP: Corte + Barba + Sobrancelha',
        comment: 'Muito cuidadoso com os detalhes. Ambiente top, com cerveja gelada enquanto aguarda.'
      }
    ],
    portfolio: [
      { id: 'p4', title: 'Low Taper Fade & Cachos', style: 'Urbano', description: 'Acabamento limpo na nuca e costeletas mantendo definição dos cachos.' },
      { id: 'p5', title: 'Crop Francês Desconectado', style: 'Europeu', description: 'Franja reta milimétrica com textura densa no topo.' }
    ]
  },
  {
    id: 'barber-marcos',
    name: 'Marcos Silveira',
    nickname: 'Mestre Marcos',
    role: 'Mestre Barbeiro Tradicional',
    experience: '12 anos',
    rating: 4.97,
    reviewCount: 315,
    bio: 'Artesão da lâmina tradicional e apaixonado pela velha escola. Mestre em barboterapia aromática, corte clássico na tesoura e alinhamento milimétrico.',
    specialties: ['Barboterapia Clássica', 'Navalha Tradicional', 'Cortes Clássicos', 'Pigmentação Natural'],
    avatarUrl: '',
    chairNumber: 3,
    workDays: [2, 3, 4, 5, 6, 0], // Ter a Dom
    workHours: { start: '10:00', end: '20:30' },
    reviews: [
      {
        id: 'rev-6',
        clientName: 'Carlos Eduardo Nogueira',
        rating: 5,
        date: 'Ontem',
        service: 'Barboterapia & Toalha Quente',
        comment: 'Experiência quase terapêutica. O Seu Marcos tem a mão levíssima com a navalha, sem nenhuma irritação na pele.'
      },
      {
        id: 'rev-7',
        clientName: 'André Zanetti',
        rating: 5,
        date: 'Há 5 dias',
        service: 'Corte Tradicional na Tesoura',
        comment: 'Poucos barbeiros hoje em dia sabem trabalhar a tesoura com tamanha precisão. Sou cliente fiel há mais de 3 anos.'
      }
    ],
    portfolio: [
      { id: 'p6', title: 'Barba Esculpida em Ângulo', style: 'Old School', description: 'Linhas retas reforçando a mandíbula com acabamento em toalha fria.' },
      { id: 'p7', title: 'Side Part Tradicional', style: 'Corte Cavalheiro', description: 'Corte repartido polido com finalização pomada base d’água.' }
    ]
  }
];

export const DEMO_CLIENTS: User[] = [
  {
    id: 'client-fernando',
    name: 'Fernando Braga',
    email: 'fernandubraga@gmail.com',
    phone: '(11) 98765-4321',
    role: 'client'
  },
  {
    id: 'client-lucas',
    name: 'Lucas Mendes',
    email: 'lucas.mendes@email.com',
    phone: '(11) 99123-9876',
    role: 'client'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APPT-9482',
    clientId: 'client-fernando',
    clientName: 'Fernando Braga',
    clientPhone: '(11) 98765-4321',
    clientEmail: 'fernandubraga@gmail.com',
    barberId: 'barber-diego',
    barberName: 'Diego Santos',
    services: [INITIAL_SERVICES[0]], // Combo VIP
    date: '2026-10-14',
    time: '14:30',
    totalPrice: 110,
    totalDuration: 75,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'confirmed',
    notes: 'Preferência por degradê médio (Mid Fade) e barba alinhada mais quadrada.',
    createdAt: '2026-10-11T16:20:00Z'
  },
  {
    id: 'APPT-8120',
    clientId: 'client-fernando',
    clientName: 'Fernando Braga',
    clientPhone: '(11) 98765-4321',
    clientEmail: 'fernandubraga@gmail.com',
    barberId: 'barber-marcos',
    barberName: 'Marcos Silveira',
    services: [INITIAL_SERVICES[2]], // Barboterapia
    date: '2026-09-28',
    time: '17:00',
    totalPrice: 55,
    totalDuration: 40,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'completed',
    notes: 'Toalha quente aromática e bálsamo.',
    createdAt: '2026-09-25T11:15:00Z',
    cardLastDigits: '4289'
  }
];

export const BARBERSHOP_INFO = {
  name: 'Cavalheiro Barber Club',
  tagline: 'Tradição, Visagismo e Estilo Masculino',
  address: 'Rua Oscar Freire, 1420 - Jardins, São Paulo - SP',
  phone: '(11) 3280-9940',
  whatsapp: '(11) 98765-4321',
  hours: 'Segunda a Sábado: 09h00 às 20h30 | Domingo: 10h00 às 17h00',
  amenities: [
    'Wi-Fi Ultra Rápido',
    'Cervejas Artesanais e Café Espresso',
    'Mesa de Sinuca & Lounge Retrô',
    'Estacionamento com Manobrista Gratuito'
  ]
};
