import React from 'react';
import { Author } from '../types';

interface ChenNavbarProps {
  currentView: 'home' | 'reader' | 'editor' | 'gdpr';
  onNavigate: (view: 'home' | 'reader' | 'editor' | 'gdpr', articleId?: string) => void;
  currentAuthor: Author;
  authors: Author[];
  onSwitchAuthor: (author: Author) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const ChenNavbar: React.FC<ChenNavbarProps> = ({
  currentView,
  onNavigate,
  currentAuthor,
  authors,
  onSwitchAuthor,
  theme,
  onToggleTheme,
}) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-stone-200 dark:border-stone-800 bg-[#FAF9F5]/90 dark:bg-[#0F1115]/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-baseline gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-teal-600 rounded-sm"
            aria-label="Ir a la portada de Chen"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              Chen
            </span>
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 border-l border-stone-300 dark:border-stone-700 pl-2.5">
              Protocolo de Argumentación Abierta
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav role="navigation" aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              currentView === 'home'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
          >
            Explorar
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'editor'
                ? 'bg-teal-700 text-white font-semibold'
                : 'text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-teal-600/30'
            }`}
          >
            <span className="font-mono text-xs">+</span>
            Publicar Tesis
          </button>

          <button
            onClick={() => onNavigate('gdpr')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              currentView === 'gdpr'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
            title="Arquitectura de Inmutabilidad, RGPD y Modelo SQL"
          >
            <span className="hidden md:inline">Arquitectura &amp; </span>RGPD
          </button>
        </nav>

        {/* Right side: Session Switcher & Dark Mode */}
        <div className="flex items-center gap-2">
          {/* Author session quick-select */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/70 py-1 px-2.5 rounded-full border border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
            <span className="font-mono text-[11px] truncate max-w-[130px]">
              {currentAuthor.isErased ? currentAuthor.handle : `@${currentAuthor.handle}`}
            </span>
            <select
              aria-label="Cambiar identidad de autor simulada"
              value={currentAuthor.id}
              onChange={(e) => {
                const found = authors.find((a) => a.id === e.target.value);
                if (found) onSwitchAuthor(found);
              }}
              className="bg-transparent text-[11px] text-stone-700 dark:text-stone-300 border-none focus:outline-none cursor-pointer"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                  {a.isErased ? a.handle : a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
            aria-label={theme === 'dark' ? 'Activar tema claro (pergamino)' : 'Activar tema oscuro (obsidiana)'}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
