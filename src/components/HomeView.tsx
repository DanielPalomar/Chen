import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GitBranch,
  HelpCircle,
  PenSquare,
  ArrowRight,
  Feather,
  Sparkles,
} from 'lucide-react';
import { Article, KnowledgeGap } from '../types';

interface HomeViewProps {
  articles: Article[];
  gaps: KnowledgeGap[];
  searchQuery: string;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onNavigateGaps: () => void;
  onNavigateForum: () => void;
  onNavigateEditor: () => void;
  onNavigateStudyPath: () => void;
  onNavigateBooks?: () => void;
  ultraLightMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  gaps,
  searchQuery,
  onSelectArticle,
  onSelectAuthor,
  onNavigateGaps,
  onNavigateForum,
  onNavigateEditor,
  onNavigateStudyPath,
  onNavigateBooks,
  ultraLightMode = false,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const areas = [
    'all',
    'Filosofía y Epistemología',
    'Biología y Medicina',
    'Computación y Matemáticas',
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesArea = selectedArea === 'all' || art.area === selectedArea;
      return matchesSearch && matchesArea;
    });
  }, [articles, searchQuery, selectedArea]);

  return (
    <div className={`relative max-w-4xl mx-auto ${ultraLightMode ? 'space-y-6 py-2' : 'space-y-12 sm:space-y-16 py-4'}`}>
      {/* Ambient Visual Aura (Only rendered in Visual Mode, completely stripped in Ultra-Light) */}
      {!ultraLightMode && (
        <div className="visual-mesh-glow visual-only" aria-hidden="true" />
      )}

      {/* Mode Status Pill / Indicator */}
      {ultraLightMode ? (
        <div className="rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-2 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Feather className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Modo Ligero activo:</strong> visualización plana de máximo rendimiento y bajo consumo sin adornos gráficos.
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase shrink-0">
            Máxima velocidad
          </span>
        </div>
      ) : (
        <div className="relative z-10 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white/70 dark:bg-[#131221]/70 backdrop-blur-md px-4 py-2.5 text-xs text-indigo-950 dark:text-indigo-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 visual-glow-dot shrink-0" />
            <span>
              <strong>Modo Visual activo:</strong> experiencia inmersiva con animaciones fluidas, elevación 3D y atmósfera editorial.
            </span>
          </div>
          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider shrink-0">
            Diseño Inmersivo
          </span>
        </div>
      )}

      {/* Editorial Hero with Generous Breathing Room */}
      <section className={`relative z-10 border-b border-[var(--border-subtle)] ${ultraLightMode ? 'pb-6 space-y-3' : 'pt-2 pb-10 space-y-6'}`}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--action-primary)] font-semibold">
            {!ultraLightMode && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-teal)] visual-glow-dot shrink-0" />}
            <span>Red de Conocimiento Abierto</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--text-tertiary)] font-normal">Sin publicidad ni algoritmos</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.18] text-balance">
            Conocimiento libre, debatido con argumentos y evidencia.
          </h1>
        </div>

        <p className="font-serif text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Artículos rigurosos con citas semánticas verificables, integración limpia para NotebookLM y debate dialéctico sin métricas de vanidad.
        </p>

        {/* Clean, Focused Primary Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <button
            onClick={onNavigateEditor}
            className={`px-4 py-2.5 rounded-lg font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] flex items-center gap-2 ${
              ultraLightMode ? 'shadow-none transition-none' : 'shadow-sm interactive-lift transition-all'
            }`}
          >
            <PenSquare className="h-4 w-4" />
            <span>Escribir artículo</span>
          </button>

          {onNavigateBooks && (
            <button
              onClick={onNavigateBooks}
              className={`px-4 py-2.5 rounded-lg font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] flex items-center gap-2 ${
                ultraLightMode ? 'shadow-none transition-none' : 'interactive-lift transition-all shadow-xs'
              }`}
            >
              <BookOpen className="h-4 w-4 text-[var(--action-primary)]" />
              <span>Explorar libros libres</span>
            </button>
          )}

          <button
            onClick={onNavigateGaps}
            className="px-3.5 py-2.5 rounded-lg font-medium border border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            <span>Huecos del saber ({gaps.length})</span>
          </button>
        </div>
      </section>

      {/* Area Filtering with Clean Spacing */}
      <section className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedArea(a)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap text-xs ${
                ultraLightMode ? 'transition-none' : 'transition-all'
              } ${
                selectedArea === a
                  ? 'bg-[var(--action-primary)] text-white font-medium shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {a === 'all' ? 'Todas las áreas' : a}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-[var(--text-tertiary)] shrink-0">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'artículo' : 'artículos'}
        </span>
      </section>

      {/* Article Feed: Visibly Different in Modo Ligero (Flat Text Index) vs Modo Óptimo (Elevated Rounded Cards) */}
      <section className={`relative z-10 ${ultraLightMode ? 'divide-y divide-[var(--border-subtle)]' : 'space-y-8'}`}>
        {filteredArticles.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-tertiary)]">
            No se encontraron artículos con estos criterios.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className={
                ultraLightMode
                  ? 'group cursor-pointer py-5 space-y-2 hover:bg-[var(--bg-subtle)]/60 px-3 rounded transition-none'
                  : 'group cursor-pointer visual-card p-7 sm:p-9 space-y-4'
              }
            >
              {/* Quiet unboxed typographic kicker (Anti-slop zero pills) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <span className="font-semibold text-[var(--action-primary)]">{art.area}</span>
                <span aria-hidden="true">·</span>
                <span>{art.readTimeMinutes} min de lectura</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{art.epistemicStatus}</span>
                <span aria-hidden="true">·</span>
                <span>{art.publishedDate}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--action-primary)] transition-colors">
                  {art.title}
                </h2>
                <p className="font-serif text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              {/* Card Footer: clean author and citation count */}
              <div className={`flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-tertiary)] ${
                ultraLightMode ? 'pt-2' : 'pt-4 border-t border-[var(--border-subtle)]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">
                    {art.author.name}
                  </span>
                  <span className="hidden sm:inline">({art.author.role})</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[var(--action-primary)] flex items-center gap-1.5 font-medium">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>{art.citations.length} citas conectadas</span>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[var(--action-primary)] font-medium">
                    <span>Leer</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};
