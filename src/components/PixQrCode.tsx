import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface PixQrCodeProps {
  code: string;
  amount: number;
  appointmentId: string;
  onPaymentConfirmed: () => void;
}

export const PixQrCode: React.FC<PixQrCodeProps> = ({
  code,
  amount,
  appointmentId,
  onPaymentConfirmed
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      onPaymentConfirmed();
    }, 1200);
  };

  return (
    <div className="bg-[#141720] border border-[#272d3b] rounded-xl p-5 md:p-6 text-center">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#212634]">
        <div className="text-left">
          <div className="text-xs uppercase tracking-wider text-[#9aa0a6] font-medium">Pagamento via Pix</div>
          <div className="text-lg font-semibold text-white font-display">Aprovação Imediata</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#9aa0a6]">Valor Total</div>
          <div className="text-xl font-bold text-[#e5b842] tabular-nums font-display">
            {formatCurrency(amount)}
          </div>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="inline-block p-3 bg-white rounded-xl shadow-lg my-2 relative group">
        <svg
          viewBox="0 0 220 220"
          className="w-48 h-48 md:w-52 md:h-52 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="220" height="220" fill="white" />
          
          {/* Authentic-looking QR Finder Patterns - Top Left */}
          <rect x="20" y="20" width="48" height="48" fill="#000" rx="4" />
          <rect x="28" y="28" width="32" height="32" fill="#fff" rx="2" />
          <rect x="34" y="34" width="20" height="20" fill="#000" rx="2" />

          {/* Finder - Top Right */}
          <rect x="152" y="20" width="48" height="48" fill="#000" rx="4" />
          <rect x="160" y="28" width="32" height="32" fill="#fff" rx="2" />
          <rect x="166" y="34" width="20" height="20" fill="#000" rx="2" />

          {/* Finder - Bottom Left */}
          <rect x="20" y="152" width="48" height="48" fill="#000" rx="4" />
          <rect x="28" y="160" width="32" height="32" fill="#fff" rx="2" />
          <rect x="34" y="166" width="20" height="20" fill="#000" rx="2" />

          {/* Alignment and timing lines */}
          <rect x="80" y="38" width="56" height="8" fill="#000" rx="1" />
          <rect x="38" y="80" width="8" height="56" fill="#000" rx="1" />
          
          {/* Simulated QR Payload matrix modules */}
          <rect x="80" y="20" width="8" height="12" fill="#000" />
          <rect x="96" y="20" width="16" height="8" fill="#000" />
          <rect x="120" y="20" width="8" height="16" fill="#000" />
          <rect x="136" y="28" width="8" height="8" fill="#000" />

          <rect x="80" y="58" width="16" height="16" fill="#000" />
          <rect x="104" y="52" width="12" height="8" fill="#000" />
          <rect x="124" y="58" width="16" height="12" fill="#000" />

          <rect x="20" y="80" width="12" height="8" fill="#000" />
          <rect x="20" y="96" width="8" height="16" fill="#000" />
          <rect x="20" y="120" width="14" height="8" fill="#000" />
          <rect x="20" y="136" width="8" height="12" fill="#000" />

          <rect x="52" y="80" width="16" height="8" fill="#000" />
          <rect x="52" y="104" width="12" height="16" fill="#000" />
          <rect x="52" y="128" width="16" height="8" fill="#000" />

          {/* Center Matrix */}
          <rect x="80" y="80" width="12" height="12" fill="#000" />
          <rect x="100" y="80" width="20" height="8" fill="#000" />
          <rect x="128" y="80" width="12" height="16" fill="#000" />
          
          <rect x="76" y="100" width="16" height="14" fill="#000" />
          <rect x="100" y="96" width="20" height="20" fill="#00b494" rx="4" /> {/* Pix teal center */}
          <rect x="128" y="104" width="16" height="12" fill="#000" />

          <rect x="80" y="124" width="14" height="16" fill="#000" />
          <rect x="102" y="124" width="16" height="14" fill="#000" />
          <rect x="124" y="128" width="18" height="12" fill="#000" />

          {/* Right Matrix */}
          <rect x="152" y="80" width="14" height="8" fill="#000" />
          <rect x="174" y="80" width="18" height="14" fill="#000" />
          <rect x="152" y="100" width="24" height="12" fill="#000" />
          <rect x="184" y="102" width="14" height="20" fill="#000" />
          <rect x="152" y="120" width="16" height="16" fill="#000" />
          <rect x="176" y="126" width="22" height="10" fill="#000" />

          {/* Bottom Right Matrix */}
          <rect x="80" y="152" width="12" height="14" fill="#000" />
          <rect x="100" y="148" width="14" height="18" fill="#000" />
          <rect x="122" y="152" width="20" height="10" fill="#000" />
          <rect x="152" y="152" width="12" height="24" fill="#000" />
          <rect x="172" y="152" width="16" height="14" fill="#000" />
          <rect x="194" y="152" width="10" height="24" fill="#000" />

          <rect x="80" y="174" width="20" height="10" fill="#000" />
          <rect x="108" y="174" width="12" height="22" fill="#000" />
          <rect x="128" y="170" width="16" height="12" fill="#000" />
          <rect x="152" y="184" width="22" height="12" fill="#000" />
          <rect x="182" y="174" width="14" height="22" fill="#000" />

          {/* Micro Pix Logo center text */}
          <text x="110" y="110" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">PIX</text>
        </svg>

        <div className="text-[11px] font-semibold text-slate-800 mt-1 uppercase tracking-wide">
          Banco Central do Brasil · Pix
        </div>
      </div>

      {/* Countdown timer */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#9aa0a6] mt-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-[#e5b842]" />
        <span>Este código expira em:</span>
        <span className="font-semibold text-white font-mono tabular-nums">{timeFormatted}</span>
      </div>

      {/* Copy Paste Code Box */}
      <div className="text-left mb-4">
        <label className="text-xs text-[#9aa0a6] block mb-1.5 font-medium">
          Código Pix Copia e Cola
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#0b0d11] border border-[#272d3b] rounded-lg px-3 py-2 text-xs font-mono text-[#c5c8d0] truncate select-all">
            {code}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#272d3b] text-white hover:bg-[#343c4e]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step by step instruction */}
      <div className="bg-[#0b0d11]/80 rounded-lg p-3 text-xs text-[#9aa0a6] text-left space-y-1.5 border border-[#1f2430] mb-4">
        <div className="text-white font-medium">Como pagar:</div>
        <div>1. Abra o aplicativo do seu banco ou carteira digital.</div>
        <div>2. Escolha a opção <strong className="text-white">Pix</strong> e depois <strong className="text-white">Escanear QR Code</strong> ou <strong className="text-white">Pix Copia e Cola</strong>.</div>
        <div>3. Confirme os dados e finalize o pagamento.</div>
      </div>

      {/* Interactive Simulation Button */}
      <button
        type="button"
        disabled={simulating}
        onClick={handleSimulatePayment}
        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        <Zap className="w-4 h-4" />
        {simulating ? 'Validando recebimento Pix...' : 'Simular Pagamento Aprovado'}
      </button>

      <div className="flex items-center justify-center gap-1 text-[11px] text-[#6b7280] mt-3">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Ambiente seguro com criptografia ponta a ponta</span>
      </div>
    </div>
  );
};
