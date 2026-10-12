import React, { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface CreditCardFormProps {
  amount: number;
  onPaymentConfirmed: (cardLastDigits: string) => void;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  amount,
  onPaymentConfirmed
}) => {
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [actualCardNumber, setActualCardNumber] = useState('4532 8912 3456 7890');
  const [cardHolder, setCardHolder] = useState('FERNANDO BRAGA');
  const [expiry, setExpiry] = useState('11/29');
  const [cvv, setCvv] = useState('834');
  const [installments, setInstallments] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Detect card brand
  const getBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
    if (clean.startsWith('3')) return 'Amex';
    return 'Cartão de Crédito';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setActualCardNumber(formatted);
    setError('');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = actualCardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      setError('Por favor, informe um número de cartão válido.');
      return;
    }
    if (!cardHolder.trim() || cardHolder.trim().length < 3) {
      setError('Informe o nome impresso no cartão.');
      return;
    }
    if (expiry.length < 5) {
      setError('Data de validade inválida (MM/AA).');
      return;
    }
    if (cvv.length < 3) {
      setError('Código de segurança (CVV) inválido.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const lastDigits = cleanNum.slice(-4) || '7890';
      onPaymentConfirmed(lastDigits);
    }, 1400);
  };

  const brand = getBrand(actualCardNumber);

  return (
    <div className="space-y-6">
      {/* Interactive Card Graphic */}
      <div className="relative mx-auto w-full max-w-sm h-48 rounded-2xl p-6 text-white overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-tr from-[#1a1c23] via-[#2d251e] to-[#c5a059]/40 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Chip */}
            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/40 relative overflow-hidden flex items-center justify-center">
              <div className="w-full h-[1px] bg-amber-900/40 my-auto"></div>
              <div className="w-[1px] h-full bg-amber-900/40 mx-auto absolute"></div>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-amber-200 font-mono font-medium">Contactless</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold tracking-wider uppercase font-display text-amber-200">
              {brand}
            </span>
          </div>
        </div>

        {/* Card Number display */}
        <div className="font-mono text-lg md:text-xl tracking-widest text-slate-100 font-medium">
          {actualCardNumber || '•••• •••• •••• ••••'}
        </div>

        {/* Card Footer */}
        <div className="flex items-end justify-between text-xs">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-300">Titular</div>
            <div className="font-medium tracking-wide truncate max-w-[170px] uppercase">
              {cardHolder || 'NOME DO CLIENTE'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-slate-300">Validade</div>
            <div className="font-mono font-medium text-slate-100">
              {expiry || 'MM/AA'}
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
            Número do Cartão
          </label>
          <div className="relative">
            <input
              type="text"
              value={actualCardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full bg-[#141720] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors"
            />
            <CreditCard className="w-4 h-4 text-gray-500 absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
            Nome Completo do Titular
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            placeholder="Como impresso no cartão"
            className="w-full bg-[#141720] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3.5 py-2.5 text-sm text-white uppercase placeholder:normal-case placeholder:text-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
              Validade (MM/AA)
            </label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="12/28"
              maxLength={5}
              className="w-full bg-[#141720] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
              CVV (Código)
            </label>
            <div className="relative">
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={4}
                className="w-full bg-[#141720] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none transition-colors"
              />
              <Lock className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-3.5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
            Parcelamento
          </label>
          <select
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            className="w-full bg-[#141720] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
          >
            <option value="1">1x de {formatCurrency(amount)} (à vista sem juros)</option>
            <option value="2">2x de {formatCurrency(amount / 2)} (sem juros)</option>
            <option value="3">3x de {formatCurrency(amount / 3)} (sem juros)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full mt-2 py-3 px-4 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0b0d11] border-t-transparent rounded-full animate-spin" />
              <span>Processando transação segura...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Confirmar Pagamento de {formatCurrency(amount)}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6b7280]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Transação criptografada com proteção antifraude</span>
        </div>
      </form>
    </div>
  );
};
