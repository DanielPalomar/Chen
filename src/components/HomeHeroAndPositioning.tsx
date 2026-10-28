import React, { useState } from 'react';
import { Article, CitationRelation } from '../types';

interface HomeHeroAndPositioningProps {
  articles: Article[];
  onOpenArticle: (articleId: string) => void;
  onOpenEditor: (prefilledQuote?: {
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  }) => void;
}

export const HomeHeroAndPositioning: React.FC<HomeHeroAndPositioningProps> = ({
  articles,
  onOpenArticle,
  onOpenEditor,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | CitationRelation>('all');

  // Las 3 tarjetas de réplica canónicas para el demostrador de Elena Vasconcelos (Falsacionismo)
  const canonicalDemoCards = [
    {
      id: 'demo-card-supports',
      relation: 'supports' as const,
      relationLabel: '[ + Apoya ]',
      tag: 'Deducción Modus Tollens',
      relationColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100',
      badgeColor: 'text-emerald-800 dark:text-emerald-300 font-bold',
      borderLeft: 'border-l-4 border-l-emerald-600',
      author: 'Karl Popper (1934) — Logik der Forschung',
      articleId: 'art-falsacionismo-popper',
      versionHash: '#8f3a9c21',
      quote:
        '«La asimetría lógica entre verificabilidad y refutabilidad: las teorías nunca son verificables, solo corroboradas provisionalmente.»',
      reasoning:
        'Demostración formal deductiva del modus tollens como único mecanismo lógicamente válido para el progreso del conocimiento sin caer en el problema de la inducción.',
      actionLabel: 'Leer demostración popperiana',
    },
    {
      id: 'demo-card-contradicts',
      relation: 'contradicts' as const,
      relationLabel: '[ - Contradice ]',
      tag: 'Tesis Holista',
      relationColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100',
      badgeColor: 'text-rose-800 dark:text-rose-300 font-bold',
      borderLeft: 'border-l-4 border-l-rose-600',
      author: 'Pierre Duhem & W.V.O. Quine (1951)',
      articleId: 'art-duhem-quine-holismo',
      versionHash: '#5a2e88f0',
      quote:
        '«Una hipótesis nunca se somete a contraste de forma aislada; siempre se refuta un sistema entero de supuestos auxiliares.»',
      reasoning:
        'Objeción holista fundamental: si falla una predicción observable, la lógica deductiva solo indica que el conjunto entero de premisas contiene un error, sin poder señalar cuál es el supuesto individual falso.',
      actionLabel: 'Leer objeción holista completa',
    },
    {
      id: 'demo-card-extends',
      relation: 'extends' as const,
      relationLabel: '[ → Amplía ]',
      tag: 'Programas de Investigación',
      relationColor: 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-100',
      badgeColor: 'text-teal-800 dark:text-teal-300 font-bold',
      borderLeft: 'border-l-4 border-l-teal-600',
      author: 'Imre Lakatos (1970) — Falsification and the Methodology of Scientific Research Programmes',
      articleId: 'art-lakatos-programas',
      versionHash: '#7c4b19e2',
      quote:
        '«La ciencia no progresa por refutaciones aisladas, sino mediante programas de investigación con un núcleo firme protegido por un cinturón heurístico modificable.»',
      reasoning:
        'Extensión integradora: reconcilia la fuerza deductiva de Popper con la objeción de Duhem mediante el concepto de cinturón protector progresivo y heurística positiva.',
      actionLabel: 'Leer metodología de Lakatos',
    },
  ];

  const filteredCards =
    activeFilter === 'all'
      ? canonicalDemoCards
      : canonicalDemoCards.filter((card) => card.relation === activeFilter);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO EDITORIAL CON LLAMADAS A LA ACCIÓN (CTAs) */}
      <section
        aria-labelledby="hero-title"
        className="pt-10 sm:pt-14 pb-8 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <span>Chen v1.0 (MVP Nuclear)</span>
            <span className="text-stone-400">·</span>
            <span>Cero Rastreo · Cero Algoritmos · WCAG 2.1 AAA</span>
          </div>

          <h1
            id="hero-title"
            className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]"
          >
            Internet ha resuelto la distribución del texto, pero ha roto la conversación intelectual.
          </h1>

          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Chen es el protocolo de publicación técnica y ensayística donde cada texto se integra en una red de argumentación verificable. Sin algoritmos de indignación, sin anuncios, con citas bidireccionales inmutables.
          </p>

          {/* Dos CTAs Principales Obligatorios */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('explorador-articulos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium text-sm hover:bg-stone-800 dark:hover:bg-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-teal-600 cursor-pointer"
            >
              Explorar Artículos y Subrayar
            </button>

            <button
              onClick={() => onOpenEditor()}
              className="px-6 py-3 rounded-md bg-transparent text-teal-800 dark:text-teal-300 font-medium text-sm border border-teal-700/50 dark:border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all focus-visible:outline-2 focus-visible:outline-teal-600 cursor-pointer"
            >
              Publicar Nueva Tesis
            </button>
          </div>
        </div>
      </section>

      {/* 2. DEMOSTRADOR INTERACTIVO EN VIVO: ANATOMÍA DE UNA CITA CON FUNCIÓN */}
      <section
        id="anatomia-citas"
        aria-labelledby="demo-heading"
        className="max-w-4xl mx-auto bg-stone-50/90 dark:bg-[#13151A] rounded-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Demostrador Interactivo en Vivo
            </span>
            <h2 id="demo-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Anatomía de una Cita con Función Lógica
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-xs">
            Selecciona una postura argumental para comprobar en tiempo real cómo los textos se vinculan sin perder sentido.
          </p>
        </div>

        {/* Tesis de la Investigadora Fuente (Dra. Elena Vasconcelos) */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Artículo Fuente: Dra. Elena Vasconcelos (@evasconcelos-phil)
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] uppercase font-bold">
                [ Estado Epistémico: Hipótesis ]
              </span>
              <span className="font-mono text-[10px] text-stone-400">Hash: #8f3a9c21</span>
            </div>
          </div>
          <blockquote className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 italic border-l-4 border-teal-600 pl-4 py-1">
            «Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.»
          </blockquote>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onOpenArticle('art-falsacionismo-popper')}
              className="text-xs font-mono text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir artículo completo en el Lector</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Filtrado Interactivas Obligatorias */}
        <div className="flex flex-wrap items-center gap-2 pt-2" role="tablist" aria-label="Filtrar réplicas argumentativas">
          <button
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-950 font-bold shadow-xs'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            [ Todas (3) ]
          </button>

          <button
            role="tab"
            aria-selected={activeFilter === 'supports'}
            onClick={() => setActiveFilter('supports')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              activeFilter === 'supports'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            [ + Apoya (1) ]
          </button>

          <button
            role="tab"
            aria-selected={activeFilter === 'contradicts'}
            onClick={() => setActiveFilter('contradicts')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              activeFilter === 'contradicts'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800'
            }`}
          >
            [ - Contradice (1) ]
          </button>

          <button
            role="tab"
            aria-selected={activeFilter === 'extends'}
            onClick={() => setActiveFilter('extends')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
              activeFilter === 'extends'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-300 dark:border-teal-800'
            }`}
          >
            [ → Amplía (1) ]
          </button>
        </div>

        {/* Tarjetas de Réplica Conectadas y Clicables */}
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onOpenArticle(card.articleId)}
              className={`p-5 rounded-lg border transition-all cursor-pointer hover:shadow-md ${card.relationColor} ${card.borderLeft}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs uppercase tracking-wide ${card.badgeColor}`}>
                    {card.relationLabel}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-xs font-mono font-semibold text-stone-700 dark:text-stone-300">
                    {card.tag}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                  Versión: {card.versionHash}
                </span>
              </div>

              <blockquote className="font-serif italic text-sm sm:text-base text-stone-900 dark:text-stone-100 mt-2">
                {card.quote}
              </blockquote>

              <p className="font-sans text-xs sm:text-sm text-stone-800 dark:text-stone-200 mt-2.5 leading-relaxed">
                <strong>Justificación:</strong> {card.reasoning}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  {card.author}
                </span>
                <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 flex items-center gap-1">
                  <span>{card.actionLabel}</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORADOR DE ARTÍCULOS SEMINALES (FEED DEL PROTOCOLO) */}
      <section
        id="explorador-articulos"
        aria-labelledby="feed-heading"
        className="max-w-4xl mx-auto space-y-6 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Red Seminal de Conocimiento Abierto
            </span>
            <h2 id="feed-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Artículos y Tesis del Protocolo ({articles.length})
            </h2>
          </div>
          <p className="text-xs font-mono text-stone-500">
            Haz clic en cualquier artículo para abrir el Lector y probar el subrayado interactivo
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => {
            const epistemicBadge =
              article.epistemicStatus === 'fact'
                ? { label: '[ Hecho ]', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200' }
                : article.epistemicStatus === 'hypothesis'
                ? { label: '[ Hipótesis ]', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200' }
                : { label: '[ Opinión ]', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200' };

            return (
              <article
                key={article.id}
                className="group p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13151A] hover:border-teal-600/60 dark:hover:border-teal-500/60 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Fila de Metadatos */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase ${epistemicBadge.color}`}>
                        {epistemicBadge.label}
                      </span>
                      <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                        {article.currentVersionNumber} · #{article.currentVersionHash.substring(0, 8)}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      {article.publishedDate}
                    </span>
                  </div>

                  {/* Título y Subtítulo */}
                  <div>
                    <h3
                      onClick={() => onOpenArticle(article.id)}
                      className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 cursor-pointer transition-colors"
                    >
                      {article.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                      {article.subtitle}
                    </p>
                  </div>
                </div>

                {/* Pie de Tarjeta con Autor y Contador Bidireccional */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-200">
                      {article.author.name}
                    </span>
                    {!article.author.isErased && article.author.githubUser && (
                      <span className="font-mono text-[11px] text-stone-500">
                        @{article.author.githubUser}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      <span>Citado por {article.citedByInbound.length}</span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span>Cita a {article.citationsOutbound.length}</span>
                    </div>

                    <button
                      onClick={() => onOpenArticle(article.id)}
                      className="px-3.5 py-1.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Leer y Subrayar Citas &rarr;
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
