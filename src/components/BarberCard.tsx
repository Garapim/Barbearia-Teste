import React from 'react';
import { Star, Clock, Check, ChevronRight, Info } from 'lucide-react';
import { Barber } from '../types';
import { BarberAvatar } from './BarberAvatar';

interface BarberCardProps {
  barber: Barber;
  isSelected?: boolean;
  onSelect: (barber: Barber) => void;
  onViewProfile: (barber: Barber) => void;
}

export const BarberCard: React.FC<BarberCardProps> = ({
  barber,
  isSelected = false,
  onSelect,
  onViewProfile
}) => {
  return (
    <div
      className={`group relative rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'bg-[#181c28] border-[#c5a059] shadow-lg shadow-[#c5a059]/5 ring-1 ring-[#c5a059]'
          : 'bg-[#141720] border-[#272d3b] hover:border-[#384154] hover:bg-[#161a25]'
      }`}
    >
      <div>
        {/* Top: Avatar + Main Info */}
        <div className="flex items-start gap-4">
          <BarberAvatar name={barber.name} chairNumber={barber.chairNumber} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white font-display truncate">
                {barber.name}
              </h3>
              {isSelected && (
                <div className="bg-[#c5a059] text-[#0b0d11] p-1 rounded-full shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <p className="text-xs text-[#c5a059] font-medium font-mono mt-0.5">
              "{barber.nickname}"
            </p>

            <p className="text-xs text-[#9aa0a6] truncate mt-1">
              {barber.role}
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1 text-[#e5b842]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold text-white tabular-nums">
                  {barber.rating.toFixed(2)}
                </span>
              </div>
              <span className="text-[#4b5563]">·</span>
              <span className="text-[#9aa0a6] text-[11px]">
                {barber.reviewCount} cortes
              </span>
              <span className="text-[#4b5563]">·</span>
              <span className="text-[#9aa0a6] text-[11px]">
                {barber.experience}
              </span>
            </div>
          </div>
        </div>

        {/* Specialties tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {barber.specialties.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="text-[11px] bg-[#1d2230] text-[#c5c8d0] px-2 py-0.5 rounded border border-[#272d3b]"
            >
              {spec}
            </span>
          ))}
          {barber.specialties.length > 3 && (
            <span className="text-[11px] text-[#9aa0a6] px-1 py-0.5">
              +{barber.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 pt-3 border-t border-[#212634] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(barber);
          }}
          className="text-xs text-[#9aa0a6] hover:text-white flex items-center gap-1 transition-colors px-2 py-1.5 rounded hover:bg-white/5"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Ver Perfil</span>
        </button>

        <button
          type="button"
          onClick={() => onSelect(barber)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            isSelected
              ? 'bg-[#c5a059] text-[#0b0d11]'
              : 'bg-[#272d3b] hover:bg-[#343c4e] text-white'
          }`}
        >
          <span>{isSelected ? 'Selecionado' : 'Selecionar'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
