import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  RotateCw,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  HelpCircle,
  Award,
  Layers,
} from 'lucide-react';
import { Flashcard } from '../types';

interface StudyPathViewProps {
  flashcards: Flashcard[];
  onReviewCard: (cardId: string, rating: 'hard' | 'good' | 'easy') => void;
  onAddCard: (card: Omit<Flashcard, 'id' | 'intervalDays' | 'repetitionCount' | 'nextReviewDate'>) => void;
  onDeleteCard: (cardId: string) => void;
}

const STEPS = [
  { num: '1', name: 'Elegir', action: 'Fijas objetivo y nivel de partida', tool: 'Plan de estudio personal' },
  { num: '2', name: 'Aprender', action: 'Sigues rutas con fuentes abiertas', tool: 'Paquetes de lecturas y vídeos' },
  { num: '3', name: 'Practicar', action: 'Autoevaluación con tarjetas privadas', tool: 'Repetición espaciada sin rankings' },
  { num: '4', name: 'Demostrar', action: 'Explicas el tema y recibes revisión', tool: 'Retos de demostración pública' },
  { num: '5', name: 'Compartir', action: 'Publicas apuntes y notas abiertas', tool: 'Licencias Creative Commons' },
];

export const StudyPathView: React.FC<StudyPathViewProps> = ({
  flashcards,
  onReviewCard,
  onAddCard,
  onDeleteCard,
}) => {
  const [activeStep, setActiveStep] = useState(2); // Practicar is the active phase 1 tool
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New card
  const [topic, setTopic] = useState('');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const currentCard = flashcards[currentCardIndex % (flashcards.length || 1)];

  const handleRating = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    onReviewCard(currentCard.id, rating);
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !question.trim() || !answer.trim()) return;

    onAddCard({
      topic: topic.trim(),
      area,
      question: question.trim(),
      answer: answer.trim(),
    });

    setTopic('');
    setQuestion('');
    setAnswer('');
    setIsAddOpen(false);
  };

  const handleExportObsidian = () => {
    const md = [
      '# Cuaderno de Estudio Autónomo — Chen',
      `> Sincronización en Markdown puro · Exportado el ${new Date().toLocaleDateString()}\n`,
      ...flashcards.map(
        (c, i) =>
          `\n## ${i + 1}. [${c.area}] ${c.topic}\n**Pregunta:** ${c.question}\n\n**Respuesta razonada:**\n${c.answer}\n\n*Intervalo actual:* ${c.intervalDays} días\n`
      ),
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chen-cuaderno-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <section className="border-b border-[var(--border-subtle)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
          <BookOpen className="h-4 w-4" />
          <span>Metodología de aprendizaje de Chen</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Estudiar por tu cuenta
        </h1>
        <p className="font-serif text-base text-[var(--text-secondary)]">
          Un camino pedagógico estructurado de cinco etapas, desde definir un tema hasta demostrar que lo dominas con argumentos.
        </p>
      </section>

      {/* Calm Horizontal Chevron Stepper */}
      <nav aria-label="Etapas de estudio autónomo" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 overflow-x-auto">
        <div className="flex items-center min-w-[640px]">
          {STEPS.map((s, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 p-2.5 rounded text-left transition-colors ${
                    isCurrent
                      ? 'bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                      : 'hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span>{s.num}.</span>
                    <span>{s.name}</span>
                  </div>
                  <div className="text-[11px] font-normal text-[var(--text-tertiary)] truncate mt-0.5">
                    {s.action}
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[var(--border-strong)] shrink-0 mx-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Stage Detail Card */}
      <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-3 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Etapa {STEPS[activeStep].num}: {STEPS[activeStep].name}
          </h2>
          <span className="font-mono text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
            Herramienta: {STEPS[activeStep].tool}
          </span>
        </div>
        <p className="font-serif text-sm leading-relaxed">
          {activeStep === 0 &&
            'Defines tu meta de aprendizaje, estimas tus horas de estudio semanales y organizas tus hitos personales sin presiones externas.'}
          {activeStep === 1 &&
            'Accedes a paquetes de estudio curados con lecturas libres (Wikipedia, MIT OCW, OpenStax), esquemas y vídeos seleccionados.'}
          {activeStep === 2 &&
            'Autoevaluación privada mediante tarjetas conceptuales con algoritmo de repetición espaciada. Sin tablas de puntos, sin rankings competitivos.'}
          {activeStep === 3 &&
            'Expones tus conclusiones con tus propias palabras y las sometes a revisión abierta y debate respetuoso por pares.'}
          {activeStep === 4 &&
            'Publicas tus apuntes organizados bajo licencias Creative Commons para alimentar el conocimiento de las personas que vengan detrás.'}
        </p>
      </section>

      {/* Private Practice Deck (Stage 3 Flashcards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
              Tu cuaderno privado de tarjetas ({flashcards.length})
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              Almacenamiento exclusivo en tu navegador · Cero recolección de telemetría
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Crear tarjeta</span>
            </button>
            <button
              onClick={handleExportObsidian}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar Markdown</span>
            </button>
          </div>
        </div>

        {flashcards.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)]">
            Aún no has añadido tarjetas a tu cuaderno.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Flashcard Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`min-h-[220px] cursor-pointer rounded-lg border p-6 flex flex-col justify-between transition-colors ${
                isFlipped
                  ? 'border-[var(--accent-teal)] bg-[var(--bg-surface)] shadow-xs'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pb-3 border-b border-[var(--border-subtle)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {currentCard.topic}
                  </span>
                  <span className="font-mono text-[var(--action-primary)]">
                    {isFlipped ? 'Respuesta fundamentada' : 'Pregunta o tesis'}
                  </span>
                </div>

                <div className="mt-6 font-serif text-lg text-[var(--text-primary)] leading-relaxed">
                  {isFlipped ? currentCard.answer : currentCard.question}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-subtle)]">
                <span className="flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Haz clic para voltear</span>
                </span>
                <span>
                  Intervalo: {currentCard.intervalDays} día(s) · {currentCard.repetitionCount} repasos
                </span>
              </div>
            </div>

            {/* Rating Buttons */}
            {isFlipped && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs">
                <span className="text-[var(--text-secondary)] font-medium">
                  Autoevaluación honesta:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRating('hard')}
                    className="px-3 py-1.5 rounded border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-medium"
                  >
                    Difícil / Repasar pronto (1d)
                  </button>
                  <button
                    onClick={() => handleRating('good')}
                    className="px-3 py-1.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-medium"
                  >
                    Bien / Entendido (3d)
                  </button>
                  <button
                    onClick={() => handleRating('easy')}
                    className="px-3 py-1.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium"
                  >
                    Fácil / Dominado (7d)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add Card Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Nueva tarjeta conceptual
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Concepto o tema:
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Teorema de Bayes..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Pregunta a resolver:
                </label>
                <textarea
                  required
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enunciado de la prueba..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Respuesta o deducción:
                </label>
                <textarea
                  required
                  rows={3}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explicación rigurosa..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                >
                  Guardar tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
