import React, { useState, useMemo } from 'react';
import {
  Compass,
  Cpu,
  Pi,
  Atom,
  Dna,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { KnowledgeArea, Article, KnowledgeGap } from '../types';
import { INITIAL_AREAS } from '../data/initialData';
import { AppLanguage, t } from '../i18n/translations';

interface AreasViewProps {
  language: AppLanguage;
  articles: Article[];
  gaps: KnowledgeGap[];
  selectedAreaId: string | null;
  onSelectArea: (areaId: string | null) => void;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onNavigateGapDetail: (gapId: string) => void;
}

export const AreasView: React.FC<AreasViewProps> = ({
  language,
  articles,
  gaps,
  selectedAreaId,
  onSelectArea,
  onSelectArticle,
  onSelectAuthor,
  onNavigateGapDetail,
}) => {
  const [sortOrder, setSortOrder] = useState<'date' | 'relevance'>('date');

  const selectedArea = useMemo(() => {
    if (!selectedAreaId) return null;
    return INITIAL_AREAS.find((a) => a.id === selectedAreaId) || null;
  }, [selectedAreaId]);

  const areaArticles = useMemo(() => {
    if (!selectedArea) return [];
    const list = articles.filter((a) => a.areaId === selectedArea.id || a.area === selectedArea.name);
    if (sortOrder === 'date') {
      return [...list].reverse();
    }
    // Sort by neutral citations received
    return [...list].sort((a, b) => (b.citedByCount || 0) - (a.citedByCount || 0));
  }, [articles, selectedArea, sortOrder]);

  const areaGaps = useMemo(() => {
    if (!selectedArea) return [];
    return gaps.filter((g) => g.areaId === selectedArea.id || g.area === selectedArea.name);
  }, [gaps, selectedArea]);

  const getAreaIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Cpu':
        return <Cpu className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Pi':
        return <Pi className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'Atom':
        return <Atom className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Dna':
        return <Dna className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
      case 'Users':
        return <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'BookOpen':
      default:
        return <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  // If a specific area is selected: Area Detail Page
  if (selectedArea) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs border-b border-[var(--border-subtle)] pb-3">
          <button
            onClick={() => onSelectArea(null)}
            className="text-[var(--action-primary)] hover:underline flex items-center gap-1 font-medium"
          >
            ← Volver a todas las áreas
          </button>
          <span className="text-[var(--text-tertiary)] font-mono text-[11px]">
            Área de conocimiento verificada
          </span>
        </div>

        {/* Area Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
              {getAreaIcon(selectedArea.iconName)}
            </div>
            <div className="space-y-1.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                {selectedArea.name}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {selectedArea.description}
              </p>
            </div>
          </div>

          {/* Area Moderators list */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Moderadores responsables del área (Gobernanza compartida)</span>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Cada área de Chen se abre únicamente con al menos dos moderadores. No tienen votos de popularidad; velan por la calidad de las citas y la corrección de etiquetas epistémicas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {selectedArea.moderators.map((mod) => (
                <div
                  key={mod.name}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block">
                      {mod.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {mod.role}
                    </span>
                  </div>
                  {mod.githubUser && (
                    <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>GitHub verificado</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content list & sort controls (date or relevance only, NO likes!) */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--action-primary)]" />
              <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                Artículos publicados en esta área ({areaArticles.length})
              </h2>
            </div>

            {/* Strict sort selector: ONLY date or neutral relevance */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-tertiary)]">Ordenar por:</span>
              <div className="inline-flex rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5">
                <button
                  onClick={() => setSortOrder('date')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    sortOrder === 'date'
                      ? 'bg-[var(--action-primary)] text-white font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Fecha cronológica
                </button>
                <button
                  onClick={() => setSortOrder('relevance')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    sortOrder === 'relevance'
                      ? 'bg-[var(--action-primary)] text-white font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Citas recibidas (neutral)
                </button>
              </div>
            </div>
          </div>

          {areaArticles.length === 0 ? (
            <div className="p-8 text-center rounded border border-dashed border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
              No hay artículos publicados en esta área todavía. Sé el primero en contribuir un texto con licencia abierta.
            </div>
          ) : (
            <div className="space-y-4">
              {areaArticles.map((art) => (
                <article
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 cursor-pointer hover:border-[var(--action-primary)] transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
                    <span className="font-mono">{art.publishedDate}</span>
                    <span className="font-mono text-[10px] bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                      {art.license}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] hover:text-[var(--action-primary)]">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {art.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">
                      Por {art.author.name}
                    </span>
                    <span className="text-[var(--text-tertiary)] text-[11px]">
                      {art.citedByCount || 0} citas recibidas
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Open Knowledge Gaps in this Area */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-600" />
            <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Huecos del saber abiertos en {selectedArea.name} ({areaGaps.length})
            </h2>
          </div>

          {areaGaps.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)]">
              No hay preguntas abiertas pendientes en esta área.
            </p>
          ) : (
            <div className="space-y-3">
              {areaGaps.map((gap) => (
                <div
                  key={gap.id}
                  onClick={() => onNavigateGapDetail(gap.id)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2 cursor-pointer hover:border-amber-500/50 transition-colors"
                >
                  <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                    {gap.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {gap.whatIReadFirst}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-1">
                    <span>Iniciado por {gap.authorName}</span>
                    <span>{gap.answers.length} respuestas fundamentadas</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Areas Taxonomy Grid View
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
            Taxonomía del Saber
          </span>
          <span className="text-[var(--text-tertiary)]">·</span>
          <span className="text-xs text-[var(--text-tertiary)]">Gobernanza compartida con moderadores</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Áreas de Conocimiento
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Chen organiza el contenido en áreas temáticas estrictas con moderadores transparentes. Cada área incluye sus artículos verificados, preguntas de frontera e historial público.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_AREAS.map((area) => (
          <div
            key={area.id}
            onClick={() => onSelectArea(area.id)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--action-primary)] transition-all cursor-pointer shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] group-hover:bg-[var(--bg-subtle-lilac)] transition-colors">
                  {getAreaIcon(area.iconName)}
                </div>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  {area.moderators.length} moderadores
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors">
                  {area.name}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {area.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
                <span>{area.articleCount} artículos</span>
                <span>·</span>
                <span>{area.gapCount} huecos</span>
              </div>
              <span className="text-[var(--action-primary)] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Explorar</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
