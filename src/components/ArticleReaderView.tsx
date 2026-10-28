import React, { useState, useEffect, useRef } from 'react';
import { ArticleVersion, Author, Citation, CitationRelation, ModerationReport } from '../types/chen';
import { ActiveView } from './Navbar';
import { ModerationReportModal } from './ModerationReportModal';

interface ArticleReaderViewProps {
  article: ArticleVersion;
  allArticles: ArticleVersion[];
  authors: Author[];
  citations: Citation[];
  onNavigate: (view: ActiveView, articleId?: string) => void;
  onOpenEditorWithQuote: (quoteData: {
    targetVersionId: string;
    targetArticleTitle: string;
    targetAuthorName: string;
    targetVersionHash: string;
    quotedSnippet: string;
    initialRelation?: CitationRelation;
  }) => void;
  highlightedCitationId?: string;
  onAddReport: (report: ModerationReport) => void;
}

export const ArticleReaderView: React.FC<ArticleReaderViewProps> = ({
  article,
  allArticles,
  authors,
  citations,
  onNavigate,
  onOpenEditorWithQuote,
  highlightedCitationId,
  onAddReport,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionCoords, setSelectionCoords] = useState<{ top: number; left: number } | null>(null);
  const [citationFilter, setCitationFilter] = useState<'all' | CitationRelation>('all');
  const [isCopiedBibtex, setIsCopiedBibtex] = useState(false);
  const [isCopiedHash, setIsCopiedHash] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const articleContentRef = useRef<HTMLDivElement>(null);

  const author = authors.find((a) => a.id === article.authorId);
  const authorName = author ? author.realName : 'Autor Desconocido';

  // Citas entrantes hacia este artículo
  const incomingCitations = citations.filter((c) => c.targetVersionId === article.versionId);

  // Citas salientes formuladas por este artículo
  const outgoingCitations = citations.filter((c) => c.sourceVersionId === article.versionId);

  // Filtro de citas entrantes
  const filteredIncoming =
    citationFilter === 'all'
      ? incomingCitations
      : incomingCitations.filter((c) => c.relation === citationFilter);

  // Desplazamiento automático hacia una cita resaltada recién creada
  useEffect(() => {
    if (highlightedCitationId) {
      setTimeout(() => {
        const el = document.getElementById(`citation-card-${highlightedCitationId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [highlightedCitationId]);

  // Hook real de selección de texto con mouseup
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText('');
        setSelectionCoords(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 20 && text.length <= 400) {
        if (articleContentRef.current && articleContentRef.current.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectedText(text);
          setSelectionCoords({
            top: rect.top + window.scrollY - 52,
            left: rect.left + window.scrollX + rect.width / 2,
          });
          return;
        }
      }
      setSelectedText('');
      setSelectionCoords(null);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText('');
        setSelectionCoords(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Exportar a Markdown (.md) puro con frontmatter
  const handleExportMarkdown = () => {
    const frontmatter = `---
title: "${article.title}"
subtitle: "${article.subtitle}"
area: "${article.area}"
author: "${authorName}"
author_handle: "${author?.handle || ''}"
orcid: "${author?.orcidId || ''}"
version_id: "${article.versionId}"
version_number: ${article.versionNumber}
content_hash_sha256: "${article.contentHash}"
license: "${article.license}"
epistemic_status: "${article.epistemicStatus}"
created_at: "${article.createdAt}"
protocol: "Chen Open Argumentation Protocol v1.0"
---

`;
    const fullText = frontmatter + article.contentMarkdown;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.articleId}-v${article.versionNumber}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copiar cita académica BibTeX
  const handleCopyBibtex = () => {
    const bibtex = `@article{chen_${article.articleId.replace(/-/g, '_')},
  title = {${article.title}},
  author = {${authorName}},
  year = {2026},
  journal = {Chen: Protocolo de Argumentación Abierta},
  version = {${article.versionNumber}},
  note = {Hash SHA-256: ${article.contentHash}},
  howpublished = {https://chen-protocol.org/article/${article.articleId}}
}`;
    navigator.clipboard.writeText(bibtex);
    setIsCopiedBibtex(true);
    setTimeout(() => setIsCopiedBibtex(false), 2500);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(article.contentHash);
    setIsCopiedHash(true);
    setTimeout(() => setIsCopiedHash(false), 2000);
  };

  const epistemicBadge =
    article.epistemicStatus === 'fact'
      ? { label: '[ Estado: Hecho ]', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' }
      : article.epistemicStatus === 'hypothesis'
      ? { label: '[ Estado: Hipótesis ]', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' }
      : { label: '[ Estado: Opinión ]', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200' };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* 1. TOP BREADCRUMB & BOTONES DE RETORNO */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          &larr; Volver al índice de artículos
        </button>

        <div className="flex items-center gap-2">
          <span className="text-teal-800 dark:text-teal-300 font-semibold">{article.area}</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-600 dark:text-stone-400">{article.readingTimeMinutes} min de lectura</span>
        </div>
      </div>

      {/* TOOLBAR FLOTANTE CONTEXTUAL DE SUBRAYADO (3 DISPARADORES DIRECTOS) */}
      {selectedText && selectionCoords && (
        <div
          style={{
            position: 'absolute',
            top: `${selectionCoords.top}px`,
            left: `${selectionCoords.left}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-2xl border border-stone-700 dark:border-stone-300">
            <button
              onClick={() =>
                onOpenEditorWithQuote({
                  targetVersionId: article.versionId,
                  targetArticleTitle: article.title,
                  targetAuthorName: authorName,
                  targetVersionHash: article.contentHash,
                  quotedSnippet: selectedText,
                  initialRelation: 'supports',
                })
              }
              className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold text-emerald-400 dark:text-emerald-800 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              title="Apoyar este fragmento con deducción o datos"
            >
              [ + Apoyar ]
            </button>

            <span className="text-stone-600 dark:text-stone-400">|</span>

            <button
              onClick={() =>
                onOpenEditorWithQuote({
                  targetVersionId: article.versionId,
                  targetArticleTitle: article.title,
                  targetAuthorName: authorName,
                  targetVersionHash: article.contentHash,
                  quotedSnippet: selectedText,
                  initialRelation: 'contradicts',
                })
              }
              className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold text-rose-400 dark:text-rose-800 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              title="Contradecir este fragmento con un contraejemplo"
            >
              [ - Contradecir ]
            </button>

            <span className="text-stone-600 dark:text-stone-400">|</span>

            <button
              onClick={() =>
                onOpenEditorWithQuote({
                  targetVersionId: article.versionId,
                  targetArticleTitle: article.title,
                  targetAuthorName: authorName,
                  targetVersionHash: article.contentHash,
                  quotedSnippet: selectedText,
                  initialRelation: 'extends',
                })
              }
              className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold text-teal-300 dark:text-teal-800 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              title="Ampliar este fragmento hacia un nuevo marco"
            >
              [ &rarr; Ampliar ]
            </button>
          </div>
        </div>
      )}

      {/* 2. ENCABEZADO EDITORIAL, INSIGNIAS Y BOTONES DE UTILIDAD */}
      <header className="space-y-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wide ${epistemicBadge.color}`}>
              {epistemicBadge.label}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              Versión v{article.versionNumber}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <button
              onClick={handleCopyHash}
              className="text-stone-500 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              title="Copiar hash SHA-256 completo de la versión"
            >
              <span>SHA-256: #{article.contentHash.substring(0, 10)}...</span>
              <span>{isCopiedHash ? '(¡Copiado!)' : '(copiar)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:text-stone-900 text-xs font-mono transition-colors cursor-pointer"
            >
              Exportar Markdown (.md)
            </button>
            <button
              onClick={handleCopyBibtex}
              className="px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] text-stone-700 dark:text-stone-300 hover:text-stone-900 text-xs font-mono transition-colors cursor-pointer"
            >
              {isCopiedBibtex ? '¡BibTeX Copiado!' : 'Copiar BibTeX'}
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-2.5 py-1 rounded border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 text-xs font-mono transition-colors cursor-pointer"
            >
              Reportar
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-100 leading-[1.15] tracking-tight">
            {article.title}
          </h1>
          <p className="font-sans text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Tarjeta de Autor con Credenciales Verificadas y Acceso a Portafolio */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-800 flex items-center justify-center font-serif text-sm font-bold text-teal-800 dark:text-teal-300">
              {author?.isAnonymized ? '?' : authorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 dark:text-stone-100">{authorName}</span>
                {author?.isAnonymized ? (
                  <span className="font-mono text-[10px] bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-600 dark:text-stone-400">
                    RGPD Anonimizado
                  </span>
                ) : (
                  <>
                    {author?.githubUser && (
                      <span className="font-mono text-[11px] text-stone-500">@{author.githubUser}</span>
                    )}
                    {author?.orcidId && (
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ORCID: {author.orcidId}
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{author?.roleAndAffiliation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('graph')}
              className="text-xs font-mono text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Ver perfil y portafolio del autor &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* 3. CITAS SALIENTES (FUENTES CITADAS POR ESTE ARTÍCULO) */}
      {outgoingCitations.length > 0 && (
        <section aria-labelledby="outgoing-citations-heading" className="p-4 rounded-lg bg-stone-100/70 dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-3">
          <span id="outgoing-citations-heading" className="font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300">
            Fuentes citadas formalmente por este artículo ({outgoingCitations.length}):
          </span>
          <div className="space-y-2">
            {outgoingCitations.map((outCit) => {
              const targetArt = allArticles.find((a) => a.versionId === outCit.targetVersionId);
              const targetAuthor = targetArt ? authors.find((a) => a.id === targetArt.authorId) : null;
              const relationBadge =
                outCit.relation === 'supports'
                  ? '[ + Apoya ]'
                  : outCit.relation === 'contradicts'
                  ? '[ - Contradice ]'
                  : '[ → Amplía ]';
              const badgeClass =
                outCit.relation === 'supports'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : outCit.relation === 'contradicts'
                  ? 'text-rose-800 dark:text-rose-300'
                  : 'text-teal-800 dark:text-teal-300';

              return (
                <div key={outCit.id} className="p-3 rounded bg-white dark:bg-[#0D1117] border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className={`font-bold ${badgeClass}`}>
                      {relationBadge} a {targetAuthor ? targetAuthor.realName : 'Autor'}
                    </span>
                    <button
                      onClick={() => onNavigate('reader', outCit.targetVersionId)}
                      className="text-teal-700 dark:text-teal-400 underline cursor-pointer"
                    >
                      Ver artículo fuente &rarr;
                    </button>
                  </div>
                  <div className="font-serif italic text-stone-700 dark:text-stone-300">
                    «{outCit.quotedSnippet}»
                  </div>
                  <div className="text-stone-800 dark:text-stone-200 font-sans">
                    <strong>Argumento:</strong> {outCit.reasoning}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BANNER GUÍA DE SUBRAYADO */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 p-3.5 rounded-lg text-xs font-sans text-amber-950 dark:text-amber-200 flex items-center gap-2">
        <span>💡</span>
        <span>
          <strong>Instrucción interactiva:</strong> Selecciona cualquier frase o párrafo del texto (mínimo 20 caracteres) con el cursor para citarlo, respaldarlo o refutarlo en un nuevo artículo mediante el menú contextual emergente.
        </span>
      </div>

      {/* 4. CUERPO DEL ARTÍCULO (CON SUBRAYADOS DINÁMICOS DE FRAGMENTOS CITADOS) */}
      <section
        ref={articleContentRef}
        aria-label="Cuerpo del artículo"
        className="prose prose-stone dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed font-serif text-stone-900 dark:text-stone-100 space-y-6"
      >
        {article.contentMarkdown.split('\n\n').map((paragraph, pIdx) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={pIdx} className="font-serif text-2xl font-bold pt-4 text-stone-900 dark:text-stone-100">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={pIdx} className="border-l-4 border-teal-600 pl-4 italic text-stone-800 dark:text-stone-200 my-4">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }

          // Verificar si el párrafo contiene una cita registrada en incomingCitations
          const matchedCitation = incomingCitations.find((c) =>
            paragraph.includes(c.quotedSnippet) || c.quotedSnippet.includes(paragraph)
          );

          if (matchedCitation) {
            const parts = paragraph.split(matchedCitation.quotedSnippet);
            return (
              <p key={pIdx} className="leading-relaxed">
                {parts[0]}
                <mark
                  onClick={() => {
                    const el = document.getElementById(`citation-card-${matchedCitation.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="bg-teal-100/70 dark:bg-teal-950/70 text-stone-900 dark:text-stone-100 border-b-2 border-dashed border-teal-600 dark:border-teal-400 px-1 py-0.5 rounded cursor-pointer transition-colors hover:bg-teal-200 dark:hover:bg-teal-900"
                  title="Fragmento citado activamente en el grafo. Haz clic para saltar a la réplica."
                >
                  {matchedCitation.quotedSnippet}
                  <span className="ml-1.5 inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-200/80 dark:bg-teal-900/80 px-1 py-0.2 rounded align-middle">
                    1 cita activa
                  </span>
                </mark>
                {parts[1]}
              </p>
            );
          }

          return (
            <p key={pIdx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </section>

      {/* 5. RED ARGUMENTATIVA · ARTÍCULOS QUE CITAN ESTA VERSIÓN */}
      <section
        id="seccion-red-argumentativa"
        aria-labelledby="incoming-citations-heading"
        className="pt-10 border-t-2 border-stone-200 dark:border-stone-800 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
              Grafo Bidireccional
            </span>
            <h2 id="incoming-citations-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Red Argumentativa · Artículos que citan esta versión ({incomingCitations.length})
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-sans">
            Todas las citas están ancladas al hash <span className="font-mono">#{article.contentHash.substring(0, 8)}</span>.
          </p>
        </div>

        {/* Pestañas de filtrado de citas entrantes */}
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          <button
            onClick={() => setCitationFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium cursor-pointer ${
              citationFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            [ Todas ({incomingCitations.length}) ]
          </button>
          <button
            onClick={() => setCitationFilter('supports')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium cursor-pointer ${
              citationFilter === 'supports'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            [ + Apoya ({incomingCitations.filter((c) => c.relation === 'supports').length}) ]
          </button>
          <button
            onClick={() => setCitationFilter('contradicts')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium cursor-pointer ${
              citationFilter === 'contradicts'
                ? 'bg-rose-700 text-white font-bold'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}
          >
            [ - Contradice ({incomingCitations.filter((c) => c.relation === 'contradicts').length}) ]
          </button>
          <button
            onClick={() => setCitationFilter('extends')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium cursor-pointer ${
              citationFilter === 'extends'
                ? 'bg-teal-700 text-white font-bold'
                : 'bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
            }`}
          >
            [ → Amplía ({incomingCitations.filter((c) => c.relation === 'extends').length}) ]
          </button>
        </div>

        {/* Listado de Citas Entrantes */}
        {filteredIncoming.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-2">
            <p className="font-serif text-base text-stone-600 dark:text-stone-400">
              No hay citas registradas bajo este filtro.
            </p>
            <p className="text-xs text-stone-500 font-sans">
              Subraya un fragmento del texto arriba para publicar la primera réplica hacia esta versión.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIncoming.map((cit) => {
              const citingArticle = allArticles.find((a) => a.versionId === cit.sourceVersionId);
              const citingAuthor = citingArticle ? authors.find((a) => a.id === citingArticle.authorId) : null;
              const citingAuthorName = citingAuthor ? citingAuthor.realName : 'Investigador';
              const isHighlight = highlightedCitationId === cit.id;

              const isSupports = cit.relation === 'supports';
              const isContradicts = cit.relation === 'contradicts';

              const cardClass = isHighlight
                ? 'border-2 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-lg ring-2 ring-emerald-400'
                : isSupports
                ? 'border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/40 dark:bg-emerald-950/20 border-l-4 border-l-emerald-600'
                : isContradicts
                ? 'border-rose-300 dark:border-rose-800/70 bg-rose-50/40 dark:bg-rose-950/20 border-l-4 border-l-rose-600'
                : 'border-teal-300 dark:border-teal-800/70 bg-teal-50/40 dark:bg-teal-950/20 border-l-4 border-l-teal-600';

              const badgeText = isSupports ? '[ + Apoya ]' : isContradicts ? '[ - Contradice ]' : '[ → Amplía ]';
              const badgeClass = isSupports ? 'text-emerald-800 dark:text-emerald-300' : isContradicts ? 'text-rose-800 dark:text-rose-300' : 'text-teal-800 dark:text-teal-300';

              return (
                <div
                  key={cit.id}
                  id={`citation-card-${cit.id}`}
                  className={`p-5 rounded-lg border space-y-3 transition-all ${cardClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${badgeClass}`}>{badgeText}</span>
                      <span className="text-stone-400">·</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        por {citingAuthorName}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-stone-500">
                      Cita registrada: {cit.createdAt}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-serif italic text-stone-700 dark:text-stone-300 border-l-2 border-stone-400 pl-3 py-1">
                    «{cit.quotedSnippet}»
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed">
                    <strong>Justificación epistémica:</strong> {cit.reasoning}
                  </p>

                  <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Tesis citante: {citingArticle ? citingArticle.title : 'Artículo'}
                    </span>
                    <button
                      onClick={() => onNavigate('reader', cit.sourceVersionId)}
                      className="px-3.5 py-1.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-mono text-xs font-medium hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Leer réplica completa &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de Reporte de Incidencias */}
      <ModerationReportModal
        targetVersionId={article.versionId}
        articleTitle={article.title}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={onAddReport}
      />
    </article>
  );
};
