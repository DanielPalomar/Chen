import React, { useState } from 'react';
import {
  ArrowLeft,
  GitBranch,
  Video,
  ExternalLink,
  ShieldAlert,
  Play,
  Copy,
  Check,
  BookmarkPlus,
  Quote,
  Sparkles,
  Download,
  History,
  Flag,
  FileDown,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Article, CitationRelation, ReportItem, InlineDiscussion, UserProfile } from '../types';
import {
  EpistemicBadge,
  LevelIndicator,
  LicenseChip,
  VerificationBadge,
  CitationFunctionBadge,
} from './SemanticBadges';
import { VideoPrivacyPlayer } from './VideoPrivacyPlayer';
import { ContentHistoryModal } from './ContentHistoryModal';
import { ReportModal } from './ReportModal';
import { InlineDiscussionRail } from './InlineDiscussionRail';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onAddFlashcard: (card: { topic: string; area: string; question: string; answer: string; articleId: string }) => void;
  onSubmitReport: (report: ReportItem) => void;
  currentUser: UserProfile | null;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  onSelectAuthor,
  onAddFlashcard,
  onSubmitReport,
  currentUser,
}) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [citeModalOpen, setCiteModalOpen] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Inline discussions state
  const [discussions, setDiscussions] = useState<InlineDiscussion[]>([
    {
      id: 'disc-1',
      articleId: article.id,
      version: article.versionNumber,
      selectedText: 'ningún número finito de cisnes blancos observados puede probar deductivamente que todos los cisnes son blancos',
      anchorParagraph: 1,
      comments: [
        {
          id: 'c-1',
          author: 'Andrés Keller',
          authorRole: 'Ingeniero de Software',
          isGithubVerified: true,
          date: '19 de Octubre, 2026',
          content: 'En computación esto equivale al aserto de Dijkstra: las pruebas pueden demostrar la presencia de errores, pero nunca su ausencia.',
        },
      ],
    },
  ]);
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  // Citations grouped by function
  const citationsSupports = article.citations.filter((c) => c.relation === 'supports');
  const citationsContradicts = article.citations.filter((c) => c.relation === 'contradicts');
  const citationsExtends = article.citations.filter((c) => c.relation === 'extends');

  // Cited By articles
  const citedByList = allArticles.filter((other) =>
    other.citations.some((c) => c.targetArticleTitle.toLowerCase().includes(article.title.toLowerCase()))
  );

  const handleCopyCitation = (format: 'apa' | 'markdown') => {
    let textToCopy = '';
    if (format === 'apa') {
      textToCopy = `${article.author.name} (${new Date(article.publishedDate).getFullYear() || 2026}). ${article.title}. Chen: Red de Conocimiento Libre (${article.license}).`;
    } else if (format === 'markdown') {
      textToCopy = `> "${article.excerpt}"\n— [${article.author.name}](${window.location.origin}/#${article.slug}) en Chen (${article.area}, ${article.license})`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // Conflict 3 Solved: Honest, local-only NotebookLM download with clear notice
  const handleDownloadNotebookLMFile = () => {
    const content = `# FUENTE ACADÉMICA CHEN: ${article.title}
Subtítulo: ${article.subtitle}
Autor: ${article.author.name} (${article.author.role})
Área temática: ${article.area}
Nivel: ${article.level}
Licencia de autor: ${article.license}
Estado epistémico: ${article.epistemicStatus}
Fecha de publicación: ${article.publishedDate} (Versión ${article.versionNumber})
Chen URL: ${window.location.href}

## Resumen ejecutivo
${article.excerpt}

## Contenido completo del artículo
${article.contentMarkdown}

## Citas y Evidencias
${article.citations.map((c) => `- [${c.relation.toUpperCase()}] ${c.targetArticleTitle} (${c.targetAuthor}): "${c.quoteText}" — ${c.explanation}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fuente-chen-${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedFormat('notebooklm');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleCreateFlashcard = () => {
    onAddFlashcard({
      articleId: article.id,
      area: article.area,
      topic: article.title,
      question: `¿Cuál es el argumento central en "${article.title}"?`,
      answer: article.excerpt,
    });
    setCardAdded(true);
    setTimeout(() => setCardAdded(false), 2500);
  };

  const handleAddInlineComment = (discId: string, text: string) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discId
          ? {
              ...d,
              comments: [
                ...d.comments,
                {
                  id: `comm-${Date.now()}`,
                  author: currentUser ? currentUser.name : 'Lector de Chen',
                  authorRole: currentUser ? currentUser.role : 'Comunidad',
                  isGithubVerified: currentUser?.githubVerified,
                  date: 'Ahora',
                  content: text,
                },
              ],
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Top back navigation and easy action strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al explorador</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Citar Fácil Button */}
          <button
            onClick={() => setCiteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-100/60 transition-colors shadow-xs"
          >
            <Quote className="h-3.5 w-3.5" />
            <span>Citar o exportar</span>
          </button>

          {/* Historial Button */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <History className="h-3.5 w-3.5" />
            <span>Historial v{article.versionNumber}</span>
          </button>

          {/* Guardar en práctica */}
          <button
            onClick={handleCreateFlashcard}
            disabled={cardAdded}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {cardAdded ? (
              <>
                <Check className="h-3.5 w-3.5 text-teal-600" />
                <span className="text-teal-600">Guardado en práctica</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="h-3.5 w-3.5" />
                <span>Guardar en cuaderno</span>
              </>
            )}
          </button>

          {/* Report Button */}
          <button
            onClick={() => setReportOpen(true)}
            className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-rose-600"
            title="Reportar anomalía a los moderadores de área"
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Reading Layout with Table of Contents and Margin Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Index & Prerequisites */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5 text-xs text-[var(--text-secondary)]">
          <div className="border-b border-[var(--border-subtle)] pb-2 font-serif font-semibold text-[var(--text-primary)]">
            Índice del artículo
          </div>
          <nav className="space-y-2">
            <a href="#sec-1" className="block hover:text-[var(--action-primary)]">
              1. Asimetría deductiva fundamental
            </a>
            <a href="#sec-2" className="block hover:text-[var(--action-primary)]">
              2. Demarcación frente a modelos probabilísticos
            </a>
            <a href="#sec-3" className="block hover:text-[var(--action-primary)]">
              3. Condiciones exigidas para un aporte riguroso
            </a>
            {article.videoEmbed && (
              <a href="#video-sec" className="block hover:text-[var(--action-primary)] pt-1">
                Vídeo explicativo
              </a>
            )}
            <a href="#citations-sec" className="block hover:text-[var(--action-primary)] pt-1">
              Citas y red de evidencias ({article.citations.length})
            </a>
          </nav>

          {/* Prerequisites (Section 1.4: "You should know before") */}
          {article.prerequisites && article.prerequisites.length > 0 && (
            <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-1.5 text-[11px]">
              <span className="font-semibold text-[var(--text-primary)] block">
                Conviene saber antes:
              </span>
              <ul className="space-y-1 text-[var(--text-secondary)]">
                {article.prerequisites.map((p) => (
                  <li key={p.id} className="hover:text-[var(--action-primary)]">
                    • {p.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Honest NotebookLM Connection Box */}
          <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--action-primary)]" />
              <span>Google NotebookLM</span>
            </div>
            <p className="text-[var(--text-tertiary)] leading-tight">
              Descarga este artículo como fuente limpia en Markdown para cargarla en tu cuaderno personal.
            </p>
            <button
              onClick={handleDownloadNotebookLMFile}
              className="w-full py-1.5 px-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--action-primary)] font-medium hover:border-[var(--action-primary)] flex items-center justify-center gap-1"
            >
              <Download className="h-3 w-3" />
              <span>Descargar .MD para NotebookLM</span>
            </button>
          </div>
        </aside>

        {/* Center: 700px Editorial Column */}
        <main className="lg:col-span-6 reading-column space-y-8">
          {/* Header */}
          <header className="space-y-4 border-b border-[var(--border-subtle)] pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <span className="font-medium text-[var(--text-secondary)]">{article.area}</span>
              <span aria-hidden="true">·</span>
              <LevelIndicator level={article.level} />
              <span aria-hidden="true">·</span>
              <EpistemicBadge status={article.epistemicStatus} />
              <span aria-hidden="true">·</span>
              <LicenseChip license={article.license} />
              <span aria-hidden="true">·</span>
              <span>{article.readTimeMinutes} min de lectura</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2]">
              {article.title}
            </h1>

            <p className="font-serif text-lg text-[var(--text-secondary)] leading-relaxed">
              {article.subtitle}
            </p>

            {/* Visible positive correction notice (Section 1.7) */}
            {article.corrections && article.corrections.length > 0 && (
              <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold">
                      Rectificado el {article.corrections[0].date}:
                    </strong>
                    <button
                      onClick={() => setHistoryOpen(true)}
                      className="text-[11px] underline text-emerald-700 dark:text-emerald-300"
                    >
                      Ver comparativa en historial
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {article.corrections[0].detail}
                  </p>
                </div>
              </div>
            )}

            {/* Byline */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onSelectAuthor(article.author.id)}
                  className="flex items-center gap-2 hover:underline text-left"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-subtle-lilac)] font-semibold text-[var(--action-primary)] text-xs">
                    {article.author.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {article.author.name}
                    </span>
                    <span className="block text-[11px] text-[var(--text-tertiary)]">
                      {article.author.role}
                    </span>
                  </div>
                </button>

                {article.author.githubUser && (
                  <VerificationBadge verified={true} label={`@${article.author.githubUser}`} />
                )}
              </div>

              <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
                Actualizado: {article.lastUpdatedDate} · v{article.versionNumber}
              </div>
            </div>
          </header>

          {/* Epistemic declaration box */}
          <div className="p-3.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
            <span className="font-mono text-[10px] font-bold text-[var(--action-primary)] uppercase tracking-wider block">
              Declaración Epistémica del Autor:
            </span>
            <p className="leading-relaxed">{article.epistemicNote}</p>
          </div>

          {/* Article Body */}
          <article className="prose-reading">
            <section id="sec-1">
              <h2>1. La asimetría deductiva fundamental</h2>
              <p>
                En <em>Logik der Forschung</em> (1934), Karl Popper postuló que la ciencia no progresa acumulando instancias favorables a una conjetura, sino diseñando experimentos concebidos específicamente para intentar derribarla.
                La estructura lógica subyacente es el{' '}
                <mark
                  onClick={() => setActiveDiscussionId('disc-1')}
                  className="cursor-pointer bg-indigo-100 dark:bg-indigo-950/60 text-inherit px-1 rounded hover:ring-2 hover:ring-[var(--action-primary)] transition-all"
                  title="Clic para ver objeciones en debate anclado"
                >
                  modus tollens
                </mark>
                :
              </p>

              <div className="math-block">
                $$\frac{'{'}T \to P, \quad \neg P{'}'}{'{\neg T}'}$$
              </div>

              <p>
                Donde $T$ es la teoría formulada y $P$ es una predicción observable arriesgada. Si la observación arroja $\neg P$, la teoría queda deductivamente refutada. Por el contrario, verificar $P$ únicamente nos dice que la teoría ha salido provisionalmente indemne, pero no garantiza su verdad definitiva.
              </p>
            </section>

            <section id="sec-2">
              <h2>2. Demarcación frente a modelos probabilísticos</h2>
              <p>
                En la actualidad observamos con frecuencia una confusión recurrente entre capacidad predictiva correlacional y valor epistémico explicativo. Cuando un modelo minimiza una función de coste empírica:
              </p>

              <div className="math-block">
                $$\mathcal{'{'}L{'}'}(\theta) = -\frac{'{'}1{'}'}{'{'}N{'}'}\sum_{'{'}i=1{'}'}^N \log P_\theta(y_i \mid x_i)$$
              </div>

              <p>
                Dicho procedimiento no formula hipótesis falsables en sentido estricto. Si una predicción fracasa, no se deduce la falsedad de una premisa ontológica; simplemente se recalculan gradientes o se clasifica la discrepancia como varianza estocástica.
              </p>
            </section>

            <section id="sec-3">
              <h2>3. Condiciones exigidas para un aporte riguroso</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li>
                  <strong>Condición de falsabilidad explícita:</strong> Toda tesis debe declarar con claridad qué hallazgo experimental invalidaría su planteamiento.
                </li>
                <li>
                  <strong>Citas conectadas con función declarada:</strong> No se admiten referencias decorativas; quien cita debe clasificar si la fuente apoya, contradice o amplía el argumento.
                </li>
                <li>
                  <strong>Rectificación pública transparente:</strong> Cuando una evidencia refuta un pasaje, el autor registra una corrección positiva visible en el historial.
                </li>
              </ol>
            </section>
          </article>

          {/* Video Section (Section 1.14: VideoPrivacyPlayer) */}
          {article.videoEmbed && (
            <section id="video-sec" className="space-y-3 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-[var(--action-primary)]" />
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Vídeo explicativo asociado
                </h3>
              </div>
              <VideoPrivacyPlayer
                video={article.videoEmbed}
                articleTitle={article.title}
              />
            </section>
          )}

          {/* Citations Panel (Section 1.8: Grouped by Supports / Contradicts / Extends + Archive Links) */}
          <section id="citations-sec" className="space-y-5 pt-8 border-t border-[var(--border-subtle)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[var(--action-primary)]" />
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Red de Citas Conectadas ({article.citations.length})
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Referencias conectadas con función semántica explícita y enlace archivado en Internet Archive para prevenir enlaces rotos.
              </p>
            </div>

            {/* Citations Supports */}
            {citationsSupports.length > 0 && (
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                  Evidencias que apoyan la tesis ({citationsSupports.length})
                </span>
                <div className="space-y-2.5">
                  {citationsSupports.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 text-xs transition-colors hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {c.targetArticleTitle}
                        </span>
                        <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          APOYA
                        </span>
                      </div>
                      <p className="font-serif italic text-[var(--text-secondary)]">
                        "{c.quoteText}" — {c.targetAuthor}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">
                        <strong>Razón de la conexión:</strong> {c.explanation}
                      </p>
                      {c.archiveUrl && (
                        <div className="pt-1 flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
                          <span className="text-emerald-600 font-mono">Enlace archivado</span>
                          <span>·</span>
                          <a
                            href={c.archiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-[var(--action-primary)]"
                          >
                            Ver copia Wayback Machine
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citations Contradicts */}
            {citationsContradicts.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-mono text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                  Objeciones y contraejemplos ({citationsContradicts.length})
                </span>
                <div className="space-y-2.5">
                  {citationsContradicts.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 text-xs transition-colors hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {c.targetArticleTitle}
                        </span>
                        <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                          CONTRADICE
                        </span>
                      </div>
                      <p className="font-serif italic text-[var(--text-secondary)]">
                        "{c.quoteText}" — {c.targetAuthor}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">
                        <strong>Objeción:</strong> {c.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citations Extends */}
            {citationsExtends.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                  Ampliaciones y generalizaciones ({citationsExtends.length})
                </span>
                <div className="space-y-2.5">
                  {citationsExtends.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 text-xs transition-colors hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {c.targetArticleTitle}
                        </span>
                        <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                          AMPLÍA
                        </span>
                      </div>
                      <p className="font-serif italic text-[var(--text-secondary)]">
                        "{c.quoteText}" — {c.targetAuthor}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">
                        <strong>Generalización:</strong> {c.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cited By panel (Neutral count, zero popularity) */}
            <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-2 text-xs">
              <span className="font-semibold text-[var(--text-primary)] block">
                Artículos de Chen que citan este texto ({citedByList.length}):
              </span>
              {citedByList.length === 0 ? (
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Este artículo aún no ha sido citado por otros autores dentro de la red.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {citedByList.map((other) => (
                    <li
                      key={other.id}
                      onClick={() => onSelectArticle(other.id)}
                      className="cursor-pointer hover:text-[var(--action-primary)] text-xs text-[var(--text-secondary)] flex items-center justify-between"
                    >
                      <span>• {other.title}</span>
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                        Por {other.author.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>

        {/* Right: Inline Discussions Rail (Section 2.1 Highlight & Discuss) */}
        <div className="lg:col-span-3 sticky top-24 space-y-4">
          <InlineDiscussionRail
            discussions={discussions}
            activeDiscussionId={activeDiscussionId}
            onSelectDiscussion={(id) => setActiveDiscussionId(id)}
            onAddComment={handleAddInlineComment}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* History Modal */}
      <ContentHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        articleTitle={article.title}
        versions={article.versions || []}
        corrections={article.corrections}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetId={article.id}
        targetType="articulo"
        targetTitle={article.title}
        onSubmitReport={onSubmitReport}
      />

      {/* Citar Fácil Modal (Conflict 3 Solved: Honest opt-in NotebookLM) */}
      {citeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Citar o Exportar este Artículo
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Copia rápida en formatos académicos limpios sin rastreadores.
                </p>
              </div>
              <button
                onClick={() => setCiteModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            {/* APA */}
            <div className="space-y-1.5 p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)]">Formato APA 7.ª ed.</span>
                <button
                  onClick={() => handleCopyCitation('apa')}
                  className="text-[11px] font-medium text-[var(--action-primary)] hover:underline flex items-center gap-1"
                >
                  {copiedFormat === 'apa' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedFormat === 'apa' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                {article.author.name} (2026). {article.title}. Chen: Red de Conocimiento Libre ({article.license}).
              </p>
            </div>

            {/* Markdown */}
            <div className="space-y-1.5 p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)]">Cita en Markdown (para Obsidian o notas)</span>
                <button
                  onClick={() => handleCopyCitation('markdown')}
                  className="text-[11px] font-medium text-[var(--action-primary)] hover:underline flex items-center gap-1"
                >
                  {copiedFormat === 'markdown' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedFormat === 'markdown' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-secondary)] line-clamp-2">
                &gt; "{article.excerpt}" — [{article.author.name}]({article.slug}) en Chen
              </p>
            </div>

            {/* NotebookLM Honest Opt-in (Conflict 3 Strict Compliance) */}
            <div className="space-y-2 p-3.5 rounded border border-indigo-200 dark:border-indigo-900 bg-[var(--bg-subtle-lilac)] text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                <Sparkles className="h-4 w-4 text-[var(--action-primary)]" />
                <span>Exportar fuente limpia para Google NotebookLM</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                <strong>Aviso de privacidad y honestidad:</strong> Chen no envía automáticamente ningún dato personal ni texto a Google. Al pulsar el botón, descargas en tu propio ordenador un archivo Markdown limpio con metadatos estructurados. Posteriormente puedes subirlo tú mismo a tu propio cuaderno de NotebookLM.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                <button
                  onClick={handleDownloadNotebookLMFile}
                  className="px-3 py-1.5 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] flex items-center gap-1.5"
                >
                  <Download className="h-3 w-3" />
                  <span>{copiedFormat === 'notebooklm' ? '¡Descargado!' : 'Descargar archivo .md'}</span>
                </button>

                <a
                  href="https://notebooklm.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--action-primary)] hover:underline flex items-center gap-1"
                >
                  <span>Abrir Google NotebookLM</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCiteModalOpen(false)}
                className="px-4 py-1.5 rounded text-xs border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
