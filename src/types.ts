export type EpistemicStatus = 'fact' | 'hypothesis' | 'opinion' | 'ai-generated';
export type CitationRelation = 'supports' | 'contradicts' | 'extends';
export type ContentLevel = 'intro' | 'intermediate' | 'advanced';
export type OpenLicense =
  | 'CC BY 4.0'
  | 'CC BY-SA 4.0'
  | 'CC0 1.0'
  | 'CC BY-NC 4.0'
  | 'CC BY-ND 4.0';
export const CLOSED_LICENSES: { id: OpenLicense; name: string; description: string }[] = [
  { id: 'CC BY 4.0', name: 'CC BY 4.0', description: 'Atribución completa con libre adaptación.' },
  { id: 'CC BY-SA 4.0', name: 'CC BY-SA 4.0', description: 'Atribución y compartir igual (Copyleft).' },
  { id: 'CC0 1.0', name: 'CC0 1.0', description: 'Dominio Público universal.' },
  { id: 'CC BY-NC 4.0', name: 'CC BY-NC 4.0', description: 'Atribución no comercial.' },
  { id: 'CC BY-ND 4.0', name: 'CC BY-ND 4.0', description: 'Atribución sin obras derivadas.' },
];
export interface SupporterRecord {
  id: string;
  name: string;
  date: string;
  note: string;
  amount?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  avatarInitials: string;
  bannerUrl?: string;
  areas?: string[];
  githubVerified: boolean;
  githubUser?: string;
  orcidVerified?: boolean;
  orcidId?: string;
  linkedinUrl?: string;
  personalUrl?: string;
  mastodonUrl?: string;
  isDemoUser?: boolean;
  
  // External direct donation configuration
  donationLinks?: {
    kofi?: string;
    liberapay?: string;
    paypal?: string;
    githubSponsors?: string;
    cryptoAddress?: string;
  };
  donationsPublic?: boolean;
  donationsMessage?: string;
  donationsGoal?: string;
  supportersList?: SupporterRecord[];

  // Epistemic community contributions
  communityStats?: {
    citationsGivenCount: number;
    changedMindCount: number;
    gapsAnsweredCount: number;
    articlesPublishedCount: number;
    threadsCreatedCount: number;
    reviewsDoneCount: number;
  };
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  role: string;
  areas: string[];
  githubUser?: string;      // Verified via OAuth (Green verified chip)
  orcidId?: string;         // Verified via OAuth for researchers
  linkedinUrl?: string;     // Explicitly marked "Not verified"
  personalUrl?: string;     // Explicitly marked "Not verified"
  kofiOrLiberapay?: string; // Direct external support outside platform
  changedMindCount: number; // "I changed my mind" public corrections counter
  citationsReceivedCount: number;
  learningPathsCompleted: number;
  reputationByArea?: Record<string, number>;
}

export interface Citation {
  id: string;
  targetArticleId?: string;
  targetArticleTitle: string;
  targetAuthor: string;
  relation: CitationRelation;
  quoteText: string;
  explanation: string;
  externalUrl?: string;
  archiveUrl?: string;     // Internet Archive snapshot status
  linkStatus?: 'ok' | 'archived' | 'checking';
}

export interface VideoChapter {
  time: string;
  seconds: number;
  title: string;
}

export interface VideoEmbed {
  title: string;
  embedUrl: string;
  provider: 'youtube' | 'peertube';
  chapters: VideoChapter[];
  transcriptExcerpt: string;
}

export interface ContentVersion {
  id: string;
  versionNumber: string;
  date: string;
  authorName: string;
  reason: string;
  diffSummary?: string;
}

export interface CorrectionNotice {
  date: string;
  detail: string;
  previousStance: string;
  newStance: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  contentMarkdown: string;
  author: Author;
  areaId: string;
  area: string;
  level: ContentLevel;
  prerequisites?: { id: string; title: string }[];
  license: OpenLicense;
  epistemicStatus: EpistemicStatus;
  epistemicNote: string;
  aiDeclared: boolean;
  visibility: 'public' | 'unlisted' | 'private';
  readTimeMinutes: number;
  publishedDate: string;
  lastUpdatedDate: string;
  versionNumber: string;
  versions?: ContentVersion[];
  corrections?: CorrectionNotice[];
  citations: Citation[];
  citedByCount?: number;
  videoEmbed?: VideoEmbed;
  discussionsCount?: number;
}

export interface KnowledgeArea {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  moderators: {
    name: string;
    role: string;
    githubUser?: string;
  }[];
  articleCount: number;
  gapCount: number;
}

export interface KnowledgeGapAnswer {
  id: string;
  authorName: string;
  authorRole: string;
  isGithubVerified?: boolean;
  date: string;
  content: string;
  supportingCitations: string[];
}

export interface KnowledgeGap {
  id: string;
  title: string;
  areaId: string;
  area: string;
  authorName: string;
  date: string;
  whatIReadFirst: string;
  myHypothesis: string;
  epistemicStatus: EpistemicStatus;
  answers: KnowledgeGapAnswer[];
  similarConcepts: string[];
  status: 'unanswered' | 'investigating' | 'answered';
}

export interface Flashcard {
  id: string;
  articleId?: string;
  topic: string;
  area: string;
  question: string;
  answer: string;
  intervalDays: number;
  repetitionCount: number;
  nextReviewDate: string;
}

export interface ForumReply {
  id: string;
  author: string;
  authorRole: string;
  isGithubVerified?: boolean;
  date: string;
  content: string;
}

export interface ForumThread {
  id: string;
  title: string;
  category: 'Epistemología' | 'Ciencias' | 'Computación' | 'Debate Abierto' | 'Propuestas Chen';
  author: string;
  authorRole: string;
  date: string;
  content: string;
  replies: ForumReply[];
}

export interface ClaimRecord {
  id: string;
  code: string; // e.g. "REC-2026-0043"
  date: string;
  consumerPseudonym: string; // Anonymized for public privacy (e.g. "Ciudadana M.V.")
  type: 'reclamo' | 'queja' | 'sugerencia';
  isPublic: boolean;         // Only shown publicly if user expressly ticked "make this public"
  detail: string;
  request: string;
  status: 'recibido' | 'en_tramite' | 'atendido';
  responseDate?: string;
  officialReply?: string;
}

export interface ModerationLogEntry {
  id: string;
  date: string;
  action: 'retirada' | 'aviso' | 'correccion_etiqueta' | 'suspension';
  targetType: 'articulo' | 'comentario' | 'cuenta';
  targetTitle: string;
  ruleViolated: string;
  rationale: string;
  moderator: string;
  status: 'firme' | 'en_apelacion' | 'resuelta';
}

export interface ReportItem {
  id: string;
  targetId: string;
  targetType: 'articulo' | 'comentario' | 'gap';
  targetTitle: string;
  reason: 'plagio' | 'falta_citas' | 'ataque_personal' | 'linea_roja' | 'etiqueta_incorrecta';
  detail: string;
  reporterPseudonym: string;
  date: string;
  status: 'new' | 'in_review' | 'resolved';
}

export interface FreeBook {
  id: string;
  title: string;
  author: string;
  language: 'Español' | 'Inglés' | 'Francés' | 'Alemán' | 'Portugués';
  topic: 'Matemáticas' | 'Física' | 'Computación' | 'Filosofía' | 'Biología' | 'Ciencias Sociales' | 'Literatura';
  sourcePlatform: 'OpenStax' | 'Proyecto Gutenberg' | 'LibreTexts' | 'MIT OCW' | 'Internet Archive' | 'arXiv';
  formats: ('PDF' | 'EPUB' | 'Web')[];
  license: string;
  downloadUrl: string;
  description: string;
  pagesCount: number;
  year: number;
  coverAccent: string;
}

export interface OpenRepositoryItem {
  id: string;
  name: string;
  url: string;
  languages: ('Español' | 'Inglés' | 'Francés' | 'Alemán' | 'Portugués' | 'Multilingüe')[];
  topics: ('General' | 'Ciencias' | 'Humanidades' | 'Matemáticas' | 'Computación' | 'Archivos Históricos')[];
  description: string;
  licenseType: string;
  institution: string;
  highlightCount: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface PersonalChallenge {
  id: string;
  title: string;
  goal: string;
  deadline: string;
  isPublic: boolean;
  milestones: Milestone[];
}

export interface InlineComment {
  id: string;
  author: string;
  authorRole: string;
  isGithubVerified?: boolean;
  date: string;
  content: string;
}

export interface InlineDiscussion {
  id: string;
  articleId: string;
  version: string;
  selectedText: string;
  anchorParagraph: number;
  comments: InlineComment[];
}

export interface ThesisAntithesisItem {
  id: string;
  title: string;
  area: string;
  thesisAuthor: string;
  thesisThesis: string;
  thesisArgument: string;
  falsifiabilityCondition: string; // "What evidence would make me change my mind?"
  antithesisAuthor: string;
  antithesisThesis: string;
  antithesisArgument: string;
  evidenceLinks: { title: string; url: string; relation: CitationRelation }[];
}

export interface ExerciseItem {
  id: string;
  articleId?: string;
  topic: string;
  question: string;
  reasonedSolution: string;
  hint?: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  area: string;
  relatedArticleId?: string;
}

export interface UserPreferences {
  language: 'es' | 'en';
  theme: 'light' | 'sepia' | 'dark';
  fontFamily: 'serif' | 'sans' | 'mono';
  assistedReading: boolean;
  lineFocus: boolean;
  textSize: 'standard' | 'large';
  defaultLicense: OpenLicense;
  demoMode: boolean;
  activeView:
    | 'home'
    | 'article'
    | 'areas'
    | 'area_detail'
    | 'books'
    | 'repositories'
    | 'gaps'
    | 'forum'
    | 'study_path'
    | 'challenges'
    | 'thesis'
    | 'claims'
    | 'editor'
    | 'profile'
    | 'my_profile'
    | 'moderation'
    | 'reputation'
    | 'red_lines'
    | 'sustainability'
    | 'settings'
    | 'manifesto'
    | 'search';
  selectedArticleId: string | null;
  selectedAuthorId: string | null;
  selectedAreaId: string | null;
}
