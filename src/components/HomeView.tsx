import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GitBranch,
  HelpCircle,
  MessageSquare,
  PenSquare,
  Compass,
} from 'lucide-react';
import { Article, KnowledgeGap } from '../types';
import {
  EpistemicBadge,
  LevelIndicator,
  LicenseChip,
} from './SemanticBadges';

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
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Calm, Dignified Editorial Hero */}
      <section className="pt-4 pb-8 border-b border-[var(--border-subtle)] space-y-4">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--action-primary)] font-semibold">
            Red de Conocimiento Libre
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] text-balance">
            Conocimiento libre, debatido con argumentos y evidencia.
          </h1>
        </div>

        <p className="font-serif text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Sin muros de pago ni algoritmos de engagement. Artículos con citas semánticas verificables, integración limpia para NotebookLM y debate dialéctico.
        </p>

        {/* Action strip with quiet breathing room */}
        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
          <button
            onClick={onNavigateEditor}
            className="px-4 py-2 rounded-md font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Escribir artículo</span>
          </button>
          <button
            onClick={onNavigateForum}
            className="px-3.5 py-2 rounded-md font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            <span>Foro de debate</span>
          </button>
          <button
            onClick={onNavigateGaps}
            className="px-3.5 py-2 rounded-md font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
            <span>Huecos del saber ({gaps.length})</span>
          </button>
          {onNavigateBooks && (
            <button
              onClick={onNavigateBooks}
              className="px-3.5 py-2 rounded-md font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-[var(--action-primary)]" />
              <span>Libros libres</span>
            </button>
          )}
        </div>
      </section>

      {/* Area Segmented Controls */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedArea(a)}
              className={`px-3.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
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
          {filteredArticles.length} artículos publicados
        </span>
      </section>

      {/* Breatheable, Uncluttered Article Feed */}
      <section className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-tertiary)]">
            No se encontraron artículos con estos criterios.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="group cursor-pointer rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 sm:p-8 transition-all hover:border-[var(--border-strong)] hover:shadow-xs space-y-3.5"
            >
              {/* Top Unboxed Metadata Kicker with typographic dots */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <span className="font-semibold text-[var(--text-primary)]">{art.area}</span>
                <span aria-hidden="true">·</span>
                <LevelIndicator level={art.level} />
                <span aria-hidden="true">·</span>
                <EpistemicBadge status={art.epistemicStatus} />
                <span aria-hidden="true">·</span>
                <LicenseChip license={art.license} />
                <span aria-hidden="true">·</span>
                <span>{art.readTimeMinutes} min de lectura</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--action-primary)] transition-colors">
                  {art.title}
                </h2>
                <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              {/* Footer strip: author & citations */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">
                    {art.author.name}
                  </span>
                  <span>({art.author.role})</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[var(--action-primary)] flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>{art.citations.length} citas conectadas</span>
                  </span>
                  <span>{art.publishedDate}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};
