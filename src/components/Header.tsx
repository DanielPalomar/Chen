import React, { useState } from 'react';
import {
  Search,
  PenSquare,
  Sun,
  Moon,
  Coffee,
  Type,
  User,
  Globe,
  ChevronDown,
  Menu,
  X,
  Compass,
  Scale,
  MessageSquare,
  GraduationCap,
  Target,
  FileText,
  Library,
  BookOpen,
  Heart,
} from 'lucide-react';
import { ChenLogo } from './ChenLogo';
import { UserPreferences, UserProfile } from '../types';
import { t } from '../i18n/translations';

interface HeaderProps {
  preferences: UserPreferences;
  currentUser: UserProfile | null;
  onNavigate: (
    view: UserPreferences['activeView'],
    articleId?: string | null,
    authorId?: string | null,
    areaId?: string | null
  ) => void;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  currentUser,
  onNavigate,
  onUpdatePreferences,
  onSearch,
  searchQuery,
  onOpenLogin,
}) => {
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lang = preferences.language || 'es';

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate('search');
    }
  };

  const isMoreActive = [
    'repositories',
    'thesis',
    'forum',
    'study_path',
    'challenges',
    'claims',
    'moderation',
  ].includes(preferences.activeView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="text-left rounded transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]"
            aria-label="Chen — Inicio"
          >
            <ChenLogo />
          </button>
        </div>

        {/* Zone 2: Clean 4–5 Primary Nav Links + "Más" Dropdown */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-[var(--text-primary)] ${
              preferences.activeView === 'home' || preferences.activeView === 'article'
                ? 'text-[var(--action-primary)] font-semibold'
                : ''
            }`}
          >
            {t('navArticles', lang)}
          </button>

          <button
            onClick={() => onNavigate('areas')}
            className={`transition-colors hover:text-[var(--text-primary)] ${
              preferences.activeView === 'areas' || preferences.activeView === 'area_detail'
                ? 'text-[var(--action-primary)] font-semibold'
                : ''
            }`}
          >
            {t('navAreas', lang)}
          </button>

          <button
            onClick={() => onNavigate('books')}
            className={`transition-colors hover:text-[var(--text-primary)] ${
              preferences.activeView === 'books'
                ? 'text-[var(--action-primary)] font-semibold'
                : ''
            }`}
          >
            {t('navBooks', lang)}
          </button>

          <button
            onClick={() => onNavigate('gaps')}
            className={`transition-colors hover:text-[var(--text-primary)] ${
              preferences.activeView === 'gaps'
                ? 'text-[var(--action-primary)] font-semibold'
                : ''
            }`}
          >
            {t('navGaps', lang)}
          </button>

          {/* Clean "Explorar más" Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setMoreMenuOpen(!moreMenuOpen);
                setFontMenuOpen(false);
              }}
              className={`flex items-center gap-1 transition-colors hover:text-[var(--text-primary)] ${
                isMoreActive ? 'text-[var(--action-primary)] font-semibold' : ''
              }`}
            >
              <span>Explorar</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {moreMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-1.5 shadow-lg z-50 text-xs"
                role="menu"
              >
                <button
                  onClick={() => {
                    onNavigate('repositories');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                >
                  <Compass className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Portales y repositorios</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('thesis');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                >
                  <Scale className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Tesis y Antítesis</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('forum');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Foro de debate</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('study_path');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Rutas y práctica privada</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('challenges');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                >
                  <Target className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Retos personales</span>
                </button>

                <div className="my-1 border-t border-[var(--border-subtle)]" />

                <button
                  onClick={() => {
                    onNavigate('claims');
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                >
                  <FileText className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                  <span>Libro de reclamaciones</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Center/Right Search */}
        <div className="hidden md:flex flex-1 max-w-xs mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('searchPlaceholder', lang)}
              className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:bg-[var(--bg-surface)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Zone 3: Reading Comfort, User & Primary CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search on mobile */}
          <button
            onClick={() => onNavigate('search')}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:hidden"
            title="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Reading Comfort & Themes */}
          <div className="relative">
            <button
              onClick={() => {
                setFontMenuOpen(!fontMenuOpen);
                setMoreMenuOpen(false);
              }}
              title={t('readingOptions', lang)}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <Type className="h-3.5 w-3.5 text-[var(--action-primary)]" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {preferences.assistedReading ? 'Asistida' : preferences.fontFamily.toUpperCase()}
              </span>
            </button>

            {fontMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 shadow-xl z-50 text-xs space-y-3"
                role="menu"
              >
                {/* Font Choices */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                    Tipografía
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => {
                        onUpdatePreferences({ fontFamily: 'serif' });
                        setFontMenuOpen(false);
                      }}
                      className={`p-1.5 rounded border font-serif text-center transition-colors ${
                        preferences.fontFamily === 'serif' && !preferences.assistedReading
                          ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      Serif
                    </button>
                    <button
                      onClick={() => {
                        onUpdatePreferences({ fontFamily: 'sans' });
                        setFontMenuOpen(false);
                      }}
                      className={`p-1.5 rounded border font-sans text-center transition-colors ${
                        preferences.fontFamily === 'sans' && !preferences.assistedReading
                          ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      Sans
                    </button>
                    <button
                      onClick={() => {
                        onUpdatePreferences({ fontFamily: 'mono' });
                        setFontMenuOpen(false);
                      }}
                      className={`p-1.5 rounded border font-mono text-center transition-colors ${
                        preferences.fontFamily === 'mono' && !preferences.assistedReading
                          ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      Mono
                    </button>
                  </div>
                </div>

                {/* Assisted Reading Mode */}
                <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Lectura asistida
                    </span>
                    <button
                      onClick={() =>
                        onUpdatePreferences({ assistedReading: !preferences.assistedReading })
                      }
                      role="switch"
                      aria-checked={preferences.assistedReading}
                      className={`h-4 w-7 rounded-full transition-colors relative ${
                        preferences.assistedReading ? 'bg-[var(--action-primary)]' : 'bg-[var(--border-strong)]'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          preferences.assistedReading ? 'translate-x-3.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">
                    {t('assistedDesc', lang)}
                  </p>
                </div>

                {/* Line Focus */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[var(--text-secondary)]">Enfoque de párrafo</span>
                  <button
                    onClick={() => onUpdatePreferences({ lineFocus: !preferences.lineFocus })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      preferences.lineFocus
                        ? 'bg-[var(--action-primary)] text-white border-transparent'
                        : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {preferences.lineFocus ? 'Activado' : 'Desactivado'}
                  </button>
                </div>

                {/* Color Theme Selector */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1">
                  <button
                    onClick={() => onUpdatePreferences({ theme: 'light' })}
                    title="Blanco cálido"
                    className={`p-1.5 rounded flex items-center gap-1.5 ${
                      preferences.theme === 'light'
                        ? 'bg-[var(--bg-subtle)] text-[var(--action-primary)] font-bold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span className="text-[10px]">Cálido</span>
                  </button>
                  <button
                    onClick={() => onUpdatePreferences({ theme: 'sepia' })}
                    title="Sepia neutro"
                    className={`p-1.5 rounded flex items-center gap-1.5 ${
                      preferences.theme === 'sepia'
                        ? 'bg-[var(--bg-subtle)] text-[var(--action-primary)] font-bold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Coffee className="h-3.5 w-3.5" />
                    <span className="text-[10px]">Sepia</span>
                  </button>
                  <button
                    onClick={() => onUpdatePreferences({ theme: 'dark' })}
                    title="Oscuro índigo"
                    className={`p-1.5 rounded flex items-center gap-1.5 ${
                      preferences.theme === 'dark'
                        ? 'bg-[var(--bg-subtle)] text-[var(--action-primary)] font-bold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span className="text-[10px]">Oscuro</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onUpdatePreferences({ language: lang === 'es' ? 'en' : 'es' })}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Cambiar idioma (ES/EN)"
          >
            <Globe className="h-3 w-3" />
            <span className="font-mono text-[11px] font-semibold">{lang.toUpperCase()}</span>
          </button>

          {/* User Profile / Login with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentUser) {
                  setUserMenuOpen(!userMenuOpen);
                  setFontMenuOpen(false);
                  setMoreMenuOpen(false);
                } else {
                  onOpenLogin();
                }
              }}
              className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {currentUser ? (
                <>
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="h-5 w-5 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="h-5 w-5 rounded-full bg-[var(--action-primary)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {currentUser.avatarInitials}
                    </span>
                  )}
                  <span className="hidden sm:inline font-medium text-[var(--text-primary)] truncate max-w-[80px]">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60 hidden sm:inline" />
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                  <span className="font-medium text-[var(--text-primary)]">{t('navLogin', lang)}</span>
                </>
              )}
            </button>

            {currentUser && userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-1.5 shadow-xl z-50 text-xs"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-[var(--border-subtle)] space-y-0.5">
                  <span className="font-semibold text-[var(--text-primary)] block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] block font-mono">
                    @{currentUser.username} · {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onNavigate('my_profile');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
                >
                  <User className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                  <span>Mi Perfil y Aportes</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('my_profile');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                  <span>Mis Hilos y Debates</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('my_profile');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                >
                  <Heart className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Donaciones y Redes</span>
                </button>

                <div className="my-1 border-t border-[var(--border-subtle)]" />

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-[var(--text-tertiary)]"
                >
                  <span>Cambiar cuenta / Salir</span>
                </button>
              </div>
            )}
          </div>

          {/* Escribir Primary Action Button */}
          <button
            onClick={() => onNavigate('editor')}
            className="flex items-center gap-1.5 rounded bg-[var(--action-primary)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--action-hover)] shadow-xs transition-colors whitespace-nowrap"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('navWrite', lang)}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Clean, spacious, uncrowded) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 space-y-2 shadow-lg">
          {currentUser && (
            <div className="pb-2 mb-2 border-b border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  onNavigate('my_profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full p-2 rounded bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold text-xs flex items-center justify-between"
              >
                <span>Mi Perfil ({currentUser.name})</span>
                <span>→</span>
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] font-medium text-[var(--text-primary)]"
            >
              {t('navArticles', lang)}
            </button>
            <button
              onClick={() => {
                onNavigate('areas');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] font-medium text-[var(--text-primary)]"
            >
              {t('navAreas', lang)}
            </button>
            <button
              onClick={() => {
                onNavigate('books');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] font-medium text-[var(--text-primary)]"
            >
              {t('navBooks', lang)}
            </button>
            <button
              onClick={() => {
                onNavigate('gaps');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] font-medium text-[var(--text-primary)]"
            >
              {t('navGaps', lang)}
            </button>
            <button
              onClick={() => {
                onNavigate('repositories');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Portales y repositorios
            </button>
            <button
              onClick={() => {
                onNavigate('thesis');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Tesis y Antítesis
            </button>
            <button
              onClick={() => {
                onNavigate('forum');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Foro de debate
            </button>
            <button
              onClick={() => {
                onNavigate('study_path');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Rutas y práctica
            </button>
            <button
              onClick={() => {
                onNavigate('challenges');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Retos personales
            </button>
            <button
              onClick={() => {
                onNavigate('claims');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded text-left hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Reclamaciones
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
