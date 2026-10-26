import React, { useState } from 'react';
import {
  ShieldCheck,
  Filter,
  AlertCircle,
  FileText,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_MODERATION_LOG } from '../data/initialData';
import { ModerationLogEntry } from '../types';

export const ModerationLogView: React.FC = () => {
  const [entries, setEntries] = useState<ModerationLogEntry[]>(INITIAL_MODERATION_LOG);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [appealModalEntry, setAppealModalEntry] = useState<ModerationLogEntry | null>(null);
  const [appealReason, setAppealReason] = useState('');
  const [appealSent, setAppealSent] = useState(false);

  const filtered = entries.filter((e) => {
    if (filterAction === 'all') return true;
    return e.action === filterAction;
  });

  const getActionBadge = (action: ModerationLogEntry['action']) => {
    switch (action) {
      case 'correccion_etiqueta':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            Corrección de etiqueta
          </span>
        );
      case 'aviso':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
            Aviso preventivo
          </span>
        );
      case 'retirada':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
            Retirada de contenido
          </span>
        );
      case 'suspension':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300">
            Suspensión temporal
          </span>
        );
    }
  };

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealModalEntry) return;

    setEntries((prev) =>
      prev.map((item) =>
        item.id === appealModalEntry.id
          ? { ...item, status: 'en_apelacion' as const }
          : item
      )
    );

    setAppealSent(true);
    setTimeout(() => {
      setAppealSent(false);
      setAppealModalEntry(null);
      setAppealReason('');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-[var(--border-subtle)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
          <ShieldCheck className="h-4 w-4" />
          <span>Principio de Transparencia de Chen</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Registro público de moderación
        </h1>
        <p className="font-serif text-base text-[var(--text-secondary)]">
          Todas las resoluciones, advertencias, reclasificaciones y apelaciones son públicas. En Chen no existe la censura encubierta ni los bloqueos opacos.
        </p>
      </section>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-secondary)]">Filtrar por acción:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs text-[var(--text-primary)]"
          >
            <option value="all">Todas las acciones</option>
            <option value="correccion_etiqueta">Corrección de etiqueta</option>
            <option value="aviso">Avisos preventivos</option>
            <option value="retirada">Retiradas</option>
          </select>
        </div>

        <div className="text-[var(--text-tertiary)] font-mono">
          Mostrando {filtered.length} resoluciones auditables
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 text-[var(--text-primary)] font-semibold">
            <tr>
              <th className="p-3.5">Fecha</th>
              <th className="p-3.5">Acción</th>
              <th className="p-3.5">Objeto / Título</th>
              <th className="p-3.5">Regla referenciada</th>
              <th className="p-3.5">Motivo y dictamen</th>
              <th className="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                <td className="p-3.5 whitespace-nowrap font-mono text-[var(--text-tertiary)]">
                  {item.date}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  {getActionBadge(item.action)}
                </td>
                <td className="p-3.5 font-medium text-[var(--text-primary)] max-w-xs">
                  {item.targetTitle}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
                  {item.ruleViolated}
                </td>
                <td className="p-3.5 text-[var(--text-secondary)] leading-relaxed max-w-sm">
                  {item.rationale}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  {item.status === 'en_apelacion' ? (
                    <span className="font-medium text-amber-700 dark:text-amber-300">
                      En apelación
                    </span>
                  ) : item.status === 'resuelta' ? (
                    <span className="font-medium text-teal-700 dark:text-teal-300">
                      Resuelta
                    </span>
                  ) : (
                    <button
                      onClick={() => setAppealModalEntry(item)}
                      className="text-[var(--action-primary)] hover:underline"
                    >
                      Apelar dictamen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appeal Dialog */}
      {appealModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Apelación pública de resolución
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Dictamen a apelar: <strong>{appealModalEntry.targetTitle}</strong>
            </p>

            {appealSent ? (
              <div className="p-3 rounded bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                ✓ Apelación registrada en el log público. Dos moderadores independientes del área revisarán la réplica en un plazo de 72 horas.
              </div>
            ) : (
              <form onSubmit={handleSendAppeal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--text-primary)] font-medium mb-1">
                    Fundamento de la apelación (evidencias, citas o aclaración):
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder="Detalla por qué la resolución contradice el manifiesto o aporta las citas omitidas..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setAppealModalEntry(null)}
                    className="px-3 py-1.5 rounded text-[var(--text-secondary)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                  >
                    Presentar apelación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
