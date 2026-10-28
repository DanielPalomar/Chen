import React, { useState, useEffect } from 'react';
import {
  Article,
  KnowledgeGap,
  KnowledgeGapAnswer,
  Flashcard,
  UserPreferences,
  UserProfile,
  ForumThread,
  ForumReply,
  ClaimRecord,
  FreeBook,
  PersonalChallenge,
  ThesisAntithesisItem,
  ReportItem,
  CommunityStudyPath,
  SavedSnippet,
} from './types';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredGaps,
  saveStoredGaps,
  getStoredFlashcards,
  saveStoredFlashcards,
  getStoredPreferences,
  saveStoredPreferences,
  getStoredUser,
  saveStoredUser,
  getStoredForumThreads,
  saveStoredForumThreads,
  getStoredClaims,
  saveStoredClaims,
  getStoredBooks,
  saveStoredBooks,
  getStoredChallenges,
  saveStoredChallenges,
  getStoredThesis,
  saveStoredThesis,
  getStoredReports,
  saveStoredReports,
  getStoredStudyPaths,
  saveStoredStudyPaths,
  getStoredSnippets,
  saveStoredSnippets,
} from './utils/storage';
import { INITIAL_AUTHORS, INITIAL_AREAS } from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { AreasView } from './components/AreasView';
import { KnowledgeGapsView } from './components/KnowledgeGapsView';
import { EditorView } from './components/EditorView';
import { StudyPathView } from './components/StudyPathView';
import { PersonalChallengesView } from './components/PersonalChallengesView';
import { ThesisAntithesisView } from './components/ThesisAntithesisView';
import { AuthorProfileView } from './components/AuthorProfileView';
import { UserProfileView } from './components/UserProfileView';
import { ModerationLogView } from './components/ModerationLogView';
import { SettingsView } from './components/SettingsView';
import { ManifestoView } from './components/ManifestoView';
import { ForumView } from './components/ForumView';
import { ClaimsBookView } from './components/ClaimsBookView';
import { FreeBooksView } from './components/FreeBooksView';
import { RepositoriesView } from './components/RepositoriesView';
import { RedLinesView } from './components/RedLinesView';
import { ReputationExplainerView } from './components/ReputationExplainerView';
import { SustainabilityView } from './components/SustainabilityView';
import { SearchView } from './components/SearchView';
import { KnowledgeMapView } from './components/KnowledgeMapView';
import { ObsidianSyncModal } from './components/ObsidianSyncModal';
import { LoginModal } from './components/LoginModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RssDigestModal } from './components/RssDigestModal';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(getStoredArticles);
  const [gaps, setGaps] = useState<KnowledgeGap[]>(getStoredGaps);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(getStoredFlashcards);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(getStoredForumThreads);
  const [claims, setClaims] = useState<ClaimRecord[]>(getStoredClaims);
  const [books, setBooks] = useState<FreeBook[]>(getStoredBooks);
  const [challenges, setChallenges] = useState<PersonalChallenge[]>(getStoredChallenges);
  const [thesisItems, setThesisItems] = useState<ThesisAntithesisItem[]>(getStoredThesis);
  const [reports, setReports] = useState<ReportItem[]>(getStoredReports);
  const [studyPaths, setStudyPaths] = useState<CommunityStudyPath[]>(getStoredStudyPaths);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>(getStoredSnippets);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser);
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRssOpen, setIsRssOpen] = useState(false);
  const [isObsidianOpen, setIsObsidianOpen] = useState(false);
  const [obsidianTargetArticle, setObsidianTargetArticle] = useState<Article | undefined>(undefined);

  // Persistence
  useEffect(() => {
    saveStoredArticles(articles);
  }, [articles]);

  useEffect(() => {
    saveStoredGaps(gaps);
  }, [gaps]);

  useEffect(() => {
    saveStoredFlashcards(flashcards);
  }, [flashcards]);

  useEffect(() => {
    saveStoredForumThreads(forumThreads);
  }, [forumThreads]);

  useEffect(() => {
    saveStoredClaims(claims);
  }, [claims]);

  useEffect(() => {
    saveStoredBooks(books);
  }, [books]);

  useEffect(() => {
    saveStoredChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    saveStoredThesis(thesisItems);
  }, [thesisItems]);

  useEffect(() => {
    saveStoredReports(reports);
  }, [reports]);

  useEffect(() => {
    saveStoredStudyPaths(studyPaths);
  }, [studyPaths]);

  useEffect(() => {
    saveStoredSnippets(savedSnippets);
  }, [savedSnippets]);

  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredPreferences(preferences);
    // Sync theme, font, assisted reading, line focus, and ultra-light mode on <html> element
    document.documentElement.setAttribute('data-theme', preferences.theme || 'light');
    document.documentElement.setAttribute('data-font', preferences.fontFamily || 'serif');
    document.documentElement.setAttribute(
      'data-assisted-reading',
      preferences.assistedReading ? 'true' : 'false'
    );
    document.documentElement.setAttribute(
      'data-line-focus',
      preferences.lineFocus ? 'true' : 'false'
    );
    document.documentElement.setAttribute(
      'data-ultralight',
      preferences.ultraLightMode ? 'true' : 'false'
    );
  }, [preferences]);

  // Navigation handlers
  const handleNavigate = (
    view: UserPreferences['activeView'],
    articleId?: string | null,
    authorId?: string | null,
    areaId?: string | null
  ) => {
    setPreferences((prev) => ({
      ...prev,
      activeView: view,
      selectedArticleId: articleId !== undefined ? articleId : prev.selectedArticleId,
      selectedAuthorId: authorId !== undefined ? authorId : prev.selectedAuthorId,
      selectedAreaId: areaId !== undefined ? areaId : prev.selectedAreaId,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      // Mutual exclusion between Modo Ligero and Modo Visual
      if (updates.visualMode === true) {
        next.ultraLightMode = false;
      }
      if (updates.ultraLightMode === true) {
        next.visualMode = false;
      }
      return next;
    });
  };

  // Snippet Actions (Save excerpts & citations without saving the whole article)
  const handleSaveSnippet = (snippet: SavedSnippet) => {
    setSavedSnippets((prev) => [snippet, ...prev]);
  };

  const handleDeleteSnippet = (snippetId: string) => {
    setSavedSnippets((prev) => prev.filter((s) => s.id !== snippetId));
  };

  // Article Actions
  const handleSelectArticle = (articleId: string) => {
    handleNavigate('article', articleId);
  };

  const handleSelectAuthor = (authorId: string) => {
    handleNavigate('profile', undefined, authorId);
  };

  const handleSaveArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
    handleSelectArticle(newArticle.id);
  };

  // Report Actions
  const handleAddReport = (report: ReportItem) => {
    setReports((prev) => [report, ...prev]);
  };

  // Forum Actions
  const handleAddForumThread = (
    threadData: Omit<ForumThread, 'id' | 'date' | 'replies'>
  ) => {
    const newThread: ForumThread = {
      ...threadData,
      id: `thread-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      replies: [],
    };
    setForumThreads((prev) => [newThread, ...prev]);
  };

  const handleAddForumReply = (
    threadId: string,
    replyData: Omit<ForumReply, 'id' | 'date'>
  ) => {
    const newReply: ForumReply = {
      ...replyData,
      id: `reply-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    setForumThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
      )
    );
  };

  // Claims Book Actions
  const handleAddClaim = (
    claimData: Omit<ClaimRecord, 'id' | 'code' | 'date' | 'status'>
  ) => {
    const code = `REC-2026-00${claims.length + 43}`;
    const newClaim: ClaimRecord = {
      ...claimData,
      id: `claim-${Date.now().toString(36)}`,
      code,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'recibido',
    };
    setClaims((prev) => [newClaim, ...prev]);
  };

  // Free Books Actions
  const handleAddBook = (newBook: FreeBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  // Knowledge Gaps Actions
  const handleAddGap = (gapData: Omit<KnowledgeGap, 'id' | 'date' | 'answers' | 'status'>) => {
    const newGap: KnowledgeGap = {
      ...gapData,
      id: `gap-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      answers: [],
      status: 'unanswered',
    };
    setGaps((prev) => [newGap, ...prev]);
  };

  const handleAddAnswerToGap = (
    gapId: string,
    answerData: Omit<KnowledgeGapAnswer, 'id' | 'date'>
  ) => {
    const newAnswer: KnowledgeGapAnswer = {
      ...answerData,
      id: `ans-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    setGaps((prev) =>
      prev.map((g) =>
        g.id === gapId
          ? {
              ...g,
              status: 'answered',
              answers: [...g.answers, newAnswer],
            }
          : g
      )
    );
  };

  // Flashcards Actions
  const handleAddFlashcard = (cardData: {
    topic: string;
    area: string;
    question: string;
    answer: string;
    articleId?: string;
  }) => {
    const newCard: Flashcard = {
      id: `fc-${Date.now().toString(36)}`,
      topic: cardData.topic,
      area: cardData.area,
      question: cardData.question,
      answer: cardData.answer,
      articleId: cardData.articleId,
      intervalDays: 1,
      repetitionCount: 0,
      nextReviewDate: new Date().toISOString().slice(0, 10),
    };

    setFlashcards((prev) => [newCard, ...prev]);
  };

  const handleReviewCard = (cardId: string, rating: 'hard' | 'good' | 'easy') => {
    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        let nextInterval = 1;
        if (rating === 'hard') nextInterval = 1;
        else if (rating === 'good') nextInterval = Math.max(3, c.intervalDays * 2);
        else if (rating === 'easy') nextInterval = Math.max(7, c.intervalDays * 3);

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);

        return {
          ...c,
          intervalDays: nextInterval,
          repetitionCount: c.repetitionCount + 1,
          nextReviewDate: nextDate.toISOString().slice(0, 10),
        };
      })
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Challenges Actions
  const handleAddChallenge = (newChallenge: PersonalChallenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  const handleToggleMilestone = (challengeId: string, milestoneId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;
        return {
          ...c,
          milestones: c.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      })
    );
  };

  // Thesis Actions
  const handleAddThesisItem = (newItem: ThesisAntithesisItem) => {
    setThesisItems((prev) => [newItem, ...prev]);
  };

  // Active records
  const currentArticle =
    preferences.selectedArticleId !== null
      ? articles.find((a) => a.id === preferences.selectedArticleId) || articles[0]
      : articles[0];

  const currentAuthor =
    preferences.selectedAuthorId !== null
      ? INITIAL_AUTHORS[preferences.selectedAuthorId] || articles[0]?.author
      : articles[0]?.author;

  const currentAuthorArticles = articles.filter(
    (a) => a.author.name === currentAuthor?.name
  );

  const lang = preferences.language || 'es';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-150 ${
        preferences.textSize === 'large' ? 'text-[17px]' : 'text-[15px]'
      }`}
    >
      {/* Top Bar Header */}
      <Header
        preferences={preferences}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onUpdatePreferences={handleUpdatePreferences}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenObsidianSync={() => {
          setObsidianTargetArticle(currentArticle);
          setIsObsidianOpen(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {preferences.activeView === 'home' && (
          <HomeView
            articles={articles}
            gaps={gaps}
            searchQuery={searchQuery}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onNavigateGaps={() => handleNavigate('gaps')}
            onNavigateForum={() => handleNavigate('forum')}
            onNavigateEditor={() => handleNavigate('editor')}
            onNavigateStudyPath={() => handleNavigate('study_path')}
            onNavigateBooks={() => handleNavigate('books')}
            ultraLightMode={preferences.ultraLightMode}
          />
        )}

        {(preferences.activeView === 'areas' || preferences.activeView === 'area_detail') && (
          <AreasView
            language={lang}
            articles={articles}
            gaps={gaps}
            selectedAreaId={preferences.selectedAreaId}
            onSelectArea={(areaId) =>
              setPreferences((prev) => ({
                ...prev,
                selectedAreaId: areaId,
                activeView: areaId ? 'area_detail' : 'areas',
              }))
            }
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onNavigateGapDetail={() => handleNavigate('gaps')}
          />
        )}

        {preferences.activeView === 'knowledge_map' && (
          <KnowledgeMapView
            articles={articles}
            areas={INITIAL_AREAS}
            onSelectArticle={handleSelectArticle}
            onNavigateArea={(areaId) => {
              handleNavigate('area_detail', null, null, areaId);
            }}
          />
        )}

        {preferences.activeView === 'books' && (
          <FreeBooksView
            books={books}
            onAddBook={handleAddBook}
            onNavigateRepositories={() => handleNavigate('repositories')}
          />
        )}

        {preferences.activeView === 'repositories' && (
          <RepositoriesView
            language={lang}
            onNavigateBooks={() => handleNavigate('books')}
          />
        )}

        {preferences.activeView === 'article' && (
          <ArticleView
            article={currentArticle}
            allArticles={articles}
            onBack={() => handleNavigate('home')}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onAddFlashcard={handleAddFlashcard}
            onSubmitReport={handleAddReport}
            currentUser={currentUser}
            savedSnippets={savedSnippets}
            onSaveSnippet={handleSaveSnippet}
            onOpenObsidianSync={(art) => {
              setObsidianTargetArticle(art);
              setIsObsidianOpen(true);
            }}
          />
        )}

        {preferences.activeView === 'forum' && (
          <ForumView
            threads={forumThreads}
            currentUser={currentUser}
            onAddThread={handleAddForumThread}
            onAddReply={handleAddForumReply}
            onRequestLogin={() => setIsLoginModalOpen(true)}
            onSubmitReport={handleAddReport}
          />
        )}

        {preferences.activeView === 'claims' && (
          <ClaimsBookView claims={claims} onAddClaim={handleAddClaim} />
        )}

        {preferences.activeView === 'gaps' && (
          <KnowledgeGapsView
            gaps={gaps}
            onAddGap={handleAddGap}
            onAddAnswerToGap={handleAddAnswerToGap}
            onSubmitReport={handleAddReport}
          />
        )}

        {preferences.activeView === 'editor' && (
          <EditorView
            existingArticles={articles}
            onBack={() => handleNavigate('home')}
            onSaveArticle={handleSaveArticle}
          />
        )}

        {preferences.activeView === 'study_path' && (
          <StudyPathView
            flashcards={flashcards}
            onReviewCard={handleReviewCard}
            onAddCard={handleAddFlashcard}
            onDeleteCard={handleDeleteCard}
            studyPaths={studyPaths}
            onAddStudyPath={(newPath) => setStudyPaths((prev) => [newPath, ...prev])}
            onUpdateStudyPath={(updated) =>
              setStudyPaths((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            }
            onSelectArticle={handleSelectArticle}
            onNavigateBooks={() => handleNavigate('books')}
            currentUser={currentUser}
          />
        )}

        {preferences.activeView === 'challenges' && (
          <PersonalChallengesView
            language={lang}
            challenges={challenges}
            onAddChallenge={handleAddChallenge}
            onToggleMilestone={handleToggleMilestone}
          />
        )}

        {preferences.activeView === 'thesis' && (
          <ThesisAntithesisView
            language={lang}
            thesisItems={thesisItems}
            onAddThesisItem={handleAddThesisItem}
          />
        )}

        {preferences.activeView === 'profile' && (
          <AuthorProfileView
            author={currentAuthor}
            authorArticles={currentAuthorArticles}
            onBack={() => handleNavigate('home')}
            onSelectArticle={handleSelectArticle}
            onNavigateArea={(areaName) => {
              const found = INITIAL_AREAS.find((a) => a.name === areaName);
              if (found) {
                handleNavigate('area_detail', null, null, found.id);
              } else {
                handleNavigate('areas');
              }
            }}
          />
        )}

        {preferences.activeView === 'my_profile' && (
          currentUser ? (
            <UserProfileView
              currentUser={currentUser}
              articles={articles}
              forumThreads={forumThreads}
              gaps={gaps}
              savedSnippets={savedSnippets}
              onDeleteSnippet={handleDeleteSnippet}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onSelectArticle={handleSelectArticle}
              onNavigateForumThread={() => handleNavigate('forum')}
              onNavigateGap={() => handleNavigate('gaps')}
              onNavigateEditor={() => handleNavigate('editor')}
              onBack={() => handleNavigate('home')}
            />
          ) : (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center text-xs space-y-4 max-w-md mx-auto">
              <p className="text-[var(--text-secondary)] font-medium">
                Inicia sesión o selecciona una cuenta demo para acceder a tu perfil personalizado.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)] shadow-xs transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          )
        )}

        {preferences.activeView === 'moderation' && <ModerationLogView />}

        {preferences.activeView === 'reputation' && (
          <ReputationExplainerView
            language={lang}
            onNavigateAreas={() => handleNavigate('areas')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {preferences.activeView === 'red_lines' && (
          <RedLinesView
            language={lang}
            onNavigateManifesto={() => handleNavigate('manifesto')}
            onNavigateModeration={() => handleNavigate('moderation')}
          />
        )}

        {preferences.activeView === 'sustainability' && (
          <SustainabilityView
            language={lang}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateManifesto={() => handleNavigate('manifesto')}
          />
        )}

        {preferences.activeView === 'settings' && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onBack={() => handleNavigate('home')}
          />
        )}

        {preferences.activeView === 'manifesto' && (
          <ManifestoView
            onNavigateHome={() => handleNavigate('home')}
            onNavigateGaps={() => handleNavigate('gaps')}
          />
        )}

        {preferences.activeView === 'search' && (
          <SearchView
            language={lang}
            articles={articles}
            initialQuery={searchQuery}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={lang}
        onNavigateManifesto={() => handleNavigate('manifesto')}
        onNavigateModeration={() => handleNavigate('moderation')}
        onNavigateSustainability={() => handleNavigate('sustainability')}
        onNavigateRepositories={() => handleNavigate('repositories')}
        onNavigateBooks={() => handleNavigate('books')}
        onNavigateClaims={() => handleNavigate('claims')}
        onNavigateForum={() => handleNavigate('forum')}
        onNavigateAreas={() => handleNavigate('areas')}
        onNavigateRedLines={() => handleNavigate('red_lines')}
        onNavigateReputation={() => handleNavigate('reputation')}
        onNavigateKnowledgeMap={() => handleNavigate('knowledge_map')}
        onOpenObsidianSync={() => {
          setObsidianTargetArticle(currentArticle);
          setIsObsidianOpen(true);
        }}
        onOpenRss={() => setIsRssOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        onNavigateMyProfile={() => handleNavigate('my_profile')}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentUser={currentUser}
        onComplete={() => {
          setIsOnboardingOpen(false);
        }}
      />

      <RssDigestModal
        isOpen={isRssOpen}
        onClose={() => setIsRssOpen(false)}
      />

      <ObsidianSyncModal
        isOpen={isObsidianOpen}
        onClose={() => setIsObsidianOpen(false)}
        articles={articles}
        currentArticle={obsidianTargetArticle || currentArticle}
      />
    </div>
  );
}
