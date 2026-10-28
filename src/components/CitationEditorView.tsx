import React, { useState } from 'react';
import { ArticleVersion, Author, Citation, CitationRelation, EpistemicStatus, LicenseType } from '../types/chen';
import { computeSha256Hex } from '../utils/database';

interface CitationEditorViewProps {
  allArticles: ArticleVersion[];
  authors: Author[];
  currentAuthor: Author;
  onSwitchAuthor: (a: Author) => void;
  prefilledQuote?: {
    targetVersionId: string;
    targetArticleTitle: string;
    targetAuthorName: string;
    targetVersionHash: string;
    quotedSnippet: string;
    initialRelation?: CitationRelation;
  };
  onPublishSuccess: (
    newArticle: ArticleVersion,
    newCitation?: Citation,
    targetArticleIdToOpen?: string
  ) => void;
  onCancel: () => void;
}

export const CitationEditorView: React.FC<CitationEditorViewProps> = ({
  allArticles,
  authors,
  currentAuthor,
  onSwitchAuthor,
  prefilledQuote,
  onPublishSuccess,
  onCancel,
}) => {
  // Modo de edición: con cita anclada o tesis raíz
  const [hasPinnedQuote, setHasPinnedQuote] = useState<boolean>(!!prefilledQuote);
  const [selectedTargetVersionId, setSelectedTargetVersionId] = useState<string>(
    prefilledQuote?.targetVersionId || (allArticles[0]?.versionId || '')
  );
  const [quotedSnippet, setQuotedSnippet] = useState<string>(prefilledQuote?.quotedSnippet || '');
  const [relation, setRelation] = useState<CitationRelation>(prefilledQuote?.initialRelation || 'supports');
  const [reasoning, setReasoning] = useState<string>('');

  // Identidad de autor
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(currentAuthor.id);
  const [simulatedGithub, setSimulatedGithub] = useState<string>(currentAuthor.githubUser || 'investigador-demo');
  const [simulatedOrcid, setSimulatedOrcid] = useState<string>(currentAuthor.orcidId || '0000-0002-0000-0000');
  const [showAuthorSessionModal, setShowAuthorSessionModal] = useState(false);

  // Formulario del nuevo artículo
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [area, setArea] = useState<ArticleVersion['area']>('Epistemología');
  const [epistemicStatus, setEpistemicStatus] = useState<EpistemicStatus>('hypothesis');
  const [license, setLicense] = useState<LicenseType>('CC BY-SA 4.0');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  const [contentMarkdown, setContentMarkdown] = useState(
    `## 1. Fundamentación de la tesis

Formula aquí la premisa conceptual o el resultado empírico fundamental...

## 2. Derivación analítica y contraejemplos

Explica detalladamente las deducciones lógicas o la evidencia técnica que sustenta la posición...

## 3. Condición de falsabilidad

¿Qué experimento o hallazgo observable demostraría de forma concluyente que esta tesis es errónea?`
  );

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Información del artículo de destino
  const targetArticle = allArticles.find((a) => a.versionId === selectedTargetVersionId);
  const targetAuthor = targetArticle ? authors.find((a) => a.id === targetArticle.authorId) : null;
  const targetAuthorName = targetAuthor ? targetAuthor.realName : (prefilledQuote?.targetAuthorName || 'Investigador');
  const targetVersionHash = targetArticle ? targetArticle.contentHash : (prefilledQuote?.targetVersionHash || '8f3a9c...');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Por favor ingresa un título para la nueva tesis.');
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
          'Debes proporcionar una "Síntesis de conexión lógica" de al menos 15 caracteres (1-2 frases explicando por qué tu texto apoya, contradice o amplía este fragmento).'
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

      // Generación estricta de hash de 64 caracteres
      const rawPayload = `${title}|${contentMarkdown}|${selectedAuthorId}|${now.toISOString()}`;
      const contentHash = await computeSha256Hex(rawPayload);

      const newArticleId = `art-${slug.substring(0, 24)}-${Date.now().toString(36)}`;
      const newVersionId = `ver-${slug.substring(0, 16)}-v1`;

      const newArticle: ArticleVersion = {
        versionId: newVersionId,
        articleId: newArticleId,
        versionNumber: 1,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Tesis técnica e investigación abierta en el protocolo Chen.',
        area,
        contentMarkdown,
        contentHash,
        epistemicStatus,
        license,
        authorId: selectedAuthorId,
        createdAt: dateString,
        readingTimeMinutes: Math.max(2, Math.ceil(contentMarkdown.split(/\s+/).length / 180)),
      };

      let newCitation: Citation | undefined = undefined;
      if (hasPinnedQuote && selectedTargetVersionId) {
        newCitation = {
          id: `cit-${Date.now().toString(36)}`,
          sourceVersionId: newVersionId,
          targetVersionId: selectedTargetVersionId,
          relation,
          quotedSnippet: quotedSnippet.trim(),
          reasoning: reasoning.trim(),
          createdAt: dateString,
        };
      }

      onPublishSuccess(newArticle, newCitation, hasPinnedQuote ? selectedTargetVersionId : newVersionId);
    } catch (err) {
      console.error(err);
      setValidationError('Error inesperado al computar el hash SHA-256 de la versión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Editor Inmutable de Argumentación
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {hasPinnedQuote ? 'Publicar Réplica Argumental Conectada' : 'Publicar Nueva Tesis Raíz'}
          </h1>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
        >
          &larr; Cancelar y volver
        </button>
      </div>

      {validationError && (
        <div role="alert" className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 font-sans shadow-xs">
          <strong>Error de validación:</strong> {validationError}
        </div>
      )}

      {/* MODO A: TARJETA DE EVIDENCIA ANCLADA */}
      {hasPinnedQuote ? (
        <div className="p-6 rounded-xl border-2 border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></span>
              Tarjeta de Evidencia Anclada (Grafo Criptográfico)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-stone-500">
                Hash Destino: #{targetVersionHash.substring(0, 10)}...
              </span>
              <button
                type="button"
                onClick={() => setHasPinnedQuote(false)}
                className="text-[11px] font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
              >
                (Desvincular cita y publicar como tesis raíz)
              </button>
            </div>
          </div>

          <div className="text-xs font-sans text-stone-700 dark:text-stone-300">
            Artículo citado: <strong>{targetArticle?.title || prefilledQuote?.targetArticleTitle}</strong> por <strong>{targetAuthorName}</strong>
          </div>

          <blockquote className="font-serif italic text-sm sm:text-base text-stone-900 dark:text-stone-100 border-l-4 border-teal-600 pl-4 py-1.5 bg-white/70 dark:bg-black/20 rounded-r">
            «{quotedSnippet}»
          </blockquote>

          {/* 3 Grandes Tarjetas Semánticas de Radio (Obligatorias) */}
          <div className="space-y-2 pt-2 border-t border-teal-200/60 dark:border-teal-900/60">
            <label className="block font-mono text-xs font-bold uppercase text-stone-800 dark:text-stone-200">
              Postura Argumental Obligatoria (Selecciona una):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* [+ APOYA] */}
              <button
                type="button"
                onClick={() => setRelation('supports')}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  relation === 'supports'
                    ? 'border-emerald-600 bg-emerald-100/90 dark:bg-emerald-950/90 ring-2 ring-emerald-500 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  [ + APOYA ]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Aporta evidencia empírica, datos o deducción formal que respalda la premisa.
                </p>
              </button>

              {/* [- CONTRADICE] */}
              <button
                type="button"
                onClick={() => setRelation('contradicts')}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  relation === 'contradicts'
                    ? 'border-rose-600 bg-rose-100/90 dark:bg-rose-950/90 ring-2 ring-rose-500 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-rose-800 dark:text-rose-300">
                  [ - CONTRADICE ]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Presenta un contraejemplo, refutación lógica o anomalía metodológica.
                </p>
              </button>

              {/* [→ AMPLÍA] */}
              <button
                type="button"
                onClick={() => setRelation('extends')}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  relation === 'extends'
                    ? 'border-teal-600 bg-teal-100/90 dark:bg-teal-950/90 ring-2 ring-teal-500 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] hover:bg-stone-50'
                }`}
              >
                <div className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300">
                  [ &rarr; AMPLÍA ]
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                  Extiende la tesis hacia un nuevo dominio, caso límite o síntesis superior.
                </p>
              </button>
            </div>
          </div>

          {/* Campo obligatorio: Síntesis de conexión lógica */}
          <div className="space-y-1.5 pt-2">
            <label
              htmlFor="reasoning-field"
              className="block font-mono text-xs font-bold uppercase text-stone-800 dark:text-stone-200"
            >
              Síntesis de conexión lógica (1–2 frases que se mostrarán en el grafo bidireccional):
            </label>
            <textarea
              id="reasoning-field"
              rows={2}
              required
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explica qué aporta tu texto frente a este fragmento (ej: 'El protocolo PBFT demuestra que bajo sincronía débil el consenso determinista sí es alcanzable')..."
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-xs sm:text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      ) : (
        /* MODO B: PUBLICAR TESIS RAÍZ / ASOCIAR CITA MANUALMENTE */
        <div className="p-4 rounded-lg bg-stone-100 dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-sans text-stone-700 dark:text-stone-300">
              Estás redactando una <strong>tesis raíz</strong> independiente.
            </span>
            <button
              type="button"
              onClick={() => setHasPinnedQuote(true)}
              className="font-mono text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              + Vincular cita hacia un artículo existente
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">
              Si deseas vincular una tesis existente como fuente de debate:
            </label>
            <select
              value={selectedTargetVersionId}
              onChange={(e) => setSelectedTargetVersionId(e.target.value)}
              className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-xs font-sans text-stone-900 dark:text-stone-100"
            >
              {allArticles.map((art) => (
                <option key={art.versionId} value={art.versionId}>
                  {art.title} (v{art.versionNumber})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* FORMULARIO EDITORIAL MARKDOWN */}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Selector de Autor Activo con Credenciales Verificadas */}
        <div className="p-4 rounded-lg bg-stone-50 dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300">
              Autoría y Firma Criptográfica de la Tesis:
            </label>
            <button
              type="button"
              onClick={() => setShowAuthorSessionModal(!showAuthorSessionModal)}
              className="text-xs font-mono text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              {showAuthorSessionModal ? 'Ocultar credenciales' : 'Simular sesión GitHub / ORCID'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-500 mb-1">Autor seleccionado:</label>
              <select
                value={selectedAuthorId}
                onChange={(e) => {
                  setSelectedAuthorId(e.target.value);
                  const a = authors.find((x) => x.id === e.target.value);
                  if (a) onSwitchAuthor(a);
                }}
                className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 font-sans"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.isAnonymized ? a.handle : `${a.realName} (@${a.handle})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-500 mb-1">Área del Saber:</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as ArticleVersion['area'])}
                className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100 font-sans"
              >
                <option value="Epistemología">Epistemología</option>
                <option value="Filosofía de la Ciencia">Filosofía de la Ciencia</option>
                <option value="Sistemas Distribuidos">Sistemas Distribuidos</option>
                <option value="Criptografía y Privacidad">Criptografía y Privacidad</option>
              </select>
            </div>
          </div>

          {showAuthorSessionModal && (
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-stone-500 mb-1">Handle GitHub simulado:</label>
                <input
                  type="text"
                  value={simulatedGithub}
                  onChange={(e) => setSimulatedGithub(e.target.value)}
                  className="w-full p-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Identificador ORCID simulado:</label>
                <input
                  type="text"
                  value={simulatedOrcid}
                  onChange={(e) => setSimulatedOrcid(e.target.value)}
                  className="w-full p-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Título y Subtítulo */}
        <div className="space-y-4">
          <div>
            <label htmlFor="article-title" className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Título de la Tesis:
            </label>
            <input
              id="article-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: La tesis holista como objeción al falsacionismo ingenuo..."
              className="w-full p-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="article-subtitle" className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Subtítulo explicativo / Resumen ejecutivo:
            </label>
            <input
              id="article-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej: Análisis formal de por qué ninguna conjetura se contrasta en aislamiento..."
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Estado Epistémico y Licencia Abierta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Estado Epistémico Declarado:
            </label>
            <select
              value={epistemicStatus}
              onChange={(e) => setEpistemicStatus(e.target.value as EpistemicStatus)}
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100"
            >
              <option value="fact">[ Hecho ] Formal / Demostración / Datos empíricos</option>
              <option value="hypothesis">[ Hipótesis ] Sometida a refutación abierta</option>
              <option value="opinion">[ Opinión ] Ensayo conceptual o reflexivo</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Licencia Abierta Seleccionada:
            </label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value as LicenseType)}
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100"
            >
              <option value="CC BY-SA 4.0">CC BY-SA 4.0 (Atribución y Compartir Igual - Recomendada)</option>
              <option value="CC BY 4.0">CC BY 4.0 (Atribución libre)</option>
              <option value="CC0 1.0">CC0 1.0 (Dominio Público universal)</option>
            </select>
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
                onClick={() => setEditorTab('write')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                  editorTab === 'write'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Escribir
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('preview')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                  editorTab === 'preview'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Previsualizar
              </button>
            </div>
          </div>

          {editorTab === 'write' ? (
            <textarea
              rows={14}
              required
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              className="w-full p-4 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] font-mono text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          ) : (
            <div className="p-6 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] prose prose-stone dark:prose-invert max-w-none text-base leading-relaxed font-serif min-h-[300px]">
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

        {/* Botón Primario de Publicación */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-sans">
            Al publicar, se calculará el hash criptográfico SHA-256 de la versión y se indexará en el grafo sin intermediarios.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded bg-teal-800 text-white hover:bg-teal-700 font-mono text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isSubmitting ? 'Calculando Hash...' : 'Publicar Artículo e Indexar en el Grafo'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
