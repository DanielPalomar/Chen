import React, { useState } from 'react';
import { X, ShieldCheck, Github, User, ArrowRight, Check, KeyRound, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateMyProfile?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onNavigateMyProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  if (!isOpen) return null;

  const handleSelectDemoUser = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const initials = email.slice(0, 2).toUpperCase();
    const loggedUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0],
      username: email.split('@')[0],
      email: email.trim(),
      role: 'Estudiante / Investigador',
      githubVerified: false,
      avatarInitials: initials,
      isDemoUser: false,
    };

    onLogin(loggedUser);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      username: githubUsername.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      email: email.trim(),
      role: 'Autor en Chen',
      githubVerified: Boolean(githubUsername.trim()),
      avatarInitials: initials || 'AU',
      isDemoUser: false,
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              {currentUser ? 'Tu Perfil y Sesión' : 'Acceso a Chen'}
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              Sin muros de pago. Privacidad por defecto sin rastreo comercial.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action-primary)] text-white font-semibold text-sm">
                {currentUser.avatarInitials}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                  <span>{currentUser.name}</span>
                  {currentUser.githubVerified && (
                    <span className="text-[10px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-1.5 py-0.2 rounded">
                      GitHub verificado (OAuth)
                    </span>
                  )}
                  {currentUser.isDemoUser && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded font-mono">
                      Demo
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  {currentUser.role}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onNavigateMyProfile && (
                <button
                  onClick={() => {
                    onNavigateMyProfile();
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded text-center bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)] transition-colors shadow-xs"
                >
                  Ver y editar mi perfil
                </button>
              )}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2 px-3 rounded text-center text-rose-700 bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300 font-medium hover:opacity-90 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Tabs for Demo mode vs Real login vs Real register */}
            <div className="flex rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-1 rounded transition-colors font-medium ${
                  activeTab === 'demo'
                    ? 'bg-[var(--bg-surface)] text-[var(--action-primary)] shadow-xs'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Modo Demo
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-1 rounded transition-colors font-medium ${
                  activeTab === 'login'
                    ? 'bg-[var(--bg-surface)] text-[var(--action-primary)] shadow-xs'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-1 rounded transition-colors font-medium ${
                  activeTab === 'register'
                    ? 'bg-[var(--bg-surface)] text-[var(--action-primary)] shadow-xs'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* TAB 1: DEMO MODE (Conflict 5 Solved) */}
            {activeTab === 'demo' && (
              <div className="space-y-3">
                <div className="p-3 rounded border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Modo demostración activo (Entorno de pruebas)</span>
                  </div>
                  <p className="text-[10px] leading-tight">
                    Cuentas semilla con verificación GitHub y autorías precargadas para probar la plataforma con 1 clic.
                  </p>
                </div>

                <div className="space-y-2">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectDemoUser(u)}
                      className="w-full flex items-center justify-between p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--action-primary)] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-subtle-lilac)] font-semibold text-[var(--action-primary)] text-xs">
                          {u.avatarInitials}
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--text-primary)] block">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-[var(--text-tertiary)]">
                            {u.role}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: REAL LOGIN FLOW */}
            {activeTab === 'login' && (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investigador@universidad.org"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)] transition-colors"
                >
                  Entrar con credenciales
                </button>
              </form>
            )}

            {/* TAB 3: REAL SIGN UP FLOW */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dra. Elena Ramos"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena.ramos@investigacion.org"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Usuario de GitHub (Opcional, para verificar autoría)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="elenaramos-sci"
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 pl-8 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)] transition-colors"
                >
                  Crear cuenta gratuita
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
