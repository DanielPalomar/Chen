import {
  Article,
  KnowledgeGap,
  Flashcard,
  UserPreferences,
  UserProfile,
  ForumThread,
  ClaimRecord,
  FreeBook,
  PersonalChallenge,
  ThesisAntithesisItem,
  ExerciseItem,
  GlossaryItem,
  ModerationLogEntry,
  ReportItem,
  CommunityStudyPath,
  SavedSnippet,
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_KNOWLEDGE_GAPS,
  INITIAL_FLASHCARDS,
  INITIAL_FORUM_THREADS,
  INITIAL_CLAIMS,
  INITIAL_CHALLENGES,
  INITIAL_THESIS_ITEMS,
  INITIAL_EXERCISES,
  INITIAL_GLOSSARY,
  INITIAL_MODERATION_LOG,
  INITIAL_BOOKS,
  INITIAL_STUDY_PATHS,
  DEMO_USERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  ARTICLES: 'chen_articles_v3',
  GAPS: 'chen_gaps_v3',
  FLASHCARDS: 'chen_flashcards_v3',
  FORUM: 'chen_forum_v3',
  CLAIMS: 'chen_claims_v3',
  BOOKS: 'chen_books_v3',
  CHALLENGES: 'chen_challenges_v3',
  THESIS: 'chen_thesis_v3',
  EXERCISES: 'chen_exercises_v3',
  GLOSSARY: 'chen_glossary_v3',
  MODERATION: 'chen_moderation_v3',
  REPORTS: 'chen_reports_v3',
  STUDY_PATHS: 'chen_study_paths_v3',
  SNIPPETS: 'chen_snippets_v3',
  USER: 'chen_user_session_v3',
  PREFERENCES: 'chen_prefs_v3',
};

const INITIAL_SNIPPETS: SavedSnippet[] = [
  {
    id: 'snip-1',
    articleId: 'la-asimetria-deductiva-del-falsacionismo-popperiano',
    articleTitle: 'La asimetría deductiva del falsacionismo popperiano',
    articleAuthor: 'Dra. Elena Vasconcelos',
    selectedText: 'Ninguna cantidad de observaciones de cisnes blancos puede justificar la inferencia de que todos los cisnes son blancos; sin embargo, la observación de un único cisne negro basta para refutarla concluyentemente.',
    citationId: 'cit-1',
    citationRelation: 'supports',
    citationTarget: 'Logik der Forschung (1934)',
    note: 'Principio fundamental de la asimetría lógica entre verificación y falsación.',
    savedDate: '24 de octubre, 2026',
    paragraphIndex: 2,
  },
  {
    id: 'snip-2',
    articleId: 'el-problema-de-la-detencion-de-turing-y-los-limites-del-computo',
    articleTitle: 'El problema de la detención de Turing y los límites intrínsecos del cómputo',
    articleAuthor: 'Prof. Carlos Mendoza',
    selectedText: 'No existe un algoritmo general que pueda decidir, para todo programa y toda entrada posible, si dicho programa terminará o continuará ejecutándose indefinidamente.',
    citationId: 'cit-1',
    citationRelation: 'extends',
    citationTarget: 'On Computable Numbers (1936)',
    note: 'Incompletitud algorítmica fundamental.',
    savedDate: '26 de octubre, 2026',
    paragraphIndex: 3,
  },
];

// Snippets (Saved Article Excerpts & Citations)
export const getStoredSnippets = (): SavedSnippet[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
    if (!raw) return INITIAL_SNIPPETS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SNIPPETS;
  } catch (e) {
    return INITIAL_SNIPPETS;
  }
};

export const saveStoredSnippets = (snippets: SavedSnippet[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
  } catch (e) {
    console.error('Error saving snippets:', e);
  }
};

// Study Paths (Curated & Community)
export const getStoredStudyPaths = (): CommunityStudyPath[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_PATHS);
    if (!raw) return INITIAL_STUDY_PATHS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDY_PATHS;
  } catch (e) {
    return INITIAL_STUDY_PATHS;
  }
};

export const saveStoredStudyPaths = (paths: CommunityStudyPath[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_PATHS, JSON.stringify(paths));
  } catch (e) {
    console.error('Error saving study paths:', e);
  }
};

// User Profile & Session
export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return DEMO_USERS[0];
    return JSON.parse(raw);
  } catch (e) {
    return DEMO_USERS[0];
  }
};

export const saveStoredUser = (user: UserProfile | null) => {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error saving user session:', e);
  }
};

// Articles
export const getStoredArticles = (): Article[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!raw) return INITIAL_ARTICLES;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ARTICLES;
  }
};

export const saveStoredArticles = (articles: Article[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.error('Error saving articles:', e);
  }
};

// Knowledge Gaps
export const getStoredGaps = (): KnowledgeGap[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAPS);
    if (!raw) return INITIAL_KNOWLEDGE_GAPS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_KNOWLEDGE_GAPS;
  }
};

export const saveStoredGaps = (gaps: KnowledgeGap[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GAPS, JSON.stringify(gaps));
  } catch (e) {
    console.error('Error saving gaps:', e);
  }
};

// Flashcards
export const getStoredFlashcards = (): Flashcard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (!raw) return INITIAL_FLASHCARDS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FLASHCARDS;
  }
};

export const saveStoredFlashcards = (cards: Flashcard[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Error saving flashcards:', e);
  }
};

// Forum
export const getStoredForumThreads = (): ForumThread[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FORUM);
    if (!raw) return INITIAL_FORUM_THREADS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FORUM_THREADS;
  }
};

export const saveStoredForumThreads = (threads: ForumThread[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FORUM, JSON.stringify(threads));
  } catch (e) {
    console.error('Error saving forum threads:', e);
  }
};

// Claims
export const getStoredClaims = (): ClaimRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    if (!raw) return INITIAL_CLAIMS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CLAIMS;
  }
};

export const saveStoredClaims = (claims: ClaimRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error('Error saving claims:', e);
  }
};

// Books
export const getStoredBooks = (): FreeBook[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) return INITIAL_BOOKS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BOOKS;
  }
};

export const saveStoredBooks = (books: FreeBook[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Error saving books:', e);
  }
};


// Challenges
export const getStoredChallenges = (): PersonalChallenge[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (!raw) return INITIAL_CHALLENGES;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CHALLENGES;
  }
};

export const saveStoredChallenges = (challenges: PersonalChallenge[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error('Error saving challenges:', e);
  }
};

// Thesis
export const getStoredThesis = (): ThesisAntithesisItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THESIS);
    if (!raw) return INITIAL_THESIS_ITEMS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_THESIS_ITEMS;
  }
};

export const saveStoredThesis = (items: ThesisAntithesisItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THESIS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving thesis items:', e);
  }
};

// Moderation
export const getStoredModerationLog = (): ModerationLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODERATION);
    if (!raw) return INITIAL_MODERATION_LOG;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MODERATION_LOG;
  }
};

export const saveStoredModerationLog = (entries: ModerationLogEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MODERATION, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving moderation log:', e);
  }
};

// Reports
export const getStoredReports = (): ReportItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveStoredReports = (reports: ReportItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Error saving reports:', e);
  }
};

// Preferences
export const getStoredPreferences = (): UserPreferences => {
  const defaultPrefs: UserPreferences = {
    language: 'es',
    theme: 'light',
    fontFamily: 'serif',
    assistedReading: false,
    lineFocus: false,
    ultraLightMode: false,
    visualMode: true,
    textSize: 'standard',
    defaultLicense: 'CC BY-SA 4.0',
    demoMode: true,
    activeView: 'home',
    selectedArticleId: null,
    selectedAuthorId: null,
    selectedAreaId: null,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw);
    const merged = { ...defaultPrefs, ...parsed };
    if (merged.ultraLightMode) {
      merged.visualMode = false;
    } else if (merged.visualMode === undefined) {
      merged.visualMode = true;
    }
    return merged;
  } catch (e) {
    return defaultPrefs;
  }
};

export const saveStoredPreferences = (prefs: UserPreferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
};

// Exports
export const exportAllDataAsJson = () => {
  const exportPayload = {
    exportDate: new Date().toISOString(),
    platform: 'Chen — Conocimiento Libre (AGPLv3)',
    pledge: 'Sin publicidad. Sin algoritmos de engagement. Sin muros de pago.',
    articles: getStoredArticles(),
    knowledgeGaps: getStoredGaps(),
    flashcards: getStoredFlashcards(),
    challenges: getStoredChallenges(),
    thesisItems: getStoredThesis(),
    forumThreads: getStoredForumThreads(),
    moderationLog: getStoredModerationLog(),
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chen-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportAllArticlesAsMarkdownBundle = () => {
  const articles = getStoredArticles();
  let fullMarkdown = `# Exportación de Artículos y Notas de Chen\n\nFecha: ${new Date().toLocaleDateString()}\nLicencia general: CC BY-SA 4.0 / Abierta\n\n---\n\n`;

  articles.forEach((art) => {
    fullMarkdown += `## ${art.title}\n`;
    fullMarkdown += `> ${art.subtitle}\n\n`;
    fullMarkdown += `- **Autor**: ${art.author.name}\n`;
    fullMarkdown += `- **Área**: ${art.area}\n`;
    fullMarkdown += `- **Nivel**: ${art.level}\n`;
    fullMarkdown += `- **Licencia**: ${art.license}\n`;
    fullMarkdown += `- **Estado epistémico**: ${art.epistemicStatus}\n`;
    fullMarkdown += `- **Fecha**: ${art.publishedDate} (Versión ${art.versionNumber})\n\n`;
    fullMarkdown += `${art.contentMarkdown}\n\n`;
    if (art.citations.length > 0) {
      fullMarkdown += `### Citas y Evidencias\n`;
      art.citations.forEach((c) => {
        fullMarkdown += `- [${c.relation.toUpperCase()}] **${c.targetArticleTitle}** (${c.targetAuthor}): "${c.quoteText}" — ${c.explanation}\n`;
      });
      fullMarkdown += `\n`;
    }
    fullMarkdown += `---\n\n`;
  });

  const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chen-articulos-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

export const resetToSeedData = () => {
  localStorage.clear();
  window.location.reload();
};
