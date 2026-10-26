import React from 'react';
import {
  Check,
  X,
  ArrowUpRight,
  ShieldCheck,
  Link as LinkIcon,
  Bot,
} from 'lucide-react';
import {
  EpistemicStatus,
  CitationRelation,
  ContentLevel,
  OpenLicense,
} from '../types';

export const EpistemicBadge: React.FC<{ status: EpistemicStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'fact':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" aria-hidden="true" />
          <span>Hecho demostrado</span>
        </span>
      );
    case 'hypothesis':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" aria-hidden="true" />
          <span>Hipótesis falsable</span>
        </span>
      );
    case 'opinion':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-violet-800 dark:text-violet-300 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0" aria-hidden="true" />
          <span>Opinión / Análisis</span>
        </span>
      );
    case 'ai-generated':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-tertiary)] ${className}`}
        >
          <Bot className="h-3 w-3 shrink-0 text-[var(--text-tertiary)]" />
          <span>IA declarada</span>
        </span>
      );
  }
};

export const CitationFunctionBadge: React.FC<{
  relation: CitationRelation;
  className?: string;
}> = ({ relation, className = '' }) => {
  switch (relation) {
    case 'supports':
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 ${className}`}
        >
          <Check className="h-3 w-3 shrink-0" />
          <span>Apoya</span>
        </span>
      );
    case 'contradicts':
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 ${className}`}
        >
          <X className="h-3 w-3 shrink-0" />
          <span>Contradice</span>
        </span>
      );
    case 'extends':
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 ${className}`}
        >
          <ArrowUpRight className="h-3 w-3 shrink-0" />
          <span>Amplía</span>
        </span>
      );
  }
};

export const LevelIndicator: React.FC<{ level: ContentLevel }> = ({ level }) => {
  const dots = level === 'intro' ? 1 : level === 'intermediate' ? 2 : 3;
  const label =
    level === 'intro'
      ? 'Introductorio'
      : level === 'intermediate'
      ? 'Intermedio'
      : 'Avanzado';

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dots >= 2 ? 'bg-[var(--action-primary)]' : 'bg-[var(--border-strong)] opacity-50'
          }`}
        />
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dots === 3 ? 'bg-[var(--action-primary)]' : 'bg-[var(--border-strong)] opacity-50'
          }`}
        />
      </span>
      <span>{label}</span>
    </div>
  );
};

export const VerificationBadge: React.FC<{
  verified: boolean;
  label?: string;
  url?: string;
}> = ({ verified, label, url }) => {
  if (verified) {
    return (
      <span
        title="Perfil verificado mediante OAuth técnico (GitHub / ORCID)"
        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-300"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{label || 'Verificado'}</span>
      </span>
    );
  }

  return (
    <span
      title="Enlace proporcionado por el autor. No verificado técnicamente."
      className="inline-flex items-center gap-1 text-xs font-normal text-[var(--text-tertiary)]"
    >
      <LinkIcon className="h-3 w-3 text-[var(--text-tertiary)]" />
      <span>{label || 'No verificado'}</span>
    </span>
  );
};

export const LicenseChip: React.FC<{ license: OpenLicense }> = ({ license }) => {
  return (
    <span className="font-mono text-xs text-[var(--text-tertiary)]">
      {license}
    </span>
  );
};
