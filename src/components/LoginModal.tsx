import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Phone, Lock, LogIn, UserCheck, Shield } from 'lucide-react';
import { User } from '../types';
import { DEMO_CLIENTS } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (client: User) => {
    onLogin(client);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Preencha seu e-mail e senha.');
        return;
      }
      // If matches demo client, use it; otherwise create user object
      const found = DEMO_CLIENTS.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (found) {
        onLogin(found);
      } else {
        const newUser: User = {
          id: `client-${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: phone || '(11) 99999-8888',
          role: 'client'
        };
        onLogin(newUser);
      }
      onClose();
    } else {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setError('Preencha todos os campos para cadastrar sua conta.');
        return;
      }
      const newUser: User = {
        id: `client-${Date.now()}`,
        name,
        email,
        phone,
        role: 'client'
      };
      onLogin(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12151e] border border-[#272d3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#171b26] to-[#1e2333] border-b border-[#272d3b] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {mode === 'login' ? 'Área do Cliente' : 'Criar Nova Conta'}
            </h3>
            <p className="text-xs text-[#9aa0a6] mt-0.5">
              {mode === 'login'
                ? 'Acesse para gerenciar seus agendamentos e histórico'
                : 'Cadastre-se em menos de 1 minuto'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="px-5 pt-4 pb-3 bg-[#151924] border-b border-[#212634]">
          <div className="text-[11px] uppercase tracking-wider text-[#9aa0a6] font-semibold mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Acesso Rápido com 1 Clique (Demonstração):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_CLIENTS.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleDemoLogin(client)}
                className="p-2 text-left bg-[#1d2232] hover:bg-[#252b3f] border border-[#2e364a] hover:border-[#c5a059] rounded-lg transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-[#c5a059] truncate">
                  {client.name}
                </div>
                <div className="text-[10px] text-[#9aa0a6] truncate">{client.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fernando Braga"
                  className="w-full bg-[#181c28] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 pl-9 text-sm text-white focus:outline-none"
                />
                <UserIcon className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-[#181c28] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 pl-9 text-sm text-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                WhatsApp / Celular (para confirmação)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#181c28] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 pl-9 text-sm text-white focus:outline-none"
                />
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181c28] border border-[#272d3b] focus:border-[#c5a059] rounded-lg px-3 py-2 pl-9 text-sm text-white focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#c5a059] hover:bg-[#d8b46b] text-[#0b0d11] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{mode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta'}</span>
          </button>

          <div className="pt-2 text-center text-xs text-[#9aa0a6]">
            {mode === 'login' ? (
              <span>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-[#c5a059] hover:underline font-medium"
                >
                  Cadastre-se aqui
                </button>
              </span>
            ) : (
              <span>
                Já possui conta cadastrada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-[#c5a059] hover:underline font-medium"
                >
                  Faça login
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
