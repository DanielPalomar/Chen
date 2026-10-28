import React, { useState, useEffect } from 'react';
import { Article, Author, ModerationAuditLog } from './types';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredAuthors,
  saveStoredAuthors,
  getStoredAuditLogs,
  resetAllToInitial,
  simulateGdprErasure,
} from './utils/storage';
import { ChenNavbar } from './components/ChenNavbar';
import { HomeHeroAndPositioning } from './components/HomeHeroAndPositioning';
import { ArticleReader } from './components/ArticleReader';
import { CitationEditor } from './components/CitationEditor';
import { GdprArchitecturePanel } from './components/GdprArchitecturePanel';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(getStoredArticles);
  const [authors, setAuthors] = useState<Author[]>(getStoredAuthors);
  const [auditLogs, setAuditLogs] = useState<ModerationAuditLog[]>(getStoredAuditLogs);

  // Active view: 'home' | 'reader' | 'editor' | 'gdpr'
  const [currentView, setCurrentView] = useState<'home' | 'reader' | 'editor' | 'gdpr'>('home');
  const [activeArticleId, setActiveArticleId] = useState<string>('art-flp-consenso');

  // Prefilled quote when user highlights text in reader and clicks "Citar este fragmento"
  const [prefilledQuote, setPrefilledQuote] = useState<{
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  } | undefined>(undefined);

  // Active author session (for one-click simulated authoring)
  const [currentAuthor, setCurrentAuthor] = useState<Author>(() => {
    const list = getStoredAuthors();
    return list[1] || list[0]; // Ing. Andrés Keller by default
  });

  // Theme: light (warm paper #FAF9F5) vs dark (obsidian #0F1115)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chen_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('chen_theme_mode', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation handlers
  const handleNavigate = (view: 'home' | 'reader' | 'editor' | 'gdpr', articleId?: string) => {
    if (articleId) {
      setActiveArticleId(articleId);
    }
    if (view === 'editor' && !articleId) {
      setPrefilledQuote(undefined);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditorWithQuote = (quoteData: {
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  }) => {
    setPrefilledQuote(quoteData);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Publish success handler: adds article, links bidirectional citation, and navigates to reader
  const handlePublishSuccess = (newArticle: Article) => {
    // If it cites an existing article, update that target article's `citedByInbound` array immediately
    let updatedList = [...articles];

    if (newArticle.citationsOutbound.length > 0) {
      const outCit = newArticle.citationsOutbound[0];
      updatedList = updatedList.map((art) => {
        if (art.id === outCit.targetArticleId) {
          const alreadyExists = art.citedByInbound.some((c) => c.id === outCit.id);
          if (!alreadyExists) {
            return {
              ...art,
              citedByInbound: [outCit, ...art.citedByInbound],
            };
          }
        }
        return art;
      });
    }

    // Append the new article
    updatedList = [newArticle, ...updatedList];
    setArticles(updatedList);
    saveStoredArticles(updatedList);

    // Navigate to read the new article
    setActiveArticleId(newArticle.id);
    setCurrentView('reader');
    setPrefilledQuote(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // GDPR Erasure simulation
  const handleSimulateGdpr = (authorId: string) => {
    const { updatedAuthors, updatedArticles, erasedAuthor } = simulateGdprErasure(authorId);
    setAuthors(updatedAuthors);
    setArticles(updatedArticles);
    if (erasedAuthor && currentAuthor.id === authorId) {
      setCurrentAuthor(erasedAuthor);
    }
  };

  const handleResetData = () => {
    const res = resetAllToInitial();
    setArticles(res.articles);
    setAuthors(res.authors);
    setAuditLogs(res.auditLogs);
    setCurrentAuthor(res.authors[1]);
  };

  const activeArticle = articles.find((a) => a.id === activeArticleId) || articles[0];

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 font-sans antialiased transition-colors flex flex-col justify-between">
      {/* Skip link for WCAG 2.1 AAA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-900 focus:text-white focus:rounded focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Clean Editorial Navigation Bar */}
      <ChenNavbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentAuthor={currentAuthor}
        authors={authors}
        onSwitchAuthor={setCurrentAuthor}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {currentView === 'home' && (
          <HomeHeroAndPositioning
            articles={articles}
            onOpenArticle={handleOpenArticle}
            onOpenEditor={(quote) => {
              if (quote) {
                handleOpenEditorWithQuote(quote);
              } else {
                setPrefilledQuote(undefined);
                setCurrentView('editor');
              }
            }}
          />
        )}

        {currentView === 'reader' && activeArticle && (
          <ArticleReader
            article={activeArticle}
            allArticles={articles}
            onNavigateArticle={handleOpenArticle}
            onOpenEditorWithQuote={handleOpenEditorWithQuote}
            onBackToFeed={() => handleNavigate('home')}
          />
        )}

        {currentView === 'editor' && (
          <CitationEditor
            currentAuthor={currentAuthor}
            authors={authors}
            onSwitchAuthor={setCurrentAuthor}
            prefilledQuote={prefilledQuote}
            onPublishSuccess={handlePublishSuccess}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {currentView === 'gdpr' && (
          <GdprArchitecturePanel
            authors={authors}
            articles={articles}
            auditLogs={auditLogs}
            onSimulateErasure={handleSimulateGdpr}
            onResetAllData={handleResetData}
            onNavigateToArticle={handleOpenArticle}
          />
        )}
      </main>

      {/* Sober Editorial Footer */}
      <footer
        role="contentinfo"
        className="border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-[#0F1115] py-8 text-xs font-mono text-stone-500 dark:text-stone-400"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 dark:text-stone-200 text-sm">Chen</span>
            <span>· Protocolo de Publicación y Argumentación Abierta v1.0</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Licencia: CC BY-SA 4.0</span>
            <span>·</span>
            <span>Cero Rastreadores (0 KB externos)</span>
            <span>·</span>
            <span>WCAG 2.1 AAA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
