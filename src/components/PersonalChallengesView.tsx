import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, X, Calendar, Lock, Globe, Users, Sparkles, Filter, Package } from 'lucide-react';
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
  const [selectedTier, setSelectedTier] = useState<'all' | 'personal' | 'grupal' | 'comunitario'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tier, setTier] = useState<'personal' | 'grupal' | 'comunitario'>('personal');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [communityDeliverable, setCommunityDeliverable] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('8');
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
      tier,
      area,
      participantsCount: tier === 'personal' ? 1 : 1,
      maxParticipants: tier === 'grupal' ? parseInt(maxParticipants) || 10 : undefined,
      communityDeliverable: communityDeliverable.trim() || undefined,
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
    setCommunityDeliverable('');
    setMilestonesText('');
  };

  const filteredChallenges = challenges.filter((c) => {
    const challengeTier = c.tier || 'personal';
    if (selectedTier === 'all') return true;
    return challengeTier === selectedTier;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
                Estudio Autónomo y Comunitario
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">Sin rachas ni patrocinadores</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              Retos de Aprendizaje en Tres Niveles
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Fija tus propios proyectos de investigación o súmate a equipos de estudio y replicación comunitaria. En Chen el progreso se mide por hitos verificados y entregables abiertos, nunca por puntos ni dinero.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] transition-colors shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Crear nuevo reto</span>
          </button>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 text-xs">
          <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            Nivel:
          </span>
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedTier === 'all'
                ? 'bg-[var(--action-primary)] text-white font-medium shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Todos ({challenges.length})
          </button>
          <button
            onClick={() => setSelectedTier('personal')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              selectedTier === 'personal'
                ? 'bg-[var(--action-primary)] text-white font-medium shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Target className="h-3 w-3" />
            <span>Personales («Escribo mi libro»)</span>
          </button>
          <button
            onClick={() => setSelectedTier('grupal')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              selectedTier === 'grupal'
                ? 'bg-[var(--action-primary)] text-white font-medium shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Users className="h-3 w-3" />
            <span>Grupales (Equipos 3 a 15)</span>
          </button>
          <button
            onClick={() => setSelectedTier('comunitario')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              selectedTier === 'comunitario'
                ? 'bg-[var(--action-primary)] text-white font-medium shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Comunitarios (Replicaciones)</span>
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {filteredChallenges.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-tertiary)]">
            No hay retos registrados en este nivel todavía.
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const completedCount = challenge.milestones.filter((m) => m.completed).length;
            const totalCount = challenge.milestones.length;
            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const currentTier = challenge.tier || 'personal';

            return (
              <div
                key={challenge.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs transition-colors hover:border-[var(--border-strong)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                        {challenge.title}
                      </span>

                      {/* Tier Pill */}
                      {currentTier === 'personal' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <Target className="h-3 w-3" />
                          <span>Personal</span>
                        </span>
                      )}
                      {currentTier === 'grupal' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Users className="h-3 w-3" />
                          <span>Grupal ({challenge.participantsCount || 6}/{challenge.maxParticipants || 12} plazas)</span>
                        </span>
                      )}
                      {currentTier === 'comunitario' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Sparkles className="h-3 w-3" />
                          <span>Comunitario ({challenge.participantsCount || 38} participantes)</span>
                        </span>
                      )}

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

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {challenge.goal}
                    </p>

                    {challenge.communityDeliverable && (
                      <div className="text-[11px] font-mono text-[var(--action-primary)] pt-0.5 flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 shrink-0" />
                        <span>Entregable público: {challenge.communityDeliverable}</span>
                      </div>
                    )}
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
          })
        )}
      </div>

      {/* Create Challenge Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Nuevo Reto de Aprendizaje o Investigación
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Los retos nunca llevan dinero ni patrocinadores de por medio.
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Nivel del reto *
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  >
                    <option value="personal">Personal (1 persona)</option>
                    <option value="grupal">Grupal (3 a 15 personas)</option>
                    <option value="comunitario">Comunitario (Toda el área)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Área temática
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  >
                    <option value="Filosofía y Epistemología">Filosofía y Epistemología</option>
                    <option value="Computación y Sistemas">Computación y Sistemas</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Biología y Medicina">Biología y Medicina</option>
                    <option value="Interdisciplinar">Interdisciplinar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Título del reto *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    tier === 'personal'
                      ? 'Ej. Escribo mi libro sobre epistemología en un año'
                      : tier === 'grupal'
                      ? 'Ej. Grupo de estudio: Teoría de Tipos en Lean'
                      : 'Ej. Replicación sistemática de fuentes de IA'
                  }
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
                  placeholder="¿Qué producto, demostración o avance tangible resultará de este esfuerzo?"
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

              {tier !== 'personal' && (
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Entregable abierto para Chen
                  </label>
                  <input
                    type="text"
                    value={communityDeliverable}
                    onChange={(e) => setCommunityDeliverable(e.target.value)}
                    placeholder="Ej. Ruta de aprendizaje pública con 8 demostraciones verificadas"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Hitos del proyecto (uno por línea)
                </label>
                <textarea
                  rows={3}
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
                  Guardar reto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
