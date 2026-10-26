import React, { useState } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { InlineDiscussion, UserProfile } from '../types';

interface InlineDiscussionRailProps {
  discussions: InlineDiscussion[];
  activeDiscussionId: string | null;
  onSelectDiscussion: (id: string | null) => void;
  onAddComment: (discussionId: string, text: string) => void;
  currentUser: UserProfile | null;
}

export const InlineDiscussionRail: React.FC<InlineDiscussionRailProps> = ({
  discussions,
  activeDiscussionId,
  onSelectDiscussion,
  onAddComment,
  currentUser,
}) => {
  const [newComment, setNewComment] = useState('');

  if (discussions.length === 0 && !activeDiscussionId) {
    return null;
  }

  const activeDiscussion = discussions.find((d) => d.id === activeDiscussionId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeDiscussionId) return;
    onAddComment(activeDiscussionId, newComment.trim());
    setNewComment('');
  };

  return (
    <aside
      aria-label="Debates anclados a fragmentos de texto"
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-4 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <MessageSquare className="h-3.5 w-3.5 text-[var(--action-primary)]" />
          <span>Debate anclado al texto ({discussions.length})</span>
        </div>
        {activeDiscussionId && (
          <button
            onClick={() => onSelectDiscussion(null)}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {activeDiscussion ? (
        <div className="space-y-3 text-xs">
          {/* Passage Quote */}
          <div className="p-2.5 rounded border-l-2 border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] italic text-[11px] text-[var(--text-secondary)]">
            "{activeDiscussion.selectedText}"
          </div>

          {/* Comments stream (without likes) */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {activeDiscussion.comments.map((c) => (
              <div key={c.id} className="p-2 rounded bg-[var(--bg-subtle)] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
                  <span className="font-medium text-[var(--text-primary)]">
                    {c.author}
                  </span>
                  <span>{c.date}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {c.content}
                </p>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSend} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Aporta un argumento u objeción..."
              className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2 py-1 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 rounded bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Haz clic en los pasajes destacados del artículo para leer o replicar las objeciones argumentativas.
          </p>
          <div className="space-y-1.5">
            {discussions.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelectDiscussion(d.id)}
                className="w-full text-left p-2 rounded hover:bg-[var(--bg-subtle)] transition-colors border border-[var(--border-subtle)]"
              >
                <span className="line-clamp-1 italic text-[11px] text-[var(--text-primary)] font-medium">
                  "{d.selectedText}"
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] block">
                  {d.comments.length} intervenciones
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
