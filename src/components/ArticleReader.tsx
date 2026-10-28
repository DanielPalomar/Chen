import React, { useState, useEffect, useRef } from 'react';
import { Article, CitationRelation } from '../types';

interface ArticleReaderProps {
  article: Article;
  allArticles: Article[];
  onNavigateArticle: (articleId: string) => void;
  onOpenEditorWithQuote: (quoteData: {
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  }) => void;
  onBackToFeed: () => void;
  highlightedCitationId?: string;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  allArticles,
  onNavigateArticle,
  onOpenEditorWithQuote,
  onBackToFeed,
  highlightedCitationId,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionCoords, setSelectionCoords] = useState<{ top: number; left: number } | null>(null);
  const [activeCitationFilter, setActiveCitationFilter] = useState<'all' | CitationRelation>('all');
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const articleBodyRef = useRef<HTMLDivElement>(null);

  // Scroll to and highlight new citation if requested
  useEffect(() => {
    if (highlightedCitationId) {
      setTimeout(() => {
        const el = document.getElementById(`cit-${highlightedCitationId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [highlightedCitationId]);

  // Hook real de Selección de Texto (window.getSelection)
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText('');
        setSelectionCoords(null);
        return;
      }

      const text = selection.toString().trim();
      // Restricción estricta de 20 a 400 caracteres
      if (text.length >= 20 && text.length <= 400) {
        if (articleBodyRef.current && articleBodyRef.current.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectedText(text);
          setSelectionCoords({
            top: rect.top + window.scrollY - 46,
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

  const handleCopyHash = () => {
    navigator.clipboard.writeText(article.currentVersionHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportMarkdown = () => {
    const frontmatter = `---
title: "${article.title}"
subtitle: "${article.subtitle}"
author: "${article.author.name}"
author_handle: "${article.author.handle}"
orcid: "${article.author.orcidId || ''}"
version: "${article.currentVersionNumber}"
content_hash_sha256: "${article.currentVersionHash}"
license: "${article.license}"
epistemic_status: "${article.epistemicStatus}"
published_date: "${article.publishedDate}"
protocol: "Chen Open Argumentation v1.0"
---

`;
    const fullDoc = frontmatter + article.contentMarkdown;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}-${article.currentVersionNumber}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Citas entrantes conocidas hacia esta versión
  const incomingCitations = article.citedByInbound;

  const filteredCitations =
    activeCitationFilter === 'all'
      ? incomingCitations
      : incomingCitations.filter((cit) => cit.relation === activeCitationFilter);

  const epistemicBadge =
    article.epistemicStatus === 'fact'
      ? { label: '[ Hecho ]', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200' }
      : article.epistemicStatus === 'hypothesis'
      ? { label: '[ Hipótesis ]', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200' }
      : { label: '[ Opinión ]', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200' };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Botón de Retorno */}
      <div>
        <button
          onClick={onBackToFeed}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          &larr; Volver al explorador de artículos
        </button>
      </div>

      {/* BOTÓN FLOTANTE DINÁMICO DE SUBRAYADO Y CITACIÓN */}
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
          <button
            onClick={() => {
              onOpenEditorWithQuote({
                sourceSnippet: selectedText,
                targetArticleId: article.id,
                targetArticleTitle: article.title,
                targetVersionHash: article.currentVersionHash,
                targetAuthorName: article.author.name,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono font-bold shadow-xl hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
            <span>Citar / Replicar este fragmento</span>
          </button>
        </div>
      )}

      {/* AVISO DE NUEVA CITA CREADA CON ÉXITO */}
      {highlightedCitationId && (
        <div role="status" className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span><strong>¡Cita y Tesis publicada con éxito!</strong> Se ha conectado inmediatamente en la Red Argumentativa inferior.</span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('seccion-red-argumentativa');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-mono text-xs font-bold underline hover:text-emerald-800"
          >
            Ver en el Grafo &darr;
          </button>
        </div>
      )}

      {/* 1. CABECERA EDITORIAL COMPLETA */}
      <header className="space-y-6 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider ${epistemicBadge.color}`}>
              {epistemicBadge.label}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600 dark:text-stone-400 font-semibold">{article.license}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-mono transition-colors border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer"
              title="Descargar archivo Markdown (.md) puro con metadatos"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{downloadSuccess ? '¡Descargado!' : 'Exportar .md'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-100 leading-[1.15] tracking-tight">
            {article.title}
          </h1>
          <p className="font-sans text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Metadatos de Autor, Identidad Criptográfica e Inmutabilidad */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
          {/* Autor Verificado */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-800 flex items-center justify-center font-serif text-sm font-bold text-teal-800 dark:text-teal-300">
              {article.author.isErased ? '?' : article.author.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {article.author.name}
                </span>
                {article.author.isErased ? (
                  <span className="font-mono text-[10px] bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300">
                    Anonimizado bajo RGPD
                  </span>
                ) : (
                  <>
                    {article.author.githubUser && (
                      <span className="font-mono text-[11px] text-stone-500">
                        @{article.author.githubUser}
                      </span>
                    )}
                    {article.author.orcidId && (
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ORCID: {article.author.orcidId}
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {article.author.role}
              </p>
            </div>
          </div>

          {/* Versión y Hash SHA-256 */}
          <div className="sm:text-right space-y-1 font-mono text-xs">
            <div className="text-stone-700 dark:text-stone-300">
              <span>Publicado: {article.publishedDate}</span>
              <span className="mx-1.5 text-stone-300 dark:text-stone-700">·</span>
              <span className="font-bold">{article.currentVersionNumber}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-stone-500 dark:text-stone-400">
              <span>SHA-256:</span>
              <button
                onClick={handleCopyHash}
                className="font-mono text-[11px] text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                title="Copiar hash criptográfico completo"
              >
                <span>#{article.currentVersionHash.substring(0, 10)}...</span>
                <span>{copiedHash ? '(¡Copiado!)' : '(copiar)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Declaración epistémica */}
        {article.epistemicNote && (
          <div className="p-3.5 rounded-lg bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
            <strong className="font-mono text-[11px] uppercase tracking-wide text-stone-800 dark:text-stone-200 block mb-0.5">
              Declaración Epistémica de la Tesis:
            </strong>
            {article.epistemicNote}
          </div>
        )}
      </header>

      {/* 2. CUERPO DEL ARTÍCULO (Tipografía editorial serif con subrayados de citas previas) */}
      <section
        ref={articleBodyRef}
        aria-label="Cuerpo del artículo"
        className="prose prose-stone dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed font-serif text-stone-900 dark:text-stone-100 space-y-6"
      >
        <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded text-xs font-sans text-amber-950 dark:text-amber-200 leading-relaxed">
          💡 <strong>Mecánica de Subrayado para Citar:</strong> Selecciona cualquier fragmento (20 a 400 caracteres) en los párrafos siguientes con el ratón. Aparecerá de inmediato el botón flotante <em>«Citar / Replicar este fragmento»</em> para abrir el editor con la evidencia anclada.
        </div>

        {/* Renderizado de párrafos en Markdown con subrayado sutil de citas existentes */}
        {article.contentMarkdown.split('\n\n').map((paragraph, idx) => {
          // Encabezados Markdown
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 pt-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-stone-400 dark:border-stone-600 pl-4 italic text-stone-800 dark:text-stone-200 my-4">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }

          // Verificar si el párrafo contiene una cita ya registrada
          const matchingCitation = incomingCitations.find((c) =>
            paragraph.includes(c.quotedSnippet) || c.quotedSnippet.includes(paragraph)
          );

          if (matchingCitation) {
            const parts = paragraph.split(matchingCitation.quotedSnippet);
            return (
              <p key={idx} className="leading-relaxed">
                {parts[0]}
                <mark
                  onClick={() => {
                    const el = document.getElementById(`cit-${matchingCitation.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="bg-teal-50 dark:bg-teal-950/50 text-stone-900 dark:text-stone-100 border-b-2 border-dashed border-teal-600 dark:border-teal-400 cursor-pointer px-1 py-0.5 rounded transition-colors hover:bg-teal-100 dark:hover:bg-teal-900/60"
                  title="Fragmento citado formalmente por otro investigador. Haz clic para saltar a la réplica en el grafo."
                >
                  {matchingCitation.quotedSnippet}
                  <span className="ml-1.5 inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-200/60 dark:bg-teal-900/60 px-1 py-0.2 rounded align-middle">
                    1 réplica
                  </span>
                </mark>
                {parts[1]}
              </p>
            );
          }

          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </section>

      {/* 3. SECCIÓN REQUERIDA: RED ARGUMENTATIVA · ARTÍCULOS QUE CITAN ESTA VERSIÓN */}
      <section
        id="seccion-red-argumentativa"
        aria-labelledby="cited-by-heading"
        className="pt-10 border-t-2 border-stone-200 dark:border-stone-800 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Grafo Bidireccional
            </span>
            <h2 id="cited-by-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Red Argumentativa · Artículos que citan esta versión ({incomingCitations.length})
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-sans">
            Todas las citas apuntan a la versión inmutable <span className="font-mono">{article.currentVersionNumber}</span>.
          </p>
        </div>

        {/* Filtros canónicos estandarizados */}
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          <button
            onClick={() => setActiveCitationFilter('all')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
              activeCitationFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            [ Todas ({incomingCitations.length}) ]
          </button>
          <button
            onClick={() => setActiveCitationFilter('supports')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
              activeCitationFilter === 'supports'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            [ + Apoya ({incomingCitations.filter((c) => c.relation === 'supports').length}) ]
          </button>
          <button
            onClick={() => setActiveCitationFilter('contradicts')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
              activeCitationFilter === 'contradicts'
                ? 'bg-rose-700 text-white font-bold'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 hover:bg-rose-100 border border-rose-300 dark:border-rose-800'
            }`}
          >
            [ - Contradice ({incomingCitations.filter((c) => c.relation === 'contradicts').length}) ]
          </button>
          <button
            onClick={() => setActiveCitationFilter('extends')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
              activeCitationFilter === 'extends'
                ? 'bg-teal-700 text-white font-bold'
                : 'bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 hover:bg-teal-100 border border-teal-300 dark:border-teal-800'
            }`}
          >
            [ → Amplía ({incomingCitations.filter((c) => c.relation === 'extends').length}) ]
          </button>
        </div>

        {/* Listado de Réplicas Conectadas */}
        {filteredCitations.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-2">
            <p className="font-serif text-base text-stone-600 dark:text-stone-400">
              No hay réplicas registradas bajo este filtro.
            </p>
            <p className="text-xs text-stone-500 font-sans">
              Subraya cualquier fragmento del texto anterior para formular la primera réplica.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCitations.map((cit) => {
              const isContra = cit.relation === 'contradicts';
              const isSupport = cit.relation === 'supports';
              const isHighlighted = highlightedCitationId === cit.id;

              const cardBorder = isHighlighted
                ? 'border-2 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-400'
                : isContra
                ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20'
                : isSupport
                ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-teal-300 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/20';

              const relationTag = isContra
                ? '[ - Contradice ]'
                : isSupport
                ? '[ + Apoya ]'
                : '[ → Amplía ]';

              const tagColor = isContra
                ? 'text-rose-800 dark:text-rose-300'
                : isSupport
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-teal-800 dark:text-teal-300';

              return (
                <div
                  key={cit.id}
                  id={`cit-${cit.id}`}
                  className={`p-5 rounded-lg border transition-all ${cardBorder}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${tagColor}`}>
                        {relationTag}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        por {cit.sourceAuthorName}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-stone-500">
                      Hash anclado: #{cit.targetVersionHash.substring(0, 8)}
                    </span>
                  </div>

                  {/* Extracto citado */}
                  <div className="mt-3 text-xs sm:text-sm font-serif italic text-stone-700 dark:text-stone-300 border-l-2 border-stone-400 dark:border-stone-600 pl-3 py-0.5">
                    «{cit.quotedSnippet}»
                  </div>

                  {/* Justificación del autor citante */}
                  <div className="mt-2 text-xs sm:text-sm font-sans text-stone-900 dark:text-stone-100 leading-relaxed">
                    <strong>Justificación del autor:</strong> {cit.reasoning}
                  </div>

                  {/* Salto al artículo citante */}
                  <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                      Artículo citante: <strong>{cit.sourceArticleTitle}</strong>
                    </span>
                    <button
                      onClick={() => onNavigateArticle(cit.sourceArticleId)}
                      className="px-3.5 py-1.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-medium hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
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

      {/* 4. SECCIÓN DE CITAS SALIENTES (FUENTES CITADAS POR ESTE ARTÍCULO) */}
      {article.citationsOutbound.length > 0 && (
        <section aria-labelledby="outbound-heading" className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
          <h3 id="outbound-heading" className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Fuentes y Citas Salientes formuladas en este texto ({article.citationsOutbound.length})
          </h3>
          <div className="space-y-3">
            {article.citationsOutbound.map((cit) => (
              <div
                key={cit.id}
                className="p-4 rounded-md border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#13151A] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-stone-500">
                  <span>
                    Postura: <strong>{cit.relation === 'supports' ? '[ + Apoya ]' : cit.relation === 'contradicts' ? '[ - Contradice ]' : '[ → Amplía ]'}</strong> hacia {cit.targetAuthorName}
                  </span>
                  <span>Hash: #{cit.targetVersionHash.substring(0, 8)}</span>
                </div>
                <div className="font-serif italic text-stone-800 dark:text-stone-200">
                  «{cit.quotedSnippet}»
                </div>
                <p className="font-sans text-stone-600 dark:text-stone-400">
                  <strong>Argumento:</strong> {cit.reasoning}
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => onNavigateArticle(cit.targetArticleId)}
                    className="text-teal-700 dark:text-teal-400 font-mono underline hover:text-teal-900 cursor-pointer"
                  >
                    Ver artículo fuente: {cit.targetArticleTitle} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
