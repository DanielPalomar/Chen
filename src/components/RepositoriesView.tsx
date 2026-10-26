import React, { useState, useMemo } from 'react';
import {
  Globe,
  ExternalLink,
  Search,
  BookOpen,
  Library,
  Building2,
  Check,
  Copy,
  Info,
} from 'lucide-react';
import { OpenRepositoryItem } from '../types';
import { INITIAL_OPEN_REPOSITORIES } from '../data/initialData';
import { AppLanguage, t } from '../i18n/translations';

interface RepositoriesViewProps {
  language: AppLanguage;
  onNavigateBooks?: () => void;
}

export const RepositoriesView: React.FC<RepositoriesViewProps> = ({
  language,
  onNavigateBooks,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('todos');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const repositories = INITIAL_OPEN_REPOSITORIES;

  const languages = ['todos', 'Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Multilingüe'];
  const topics = ['todos', 'General', 'Ciencias', 'Humanidades', 'Matemáticas', 'Computación', 'Archivos Históricos'];

  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      if (selectedLanguage !== 'todos' && !repo.languages.includes(selectedLanguage as any)) {
        return false;
      }
      if (selectedTopic !== 'todos' && !repo.topics.includes(selectedTopic as any)) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(query);
        const matchesDesc = repo.description.toLowerCase().includes(query);
        const matchesInst = repo.institution.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesInst) {
          return false;
        }
      }
      return true;
    });
  }, [repositories, selectedLanguage, selectedTopic, searchTerm]);

  const handleCopyLink = (repo: OpenRepositoryItem) => {
    navigator.clipboard.writeText(repo.url);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
                Directorio Abierto
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                Fuentes y Repositorios Mundiales del Saber
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Directorio de Repositorios y Fuentes Abiertas
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Catálogo curado de plataformas de acceso abierto, archivos históricos, preprints y bibliotecas universitarias digitales en múltiples idiomas. Sin muros de pago, con enlaces directos verificados.
            </p>
          </div>

          {onNavigateBooks && (
            <button
              onClick={onNavigateBooks}
              className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--action-primary)] hover:border-[var(--action-primary)] transition-colors shrink-0"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Ver Libros Libres en Chen</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre de repositorio, institución o temática (ej. Cornell, BNE, preprints, Gallica)..."
            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-2 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:bg-[var(--bg-surface)] focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Filtrar por Idioma
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Todos los idiomas</option>
              {languages
                .filter((l) => l !== 'todos')
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Filtrar por Temática
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Todas las temáticas</option>
              {topics
                .filter((t) => t !== 'todos')
                .map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
          <span>
            Mostrando <strong>{filteredRepositories.length}</strong> de {repositories.length} repositorios de acceso abierto
          </span>
          {(selectedLanguage !== 'todos' || selectedTopic !== 'todos' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedLanguage('todos');
                setSelectedTopic('todos');
                setSearchTerm('');
              }}
              className="text-[var(--action-primary)] hover:underline text-xs"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRepositories.map((repo) => {
          const isCopied = copiedId === repo.id;
          return (
            <article
              key={repo.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--action-primary)]/50 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                {/* Header row: Topics & Languages */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {repo.topics.map((t) => (
                      <span
                        key={t}
                        className="bg-[var(--bg-subtle)] px-2 py-0.5 rounded font-medium text-[var(--text-primary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--action-primary)] font-medium">
                    {repo.licenseType}
                  </span>
                </div>

                {/* Name & Institution */}
                <div className="space-y-0.5">
                  <h2 className="font-serif text-base font-semibold text-[var(--text-primary)]">
                    {repo.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span>{repo.institution}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {repo.description}
                </p>

                {/* Languages list and highlight */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{repo.languages.join(', ')}</span>
                  </div>
                  <span>·</span>
                  <span className="font-mono text-[var(--text-primary)] font-medium">
                    {repo.highlightCount}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => handleCopyLink(repo)}
                  className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Enlace copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar enlace</span>
                    </>
                  )}
                </button>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] transition-colors"
                >
                  <span>Visitar repositorio</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
