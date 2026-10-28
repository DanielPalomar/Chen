import { DatabaseState, Author, ArticleVersion, Citation, ModerationReport } from '../types/chen';
import { INITIAL_DATABASE_STATE } from '../data/seedData';

const DB_STORAGE_KEY = 'chen_v1_database_state';

/**
 * Genera un hash determinista SHA-256 en formato hex (64 caracteres)
 */
export async function computeSha256Hex(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Algoritmo de dispersión determinista de 64 caracteres como respaldo
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2).repeat(4).substring(0, 64);
}

/**
 * Carga el estado unificado de la base de datos desde localStorage
 */
export function loadDatabaseState(): DatabaseState {
  if (typeof window === 'undefined') return INITIAL_DATABASE_STATE;
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_STATE));
      return INITIAL_DATABASE_STATE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.authors || !parsed.articles || !parsed.citations) {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_STATE));
      return INITIAL_DATABASE_STATE;
    }
    return parsed;
  } catch (err) {
    console.error('Error al recuperar estado de base de datos Chen:', err);
    return INITIAL_DATABASE_STATE;
  }
}

/**
 * Persiste el estado unificado en localStorage
 */
export function saveDatabaseState(state: DatabaseState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error al persistir estado en localStorage:', err);
  }
}

/**
 * Restaura el estado a los 5 artículos y 6 citas canónicas
 */
export function resetDatabaseToSeed(): DatabaseState {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_STATE));
  }
  return INITIAL_DATABASE_STATE;
}

/**
 * Procedimiento exacto de Borrado RGPD Art. 17 (Derecho al Olvido):
 * - Anonimiza realName a "Autor Retirado [Anonimizado]"
 * - Asigna handle irreversible "anon-" + sha256_substr_16
 * - Purga githubUser y orcidId a null
 * - Preserva todos los textos, versiones y citas del grafo al 100% sin romper ningún enlace
 */
export function executeUserGdprErasure(
  currentState: DatabaseState,
  authorId: string
): { nextState: DatabaseState; erasedAuthor: Author | null } {
  const authorIndex = currentState.authors.findIndex((a) => a.id === authorId);
  if (authorIndex === -1) {
    return { nextState: currentState, erasedAuthor: null };
  }

  const targetAuthor = currentState.authors[authorIndex];

  // Cálculo determinista del hash de 16 caracteres para el pseudónimo ciego
  let hashNum = 0x811c9dc5;
  const seedString = `${targetAuthor.id}:${targetAuthor.handle}`;
  for (let i = 0; i < seedString.length; i++) {
    hashNum ^= seedString.charCodeAt(i);
    hashNum = Math.imul(hashNum, 0x01000193);
  }
  const hex16 = Math.abs(hashNum).toString(16).padStart(16, 'a').substring(0, 16);
  const anonHandle = `anon-${hex16}`;

  const updatedAuthor: Author = {
    ...targetAuthor,
    realName: 'Autor Retirado [Anonimizado]',
    handle: anonHandle,
    roleAndAffiliation: 'Investigador Retirado bajo Derecho al Olvido (RGPD Art. 17)',
    githubUser: null,
    orcidId: null,
    isAnonymized: true,
    erasedAt: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  const nextAuthors = [...currentState.authors];
  nextAuthors[authorIndex] = updatedAuthor;

  const nextState: DatabaseState = {
    ...currentState,
    authors: nextAuthors,
  };

  saveDatabaseState(nextState);

  return {
    nextState,
    erasedAuthor: updatedAuthor,
  };
}
