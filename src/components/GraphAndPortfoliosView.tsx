import React, { useState } from 'react';
import { ArticleVersion, Author, Citation, CitationRelation } from '../types/chen';

interface GraphAndPortfoliosViewProps {
  articles: ArticleVersion[];
  authors: Author[];
  citations: Citation[];
  onOpenArticle: (articleId: string) => void;
}

export const GraphAndPortfoliosView: React.FC<GraphAndPortfoliosViewProps> = ({
  articles,
  authors,
  citations,
  onOpenArticle,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(articles[0]?.versionId || '');
  const [activeTab, setActiveTab] = useState<'graph' | 'portfolios'>('graph');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const selectedArticle = articles.find((a) => a.versionId === selectedNodeId);
  const selectedArticleAuthor = selectedArticle
    ? authors.find((a) => a.id === selectedArticle.authorId)
    : null;

  // Citas entrantes y salientes del nodo seleccionado
  const inboundCitations = citations.filter((c) => c.targetVersionId === selectedNodeId);
  const outboundCitations = citations.filter((c) => c.sourceVersionId === selectedNodeId);

  // Coordenadas calculadas en layout circular o de cuadrícula para el mapa SVG interactivo
  const nodePositions: { [versionId: string]: { x: number; y: number } } = {
    'ver-vasconcelos-v1': { x: 380, y: 190 }, // Nodo central / seminal
    'ver-popper-v1': { x: 120, y: 80 },
    'ver-duhem-quine-v1': { x: 640, y: 80 },
    'ver-lakatos-v1': { x: 580, y: 320 },
    'ver-valdes-pbft-v1': { x: 160, y: 320 },
  };

  // Posición fallback si hay más artículos añadidos dinámicamente
  const getNodePos = (vId: string, idx: number) => {
    if (nodePositions[vId]) return nodePositions[vId];
    const angle = (idx * (2 * Math.PI)) / Math.max(articles.length, 1);
    return {
      x: 380 + Math.cos(angle) * 200,
      y: 200 + Math.sin(angle) * 130,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Encabezado y Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Topología Epistémica
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            Explorador del Grafo &amp; Portafolios Verificados
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
            Visualización de dependencias lógicas sin algoritmos de popularidad: solo deducciones, refutaciones y extensiones.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            Mapa del Grafo (SVG)
          </button>
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'portfolios'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            Portafolios de Autores ({authors.length})
          </button>
        </div>
      </div>

      {activeTab === 'graph' ? (
        /* VISTA DEL GRAFO INTERACTIVO SVG */
        <div className="space-y-6">
          {/* Leyenda de Relaciones Canónicas */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-stone-50 dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 text-xs font-mono">
            <span className="font-bold text-stone-700 dark:text-stone-300">Tipos de Enlace en el Grafo:</span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-3 h-0.5 bg-emerald-600"></span> [ + Apoya ] (Deducción compatible)
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold">
                <span className="w-3 h-0.5 bg-rose-600"></span> [ - Contradice ] (Contraejemplo / Objeción)
              </span>
              <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold">
                <span className="w-3 h-0.5 bg-teal-600"></span> [ &rarr; Amplía ] (Extensión heurística)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lienzo SVG Interactivo */}
            <div className="lg:col-span-2 p-4 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#0D1117] shadow-inner overflow-x-auto min-h-[420px] flex items-center justify-center">
              <svg viewBox="0 0 760 400" className="w-full h-auto max-w-[760px] select-none">
                <defs>
                  {/* Flechas dirigidas coloreadas */}
                  <marker id="arrow-supports" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                  </marker>
                  <marker id="arrow-contradicts" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#E11D48" />
                  </marker>
                  <marker id="arrow-extends" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0D9488" />
                  </marker>
                </defs>

                {/* Aristas / Enlaces de Citas Criptográficas */}
                {citations.map((cit) => {
                  const srcIdx = articles.findIndex((a) => a.versionId === cit.sourceVersionId);
                  const tgtIdx = articles.findIndex((a) => a.versionId === cit.targetVersionId);
                  if (srcIdx === -1 || tgtIdx === -1) return null;

                  const srcPos = getNodePos(cit.sourceVersionId, srcIdx);
                  const tgtPos = getNodePos(cit.targetVersionId, tgtIdx);

                  const isConnectedToSelected =
                    cit.sourceVersionId === selectedNodeId || cit.targetVersionId === selectedNodeId;

                  const strokeColor =
                    cit.relation === 'supports'
                      ? '#059669'
                      : cit.relation === 'contradicts'
                      ? '#E11D48'
                      : '#0D9488';

                  const markerId =
                    cit.relation === 'supports'
                      ? 'url(#arrow-supports)'
                      : cit.relation === 'contradicts'
                      ? 'url(#arrow-contradicts)'
                      : 'url(#arrow-extends)';

                  return (
                    <g key={cit.id} className="transition-opacity duration-200">
                      <line
                        x1={srcPos.x}
                        y1={srcPos.y}
                        x2={tgtPos.x}
                        y2={tgtPos.y}
                        stroke={strokeColor}
                        strokeWidth={isConnectedToSelected ? 3 : 1.5}
                        strokeDasharray={cit.relation === 'contradicts' ? '4 2' : undefined}
                        opacity={isConnectedToSelected ? 1 : 0.45}
                        markerEnd={markerId}
                      />
                    </g>
                  );
                })}

                {/* Nodos / Artículos */}
                {articles.map((art, idx) => {
                  const pos = getNodePos(art.versionId, idx);
                  const isSelected = art.versionId === selectedNodeId;
                  const author = authors.find((a) => a.id === art.authorId);
                  const shortAuthor = author ? author.realName.split(' ')[0] + ' ' + (author.realName.split(' ')[1] || '') : 'Autor';

                  return (
                    <g
                      key={art.versionId}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedNodeId(art.versionId)}
                      className="cursor-pointer group"
                    >
                      <circle
                        r={isSelected ? 26 : 20}
                        className={`transition-all duration-200 ${
                          isSelected
                            ? 'fill-teal-700 stroke-4 stroke-stone-900 dark:stroke-white shadow-xl'
                            : 'fill-stone-100 dark:fill-stone-800 stroke-2 stroke-stone-400 dark:stroke-stone-600 group-hover:stroke-teal-600'
                        }`}
                      />
                      <text
                        textAnchor="middle"
                        dy=".3em"
                        className={`font-mono text-[11px] font-bold pointer-events-none select-none ${
                          isSelected ? 'fill-white' : 'fill-stone-800 dark:fill-stone-200'
                        }`}
                      >
                        v{art.versionNumber}
                      </text>
                      <text
                        y={32}
                        textAnchor="middle"
                        className="font-sans text-[10px] font-semibold fill-stone-700 dark:fill-stone-300 pointer-events-none select-none"
                      >
                        {shortAuthor}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Panel Lateral: Inspección del Nodo Seleccionado */}
            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#161B22] flex flex-col justify-between space-y-4">
              {selectedArticle ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-teal-800 dark:text-teal-300 font-bold">{selectedArticle.area}</span>
                    <span className="text-stone-400">v{selectedArticle.versionNumber}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {selectedArticle.title}
                  </h3>

                  <div className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                    Autor: <strong>{selectedArticleAuthor?.realName}</strong>
                  </div>

                  <div className="p-3 rounded bg-white dark:bg-[#0D1117] border border-stone-200 dark:border-stone-800 text-xs font-mono space-y-1">
                    <div className="text-stone-500">Hash SHA-256:</div>
                    <div className="text-[10px] text-teal-800 dark:text-teal-400 break-all font-mono">
                      #{selectedArticle.contentHash}
                    </div>
                  </div>

                  {/* Conexiones entrantes y salientes */}
                  <div className="space-y-2 text-xs">
                    <span className="font-mono font-bold text-stone-700 dark:text-stone-300 block">
                      Conexiones de este nodo:
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-emerald-700 dark:text-emerald-400">
                        &larr; Recibe {inboundCitations.length} citas entrantes
                      </div>
                      <div className="text-stone-600 dark:text-stone-400">
                        &rarr; Formula {outboundCitations.length} citas salientes
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenArticle(selectedArticle.versionId)}
                    className="w-full py-2 px-4 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-mono text-xs font-bold hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer text-center mt-2"
                  >
                    Abrir en el Lector &rarr;
                  </button>
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">Selecciona un nodo del grafo para inspeccionar su estructura.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA DE PORTAFOLIOS VERIFICABLES DE AUTORES */
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
            <strong>Portafolios sin métricas de vanidad:</strong> En Chen no existen listas de seguidores, likes ni algoritmos de retención. Los perfiles son historiales científicos auditables donde cada tesis y cada cita está anclada a identidades verificadas (ORCID / GitHub) con integridad criptográfica.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author) => {
              const authorArticles = articles.filter((a) => a.authorId === author.id);
              const authorArticleIds = authorArticles.map((a) => a.versionId);
              const receivedCitations = citations.filter((c) => authorArticleIds.includes(c.targetVersionId));
              const madeCitations = citations.filter((c) => authorArticleIds.includes(c.sourceVersionId));

              const isInspecting = selectedAuthorId === author.id;

              return (
                <div
                  key={author.id}
                  className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] space-y-4 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                          {author.realName}
                        </span>
                        {author.isVerified && !author.isAnonymized && (
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-800 font-bold">
                            ✓ Verificado
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-stone-500">
                        @{author.handle}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                      {author.roleAndAffiliation}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-500">
                      {author.githubUser && !author.isAnonymized && (
                        <span>GitHub: @{author.githubUser}</span>
                      )}
                      {author.orcidId && !author.isAnonymized && (
                        <span>ORCID: {author.orcidId}</span>
                      )}
                      {author.isAnonymized && (
                        <span className="text-rose-600">PII anonimizada bajo RGPD Art. 17</span>
                      )}
                    </div>
                  </div>

                  {/* Resumen de actividad epistemológica */}
                  <div className="p-3 rounded bg-stone-50 dark:bg-[#0D1117] border border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="block text-base font-bold text-stone-900 dark:text-stone-100">
                        {authorArticles.length}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase">Tesis</span>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-teal-700 dark:text-teal-400">
                        {receivedCitations.length}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase">Citado por</span>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-stone-700 dark:text-stone-300">
                        {madeCitations.length}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase">Citas hechas</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setSelectedAuthorId(isInspecting ? null : author.id)}
                      className="w-full py-1.5 px-3 rounded border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-center"
                    >
                      {isInspecting ? 'Cerrar detalle de portafolio' : 'Inspeccionar publicaciones del autor &rarr;'}
                    </button>
                  </div>

                  {/* Detalle desplegable de publicaciones */}
                  {isInspecting && (
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                      <span className="font-mono font-bold text-stone-700 dark:text-stone-300 block">
                        Tesis de este autor:
                      </span>
                      {authorArticles.map((art) => (
                        <div
                          key={art.versionId}
                          onClick={() => onOpenArticle(art.versionId)}
                          className="p-2.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer transition-colors"
                        >
                          <div className="font-serif font-bold text-stone-900 dark:text-stone-100">
                            {art.title}
                          </div>
                          <div className="font-mono text-[10px] text-stone-500">
                            {art.area} · v{art.versionNumber}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
