import React, { useState } from 'react';
import { X, Star, Calendar, Clock, Scissors, Award, CheckCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { Barber } from '../types';
import { BarberAvatar } from './BarberAvatar';

interface BarberModalProps {
  barber: Barber | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForBooking: (barber: Barber) => void;
}

export const BarberModal: React.FC<BarberModalProps> = ({
  barber,
  isOpen,
  onClose,
  onSelectForBooking
}) => {
  const [activeTab, setActiveTab] = useState<'sobre' | 'portfolio' | 'avaliacoes'>('sobre');

  if (!isOpen || !barber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#171b26] to-[#1e2333] border-b border-[#272d3b] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <BarberAvatar name={barber.name} chairNumber={barber.chairNumber} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-white font-display">
                  {barber.name}
                </h3>
                <span className="text-xs text-[#c5a059] font-medium font-mono bg-[#c5a059]/10 px-2 py-0.5 rounded">
                  "{barber.nickname}"
                </span>
              </div>
              <p className="text-sm text-[#9aa0a6] mt-0.5">{barber.role}</p>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-[#9aa0a6]">
                <div className="flex items-center gap-1 text-[#e5b842]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold tabular-nums text-white">{barber.rating.toFixed(2)}</span>
                  <span className="text-[#9aa0a6]">({barber.reviewCount} avaliações)</span>
                </div>
                <span>·</span>
                <span className="text-white font-medium">{barber.experience} de carreira</span>
                <span>·</span>
                <span className="text-[#c5a059]">Cadeira {barber.chairNumber}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-[#12151e] border-b border-[#272d3b]">
          <button
            onClick={() => setActiveTab('sobre')}
            className={`pb-3 px-3 text-xs md:text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'sobre'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-[#9aa0a6] hover:text-white'
            }`}
          >
            Perfil & Especialidades
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-3 text-xs md:text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'portfolio'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-[#9aa0a6] hover:text-white'
            }`}
          >
            Portfólio & Estilos ({barber.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`pb-3 px-3 text-xs md:text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'avaliacoes'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-[#9aa0a6] hover:text-white'
            }`}
          >
            Depoimentos ({barber.reviews.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'sobre' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold mb-2">
                  Trajetória & Filosofia de Atendimento
                </h4>
                <p className="text-sm text-[#c5c8d0] leading-relaxed">
                  {barber.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold mb-3">
                  Especialidades Técnicas
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {barber.specialties.map((spec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#181c28] border border-[#272d3b] flex items-center gap-2 text-xs text-white"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#181c28] border border-[#272d3b] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#9aa0a6]">
                  <Clock className="w-4 h-4 text-[#c5a059]" />
                  <span>Horário padrão:</span>
                  <span className="text-white font-medium font-mono">
                    {barber.workHours.start} às {barber.workHours.end}
                  </span>
                </div>
                <div className="text-[#9aa0a6]">
                  Atendimento com hora marcada
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <p className="text-xs text-[#9aa0a6]">
                Trabalhos autorais realizados na cadeira {barber.chairNumber} da Cavalheiro Barber Club:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {barber.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#181c28] border border-[#272d3b] hover:border-[#3d455b] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wide">
                        {item.style}
                      </span>
                      <Scissors className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <h5 className="text-sm font-semibold text-white font-display mb-1.5">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[#9aa0a6] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'avaliacoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#181c28] rounded-xl border border-[#272d3b]">
                <div>
                  <div className="text-2xl font-bold text-white font-display">
                    {barber.rating.toFixed(2)}
                  </div>
                  <div className="flex text-[#e5b842] gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-[#9aa0a6]">
                    Baseado em {barber.reviewCount} clientes atendidos
                  </div>
                </div>
                <div className="text-right text-xs text-[#9aa0a6] space-y-1">
                  <div>100% Clientes Verificados</div>
                  <div>Pontualidade Excelente</div>
                  <div>Higiene & Biossegurança Máxima</div>
                </div>
              </div>

              <div className="space-y-3">
                {barber.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-[#181c28] border border-[#272d3b] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{rev.clientName}</span>
                      <span className="text-[#9aa0a6]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#e5b842]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-[11px] text-[#9aa0a6] ml-2">
                        {rev.service}
                      </span>
                    </div>
                    <p className="text-[#c5c8d0] italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#171b26] border-t border-[#272d3b] flex items-center justify-between gap-4">
          <div className="text-xs text-[#9aa0a6]">
            Horários disponíveis para esta semana
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectForBooking(barber);
              onClose();
            }}
            className="py-2.5 px-5 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar com {barber.name.split(' ')[0]}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
