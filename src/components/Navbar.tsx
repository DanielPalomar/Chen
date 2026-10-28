import React from 'react';
import { Author } from '../types/chen';

export type ActiveView = 'home' | 'reader' | 'editor' | 'graph' | 'manifesto';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView, articleId?: string) => void;
  currentAuthor: Author;
  authors: Author[];
  onSwitchAuthor: (author: Author) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentAuthor,
  authors,
  onSwitchAuthor,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/95 dark:bg-[#0D1117]/95 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logotipo y Título de Protocolo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-baseline gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-teal-600 rounded-sm cursor-pointer"
            aria-label="Ir a la portada de Chen"
          >
            <span className="font-serif text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              Chen
            </span>
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 border-l border-stone-300 dark:border-stone-700 pl-2.5">
              Protocolo v1.0
            </span>
          </button>
        </div>

        {/* Buscador Rápido de Tesis y Conceptos */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
          <div className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'home' && currentView !== 'reader') {
                  onNavigate('home');
                }
              }}
              placeholder="Buscar tesis, autor o concepto..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 font-sans"
            />
            <svg
              className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 5 Vistas Interactivas Reales (Sin enlaces # rotos) */}
        <nav role="navigation" aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => onNavigate('home')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
          >
            Inicio &amp; Demostrador
          </button>

          <button
            onClick={() => onNavigate('reader')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentView === 'reader'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
          >
            Explorar &amp; Leer
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              currentView === 'editor'
                ? 'bg-teal-700 text-white font-bold'
                : 'text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-teal-600/30'
            }`}
          >
            <span className="font-mono text-xs">+</span>
            Publicar / Citar
          </button>

          <button
            onClick={() => onNavigate('graph')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentView === 'graph'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
          >
            Grafo &amp; Portafolios
          </button>

          <button
            onClick={() => onNavigate('manifesto')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentView === 'manifesto'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
            }`}
          >
            Manifiesto &amp; RGPD
          </button>
        </nav>

        {/* Zona Derecha: Sesión de Autor y Conmutador de Tema */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de Autor Simulado */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/70 py-1 px-2.5 rounded-full border border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
            <span className="font-mono text-[11px] truncate max-w-[120px]">
              {currentAuthor.isAnonymized ? currentAuthor.handle : `@${currentAuthor.handle}`}
            </span>
            <select
              aria-label="Cambiar identidad de autor activo"
              value={currentAuthor.id}
              onChange={(e) => {
                const found = authors.find((a) => a.id === e.target.value);
                if (found) onSwitchAuthor(found);
              }}
              className="bg-transparent text-[11px] text-stone-700 dark:text-stone-300 border-none focus:outline-none cursor-pointer"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                  {a.isAnonymized ? a.handle : a.realName}
                </option>
              ))}
            </select>
          </div>

          {/* Selector Tema Claro/Oscuro */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 cursor-pointer"
            aria-label={theme === 'dark' ? 'Activar tema claro (Pergamino Cálido)' : 'Activar tema oscuro (Pizarra Profunda)'}
            title={theme === 'dark' ? 'Cambiar a modo Pergamino Cálido' : 'Cambiar a modo Pizarra Profunda'}
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
