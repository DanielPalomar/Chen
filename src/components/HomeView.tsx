import React, { useState } from 'react';
import { ArticleVersion, Author, Citation, EpistemicStatus, CitationRelation } from '../types/chen';
import { ActiveView } from './Navbar';

interface HomeViewProps {
  articles: ArticleVersion[];
  authors: Author[];
  citations: Citation[];
  onNavigate: (view: ActiveView, articleId?: string) => void;
  onOpenArticle: (articleId: string) => void;
  onOpenEditorForCitation: (quoteData: {
    targetVersionId: string;
    targetArticleTitle: string;
    targetAuthorName: string;
    targetVersionHash: string;
    quotedSnippet: string;
    initialRelation?: CitationRelation;
  }) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  authors,
  citations,
  onNavigate,
  onOpenArticle,
  onOpenEditorForCitation,
  searchQuery,
  onSearchChange,
}) => {
  const [demoFilter, setDemoFilter] = useState<'all' | CitationRelation>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Tarjetas del demostrador de la tesis de Elena Vasconcelos (ver-vasconcelos-v1)
  const demoCards = [
    {
      id: 'demo-popper',
      relation: 'supports' as const,
      relationBadge: '[ + Apoya ]',
      tag: 'Deducción Modus Tollens',
      authorName: 'Karl Popper (1934)',
      articleId: 'ver-popper-v1',
      versionHash: '1934popper8f3a9c',
      cardClass: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 border-l-4 border-l-emerald-600',
      badgeClass: 'text-emerald-800 dark:text-emerald-300 font-mono font-bold',
      quote:
        '«La asimetría lógica entre verificabilidad y refutabilidad: las teorías nunca son verificables, solo corroboradas provisionalmente.»',
      reasoning:
        'Demuestra formalmente mediante lógica de primer orden (modus tollens) que la refutación de un enunciado universal a partir de un enunciado existencial singular es deductivamente estricta.',
    },
    {
      id: 'demo-duhem',
      relation: 'contradicts' as const,
      relationBadge: '[ - Contradice ]',
      tag: 'Tesis Holista de Duhem-Quine',
      authorName: 'Dr. Héctor Salgado (Holismo)',
      articleId: 'ver-duhem-quine-v1',
      versionHash: '5a2e88f0bc210087',
      cardClass: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 border-l-4 border-l-rose-600',
      badgeClass: 'text-rose-800 dark:text-rose-300 font-mono font-bold',
      quote:
        '«Una hipótesis nunca se somete a contraste de forma aislada; siempre se refuta un sistema entero de supuestos auxiliares.»',
      reasoning:
        'Refuta la existencia de experimentos cruciales aislados: ante una anomalía empírica, siempre es posible reajustar hipótesis auxiliares del cinturón instrumental sin descartar la tesis principal.',
    },
    {
      id: 'demo-lakatos',
      relation: 'extends' as const,
      relationBadge: '[ → Amplía ]',
      tag: 'Programas de Investigación',
      authorName: 'Dra. Clara Méndez (Lakatos)',
      articleId: 'ver-lakatos-v1',
      versionHash: '7c4b19e290881bce',
      cardClass: 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 border-l-4 border-l-teal-600',
      badgeClass: 'text-teal-800 dark:text-teal-300 font-mono font-bold',
      quote:
        '«La ciencia no progresa por refutaciones aisladas, sino mediante programas de investigación con un núcleo firme protegido por un cinturón heurístico modificable.»',
      reasoning:
        'Amplía el falsacionismo ingenuo hacia una estructura dinámica donde las teorías tienen un núcleo firme convencionalmente irrefutable rodeado de un cinturón protector de hipótesis auxiliares.',
    },
  ];

  const filteredDemoCards =
    demoFilter === 'all'
      ? demoCards
      : demoCards.filter((c) => c.relation === demoFilter);

  // Filtrado de la lista de artículos
  const filteredArticles = articles.filter((art) => {
    const matchesArea = selectedArea === 'all' || art.area === selectedArea;
    const matchesStatus = selectedStatus === 'all' || art.epistemicStatus === selectedStatus;
    const author = authors.find((a) => a.id === art.authorId);
    const authorName = author ? author.realName : '';
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.subtitle.toLowerCase().includes(query) ||
      art.contentMarkdown.toLowerCase().includes(query) ||
      authorName.toLowerCase().includes(query);
    return matchesArea && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* 1. EDITORIAL HERO SECTION */}
      <section aria-labelledby="hero-title" className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
          <span>Protocolo de Publicación y Argumentación Abierta · v1.0 · Licencia AGPL / CC BY-SA 4.0</span>
        </div>

        <h1
          id="hero-title"
          className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]"
        >
          Conocimiento libre, articulado con argumentos y citas con función.
        </h1>

        <p className="font-sans text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
          Internet ha resuelto la distribución del texto, pero ha roto la conversación intelectual. En Chen las afirmaciones no compiten por aplausos ni algoritmos de indignación: cada tesis se integra en un grafo verificable mediante tres relaciones lógicas estrictas.
        </p>

        {/* 3 Actionable Hero CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('reader')}
            className="px-6 py-3 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:bg-stone-800 dark:hover:bg-white transition-all cursor-pointer"
          >
            Explorar Artículos y Subrayar ({articles.length})
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className="px-6 py-3 rounded-md bg-transparent text-teal-800 dark:text-teal-300 font-bold text-xs sm:text-sm border-2 border-teal-700/60 dark:border-teal-500/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all cursor-pointer"
          >
            Escribir Tesis o Réplica en Markdown
          </button>

          <button
            onClick={() => onNavigate('manifesto')}
            className="px-5 py-3 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer"
          >
            Probar Simulador RGPD e Inmutabilidad &rarr;
          </button>
        </div>
      </section>

      {/* 2. CAJA INTERACTIVA EN VIVO: ANATOMÍA DE UNA CITA CON FUNCIÓN EN 5 SEGUNDOS */}
      <section
        aria-labelledby="live-box-heading"
        className="max-w-5xl mx-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-[#12161D] p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
              Demostrador Práctico
            </span>
            <h2 id="live-box-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Anatomía de una Cita con Función en 5 Segundos
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-sans max-w-xs">
            Demostración viva de cómo se interconectan los textos seminales con garantía de inmutabilidad criptográfica.
          </p>
        </div>

        {/* Tesis de la Investigadora Fuente (Dra. Elena Vasconcelos) */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500 mb-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Artículo Fuente: Dra. Elena Vasconcelos (@elena-vasconcelos)
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-[10px] uppercase font-bold">
                [ Estado Epistémico: Hipótesis ]
              </span>
              <span className="font-mono text-[10px] text-stone-400">Hash: #8f3a9c21</span>
            </div>
          </div>
          <blockquote className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 italic border-l-4 border-teal-600 pl-4 py-1">
            «Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.»
          </blockquote>
        </div>

        {/* Barra de Filtro Interactivo */}
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          <button
            onClick={() => setDemoFilter('all')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              demoFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-950 font-bold shadow-xs'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
            }`}
          >
            [ Todas las conexiones (3) ]
          </button>
          <button
            onClick={() => setDemoFilter('supports')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              demoFilter === 'supports'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            [ + Apoya (1) ]
          </button>
          <button
            onClick={() => setDemoFilter('contradicts')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              demoFilter === 'contradicts'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}
          >
            [ - Contradice (1) ]
          </button>
          <button
            onClick={() => setDemoFilter('extends')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              demoFilter === 'extends'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
            }`}
          >
            [ → Amplía (1) ]
          </button>
        </div>

        {/* 3 Tarjetas en Grid Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDemoCards.map((card) => (
            <div
              key={card.id}
              className={`p-5 rounded-lg border flex flex-col justify-between space-y-3 transition-all ${card.cardClass}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 text-xs">
                  <span className={card.badgeClass}>{card.relationBadge}</span>
                  <span className="font-mono text-[10px] text-stone-500">#{card.versionHash.substring(0, 8)}</span>
                </div>
                <div className="text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-400">
                  {card.tag}
                </div>
                <blockquote className="font-serif italic text-xs text-stone-900 dark:text-stone-100">
                  {card.quote}
                </blockquote>
                <p className="font-sans text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  <strong>Justificación:</strong> {card.reasoning}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-2">
                <div className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
                  {card.authorName}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onOpenArticle(card.articleId)}
                    className="flex-1 py-1.5 px-2.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-[11px] font-mono font-medium hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Leer artículo completo &rarr;
                  </button>
                  <button
                    onClick={() =>
                      onOpenEditorForCitation({
                        targetVersionId: card.articleId,
                        targetArticleTitle: card.authorName,
                        targetAuthorName: card.authorName,
                        targetVersionHash: card.versionHash,
                        quotedSnippet: card.quote,
                        initialRelation: card.relation,
                      })
                    }
                    className="py-1.5 px-2.5 rounded border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-mono hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-center"
                  >
                    Citar o refutar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORADOR Y FEED DE ARTÍCULOS PUBLICADOS */}
      <section aria-labelledby="articles-heading" className="max-w-5xl mx-auto space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
              Índice General
            </span>
            <h2 id="articles-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Artículos y Tesis Indexadas ({filteredArticles.length})
            </h2>
          </div>

          {/* Filtros de Área y Estado Epistémico */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              aria-label="Filtrar por Área del Saber"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] text-stone-900 dark:text-stone-100 font-sans cursor-pointer"
            >
              <option value="all">Todas las Áreas</option>
              <option value="Epistemología">Epistemología</option>
              <option value="Filosofía de la Ciencia">Filosofía de la Ciencia</option>
              <option value="Sistemas Distribuidos">Sistemas Distribuidos</option>
            </select>

            <select
              aria-label="Filtrar por Estado Epistémico"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161B22] text-stone-900 dark:text-stone-100 font-sans cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="fact">[ Hecho ]</option>
              <option value="hypothesis">[ Hipótesis ]</option>
              <option value="opinion">[ Opinión ]</option>
            </select>
          </div>
        </div>

        {/* Lista de Artículos */}
        <div className="space-y-4">
          {filteredArticles.map((art) => {
            const author = authors.find((a) => a.id === art.authorId);
            const authorName = author ? author.realName : 'Autor Desconocido';
            const incoming = citations.filter((c) => c.targetVersionId === art.versionId);
            const supportsCount = incoming.filter((c) => c.relation === 'supports').length;
            const contradictsCount = incoming.filter((c) => c.relation === 'contradicts').length;
            const extendsCount = incoming.filter((c) => c.relation === 'extends').length;

            const epistemicBadge =
              art.epistemicStatus === 'fact'
                ? { label: '[ Hecho ]', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' }
                : art.epistemicStatus === 'hypothesis'
                ? { label: '[ Hipótesis ]', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' }
                : { label: '[ Opinión ]', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200' };

            return (
              <article
                key={art.versionId}
                className="group p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161B22] hover:border-teal-600/70 transition-all shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                        {art.area}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${epistemicBadge.color}`}>
                        {epistemicBadge.label}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-stone-400">
                      v{art.versionNumber} · #{art.contentHash.substring(0, 8)}
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenArticle(art.versionId)}
                    className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    {art.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 dark:text-stone-200">{authorName}</span>
                    {author?.githubUser && !author.isAnonymized && (
                      <span className="font-mono text-[11px] text-stone-500">@{author.githubUser}</span>
                    )}
                    <span className="text-stone-400">· {art.createdAt}</span>
                  </div>

                  {/* Contadores funcionales canónicos de citas */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" title="Citas que apoyan esta tesis">
                        +{supportsCount} apoya
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800" title="Citas que contradicen esta tesis">
                        -{contradictsCount} contradice
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800" title="Citas que amplían esta tesis">
                        &rarr;{extendsCount} amplía
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenArticle(art.versionId)}
                      className="px-3 py-1.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Leer tesis &rarr;
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
