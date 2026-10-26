import React from 'react';
import { Award, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppLanguage } from '../i18n/translations';

interface ReputationExplainerViewProps {
  language: AppLanguage;
  onNavigateAreas: () => void;
  onNavigateHome: () => void;
}

export const ReputationExplainerView: React.FC<ReputationExplainerViewProps> = ({
  language,
  onNavigateAreas,
  onNavigateHome,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
            Gobernanza Epistémica
          </span>
          <span className="text-[var(--text-tertiary)]">·</span>
          <span className="text-xs text-[var(--text-tertiary)]">Sin rankings globales ni likes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Cómo Funciona la Reputación en Chen
        </h1>
        <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
          En Chen la credibilidad no se compra con dinero, no se mide en seguidores y no es un número global de vanidad. Existe exclusivamente dentro de cada área de conocimiento.
        </p>
      </div>

      {/* 4 Pillars of Chen Reputation */}
      <div className="space-y-5">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              La reputación es estrictamente por área
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Ser un experto reconocido en Bioquímica no te otorga automáticamente credibilidad para dirimir disputas en Filosofía de la Ciencia o en Teoría de Tipos. Tu historial de aportes se contabiliza por separado en cada taxonomía.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Se gana mediante revisión abierta y citas fundamentadas
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            La reputación aumenta cuando otros autores citan tus trabajos con una función declarada (*apoya, contradice o amplía*) o cuando completas revisiones abiertas rigurosas. No existe el botón de «me gusta» ni el de compartir algorítmico.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Corregirse suma: La insignia «Cambié de opinión»
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            A diferencia de las redes sociales convencionales, donde admitir un error se castiga con burla, en Chen rectificar públicamente una postura ante una evidencia concluyente otorga una marca de honestidad intelectual visible en tu portafolio.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Límites de ritmo y detección de colusión
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Para prevenir granjas de citas y manipulación coordinada, Chen aplica límites de ritmo estrictos: citas cruzadas repetitivas entre las mismas dos cuentas dentro de una misma semana no incrementan el conteo y son derivadas a la cola de moderación.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs">
        <button
          onClick={onNavigateHome}
          className="text-[var(--action-primary)] hover:underline"
        >
          ← Volver a portada
        </button>
        <button
          onClick={onNavigateAreas}
          className="text-[var(--action-primary)] hover:underline flex items-center gap-1"
        >
          <span>Ver Áreas y Moderadores</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
