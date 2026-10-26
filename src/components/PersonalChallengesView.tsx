import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, X, Calendar, Lock, Globe } from 'lucide-react';
import { PersonalChallenge, Milestone } from '../types';
import { AppLanguage } from '../i18n/translations';

interface PersonalChallengesViewProps {
  language: AppLanguage;
  challenges: PersonalChallenge[];
  onAddChallenge: (challenge: PersonalChallenge) => void;
  onToggleMilestone: (challengeId: string, milestoneId: string) => void;
}

export const PersonalChallengesView: React.FC<PersonalChallengesViewProps> = ({
  language,
  challenges,
  onAddChallenge,
  onToggleMilestone,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [milestonesText, setMilestonesText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goal.trim()) return;

    const parsedMilestones: Milestone[] = milestonesText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((text, i) => ({
        id: `ms-${Date.now()}-${i}`,
        title: text,
        completed: false,
      }));

    const newChallenge: PersonalChallenge = {
      id: `ch-${Date.now().toString(36)}`,
      title: title.trim(),
      goal: goal.trim(),
      deadline: deadline.trim() || 'Sin fecha límite fija',
      isPublic,
      milestones:
        parsedMilestones.length > 0
          ? parsedMilestones
          : [{ id: `ms-1`, title: 'Primer hito del proyecto', completed: false }],
    };

    onAddChallenge(newChallenge);
    setIsModalOpen(false);
    setTitle('');
    setGoal('');
    setDeadline('');
    setMilestonesText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
              Estudio Autónomo
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-xs text-[var(--text-tertiary)]">Sin rachas ni presión social</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
            Retos Personales de Aprendizaje
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Fija tus propios proyectos de investigación y estudio a largo plazo. El avance se mide únicamente por hitos reales completados, nunca por puntos ni clasificaciones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Crear reto personal</span>
        </button>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {challenges.map((challenge) => {
          const completedCount = challenge.milestones.filter((m) => m.completed).length;
          const totalCount = challenge.milestones.length;
          const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={challenge.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                      {challenge.title}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] font-mono">
                      {challenge.isPublic ? (
                        <>
                          <Globe className="h-3 w-3 text-emerald-600" />
                          <span>Público</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          <span>Privado</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {challenge.goal}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] shrink-0 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Meta: {challenge.deadline}</span>
                </div>
              </div>

              {/* Progress Bar without gamification */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
                  <span>Hitos completados: {completedCount} de {totalCount}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--action-primary)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones checklist */}
              <div className="space-y-2 pt-2 text-xs">
                {challenge.milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onToggleMilestone(challenge.id, m.id)}
                    className="w-full flex items-start gap-2.5 p-2 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-[var(--border-strong)] shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs ${
                        m.completed
                          ? 'line-through text-[var(--text-tertiary)]'
                          : 'text-[var(--text-primary)] font-medium'
                      }`}
                    >
                      {m.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Challenge Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Nuevo Reto de Estudio Personal
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Sin competencia ni medallas de vanidad; un compromiso personal con tu aprendizaje.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Título del reto *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Escribo mi libro sobre física en un año"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Objetivo principal *
                </label>
                <textarea
                  rows={2}
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="¿Qué producto o demostración tangible resultará de este esfuerzo?"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Plazo estimado
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Ej. Octubre 2027"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Visibilidad
                  </label>
                  <select
                    value={isPublic ? 'true' : 'false'}
                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  >
                    <option value="true">Público en mi portafolio</option>
                    <option value="false">Privado (solo para mí)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Hitos del proyecto (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder="1. Revisión bibliográfica de fuentes primarias&#10;2. Redacción del primer borrador&#10;3. Revisión abierta por pares en Chen"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)]"
                >
                  Guardar reto personal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
