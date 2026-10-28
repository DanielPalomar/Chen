export type EpistemicStatus = 'fact' | 'hypothesis' | 'opinion';
export type CitationRelation = 'supports' | 'contradicts' | 'extends';
export type LicenseType = 'CC BY-SA 4.0' | 'CC BY 4.0' | 'CC0 1.0';

export interface Author {
  id: string;
  handle: string; // e.g., "elena-vasconcelos" o "anon-8f3a9c21b4e091a2"
  realName: string; // e.g., "Dra. Elena Vasconcelos" o "Autor Retirado [Anonimizado]"
  roleAndAffiliation: string; // e.g., "Investigadora en Epistemología · CSIC"
  githubUser?: string | null;
  orcidId?: string | null;
  isVerified: boolean;
  isAnonymized: boolean; // True cuando se ejecuta el borrado RGPD Art. 17
  erasedAt?: string | null;
}

export interface ArticleVersion {
  versionId: string; // e.g., "ver-pop-v1"
  articleId: string;
  versionNumber: number;
  title: string;
  subtitle: string;
  area: 'Epistemología' | 'Sistemas Distribuidos' | 'Filosofía de la Ciencia' | 'Criptografía y Privacidad';
  contentMarkdown: string; // Mínimo 3-4 párrafos ricos por artículo semilla
  contentHash: string; // Hash SHA-256 hex (64 caracteres)
  epistemicStatus: EpistemicStatus;
  license: LicenseType;
  authorId: string;
  createdAt: string;
  readingTimeMinutes: number;
}

export interface Citation {
  id: string;
  sourceVersionId: string; // Versión del artículo citante
  targetVersionId: string; // Versión del artículo citado
  relation: CitationRelation; // 'supports' ([+ Apoya]), 'contradicts' ([- Contradice]), 'extends' ([→ Amplía])
  quotedSnippet: string; // Fragmento exacto del contentMarkdown de targetVersionId
  reasoning: string; // 1-2 frases justificando la relación
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetVersionId: string;
  reporterHandle: string;
  reason: 'unattributed_plagiarism' | 'fabricated_citation' | 'personal_attack' | 'spam';
  description: string;
  status: 'pending_review' | 'resolved';
  createdAt: string;
}

export interface DatabaseState {
  authors: Author[];
  articles: ArticleVersion[];
  citations: Citation[];
  reports: ModerationReport[];
}
