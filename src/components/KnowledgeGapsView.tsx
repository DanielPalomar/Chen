import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Search,
} from 'lucide-react';
import { KnowledgeGap, KnowledgeGapAnswer, EpistemicStatus } from '../types';
import { EpistemicBadge } from './SemanticBadges';

interface KnowledgeGapsViewProps {
  gaps: KnowledgeGap[];
  onAddGap: (gap: Omit<KnowledgeGap, 'id' | 'date' | 'answers' | 'status'>) => void;
  onAddAnswerToGap: (gapId: string, answer: Omit<KnowledgeGapAnswer, 'id' | 'date'>) => void;
}

export const KnowledgeGapsView: React.FC<KnowledgeGapsViewProps> = ({
  gaps,
  onAddGap,
  onAddAnswerToGap,
}) => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Ask Flow state
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [authorName, setAuthorName] = useState('');
  const [whatIReadFirst, setWhatIReadFirst] = useState('');
  const [myHypothesis, setMyHypothesis] = useState('');
  const [epistemicStatus, setEpistemicStatus] = useState<EpistemicStatus>('hypothesis');

  // Answer flow
  const [activeGapId, setActiveGapId] = useState<string | null>(null);
  const [ansAuthor, setAnsAuthor] = useState('');
  const [ansRole, setAnsRole] = useState('');
  const [ansContent, setAnsContent] = useState('');

  // Step 1: Live similarity detection
  const similarQuestions = useMemo(() => {
    if (!title.trim() || title.length < 4) return [];
    const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (words.length === 0) return [];

    return gaps.filter((g) => {
      const match = words.some((w) => g.title.toLowerCase().includes(w));
      return match;
    });
  }, [title, gaps]);

  const filteredGaps = useMemo(() => {
    return gaps.filter((g) => {
      if (selectedArea === 'all') return true;
      return g.area === selectedArea;
    });
  }, [gaps, selectedArea]);

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whatIReadFirst.trim() || !myHypothesis.trim() || !authorName.trim()) {
      return;
    }

    const areaId = area.toLowerCase().includes('filosof')
      ? 'area-filosofia'
      : area.toLowerCase().includes('comput')
      ? 'area-computacion'
      : area.toLowerCase().includes('matem')
      ? 'area-matematicas'
      : 'area-filosofia';

    onAddGap({
      title: title.trim(),
      areaId,
      area,
      authorName: authorName.trim(),
      whatIReadFirst: whatIReadFirst.trim(),
      myHypothesis: myHypothesis.trim(),
      epistemicStatus,
      similarConcepts: similarQuestions.map((s) => s.title),
    });

    // Reset
    setTitle('');
    setWhatIReadFirst('');
    setMyHypothesis('');
    setAuthorName('');
    setWizardStep(1);
    setIsWizardOpen(false);
  };

  const handlePostAnswer = (gapId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!ansContent.trim() || !ansAuthor.trim()) return;

    onAddAnswerToGap(gapId, {
      authorName: ansAuthor.trim(),
      authorRole: ansRole.trim() || 'Investigador independiente',
      isGithubVerified: true,
      content: ansContent.trim(),
      supportingCitations: [],
    });

    setAnsAuthor('');
    setAnsRole('');
    setAnsContent('');
    setActiveGapId(null);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <section className="border-b border-[var(--border-subtle)] pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
              <HelpCircle className="h-4 w-4" />
              <span>Frontera del conocimiento colectivo</span>
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Huecos del saber
            </h1>
            <p className="font-serif text-base text-[var(--text-secondary)] max-w-2xl">
              Lista pública de preguntas fundamentales que aún nadie ha respondido con rigor. Guía a la comunidad sobre qué investigar y escribir.
            </p>
          </div>

          <button
            onClick={() => {
              setWizardStep(1);
              setIsWizardOpen(true);
            }}
            className="rounded-md bg-[var(--action-primary)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--action-hover)] shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            + Proponer un hueco
          </button>
        </div>

        {/* Area filter tabs */}
        <div className="flex items-center gap-1.5 pt-4 text-xs overflow-x-auto">
          {['all', 'Filosofía y Epistemología', 'Biología y Medicina', 'Computación y Matemáticas'].map(
            (a) => (
              <button
                key={a}
                onClick={() => setSelectedArea(a)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedArea === a
                    ? 'bg-[var(--action-primary)] text-white font-medium'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {a === 'all' ? 'Todas las áreas' : a}
              </button>
            )
          )}
        </div>
      </section>

      {/* Gaps List */}
      <div className="space-y-6">
        {filteredGaps.map((gap) => (
          <article
            key={gap.id}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-tertiary)]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--text-secondary)]">{gap.area}</span>
                <span aria-hidden="true">·</span>
                <span>Planteado por {gap.authorName}</span>
                <span aria-hidden="true">·</span>
                <span>{gap.date}</span>
              </div>
              <EpistemicBadge status={gap.epistemicStatus} />
            </div>

            <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)] leading-snug">
              {gap.title}
            </h2>

            {/* What I read & My hypothesis (Mandatory Pedagogical Structure) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 p-3.5 space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">
                  1. Lo que la persona leyó antes de preguntar:
                </span>
                <p className="font-serif text-[var(--text-secondary)] italic leading-relaxed">
                  «{gap.whatIReadFirst}»
                </p>
              </div>

              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 p-3.5 space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">
                  2. Hipótesis o conjetura razonada:
                </span>
                <p className="font-serif text-[var(--text-secondary)] italic leading-relaxed">
                  «{gap.myHypothesis}»
                </p>
              </div>
            </div>

            {/* Community Answers & Responses */}
            <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)] font-medium">
                  {gap.answers.length} {gap.answers.length === 1 ? 'respuesta fundamentada' : 'respuestas fundamentadas'}
                </span>
                <button
                  onClick={() => setActiveGapId(activeGapId === gap.id ? null : gap.id)}
                  className="text-xs font-medium text-[var(--action-primary)] hover:underline"
                >
                  {activeGapId === gap.id ? 'Cerrar formulario' : '+ Aportar respuesta o evidencia'}
                </button>
              </div>

              {gap.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-4 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {ans.authorName} ({ans.authorRole})
                    </span>
                    <span>{ans.date}</span>
                  </div>
                  <p className="font-serif text-[var(--text-secondary)] leading-relaxed text-sm">
                    {ans.content}
                  </p>
                </div>
              ))}

              {/* Form to answer this gap */}
              {activeGapId === gap.id && (
                <form
                  onSubmit={(e) => handlePostAnswer(gap.id, e)}
                  className="rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4 space-y-3 text-xs"
                >
                  <h4 className="font-serif font-semibold text-[var(--text-primary)] text-sm">
                    Aportar respuesta con rigor:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={ansAuthor}
                      onChange={(e) => setAnsAuthor(e.target.value)}
                      placeholder="Tu nombre completo..."
                      className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                    />
                    <input
                      type="text"
                      value={ansRole}
                      onChange={(e) => setAnsRole(e.target.value)}
                      placeholder="Tu rol o especialidad..."
                      className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={ansContent}
                    onChange={(e) => setAnsContent(e.target.value)}
                    placeholder="Escribe tu razonamiento y aporta enlaces o referencias a fuentes abiertas..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveGapId(null)}
                      className="px-3 py-1.5 rounded text-xs text-[var(--text-secondary)]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                    >
                      Publicar respuesta
                    </button>
                  </div>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 3-Step Pedagogical Ask Flow Dialog */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-xl">
            {/* Stepper Header */}
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-2">
                <span>Paso {wizardStep} de 3</span>
                <span className="font-mono text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
                  Flujo pedagógico de Chen
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                {wizardStep === 1 && 'Paso 1: Antes de preguntar, explora lo sabido'}
                {wizardStep === 2 && 'Paso 2: ¿Qué has leído y qué piensas tú?'}
                {wizardStep === 3 && 'Paso 3: Vista previa y confirmación'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {wizardStep === 1 &&
                  'Chen busca que cada persona razone y llegue a su propia conclusión antes de soltar la pregunta al aire.'}
                {wizardStep === 2 &&
                  'Explicar tu punto de partida y tu hipótesis preliminar ayuda a la comunidad a construir sobre tus pasos.'}
                {wizardStep === 3 &&
                  'Revisa cómo aparecerá tu hueco del saber antes de publicarlo abiertamente.'}
              </p>
            </div>

            {/* Step 1: Title and Live Similarity Check */}
            {wizardStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    Pregunta o problema abierto:
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: ¿Bajo qué condiciones termodinámicas se produce...?"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                  />
                </div>

                {/* Calm Similar-Questions Panel */}
                {similarQuestions.length > 0 && (
                  <div className="rounded border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900/60 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Alguien podría haber explorado ya esto:</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                      Leer estas preguntas primero puede ayudarte a alcanzar tu propia conclusión sin duplicar esfuerzos:
                    </p>
                    <ul className="space-y-1 pl-4 list-disc text-[11px] text-amber-950 dark:text-amber-200">
                      {similarQuestions.map((s) => (
                        <li key={s.id}>{s.title}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[var(--text-primary)] mb-1">
                      Área temática:
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                    >
                      <option value="Filosofía y Epistemología">Filosofía y Epistemología</option>
                      <option value="Biología y Medicina">Biología y Medicina</option>
                      <option value="Computación y Matemáticas">Computación y Matemáticas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[var(--text-primary)] mb-1">
                      Tu nombre o firma:
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ej: Laura Castro (Autodidacta)"
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(false)}
                    className="px-3 py-1.5 rounded text-xs text-[var(--text-secondary)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!title.trim() || !authorName.trim()}
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white disabled:opacity-50"
                  >
                    Continuar al Paso 2 →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: What have you read and what is your hypothesis */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    1. ¿Qué has leído o contrastado antes de formular esta pregunta? (Obligatorio):
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={whatIReadFirst}
                    onChange={(e) => setWhatIReadFirst(e.target.value)}
                    placeholder="Menciona los textos, demostraciones o fuentes abiertas que ya examinaste..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    2. ¿Cuál es tu hipótesis o sospecha razonada? (Obligatorio):
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={myHypothesis}
                    onChange={(e) => setMyHypothesis(e.target.value)}
                    placeholder="Explica qué piensas tú o qué respuesta conjeturas a partir de lo que leíste..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    Etiqueta epistémica de partida:
                  </label>
                  <select
                    value={epistemicStatus}
                    onChange={(e) => setEpistemicStatus(e.target.value as EpistemicStatus)}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                  >
                    <option value="hypothesis">Hipótesis falsable (conjetura a someter a prueba)</option>
                    <option value="opinion">Opinión / Planteamiento analítico preliminar</option>
                  </select>
                </div>

                <div className="flex justify-between gap-2 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-3 py-1.5 rounded text-xs text-[var(--text-secondary)]"
                  >
                    ← Volver
                  </button>
                  <button
                    type="button"
                    disabled={!whatIReadFirst.trim() || !myHypothesis.trim()}
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white disabled:opacity-50"
                  >
                    Ver vista previa →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview and Publish */}
            {wizardStep === 3 && (
              <form onSubmit={handleFinishWizard} className="space-y-4 text-xs">
                <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--text-secondary)]">{area}</span>
                    <EpistemicBadge status={epistemicStatus} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                    {title}
                  </h4>
                  <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                    <p className="text-[var(--text-secondary)]">
                      <strong>Leído antes:</strong> {whatIReadFirst}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      <strong>Hipótesis:</strong> {myHypothesis}
                    </p>
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] pt-1">
                    Autor: {authorName} · Fecha: Hoy
                  </div>
                </div>

                <div className="flex justify-between gap-2 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-3 py-1.5 rounded text-xs text-[var(--text-secondary)]"
                  >
                    ← Modificar campos
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-xs font-semibold bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-sm"
                  >
                    Confirmar y publicar en Chen
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
