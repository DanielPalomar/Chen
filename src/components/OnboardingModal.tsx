import React, { useState } from 'react';
import { Check, ArrowRight, Github, Sparkles, X } from 'lucide-react';
import { INITIAL_AREAS } from '../data/initialData';
import { ContentLevel, UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onComplete: (preferences: { selectedAreas: string[]; startingLevel: ContentLevel; linkGithub: boolean }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['area-filosofia', 'area-computacion']);
  const [startingLevel, setStartingLevel] = useState<ContentLevel>('intro');
  const [linkGithub, setLinkGithub] = useState(false);

  if (!isOpen) return null;

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onComplete({ selectedAreas, startingLevel, linkGithub });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Bienvenida a Chen
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="font-mono text-xs text-[var(--action-primary)] font-medium">
              Paso {step} de 3
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            Saltar
          </button>
        </div>

        {/* Step 1: Areas */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                1. ¿Qué áreas te interesan explorar?
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Selecciona una o más áreas de conocimiento para personalizar tu experiencia inicial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {INITIAL_AREAS.map((a) => {
                const isSelected = selectedAreas.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleArea(a.id)}
                    className={`p-2.5 rounded border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-medium'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="line-clamp-1">{a.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)]"
              >
                <span>Continuar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Level */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                2. ¿Con qué nivel prefieres comenzar?
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                No necesitas títulos formales; en Chen todo contenido indica sus requisitos previos.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setStartingLevel('intro')}
                className={`w-full p-3 rounded border text-left flex items-start gap-3 transition-colors ${
                  startingLevel === 'intro'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-medium'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="font-mono font-bold text-xs">1</span>
                <div>
                  <span className="font-semibold block">Introductorio</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    Conceptos fundamentales explicados con claridad y sin jerga innecesaria.
                  </span>
                </div>
              </button>

              <button
                onClick={() => setStartingLevel('intermediate')}
                className={`w-full p-3 rounded border text-left flex items-start gap-3 transition-colors ${
                  startingLevel === 'intermediate'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-medium'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="font-mono font-bold text-xs">2</span>
                <div>
                  <span className="font-semibold block">Intermedio</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    Desarrollos matemáticos, demostraciones constructivas y citas directas.
                  </span>
                </div>
              </button>

              <button
                onClick={() => setStartingLevel('advanced')}
                className={`w-full p-3 rounded border text-left flex items-start gap-3 transition-colors ${
                  startingLevel === 'advanced'
                    ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-medium'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="font-mono font-bold text-xs">3</span>
                <div>
                  <span className="font-semibold block">Avanzado</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    Investigación de frontera, biofísica macromolecular y debates de pares.
                  </span>
                </div>
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)]"
              >
                <span>Continuar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Identity & Verification */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                3. Credibilidad verificable (Opcional)
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Chen verifica identidad técnica mediante OAuth con GitHub para que tus aportes formen un portafolio comprobable.
              </p>
            </div>

            <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span className="font-medium text-[var(--text-primary)]">
                    Vincular perfil de GitHub
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkGithub(!linkGithub)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    linkGithub
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  {linkGithub ? 'Vinculado (OAuth)' : 'Conectar'}
                </button>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                * En Chen jamás mostramos contadores de seguidores ni algoritmos de popularidad. Solo evidencia y autoría transparente.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Atrás
              </button>
              <button
                onClick={handleFinish}
                className="px-4 py-2 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)]"
              >
                Entrar a Chen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
