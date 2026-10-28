import { Article, Author, ModerationAuditLog, Citation } from '../types';
import { INITIAL_ARTICLES, INITIAL_AUTHORS, INITIAL_AUDIT_LOGS } from '../data/initialData';

const STORAGE_KEYS = {
  ARTICLES: 'chen_v1_articles_nuclear',
  AUTHORS: 'chen_v1_authors_nuclear',
  AUDIT_LOGS: 'chen_v1_audit_logs_nuclear',
  THEME: 'chen_theme_mode',
};

// Deterministic fast SHA-256 computation in JS without external dependencies
export async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, 'a');
}

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer artículos en almacenamiento', e);
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.error('Error al guardar artículos', e);
  }
}

export function getStoredAuthors(): Author[] {
  if (typeof window === 'undefined') return INITIAL_AUTHORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTHORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(INITIAL_AUTHORS));
      return INITIAL_AUTHORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer autores', e);
    return INITIAL_AUTHORS;
  }
}

export function saveStoredAuthors(authors: Author[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
  } catch (e) {
    console.error('Error al guardar autores', e);
  }
}

export function getStoredAuditLogs(): ModerationAuditLog[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer registros de auditoría', e);
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveStoredAuditLogs(logs: ModerationAuditLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error al guardar registros de auditoría', e);
  }
}

export function resetAllToInitial(): { articles: Article[]; authors: Author[]; auditLogs: ModerationAuditLog[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(INITIAL_AUTHORS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  return {
    articles: INITIAL_ARTICLES,
    authors: INITIAL_AUTHORS,
    auditLogs: INITIAL_AUDIT_LOGS,
  };
}

/**
 * Simula el borrado RGPD (Art. 17 - Derecho al Olvido) sin romper citas ni hashes de versión.
 * Sustituye la PII por el formato exacto requerido:
 * "Autor Retirado [Anonimizado] (anon-8f3a9c...)"
 */
export function simulateGdprErasure(authorId: string): {
  updatedAuthors: Author[];
  updatedArticles: Article[];
  erasedAuthor: Author | null;
} {
  const authors = getStoredAuthors();
  const articles = getStoredArticles();

  const authorIndex = authors.findIndex((a) => a.id === authorId);
  if (authorIndex === -1) {
    return { updatedAuthors: authors, updatedArticles: articles, erasedAuthor: null };
  }

  const targetAuthor = authors[authorIndex];
  const shortHash = Math.abs(
    targetAuthor.id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).substring(0, 8);
  const anonIdentifier = `anon-${shortHash}`;
  const anonDisplayName = `Autor Retirado [Anonimizado] (${anonIdentifier})`;

  const updatedAuthor: Author = {
    ...targetAuthor,
    name: anonDisplayName,
    handle: anonIdentifier,
    email: `${anonIdentifier}@anonimizado.local`,
    role: 'Autor Retirado bajo Derecho al Olvido (RGPD Art. 17)',
    githubUser: undefined,
    orcidId: undefined,
    avatarUrl: undefined,
    isErased: true,
    erasedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    anonIdentifier,
  };

  const updatedAuthors = [...authors];
  updatedAuthors[authorIndex] = updatedAuthor;

  // Actualizar artículos: anonimiza el autor preservando el texto, versiones y hashes
  const updatedArticles = articles.map((art) => {
    let modified = false;
    let author = art.author;
    if (author.id === authorId) {
      author = updatedAuthor;
      modified = true;
    }

    // Actualizar citas entrantes preservando el grafo
    const citedByInbound = art.citedByInbound.map((cit) => {
      if (cit.sourceAuthorHandle === targetAuthor.handle || cit.sourceAuthorName === targetAuthor.name) {
        modified = true;
        return {
          ...cit,
          sourceAuthorName: anonDisplayName,
          sourceAuthorHandle: anonIdentifier,
        };
      }
      return cit;
    });

    // Actualizar citas salientes
    const citationsOutbound = art.citationsOutbound.map((cit) => {
      if (cit.targetAuthorName === targetAuthor.name) {
        modified = true;
        return {
          ...cit,
          targetAuthorName: anonDisplayName,
        };
      }
      return cit;
    });

    if (modified) {
      return {
        ...art,
        author,
        citedByInbound,
        citationsOutbound,
      };
    }
    return art;
  });

  saveStoredAuthors(updatedAuthors);
  saveStoredArticles(updatedArticles);

  return {
    updatedAuthors,
    updatedArticles,
    erasedAuthor: updatedAuthor,
  };
}
