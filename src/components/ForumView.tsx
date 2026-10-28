import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  ArrowRight,
  Filter,
  Check,
  Send,
  ArrowLeft,
  Sparkles,
  Flag,
} from 'lucide-react';
import { ForumThread, ForumReply, UserProfile, ReportItem } from '../types';
import { ReportModal } from './ReportModal';

interface ForumViewProps {
  threads: ForumThread[];
  currentUser: UserProfile | null;
  onAddThread: (thread: Omit<ForumThread, 'id' | 'date' | 'replies'>) => void;
  onAddReply: (threadId: string, reply: Omit<ForumReply, 'id' | 'date'>) => void;
  onRequestLogin: () => void;
  onSubmitReport?: (report: ReportItem) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  threads,
  currentUser,
  onAddThread,
  onAddReply,
  onRequestLogin,
  onSubmitReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{ id: string; title: string; type: 'hilo' | 'comentario' } | null>(null);

  // New Thread Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('Debate Abierto');
  const [newContent, setNewContent] = useState('');

  // Reply Form
  const [replyContent, setReplyContent] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const categories = [
    'all',
    'Epistemología',
    'Ciencias',
    'Computación',
    'Debate Abierto',
    'Propuestas Chen',
  ];

  const filteredThreads = threads.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddThread({
      title: newTitle.trim(),
      category: newCategory,
      author: currentUser ? currentUser.name : 'Autor de la comunidad',
      authorRole: currentUser ? currentUser.role : 'Miembro comunitario',
      content: newContent.trim(),
    });

    setNewTitle('');
    setNewContent('');
    setIsNewThreadOpen(false);
  };

  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThreadId) return;

    onAddReply(activeThreadId, {
      author: currentUser ? currentUser.name : 'Colaborador de Chen',
      authorRole: currentUser ? currentUser.role : 'Miembro libre',
      isGithubVerified: currentUser?.githubVerified,
      content: replyContent.trim(),
    });

    setReplyContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* If viewing a single thread */}
      {activeThread ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveThreadId(null)}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al listado del foro</span>
          </button>

          {/* Thread Card */}
          <article className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
              <span className="font-medium text-[var(--action-primary)] font-mono">
                {activeThread.category}
              </span>
              <div className="flex items-center gap-2.5">
                <span>{activeThread.date}</span>
                {onSubmitReport && (
                  <button
                    onClick={() => setReportModalData({ id: activeThread.id, title: activeThread.title, type: 'hilo' })}
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] hover:text-rose-600 transition-colors"
                    title="Reportar este hilo a moderación"
                  >
                    <Flag className="h-3 w-3" />
                    <span>Reportar</span>
                  </button>
                )}
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] leading-snug">
              {activeThread.title}
            </h1>

            <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {activeThread.content}
            </p>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <div className="h-6 w-6 rounded-full bg-[var(--bg-subtle-lilac)] flex items-center justify-center font-semibold text-[var(--action-primary)] text-[11px]">
                {activeThread.author[0]}
              </div>
              <span className="font-medium text-[var(--text-primary)]">
                {activeThread.author}
              </span>
              <span>· {activeThread.authorRole}</span>
            </div>
          </article>

          {/* Replies Section */}
          <section className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Respuestas y réplicas argumentadas ({activeThread.replies.length})
            </h3>

            {activeThread.replies.length === 0 ? (
              <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center text-xs text-[var(--text-tertiary)]">
                Aún no hay réplicas en este hilo. Sé la primera persona en argumentar.
              </div>
            ) : (
              <div className="space-y-3">
                {activeThread.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {reply.author}
                        </span>
                        <span>({reply.authorRole})</span>
                        {reply.isGithubVerified && (
                          <span className="text-[10px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-1 rounded">
                            Verificado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{reply.date}</span>
                        {onSubmitReport && (
                          <button
                            onClick={() => setReportModalData({ id: reply.id, title: `Réplica de ${reply.author}`, type: 'comentario' })}
                            className="p-1 text-[var(--text-tertiary)] hover:text-rose-600 transition-colors"
                            title="Reportar esta réplica"
                          >
                            <Flag className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="font-serif text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Post Reply Box */}
            <form onSubmit={handleCreateReply} className="space-y-3 pt-2">
              <textarea
                required
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu réplica argumentada, citando fuentes si es posible..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-tertiary)]">
                  Firmando como: <strong>{currentUser ? currentUser.name : 'Invitado'}</strong>
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-xs transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publicar réplica</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        /* Forum Thread List */
        <div className="space-y-6">
          <section className="border-b border-[var(--border-subtle)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
                <MessageSquare className="h-4 w-4" />
                <span>Espacio de deliberación abierta</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Foro General de la Comunidad
              </h1>
              <p className="font-serif text-sm text-[var(--text-secondary)]">
                Debate de ideas, pedagogía, sugerencias de código y dudas académicas generales.
              </p>
            </div>

            <button
              onClick={() => setIsNewThreadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo tema de debate</span>
            </button>
          </section>

          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
                  selectedCategory === c
                    ? 'bg-[var(--action-primary)] text-white font-medium'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {c === 'all' ? 'Todos los temas' : c}
              </button>
            ))}
          </div>

          {/* Threads list */}
          <div className="space-y-3">
            {filteredThreads.map((thread) => (
              <article
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2 hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                  <span className="font-medium text-[var(--action-primary)] font-mono">
                    {thread.category}
                  </span>
                  <span>{thread.date}</span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] leading-snug hover:text-[var(--action-primary)]">
                  {thread.title}
                </h3>

                <p className="font-serif text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
                  <span>Por {thread.author}</span>
                  <span className="font-mono text-[var(--text-secondary)]">
                    {thread.replies.length} réplicas
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* New Thread Modal */}
      {isNewThreadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Abrir nuevo tema de debate en el foro
            </h3>
            <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Título del tema:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="¿Cuál es tu pregunta o propuesta central...?"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Categoría:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as ForumThread['category'])
                  }
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                >
                  <option value="Epistemología">Epistemología</option>
                  <option value="Ciencias">Ciencias</option>
                  <option value="Computación">Computación</option>
                  <option value="Debate Abierto">Debate Abierto</option>
                  <option value="Propuestas Chen">Propuestas Chen</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Desarrollo de la idea:
                </label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explica el contexto y plantea los puntos clave a debatir..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewThreadOpen(false)}
                  className="px-3 py-1.5 rounded text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                >
                  Publicar tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalData && onSubmitReport && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportModalData(null)}
          targetId={reportModalData.id}
          targetType={reportModalData.type}
          targetTitle={reportModalData.title}
          onSubmitReport={onSubmitReport}
        />
      )}
    </div>
  );
};
