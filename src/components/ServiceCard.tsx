import React from 'react';
import { Clock, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { BarberService } from '../types';
import { formatCurrency } from '../utils/helpers';

interface ServiceCardProps {
  service: BarberService;
  isSelected: boolean;
  onToggle: (service: BarberService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onToggle
}) => {
  return (
    <div
      onClick={() => onToggle(service)}
      className={`group relative cursor-pointer rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between select-none ${
        isSelected
          ? 'bg-[#181c28] border-[#c5a059] shadow-lg shadow-[#c5a059]/5 ring-1 ring-[#c5a059]'
          : 'bg-[#141720] border-[#272d3b] hover:border-[#384154] hover:bg-[#161a25]'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display group-hover:text-[#c5a059] transition-colors">
                {service.name}
              </h3>
              {service.popular && (
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/20">
                  Mais Pedido
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#9aa0a6]">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="font-mono">{service.duration} min</span>
              </div>
              <span>·</span>
              <span className="capitalize">{service.category}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-[#e5b842] tabular-nums font-display">
              {formatCurrency(service.price)}
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-[#9aa0a6] leading-relaxed">
          {service.description}
        </p>

        {/* Feature Highlights */}
        {service.features && service.features.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[#212634] space-y-1.5">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#c5c8d0]">
                <Check className="w-3 h-3 text-[#c5a059] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#212634] flex items-center justify-between">
        <span className="text-xs text-[#9aa0a6]">
          {isSelected ? 'Serviço adicionado ao agendamento' : 'Clique para adicionar'}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(service);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isSelected
              ? 'bg-[#c5a059] text-[#0b0d11]'
              : 'bg-[#272d3b] text-white hover:bg-[#343c4e]'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Adicionado</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
