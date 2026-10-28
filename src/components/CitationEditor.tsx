import React, { useState } from 'react';
import { Article, Author, CitationRelation, EpistemicStatus, Citation } from '../types';
import { computeSha256 } from '../utils/storage';

interface CitationEditorProps {
  currentAuthor: Author;
  authors: Author[];
  onSwitchAuthor: (author: Author) => void;
  prefilledQuote?: {
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  };
  onPublishSuccess: (newArticle: Article) => void;
  onCancel: () => void;
}

export const CitationEditor: React.FC<CitationEditorProps> = ({
  currentAuthor,
  authors,
  onSwitchAuthor,
  prefilledQuote,
  onPublishSuccess,
  onCancel,
}) => {
  // Quote evidence state
  const [hasPinnedQuote, setHasPinnedQuote] = useState<boolean>(!!prefilledQuote);
  const [quotedSnippet, setQuotedSnippet] = useState(prefilledQuote?.sourceSnippet || '');
  const [targetArticleId, setTargetArticleId] = useState(prefilledQuote?.targetArticleId || '');
  const [targetArticleTitle, setTargetArticleTitle] = useState(prefilledQuote?.targetArticleTitle || '');
  const [targetVersionHash, setTargetVersionHash] = useState(prefilledQuote?.targetVersionHash || '');
  const [targetAuthorName, setTargetAuthorName] = useState(prefilledQuote?.targetAuthorName || '');

  // Citation stance and justification
  const [relation, setRelation] = useState<CitationRelation>('contradicts');
  const [reasoning, setReasoning] = useState('');

  // Article content
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [epistemicStatus, setEpistemicStatus] = useState<EpistemicStatus>('hypothesis');
  const [epistemicNote, setEpistemicNote] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState(
    `## 1. Planteamiento de la tesis

Escribe aquí tu fundamentación rigurosa...

## 2. Argumentación deductiva o empírica

Detalla las premisas lógicas o los datos observacionales que sustentan tu posición...

## 3. Conclusión falsable

¿Qué hallazgo experimental demostraría que este planteamiento es erróneo?`
  );

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePublish = async () => {
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Por favor ingresa un título para tu tesis.');
      return;
    }

    if (!contentMarkdown.trim() || contentMarkdown.length < 50) {
      setValidationError('El cuerpo del artículo debe contener al menos 50 caracteres de fundamentación.');
      return;
    }

    if (hasPinnedQuote) {
      if (!quotedSnippet.trim()) {
        setValidationError('La cita anclada no puede estar vacía.');
        return;
      }
      if (!reasoning.trim() || reasoning.length < 15) {
        setValidationError(
          'Debes proporcionar una justificación argumental de al menos 15 caracteres (1-2 oraciones explicando por qué tu texto apoya, contradice o amplía este fragmento).'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const dateString = now.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Compute cryptographic SHA-256 content hash
      const rawPayload = `${title}|${contentMarkdown}|${currentAuthor.id}|${now.toISOString()}`;
      const contentHash = await computeSha256(rawPayload);

      const articleId = `art-${slug.substring(0, 30)}-${Date.now().toString(36)}`;
      const versionId = `ver-${articleId}-1.0`;

      // Build outbound citation if quoting
      const citationsOutbound: Citation[] = [];
      if (hasPinnedQuote && targetArticleId) {
        citationsOutbound.push({
          id: `cit-${Date.now()}`,
          sourceArticleId: articleId,
          sourceArticleSlug: slug,
          sourceArticleTitle: title,
          sourceVersionId: versionId,
          sourceVersionHash: contentHash,
          sourceAuthorName: currentAuthor.name,
          sourceAuthorHandle: currentAuthor.handle,
          targetArticleId,
          targetArticleSlug: targetArticleId,
          targetArticleTitle,
          targetVersionId: `ver-${targetArticleId}`,
          targetVersionHash,
          targetAuthorName,
          quotedSnippet,
          relation,
          reasoning,
          createdAt: dateString,
        });
      }

      const newArticle: Article = {
        id: articleId,
        slug,
        title,
        subtitle: subtitle || 'Tesis técnica publicada en el protocolo Chen.',
        author: currentAuthor,
        license: 'CC BY-SA 4.0',
        epistemicStatus,
        epistemicNote:
          epistemicNote ||
          (epistemicStatus === 'fact'
            ? 'Demostración o hecho verificado empíricamente.'
            : epistemicStatus === 'hypothesis'
            ? 'Hipótesis de trabajo sometida a refutación abierta.'
            : 'Ensayo reflexivo y análisis de perspectiva.'),
        currentVersionNumber: 'v1.0',
        currentVersionHash: contentHash,
        versions: [
          {
            id: versionId,
            versionNumber: 'v1.0',
            contentHash,
            date: dateString,
            authorName: currentAuthor.name,
            reason: 'Publicación original inmutable en el protocolo.',
            contentMarkdown,
          },
        ],
        contentMarkdown,
        readTimeMinutes: Math.max(2, Math.ceil(contentMarkdown.split(/\s+/).length / 180)),
        publishedDate: dateString,
        lastUpdatedDate: dateString,
        citationsOutbound,
        citedByInbound: [],
      };

      onPublishSuccess(newArticle);
    } catch (err) {
      console.error(err);
      setValidationError('Ocurrió un error al calcular el hash de versión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Editor de Tesis y Réplicas
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {hasPinnedQuote ? 'Publicar Réplica Argumental Conectada' : 'Publicar Nueva Tesis en Markdown'}
          </h1>
        </div>

        {/* Identity selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-stone-500">Firmando como:</span>
          <select
            value={currentAuthor.id}
            onChange={(e) => {
              const a = authors.find((x) => x.id === e.target.value);
              if (a) onSwitchAuthor(a);
            }}
            className="p-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.isErased ? a.handle : `${a.name} (@${a.handle})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Error banner */}
      {validationError && (
        <div role="alert" className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 font-sans">
          <strong>Error de validación:</strong> {validationError}
        </div>
      )}

      {/* 1. TARJETA DE EVIDENCIA ANCLADA (Si viene de "Citar fragmento") */}
      {hasPinnedQuote ? (
        <div className="p-5 rounded-lg border-2 border-teal-600/70 bg-teal-50/40 dark:bg-teal-950/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              Fragmento Fuente Anclado por Criptografía
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-stone-500">
                Hash: #{targetVersionHash.substring(0, 10)}...
              </span>
              <button
                type="button"
                onClick={() => setHasPinnedQuote(false)}
                className="text-[11px] font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
              >
                (Desvincular cita y publicar como tesis libre)
              </button>
            </div>
          </div>

          <div className="text-xs font-sans text-stone-600 dark:text-stone-400">
            Artículo original: <strong>{targetArticleTitle}</strong> por <strong>{targetAuthorName}</strong>
          </div>

          <blockquote className="font-serif italic text-sm sm:text-base text-stone-900 dark:text-stone-100 border-l-4 border-teal-600 pl-4 py-1">
            «{quotedSnippet}»
          </blockquote>

          {/* 2. SELECTOR OBLIGATORIO DE POSTURA ARGUMENTAL */}
          <div className="space-y-2 pt-2 border-t border-teal-200/60 dark:border-teal-900/60">
            <label className="block font-mono text-xs font-bold uppercase text-stone-800 dark:text-stone-200">
              Postura Argumental Obligatoria:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* [+ APOYA] */}
              <button
                type="button"
                onClick={() => setRelation('supports')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  relation === 'supports'
                    ? 'border-emerald-600 bg-emerald-100/80 dark:bg-emerald-950/80 ring-2 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  [+ APOYA]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Aporta datos empíricos, pruebas formales o deducciones compatibles.
                </p>
              </button>

              {/* [- CONTRADICE] */}
              <button
                type="button"
                onClick={() => setRelation('contradicts')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  relation === 'contradicts'
                    ? 'border-rose-600 bg-rose-100/80 dark:bg-rose-950/80 ring-2 ring-rose-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-rose-800 dark:text-rose-300">
                  [- CONTRADICE]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Identifica contraejemplos, fallos lógicos o refutaciones directas.
                </p>
              </button>

              {/* [→ AMPLÍA] */}
              <button
                type="button"
                onClick={() => setRelation('extends')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  relation === 'extends'
                    ? 'border-teal-600 bg-teal-100/80 dark:bg-teal-950/80 ring-2 ring-teal-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300">
                  [→ AMPLÍA]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Extiende el marco teórico a nuevos dominios o aclara definiciones límite.
                </p>
              </button>
            </div>
          </div>

          {/* 3. JUSTIFICACIÓN EPISTÉMICA OBLIGATORIA */}
          <div className="space-y-1.5 pt-2">
            <label
              htmlFor="reasoning-input"
              className="block font-mono text-xs font-bold uppercase text-stone-800 dark:text-stone-200"
            >
              Justificación Epistémica Obligatoria (1-2 oraciones):
            </label>
            <textarea
              id="reasoning-input"
              rows={2}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explica sintéticamente qué aporta tu texto frente a este fragmento citado (ej: 'El contraejemplo de Castro-Liskov demuestra que bajo sincronía débil el consenso determinista sí es posible')..."
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs sm:text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-sans text-stone-700 dark:text-stone-300">
            Estás redactando una <strong>tesis libre</strong> sin cita previa anclada.
          </span>
          <button
            type="button"
            onClick={() => onCancel()}
            className="font-mono text-teal-700 dark:text-teal-300 hover:underline"
          >
            &larr; Volver al lector para citar un fragmento
          </button>
        </div>
      )}

      {/* 4. FORMULARIO PRINCIPAL DE ARTÍCULO */}
      <div className="space-y-6">
        {/* Título y Subtítulo */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title-input" className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Título de la Tesis o Artículo:
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Teorema de imposibilidad en redes no confiables..."
              className="w-full p-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="subtitle-input" className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Subtítulo explicativo:
            </label>
            <input
              id="subtitle-input"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej: Análisis formal del resultado y sus límites prácticos en entornos asíncronos..."
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Estado Epistémico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Estado Epistémico Declarado:
            </label>
            <select
              value={epistemicStatus}
              onChange={(e) => setEpistemicStatus(e.target.value as EpistemicStatus)}
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="fact">Hecho formal o empírico (demostración / datos)</option>
              <option value="hypothesis">Hipótesis de trabajo (sometida a falsación)</option>
              <option value="opinion">Ensayo u opinión reflexiva</option>
            </select>
          </div>

          <div>
            <label htmlFor="epistemic-note" className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Condición de falsabilidad / Nota de rigor:
            </label>
            <input
              id="epistemic-note"
              type="text"
              value={epistemicNote}
              onChange={(e) => setEpistemicNote(e.target.value)}
              placeholder="¿Qué hallazgo refutaría este texto? (ej: 'Cota de tiempo demostrada en red con partición')..."
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Editor de Contenido Markdown con Pestañas Escribir / Previsualizar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <label className="font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300">
              Cuerpo del Artículo (Markdown Puro):
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium ${
                  activeTab === 'write'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Escribir
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium ${
                  activeTab === 'preview'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Previsualizar
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            <textarea
              rows={14}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              className="w-full p-4 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          ) : (
            <div className="p-6 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 prose prose-stone dark:prose-invert max-w-none text-base leading-relaxed font-serif min-h-[300px]">
              {contentMarkdown.split('\n\n').map((p, idx) => {
                if (p.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="font-serif text-xl font-bold mt-4 mb-2">
                      {p.replace('## ', '')}
                    </h2>
                  );
                }
                return (
                  <p key={idx} className="mb-4">
                    {p}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. FOOTER DE ACCIONES Y PUBLICACIÓN BAJO CC BY-SA 4.0 */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-stone-500 dark:text-stone-400 font-sans space-y-0.5">
          <p>
            Al pulsar <strong>«Publicar Tesis Inmutable»</strong> se generará un hash SHA-256 criptográfico para la versión <code className="font-mono">v1.0</code>.
          </p>
          <p>
            El documento se registra bajo licencia perpetua <strong>CC BY-SA 4.0</strong> vinculada al grafo del protocolo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handlePublish}
            className="px-6 py-2.5 rounded bg-teal-800 text-white hover:bg-teal-700 font-mono text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isSubmitting ? 'Calculando Hash SHA-256...' : 'Publicar Tesis Inmutable (CC BY-SA)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
