import React, { useState } from 'react';
import {
  GitCommit,
  ShieldCheck,
  ExternalLink,
  Plus,
  X,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ThesisAntithesisItem, CitationRelation } from '../types';
import { AppLanguage } from '../i18n/translations';

interface ThesisAntithesisViewProps {
  language: AppLanguage;
  thesisItems: ThesisAntithesisItem[];
  onAddThesisItem: (newItem: ThesisAntithesisItem) => void;
}

export const ThesisAntithesisView: React.FC<ThesisAntithesisViewProps> = ({
  language,
  thesisItems,
  onAddThesisItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ThesisAntithesisItem>(thesisItems[0] || null);

  // Form state
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [thesisAuthor, setThesisAuthor] = useState('');
  const [thesisThesis, setThesisThesis] = useState('');
  const [thesisArgument, setThesisArgument] = useState('');
  const [falsifiability, setFalsifiability] = useState('');
  const [antithesisAuthor, setAntithesisAuthor] = useState('');
  const [antithesisThesis, setAntithesisThesis] = useState('');
  const [antithesisArgument, setAntithesisArgument] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !falsifiability.trim()) return;

    const created: ThesisAntithesisItem = {
      id: `th-${Date.now().toString(36)}`,
      title: title.trim(),
      area,
      thesisAuthor: thesisAuthor.trim() || 'Autor anónimo de Chen',
      thesisThesis: thesisThesis.trim(),
      thesisArgument: thesisArgument.trim(),
      falsifiabilityCondition: falsifiability.trim(),
      antithesisAuthor: antithesisAuthor.trim() || 'Contradictor en debate',
      antithesisThesis: antithesisThesis.trim(),
      antithesisArgument: antithesisArgument.trim(),
      evidenceLinks: [],
    };

    onAddThesisItem(created);
    setSelectedItem(created);
    setIsModalOpen(false);
    setTitle('');
    setThesisThesis('');
    setThesisArgument('');
    setFalsifiability('');
    setAntithesisThesis('');
    setAntithesisArgument('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
                Debate Dialéctico
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                Plantilla con falsabilidad obligatoria
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Tesis y Antítesis
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Formato riguroso de contraste intelectual. Cada tesis debe declarar obligatoriamente: <em>«¿Qué evidencia empírica me haría cambiar de opinión?»</em> frente a su antítesis simétrica.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] transition-colors shadow-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Formular nuevo debate</span>
          </button>
        </div>
      </div>

      {/* Selector pills for existing debates */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {thesisItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
              selectedItem?.id === item.id
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Selected Debate Side-by-Side View */}
      {selectedItem && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-1">
            <span className="font-mono text-[11px] text-[var(--action-primary)] uppercase tracking-wider font-semibold">
              {selectedItem.area}
            </span>
            <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
              {selectedItem.title}
            </h2>
          </div>

          {/* Mandatory Falsifiability Banner */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Condición de Falsabilidad Obligatoria (¿Qué evidencia haría cambiar de opinión al autor?)</span>
            </div>
            <p className="font-serif text-xs sm:text-sm text-[var(--text-primary)] italic pl-5">
              "{selectedItem.falsifiabilityCondition}"
            </p>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thesis Box */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Tesis Principal
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  Por {selectedItem.thesisAuthor}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] leading-snug">
                  {selectedItem.thesisThesis}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedItem.thesisArgument}
                </p>
              </div>
            </div>

            {/* Antithesis Box */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Antítesis / Contraargumento
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  Por {selectedItem.antithesisAuthor}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] leading-snug">
                  {selectedItem.antithesisThesis}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedItem.antithesisArgument}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence and References */}
          {selectedItem.evidenceLinks.length > 0 && (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                Evidencias citadas en este debate
              </h4>
              <div className="space-y-2 text-xs">
                {selectedItem.evidenceLinks.map((link) => (
                  <div
                    key={link.title}
                    className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        link.relation === 'supports' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {link.relation.toUpperCase()}
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {link.title}
                      </span>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--action-primary)] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Ver fuente</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Debate Form Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Formular Nuevo Debate: Tesis y Antítesis
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Todo debate en Chen exige enunciar ambas partes y la condición estricta de falsabilidad.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-medium text-[var(--text-primary)]">
                  Título del dilema o proposición *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Falsabilidad empírica frente al holismo de Quine"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                />
              </div>

              {/* Falsifiability Mandatory */}
              <div className="p-3 rounded border border-amber-500/40 bg-amber-500/5 space-y-1">
                <label className="block font-medium text-amber-900 dark:text-amber-200">
                  Condición de falsabilidad obligatoria *
                </label>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  ¿Qué observación empírica, resultado o contraejemplo refutaría tu tesis?
                </p>
                <textarea
                  rows={2}
                  required
                  value={falsifiability}
                  onChange={(e) => setFalsifiability(e.target.value)}
                  placeholder="Ej. Si se demuestra que un programa no trivial resuelve la parada para toda entrada..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                />
              </div>

              {/* Tesis & Antitesis columns in form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                  <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                    Tesis
                  </span>
                  <input
                    type="text"
                    required
                    value={thesisThesis}
                    onChange={(e) => setThesisThesis(e.target.value)}
                    placeholder="Enunciado de la tesis..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    required
                    value={thesisArgument}
                    onChange={(e) => setThesisArgument(e.target.value)}
                    placeholder="Argumento razonado y justificación..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2 p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                  <span className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                    Antítesis
                  </span>
                  <input
                    type="text"
                    required
                    value={antithesisThesis}
                    onChange={(e) => setAntithesisThesis(e.target.value)}
                    placeholder="Enunciado de la antítesis..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    required
                    value={antithesisArgument}
                    onChange={(e) => setAntithesisArgument(e.target.value)}
                    placeholder="Argumento de la postura contraria..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)]"
                >
                  Publicar debate dialéctico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
