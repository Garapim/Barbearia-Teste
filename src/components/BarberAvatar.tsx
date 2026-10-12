import React from 'react';
import { Scissors, Award, Sparkles } from 'lucide-react';

interface BarberAvatarProps {
  name: string;
  chairNumber: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BarberAvatar: React.FC<BarberAvatarProps> = ({
  name,
  chairNumber,
  size = 'md',
  className = ''
}) => {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('');
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg',
    xl: 'w-32 h-32 text-2xl'
  };

  const getGradient = (chair: number) => {
    switch (chair) {
      case 1:
        return 'from-[#2e261d] via-[#433522] to-[#c5a059] border-[#c5a059]/40';
      case 2:
        return 'from-[#1c2438] via-[#233150] to-[#5078b5] border-[#5078b5]/40';
      case 3:
        return 'from-[#251e2b] via-[#3d2a4a] to-[#9965b5] border-[#9965b5]/40';
      default:
        return 'from-[#1f2430] via-[#2d3345] to-[#718096] border-[#4a5568]/40';
    }
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${getGradient(
        chairNumber
      )} border flex items-center justify-center text-white font-display font-bold shadow-md shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {/* Texture accent */}
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />

      {/* Decorative craft icon */}
      <div className="flex flex-col items-center justify-center">
        <span>{getInitials(name)}</span>
        {size === 'xl' || size === 'lg' ? (
          <span className="text-[10px] uppercase tracking-widest text-[#e5b842] font-mono mt-0.5 font-normal">
            Cadeira {chairNumber}
          </span>
        ) : null}
      </div>

      {/* Small badge */}
      {size !== 'sm' && (
        <div className="absolute -bottom-1 -right-1 bg-[#0b0d11] p-1 rounded-lg border border-[#272d3b] text-[#c5a059] shadow-sm">
          <Scissors className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
