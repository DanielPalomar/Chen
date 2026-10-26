import React, { useState } from 'react';
import { BookOpen, HelpCircle, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExerciseItem, GlossaryItem } from '../types';

interface GlossaryAndExercisesProps {
  exercises: ExerciseItem[];
  glossary: GlossaryItem[];
  onSelectArticle?: (articleId: string) => void;
}

export const GlossaryAndExercises: React.FC<GlossaryAndExercisesProps> = ({
  exercises,
  glossary,
  onSelectArticle,
}) => {
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [userAttempts, setUserAttempts] = useState<Record<string, string>>({});

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-10">
      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="space-y-1 border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[var(--action-primary)]" />
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Ejercicios de Razonamiento Científico
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            La solución razonada se mantiene oculta para que intentes resolver el problema antes de consultar la demostración formal. Sin puntos ni ranking.
          </p>
        </div>

        <div className="space-y-4">
          {exercises.map((ex) => {
            const isRevealed = !!revealedSolutions[ex.id];
            const attempt = userAttempts[ex.id] || '';

            return (
              <div
                key={ex.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[var(--action-primary)] font-semibold uppercase">
                    {ex.topic}
                  </span>
                  {ex.hint && (
                    <span className="text-[var(--text-tertiary)] italic">
                      Pista: {ex.hint}
                    </span>
                  )}
                </div>

                <p className="font-serif text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                  {ex.question}
                </p>

                {/* Attempt textarea */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)]">
                    Tu deducción previa o planteamiento:
                  </label>
                  <textarea
                    rows={2}
                    value={attempt}
                    onChange={(e) =>
                      setUserAttempts((prev) => ({ ...prev, [ex.id]: e.target.value }))
                    }
                    placeholder="Escribe tu razonamiento aquí antes de desbloquear la solución..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs focus:outline-none"
                  />
                </div>

                {/* Solution Reveal Button */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--action-primary)] transition-colors"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                        <span>Ocultar demostración</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                        <span>Revelar solución razonada</span>
                      </>
                    )}
                  </button>

                  {attempt.trim().length > 0 && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Intento registrado para tu autoevaluación</span>
                    </span>
                  )}
                </div>

                {/* Reasoned Solution display */}
                {isRevealed && (
                  <div className="p-3.5 rounded border border-indigo-200 dark:border-indigo-900 bg-[var(--bg-subtle-lilac)] text-xs text-[var(--text-primary)] space-y-1">
                    <span className="font-mono font-bold text-[11px] text-[var(--action-primary)] block">
                      Demostración razonada:
                    </span>
                    <p className="leading-relaxed">{ex.reasonedSolution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reusable Glossary Section */}
      <div className="space-y-4">
        <div className="space-y-1 border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[var(--action-primary)]" />
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Glosario Reutilizable de Conceptos Clave
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Términos definidos con rigor conceptual que cualquier artículo de Chen puede enlazar como referencia compartida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {glossary.map((g) => (
            <div
              key={g.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
                  {g.term}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  {g.area}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {g.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
