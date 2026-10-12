import React, { useState } from 'react';
import { X, Star, Scissors, MessageSquare, Check, Sparkles, ThumbsUp } from 'lucide-react';
import { Appointment } from '../types';
import { formatDatePtBR } from '../utils/helpers';

interface ServiceReviewModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (appointmentId: string, rating: number, comment: string, tags: string[]) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Deixou a desejar',
  2: 'Regular',
  3: 'Bom atendimento',
  4: 'Muito bom!',
  5: 'Excelente / Impecável!'
};

const SUGGESTED_TAGS = [
  'Corte impecável',
  'Pontualidade britânica',
  'Barboterapia relaxante',
  'Higiene & Biossegurança',
  'Atendimento cordial',
  'Acabamento cirúrgico'
];

export const ServiceReviewModal: React.FC<ServiceReviewModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(appointment?.review?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(appointment?.review?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(appointment?.review?.tags || ['Corte impecável']);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync state if appointment changes
  React.useEffect(() => {
    if (appointment) {
      setRating(appointment.review?.rating || 5);
      setComment(appointment.review?.comment || '');
      setSelectedTags(appointment.review?.tags || ['Corte impecável']);
      setSubmitted(false);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const activeScore = hoverRating || rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      onSubmitReview(appointment.id, rating, comment.trim(), selectedTags);
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#171b26] to-[#1e2333] border-b border-[#272d3b] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Avaliar Atendimento
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Agendamento #{appointment.id} · {formatDatePtBR(appointment.date)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-white font-display">
              Avaliação Registrada com Sucesso!
            </h4>
            <p className="text-xs text-[#9aa0a6] max-w-xs mx-auto">
              Seu feedback foi enviado para {appointment.barberName} e adicionado ao perfil público do barbeiro. Obrigado por ajudar nossa barbearia a manter a excelência!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Service & Barber Card Recap */}
            <div className="p-3.5 rounded-xl bg-[#161a25] border border-[#272d3b] flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#9aa0a6]">Profissional</div>
                <div className="font-bold text-white text-sm">{appointment.barberName}</div>
                <div className="text-[#c5a059] text-[11px] mt-0.5">
                  {appointment.services.map(s => s.name).join(' + ')}
                </div>
              </div>
              <div className="text-right text-[11px] text-[#9aa0a6]">
                <div>Horário: {appointment.time}</div>
                <div>{appointment.totalDuration} minutos</div>
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="text-center space-y-2 py-1">
              <label className="block text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                Como você avalia este atendimento?
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeScore;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 duration-150"
                      aria-label={`${starValue} estrelas`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-[#e5b842] fill-current drop-shadow-[0_0_8px_rgba(229,184,66,0.4)]'
                            : 'text-[#2a3040] hover:text-[#4a5568]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-[#c5a059] font-mono h-4">
                {RATING_LABELS[activeScore]}
              </div>
            </div>

            {/* Quick Complement Tags */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                Pontos de destaque (opcional):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                        isSelected
                          ? 'bg-[#c5a059] text-[#0b0d11] font-semibold shadow-sm'
                          : 'bg-[#181c28] border border-[#272d3b] text-[#9aa0a6] hover:text-white hover:border-[#3d455b]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-[#9aa0a6] font-semibold">
                Deixe seu comentário ou recado para o barbeiro:
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex: O degradê ficou perfeito, encaixou muito bem com meu estilo. A toalha quente na barba foi extremamente relaxante. Recomendo muito!"
                  className="w-full bg-[#161a25] border border-[#272d3b] focus:border-[#c5a059] rounded-xl p-3 text-xs text-white placeholder:text-[#525b6e] focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>
              <div className="text-[11px] text-[#6b7280] text-right">
                {comment.length} caracteres
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#212634]">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-[#9aa0a6] hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-5 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0b0d11] border-t-transparent rounded-full animate-spin" />
                    <span>Enviando avaliação...</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{appointment.review ? 'Atualizar Avaliação' : 'Publicar Avaliação'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
