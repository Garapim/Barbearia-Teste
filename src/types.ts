export interface BarberReview {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
}

export interface BarberPortfolioItem {
  id: string;
  title: string;
  style: string;
  imageUrl?: string;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  role: string;
  experience: string;
  rating: number;
  reviewCount: number;
  bio: string;
  specialties: string[];
  avatarUrl: string;
  workDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  workHours: {
    start: string;
    end: string;
  };
  chairNumber: number;
  reviews: BarberReview[];
  portfolio: BarberPortfolioItem[];
}

export interface BarberService {
  id: string;
  name: string;
  category: 'cabelo' | 'barba' | 'combos' | 'tratamentos';
  description: string;
  price: number;
  duration: number; // in minutes
  popular?: boolean;
  features: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  barberId: string;
  barberName: string;
  services: BarberService[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  totalPrice: number;
  totalDuration: number;
  paymentMethod: 'pix' | 'credit_card' | 'barbearia';
  paymentStatus: 'paid' | 'pending' | 'pay_on_arrival';
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  pixQrCodePayload?: string;
  cardLastDigits?: string;
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    tags?: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'client' | 'barber' | 'admin';
  assignedBarberId?: string;
}

export type BookingStep = 'services' | 'barber' | 'datetime' | 'checkout' | 'confirmation';
