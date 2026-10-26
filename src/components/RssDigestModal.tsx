import React, { useState } from 'react';
import { Rss, Mail, X, Check, Copy, ExternalLink } from 'lucide-react';
import { INITIAL_AREAS } from '../data/initialData';

interface RssDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RssDigestModal: React.FC<RssDigestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);
  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (feedName: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedFeed(feedName);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digestEmail.trim()) return;
    setDigestSubscribed(true);
    setTimeout(() => {
      setDigestSubscribed(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Rss className="h-4 w-4 text-[var(--action-primary)]" />
            <h3 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Canales RSS y Resumen Cronológico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* RSS Feeds list */}
        <div className="space-y-3 text-xs">
          <p className="text-xs text-[var(--text-secondary)]">
            Sigue las publicaciones sin algoritmos de intermediación ni necesidad de entrar a diario a la plataforma:
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
              <div>
                <span className="font-medium text-[var(--text-primary)] block">Canal Global (Todo Chen)</span>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">https://chen.org/feed.xml</span>
              </div>
              <button
                onClick={() => handleCopy('global', 'https://chen.org/feed.xml')}
                className="px-2 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px]"
              >
                {copiedFeed === 'global' ? 'Copiado' : 'Copiar feed'}
              </button>
            </div>

            {INITIAL_AREAS.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="p-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-[var(--text-primary)] block">Área: {a.name}</span>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)]">https://chen.org/feed/{a.slug}.xml</span>
                </div>
                <button
                  onClick={() => handleCopy(a.id, `https://chen.org/feed/${a.slug}.xml`)}
                  className="px-2 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px]"
                >
                  {copiedFeed === a.id ? 'Copiado' : 'Copiar feed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Weekly Digest (Chronological, Zero Engagement) */}
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--action-primary)]" />
            <h4 className="font-serif font-semibold text-[var(--text-primary)]">
              Resumen semanal cronológico por correo (Opcional)
            </h4>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Un único correo cada domingo con las nuevas publicaciones y correcciones ordenadas estrictamente por fecha, sin recomendaciones personalizadas ni trucos de retención.
          </p>

          {digestSubscribed ? (
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium text-xs flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Suscripción cronológica activada sin rastreadores.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                placeholder="tu@correo.org"
                className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)]"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
