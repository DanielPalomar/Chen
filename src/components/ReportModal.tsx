import React, { useState } from 'react';
import { Flag, X, ShieldAlert, Check } from 'lucide-react';
import { ReportItem } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: ReportItem['targetType'];
  targetTitle: string;
  onSubmitReport: (report: ReportItem) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ReportItem['reason']>('linea_roja');
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: ReportItem = {
      id: `rep-${Date.now().toString(36)}`,
      targetId,
      targetType,
      targetTitle,
      reason,
      detail: detail.trim(),
      reporterPseudonym: 'Lector anónimo',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'new',
    };

    onSubmitReport(newReport);
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
            <Flag className="h-4 w-4 text-rose-600" />
            <h3 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Reportar a los moderadores de área
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
              Reporte enviado a la cola pública de moderación
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded bg-[var(--bg-subtle)] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
                <span>Contenido reportado:</span>
                <span className="font-mono uppercase text-[10px] text-[var(--action-primary)] font-semibold">{targetType}</span>
              </div>
              <span className="font-serif font-semibold text-xs text-[var(--text-primary)] line-clamp-2">
                {targetTitle}
              </span>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-[var(--text-primary)]">
                Motivo del reporte *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportItem['reason'])}
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none text-[var(--text-primary)]"
              >
                <option value="linea_roja">Vulneración de Línea Roja comunitaria</option>
                <option value="ataque_personal">Ataque personal o ad hominem</option>
                <option value="plagio">Plagio o copia sin atribución</option>
                <option value="desinformacion">Desinformación o afirmación sin fundamento</option>
                <option value="falta_citas">Falta de citas de respaldo indispensables</option>
                <option value="etiqueta_incorrecta">Etiqueta epistémica engañosa</option>
                <option value="spam">Spam o autopromoción encubierta</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-[var(--text-primary)]">
                Detalle y justificación para los moderadores *
              </label>
              <textarea
                rows={3}
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Indica con precisión en qué párrafo se vulnera la norma y por qué..."
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-[var(--text-tertiary)]">
              * Todo reporte resuelto genera una entrada pública en el registro transparente de moderación.
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
                className="px-3.5 py-1.5 rounded bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                Enviar reporte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
