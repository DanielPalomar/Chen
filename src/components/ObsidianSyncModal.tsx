import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  GitBranch,
  BookOpen,
  FolderSync,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Article } from '../types';
import { exportAllArticlesAsMarkdownBundle } from '../utils/storage';

interface ObsidianSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  currentArticle?: Article;
}

export const ObsidianSyncModal: React.FC<ObsidianSyncModalProps> = ({
  isOpen,
  onClose,
  articles,
  currentArticle,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    currentArticle?.id || articles[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const article = articles.find((a) => a.id === selectedArticleId) || currentArticle || articles[0];

  const generateObsidianMarkdown = (art: Article): string => {
    const wikilinks = art.citations
      .map(
        (c) =>
          `- [[${c.targetArticleTitle}]] · *Relación epistémica: ${c.relation.toUpperCase()}*\n  > "${c.quoteText}"\n  *Comentario: ${c.explanation}*`
      )
      .join('\n\n');

    return `---
title: "${art.title}"
author: "${art.author.name}"
author_role: "${art.author.role}"
area: "${art.area}"
level: "${art.level}"
license: "${art.license}"
epistemic_status: "${art.epistemicStatus}"
ai_declared: ${art.aiDeclared}
published_date: "${art.publishedDate}"
chen_url: "${typeof window !== 'undefined' ? window.location.origin : 'https://chen-knowledge.org'}/#${art.slug}"
tags:
  - chen
  - ${art.area.toLowerCase().replace(/[^a-z0-9]/g, '_')}
  - ${art.epistemicStatus}
---

# ${art.title}

> **${art.subtitle}**
>
> *Autor: ${art.author.name} · Licencia: ${art.license} · Estado: ${art.epistemicStatus}*

## Resumen
${art.excerpt}

---

## Contenido
${art.contentMarkdown}

---

## Red de Citas y Conexiones Semánticas (Obsidian Graph View)
${wikilinks || '*Sin citas directas registradas.*'}
`;
  };

  const currentMarkdown = article ? generateObsidianMarkdown(article) : '';

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleMd = () => {
    if (!article) return;
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.slug || 'chen-nota'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderSync className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                Sincronización con Obsidian (Markdown Puro + Graph View)
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Descarga tus notas y artículos con etiquetas YAML y <code className="font-mono text-purple-600 dark:text-purple-400">[[wikilinks]]</code> para conectarlos automáticamente al Graph View de tu bóveda local de Obsidian.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Article selector */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="font-semibold text-[var(--text-primary)] shrink-0">
            Selecciona artículo:
          </label>
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
          >
            {articles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.area})
              </option>
            ))}
          </select>
        </div>

        {/* Code Preview */}
        <div className="flex-1 overflow-hidden flex flex-col space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider">
            Vista previa del archivo .md con Frontmatter y Wikilinks:
          </span>
          <pre className="flex-1 p-3.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--text-secondary)] overflow-y-auto leading-relaxed select-all">
            {currentMarkdown}
          </pre>
        </div>

        {/* How to use in Obsidian */}
        <div className="rounded p-3 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 text-[11px] text-[var(--text-secondary)] space-y-1">
          <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            <span>Guía de integración con Obsidian:</span>
          </span>
          <p>
            1. Descarga el archivo <code className="font-mono">.md</code> o el lote completo. 2. Colócalo dentro de tu carpeta de Vault de Obsidian. 3. Abre la vista de grafo (<kbd className="font-mono px-1 bg-white dark:bg-black rounded">Ctrl/Cmd + G</kbd>) para ver todas las citas cruzadas y clasificaciones conectadas.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <button
            onClick={exportAllArticlesAsMarkdownBundle}
            className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar toda la biblioteca (.zip)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadSingleMd}
              className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
