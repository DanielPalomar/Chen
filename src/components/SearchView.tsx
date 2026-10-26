import React, { useState, useMemo } from 'react';
import {
  Search as SearchIcon,
  Filter,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  BookOpen,
} from 'lucide-react';
import { Article, OpenLicense, ContentLevel, EpistemicStatus } from '../types';
import { INITIAL_AREAS } from '../data/initialData';
import { AppLanguage, t } from '../i18n/translations';

interface SearchViewProps {
  language: AppLanguage;
  articles: Article[];
  initialQuery?: string;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onBack: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  language,
  articles,
  initialQuery = '',
  onSelectArticle,
  onSelectAuthor,
  onBack,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState<string>('todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('todos');
  const [selectedLicense, setSelectedLicense] = useState<string>('todos');
  const [selectedEpistemic, setSelectedEpistemic] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');

  const filteredResults = useMemo(() => {
    return articles.filter((art) => {
      // Area filter
      if (selectedArea !== 'todos' && art.area !== selectedArea && art.areaId !== selectedArea) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'todos' && art.level !== selectedLevel) {
        return false;
      }
      // License filter
      if (selectedLicense !== 'todos' && art.license !== selectedLicense) {
        return false;
      }
      // Epistemic label filter
      if (selectedEpistemic !== 'todos' && art.epistemicStatus !== selectedEpistemic) {
        return false;
      }
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inSubtitle = art.subtitle.toLowerCase().includes(q);
        const inAuthor = art.author.name.toLowerCase().includes(q);
        const inContent = art.contentMarkdown.toLowerCase().includes(q);
        const inArea = art.area.toLowerCase().includes(q);
        if (!inTitle && !inSubtitle && !inAuthor && !inContent && !inArea) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      }
      // Neutral relevance: matches in title/subtitle priority, then neutral citations count
      const q = query.toLowerCase();
      const aTitleMatch = a.title.toLowerCase().includes(q) ? 2 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(q) ? 2 : 0;
      return (bTitleMatch + (b.citedByCount || 0)) - (aTitleMatch + (a.citedByCount || 0));
    });
  }, [articles, query, selectedArea, selectedLevel, selectedLicense, selectedEpistemic, sortBy]);

  const hasActiveFilters =
    selectedArea !== 'todos' ||
    selectedLevel !== 'todos' ||
    selectedLicense !== 'todos' ||
    selectedEpistemic !== 'todos' ||
    query.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="space-y-3 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={onBack}
            className="text-[var(--action-primary)] hover:underline flex items-center gap-1 font-medium"
          >
            ← Volver
          </button>
          <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
            Sin algoritmos de engagement ni likes
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
          Búsqueda de Conocimiento Verificado
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Búsqueda rigurosa de artículos, fórmulas, apuntes y citas ordenados exclusivamente por relevancia conceptual o fecha cronológica.
        </p>
      </div>

      {/* Main Search Bar & Multi-filters */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xs">
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por concepto, fórmula matemática, autor o cita..."
            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:bg-[var(--bg-surface)] focus:outline-none transition-colors"
          />
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          {/* Area */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
              Área
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="todos">Todas las áreas</option>
              {INITIAL_AREAS.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nivel */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
              Nivel
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="todos">Todos los niveles</option>
              <option value="intro">Introductorio (1)</option>
              <option value="intermediate">Intermedio (2)</option>
              <option value="advanced">Avanzado (3)</option>
            </select>
          </div>

          {/* Licencia */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
              Licencia libre
            </label>
            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="todos">Todas las licencias</option>
              <option value="CC BY 4.0">CC BY 4.0</option>
              <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
              <option value="CC0 1.0">CC0 (Dominio Público)</option>
            </select>
          </div>

          {/* Estado epistémico */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
              Etiqueta
            </label>
            <select
              value={selectedEpistemic}
              onChange={(e) => setSelectedEpistemic(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="todos">Cualquier estado</option>
              <option value="fact">Hecho comprobado</option>
              <option value="hypothesis">Hipótesis falsable</option>
              <option value="opinion">Opinión analítica</option>
              <option value="ai-generated">Declarado con IA</option>
            </select>
          </div>
        </div>

        {/* Sorting options */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-tertiary)]">Criterio de orden:</span>
            <button
              onClick={() => setSortBy('relevance')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'relevance'
                  ? 'bg-[var(--action-primary)] text-white font-medium'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Relevancia conceptual
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'date'
                  ? 'bg-[var(--action-primary)] text-white font-medium'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Fecha cronológica
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedArea('todos');
                setSelectedLevel('todos');
                setSelectedLicense('todos');
                setSelectedEpistemic('todos');
              }}
              className="text-[var(--action-primary)] hover:underline text-xs"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="text-xs text-[var(--text-tertiary)] flex items-center justify-between">
          <span>{filteredResults.length} resultados encontrados</span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
            <BookOpen className="h-7 w-7 mx-auto text-[var(--text-tertiary)]" />
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              No se encontraron coincidencias exactas
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] max-w-sm mx-auto">
              Intenta utilizar términos más amplios o desactiva filtros de nivel o estado epistémico.
            </p>
          </div>
        ) : (
          filteredResults.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 cursor-pointer hover:border-[var(--action-primary)] transition-colors shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded">
                    {art.area}
                  </span>
                  <span className="text-[var(--text-tertiary)]">·</span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                    Nivel: {art.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-tertiary)]">
                  <span>{art.license}</span>
                  <span>·</span>
                  <span>{art.publishedDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-base font-semibold text-[var(--text-primary)] hover:text-[var(--action-primary)]">
                  {art.title}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {art.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
                <span className="text-[var(--text-secondary)] font-medium">
                  {art.author.name}
                </span>
                <span className="font-mono text-[11px]">
                  {art.citedByCount || 0} citas recibidas (hecho neutro)
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
