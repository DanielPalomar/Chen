import React, { useState } from 'react';
import { Scale, X, Check } from 'lucide-react';
import { ModerationLogEntry } from '../types';

interface AppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ModerationLogEntry;
  onSubmitAppeal: (entryId: string, appealText: string) => void;
}

export const AppealModal: React.FC<AppealModalProps> = ({
  isOpen,
  onClose,
  entry,
  onSubmitAppeal,
}) => {
  const [appealText, setAppealText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;

    onSubmitAppeal(entry.id, appealText.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--action-primary)]" />
            <h3 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Apelación pública de sanción
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <Check className="h-8 w-8 mx-auto text-emerald-600" />
            <p className="text-xs font-medium text-[var(--text-primary)]">
              Apelación registrada en estado «En apelación»
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded bg-[var(--bg-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-tertiary)] block">
                Sanción apelada:
              </span>
              <span className="font-serif font-semibold text-xs text-[var(--text-primary)] block">
                {entry.targetTitle}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Motivo original: {entry.rationale}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-[var(--text-primary)]">
                Argumento de descargo y evidencias *
              </label>
              <textarea
                rows={4}
                required
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Explica por qué la sanción fue desproporcionada o aporta las citas omitidas..."
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-[var(--text-tertiary)]">
              * Dos moderadores de un área distinta evaluarán la apelación para garantizar neutralidad.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)]"
              >
                Enviar apelación formal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
