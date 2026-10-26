import React from 'react';
import {
  ShieldCheck,
  Link as LinkIcon,
  GitBranch,
  RotateCcw,
  BookOpen,
  Award,
  ExternalLink,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { Author, Article } from '../types';
import { VerificationBadge, EpistemicBadge } from './SemanticBadges';

interface AuthorProfileViewProps {
  author: Author;
  authorArticles: Article[];
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
  onNavigateArea?: (areaName: string) => void;
}

export const AuthorProfileView: React.FC<AuthorProfileViewProps> = ({
  author,
  authorArticles,
  onBack,
  onSelectArticle,
  onNavigateArea,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver a la vista anterior</span>
      </button>

      {/* Author Header Card */}
      <header className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-subtle-lilac)] font-serif text-2xl font-bold text-[var(--action-primary)] shrink-0 shadow-xs">
              {author.name[0]}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {author.name}
                </h1>
                {author.githubUser && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Identidad Verificada</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                {author.role}
              </p>
              <p className="font-serif text-xs sm:text-sm text-[var(--text-secondary)] pt-1 max-w-xl leading-relaxed">
                {author.bio}
              </p>

              {/* Area tags */}
              {author.areas && author.areas.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[11px] text-[var(--text-tertiary)]">Áreas de aporte:</span>
                  {author.areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => onNavigateArea && onNavigateArea(area)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--action-primary)] border border-[var(--border-subtle)] transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* External links: Verified vs Not verified */}
          <div className="flex flex-wrap sm:flex-col items-start gap-2 text-xs shrink-0 pt-1">
            {author.githubUser && (
              <a
                href={`https://github.com/${author.githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={true} label={`GitHub: @${author.githubUser}`} />
              </a>
            )}

            {author.orcidId && (
              <a
                href={`https://orcid.org/${author.orcidId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={true} label={`ORCID: ${author.orcidId}`} />
              </a>
            )}

            {author.linkedinUrl && (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={false} label="LinkedIn (no verificado)" />
              </a>
            )}

            {author.personalUrl && (
              <a
                href={author.personalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={false} label="Web personal (no verificado)" />
              </a>
            )}

            {author.kofiOrLiberapay && (
              <div className="pt-1 space-y-1">
                <a
                  href={author.kofiOrLiberapay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--action-primary)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded text-xs transition-colors"
                  title="Apoyo voluntario sin intermediación ni comisiones de Chen"
                >
                  <span>Apoyar al autor (directo)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="block text-[10px] text-[var(--text-tertiary)] max-w-[180px] leading-tight">
                  Chen no cobra comisión ni este apoyo altera la reputación.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verifiable Portfolio Metrics (No popularity, No followers, No rankings!) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--border-subtle)] pt-4 text-xs">
          <div className="space-y-1">
            <span className="text-[var(--text-tertiary)] block">Citas recibidas:</span>
            <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <GitBranch className="h-4 w-4 text-[var(--action-primary)]" />
              <span>{author.citationsReceivedCount}</span>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">En artículos de la red</span>
          </div>

          <div className="space-y-1">
            <span className="text-[var(--text-tertiary)] block">Insignia Chen:</span>
            <div className="font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <RotateCcw className="h-4 w-4" />
              <span>{author.changedMindCount}</span>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">«Cambié de opinión»</span>
          </div>

          <div className="space-y-1">
            <span className="text-[var(--text-tertiary)] block">Aportes públicos:</span>
            <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-[var(--text-secondary)]" />
              <span>{authorArticles.length}</span>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Bajo licencias libres</span>
          </div>

          <div className="space-y-1">
            <span className="text-[var(--text-tertiary)] block">Rutas completadas:</span>
            <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Award className="h-4 w-4 text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]" />
              <span>{author.learningPathsCompleted}</span>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Open Badges 3.0</span>
          </div>
        </div>

        {/* Breakdown of Reputation by Area */}
        {author.reputationByArea && Object.keys(author.reputationByArea).length > 0 && (
          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)]">
                Reputación desglosada por área de conocimiento
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                No transferible entre áreas
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              En Chen la credibilidad no es un número global ni un concurso de popularidad. Se gana aportando revisiones razonadas y citas verificadas en cada disciplina específica.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {Object.entries(author.reputationByArea).map(([area, points]) => (
                <div
                  key={area}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[var(--text-primary)]">{area}</span>
                  <span className="font-mono font-semibold text-[var(--action-primary)]">
                    {points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive Epistemic Culture Banner */}
        <div className="rounded border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 flex items-start gap-2.5 text-xs">
          <RotateCcw className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-emerald-900 dark:text-emerald-300">
            <span className="font-semibold block">
              Insignia «Cambié de opinión» ({author.changedMindCount})
            </span>
            <p className="text-[11px] leading-relaxed">
              En Chen rectificar una conclusión o hipótesis ante evidencia contraria sólida no se castiga: es una virtud que suma respeto y credibilidad epistémica comprobada.
            </p>
          </div>
        </div>
      </header>

      {/* Contributions Timeline */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center justify-between">
          <span>Aportes y artículos publicados ({authorArticles.length})</span>
          <span className="text-xs font-normal text-[var(--text-tertiary)]">
            Sin algoritmos de ranking · Licencias abiertas
          </span>
        </h2>

        <div className="space-y-3">
          {authorArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2 hover:border-[var(--border-strong)] transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-secondary)]">{art.area}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.publishedDate}</span>
                </div>
                <EpistemicBadge status={art.epistemicStatus} />
              </div>

              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] leading-snug hover:text-[var(--action-primary)]">
                {art.title}
              </h3>

              <p className="font-serif text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
                <span className="font-mono text-[11px]">{art.license}</span>
                <span className="font-mono text-[var(--action-primary)] text-[11px]">
                  {art.citations.length} citas conectadas
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
