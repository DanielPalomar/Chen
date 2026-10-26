import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Shield,
  Type,
  Sun,
  Moon,
  Coffee,
  Check,
  Globe,
  Sliders,
  FileText,
  AlertTriangle,
  Eye,
  Maximize2,
  Trash2,
} from 'lucide-react';
import { UserPreferences, CLOSED_LICENSES } from '../types';
import {
  exportAllDataAsJson,
  exportAllArticlesAsMarkdownBundle,
  resetToSeedData,
} from '../utils/storage';
import { t } from '../i18n/translations';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onBack,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lang = preferences.language || 'es';

  const handleDeleteAllLocalData = () => {
    if (confirmDelete) {
      resetToSeedData();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-[var(--border-subtle)] pb-4 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          {t('settingsTitle', lang)}
        </h1>
        <p className="text-xs text-[var(--text-tertiary)]">
          Configuración personal almacenada exclusivamente en tu navegador (LocalStorage). Ningún dato es transmitido a servidores externos ni rastreadores.
        </p>
      </section>

      <div className="space-y-6 text-xs text-[var(--text-secondary)]">
        {/* Language Selection */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[var(--action-primary)]" />
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Idioma de la Plataforma / Interface Language
            </h3>
          </div>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Chen está diseñado con soporte multilingüe completo (español por defecto e inglés).
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onUpdatePreferences({ language: 'es' })}
              className={`p-3 rounded border text-left flex items-center justify-between transition-colors ${
                lang === 'es'
                  ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Español (predeterminado)</span>
              {lang === 'es' && <Check className="h-4 w-4" />}
            </button>

            <button
              onClick={() => onUpdatePreferences({ language: 'en' })}
              className={`p-3 rounded border text-left flex items-center justify-between transition-colors ${
                lang === 'en'
                  ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>English</span>
              {lang === 'en' && <Check className="h-4 w-4" />}
            </button>
          </div>
        </section>

        {/* Theme Settings (Light / Sepia / Dark) */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Paleta y Ambiente Visual
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Contraste verificado WCAG 2.2 AA y AAA para lectura prolongada sin fatiga ocular.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => onUpdatePreferences({ theme: 'light' })}
              className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                preferences.theme === 'light'
                  ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium">Blanco cálido</span>
                <span className="text-[11px] font-normal text-[var(--text-tertiary)]">
                  Fondo papel #FAFAF9
                </span>
              </div>
            </button>

            <button
              onClick={() => onUpdatePreferences({ theme: 'sepia' })}
              className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                preferences.theme === 'sepia'
                  ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Coffee className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium">Modo Sepia</span>
                <span className="text-[11px] font-normal text-[var(--text-tertiary)]">
                  Fondo neutro #F6F1E7
                </span>
              </div>
            </button>

            <button
              onClick={() => onUpdatePreferences({ theme: 'dark' })}
              className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                preferences.theme === 'dark'
                  ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium">Oscuro sobrio</span>
                <span className="text-[11px] font-normal text-[var(--text-tertiary)]">
                  Fondo índigo #0F0E1A
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Accessibility & Typography Controls */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Tipografía y Accesibilidad Editorial
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Ajusta el cuerpo, la fuente y las ayudas cognitivas de lectura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="block font-medium text-[var(--text-primary)]">
                Tamaño del cuerpo de lectura:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdatePreferences({ textSize: 'standard' })}
                  className={`flex-1 py-1.5 px-3 rounded border transition-colors ${
                    preferences.textSize === 'standard'
                      ? 'bg-[var(--action-primary)] text-white font-medium border-transparent'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Estándar (18 px)
                </button>
                <button
                  onClick={() => onUpdatePreferences({ textSize: 'large' })}
                  className={`flex-1 py-1.5 px-3 rounded border transition-colors ${
                    preferences.textSize === 'large'
                      ? 'bg-[var(--action-primary)] text-white font-medium border-transparent'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Grande (20 px)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-[var(--text-primary)]">
                Familia tipográfica:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdatePreferences({ fontFamily: 'serif' })}
                  className={`py-1.5 px-2 rounded border font-serif text-xs transition-colors ${
                    preferences.fontFamily === 'serif'
                      ? 'bg-[var(--action-primary)] text-white font-medium border-transparent'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => onUpdatePreferences({ fontFamily: 'sans' })}
                  className={`py-1.5 px-2 rounded border font-sans text-xs transition-colors ${
                    preferences.fontFamily === 'sans'
                      ? 'bg-[var(--action-primary)] text-white font-medium border-transparent'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => onUpdatePreferences({ fontFamily: 'mono' })}
                  className={`py-1.5 px-2 rounded border font-mono text-xs transition-colors ${
                    preferences.fontFamily === 'mono'
                      ? 'bg-[var(--action-primary)] text-white font-medium border-transparent'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Mono / Dislexia
                </button>
              </div>
            </div>
          </div>

          {/* Assisted Reading & Line Focus */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-medium text-[var(--text-primary)] block">
                  Lectura asistida
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Mayor espaciado de caracteres y palabras, interlineado amplio (1.9) y ancho de columna restringido a 62 caracteres para mayor descanso visual y neurodiversidad.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.assistedReading}
                onClick={() =>
                  onUpdatePreferences({ assistedReading: !preferences.assistedReading })
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out ${
                  preferences.assistedReading
                    ? 'bg-[var(--action-primary)]'
                    : 'bg-[var(--border-strong)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                    preferences.assistedReading ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <div className="space-y-0.5">
                <span className="font-medium text-[var(--text-primary)] block">
                  Guía de lectura de una línea (Line Focus)
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Resalta la línea activa del cursor para evitar saltos accidentales de renglón en lecturas densas.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.lineFocus}
                onClick={() =>
                  onUpdatePreferences({ lineFocus: !preferences.lineFocus })
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out ${
                  preferences.lineFocus
                    ? 'bg-[var(--action-primary)]'
                    : 'bg-[var(--border-strong)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                    preferences.lineFocus ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Default License Configuration */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Licencia Abierta Predeterminada para tus Aportes
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              En Chen cada autor conserva la autoría de sus textos y elige una licencia de una lista cerrada compatible con el conocimiento libre.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {CLOSED_LICENSES.map((lic) => (
              <button
                key={lic.id}
                onClick={() => onUpdatePreferences({ defaultLicense: lic.id })}
                className={`p-2.5 rounded border text-left transition-colors ${
                  preferences.defaultLicense === lic.id
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="font-mono text-xs">{lic.name}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  {lic.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Zero-Ads Guarantee Banner */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Compromiso de Cero Publicidad y Cero Rastreo
            </h3>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Chen está completamente libre de publicidad comercial, patrocinios de marcas y algoritmos de retención. No vendemos visibilidad, el dinero nunca compra reputación y los libros de libre acceso están siempre catalogados y disponibles de manera abierta y gratuita.
          </p>
        </section>

        {/* Data Portability (One-click full export) */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Soberanía y Portabilidad de Datos
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Descarga tu portafolio completo, artículos y cuaderno de repaso en un solo clic. Sin candados de plataforma.
            </p>
          </div>

          <div className="pt-1 flex flex-wrap gap-3">
            <button
              onClick={exportAllDataAsJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar todo en JSON</span>
            </button>

            <button
              onClick={exportAllArticlesAsMarkdownBundle}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] font-medium"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Exportar artículos en Markdown (.md)</span>
            </button>
          </div>
        </section>

        {/* Account Deletion & Local Wipe */}
        <section className="rounded-lg border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <h3 className="font-serif text-sm font-semibold">
              Eliminación de Datos Locales y Sesión
            </h3>
          </div>
          <p className="text-[11px] text-rose-700 dark:text-rose-400">
            Borra todo el almacenamiento local del navegador (artículos creados, tarjetas de repaso, hilos de discusión y sesión de demostración). Esta acción es irreversible.
          </p>

          <div className="pt-1">
            <button
              onClick={handleDeleteAllLocalData}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium transition-colors ${
                confirmDelete
                  ? 'bg-rose-700 text-white hover:bg-rose-800'
                  : 'border border-rose-300 text-rose-700 bg-white dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>
                {confirmDelete
                  ? '¿Confirmas el borrado total? Haz clic de nuevo'
                  : 'Borrar todos mis datos locales'}
              </span>
            </button>
          </div>
        </section>
      </div>

      <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
        >
          Guardar y volver
        </button>
      </div>
    </div>
  );
};
