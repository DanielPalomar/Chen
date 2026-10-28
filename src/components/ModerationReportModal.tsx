import React, { useState } from 'react';
import { ModerationReport } from '../types/chen';

interface ModerationReportModalProps {
  targetVersionId: string;
  articleTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: ModerationReport) => void;
}

export const ModerationReportModal: React.FC<ModerationReportModalProps> = ({
  targetVersionId,
  articleTitle,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ModerationReport['reason']>('unattributed_plagiarism');
  const [description, setDescription] = useState('');
  const [reporterHandle, setReporterHandle] = useState('investigador-anon');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReport: ModerationReport = {
      id: `rep-${Date.now().toString(36)}`,
      targetVersionId,
      reporterHandle,
      reason,
      description,
      status: 'pending_review',
      createdAt: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    onSubmitReport(newReport);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg p-6 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Reportar Incidencia Epistémica o Metodológica
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-lg cursor-pointer font-mono"
          >
            &times;
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
          Artículo evaluado: <strong>{articleTitle}</strong> (Versión: <code className="font-mono">{targetVersionId}</code>)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-mono uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Motivo del reporte:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ModerationReport['reason'])}
              className="w-full p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 font-sans"
            >
              <option value="unattributed_plagiarism">Plagio o falta de atribución original</option>
              <option value="fabricated_citation">Cita textual apócrifa o descontextualizada</option>
              <option value="personal_attack">Ataque ad-hominem o vulneración de código de conducta</option>
              <option value="spam">Spam o contenido comercial encubierto</option>
            </select>
          </div>

          <div>
            <label className="block font-mono uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Descripción detallada de la objeción:
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué fragmento o referencia incumple las directivas de argumentación abierta..."
              className="w-full p-3 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 font-sans"
            />
          </div>

          <div>
            <label className="block font-mono uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Identificador del auditor (público / seudónimo):
            </label>
            <input
              type="text"
              value={reporterHandle}
              onChange={(e) => setReporterHandle(e.target.value)}
              className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors cursor-pointer"
            >
              Registrar Reporte de Auditoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
