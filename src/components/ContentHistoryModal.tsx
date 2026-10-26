import React from 'react';
import { History, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ContentVersion, CorrectionNotice } from '../types';

interface ContentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  versions: ContentVersion[];
  corrections?: CorrectionNotice[];
}

export const ContentHistoryModal: React.FC<ContentHistoryModalProps> = ({
  isOpen,
  onClose,
  articleTitle,
  versions,
  corrections,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[var(--action-primary)]" />
              <span className="font-mono text-xs text-[var(--action-primary)] uppercase font-semibold">
                Auditoría y Transparencia
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
              Historial Público de Versiones y Correcciones
            </h2>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
              {articleTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Positive Corrections Banner */}
        {corrections && corrections.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Correcciones reconocidas por el autor (Corregirse suma)</span>
            </h3>

            {corrections.map((corr, i) => (
              <div
                key={i}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                  <span>Rectificación formal</span>
                  <span>{corr.date}</span>
                </div>
                <p className="text-[var(--text-primary)] font-medium">
                  {corr.detail}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Postura anterior:</span>
                    <span className="line-through text-[var(--text-secondary)]">{corr.previousStance}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">Nueva evidencia admitida:</span>
                    <span className="text-[var(--text-primary)] font-medium">{corr.newStance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chronological Version Timeline */}
        <div className="space-y-4">
          <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Registro de versiones ({versions.length})
          </h3>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[var(--border-subtle)]">
            {versions.map((ver) => (
              <div key={ver.id} className="relative flex items-start gap-4 pl-8 text-xs">
                <div className="absolute left-2 top-1.5 h-3 w-3 rounded-full border-2 border-[var(--action-primary)] bg-[var(--bg-surface)] shrink-0" />
                <div className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[var(--action-primary)]">
                      Versión {ver.versionNumber}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      {ver.date}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    {ver.reason}
                  </p>
                  <span className="text-[10px] text-[var(--text-tertiary)] block pt-1">
                    Registrado por {ver.authorName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
          >
            Cerrar historial
          </button>
        </div>
      </div>
    </div>
  );
};
