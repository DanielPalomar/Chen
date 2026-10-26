import React from 'react';
import { Download, ShieldCheck, Code2, BookOpen, Globe, Heart, FileText, Scale } from 'lucide-react';
import { exportAllDataAsJson, exportAllArticlesAsMarkdownBundle } from '../utils/storage';
import { AppLanguage, t } from '../i18n/translations';

interface FooterProps {
  language: AppLanguage;
  onNavigateManifesto: () => void;
  onNavigateModeration: () => void;
  onNavigateSustainability: () => void;
  onNavigateRepositories: () => void;
  onNavigateBooks: () => void;
  onNavigateClaims: () => void;
  onNavigateForum: () => void;
  onNavigateAreas: () => void;
  onNavigateRedLines: () => void;
  onNavigateReputation: () => void;
  onOpenRss: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigateManifesto,
  onNavigateModeration,
  onNavigateSustainability,
  onNavigateRepositories,
  onNavigateBooks,
  onNavigateClaims,
  onNavigateForum,
  onNavigateAreas,
  onNavigateRedLines,
  onNavigateReputation,
  onOpenRss,
}) => {
  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Upper Row: Brand Promise & Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--text-primary)]">
              <span>Chen</span>
              <span className="font-sans text-xs font-normal text-[var(--text-tertiary)]">
                · {t('tagline', language)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              {t('subTagline', language)}
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <button
              onClick={onNavigateAreas}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navAreas', language)}
            </button>
            <button
              onClick={onNavigateBooks}
              className="hover:text-[var(--action-primary)] hover:underline flex items-center gap-1 font-medium text-[var(--text-primary)]"
            >
              <BookOpen className="h-3 w-3 text-[var(--action-primary)]" />
              <span>{t('navBooks', language)}</span>
            </button>
            <button
              onClick={onNavigateRepositories}
              className="hover:text-[var(--action-primary)] hover:underline flex items-center gap-1"
            >
              <Globe className="h-3 w-3" />
              <span>{t('navRepositories', language)}</span>
            </button>
            <button
              onClick={onNavigateForum}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navForum', language)}
            </button>
            <button
              onClick={onNavigateClaims}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navClaims', language)}
            </button>
            <button
              onClick={onNavigateManifesto}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navManifesto', language)}
            </button>
            <button
              onClick={onNavigateModeration}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navModeration', language)}
            </button>
            <button
              onClick={onNavigateRedLines}
              className="hover:text-[var(--action-primary)] hover:underline text-rose-700 dark:text-rose-400"
            >
              {t('navRedLines', language)}
            </button>
            <button
              onClick={onNavigateReputation}
              className="hover:text-[var(--action-primary)] hover:underline"
            >
              {t('navReputation', language)}
            </button>
            <button
              onClick={onOpenRss}
              className="hover:text-[var(--action-primary)] hover:underline font-mono text-[11px]"
            >
              RSS / Boletín
            </button>
          </div>
        </div>

        {/* Data Exports and Software License Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-tertiary)]">Exportación soberana de tus datos:</span>
            <button
              onClick={exportAllDataAsJson}
              className="hover:text-[var(--action-primary)] hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <Download className="h-3 w-3" />
              <span>Exportar todo (JSON)</span>
            </button>
            <span className="text-[var(--border-strong)]">·</span>
            <button
              onClick={exportAllArticlesAsMarkdownBundle}
              className="hover:text-[var(--action-primary)] hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <FileText className="h-3 w-3" />
              <span>Exportar artículos (.MD)</span>
            </button>
          </div>

          <a
            href="https://www.gnu.org/licenses/agpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--action-primary)] hover:underline flex items-center gap-1 text-[11px]"
          >
            <Code2 className="h-3 w-3" />
            <span>Código libre AGPLv3 en GitHub</span>
          </a>
        </div>

        {/* Conflict 1 Solved: Strict Sustainability Pledge without ads/sponsors */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[var(--text-secondary)] font-medium">
              {t('sustainabilityPledge', language)}
            </span>
          </div>

          <button
            onClick={onNavigateSustainability}
            className="text-[var(--action-primary)] hover:underline font-medium text-xs whitespace-nowrap"
          >
            {t('sustainabilityLink', language)} →
          </button>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-tertiary)] pt-2">
          <span>Chen · Octubre 2026 · Versión 0.9 (Fase 1 y 2 en marcha)</span>
          <span className="flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>El dinero nunca compra reputación ni privilegios en Chen.</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
