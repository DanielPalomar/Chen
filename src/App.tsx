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
import { ManifestoView } from './components/ManifestoView';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(getStoredArticles);
  const [authors, setAuthors] = useState<Author[]>(getStoredAuthors);
  const [auditLogs, setAuditLogs] = useState<ModerationAuditLog[]>(getStoredAuditLogs);

  // Vistas activas: 'home' | 'reader' | 'editor' | 'manifesto'
  const [currentView, setCurrentView] = useState<'home' | 'reader' | 'editor' | 'manifesto'>('home');
  const [activeArticleId, setActiveArticleId] = useState<string>('art-falsacionismo-popper');
  const [highlightedCitationId, setHighlightedCitationId] = useState<string | undefined>(undefined);
  const [resetToast, setResetToast] = useState<string | null>(null);

  // Cita anclada proveniente de la selección de texto
  const [prefilledQuote, setPrefilledQuote] = useState<{
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  } | undefined>(undefined);

  // Sesión simulada de autor
  const [currentAuthor, setCurrentAuthor] = useState<Author>(() => {
    const list = getStoredAuthors();
    return list[1] || list[0]; // Pierre Duhem & Quine por defecto para réplicas
  });

  // Tema: Claro (Pergamino #FAF9F5) vs Oscuro (Obsidiana #0F1115)
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

  // Manejador de navegación con soporte de anclas suaves
  const handleNavigate = (view: 'home' | 'reader' | 'editor' | 'manifesto', targetElementId?: string) => {
    setHighlightedCitationId(undefined);
    if (view === 'editor') {
      setPrefilledQuote(undefined);
    }
    setCurrentView(view);

    if (targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(targetElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    setHighlightedCitationId(undefined);
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

  // Al publicar: añade artículo, actualiza citas bidireccionales en el artículo citado y salta a él destacándolo
  const handlePublishSuccess = (newArticle: Article, targetArticleId?: string, createdCitationId?: string) => {
    let updatedList = [...articles];

    if (newArticle.citationsOutbound.length > 0 && targetArticleId) {
      const outCit = newArticle.citationsOutbound[0];
      updatedList = updatedList.map((art) => {
        if (art.id === targetArticleId) {
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

    updatedList = [newArticle, ...updatedList];
    setArticles(updatedList);
    saveStoredArticles(updatedList);

    // Navegar de inmediato al artículo original para experimentar el momento "Aha!" con la cita resaltada
    if (targetArticleId) {
      setActiveArticleId(targetArticleId);
      setHighlightedCitationId(createdCitationId);
    } else {
      setActiveArticleId(newArticle.id);
      setHighlightedCitationId(undefined);
    }

    setCurrentView('reader');
    setPrefilledQuote(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulación de Borrado RGPD (Art. 17)
  const handleSimulateGdpr = (authorId: string) => {
    const { updatedAuthors, updatedArticles, erasedAuthor } = simulateGdprErasure(authorId);
    setAuthors(updatedAuthors);
    setArticles(updatedArticles);
    if (erasedAuthor && currentAuthor.id === authorId) {
      setCurrentAuthor(erasedAuthor);
    }
  };

  // Restaurar datos de demostración
  const handleResetData = () => {
    const res = resetAllToInitial();
    setArticles(res.articles);
    setAuthors(res.authors);
    setAuditLogs(res.auditLogs);
    setCurrentAuthor(res.authors[1]);
    setActiveArticleId('art-falsacionismo-popper');
    setHighlightedCitationId(undefined);
    setResetToast('Datos de demostración restaurados al estado original con éxito.');
    setTimeout(() => setResetToast(null), 4000);
  };

  const activeArticle = articles.find((a) => a.id === activeArticleId) || articles[0];

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 font-sans antialiased transition-colors flex flex-col justify-between">
      {/* Enlace de Salto para Accesibilidad WCAG 2.1 AAA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-900 focus:text-white focus:rounded focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Barra de Navegación Editorial */}
      <ChenNavbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentAuthor={currentAuthor}
        authors={authors}
        onSwitchAuthor={setCurrentAuthor}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Notificación de Restauración */}
      {resetToast && (
        <aside aria-label="Notificación de restauración" className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{resetToast}</span>
        </aside>
      )}

      {/* Contenedor Principal (con id="main-content" estricto) */}
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
            highlightedCitationId={highlightedCitationId}
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

        {currentView === 'manifesto' && (
          <ManifestoView
            authors={authors}
            articles={articles}
            auditLogs={auditLogs}
            onSimulateErasure={handleSimulateGdpr}
            onResetAllData={handleResetData}
            onNavigateToArticle={handleOpenArticle}
          />
        )}
      </main>

      {/* Pie de Página Editorial Sobrio */}
      <footer
        role="contentinfo"
        className="border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-[#0F1115] py-8 text-xs font-mono text-stone-500 dark:text-stone-400 mt-12"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 dark:text-stone-200 text-sm">Chen</span>
            <span>· Protocolo de Publicación y Argumentación Abierta v1.0</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Licencia: CC BY-SA 4.0</span>
            <span>·</span>
            <span>0 KB Externos</span>
            <span>·</span>
            <span>WCAG 2.1 AAA</span>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="text-stone-700 dark:text-stone-300 underline hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer"
            >
              Restaurar datos de demostración
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
