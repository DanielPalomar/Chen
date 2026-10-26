import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { PROHIBITED_TOPICS } from '../data/initialData';
import { AppLanguage } from '../i18n/translations';

interface RedLinesViewProps {
  language: AppLanguage;
  onNavigateManifesto: () => void;
  onNavigateModeration: () => void;
}

export const RedLinesView: React.FC<RedLinesViewProps> = ({
  language,
  onNavigateManifesto,
  onNavigateModeration,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
            Normas Comunitarias
          </span>
          <span className="text-[var(--text-tertiary)]">·</span>
          <span className="text-xs text-[var(--text-tertiary)]">Línea roja cerrada y por escrito</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Líneas Rojas en Chen
        </h1>
        <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
          Chen defiende el debate radical con argumentos, pero delimita de forma estricta conductas que destruyen la confianza y el rigor del conocimiento compartido.
        </p>
      </div>

      {/* Principle of strict moderation */}
      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
        <span className="font-semibold text-[var(--text-primary)] block">
          Principio de moderación pública:
        </span>
        <p>
          Ninguna sanción o retirada en Chen se ejecuta de manera opaca o algorítmica. Toda intervención moderadora queda registrada públicamente en el panel de moderación con motivo, sanción y derecho a apelación.
        </p>
      </div>

      {/* Prohibited topics list */}
      <div className="space-y-4">
        {PROHIBITED_TOPICS.map((item, index) => (
          <div
            key={item.topic}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                0{index + 1}
              </span>
              <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
                {item.topic}
              </h2>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {item.description}
            </p>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] flex items-center gap-2 text-[var(--text-tertiary)]">
              <span className="font-medium text-[var(--text-primary)]">Escalera de sanción:</span>
              <span>{item.sanction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs">
        <button
          onClick={onNavigateManifesto}
          className="text-[var(--action-primary)] hover:underline"
        >
          ← Ver los 5 principios del Manifiesto
        </button>
        <button
          onClick={onNavigateModeration}
          className="text-[var(--action-primary)] hover:underline flex items-center gap-1"
        >
          <span>Consultar Registro Público de Sanciones</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
