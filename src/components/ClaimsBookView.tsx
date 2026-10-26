import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Lock,
  Eye,
} from 'lucide-react';
import { ClaimRecord } from '../types';

interface ClaimsBookViewProps {
  claims: ClaimRecord[];
  onAddClaim: (claim: Omit<ClaimRecord, 'id' | 'code' | 'date' | 'status'>) => void;
}

export const ClaimsBookView: React.FC<ClaimsBookViewProps> = ({
  claims,
  onAddClaim,
}) => {
  const [consumerPseudonym, setConsumerPseudonym] = useState('');
  const [type, setType] = useState<ClaimRecord['type']>('sugerencia');
  const [detail, setDetail] = useState('');
  const [request, setRequest] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) return;

    const pseudonym = consumerPseudonym.trim() || 'Lector/a anónimo';
    const generatedCode = `REC-2026-00${claims.length + 43}`;

    onAddClaim({
      consumerPseudonym: pseudonym,
      type,
      isPublic,
      detail: detail.trim(),
      request: request.trim(),
    });

    setSubmittedCode(generatedCode);
    setConsumerPseudonym('');
    setDetail('');
    setRequest('');
    setIsPublic(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <section className="border-b border-[var(--border-subtle)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
          <FileText className="h-4 w-4" />
          <span>Atención al Usuario y Transparencia Institucional</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Libro de Reclamaciones y Sugerencias
        </h1>
        <p className="font-serif text-sm text-[var(--text-secondary)] leading-relaxed">
          Canal oficial para presentar quejas sobre moderación, reclamos técnicos o sugerencias de diseño y funcionalidad. Privacidad por defecto: los datos personales jamás se publican.
        </p>
      </section>

      {/* Confirmation banner if just submitted */}
      {submittedCode && (
        <div className="p-4 rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-950/40 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span>Registro completado con éxito</span>
          </div>
          <p>
            Tu solicitud ha sido radicada bajo el código oficial:{' '}
            <strong className="font-mono">{submittedCode}</strong>. Puedes consultar su tramitación en la tabla pública de seguimiento inferior.
          </p>
        </div>
      )}

      {/* Complaint Form */}
      <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--border-subtle)] pb-3">
          <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Hoja de Reclamación Virtual
          </h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Todos los datos se procesan con estricto apego a la privacidad. Sin almacenamiento de cookies ni cesión a terceros.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">
              Seudónimo o identificador público opcional:
            </label>
            <input
              type="text"
              value={consumerPseudonym}
              onChange={(e) => setConsumerPseudonym(e.target.value)}
              placeholder="Ej: Ciudadana M.V. o Estudiante de Grado (No requiere nombre real)"
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5 block">
              * Para proteger tu privacidad, jamás solicitamos ni publicamos tu DNI, teléfono ni dirección.
            </span>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">
              Tipo de solicitud:*
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition-colors ${
                  type === 'sugerencia'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] font-semibold text-[var(--action-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'sugerencia'}
                  onChange={() => setType('sugerencia')}
                />
                <span>Sugerencia de mejora</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition-colors ${
                  type === 'reclamo'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] font-semibold text-[var(--action-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'reclamo'}
                  onChange={() => setType('reclamo')}
                />
                <span>Reclamo técnico</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition-colors ${
                  type === 'queja'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] font-semibold text-[var(--action-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'queja'}
                  onChange={() => setType('queja')}
                />
                <span>Queja de moderación</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">
              Detalle de los hechos o motivo:*
            </label>
            <textarea
              required
              rows={4}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Describe lo sucedido o tu sugerencia para los mantenedores..."
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">
              Petición concreta o solución esperada:
            </label>
            <textarea
              rows={2}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Indica qué acción solicitas al equipo de Chen..."
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          {/* Privacy Toggle (Conflict 4 Solved) */}
          <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-0.5 rounded border-[var(--border-subtle)]"
            />
            <label htmlFor="isPublic" className="text-xs text-[var(--text-secondary)] cursor-pointer">
              <strong className="text-[var(--text-primary)] block">Hacer visible el texto de la reclamación en el registro público</strong>
              Por defecto, el contenido detallado se mantiene estrictamente privado y solo se muestra el código, categoría y la respuesta oficial de Chen.
            </label>
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-xs transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Registrar reclamación oficial</span>
            </button>
          </div>
        </form>
      </section>

      {/* Public Tracking Table of Claims (Conflict 4 Strict Compliance) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Registro público de tramitaciones ({claims.length})
          </h3>
          <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>Datos privados protegidos</span>
          </span>
        </div>

        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2 text-xs shadow-xs"
            >
              {/* Public metadata row: code, category, date, status */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[var(--text-tertiary)] border-b border-[var(--border-subtle)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {claim.code}
                  </span>
                  <span>·</span>
                  <span className="capitalize font-medium text-[var(--action-primary)]">
                    {claim.type}
                  </span>
                  <span>·</span>
                  <span>{claim.date}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                    claim.status === 'atendido'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                  }`}
                >
                  {claim.status === 'atendido' ? '✓ Atendido' : '● En trámite'}
                </span>
              </div>

              {/* Text detail: shown ONLY if isPublic is true */}
              {claim.isPublic ? (
                <p className="font-serif text-xs text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-[var(--text-primary)]">Detalle público:</strong> {claim.detail}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] italic py-1">
                  <Lock className="h-3 w-3" />
                  <span>Texto privado a solicitud del autor (solo visible para mantenedores).</span>
                </div>
              )}

              {/* Official Response */}
              {claim.officialReply && (
                <div className="p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] space-y-0.5">
                  <span className="font-semibold text-[var(--text-primary)] block">
                    Respuesta oficial de Chen ({claim.responseDate}):
                  </span>
                  <p>{claim.officialReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
