export type EpistemicStatus = 'fact' | 'hypothesis' | 'opinion';
export type CitationRelation = 'supports' | 'contradicts' | 'extends';
export type OpenLicense = 'CC BY 4.0' | 'CC BY-SA 4.0' | 'CC0 1.0';

export interface Author {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: string;
  githubUser?: string;
  orcidId?: string;
  avatarUrl?: string;
  isErased?: boolean;
  erasedAt?: string;
  anonIdentifier?: string;
}

export interface Citation {
  id: string;
  sourceArticleId: string;
  sourceArticleSlug: string;
  sourceArticleTitle: string;
  sourceVersionId: string;
  sourceVersionHash: string;
  sourceAuthorName: string;
  sourceAuthorHandle: string;
  targetArticleId: string;
  targetArticleSlug: string;
  targetArticleTitle: string;
  targetVersionId: string;
  targetVersionHash: string;
  targetAuthorName: string;
  quotedSnippet: string;
  relation: CitationRelation;
  reasoning: string;
  createdAt: string;
}

export interface ArticleVersion {
  id: string;
  versionNumber: string;
  contentHash: string;
  date: string;
  authorName: string;
  reason: string;
  contentMarkdown: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: Author;
  license: OpenLicense;
  epistemicStatus: EpistemicStatus;
  epistemicNote?: string;
  currentVersionNumber: string;
  currentVersionHash: string;
  versions: ArticleVersion[];
  contentMarkdown: string;
  readTimeMinutes: number;
  publishedDate: string;
  lastUpdatedDate: string;
  citationsOutbound: Citation[];
  citedByInbound: Citation[];
}

export interface ModerationAuditLog {
  id: string;
  incidentHash: string;
  targetArticleId: string;
  targetArticleTitle: string;
  targetVersionHash: string;
  reporterAnonHash: string;
  violationType: 'plagiarism' | 'hate_speech' | 'spam' | 'misattribution';
  actionTaken: 'version_unlisted' | 'metadata_redacted' | 'dismissed';
  moderatorRole: string;
  date: string;
  publicRationale: string;
}
