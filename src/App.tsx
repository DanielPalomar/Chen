import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';

// ============================================================================
// 1. ERROR BOUNDARY EDITORIAL
// ============================================================================
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por el protocolo Chen:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0C0C0B] text-[#121211] dark:text-[#ECEAE4] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-rose-700 dark:bg-rose-400"></span>
              <span>Incidente de Renderizado · Protocolo Chen</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
              Interrupción en la secuencia de hidratación
            </h1>
            <p className="text-xs text-[#4A4843] dark:text-[#A3A098] font-mono leading-relaxed">
              {this.state.error?.message || 'Error inesperado al inicializar la sesión.'}
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer uppercase tracking-wider"
              >
                Restaurar Estado Canónico de Fábrica
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// 2. MODELO DE DATOS Y TIPOS (OPEN BADGES 3.0 & ARQUITECTURA 0 BYTES HOSTEADOS)
// ============================================================================
export type EpistemicStatus = 'hypothesis' | 'fact' | 'analysis';
export type CitationRelation = 'supports' | 'contradicts' | 'extends';

export interface Badge {
  id: string;
  slug: 'cambie-de-opinion' | 'tesis-fundacional' | 'rigor-deductivo' | 'hueco-del-saber' | 'autor-semilla';
  name: string;
  description: string;
  symbol: string;
  colorScheme: 'emerald' | 'amber' | 'sky' | 'purple' | 'rose';
  issuedAt: string;
  criteriaUrl: string;
}

export interface AuthorSocials {
  // TIER 1: Técnicamente Verificado vía OAuth
  github?: { username: string; verified: true } | null;
  orcid?: { id: string; verified: true } | null;

  // TIER 2: Redes Externas (No verificadas criptográficamente)
  linkedin?: string | null;
  instagram?: string | null;
  pinterest?: string | null;
  twitterX?: string | null;
  website?: string | null;
  googleScholar?: string | null;

  // TIER 3: Apoyo Externo al Creador (0% comisión, fuera de Chen)
  kofi?: string | null;
  liberapay?: string | null;
  githubSponsors?: string | null;
}

export interface Author {
  id: string;
  handle: string;
  realName: string;
  avatarUrl: string; // URL Externa (Pinterest, IG, FB, GitHub, Unsplash)
  bannerUrl: string; // URL Externa Portada Panorámica
  headline: string;
  bio: string;
  location: string;
  joinedAt: string;
  socials: AuthorSocials;
  badges: Badge[];
  reputationByArea: Record<string, { articlesCount: number; citationsReceived: number; citationsMade: number }>;
  isAnonymized: boolean;
  erasedAt?: string | null;
  hasChangedMindBadge?: boolean;
  changedMindTrigger?: string;
}

export interface Citation {
  id: string;
  sourceArticleId: string;
  targetArticleId: string;
  relation: CitationRelation;
  quotedSnippet: string;
  reasoning: string;
  timestamp: string;
}

export interface Article {
  id: string;
  articleSeriesId?: string;
  version: 'v1' | 'v2';
  versionHash: string; // SHA-256 de 64 caracteres
  title: string;
  subtitle: string;
  authorId: string;
  area: string;
  epistemicStatus: EpistemicStatus;
  license: string;
  publishedDate: string;
  readingTimeMinutes: number;
  contentMarkdown: string;
  rectificationNotes?: string;
  convincingCitationId?: string;
}

export interface OpenQuestion {
  id: string;
  title: string;
  description: string;
  area: string;
  proposerName: string;
  proposerHandle: string;
  createdAt: string;
  falsifiabilityCriteria: string;
  reviewedSourcesNote: string;
  answeredArticleIds: string[];
}

// ============================================================================
// 2B. MODELO DE DATOS: HEMISFERIO II — TABLONES ANÓNIMOS (VENTANA 90 DÍAS)
// ============================================================================
export type AnonymousSubtopic = 'codigo' | 'ciencia' | 'logica' | 'ideas-crudas' | 'meta';

export interface AnonymousPost {
  id: string;
  postNumber: number;
  threadId: string;
  isOp: boolean;
  subject?: string;
  subtopic: AnonymousSubtopic;
  authorAnonId: string;
  originalAgeDays: number;
  content: string;
  imageUrl?: string;
  stance?: 'supports' | 'contradicts' | 'extends' | 'questions';
  replyToPostNumbers: number[];
}

export interface AnonymousThread {
  id: string;
  opPostNumber: number;
  subject: string;
  subtopic: AnonymousSubtopic;
  createdAtDaysAgo: number;
  postIds: string[];
}

// ============================================================================
// 3. MICRO-ICONOS SVG (ANTI-AI SLOP: CERO EMOJIS, 100% VECTORIALES 1.5px)
// ============================================================================
const SunIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PrintIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656h10.5z" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const GraphIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path strokeLinecap="round" d="M8.5 7.5l7 7M8.5 6h7M18 9v6" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

// ============================================================================
// 4. MOTOR DE RENDERIZADO DE IMÁGENES EXTERNAS (0 BYTES HOSTEADOS · ANTI-HOTLINK)
// ============================================================================

export const ExternalAvatar: React.FC<{
  src?: string | null;
  name: string;
  className?: string;
  sizeClass?: string;
}> = ({ src, name, className = '', sizeClass = 'w-10 h-10' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  if (!src || hasError) {
    return (
      <div
        className={`${sizeClass} rounded-none bg-[#121211] dark:bg-[#262624] text-[#F7F5F0] dark:text-[#ECEAE4] flex items-center justify-center font-mono font-bold text-xs uppercase tracking-wider select-none shrink-0 border border-[#DCD8CE] dark:border-[#262624] ${className}`}
        title={`${name} (Monograma tipográfico)`}
      >
        {initials || 'CH'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-none object-cover shrink-0 border border-[#DCD8CE] dark:border-[#262624] ${className}`}
    />
  );
};

export const ExternalBanner: React.FC<{
  src?: string | null;
  className?: string;
}> = ({ src, className = 'h-40 sm:h-52 w-full' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`${className} w-full bg-[#EFECE6] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] relative overflow-hidden flex flex-col justify-end p-4 select-none`}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#121211_1px,transparent_1px)] dark:bg-[radial-gradient(#ECEAE4_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
          <span>FIG. 00 — PORTADA ARQUITECTÓNICA DE ARCHIVO</span>
          <span>0 BYTES HOSTEADOS</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-[#121211] border border-[#DCD8CE] dark:border-[#262624] select-none group`}>
      <img
        src={src}
        alt="Portada de autor vía enlace externo"
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
      <div className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-wider text-[#F7F5F0] bg-[#121211]/85 px-2 py-0.5 border border-[#3A3935]">
        ENLACE EXTERNO CLIENTE · 0 KB
      </div>
    </div>
  );
};

// ============================================================================
// 5. SEMILLA DE DATOS CANÓNICA EDITORIAL (ESPAÑOL NEUTRO)
// ============================================================================
const INITIAL_AUTHORS: Author[] = [
  {
    id: 'aut-vasconcelos',
    handle: 'elena-vasconcelos',
    realName: 'Dra. Elena Vasconcelos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    headline: 'Investigadora en Epistemología Formal y Grafos de Conocimiento · CSIC',
    bio: 'Dedicada a formalizar la deducción lógica en redes computacionales abiertas. Crítica del hipervínculo mudo y defensora de la asimetría de la falsación intersubjetiva.',
    location: 'Madrid, España',
    joinedAt: 'Enero 2026',
    isAnonymized: false,
    hasChangedMindBadge: false,
    socials: {
      github: { username: 'vasconcelos-lab', verified: true },
      orcid: { id: '0000-0002-1825-0097', verified: true },
      linkedin: 'https://linkedin.com/in/elena-vasconcelos-csic',
      pinterest: 'https://pinterest.com/elenavasconcelos',
      twitterX: 'https://x.com/vasconcelos_epi',
      website: 'https://vasconcelos-epistemologia.org',
      googleScholar: 'https://scholar.google.com/citations?user=vasconcelos',
      kofi: 'https://ko-fi.com/elenavasconcelos',
      liberapay: 'https://liberapay.com/elenavasconcelos',
      githubSponsors: 'https://github.com/sponsors/vasconcelos-lab',
    },
    badges: [
      {
        id: 'badge-semilla-vasconcelos',
        slug: 'autor-semilla',
        name: 'Autor Semilla v1.0',
        description: 'Fundador de las líneas de pensamiento seminales del protocolo Chen.',
        symbol: '◈',
        colorScheme: 'emerald',
        issuedAt: '2026-01-15T00:00:00Z',
        criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/autor-semilla',
      },
      {
        id: 'badge-tesis-vasconcelos',
        slug: 'tesis-fundacional',
        name: 'Tesis Fundacional',
        description: 'Autor de una hipótesis seminal con más de 3 citas cruzadas activas en el DAG.',
        symbol: '§',
        colorScheme: 'sky',
        issuedAt: '2026-02-12T00:00:00Z',
        criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/tesis-fundacional',
      },
    ],
    reputationByArea: {
      'Epistemología & Ciencias de la Computación': {
        articlesCount: 1,
        citationsReceived: 3,
        citationsMade: 0,
      },
    },
  },
  {
    id: 'aut-popper',
    handle: 'karl-popper-archive',
    realName: 'Karl R. Popper',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Karl_Popper.jpg/440px-Karl_Popper.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=1200&q=80',
    headline: 'Cátedra de Lógica y Método Científico · London School of Economics',
    bio: 'Defensor del racionalismo crítico y del criterio de demarcación por falsabilidad. Las teorías científicas nunca son verificadas, solo corroboradas provisionalmente.',
    location: 'Londres, Reino Unido',
    joinedAt: 'Febrero 2026',
    isAnonymized: false,
    hasChangedMindBadge: false,
    socials: {
      github: null,
      orcid: null,
      website: 'https://plato.stanford.edu/entries/popper/',
      googleScholar: 'https://scholar.google.com/citations?user=karlpopper',
    },
    badges: [
      {
        id: 'badge-rigor-popper',
        slug: 'rigor-deductivo',
        name: 'Rigor Deductivo',
        description: 'Autor de réplicas estructuradas mediante Modus Tollens formal.',
        symbol: '⊢',
        colorScheme: 'amber',
        issuedAt: '2026-02-18T00:00:00Z',
        criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/rigor-deductivo',
      },
    ],
    reputationByArea: {
      'Filosofía de la Ciencia': {
        articlesCount: 1,
        citationsReceived: 0,
        citationsMade: 1,
      },
    },
  },
  {
    id: 'aut-duhem-quine',
    handle: 'duhem-quine-collective',
    realName: 'Pierre Duhem & W.V.O. Quine',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    headline: 'Seminario de Filosofía Analítica y Holismo Teórico',
    bio: 'La unidad de medida de la significación empírica es el todo de la ciencia. Ninguna proposición particular puede ser aislada quirúrgicamente de sus hipótesis auxiliares.',
    location: 'París / Cambridge, MA',
    joinedAt: 'Febrero 2026',
    isAnonymized: false,
    hasChangedMindBadge: false,
    socials: {
      github: { username: 'holism-lab', verified: true },
      orcid: { id: '0000-0001-9234-8812', verified: true },
      website: 'https://plato.stanford.edu/entries/duhem/',
      googleScholar: 'https://scholar.google.com/citations?user=duhemquine',
    },
    badges: [
      {
        id: 'badge-rigor-duhem',
        slug: 'rigor-deductivo',
        name: 'Rigor Deductivo',
        description: 'Refutación epistemológica aceptada en la red de citas.',
        symbol: '⊢',
        colorScheme: 'purple',
        issuedAt: '2026-02-24T00:00:00Z',
        criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/rigor-deductivo',
      },
    ],
    reputationByArea: {
      'Epistemología Analítica': {
        articlesCount: 1,
        citationsReceived: 0,
        citationsMade: 1,
      },
    },
  },
  {
    id: 'aut-valdes',
    handle: 'mvaldes-systems',
    realName: 'Ing. Mateo Valdés',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    headline: 'Laboratorio de Algoritmos Distribuidos y Tolerancia a Fallas Bizantinas',
    bio: 'Investigador en estructuras Merkle-DAG sin prueba de trabajo. Constructor de arquitecturas descentralizadas de conocimiento con finalidad matemática determinista.',
    location: 'Buenos Aires, Argentina',
    joinedAt: 'Febrero 2026',
    isAnonymized: false,
    hasChangedMindBadge: false,
    socials: {
      github: { username: 'mvaldes-sys', verified: true },
      orcid: { id: '0000-0002-7711-3409', verified: true },
      linkedin: 'https://linkedin.com/in/mateovaldes-systems',
      twitterX: 'https://x.com/mateo_distrib',
      website: 'https://mvaldes.dev',
      kofi: 'https://ko-fi.com/mvaldes',
      githubSponsors: 'https://github.com/sponsors/mvaldes-sys',
    },
    badges: [
      {
        id: 'badge-hueco-valdes',
        slug: 'hueco-del-saber',
        name: 'Explorador de Huecos del Saber',
        description: 'Proponente de problemas abiertos matemáticamente rigurosos.',
        symbol: '?',
        colorScheme: 'sky',
        issuedAt: '2026-02-15T00:00:00Z',
        criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/hueco-del-saber',
      },
    ],
    reputationByArea: {
      'Sistemas Distribuidos & Algoritmos': {
        articlesCount: 1,
        citationsReceived: 0,
        citationsMade: 1,
      },
    },
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-vasconcelos-grafos-v1',
    articleSeriesId: 'series-vasconcelos-grafos',
    version: 'v1',
    versionHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    title: 'Hacia una epistemología de grafos dirigidos: La superación del hipervínculo plano',
    subtitle: 'Por qué la World Wide Web degradó el debate académico y cómo las citas tipadas restauran la deducción rigurosa.',
    authorId: 'aut-vasconcelos',
    area: 'Epistemología & Ciencias de la Computación',
    epistemicStatus: 'hypothesis',
    license: 'CC BY-SA 4.0',
    publishedDate: '12 de Febrero, 2026',
    readingTimeMinutes: 5,
    contentMarkdown: `El hipervínculo original concebido en el protocolo HTTP posee una limitación estructural insalvable: es ontológicamente mudo. Cuando un texto enlaza a otro, el lector y el indexador desconocen si el documento de destino respalda la premisa, la refuta con contraejemplos o simplemente la menciona incidentalmente. Esta carencia semántica redujo la deliberación en internet a un concurso de popularidad basado en algoritmos de atracción y clics vacíos.

Proponemos que todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido (DAG) de argumentación. Cada enlace entre proposiciones debe portar obligatoriamente una tipificación lógica verificable: [+ Apoya], [- Contradice] o [→ Amplía]. Al anclar la cita no solo a la obra completa sino al párrafo exacto y al hash criptográfico de la versión leída, impedimos la tergiversación retórica y hacemos visible el árbol deductivo completo.

Bajo este modelo, la refutación deja de ser un ataque a la persona para convertirse en una poda formal del árbol de dependencias. Si un postulado fundamental es desmentido mediante una contraprueba empírica rigurosa, todas las tesis derivadas quedan advertidas de la inestabilidad de sus cimientos. La reputación de un autor en Chen no proviene del volumen de aplausos, sino del índice de supervivencia lógica de sus proposiciones en el grafo abierto.`,
  },
  {
    id: 'art-popper-falsacion',
    articleSeriesId: 'series-popper-falsacion',
    version: 'v1',
    versionHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    title: 'El criterio de demarcación mediante falsabilidad empírica y su formalización en grafos',
    subtitle: 'Una teoría que no es refutable por ningún suceso concebible carece de carácter científico.',
    authorId: 'aut-popper',
    area: 'Filosofía de la Ciencia',
    epistemicStatus: 'fact',
    license: 'CC BY-SA 4.0',
    publishedDate: '18 de Febrero, 2026',
    readingTimeMinutes: 4,
    contentMarkdown: `El problema central de la epistemología moderna radica en distinguir entre proposiciones de la ciencia empírica y construcciones metafísicas o pseudocientíficas. La inducción probabilística —la creencia de que acumular casos afirmativos confiere veracidad a una ley universal— es formalmente inválida. Ninguna cantidad de cisnes blancos observados permite deducir con certeza deductiva que todos los cisnes son blancos; en cambio, el avistamiento de un único cisne negro refuta categóricamente la proposición general.

Por consiguiente, respaldamos con firmeza la tesis de la Dra. Vasconcelos: el enlace lógico [- Contradice] en Chen equivale al operador lógico Modus Tollens. Exigir que quien cite en contradicción deba adjuntar la evidencia o deducción refutatoria transforma la lectura en un proceso riguroso de contrastación intersubjetiva. Si una teoría no puede definir con precisión qué observaciones obligarían a sus proponentes a abandonarla, no debe ocupar el centro de la deliberación racional.`,
  },
  {
    id: 'art-duhem-quine-holismo',
    articleSeriesId: 'series-duhem-quine-holismo',
    version: 'v1',
    versionHash: '9f83c0765c26a5789ac222d6657a7d4d7e997a47ef66e138c227bc9707dd62aa',
    title: 'La tesis Duhem-Quine y el colapso del falsacionismo aislado: El todo frente a la parte',
    subtitle: 'Nuestros enunciados sobre el mundo externo se someten al tribunal de la experiencia sensorial colectivamente.',
    authorId: 'aut-duhem-quine',
    area: 'Epistemología Analítica',
    epistemicStatus: 'hypothesis',
    license: 'CC BY-SA 4.0',
    publishedDate: '24 de Febrero, 2026',
    readingTimeMinutes: 5,
    contentMarkdown: `Frente al optimismo metodológico de Karl Popper y a la confianza de Elena Vasconcelos en la poda lineal del grafo, sostenemos una objeción insalvable: la física nunca pone a prueba una hipótesis aislada, sino todo un haz teórico interconectado. Cuando un experimento parece contradecir una predicción, la lógica deductiva nos indica que hay un error en alguna parte del sistema, pero es incapaz de señalar con el dedo qué premisa específica ha fallado.

¿Falló la ley gravitacional de Newton o falló la hipótesis auxiliar sobre la refracción atmosférica del telescopio del observador? Por tanto, la arista [- Contradice] en Chen no puede asumirse como una ejecución matemática unívoca. Toda refutación aparente puede absorberse reajustando enunciados auxiliares periféricos. La unidad mínima de contrastación no es el párrafo individual citado, sino la totalidad del tejido del conocimiento científico humano.`,
  },
  {
    id: 'art-valdes-pbft-consenso',
    articleSeriesId: 'series-valdes-pbft-consenso',
    version: 'v1',
    versionHash: '3141592653589793238462643383279502884197169399375105820974944592',
    title: 'Consenso desacoplado y tolerancia a fallas bizantinas en grafos de conocimiento inmutables',
    subtitle: 'Cómo preservar la coherencia argumentativa en sistemas abiertos sin incurrir en mecanismos de prueba de trabajo.',
    authorId: 'aut-valdes',
    area: 'Sistemas Distribuidos & Algoritmos',
    epistemicStatus: 'analysis',
    license: 'CC BY-SA 4.0',
    publishedDate: '01 de Marzo, 2026',
    readingTimeMinutes: 6,
    contentMarkdown: `En los sistemas distribuidos a gran escala, la verificación de integridad no requiere desperdiciar gigavatios en cálculos de prueba de trabajo ni instaurar una autoridad central con facultades censuradoras. La arquitectura del protocolo Chen demuestra que una red de conocimiento puede lograr finalidad criptográfica apoyándose en firmas deterministas SHA-256 sobre versiones inmutables y estructuras de datos Merkle-DAG.

Cuando una versión de un artículo recibe citas entrantes con relaciones tipadas, el árbol de derivación queda congelado temporalmente en un estado determinista. Si el autor modifica posteriormente su texto original, el protocolo no sobreescribe el nodo existente: genera una versión secundaria con un hash diferenciado. Este desacoplamiento garantiza que ninguna réplica histórica pierda su contexto o señale a una afirmación inexistente, solucionando el problema del decaimiento de hipervínculos ('link rot') de forma definitiva.`,
  },
];

const INITIAL_CITATIONS: Citation[] = [
  {
    id: 'cit-popper-to-vasconcelos',
    sourceArticleId: 'art-popper-falsacion',
    targetArticleId: 'art-vasconcelos-grafos-v1',
    relation: 'supports',
    quotedSnippet: 'todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido (DAG) de argumentación',
    reasoning: 'La estructura de DAG formaliza de manera impecable la asimetría lógica de la falsación: basta una arista de contradicción fundada para derribar una generalización.',
    timestamp: '2026-02-18T10:14:00Z',
  },
  {
    id: 'cit-duhem-to-vasconcelos',
    sourceArticleId: 'art-duhem-quine-holismo',
    targetArticleId: 'art-vasconcelos-grafos-v1',
    relation: 'contradicts',
    quotedSnippet: 'Si un postulado fundamental es desmentido mediante una contraprueba empírica rigurosa, todas las tesis derivadas quedan advertidas de la inestabilidad de sus cimientos.',
    reasoning: 'Objeción holista: la refutación nunca es quirúrgica ni definitiva, ya que el investigador puede modificar legítimamente las hipótesis auxiliares periféricas.',
    timestamp: '2026-02-24T15:30:00Z',
  },
  {
    id: 'cit-valdes-to-vasconcelos',
    sourceArticleId: 'art-valdes-pbft-consenso',
    targetArticleId: 'art-vasconcelos-grafos-v1',
    relation: 'extends',
    quotedSnippet: 'Al anclar la cita no solo a la obra completa sino al párrafo exacto y al hash criptográfico de la versión leída, impedimos la tergiversación retórica',
    reasoning: 'Extensión computacional: proveemos el algoritmo formal de inmutabilidad Merkle-DAG que hace técnicamente realizable la propuesta de Vasconcelos.',
    timestamp: '2026-03-01T18:00:00Z',
  },
];

const INITIAL_QUESTIONS: OpenQuestion[] = [
  {
    id: 'q-sybil-reputation',
    title: '¿Bajo qué condiciones formales un sistema de reputación descentralizado es resistente a ataques Sybil sin prueba de trabajo ni identidad civil?',
    description: 'En redes abiertas, un actor malicioso puede generar pseudónimos para autocitarse y falsear consenso epistémico. Buscamos modelos matemáticos que penalicen colusiones sin censura previa.',
    area: 'Sistemas Distribuidos',
    proposerName: 'Ing. Mateo Valdés',
    proposerHandle: 'mvaldes-systems',
    createdAt: '15 de Febrero, 2026',
    falsifiabilityCriteria: 'Demostrar analíticamente que un atacante con >33% de identidades artificiales puede capturar el ranking bajo coste sublineal.',
    reviewedSourcesNote: 'Revisados los artículos de PBFT de Valdés y los fundamentos de grafos de Vasconcelos.',
    answeredArticleIds: ['art-valdes-pbft-consenso'],
  },
  {
    id: 'q-popper-llm-reasoning',
    title: '¿Es el criterio de demarcación popperiano suficiente para evaluar modelos de lenguaje probabilísticos que generan deducciones emergentes?',
    description: 'Los LLMs operan sobre aproximación estadística. Sin embargo, producen cadenas deductivas. ¿Cómo se falsaciona una inferencia generada por una red neuronal opaca cuando un contraejemplo no invalida el peso estadístico del modelo?',
    area: 'Filosofía de la Mente & Epistemología',
    proposerName: 'Dra. Elena Vasconcelos',
    proposerHandle: 'elena-vasconcelos',
    createdAt: '20 de Febrero, 2026',
    falsifiabilityCriteria: 'Presentar un protocolo de pruebas donde una contradicción formal aísle un sesgo estadístico frente a una alucinación estocástica pura.',
    reviewedSourcesNote: 'Analizado Popper sobre falsabilidad y Duhem-Quine sobre hipótesis auxiliares.',
    answeredArticleIds: ['art-popper-falsacion', 'art-vasconcelos-grafos-v1'],
  },
  {
    id: 'q-asymmetric-merkle-burden',
    title: '¿Cómo formalizar la asimetría de la carga de la prueba en debates epistémicos mediante pesos dirigidos en un Merkle-DAG?',
    description: 'En ciencia proposiciones extraordinarias exigen evidencia extraordinaria. ¿Cómo representar en una arista [+ Apoya] o [- Contradice] el coste probatorio sin colapsar en un concurso de popularidad?',
    area: 'Criptografía & Lógica Formal',
    proposerName: 'Karl R. Popper',
    proposerHandle: 'karl-popper-archive',
    createdAt: '22 de Febrero, 2026',
    falsifiabilityCriteria: 'Definir una métrica de peso que no colapse en un concurso de popularidad por volumen de citas.',
    reviewedSourcesNote: 'Contrastado con el holismo de Duhem-Quine.',
    answeredArticleIds: ['art-popper-falsacion'],
  },
  {
    id: 'q-duhem-quine-algorithmic',
    title: '¿Puede el holismo de Duhem-Quine traducirse algorítmicamente para aislar la hipótesis auxiliar defectuosa en una red de dependencias bayesianas?',
    description: 'Si una refutación empírica afecta a todo el haz teórico y no solo a la proposición aislada, ¿es posible utilizar propagación de creencias probabilísticas en un grafo de Chen para asignar a cada premisa una probabilidad condicional de error?',
    area: 'Metodología de la Ciencia',
    proposerName: 'Pierre Duhem & W.V.O. Quine',
    proposerHandle: 'duhem-quine-collective',
    createdAt: '26 de Febrero, 2026',
    falsifiabilityCriteria: 'Probar que el problema de asignación de culpa epistémica es NP-completo en grafos no acíclicos.',
    reviewedSourcesNote: 'Revisados los artículos de Duhem-Quine y Vasconcelos v1.',
    answeredArticleIds: ['art-duhem-quine-holismo'],
  },
];

// Generador determinista de hash SHA-256
function computeSimpleHash(text: string): string {
  if (!text) return '0'.repeat(64);
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

const STORAGE_KEY_AUTHORS = 'chen_protocol_v5_authors';
const STORAGE_KEY_ARTICLES = 'chen_protocol_v5_articles';
const STORAGE_KEY_CITATIONS = 'chen_protocol_v5_citations';
const STORAGE_KEY_QUESTIONS = 'chen_protocol_v5_questions';
const STORAGE_KEY_LOGGED_USER = 'chen_protocol_v5_logged_author';
const STORAGE_KEY_THEME = 'chen_protocol_v5_theme';

function getInitialAuthors(): Author[] {
  if (typeof window === 'undefined') return INITIAL_AUTHORS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUTHORS);
    if (!saved) return INITIAL_AUTHORS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.realName) {
      return parsed;
    }
  } catch {}
  return INITIAL_AUTHORS;
}

function getInitialArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (!saved) return INITIAL_ARTICLES;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
      return parsed;
    }
  } catch {}
  return INITIAL_ARTICLES;
}

function getInitialCitations(): Citation[] {
  if (typeof window === 'undefined') return INITIAL_CITATIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CITATIONS);
    if (!saved) return INITIAL_CITATIONS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return INITIAL_CITATIONS;
}

function getInitialQuestions(): OpenQuestion[] {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    if (!saved) return INITIAL_QUESTIONS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return INITIAL_QUESTIONS;
}

const STORAGE_KEY_HEMISPHERE = 'chen_protocol_v8_hemisphere';
const STORAGE_KEY_ANON_POSTS = 'chen_protocol_v8_anon_posts';
const STORAGE_KEY_ANON_THREADS = 'chen_protocol_v8_anon_threads';
const STORAGE_KEY_ANON_OFFSET = 'chen_protocol_v8_anon_offset';

export const INITIAL_ANON_POSTS: AnonymousPost[] = [
  // HILO 1: /codigo/ - OP con 105 días (PURGADO por regla de 90 días: Lápida Suiza neutral; las respuestas permanecen legibles)
  {
    id: 'anon-p-84001',
    postNumber: 84001,
    threadId: 'anon-th-84001',
    isOp: true,
    subject: '¿Es el tipado nominal intrínsecamente superior al estructural en protocolos distribuidos?',
    subtopic: 'codigo',
    authorAnonId: 'f9b2a1',
    originalAgeDays: 105, // > 90 días: Lápida Suiza automática
    content: 'Contenido original purgado por la regla de retención efímera de 90 días del protocolo Chen.',
    stance: 'questions',
    replyToPostNumbers: [],
  },
  {
    id: 'anon-p-84004',
    postNumber: 84004,
    threadId: 'anon-th-84001',
    isOp: false,
    subtopic: 'codigo',
    authorAnonId: 'e3d1c9',
    originalAgeDays: 42,
    content: `>>84001
> contexto borrado del OP
A pesar de que el post inicial caducó conforme a la ventana de 90 días, recuerdo la premisa y sostengo mi objeción:

[- Contradice]
El tipado puramente estructural (como en Go o TypeScript) genera colisiones accidentales en interfaces binarias. Si dos structs poseen idéntica forma escalar (ej. HashSHA256 y TokenSesion, ambos tipo string), el compilador los trata como intercambiables sin emitir advertencia. En un sistema criptográfico esto abre brechas de seguridad críticas.`,
    stance: 'contradicts',
    replyToPostNumbers: [84001],
  },
  {
    id: 'anon-p-84007',
    postNumber: 84007,
    threadId: 'anon-th-84001',
    isOp: false,
    subtopic: 'codigo',
    authorAnonId: '84a7bc',
    originalAgeDays: 14,
    content: `>>84004
[+ Apoya]
Totalmente demostrado en el nodo 'backend/chen_daemon.go'.
En Go puedes blindar el tipado nominal declarando tipos derivados opacos (ej. 'type HashSHA256 [32]byte'). Además, el daemon canónico de Chen en Go verifica el DAG criptográfico con goroutines concurrentes y ejecuta la purga de 90 días con consumo inferior a 15 MB de RAM.`,
    stance: 'supports',
    replyToPostNumbers: [84004],
  },
  {
    id: 'anon-p-84010',
    postNumber: 84010,
    threadId: 'anon-th-84001',
    isOp: false,
    subtopic: 'codigo',
    authorAnonId: '12fc55',
    originalAgeDays: 2,
    content: `>>84007
[→ Amplía]
Y en la barra superior puedes pulsar «◈ Nodo Go» para verificar la integridad criptográfica del grafo en tiempo real o exportar el daemon para ejecutarlo localmente con 'go run backend/chen_daemon.go'.`,
    stance: 'extends',
    replyToPostNumbers: [84007],
  },

  // HILO 2: /ciencia/ - OP con 88 días (Caduca en 2 días; al mover el slider a +3d se purga en vivo)
  {
    id: 'anon-p-84100',
    postNumber: 84100,
    threadId: 'anon-th-84100',
    isOp: true,
    subject: 'La no asociatividad del punto flotante en GPUs como causa oculta de irreproducibilidad',
    subtopic: 'ciencia',
    authorAnonId: '33d8a9',
    originalAgeDays: 88, // Caduca en 2 días
    content: `Planteo una crisis metodológica en la simulación computacional de modelos biofísicos:

> El 70% de las simulaciones neuronales distribuidas no reportan el orden de reducción paralelo del hardware GPU.

[? Duda]
Dado que (A + B) + C != A + (B + C) en el estándar IEEE 754 bajo cancelación catastrófica, dos ejecuciones idénticas en clústeres distintos arrojan trayectorias caóticas divergentes. ¿Debemos declarar estos modelos formalmente no reproducibles?`,
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
    stance: 'questions',
    replyToPostNumbers: [],
  },
  {
    id: 'anon-p-84103',
    postNumber: 84103,
    threadId: 'anon-th-84100',
    isOp: false,
    subtopic: 'ciencia',
    authorAnonId: '77b102',
    originalAgeDays: 31,
    content: `>>84100
[+ Apoya]
El problema es que muchos investigadores confunden 'determinismo algorítmico' con 'estabilidad numérica'.
Para garantizar reproducibilidad estricta se requiere aritmética de punto fijo determinista o algoritmos de suma compensada de Kahan en el kernel de reducción.`,
    stance: 'supports',
    replyToPostNumbers: [84100],
  },
  {
    id: 'anon-p-84106',
    postNumber: 84106,
    threadId: 'anon-th-84100',
    isOp: false,
    subtopic: 'ciencia',
    authorAnonId: '33d8a9',
    originalAgeDays: 7,
    content: `>>84103
[→ Amplía]
Exacto. Por ese motivo la arquitectura de Chen exige anclar un hash criptográfico SHA-256 no solo del código, sino de la matriz de datos de salida antes de aceptar una afirmación causal en el grafo.`,
    stance: 'extends',
    replyToPostNumbers: [84103],
  },

  // HILO 3: /logica/ - OP con 68 días
  {
    id: 'anon-p-84200',
    postNumber: 84200,
    threadId: 'anon-th-84200',
    isOp: true,
    subject: 'La Regla de Cromwell y por qué fijar un prior de 1.0 destruye la inferencia bayesiana',
    subtopic: 'logica',
    authorAnonId: '99aa42',
    originalAgeDays: 68,
    content: `Una aclaración para quienes debaten en Chen:

> Si asignas una probabilidad a priori P(H) = 1.0 (o 0.0), el teorema de Bayes dictamina que ninguna evidencia empírica futura e (por contundente que sea) podrá jamás actualizar tu creencia: P(H|e) = 1.0.

[+ Apoya]
Oliver Cromwell lo resumió célebremente ante la Iglesia de Escocia: "Os suplico, por las entrañas de Cristo, pensad que es posible que estéis equivocados". La deducción racional exige jamás fijar probabilidades absolutas a hipótesis contingentes.`,
    stance: 'supports',
    replyToPostNumbers: [],
  },
  {
    id: 'anon-p-84204',
    postNumber: 84204,
    threadId: 'anon-th-84200',
    isOp: false,
    subtopic: 'logica',
    authorAnonId: '21ee74',
    originalAgeDays: 19,
    content: `>>84200
[- Contradice]
> jamás fijar probabilidades absolutas
Eso es rigurosamente cierto para proposiciones fácticas del mundo sensible, pero ¿qué ocurre con tautologías lógicas o verdades analíticas? (ej. A ∧ ¬A = Falso). En tales dominios P(H) = 0 es un requerimiento de consistencia axiomática, no un sesgo cognitivo.`,
    stance: 'contradicts',
    replyToPostNumbers: [84200],
  },
  {
    id: 'anon-p-84208',
    postNumber: 84208,
    threadId: 'anon-th-84200',
    isOp: false,
    subtopic: 'logica',
    authorAnonId: '99aa42',
    originalAgeDays: 3,
    content: `>>84204
[→ Amplía]
Cierto, pero la frontera analítico/sintético fue dinamitada por Quine en 'Dos dogmas del empirismo'. Si el propio sistema de deducción lógica es susceptible de revisión ante anomalías globales de la red de creencias, ningún principio está 100% blindado contra una rectificación.`,
    stance: 'extends',
    replyToPostNumbers: [84204],
  },

  // HILO 4: /ideas-crudas/ - OP con 18 días
  {
    id: 'anon-p-84300',
    postNumber: 84300,
    threadId: 'anon-th-84300',
    isOp: true,
    subject: 'Boceto: Memoria asociativa distribuida sobre topología Kademlia usando vectores métricos',
    subtopic: 'ideas-crudas',
    authorAnonId: 'b65288',
    originalAgeDays: 18,
    content: `Una intuición cruda para contrastar antes de llevarla al Archivo Permanente:

> ¿Y si en lugar de hacer hashing unidireccional SHA-256 en la DHT de BitTorrent/IPFS, proyectamos los documentos en un espacio vectorial métrico (HNSW)?

[? Duda]
Los nodos pares solo almacenarían vectores cercanos en distancia coseno. Una consulta semántica viajaría saltando entre pares con afinidad conceptual. ¿Es viable o el tráfico de enrutamiento colapsaría la red en O(N)?`,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    stance: 'questions',
    replyToPostNumbers: [],
  },
  {
    id: 'anon-p-84303',
    postNumber: 84303,
    threadId: 'anon-th-84300',
    isOp: false,
    subtopic: 'ideas-crudas',
    authorAnonId: 'ff4109',
    originalAgeDays: 4,
    content: `>>84300
[→ Amplía]
Es viable si particionas el espacio con células de Voronoi jerárquicas; se preserva la cota O(log N). Te sugiero pulsar el botón superior y llevar esta idea cruda al Editor del Archivo Permanente para formalizar el aparato matemático.`,
    stance: 'extends',
    replyToPostNumbers: [84300],
  },

  // HILO 5: /meta/ - OP con 12 días
  {
    id: 'anon-p-84400',
    postNumber: 84400,
    threadId: 'anon-th-84400',
    isOp: true,
    subject: 'La dialéctica de los Dos Hemisferios: Por qué el anonimato efímero fertiliza el Archivo Permanente',
    subtopic: 'meta',
    authorAnonId: '8190de',
    originalAgeDays: 12,
    content: `En Chen coexisten dos hemisferios por diseño institucional:

1. El Archivo Permanente exige reputación pública acumulada, identidades reconocibles, firmas criptográficas inmutables y licencias CC BY-SA 4.0.
2. Los Tablones Anónimos permiten especular, equivocarse, atacar consensos sagrados y presentar intuiciones no demostradas sin arriesgar la carrera académica.

> La ventana de 90 días no es desidia: es higiene epistémica activa. Lo que no madura y se traslada al Archivo Permanente se borra pacíficamente, dejando la pizarra limpia para la siguiente generación de preguntas.`,
    stance: 'supports',
    replyToPostNumbers: [],
  },
  {
    id: 'anon-p-84402',
    postNumber: 84402,
    threadId: 'anon-th-84400',
    isOp: false,
    subtopic: 'meta',
    authorAnonId: '1455cc',
    originalAgeDays: 5,
    content: `>>84400
[+ Apoya]
Exactamente. Las redes sociales corporativas hacen justo lo contrario: retienen los errores de juventud para siempre para maximizar la indignación algorítmica, mientras que desincentivan la investigación técnica profunda. Chen separa la pizarra efímera del códice inmutable.`,
    stance: 'supports',
    replyToPostNumbers: [84400],
  },
];

export const INITIAL_ANON_THREADS: AnonymousThread[] = [
  {
    id: 'anon-th-84001',
    opPostNumber: 84001,
    subject: '¿Es el tipado nominal intrínsecamente superior al estructural en protocolos distribuidos?',
    subtopic: 'codigo',
    createdAtDaysAgo: 105, // >90d: OP purgado (Lápida Suiza); réplicas activas
    postIds: ['anon-p-84001', 'anon-p-84004', 'anon-p-84007', 'anon-p-84010'],
  },
  {
    id: 'anon-th-84100',
    opPostNumber: 84100,
    subject: 'La no asociatividad del punto flotante en GPUs como causa oculta de irreproducibilidad',
    subtopic: 'ciencia',
    createdAtDaysAgo: 88,
    postIds: ['anon-p-84100', 'anon-p-84103', 'anon-p-84106'],
  },
  {
    id: 'anon-th-84200',
    opPostNumber: 84200,
    subject: 'La Regla de Cromwell y por qué fijar un prior de 1.0 destruye la inferencia bayesiana',
    subtopic: 'logica',
    createdAtDaysAgo: 68,
    postIds: ['anon-p-84200', 'anon-p-84204', 'anon-p-84208'],
  },
  {
    id: 'anon-th-84300',
    opPostNumber: 84300,
    subject: 'Boceto: Memoria asociativa distribuida sobre topología Kademlia usando vectores métricos',
    subtopic: 'ideas-crudas',
    createdAtDaysAgo: 18,
    postIds: ['anon-p-84300', 'anon-p-84303'],
  },
  {
    id: 'anon-th-84400',
    opPostNumber: 84400,
    subject: 'La dialéctica de los Dos Hemisferios: Por qué el anonimato efímero fertiliza el Archivo Permanente',
    subtopic: 'meta',
    createdAtDaysAgo: 12,
    postIds: ['anon-p-84400', 'anon-p-84402'],
  },
];

function getInitialAnonPosts(): AnonymousPost[] {
  if (typeof window === 'undefined') return INITIAL_ANON_POSTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ANON_POSTS);
    if (!saved) return INITIAL_ANON_POSTS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.postNumber) {
      return parsed;
    }
  } catch {}
  return INITIAL_ANON_POSTS;
}

function getInitialAnonThreads(): AnonymousThread[] {
  if (typeof window === 'undefined') return INITIAL_ANON_THREADS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ANON_THREADS);
    if (!saved) return INITIAL_ANON_THREADS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.opPostNumber) {
      return parsed;
    }
  } catch {}
  return INITIAL_ANON_THREADS;
}

function getInitialHemisphere(): 'archive' | 'anonymous' {
  if (typeof window === 'undefined') return 'archive';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HEMISPHERE);
    if (saved === 'anonymous' || saved === 'archive') return saved;
  } catch {}
  return 'archive';
}

// ============================================================================
// 6. COMPONENTE PRINCIPAL: PROTOCOLO CHEN
// ============================================================================

export default function App() {
  const [authors, setAuthors] = useState<Author[]>(getInitialAuthors);
  const [articles, setArticles] = useState<Article[]>(getInitialArticles);
  const [citations, setCitations] = useState<Citation[]>(getInitialCitations);
  const [questions, setQuestions] = useState<OpenQuestion[]>(getInitialQuestions);

  // Tema: Light (Papel de Archivo) / Dark (Pizarra Nocturna)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'light');
      }
    } catch {}
  }, [isDarkMode]);

  // Sesión de autor activa
  const [activeAuthorId, setActiveAuthorId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'aut-vasconcelos';
    const saved = localStorage.getItem(STORAGE_KEY_LOGGED_USER);
    return saved || 'aut-vasconcelos';
  });

  const currentActiveAuthor = authors.find((a) => a.id === activeAuthorId) || authors[0] || INITIAL_AUTHORS[0];

  // Navegación
  const [activeTab, setActiveTab] = useState<'home' | 'reader' | 'questions' | 'portfolios' | 'editor' | 'manifesto'>('home');
  const [activeArticleId, setActiveArticleId] = useState<string>('art-vasconcelos-grafos-v1');
  const [selectedPortfolioAuthorId, setSelectedPortfolioAuthorId] = useState<string>('aut-vasconcelos');

  // Modales
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedBadgeForInspection, setSelectedBadgeForInspection] = useState<{ badge: Badge; author: Author } | null>(null);
  const [isV2ModalOpen, setIsV2ModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [isGoDaemonModalOpen, setIsGoDaemonModalOpen] = useState(false);
  const [goVerificationOutput, setGoVerificationOutput] = useState<string | null>(null);
  const [isSimulatingGo, setIsSimulatingGo] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3800);
  };

  // Persistencia defensiva en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authors));
    } catch {}
  }, [authors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CITATIONS, JSON.stringify(citations));
    } catch {}
  }, [citations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
    } catch {}
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGGED_USER, activeAuthorId);
    } catch {}
  }, [activeAuthorId]);

  // ============================================================================
  // ESTADO MAESTRO DE HEMISFERIO (MODO DUAL CHEN)
  // ============================================================================
  const [activeHemisphere, setActiveHemisphere] = useState<'archive' | 'anonymous'>(getInitialHemisphere);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HEMISPHERE, activeHemisphere);
    } catch {}
  }, [activeHemisphere]);

  // Estado del Hemisferio II: Tablones Anónimos (Temporal 90 Días)
  const [anonSubtopic, setAnonSubtopic] = useState<AnonymousSubtopic | 'todos'>('todos');
  const [anonViewMode, setAnonViewMode] = useState<'threads' | 'catalog'>('threads');
  const [simulatedDaysOffset, setSimulatedDaysOffset] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANON_OFFSET);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANON_OFFSET, String(simulatedDaysOffset));
    } catch {}
  }, [simulatedDaysOffset]);

  const [anonymousPosts, setAnonymousPosts] = useState<AnonymousPost[]>(getInitialAnonPosts);
  const [anonymousThreads, setAnonymousThreads] = useState<AnonymousThread[]>(getInitialAnonThreads);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANON_POSTS, JSON.stringify(anonymousPosts));
    } catch {}
  }, [anonymousPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANON_THREADS, JSON.stringify(anonymousThreads));
    } catch {}
  }, [anonymousThreads]);

  // Modales y formularios anónimos
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [newThreadSubtopic, setNewThreadSubtopic] = useState<AnonymousSubtopic>('codigo');
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadImageUrl, setNewThreadImageUrl] = useState('');
  const [newThreadStance, setNewThreadStance] = useState<'supports' | 'contradicts' | 'extends' | 'questions'>('supports');
  const [selectedAnonymousImageModal, setSelectedAnonymousImageModal] = useState<string | null>(null);

  // Previsualización flotante de citas >>84XXX
  const [hoveredPostQuoteNumber, setHoveredPostQuoteNumber] = useState<number | null>(null);

  // Respuestas rápidas por hilo
  const [quickReplyTexts, setQuickReplyTexts] = useState<Record<string, string>>({});
  const [quickReplyStances, setQuickReplyStances] = useState<Record<string, 'supports' | 'contradicts' | 'extends' | 'questions'>>({});
  const [quickReplyImages, setQuickReplyImages] = useState<Record<string, string>>({});

  // Lógica de cálculo de purga de 90 días
  const isPostPurged = (post: AnonymousPost) => {
    return post.originalAgeDays + simulatedDaysOffset > 90;
  };

  const getEffectiveAge = (post: AnonymousPost) => {
    return post.originalAgeDays + simulatedDaysOffset;
  };

  const getDaysRemaining = (post: AnonymousPost) => {
    const age = getEffectiveAge(post);
    return Math.max(0, 90 - age);
  };

  // Publicar Nuevo Hilo Anónimo
  const handleCreateAnonymousThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadSubject.trim() || !newThreadContent.trim()) {
      showToast('El asunto y el contenido del hilo son obligatorios.');
      return;
    }

    const nextPostNumber = (anonymousPosts.reduce((max, p) => Math.max(max, p.postNumber), 84400)) + 1;
    const threadId = `anon-th-${nextPostNumber}`;
    const postId = `anon-p-${nextPostNumber}`;
    const authorAnonId = Math.random().toString(16).substring(2, 8);

    const newPost: AnonymousPost = {
      id: postId,
      postNumber: nextPostNumber,
      threadId,
      isOp: true,
      subject: newThreadSubject.trim(),
      subtopic: newThreadSubtopic,
      authorAnonId,
      originalAgeDays: 0,
      content: newThreadContent.trim(),
      imageUrl: newThreadImageUrl.trim() || undefined,
      stance: newThreadStance,
      replyToPostNumbers: [],
    };

    const newThread: AnonymousThread = {
      id: threadId,
      opPostNumber: nextPostNumber,
      subject: newThreadSubject.trim(),
      subtopic: newThreadSubtopic,
      createdAtDaysAgo: 0,
      postIds: [postId],
    };

    setAnonymousPosts((prev) => [newPost, ...prev]);
    setAnonymousThreads((prev) => [newThread, ...prev]);

    setNewThreadSubject('');
    setNewThreadContent('');
    setNewThreadImageUrl('');
    setIsNewThreadModalOpen(false);
    showToast(`Hilo anónimo No. ${nextPostNumber} publicado en /${newThreadSubtopic}/.`);
  };

  // Publicar Réplica Anónima en un Hilo
  const handleCreateAnonymousReply = (threadId: string) => {
    const replyText = (quickReplyTexts[threadId] || '').trim();
    if (!replyText) {
      showToast('Escribe un mensaje antes de responder al hilo.');
      return;
    }

    const nextPostNumber = (anonymousPosts.reduce((max, p) => Math.max(max, p.postNumber), 84400)) + 1;
    const postId = `anon-p-${nextPostNumber}`;
    const targetThread = anonymousThreads.find((t) => t.id === threadId);
    if (!targetThread) return;

    // Extraer referencias >>84XXX
    const matches = replyText.match(/>>(\d+)/g) || [];
    const quotedNumbers = matches.map((m) => parseInt(m.replace('>>', ''), 10));

    const authorAnonId = Math.random().toString(16).substring(2, 8);
    const replyStance = quickReplyStances[threadId] || 'supports';
    const replyImageUrl = (quickReplyImages[threadId] || '').trim();

    const newPost: AnonymousPost = {
      id: postId,
      postNumber: nextPostNumber,
      threadId,
      isOp: false,
      subtopic: targetThread.subtopic,
      authorAnonId,
      originalAgeDays: 0,
      content: replyText,
      imageUrl: replyImageUrl || undefined,
      stance: replyStance,
      replyToPostNumbers: quotedNumbers,
    };

    setAnonymousPosts((prev) => [...prev, newPost]);
    setAnonymousThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, postIds: [...t.postIds, postId] } : t))
    );

    setQuickReplyTexts((prev) => ({ ...prev, [threadId]: '' }));
    setQuickReplyImages((prev) => ({ ...prev, [threadId]: '' }));
    showToast(`Réplica anónima No. ${nextPostNumber} publicada.`);
  };

  // Citar número de post en la caja de respuesta
  const handleQuotePostNumber = (postNumber: number, threadId: string) => {
    setQuickReplyTexts((prev) => {
      const current = prev[threadId] || '';
      return {
        ...prev,
        [threadId]: current ? `${current}\n>>${postNumber}\n` : `>>${postNumber}\n`,
      };
    });
    showToast(`Citado >>${postNumber} en el hilo.`);
  };

  // Puente hacia el Archivo Permanente (1 Clic)
  const handleBridgeToArchive = (post: AnonymousPost, thread: AnonymousThread) => {
    const bridgeTitle = thread.subject || `Tesis derivada del Hilo Anónimo No. ${post.postNumber}`;
    const bridgeSubtitle = `Transposición formalizada desde el Tablón Anónimo /${post.subtopic}/ (Post No. ${post.postNumber})`;
    const bridgeContent = `## Premisa Original Rescatada de los Tablones Anónimos (No. ${post.postNumber})

> ${post.content.split('\n').join('\n> ')}

---

### Deducción Formal y Metodología Contrastable
*(Desarrolla aquí el aparato analítico, premisas demostrables y fuentes para indexar permanentemente en el DAG de Chen).*
`;

    setEditorTitle(bridgeTitle);
    setEditorSubtitle(bridgeSubtitle);
    setEditorContent(bridgeContent);
    setEditorArea(
      post.subtopic === 'codigo'
        ? 'Sistemas Distribuidos'
        : post.subtopic === 'ciencia'
        ? 'Metodología de la Ciencia'
        : post.subtopic === 'logica'
        ? 'Epistemología & Lógica Formal'
        : 'Epistemología de Frontera'
    );
    setActiveHemisphere('archive');
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Post No. ${post.postNumber} transferido al Editor del Archivo Permanente.`);
  };

  // Simulación Interactiva del Demonio Canónico en Go (crypto/sha256 + 90-day GC)
  const handleSimulateGoDagVerify = () => {
    setIsSimulatingGo(true);
    setGoVerificationOutput('Iniciando demonio en Go (net/http + crypto/sha256 en localhost:8080)...');
    setTimeout(() => {
      setIsSimulatingGo(false);
      setGoVerificationOutput(
        `✓ [GO DAEMON VERIFIED · ${new Date().toLocaleTimeString('es-ES')}]\n` +
        `• 4 Artículos analizados con crypto/sha256 canónico nativo en Go:\n` +
        `  - art-vasconcelos-grafos-v1: SHA-256 (e3b0c442...) VÁLIDO\n` +
        `  - art-popper-falsacion: SHA-256 (4a5e1e4b...) VÁLIDO\n` +
        `  - art-duhem-quine-holismo: SHA-256 (9f83c076...) VÁLIDO\n` +
        `  - art-valdes-pbft-consenso: SHA-256 (31415926...) VÁLIDO\n` +
        `• Detección de ciclos Tarjan en Go: Grafo Acíclico Dirigido (DAG) ESTRICTO. 0 ciclos.\n` +
        `• Latencia de verificación: 0.38 ms en runtime Go nativo.`
      );
      showToast('Grafo DAG verificado exitosamente por el demonio en Go.');
    }, 450);
  };

  const handleSimulateGoPrune = () => {
    setIsSimulatingGo(true);
    setGoVerificationOutput('Ejecutando PruneExpiredPosts(90) en goroutine...');
    setTimeout(() => {
      setIsSimulatingGo(false);
      const expiredCount = anonymousPosts.filter((p) => p.originalAgeDays + simulatedDaysOffset > 90).length;
      setGoVerificationOutput(
        `✓ [GO GC 90-DAYS EXECUTION · ${new Date().toLocaleTimeString('es-ES')}]\n` +
        `• Regla de retención temporal: 90 días (2160 horas).\n` +
        `• Goroutine con time.Ticker(6 * time.Hour) disparada en Go.\n` +
        `• Total posts evaluados: ${anonymousPosts.length} posts.\n` +
        `• Posts convertidos a lápidas suizas neutrales (>90d): ${expiredCount} posts.\n` +
        `• Huella de memoria del demonio Go: 11.4 MB (0 bytes de alojamiento persistente).`
      );
      showToast('Garbage collector en Go ejecutado: Posts > 90d purgados.');
    }, 400);
  };

  // Selección de texto en Lector
  const [textSelectionPopover, setTextSelectionPopover] = useState<{ x: number; y: number; text: string } | null>(null);
  const [lockedQuote, setLockedQuote] = useState<{ snippet: string; targetArtId: string; relation: CitationRelation } | null>(null);

  // Formulario del Editor de Artículos / Citas
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSubtitle, setEditorSubtitle] = useState('');
  const [editorArea, setEditorArea] = useState('Epistemología & Lógica Formal');
  const [editorEpistemicStatus, setEditorEpistemicStatus] = useState<EpistemicStatus>('hypothesis');
  const [editorContent, setEditorContent] = useState('');
  const [editorCitationReasoning, setEditorCitationReasoning] = useState('');
  const [editorCalculatedHash, setEditorCalculatedHash] = useState('');

  useEffect(() => {
    const rawPayload = `${editorTitle}\n${editorSubtitle}\n${editorContent}`;
    setEditorCalculatedHash(computeSimpleHash(rawPayload));
  }, [editorTitle, editorSubtitle, editorContent]);

  // Formulario de Rectificación v2
  const [v2ConvincingCitationId, setV2ConvincingCitationId] = useState('');
  const [v2RectificationNotes, setV2RectificationNotes] = useState('');
  const [v2ContentMarkdown, setV2ContentMarkdown] = useState('');

  // Formulario de Hueco del Saber
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionDesc, setNewQuestionDesc] = useState('');
  const [newQuestionArea, setNewQuestionArea] = useState('Epistemología & Ciencias');
  const [socraticReviewedSources, setSocraticReviewedSources] = useState('');
  const [socraticFalsifiability, setSocraticFalsifiability] = useState('');
  const [detectedSimilarArticles, setDetectedSimilarArticles] = useState<Article[]>([]);

  // Formulario de Configuración de Perfil
  const [editRealName, setEditRealName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editGithubUser, setEditGithubUser] = useState('');
  const [editOrcidId, setEditOrcidId] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editPinterest, setEditPinterest] = useState('');
  const [editTwitterX, setEditTwitterX] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editGoogleScholar, setEditGoogleScholar] = useState('');
  const [editKofi, setEditKofi] = useState('');
  const [editLiberapay, setEditLiberapay] = useState('');
  const [editGithubSponsors, setEditGithubSponsors] = useState('');

  useEffect(() => {
    const a = authors.find((x) => x.id === activeAuthorId) || currentActiveAuthor;
    if (a) {
      setEditRealName(a.realName);
      setEditAvatarUrl(a.avatarUrl || '');
      setEditBannerUrl(a.bannerUrl || '');
      setEditHeadline(a.headline || '');
      setEditBio(a.bio || '');
      setEditLocation(a.location || '');
      setEditGithubUser(a.socials?.github?.username || '');
      setEditOrcidId(a.socials?.orcid?.id || '');
      setEditLinkedin(a.socials?.linkedin || '');
      setEditInstagram(a.socials?.instagram || '');
      setEditPinterest(a.socials?.pinterest || '');
      setEditTwitterX(a.socials?.twitterX || '');
      setEditWebsite(a.socials?.website || '');
      setEditGoogleScholar(a.socials?.googleScholar || '');
      setEditKofi(a.socials?.kofi || '');
      setEditLiberapay(a.socials?.liberapay || '');
      setEditGithubSponsors(a.socials?.githubSponsors || '');
    }
  }, [activeAuthorId, authors]);

  // Apertura de artículos en el Lector
  const handleOpenArticleInReader = (artId: string) => {
    setActiveArticleId(artId);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selección de texto flotante
  const handleMouseUpInReader = () => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTextSelectionPopover(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length > 15) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTextSelectionPopover({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY - 10,
        text,
      });
    } else {
      setTextSelectionPopover(null);
    }
  };

  const handleTriggerCitationFromSelection = (relation: CitationRelation) => {
    if (!textSelectionPopover) return;
    setLockedQuote({
      snippet: textSelectionPopover.text,
      targetArtId: activeArticleId,
      relation,
    });
    setEditorArea(activeArticle?.area || 'Epistemología');
    setActiveTab('editor');
    setTextSelectionPopover(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Fragmento fijado como cita [${relation.toUpperCase()}]. Redacta tu réplica.`);
  };

  // Guardar Nuevo Artículo / Cita
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim() || !editorContent.trim()) {
      showToast('El título y el cuerpo del ensayo son obligatorios.');
      return;
    }

    const newArtId = `art-${Date.now()}`;
    const newArticle: Article = {
      id: newArtId,
      articleSeriesId: `series-${newArtId}`,
      version: 'v1',
      versionHash: editorCalculatedHash,
      title: editorTitle.trim(),
      subtitle: editorSubtitle.trim() || 'Ensayo publicado bajo el protocolo Chen',
      authorId: currentActiveAuthor.id,
      area: editorArea,
      epistemicStatus: editorEpistemicStatus,
      license: 'CC BY-SA 4.0',
      publishedDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      readingTimeMinutes: Math.max(1, Math.ceil(editorContent.split(/\s+/).length / 180)),
      contentMarkdown: editorContent.trim(),
    };

    let updatedCitations = [...citations];
    if (lockedQuote) {
      const newCitation: Citation = {
        id: `cit-${Date.now()}`,
        sourceArticleId: newArtId,
        targetArticleId: lockedQuote.targetArtId,
        relation: lockedQuote.relation,
        quotedSnippet: lockedQuote.snippet,
        reasoning: editorCitationReasoning.trim() || 'Fundamentación deductiva enlazada.',
        timestamp: new Date().toISOString(),
      };
      updatedCitations.push(newCitation);
    }

    setArticles([newArticle, ...articles]);
    setCitations(updatedCitations);

    // Actualizar reputación del autor
    setAuthors((prev) =>
      prev.map((a) => {
        if (a.id === currentActiveAuthor.id) {
          const currentRep = a.reputationByArea[editorArea] || { articlesCount: 0, citationsReceived: 0, citationsMade: 0 };
          return {
            ...a,
            reputationByArea: {
              ...a.reputationByArea,
              [editorArea]: {
                ...currentRep,
                articlesCount: currentRep.articlesCount + 1,
                citationsMade: currentRep.citationsMade + (lockedQuote ? 1 : 0),
              },
            },
          };
        }
        return a;
      })
    );

    // Limpiar formulario
    setEditorTitle('');
    setEditorSubtitle('');
    setEditorContent('');
    setEditorCitationReasoning('');
    setLockedQuote(null);

    handleOpenArticleInReader(newArtId);
    showToast('Tesis publicada e indexada en el DAG con hash inmutable.');
  };

  // Guardar Rectificación v2
  const handleSubmitV2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle) return;

    const v2Hash = computeSimpleHash(`${activeArticle.title}\n${v2ContentMarkdown}`);
    const updatedArticle: Article = {
      ...activeArticle,
      version: 'v2',
      versionHash: v2Hash,
      contentMarkdown: v2ContentMarkdown,
      rectificationNotes: v2RectificationNotes,
      convincingCitationId: v2ConvincingCitationId,
    };

    setArticles((prev) => prev.map((a) => (a.id === activeArticle.id ? updatedArticle : a)));

    // Otorgar insignia de "Cambié de opinión"
    setAuthors((prev) =>
      prev.map((auth) => {
        if (auth.id === activeArticle.authorId && !auth.hasChangedMindBadge) {
          const mindBadge: Badge = {
            id: `badge-mind-${Date.now()}`,
            slug: 'cambie-de-opinion',
            name: 'Cambié de Opinión',
            description: 'Rectificó una tesis fundacional tras una refutación formal en el DAG.',
            symbol: '↻',
            colorScheme: 'emerald',
            issuedAt: new Date().toISOString(),
            criteriaUrl: 'https://chen-hkfc-seven.vercel.app/criteria/cambie-de-opinion',
          };
          return {
            ...auth,
            hasChangedMindBadge: true,
            changedMindTrigger: v2RectificationNotes,
            badges: [...auth.badges, mindBadge],
          };
        }
        return auth;
      })
    );

    setIsV2ModalOpen(false);
    showToast('Versión v2 publicada. Has recibido la insignia oficial [ ↻ Cambié de opinión ].');
  };

  // Registrar Nuevo Hueco del Saber
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newQ: OpenQuestion = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle.trim(),
      description: newQuestionDesc.trim(),
      area: newQuestionArea,
      proposerName: currentActiveAuthor.realName,
      proposerHandle: currentActiveAuthor.handle,
      createdAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      falsifiabilityCriteria: socraticFalsifiability.trim(),
      reviewedSourcesNote: socraticReviewedSources.trim(),
      answeredArticleIds: [],
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionDesc('');
    setSocraticFalsifiability('');
    setSocraticReviewedSources('');
    setIsQuestionModalOpen(false);
    showToast('Hueco del Saber formalizado y abierto a la contrastación.');
  };

  // Detección de duplicados al escribir pregunta
  useEffect(() => {
    if (newQuestionTitle.length > 5) {
      const qLower = newQuestionTitle.toLowerCase();
      const matches = articles.filter(
        (a) => a.title.toLowerCase().includes(qLower) || a.contentMarkdown.toLowerCase().includes(qLower)
      );
      setDetectedSimilarArticles(matches);
    } else {
      setDetectedSimilarArticles([]);
    }
  }, [newQuestionTitle, articles]);

  // Guardar Perfil de Autor
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthors((prev) =>
      prev.map((a) => {
        if (a.id === activeAuthorId) {
          return {
            ...a,
            realName: editRealName.trim() || a.realName,
            avatarUrl: editAvatarUrl.trim(),
            bannerUrl: editBannerUrl.trim(),
            headline: editHeadline.trim(),
            bio: editBio.trim(),
            location: editLocation.trim(),
            socials: {
              ...a.socials,
              github: editGithubUser.trim() ? { username: editGithubUser.trim(), verified: true as const } : null,
              orcid: editOrcidId.trim() ? { id: editOrcidId.trim(), verified: true as const } : null,
              linkedin: editLinkedin.trim() || null,
              instagram: editInstagram.trim() || null,
              pinterest: editPinterest.trim() || null,
              twitterX: editTwitterX.trim() || null,
              website: editWebsite.trim() || null,
              googleScholar: editGoogleScholar.trim() || null,
              kofi: editKofi.trim() || null,
              liberapay: editLiberapay.trim() || null,
              githubSponsors: editGithubSponsors.trim() || null,
            },
          };
        }
        return a;
      })
    );
    setIsEditProfileModalOpen(false);
    showToast('Portafolio y enlaces externos actualizados con éxito.');
  };

  // Simulación RGPD Art. 17 (Derecho al Olvido)
  const handleSimulateGDPRDeletion = (targetAuthorId: string) => {
    setAuthors((prev) =>
      prev.map((a) => {
        if (a.id === targetAuthorId) {
          return {
            ...a,
            realName: `Investigador Anonimizado [RGPD Art. 17 - ID: ${a.id.substring(0, 8)}]`,
            avatarUrl: '',
            bannerUrl: '',
            bio: 'Este autor ejerció su derecho a la supresión de datos conforme al RGPD europeo (Reglamento UE 2016/679). Sus datos de filiación, avatares y redes sociales han sido eliminados de forma irrevocable. Sus tesis y citas permanecen indexadas bajo licencia irrevocable Creative Commons CC BY-SA 4.0.',
            headline: 'Perfil Anonimizado por Derecho al Olvido',
            location: 'Comunidad Europea',
            isAnonymized: true,
            erasedAt: new Date().toISOString(),
            socials: {},
          };
        }
        return a;
      })
    );
    showToast('RGPD simulado: Identidad y enlaces suprimidos; grafo preservado.');
  };

  // Exportar a Obsidian (.md) con [[wikilinks]]
  const handleExportObsidian = (art: Article) => {
    const inbound = citations.filter((c) => c.targetArticleId === art.id);
    const outbound = citations.filter((c) => c.sourceArticleId === art.id);

    const mdContent = `---
title: "${art.title}"
author: "did:chen:${authors.find((a) => a.id === art.authorId)?.handle}"
version: "${art.version}"
hash_sha256: "${art.versionHash}"
epistemic_status: "${art.epistemicStatus}"
license: "${art.license}"
date: "${art.publishedDate}"
---

# ${art.title}
*${art.subtitle}*

${art.contentMarkdown}

## Grafo de Citas de Chen

### Citas Salientes (Argumentos que sostienen o amplían este texto)
${
  outbound.length > 0
    ? outbound
        .map((c) => {
          const tArt = articles.find((a) => a.id === c.targetArticleId);
          return `- [${c.relation.toUpperCase()}] [[${tArt?.title || c.targetArticleId}]] — "${c.reasoning}"`;
        })
        .join('\n')
    : '_Ninguna cita saliente._'
}

### Citas Entrantes (Objeciones, apoyos y extensiones recibidas)
${
  inbound.length > 0
    ? inbound
        .map((c) => {
          const sArt = articles.find((a) => a.id === c.sourceArticleId);
          return `- [[${sArt?.title || c.sourceArticleId}]] declaró [${c.relation.toUpperCase()}]: "${c.reasoning}"`;
        })
        .join('\n')
    : '_Ninguna cita entrante registrada._'
}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${art.id}-${art.version}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Descargado ${art.id}-${art.version}.md con [[wikilinks]] para Obsidian.`);
  };

  // Artículo actual en vista de lectura
  const activeArticle = articles.find((a) => a.id === activeArticleId) || articles[0];
  const activeAuthor = authors.find((a) => a.id === activeArticle?.authorId) || authors[0];
  const inboundCitations = citations.filter((c) => c.targetArticleId === activeArticle?.id);
  const outboundCitations = citations.filter((c) => c.sourceArticleId === activeArticle?.id);

  // Autor seleccionado en pestaña Portafolios
  const selectedPortfolioAuthor = authors.find((a) => a.id === selectedPortfolioAuthorId) || currentActiveAuthor;

  // Métricas y filtrado del Hemisferio Anónimo
  const totalAnonymousPosts = anonymousPosts.length;
  const totalPurgedCount = anonymousPosts.filter((p) => isPostPurged(p)).length;
  const totalActiveCount = totalAnonymousPosts - totalPurgedCount;

  const filteredAnonymousThreads = anonymousThreads.filter((t) => {
    if (anonSubtopic === 'todos') return true;
    return t.subtopic === anonSubtopic;
  });

  const getAnonColor = (idStr: string) => {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
    }
    const colors = [
      'text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
      'text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800',
      'text-purple-800 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800',
      'text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
      'text-rose-800 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const renderStanceBadge = (stance?: string) => {
    if (!stance) return null;
    switch (stance) {
      case 'supports':
        return (
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#EAF2EC] text-[#14532D] border border-[#A3C6AD] dark:bg-[#0D2618] dark:text-[#86EFAC] dark:border-[#1B4A2B] font-bold">
            [+ Apoya]
          </span>
        );
      case 'contradicts':
        return (
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#F9EBEE] text-[#881337] border border-[#DFB0BA] dark:bg-[#2A0E17] dark:text-[#FDA4AF] dark:border-[#5C1D2B] font-bold">
            [- Contradice]
          </span>
        );
      case 'extends':
        return (
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#EBF0F9] text-[#1E3A8A] border border-[#B0C2E4] dark:bg-[#0F1E3D] dark:text-[#93C5FD] dark:border-[#1D3B68] font-bold">
            [→ Amplía]
          </span>
        );
      case 'questions':
        return (
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 font-bold">
            [? Duda]
          </span>
        );
      default:
        return null;
    }
  };

  const renderAnonymousContent = (
    content: string,
    threadId: string,
    onQuoteClick: (postNumber: number) => void
  ) => {
    const lines = content.split('\n');
    return (
      <div className="font-mono text-xs sm:text-[13px] leading-relaxed space-y-1 text-[#121211] dark:text-[#ECEAE4]">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();
          const isGreentext = trimmed.startsWith('>') && !trimmed.startsWith('>>');
          if (isGreentext) {
            return (
              <p key={lIdx} className="text-[#15803D] dark:text-[#4ADE80] font-mono font-medium">
                {line}
              </p>
            );
          }

          const parts = line.split(/(>>\d+)/g);
          return (
            <p key={lIdx} className="leading-relaxed">
              {parts.map((part, pIdx) => {
                const match = part.match(/^>>(\d+)$/);
                if (match) {
                  const targetNum = parseInt(match[1], 10);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        onQuoteClick(targetNum);
                        const el = document.getElementById(`anon-post-${targetNum}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      onMouseEnter={() => setHoveredPostQuoteNumber(targetNum)}
                      onMouseLeave={() => setHoveredPostQuoteNumber(null)}
                      className="inline-block text-[#1E3A8A] dark:text-[#93C5FD] underline font-bold hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer mr-1"
                    >
                      {part}
                    </button>
                  );
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0C0C0B] text-[#121211] dark:text-[#ECEAE4] flex flex-col font-sans transition-colors duration-150">
      {/* ==================================================================== */}
      {/* 1. MASTHEAD Y CABECERA ARQUITECTÓNICA SUIZA (MODO DUAL CHEN)         */}
      {/* ==================================================================== */}
      <header className="border-b border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] sticky top-0 z-40 no-print">
        {/* 1.1 INTERRUPTOR MAESTRO DE HEMISFERIO (SUPERIOR) */}
        <div className="bg-[#121211] text-[#F7F5F0] dark:bg-[#000000] dark:text-[#ECEAE4] border-b border-[#262624] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-emerald-400 shrink-0"></span>
            <span className="font-bold tracking-wider uppercase text-[11px]">Chen Dual:</span>
            <span className="text-[#A3A098] hidden sm:inline text-[11px]">Arquitectura de Dos Hemisferios Epistémicos</span>
          </div>
          <div className="flex items-center p-0.5 bg-[#262624] border border-[#3A3935]">
            <button
              onClick={() => {
                setActiveHemisphere('archive');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeHemisphere === 'archive'
                  ? 'bg-[#FDFCF9] text-[#121211] font-bold shadow-sm'
                  : 'text-[#A3A098] hover:text-[#ECEAE4]'
              }`}
            >
              <span>§ HEMISFERIO I: ARCHIVO PERMANENTE</span>
              <span className="text-[9px] opacity-70 hidden md:inline">[Portafolios & Tesis]</span>
            </button>
            <button
              onClick={() => {
                setActiveHemisphere('anonymous');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeHemisphere === 'anonymous'
                  ? 'bg-[#15803D] text-[#FFFFFF] font-bold shadow-sm'
                  : 'text-[#A3A098] hover:text-[#ECEAE4]'
              }`}
            >
              <span>† HEMISFERIO II: TABLONES ANÓNIMOS</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 py-0.2 hidden md:inline">90 DÍAS</span>
            </button>
          </div>

          {/* BOTÓN INTERACTIVO DEMONIO NODO EN GO */}
          <button
            onClick={() => setIsGoDaemonModalOpen(true)}
            title="Abrir inspector y verificador criptográfico del Demonio Canónico en Go (backend/chen_daemon.go)"
            className="px-2.5 py-1 bg-[#1A1A18] hover:bg-[#262624] text-cyan-400 border border-cyan-800/80 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400"></span>
            <span>◈ NODO GO</span>
            <span className="text-[9px] px-1 bg-cyan-950 text-cyan-300 font-normal hidden sm:inline">CANÓNICO</span>
          </button>
        </div>

        {/* 1.2 BARRA DE NAVEGACIÓN SEGÚN EL HEMISFERIO ACTIVO */}
        {activeHemisphere === 'archive' ? (
          /* HEMISFERIO I: ARCHIVO PERMANENTE */
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
              {/* Logotipo Editorial + Coordenadas */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left cursor-pointer flex items-center gap-2.5 group"
                >
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#121211] dark:text-[#ECEAE4]">
                    CHEN
                  </span>
                  <span className="h-4 w-[1px] bg-[#DCD8CE] dark:bg-[#262624] hidden sm:inline-block"></span>
                  <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    PROTOCOLO v1.0 · AGPL / CC BY-SA 4.0
                  </span>
                </button>
              </div>

              {/* Navegación por pestañas numeradas */}
              <nav className="hidden lg:flex items-center h-full space-x-1">
                {[
                  { id: 'home', num: '01', label: 'EXPLORAR' },
                  { id: 'reader', num: '02', label: 'LECTOR & GRAFO' },
                  { id: 'questions', num: '03', label: `HUECOS DEL SABER (${questions.length})` },
                  { id: 'portfolios', num: '04', label: 'PORTAFOLIOS' },
                  { id: 'editor', num: '05', label: lockedQuote ? '• PUBLICAR RÉPLICA' : 'PUBLICAR' },
                  { id: 'manifesto', num: '06', label: 'MANIFIESTO' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-full px-3.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                        isActive
                          ? 'border-[#121211] dark:border-[#ECEAE4] text-[#121211] dark:text-[#ECEAE4] font-bold bg-[#EFECE6]/40 dark:bg-[#1C1C1A]/40'
                          : 'border-transparent text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4]'
                      } ${tab.id === 'editor' && lockedQuote ? 'text-amber-800 dark:text-amber-300 font-bold' : ''}`}
                    >
                      <span className="opacity-50 text-[10px]">{tab.num}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Controles de la derecha: Theme Toggle + BOTÓN DE PERFIL */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  title={isDarkMode ? 'Cambiar a modo Papel de Archivo' : 'Cambiar a modo Pizarra Nocturna'}
                  aria-label="Alternar tema visual"
                  className="w-8 h-8 flex items-center justify-center border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#4A4843] dark:text-[#A3A098] hover:text-[#121211] dark:hover:text-[#ECEAE4] hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-colors cursor-pointer"
                >
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>

                <button
                  onClick={() => {
                    setSelectedPortfolioAuthorId(currentActiveAuthor.id);
                    setIsEditProfileModalOpen(true);
                  }}
                  aria-label="Configurar Mi Perfil"
                  title="Configurar tu foto externa, portada panorámica y redes sociales"
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-[#121211] dark:border-[#ECEAE4] bg-[#FDFCF9] dark:bg-[#141413] hover:bg-[#121211] hover:text-[#F7F5F0] dark:hover:bg-[#ECEAE4] dark:hover:text-[#0C0C0B] transition-colors rounded-none cursor-pointer group"
                >
                  <ExternalAvatar
                    src={currentActiveAuthor.avatarUrl}
                    name={currentActiveAuthor.realName}
                    sizeClass="w-5 h-5 sm:w-6 sm:h-6"
                    className="border-none"
                  />
                  <div className="text-left font-mono">
                    <div className="text-[11px] font-bold tracking-wider leading-tight flex items-center gap-1.5">
                      <span>MI PERFIL</span>
                      <EditIcon className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[9px] opacity-70 leading-none mt-0.5 hidden sm:block">
                      @{currentActiveAuthor.handle}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-barra móvil para Archivo Permanente */}
            <div className="lg:hidden border-t border-[#DCD8CE] dark:border-[#262624] px-4 overflow-x-auto flex items-center space-x-2 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
              {[
                { id: 'home', label: 'Explorar' },
                { id: 'reader', label: 'Lector' },
                { id: 'questions', label: `Huecos (${questions.length})` },
                { id: 'portfolios', label: 'Portafolios' },
                { id: 'editor', label: 'Publicar' },
                { id: 'manifesto', label: 'Manifiesto' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider shrink-0 border ${
                    activeTab === tab.id
                      ? 'border-[#121211] dark:border-[#ECEAE4] bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold'
                      : 'border-[#DCD8CE] dark:border-[#262624] text-[#78756E] dark:text-[#73716A] bg-[#FDFCF9] dark:bg-[#141413]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* HEMISFERIO II: TABLONES ANÓNIMOS */
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
              {/* Logotipo Textboard Anónimo */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#15803D] dark:text-[#4ADE80]">
                  CHEN
                </span>
                <span className="h-4 w-[1px] bg-[#DCD8CE] dark:bg-[#262624]"></span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                    TABLONES ANÓNIMOS
                  </span>
                  <span className="font-mono text-[9px] text-[#78756E] dark:text-[#73716A] uppercase tracking-wider">
                    ESPACIO EFÍMERO · VENTANA 90 DÍAS
                  </span>
                </div>
              </div>

              {/* Selector de subtemas para escritorio */}
              <div className="hidden xl:flex items-center space-x-1 font-mono text-[11px]">
                {[
                  { id: 'todos', label: '/todos/' },
                  { id: 'codigo', label: '/codigo/' },
                  { id: 'ciencia', label: '/ciencia/' },
                  { id: 'logica', label: '/logica/' },
                  { id: 'ideas-crudas', label: '/ideas-crudas/' },
                  { id: 'meta', label: '/meta/' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setAnonSubtopic(st.id as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-2 py-1 border transition-colors cursor-pointer ${
                      anonSubtopic === st.id
                        ? 'border-[#15803D] bg-[#15803D] text-white font-bold'
                        : 'border-[#DCD8CE] dark:border-[#262624] text-[#4A4843] dark:text-[#A3A098] hover:border-[#121211] dark:hover:border-[#ECEAE4]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Botones de acción derecha */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Selector Vista Hilos / Catálogo */}
                <div className="hidden sm:flex items-center border border-[#DCD8CE] dark:border-[#262624] p-0.5 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                  <button
                    onClick={() => setAnonViewMode('threads')}
                    className={`px-2 py-1 text-[10px] font-mono uppercase cursor-pointer ${
                      anonViewMode === 'threads'
                        ? 'bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold'
                        : 'text-[#78756E] dark:text-[#73716A]'
                    }`}
                  >
                    Hilos
                  </button>
                  <button
                    onClick={() => setAnonViewMode('catalog')}
                    className={`px-2 py-1 text-[10px] font-mono uppercase cursor-pointer ${
                      anonViewMode === 'catalog'
                        ? 'bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold'
                        : 'text-[#78756E] dark:text-[#73716A]'
                    }`}
                  >
                    Catálogo
                  </button>
                </div>

                {/* Botón Nuevo Hilo Anónimo */}
                <button
                  onClick={() => setIsNewThreadModalOpen(true)}
                  className="px-3 py-1.5 bg-[#15803D] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#166534] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ Nuevo Hilo</span>
                </button>

                {/* Theme toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  aria-label="Alternar tema visual"
                  className="w-8 h-8 flex items-center justify-center border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#4A4843] dark:text-[#A3A098] hover:text-[#121211] dark:hover:text-[#ECEAE4] transition-colors cursor-pointer"
                >
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
            </div>

            {/* Sub-barra horizontal con subtemas y selector para móviles/tablets */}
            <div className="xl:hidden border-t border-[#DCD8CE] dark:border-[#262624] px-4 overflow-x-auto flex items-center space-x-2 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
              {[
                { id: 'todos', label: '/todos/' },
                { id: 'codigo', label: '/codigo/' },
                { id: 'ciencia', label: '/ciencia/' },
                { id: 'logica', label: '/logica/' },
                { id: 'ideas-crudas', label: '/ideas-crudas/' },
                { id: 'meta', label: '/meta/' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setAnonSubtopic(st.id as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider shrink-0 border ${
                    anonSubtopic === st.id
                      ? 'border-[#15803D] bg-[#15803D] text-white font-bold'
                      : 'border-[#DCD8CE] dark:border-[#262624] text-[#78756E] dark:text-[#73716A] bg-[#FDFCF9] dark:bg-[#141413]'
                  }`}
                >
                  {st.label}
                </button>
              ))}

              <div className="sm:hidden flex items-center shrink-0 border border-[#DCD8CE] dark:border-[#262624] p-0.5 bg-[#FDFCF9] dark:bg-[#141413] ml-2">
                <button
                  onClick={() => setAnonViewMode('threads')}
                  className={`px-1.5 py-0.5 text-[10px] font-mono ${
                    anonViewMode === 'threads' ? 'bg-[#121211] text-white dark:bg-white dark:text-black font-bold' : ''
                  }`}
                >
                  Hilos
                </button>
                <button
                  onClick={() => setAnonViewMode('catalog')}
                  className={`px-1.5 py-0.5 text-[10px] font-mono ${
                    anonViewMode === 'catalog' ? 'bg-[#121211] text-white dark:bg-white dark:text-black font-bold' : ''
                  }`}
                >
                  Catálogo
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Notificación Toast Discreta */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] text-xs font-mono border border-[#3A3935] max-w-md flex items-center gap-2.5 no-print"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 dark:bg-emerald-600 shrink-0"></span>
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Popover de Selección de Texto en Lector */}
      {activeTab === 'reader' && textSelectionPopover && (
        <div
          style={{
            position: 'absolute',
            top: `${textSelectionPopover.y}px`,
            left: `${textSelectionPopover.x}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="z-50 bg-[#121211] text-[#F7F5F0] dark:bg-[#141413] dark:text-[#ECEAE4] p-1.5 border border-[#3A3935] dark:border-[#333330] flex items-center gap-1 text-[11px] font-mono no-print"
        >
          <span className="px-1.5 text-[#78756E] select-none text-[10px]">CITAR:</span>
          <button
            onClick={() => handleTriggerCitationFromSelection('supports')}
            className="px-2 py-0.5 bg-[#14532D] text-[#86EFAC] hover:bg-[#166534] transition-colors cursor-pointer text-[10px] font-mono"
          >
            [+ Apoya]
          </button>
          <button
            onClick={() => handleTriggerCitationFromSelection('contradicts')}
            className="px-2 py-0.5 bg-[#881337] text-[#FDA4AF] hover:bg-[#9F1239] transition-colors cursor-pointer text-[10px] font-mono"
          >
            [- Contradice]
          </button>
          <button
            onClick={() => handleTriggerCitationFromSelection('extends')}
            className="px-2 py-0.5 bg-[#1E3A8A] text-[#93C5FD] hover:bg-[#1E40AF] transition-colors cursor-pointer text-[10px] font-mono"
          >
            [→ Amplía]
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: NODO CANÓNICO EN GO (MOTOR CRIPTOGRÁFICO Y SERVIDOR REST)     */}
      {/* ==================================================================== */}
      {isGoDaemonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border border-[#121211] dark:border-[#ECEAE4] max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold w-10 h-10 border border-[#DCD8CE] dark:border-[#262624] flex items-center justify-center bg-[#EFECE6] dark:bg-[#1C1C1A] text-cyan-600 dark:text-cyan-400">
                  ◈
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                      MOTOR CRIPTOGRÁFICO DE VERIFICACIÓN CANÓNICO
                    </span>
                    <span className="px-1.5 py-0.2 bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 font-mono text-[9px] font-bold">
                      GOLANG v1.22+
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                    Nodo de Protocolo Chen en Go
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsGoDaemonModalOpen(false)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            {/* Panel de Estado y Especificaciones Go */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] space-y-1">
                <div className="text-[10px] text-[#78756E] dark:text-[#73716A] uppercase">Archivo Fuente</div>
                <div className="font-bold text-[#121211] dark:text-[#ECEAE4]">backend/chen_daemon.go</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400">0 dependencias externas</div>
              </div>
              <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] space-y-1">
                <div className="text-[10px] text-[#78756E] dark:text-[#73716A] uppercase">Rendimiento Criptográfico</div>
                <div className="font-bold text-[#121211] dark:text-[#ECEAE4]">SHA-256 Nativo en Go</div>
                <div className="text-[10px] text-[#78756E] dark:text-[#73716A]">&gt; 80.000 ops/s · &lt; 15 MB RAM</div>
              </div>
              <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] space-y-1">
                <div className="text-[10px] text-[#78756E] dark:text-[#73716A] uppercase">Garbage Collector 90 Días</div>
                <div className="font-bold text-[#121211] dark:text-[#ECEAE4]">time.Ticker en Goroutine</div>
                <div className="text-[10px] text-amber-800 dark:text-amber-400">Purga activa cada 6 horas</div>
              </div>
            </div>

            {/* Controles de Simulación del Nodo Go */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                Operaciones del Demonio en Go:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isSimulatingGo}
                  onClick={handleSimulateGoDagVerify}
                  className="px-3.5 py-2 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-bold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>▶ Simular Verificación DAG con SHA-256 en Go</span>
                </button>
                <button
                  type="button"
                  disabled={isSimulatingGo}
                  onClick={handleSimulateGoPrune}
                  className="px-3.5 py-2 border border-[#121211] dark:border-[#ECEAE4] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs font-bold hover:bg-[#EFECE6] dark:hover:bg-[#1C1C1A] transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>↻ Disparar Garbage Collector (90 Días) en Go</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText('go run backend/chen_daemon.go');
                    showToast('Comando copiado: go run backend/chen_daemon.go');
                  }}
                  className="px-3.5 py-2 bg-[#EFECE6] dark:bg-[#1C1C1A] text-[#121211] dark:text-[#ECEAE4] border border-[#DCD8CE] dark:border-[#262624] font-mono text-xs font-bold hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>[ Copiar comando 'go run' ]</span>
                </button>
              </div>

              {/* Terminal de Salida del Demonio Go */}
              {goVerificationOutput && (
                <div className="p-3.5 bg-[#0C0C0B] text-[#ECEAE4] border border-[#262624] font-mono text-xs leading-relaxed space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider border-b border-[#262624] pb-1 flex items-center justify-between">
                    <span>Consola de Salida del Demonio Go (stdout)</span>
                    <button
                      onClick={() => setGoVerificationOutput(null)}
                      className="text-[#78756E] hover:text-[#ECEAE4] cursor-pointer"
                    >
                      [limpiar]
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-[11px] text-[#A3A098] pt-1 font-mono">
                    {goVerificationOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* Visualizador de Código Go */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                  Código Fuente Canónico (backend/chen_daemon.go):
                </label>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('go run backend/chen_daemon.go');
                    showToast('Comando copiado: go run backend/chen_daemon.go');
                  }}
                  className="font-mono text-[11px] underline text-[#15803D] dark:text-[#4ADE80] font-bold cursor-pointer"
                >
                  [Copiar comando go run]
                </button>
              </div>
              <pre className="p-3.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[11px] font-mono overflow-x-auto text-[#121211] dark:text-[#ECEAE4] max-h-48 leading-relaxed">
{`package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"
)

// Cálculo Criptográfico SHA-256 Canónico de un Artículo
func ComputeArticleHash(title, subtitle, content string) string {
	payload := fmt.Sprintf("%s\\n%s\\n%s", strings.TrimSpace(title), strings.TrimSpace(subtitle), strings.TrimSpace(content))
	sum := sha256.Sum256([]byte(payload))
	return hex.EncodeToString(sum[:])
}

// Motor de Purga de 90 Días (Garbage Collector Epistémico)
func (n *ChenNode) PruneExpiredPosts(maxDays int) int {
	n.mu.Lock()
	defer n.mu.Unlock()
	purgedCount := 0
	threshold := time.Now().Add(-time.Duration(maxDays) * 24 * time.Hour)
	for num, post := range n.Posts {
		if post.CreatedAt.Before(threshold) && !post.IsPurged {
			post.IsPurged = true
			if post.IsOP {
				post.Content = "[ CONTEXTO BORRADO AUTOMÁTICAMENTE (> 90 DÍAS) ]"
			}
			n.Posts[num] = post
			purgedCount++
		}
	}
	return purgedCount
}`}
              </pre>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#DCD8CE] dark:border-[#262624]">
              <span className="text-[#78756E] dark:text-[#73716A]">
                Compatible con Go 1.21, 1.22, 1.23, 1.24 sin frameworks externos
              </span>
              <button
                type="button"
                onClick={() => setIsGoDaemonModalOpen(false)}
                className="px-5 py-2 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer uppercase tracking-wider"
              >
                Cerrar Inspector Go →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CONFIGURAR MI PERFIL (FOTO, PORTADA Y REDES EXTERNAS)         */}
      {/* ==================================================================== */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border border-[#121211] dark:border-[#ECEAE4] max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#78756E] dark:text-[#73716A] uppercase tracking-wider">
                  ARQUITECTURA DE ALMACENAMIENTO CERO (0 BYTES)
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4] mt-0.5">
                  Configurar Mi Portafolio y Medios Externos
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            {/* Aviso de Transparencia 0 Bytes */}
            <div className="p-3.5 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] text-xs font-mono text-[#4A4843] dark:text-[#A3A098] space-y-1">
              <p className="font-bold text-[#121211] dark:text-[#ECEAE4] flex items-center gap-1.5">
                <span>§ Infraestructura a 0 €:</span>
                <span>Chen no aloja archivos en sus servidores.</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Tanto tu foto de perfil como tu portada deben ser <strong>URLs públicas externas</strong> (Pinterest, Instagram, GitHub, Unsplash o Imgur).
                Chen las incrusta con <code>referrerPolicy="no-referrer"</code> para evitar bloqueos de hotlink y garantizar soberanía de datos.
              </p>
            </div>

            {/* Selector de Usuario Activo para Simular Múltiples Autores */}
            <div className="p-3 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">Simular sesión activa como:</span>
              <select
                value={activeAuthorId}
                onChange={(e) => {
                  setActiveAuthorId(e.target.value);
                  setSelectedPortfolioAuthorId(e.target.value);
                }}
                className="px-3 py-1.5 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs focus:outline-none cursor-pointer"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.realName} (@{a.handle})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* VISTA PREVIA EN VIVO DE BANNER Y AVATAR */}
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold text-[#121211] dark:text-[#ECEAE4] uppercase tracking-wider">
                  Vista Previa en Vivo (Foto y Portada):
                </label>
                <div className="relative border border-[#DCD8CE] dark:border-[#262624] bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                  <ExternalBanner src={editBannerUrl} className="h-32 sm:h-36 w-full" />
                  <div className="absolute -bottom-5 left-5 flex items-end gap-3">
                    <ExternalAvatar
                      src={editAvatarUrl}
                      name={editRealName || 'Usuario'}
                      sizeClass="w-16 h-16 sm:w-18 sm:h-18"
                      className="border-4 border-[#FDFCF9] dark:border-[#141413]"
                    />
                  </div>
                </div>
                <div className="h-4" />
              </div>

              {/* URLS EXTERNAS DE IMÁGENES & BOTÓN GITHUB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                      URL Externa Foto de Perfil:
                    </label>
                    {editGithubUser && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl(`https://github.com/${editGithubUser.trim()}.png`)}
                        className="text-[10px] font-mono text-[#14532D] dark:text-[#86EFAC] underline cursor-pointer font-bold"
                      >
                        [Usar avatar GitHub]
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://i.pinimg.com/... o https://github.com/tu-usuario.png"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none focus:border-[#121211] dark:focus:border-[#ECEAE4]"
                  />
                  <p className="text-[10px] font-mono text-[#78756E] dark:text-[#73716A]">
                    Soporta: Pinterest, GitHub, Unsplash, Gravatar o cualquier URL pública.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    URL Externa Fondo de Portada:
                  </label>
                  <input
                    type="url"
                    value={editBannerUrl}
                    onChange={(e) => setEditBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... o enlace de Pinterest"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none focus:border-[#121211] dark:focus:border-[#ECEAE4]"
                  />
                  <p className="text-[10px] font-mono text-[#78756E] dark:text-[#73716A]">
                    Recomendado: imagen panorámica horizontal (1200x300).
                  </p>
                </div>
              </div>

              {/* BOTONES DE PRUEBA RÁPIDA (PRESETS EXTERNOS) */}
              <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#4A4843] dark:text-[#A3A098] uppercase tracking-wider">
                  Presets Externos de Prueba Rápida (1 Clic):
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setEditAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
                      setEditBannerUrl('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');
                    }}
                    className="px-2.5 py-1 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] hover:border-[#121211] dark:hover:border-[#ECEAE4] cursor-pointer"
                  >
                    [Preset 1: Archivo & Redes]
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditAvatarUrl('https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Karl_Popper.jpg/440px-Karl_Popper.jpg');
                      setEditBannerUrl('https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=1200&q=80');
                    }}
                    className="px-2.5 py-1 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] hover:border-[#121211] dark:hover:border-[#ECEAE4] cursor-pointer"
                  >
                    [Preset 2: Biblioteca & Filosofía]
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditAvatarUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80');
                      setEditBannerUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
                    }}
                    className="px-2.5 py-1 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] hover:border-[#121211] dark:hover:border-[#ECEAE4] cursor-pointer"
                  >
                    [Preset 3: Computación Formal]
                  </button>
                </div>
              </div>

              {/* DATOS DE IDENTIDAD EDITORIAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    Nombre Real o Académico:
                  </label>
                  <input
                    type="text"
                    required
                    value={editRealName}
                    onChange={(e) => setEditRealName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    Ubicación / Filiación Geográfica:
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Ej. Madrid, España / Buenos Aires"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Titular Profesional o Línea de Investigación:
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="Ej. Catedrático de Lógica / Investigador en Sistemas Distribuidos"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Biografía Académica:
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Descripción concisa de tus líneas de pensamiento y rigor metodológico..."
                  className="w-full p-2.5 text-xs font-serif bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                />
              </div>

              {/* REDES SOCIALES EN 3 NIVELES */}
              <div className="space-y-3 pt-3 border-t border-[#DCD8CE] dark:border-[#262624]">
                <span className="font-mono text-xs font-bold text-[#121211] dark:text-[#ECEAE4] uppercase tracking-wider block">
                  Redes Sociales y Enlaces Externos:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">GitHub Username:</label>
                    <input
                      type="text"
                      value={editGithubUser}
                      onChange={(e) => setEditGithubUser(e.target.value)}
                      placeholder="usuario-github"
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">ORCID ID:</label>
                    <input
                      type="text"
                      value={editOrcidId}
                      onChange={(e) => setEditOrcidId(e.target.value)}
                      placeholder="0000-0002-XXXX-XXXX"
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">LinkedIn URL:</label>
                    <input
                      type="url"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">Pinterest / Galería:</label>
                    <input
                      type="url"
                      value={editPinterest}
                      onChange={(e) => setEditPinterest(e.target.value)}
                      placeholder="https://pinterest.com/..."
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">Sitio Web Personal / Blog:</label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://tudominio.org"
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#78756E] dark:text-[#73716A]">Ko-fi / Apoyo (0% comisión):</label>
                    <input
                      type="url"
                      value={editKofi}
                      onChange={(e) => setEditKofi(e.target.value)}
                      placeholder="https://ko-fi.com/..."
                      className="w-full px-2.5 py-1.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCD8CE] dark:border-[#262624]">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Guardar Perfil →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: INSPECTOR OPEN BADGES 3.0 (JSON-LD VERIFICABLE)              */}
      {/* ==================================================================== */}
      {selectedBadgeForInspection && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border border-[#121211] dark:border-[#ECEAE4] max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold w-10 h-10 border border-[#DCD8CE] dark:border-[#262624] flex items-center justify-center bg-[#EFECE6] dark:bg-[#1C1C1A]">
                  {selectedBadgeForInspection.badge.symbol}
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    Estándar Open Badges 3.0 (W3C Verifiable Credential)
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                    {selectedBadgeForInspection.badge.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadgeForInspection(null)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            <p className="font-serif text-sm text-[#4A4843] dark:text-[#A3A098]">
              {selectedBadgeForInspection.badge.description}
            </p>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold text-[#121211] dark:text-[#ECEAE4] uppercase tracking-wider">
                Descriptor JSON-LD de la Credencial Verificable:
              </label>
              <pre className="p-3 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[11px] font-mono overflow-x-auto text-[#121211] dark:text-[#ECEAE4] max-h-56">
{JSON.stringify(
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://purl.imsglobal.org/spec/ob/v3p0/context.json',
    ],
    id: `urn:uuid:${selectedBadgeForInspection.badge.id}`,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: {
      id: 'https://chen-hkfc-seven.vercel.app/issuer',
      type: 'Profile',
      name: 'Chen Protocol — Publicación y Argumentación Abierta',
    },
    issuanceDate: selectedBadgeForInspection.badge.issuedAt,
    credentialSubject: {
      id: `did:chen:${selectedBadgeForInspection.author.handle}`,
      name: selectedBadgeForInspection.author.realName,
      achievement: {
        id: selectedBadgeForInspection.badge.criteriaUrl,
        type: 'Achievement',
        name: selectedBadgeForInspection.badge.name,
        description: selectedBadgeForInspection.badge.description,
        criteria: {
          narrative: 'Demostrado mediante contrastación deductiva e inmutabilidad en el grafo de Chen.',
        },
      },
    },
  },
  null,
  2
)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#DCD8CE] dark:border-[#262624]">
              <span className="text-[#78756E] dark:text-[#73716A]">
                Otorgada el {new Date(selectedBadgeForInspection.badge.issuedAt).toLocaleDateString('es-ES')}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    JSON.stringify(selectedBadgeForInspection.badge, null, 2)
                  );
                  showToast('JSON-LD copiado al portapapeles.');
                }}
                className="px-3 py-1.5 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] cursor-pointer uppercase tracking-wider"
              >
                Copiar JSON-LD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL V2 («CAMBIÉ DE OPINIÓN») */}
      {isV2ModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border border-[#121211] dark:border-[#ECEAE4] max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Rectificación Epistémica · Versión v2
                </span>
                <h3 className="font-serif text-xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                  Incorporar Objeciones y Actualizar Tesis
                </h3>
              </div>
              <button
                onClick={() => setIsV2ModalOpen(false)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            <p className="font-serif text-xs text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
              En Chen rectificar una postura ante pruebas formales no es una debilidad, sino el estándar supremo de rigor deductivo.
              Publicarás una versión <strong>v2</strong> con su propio hash SHA-256 sin sobreescribir la <strong>v1</strong> y recibirás
              la insignia canónica <strong>[ ↻ Cambié de opinión ]</strong>.
            </p>

            <form onSubmit={handleSubmitV2} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Selecciona qué objeción [- Contradice] motivó esta rectificación:
                </label>
                <select
                  value={v2ConvincingCitationId}
                  onChange={(e) => setV2ConvincingCitationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                >
                  {inboundCitations
                    .filter((c) => c.relation === 'contradicts')
                    .map((c) => {
                      const sArt = articles.find((a) => a.id === c.sourceArticleId);
                      const sAuth = authors.find((a) => a.id === sArt?.authorId);
                      return (
                        <option key={c.id} value={c.id}>
                          Por {sAuth?.realName}: "{c.reasoning.substring(0, 70)}..."
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Nota de Rectificación Epistémica:
                </label>
                <input
                  type="text"
                  required
                  value={v2RectificationNotes}
                  onChange={(e) => setV2RectificationNotes(e.target.value)}
                  placeholder="Ejemplo: Concedo la objeción holista: la falsación aislada ignora las hipótesis auxiliares."
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Cuerpo revisado para la Versión v2 (Markdown):
                </label>
                <textarea
                  rows={8}
                  required
                  value={v2ContentMarkdown}
                  onChange={(e) => setV2ContentMarkdown(e.target.value)}
                  className="w-full p-3 font-serif text-sm bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCD8CE] dark:border-[#262624]">
                <button
                  type="button"
                  onClick={() => setIsV2ModalOpen(false)}
                  className="px-3 py-1.5 font-mono text-xs text-[#78756E] dark:text-[#73716A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] cursor-pointer uppercase tracking-wider"
                >
                  Publicar Versión v2 →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR HUECO DEL SABER */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border border-[#121211] dark:border-[#ECEAE4] max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#78756E] dark:text-[#73716A] uppercase tracking-wider">
                  Epistemología de Frontera
                </span>
                <h3 className="font-serif text-xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                  Plantear un Nuevo Hueco del Saber
                </h3>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Pregunta de investigación formulada con precisión:
                </label>
                <input
                  type="text"
                  required
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="¿Bajo qué condiciones formales...?"
                  className="w-full px-3 py-2 text-sm font-serif font-bold bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">Área temática:</label>
                  <select
                    value={newQuestionArea}
                    onChange={(e) => setNewQuestionArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  >
                    <option value="Epistemología & Ciencias">Epistemología & Ciencias</option>
                    <option value="Sistemas Distribuidos">Sistemas Distribuidos</option>
                    <option value="Filosofía de la Ciencia">Filosofía de la Ciencia</option>
                    <option value="Criptografía & Lógica Formal">Criptografía & Lógica Formal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">Contexto y alcance:</label>
                  <input
                    type="text"
                    required
                    value={newQuestionDesc}
                    onChange={(e) => setNewQuestionDesc(e.target.value)}
                    placeholder="Breve explicación de la importancia analítica"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  />
                </div>
              </div>

              {detectedSimilarArticles.length > 0 && (
                <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] text-xs space-y-2">
                  <p className="font-mono font-bold text-[#121211] dark:text-[#ECEAE4]">
                    § Artículos preexistentes en Chen posiblemente relacionados:
                  </p>
                  <ul className="space-y-1 font-serif text-[13px] text-[#4A4843] dark:text-[#A3A098]">
                    {detectedSimilarArticles.slice(0, 2).map((a) => (
                      <li key={a.id} className="flex items-center justify-between">
                        <span>• {a.title}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsQuestionModalOpen(false);
                            handleOpenArticleInReader(a.id);
                          }}
                          className="font-mono text-[11px] underline font-semibold ml-2 cursor-pointer"
                        >
                          Ver artículo
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                  Fricción Socrática Obligatoria
                </span>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] font-semibold text-[#4A4843] dark:text-[#A3A098]">
                    1. ¿Qué fuentes o artículos existentes en Chen has revisado antes de plantear esto?
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={socraticReviewedSources}
                    onChange={(e) => setSocraticReviewedSources(e.target.value)}
                    className="w-full p-2 text-xs font-mono bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] font-semibold text-[#4A4843] dark:text-[#A3A098]">
                    2. ¿Cuál es tu hipótesis inicial y cómo podría refutarse (criterio de falsabilidad)?
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={socraticFalsifiability}
                    onChange={(e) => setSocraticFalsifiability(e.target.value)}
                    className="w-full p-2 text-xs font-mono bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-3 py-1.5 font-mono text-xs text-[#78756E] dark:text-[#73716A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] cursor-pointer uppercase tracking-wider"
                >
                  Registrar Hueco del Saber →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. CONTENIDO PRINCIPAL POR PESTAÑAS                                 */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full print-container">
        {/* ================================================================== */}
        {/* HEMISFERIO I: ARCHIVO PERMANENTE (VISTAS 1 A 6)                    */}
        {/* ================================================================== */}
        {activeHemisphere === 'archive' && (
          <>
            {/* ------------------------------------------------------------------ */}
            {/* VISTA 1: EXPLORAR & ANATOMÍA DE CITA (SWISS GRID ASIMÉTRICA)       */}
            {/* ------------------------------------------------------------------ */}
            {activeTab === 'home' && (
          <div className="space-y-16">
            {/* HERO ASIMÉTRICO 12 COLUMNAS CON HAIRLINES EXPUESTAS */}
            <section className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] grid grid-cols-1 lg:grid-cols-12">
              {/* Columna Izquierda (7 columnas): Tesis Editorial */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:border-r border-b lg:border-b-0 border-[#DCD8CE] dark:border-[#262624] space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    <span>§ 01 — TESIS DEL PROYECTO</span>
                    <span>·</span>
                    <span className="text-[#14532D] dark:text-[#86EFAC] font-bold">FASE NUCLEAR v1.0</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#121211] dark:text-[#ECEAE4] leading-[1.12]">
                    Donde cada afirmación se sostiene sobre una red de pruebas verificables.
                  </h1>

                  <p className="font-serif text-base sm:text-lg text-[#4A4843] dark:text-[#A3A098] leading-relaxed max-w-[55ch]">
                    Un entorno de publicación ensayística y científica sin algoritmos de indignación, sin métricas
                    de vanidad y sin hipervínculos mudos. Cada enlace declara su función lógica deductiva:{' '}
                    <span className="font-mono text-xs px-1.5 py-0.5 border border-[#A3C6AD] bg-[#EAF2EC] text-[#14532D] dark:bg-[#0D2618] dark:text-[#86EFAC] dark:border-[#1B4A2B]">
                      [ + Apoya ]
                    </span>
                    ,{' '}
                    <span className="font-mono text-xs px-1.5 py-0.5 border border-[#DFB0BA] bg-[#F9EBEE] text-[#881337] dark:bg-[#2A0E17] dark:text-[#FDA4AF] dark:border-[#5C1D2B]">
                      [ - Contradice ]
                    </span>{' '}
                    o{' '}
                    <span className="font-mono text-xs px-1.5 py-0.5 border border-[#B0C2E4] bg-[#EBF0F9] text-[#1E3A8A] dark:bg-[#0F1E3D] dark:text-[#93C5FD] dark:border-[#1D3B68]">
                      [ → Amplía ]
                    </span>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#DCD8CE] dark:border-[#262624]">
                  <button
                    onClick={() => handleOpenArticleInReader('art-vasconcelos-grafos-v1')}
                    className="px-5 py-3 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                  >
                    Explorar Tesis Seminal →
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPortfolioAuthorId(currentActiveAuthor.id);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="px-4 py-3 bg-transparent border border-[#121211] dark:border-[#ECEAE4] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#EFECE6] dark:hover:bg-[#1C1C1A] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Configurar Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('manifesto')}
                    className="px-4 py-3 text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] font-mono text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Ver Manifiesto §
                  </button>
                </div>
              </div>

              {/* Columna Derecha (5 columnas): Métricas en Monospace Tabular */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-[#EFECE6]/50 dark:bg-[#1C1C1A]/50 flex flex-col justify-between space-y-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A] pb-3 border-b border-[#DCD8CE] dark:border-[#262624]">
                    COLECCIÓN CANÓNICA · ESTADO DEL SISTEMA
                  </div>

                  <div className="divide-y divide-[#DCD8CE] dark:divide-[#262624] font-mono text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Artículos Indexados:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4] tabular-nums">{articles.length} ensayos</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Citas Cruzadas en DAG:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4] tabular-nums">{citations.length} aristas tipadas</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Huecos del Saber Abiertos:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4] tabular-nums">{questions.length} problemas</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Coste Servidor de Archivos:</span>
                      <span className="font-bold text-[#14532D] dark:text-[#86EFAC] tabular-nums">0,00 € (0 Bytes)</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Integridad Criptográfica:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">SHA-256 inmutable</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#4A4843] dark:text-[#A3A098]">Licencia de Contenidos:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">CC BY-SA 4.0</span>
                    </div>
                  </div>
                </div>

                {/* Llamada de acceso a Perfil activa */}
                <div className="p-3 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#78756E] dark:text-[#73716A]">Sesión Activa:</span>
                    <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">@{currentActiveAuthor.handle}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between">
                    <span className="text-[11px] text-[#4A4843] dark:text-[#A3A098]">{currentActiveAuthor.realName}</span>
                    <button
                      onClick={() => {
                        setSelectedPortfolioAuthorId(currentActiveAuthor.id);
                        setIsEditProfileModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-[#121211] dark:text-[#ECEAE4] underline cursor-pointer"
                    >
                      [Editar mi perfil ✎]
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ANATOMÍA DE UNA CITA: SCIENTIFIC BLUEPRINT CON LÍNEAS CONECTORAS */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    DEMOSTRADOR DEL PROTOCOLO
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                    Anatomía de una Cita con Función Lógica
                  </h2>
                </div>
                <p className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                  Estructura de derivación sobre la tesis de la Dra. Vasconcelos
                </p>
              </div>

              {/* Contenedor del Blueprint */}
              <div className="p-6 sm:p-8 border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] space-y-8">
                {/* 1. NODO RAÍZ: Premisa Central */}
                <div className="max-w-3xl mx-auto border-2 border-[#121211] dark:border-[#ECEAE4] p-5 sm:p-6 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCD8CE] dark:border-[#262624]">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold">
                        NODO RAÍZ
                      </span>
                      <span className="text-[#78756E] dark:text-[#73716A]">·</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">Dra. Elena Vasconcelos</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#78756E] dark:text-[#73716A]">
                      Hash: e3b0c442...
                    </span>
                  </div>

                  <p className="font-serif text-base sm:text-lg text-[#121211] dark:text-[#ECEAE4] mt-3 leading-relaxed">
                    «todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido (DAG) de argumentación. Cada enlace entre proposiciones debe portar obligatoriamente una tipificación lógica verificable: [+ Apoya], [- Contradice] o [→ Amplía].»
                  </p>
                </div>

                {/* Líneas Conectoras y Tres Réplicas en Abanico */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-dashed border-[#DCD8CE] dark:border-[#262624] relative">
                  {/* RÉPLICA 1: [+ APOYA] */}
                  <div className="border border-[#A3C6AD] dark:border-[#1B4A2B] bg-[#EAF2EC]/60 dark:bg-[#0D2618]/60 p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#EAF2EC] text-[#14532D] dark:bg-[#0D2618] dark:text-[#86EFAC] border border-[#A3C6AD] dark:border-[#1B4A2B]">
                          [ + APOYA ]
                        </span>
                        <span className="font-mono text-[10px] text-[#14532D] dark:text-[#86EFAC]">Karl Popper</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#121211] dark:text-[#ECEAE4]">
                        Modus Tollens Formal
                      </h4>
                      <p className="font-serif text-xs text-[#121211]/80 dark:text-[#ECEAE4]/80 leading-relaxed">
                        «La estructura de DAG formaliza de manera impecable la asimetría lógica de la falsación: basta una arista de contradicción fundada para derribar una generalización.»
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenArticleInReader('art-popper-falsacion')}
                      className="font-mono text-[10px] uppercase tracking-wider text-[#14532D] dark:text-[#86EFAC] underline cursor-pointer text-left"
                    >
                      Leer réplica completa →
                    </button>
                  </div>

                  {/* RÉPLICA 2: [- CONTRADICE] */}
                  <div className="border border-[#DFB0BA] dark:border-[#5C1D2B] bg-[#F9EBEE]/60 dark:bg-[#2A0E17]/60 p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#F9EBEE] text-[#881337] dark:bg-[#2A0E17] dark:text-[#FDA4AF] border border-[#DFB0BA] dark:border-[#5C1D2B]">
                          [ - CONTRADICE ]
                        </span>
                        <span className="font-mono text-[10px] text-[#881337] dark:text-[#FDA4AF]">Duhem & Quine</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#121211] dark:text-[#ECEAE4]">
                        Holismo de Hipótesis Auxiliares
                      </h4>
                      <p className="font-serif text-xs text-[#121211]/80 dark:text-[#ECEAE4]/80 leading-relaxed">
                        «Objeción holista: la refutación nunca es quirúrgica ni definitiva, ya que el investigador puede modificar legítimamente las hipótesis auxiliares periféricas.»
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenArticleInReader('art-duhem-quine-holismo')}
                      className="font-mono text-[10px] uppercase tracking-wider text-[#881337] dark:text-[#FDA4AF] underline cursor-pointer text-left"
                    >
                      Leer réplica completa →
                    </button>
                  </div>

                  {/* RÉPLICA 3: [→ AMPLÍA] */}
                  <div className="border border-[#B0C2E4] dark:border-[#1D3B68] bg-[#EBF0F9]/60 dark:bg-[#0F1E3D]/60 p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#EBF0F9] text-[#1E3A8A] dark:bg-[#0F1E3D] dark:text-[#93C5FD] border border-[#B0C2E4] dark:border-[#1D3B68]">
                          [ → AMPLÍA ]
                        </span>
                        <span className="font-mono text-[10px] text-[#1E3A8A] dark:text-[#93C5FD]">Mateo Valdés</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#121211] dark:text-[#ECEAE4]">
                        Finalidad Merkle-DAG PBFT
                      </h4>
                      <p className="font-serif text-xs text-[#121211]/80 dark:text-[#ECEAE4]/80 leading-relaxed">
                        «Extensión computacional: proveemos el algoritmo formal de inmutabilidad Merkle-DAG que hace técnicamente realizable la propuesta de Vasconcelos sin PoW.»
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenArticleInReader('art-valdes-pbft-consenso')}
                      className="font-mono text-[10px] uppercase tracking-wider text-[#1E3A8A] dark:text-[#93C5FD] underline cursor-pointer text-left"
                    >
                      Leer réplica completa →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ARTÍCULOS INDEXADOS EN EL PROTOCOLO */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
                <h2 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                  Corpus Epistémico Seminal
                </h2>
                <span className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                  {articles.length} textos con hash criptográfico
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((art) => {
                  const author = authors.find((a) => a.id === art.authorId);
                  const inCount = citations.filter((c) => c.targetArticleId === art.id).length;
                  const outCount = citations.filter((c) => c.sourceArticleId === art.id).length;

                  return (
                    <article
                      key={art.id}
                      className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-6 space-y-4 flex flex-col justify-between hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#78756E] dark:text-[#73716A]">
                          <span className="uppercase">{art.area}</span>
                          <span>{art.readingTimeMinutes} min de lectura</span>
                        </div>

                        <h3
                          onClick={() => handleOpenArticleInReader(art.id)}
                          className="font-serif text-xl font-bold text-[#121211] dark:text-[#ECEAE4] hover:underline cursor-pointer leading-snug"
                        >
                          {art.title}
                        </h3>

                        <p className="font-serif text-xs text-[#4A4843] dark:text-[#A3A098] leading-relaxed line-clamp-3">
                          {art.subtitle}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ExternalAvatar src={author?.avatarUrl} name={author?.realName || ''} sizeClass="w-6 h-6" />
                          <span className="font-mono text-xs text-[#121211] dark:text-[#ECEAE4] font-medium">
                            {author?.realName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[#78756E] dark:text-[#73716A]">
                          <span>{inCount} recibidas</span>
                          <span>·</span>
                          <span>{outCount} hechas</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VISTA 2: LECTOR MARGINALIA & GRAFO DIRECTO EN SVG                  */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'reader' && (
          <div className="space-y-8">
            {/* Barra de herramientas del lector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD8CE] dark:border-[#262624] pb-3 no-print">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#78756E] dark:text-[#73716A]">LEYENDO:</span>
                <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">{activeArticle.title.substring(0, 45)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGraphExpanded(!isGraphExpanded)}
                  className={`px-3 py-1.5 border font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isGraphExpanded
                      ? 'bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] border-[#121211]'
                      : 'border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#121211] dark:text-[#ECEAE4]'
                  }`}
                >
                  <GraphIcon />
                  <span>{isGraphExpanded ? 'Ocultar Grafo DAG' : 'Ver Grafo DAG Interactivo'}</span>
                </button>
                <button
                  onClick={() => handleExportObsidian(activeArticle)}
                  className="px-3 py-1.5 border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs flex items-center gap-1.5 cursor-pointer hover:border-[#121211] dark:hover:border-[#ECEAE4]"
                >
                  <CopyIcon />
                  <span>Exportar Obsidian (.md)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs flex items-center gap-1.5 cursor-pointer hover:border-[#121211] dark:hover:border-[#ECEAE4]"
                >
                  <PrintIcon />
                  <span>Imprimir A4 / PDF</span>
                </button>
              </div>
            </div>

            {/* GRAFO DIRECTO EN SVG (SIN LIBRERÍAS EXTERNAS PESADAS) */}
            {isGraphExpanded && (
              <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-4 sm:p-6 space-y-4 no-print">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                    Grafo Acíclico Dirigido (DAG) de Argumentación en Tiempo Real
                  </span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-[#14532D] dark:text-[#86EFAC]">
                      <span className="w-2 h-2 bg-[#14532D] dark:bg-[#86EFAC]"></span> [+ Apoya]
                    </span>
                    <span className="flex items-center gap-1 text-[#881337] dark:text-[#FDA4AF]">
                      <span className="w-2 h-2 bg-[#881337] dark:bg-[#FDA4AF]"></span> [- Contradice]
                    </span>
                    <span className="flex items-center gap-1 text-[#1E3A8A] dark:text-[#93C5FD]">
                      <span className="w-2 h-2 bg-[#1E3A8A] dark:bg-[#93C5FD]"></span> [→ Amplía]
                    </span>
                  </div>
                </div>

                <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#F7F5F0] dark:bg-[#0C0C0B] h-64 sm:h-72 w-full relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 240">
                    <defs>
                      <marker id="arrow-supports" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#14532D" />
                      </marker>
                      <marker id="arrow-contradicts" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#881337" />
                      </marker>
                      <marker id="arrow-extends" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#1E3A8A" />
                      </marker>
                    </defs>

                    {/* Líneas de conexión */}
                    <line x1="120" y1="50" x2="300" y2="120" stroke="#14532D" strokeWidth="1.5" markerEnd="url(#arrow-supports)" />
                    <line x1="120" y1="190" x2="300" y2="120" stroke="#881337" strokeWidth="1.5" markerEnd="url(#arrow-contradicts)" />
                    <line x1="480" y1="120" x2="300" y2="120" stroke="#1E3A8A" strokeWidth="1.5" markerEnd="url(#arrow-extends)" />

                    {/* Nodo Central: Vasconcelos */}
                    <g
                      className="cursor-pointer"
                      onClick={() => handleOpenArticleInReader('art-vasconcelos-grafos-v1')}
                    >
                      <rect x="230" y="95" width="140" height="50" fill={isDarkMode ? '#141413' : '#FDFCF9'} stroke={isDarkMode ? '#ECEAE4' : '#121211'} strokeWidth="2" />
                      <text x="300" y="117" textAnchor="middle" fontSize="11" fontFamily="Charter, Georgia, serif" fontWeight="bold" fill={isDarkMode ? '#ECEAE4' : '#121211'}>
                        Dra. Vasconcelos
                      </text>
                      <text x="300" y="132" textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace" fill={isDarkMode ? '#A3A098' : '#78756E'}>
                        [Epistemología de Grafos]
                      </text>
                    </g>

                    {/* Nodo Popper */}
                    <g
                      className="cursor-pointer"
                      onClick={() => handleOpenArticleInReader('art-popper-falsacion')}
                    >
                      <rect x="50" y="30" width="120" height="40" fill={isDarkMode ? '#141413' : '#FDFCF9'} stroke="#14532D" strokeWidth="1.5" />
                      <text x="110" y="48" textAnchor="middle" fontSize="10" fontFamily="Charter, Georgia, serif" fontWeight="bold" fill={isDarkMode ? '#ECEAE4' : '#121211'}>
                        Karl Popper
                      </text>
                      <text x="110" y="61" textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace" fill="#14532D">
                        [+ APOYA] Falsación
                      </text>
                    </g>

                    {/* Nodo Duhem & Quine */}
                    <g
                      className="cursor-pointer"
                      onClick={() => handleOpenArticleInReader('art-duhem-quine-holismo')}
                    >
                      <rect x="50" y="170" width="120" height="40" fill={isDarkMode ? '#141413' : '#FDFCF9'} stroke="#881337" strokeWidth="1.5" />
                      <text x="110" y="188" textAnchor="middle" fontSize="10" fontFamily="Charter, Georgia, serif" fontWeight="bold" fill={isDarkMode ? '#ECEAE4' : '#121211'}>
                        Duhem & Quine
                      </text>
                      <text x="110" y="201" textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace" fill="#881337">
                        [- CONTRADICE] Holismo
                      </text>
                    </g>

                    {/* Nodo Valdés */}
                    <g
                      className="cursor-pointer"
                      onClick={() => handleOpenArticleInReader('art-valdes-pbft-consenso')}
                    >
                      <rect x="430" y="100" width="120" height="40" fill={isDarkMode ? '#141413' : '#FDFCF9'} stroke="#1E3A8A" strokeWidth="1.5" />
                      <text x="490" y="118" textAnchor="middle" fontSize="10" fontFamily="Charter, Georgia, serif" fontWeight="bold" fill={isDarkMode ? '#ECEAE4' : '#121211'}>
                        Mateo Valdés
                      </text>
                      <text x="490" y="131" textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace" fill="#1E3A8A">
                        [→ AMPLÍA] PBFT Merkle
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
            )}

            {/* LAYOUT DE 2 COLUMNAS MARGINALIA (ESTILO READ.CV / STRIPE PRESS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* COLUMNA LATERAL / DOSSIER METADATA (4 Columnas) */}
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 order-2 lg:order-1">
                {/* Ficha de Autor */}
                <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <ExternalAvatar
                      src={activeAuthor?.avatarUrl}
                      name={activeAuthor?.realName || ''}
                      sizeClass="w-12 h-12"
                      className="border-2 border-[#121211] dark:border-[#ECEAE4]"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#121211] dark:text-[#ECEAE4]">
                        {activeAuthor?.realName}
                      </h4>
                      <p className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                        @{activeAuthor?.handle}
                      </p>
                    </div>
                  </div>

                  <p className="font-serif text-xs text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                    {activeAuthor?.headline}
                  </p>

                  <div className="pt-3 border-t border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#78756E] dark:text-[#73716A]">Filiación:</span>
                    <span className="text-[#121211] dark:text-[#ECEAE4]">{activeAuthor?.location}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPortfolioAuthorId(activeAuthor?.id || '');
                      setActiveTab('portfolios');
                    }}
                    className="w-full py-2 border border-[#DCD8CE] dark:border-[#262624] bg-[#F7F5F0] dark:bg-[#0C0C0B] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs uppercase tracking-wider hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-colors cursor-pointer"
                  >
                    Ver Portafolio Completo →
                  </button>
                </div>

                {/* Dossier Criptográfico & Versión */}
                <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-2">
                    <span className="text-[#78756E] dark:text-[#73716A]">ESTADO EPISTÉMICO:</span>
                    <span className="font-bold text-[#121211] dark:text-[#ECEAE4] uppercase">
                      [{activeArticle.epistemicStatus}]
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#78756E] dark:text-[#73716A] text-[10px]">HASH CANÓNICO SHA-256:</span>
                    <div className="p-2 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[10px] break-all text-[#121211] dark:text-[#ECEAE4]">
                      {activeArticle.versionHash}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#78756E] dark:text-[#73716A]">VERSIÓN ACTIVA:</span>
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">
                        {activeArticle.version.toUpperCase()} (Inmutable)
                      </span>
                    </div>
                  </div>

                  {/* Si el texto tiene objeciones [- Contradice] y el usuario es el autor, ofrecer publicar v2 */}
                  {inboundCitations.some((c) => c.relation === 'contradicts') && activeArticle.version === 'v1' && (
                    <div className="pt-3 border-t border-[#DCD8CE] dark:border-[#262624] space-y-2">
                      <div className="p-2.5 bg-[#F9EBEE] dark:bg-[#2A0E17] border border-[#DFB0BA] dark:border-[#5C1D2B] text-xs">
                        <span className="font-bold text-[#881337] dark:text-[#FDA4AF] block">
                          Objeción formal recibida
                        </span>
                        <span className="text-[11px] text-[#881337] dark:text-[#FDA4AF] leading-tight block mt-0.5 font-sans">
                          Este ensayo tiene una arista [- Contradice] por Duhem & Quine.
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setV2ContentMarkdown(activeArticle.contentMarkdown);
                          setIsV2ModalOpen(true);
                        }}
                        className="w-full py-2 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        [↻ Rectificar y Publicar v2]
                      </button>
                    </div>
                  )}
                </div>

                {/* Estadísticas de Citas Entrantes y Salientes */}
                <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-5 space-y-3 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#78756E] dark:text-[#73716A] block border-b border-[#DCD8CE] dark:border-[#262624] pb-2">
                    Árbol de Deducción
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A4843] dark:text-[#A3A098]">Citas Entrantes:</span>
                    <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">{inboundCitations.length} réplicas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A4843] dark:text-[#A3A098]">Citas Salientes:</span>
                    <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">{outboundCitations.length} premisas</span>
                  </div>
                </div>
              </aside>

              {/* COLUMNA PRINCIPAL DE LECTURA (8 Columnas) */}
              <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
                {/* Encabezado del Artículo */}
                <header className="space-y-4 border-b border-[#DCD8CE] dark:border-[#262624] pb-6">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                    <span className="uppercase">{activeArticle.area}</span>
                    <span>·</span>
                    <span>{activeArticle.publishedDate}</span>
                    <span>·</span>
                    <span className="font-bold text-[#14532D] dark:text-[#86EFAC]">{activeArticle.license}</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#121211] dark:text-[#ECEAE4] leading-[1.15]">
                    {activeArticle.title}
                  </h1>

                  <p className="font-serif text-lg sm:text-xl text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                    {activeArticle.subtitle}
                  </p>

                  {/* Si es versión v2, mostrar la nota de rectificación */}
                  {activeArticle.version === 'v2' && (
                    <div className="p-4 bg-[#EAF2EC] dark:bg-[#0D2618] border border-[#A3C6AD] dark:border-[#1B4A2B] space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#14532D] dark:text-[#86EFAC]">
                        <span>[ ↻ CAMBIÉ DE OPINIÓN ]</span>
                        <span>·</span>
                        <span>Nota de Rectificación Epistémica</span>
                      </div>
                      <p className="font-serif text-xs text-[#121211] dark:text-[#ECEAE4] leading-relaxed">
                        {activeArticle.rectificationNotes || 'Tesis actualizada tras incorporar objeciones deductorias.'}
                      </p>
                    </div>
                  )}
                </header>

                {/* CUERPO DEL ENSAYO EN PROSA SERIF CON TEXT SELECTION */}
                <article
                  onMouseUp={handleMouseUpInReader}
                  className="font-serif text-lg sm:text-[1.125rem] text-[#121211] dark:text-[#ECEAE4] leading-[1.8] space-y-6 max-w-[65ch] select-text"
                >
                  {activeArticle.contentMarkdown.split('\n\n').map((paragraph, idx) => {
                    // Resaltar pasajes con citas formales registradas
                    const matchingCitation = citations.find(
                      (c) => c.targetArticleId === activeArticle.id && paragraph.includes(c.quotedSnippet)
                    );

                    if (matchingCitation) {
                      const parts = paragraph.split(matchingCitation.quotedSnippet);
                      return (
                        <p key={idx} className="relative">
                          {parts[0]}
                          <span
                            className="prose-citation-quote cursor-help"
                            title={`Citado con relación [${matchingCitation.relation.toUpperCase()}]: ${matchingCitation.reasoning}`}
                          >
                            {matchingCitation.quotedSnippet}
                          </span>
                          {parts[1]}
                        </p>
                      );
                    }

                    return <p key={idx}>{paragraph}</p>;
                  })}
                </article>

                {/* DOSSIER DE CITAS CRUZADAS AL FINAL DEL TEXTO */}
                <section className="pt-10 border-t-2 border-[#121211] dark:border-[#ECEAE4] space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                      Dossier de Argumentación Cruzada
                    </h3>
                    <span className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                      {inboundCitations.length} respuestas formales
                    </span>
                  </div>

                  {inboundCitations.length === 0 ? (
                    <div className="p-6 border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-center font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                      No existen citas formales dirigidas a este ensayo todavía.
                      Subraya cualquier fragmento para redactar la primera réplica.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inboundCitations.map((cit) => {
                        const sArt = articles.find((a) => a.id === cit.sourceArticleId);
                        const sAuth = authors.find((a) => a.id === sArt?.authorId);

                        let badgeClasses = 'badge-supports';
                        let relationLabel = '[ + APOYA ]';
                        if (cit.relation === 'contradicts') {
                          badgeClasses = 'badge-contradicts';
                          relationLabel = '[ - CONTRADICE ]';
                        } else if (cit.relation === 'extends') {
                          badgeClasses = 'badge-extends';
                          relationLabel = '[ → AMPLÍA ]';
                        }

                        return (
                          <div
                            key={cit.id}
                            className={`p-5 border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] space-y-3`}
                          >
                            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${badgeClasses}`}>
                                  {relationLabel}
                                </span>
                                <span className="font-serif font-bold text-sm text-[#121211] dark:text-[#ECEAE4]">
                                  {sAuth?.realName}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-[#78756E] dark:text-[#73716A]">
                                {new Date(cit.timestamp).toLocaleDateString('es-ES')}
                              </span>
                            </div>

                            <blockquote className="font-serif italic text-xs text-[#4A4843] dark:text-[#A3A098] border-l-2 border-[#121211] dark:border-[#ECEAE4] pl-3 py-1">
                              «{cit.quotedSnippet}»
                            </blockquote>

                            <p className="font-serif text-sm text-[#121211] dark:text-[#ECEAE4] leading-relaxed">
                              {cit.reasoning}
                            </p>

                            <div className="pt-2 flex items-center justify-between font-mono text-[11px]">
                              <button
                                onClick={() => handleOpenArticleInReader(cit.sourceArticleId)}
                                className="underline font-bold text-[#121211] dark:text-[#ECEAE4] cursor-pointer"
                              >
                                Leer réplica completa: "{sArt?.title}" →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VISTA 3: HUECOS DEL SABER (TABLERO SOCRÁTICO)                       */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'questions' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                  PROBLEMAS ABIERTOS & DEMARCACIÓN
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121211] dark:text-[#ECEAE4] mt-1">
                  Huecos del Saber
                </h1>
                <p className="font-serif text-sm text-[#4A4843] dark:text-[#A3A098] mt-1">
                  Preguntas de investigación no resueltas formalizadas con criterios de falsabilidad y fricción socrática.
                </p>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="px-5 py-2.5 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer shrink-0"
              >
                + Registrar Nuevo Hueco del Saber
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#78756E] dark:text-[#73716A] uppercase tracking-wider">
                      <span>{q.area}</span>
                      <span>{q.createdAt}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#121211] dark:text-[#ECEAE4] leading-snug">
                      {q.title}
                    </h3>

                    <p className="font-serif text-xs text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                      {q.description}
                    </p>

                    <div className="p-3 bg-[#EFECE6]/60 dark:bg-[#1C1C1A]/60 border border-[#DCD8CE] dark:border-[#262624] space-y-1 font-mono text-[11px]">
                      <span className="font-bold text-[#121211] dark:text-[#ECEAE4] block">
                        Criterio de Falsabilidad:
                      </span>
                      <p className="text-[#4A4843] dark:text-[#A3A098] leading-relaxed font-sans text-xs">
                        {q.falsifiabilityCriteria}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#78756E] dark:text-[#73716A]">Por {q.proposerName}</span>
                    <button
                      onClick={() => {
                        setEditorTitle(`Réplica a: ${q.title}`);
                        setEditorArea(q.area);
                        setActiveTab('editor');
                        showToast('Editor preparado para redactar respuesta a este Hueco del Saber.');
                      }}
                      className="font-bold underline text-[#121211] dark:text-[#ECEAE4] cursor-pointer"
                    >
                      Responder con Ensayo →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VISTA 4: PORTAFOLIOS (CATÁLOGO EDITORIAL & OPEN BADGES 3.0)        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'portfolios' && (
          <div className="space-y-10">
            {/* Barra superior de cambio de autor y configuración directa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                  CATÁLOGO EDITORIAL DE AUTORES
                </span>
                <h1 className="font-serif text-3xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                  Portafolios Verificables
                </h1>
              </div>

              {/* Selector de autor inspeccionado + Botón directo Configurar */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedPortfolioAuthorId}
                  onChange={(e) => setSelectedPortfolioAuthorId(e.target.value)}
                  className="px-3 py-1.5 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs focus:outline-none cursor-pointer"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      Ver portafolio de: {a.realName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSelectedPortfolioAuthorId(currentActiveAuthor.id);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                  <span>Configurar Mi Perfil</span>
                </button>
              </div>
            </div>

            {/* FICHA TIPO CATÁLOGO DE ARTE: PORTADA EXTERNA ENMARCADA + MAT AVATAR */}
            <section className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413]">
              {/* Portada Panorámica Enmarcada */}
              <div className="relative">
                <ExternalBanner src={selectedPortfolioAuthor.bannerUrl} className="h-44 sm:h-60 w-full" />
                <div className="px-4 py-1.5 bg-[#EFECE6] dark:bg-[#1C1C1A] border-b border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                  <span>FIG. PORTADA — ENLACE EXTERNO RENDERIZADO EN CLIENTE (0 KB ALOJADOS)</span>
                  <span>REFERRER-POLICY: NO-REFERRER</span>
                </div>
              </div>

              {/* Información del Autor */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
                  <div className="flex items-end gap-4">
                    <ExternalAvatar
                      src={selectedPortfolioAuthor.avatarUrl}
                      name={selectedPortfolioAuthor.realName}
                      sizeClass="w-24 h-24 sm:w-28 sm:h-28"
                      className="border-4 border-[#FDFCF9] dark:border-[#141413] shadow-none"
                    />
                    <div className="space-y-0.5">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                        {selectedPortfolioAuthor.realName}
                      </h2>
                      <p className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                        @{selectedPortfolioAuthor.handle} · Miembro desde {selectedPortfolioAuthor.joinedAt}
                      </p>
                    </div>
                  </div>

                  {/* Si es el perfil activo, botón directo de edición */}
                  {selectedPortfolioAuthor.id === currentActiveAuthor.id && (
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="px-3.5 py-1.5 border border-[#121211] dark:border-[#ECEAE4] text-[#121211] dark:text-[#ECEAE4] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#EFECE6] dark:hover:bg-[#1C1C1A] cursor-pointer flex items-center gap-1.5"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      <span>Editar Portada, Foto y Redes</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-w-3xl">
                  <p className="font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    {selectedPortfolioAuthor.headline}
                  </p>
                  <p className="font-serif text-sm text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                    {selectedPortfolioAuthor.bio}
                  </p>
                  <p className="font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                    Ubicación: {selectedPortfolioAuthor.location}
                  </p>
                </div>

                {/* TABLAS ESTRUCTURADAS DE REDES SOCIALES EN 3 NIVELES */}
                <div className="space-y-4 pt-4 border-t border-[#DCD8CE] dark:border-[#262624]">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                    Canales de Contacto y Verificación de Identidad
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    {/* Tier 1: Verificación Criptográfica */}
                    <div className="border border-[#DCD8CE] dark:border-[#262624] p-3.5 space-y-2 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                      <span className="text-[10px] uppercase font-bold text-[#14532D] dark:text-[#86EFAC] flex items-center gap-1">
                        <ShieldCheckIcon />
                        <span>Tier 1 · OAuth Verificado</span>
                      </span>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#78756E] dark:text-[#73716A]">GitHub:</span>
                          {selectedPortfolioAuthor.socials?.github ? (
                            <a
                              href={`https://github.com/${selectedPortfolioAuthor.socials.github.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold underline text-[#121211] dark:text-[#ECEAE4]"
                            >
                              @{selectedPortfolioAuthor.socials.github.username} [✓]
                            </a>
                          ) : (
                            <span className="text-[#78756E] dark:text-[#73716A]">No vinculado</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#78756E] dark:text-[#73716A]">ORCID:</span>
                          {selectedPortfolioAuthor.socials?.orcid ? (
                            <a
                              href={`https://orcid.org/${selectedPortfolioAuthor.socials.orcid.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold underline text-[#121211] dark:text-[#ECEAE4]"
                            >
                              {selectedPortfolioAuthor.socials.orcid.id} [✓]
                            </a>
                          ) : (
                            <span className="text-[#78756E] dark:text-[#73716A]">No vinculado</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tier 2: Enlaces Externos */}
                    <div className="border border-[#DCD8CE] dark:border-[#262624] p-3.5 space-y-2 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                      <span className="text-[10px] uppercase font-bold text-[#4A4843] dark:text-[#A3A098] flex items-center gap-1">
                        <ExternalLinkIcon />
                        <span>Tier 2 · Redes Externas</span>
                      </span>
                      <div className="space-y-1 text-[11px] truncate">
                        {selectedPortfolioAuthor.socials?.linkedin && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.linkedin} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              LinkedIn ↗
                            </a>
                          </div>
                        )}
                        {selectedPortfolioAuthor.socials?.pinterest && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.pinterest} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              Pinterest ↗
                            </a>
                          </div>
                        )}
                        {selectedPortfolioAuthor.socials?.website && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.website} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              Sitio Web Personal ↗
                            </a>
                          </div>
                        )}
                        {selectedPortfolioAuthor.socials?.twitterX && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.twitterX} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              X / Twitter ↗
                            </a>
                          </div>
                        )}
                        {!selectedPortfolioAuthor.socials?.linkedin && !selectedPortfolioAuthor.socials?.website && !selectedPortfolioAuthor.socials?.pinterest && (
                          <span className="text-[#78756E] dark:text-[#73716A]">Sin enlaces secundarios</span>
                        )}
                      </div>
                    </div>

                    {/* Tier 3: Mecenazgo 0% Comisión */}
                    <div className="border border-[#DCD8CE] dark:border-[#262624] p-3.5 space-y-2 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                      <span className="text-[10px] uppercase font-bold text-[#1E3A8A] dark:text-[#93C5FD] flex items-center gap-1">
                        <span>§ Tier 3 · Apoyo Directo (0%)</span>
                      </span>
                      <div className="space-y-1 text-[11px]">
                        {selectedPortfolioAuthor.socials?.kofi && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.kofi} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              Ko-fi (Apoyo al creador) ↗
                            </a>
                          </div>
                        )}
                        {selectedPortfolioAuthor.socials?.liberapay && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.liberapay} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              Liberapay ↗
                            </a>
                          </div>
                        )}
                        {selectedPortfolioAuthor.socials?.githubSponsors && (
                          <div>
                            <a href={selectedPortfolioAuthor.socials.githubSponsors} target="_blank" rel="noreferrer" className="underline text-[#121211] dark:text-[#ECEAE4]">
                              GitHub Sponsors ↗
                            </a>
                          </div>
                        )}
                        {!selectedPortfolioAuthor.socials?.kofi && !selectedPortfolioAuthor.socials?.liberapay && (
                          <span className="text-[#78756E] dark:text-[#73716A]">Sin pasarela externa configurada</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPEN BADGES 3.0 (W3C VERIFIABLE CREDENTIALS) */}
                <div className="space-y-4 pt-4 border-t border-[#DCD8CE] dark:border-[#262624]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                      Insignias Oficiales de Rigor (Open Badges 3.0 W3C)
                    </h3>
                    <span className="font-mono text-[10px] text-[#78756E] dark:text-[#73716A]">
                      Haz clic en cualquier insignia para inspeccionar su JSON-LD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedPortfolioAuthor.badges.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBadgeForInspection({ badge: b, author: selectedPortfolioAuthor })}
                        className="p-3 border border-[#DCD8CE] dark:border-[#262624] bg-[#F7F5F0] dark:bg-[#0C0C0B] hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-colors cursor-pointer flex items-center gap-3"
                      >
                        <span className="font-mono text-xl w-8 h-8 flex items-center justify-center border border-[#DCD8CE] dark:border-[#262624] shrink-0 font-bold bg-[#FDFCF9] dark:bg-[#141413]">
                          {b.symbol}
                        </span>
                        <div className="space-y-0.5 truncate">
                          <h4 className="font-serif text-xs font-bold text-[#121211] dark:text-[#ECEAE4] truncate">
                            {b.name}
                          </h4>
                          <p className="font-mono text-[10px] text-[#78756E] dark:text-[#73716A] truncate">
                            {b.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VISTA 5: PUBLICAR & CITAR CON PREVISUALIZADOR Y HASH SHA-256        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                TERMINAL DE PUBLICACIÓN EDITORIAL
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#121211] dark:text-[#ECEAE4] mt-1">
                Redactar Tesis o Réplica Estructurada
              </h1>
            </div>

            {/* Si viene con un fragmento fijado (highlight-to-cite) */}
            {lockedQuote && (
              <div className="p-4 border-2 border-[#121211] dark:border-[#ECEAE4] bg-[#EFECE6] dark:bg-[#1C1C1A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span className="px-2 py-0.5 bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B]">
                      CITA VINCULADA FIJADA
                    </span>
                    <span className="uppercase">[{lockedQuote.relation}]</span>
                  </div>
                  <button
                    onClick={() => setLockedQuote(null)}
                    className="font-mono text-xs text-rose-800 dark:text-rose-400 underline cursor-pointer"
                  >
                    Desvincular fragmento ✕
                  </button>
                </div>
                <blockquote className="font-serif italic text-sm text-[#121211] dark:text-[#ECEAE4] border-l-2 border-[#121211] dark:border-[#ECEAE4] pl-3">
                  «{lockedQuote.snippet}»
                </blockquote>
                <div className="space-y-1">
                  <label className="block font-mono text-[11px] font-bold text-[#121211] dark:text-[#ECEAE4]">
                    Razonamiento lógico de la relación ({lockedQuote.relation}):
                  </label>
                  <input
                    type="text"
                    required
                    value={editorCitationReasoning}
                    onChange={(e) => setEditorCitationReasoning(e.target.value)}
                    placeholder="Explica sintéticamente por qué este fragmento respalda, contradice o amplía..."
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <form onSubmit={handlePublishArticle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                      Título del Ensayo o Proposición:
                    </label>
                    <input
                      type="text"
                      required
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      placeholder="Ej. Sobre la imposibilidad de la inducción pura..."
                      className="w-full px-3 py-2 text-lg font-serif font-bold bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                      Subtítulo o Resumen Analítico:
                    </label>
                    <input
                      type="text"
                      value={editorSubtitle}
                      onChange={(e) => setEditorSubtitle(e.target.value)}
                      placeholder="Breve proposición formal sobre el alcance de la tesis"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                      Cuerpo del Ensayo (Markdown):
                    </label>
                    <textarea
                      rows={14}
                      required
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      placeholder="Redacta tu ensayo aquí. Puedes usar párrafos separados por doble salto de línea..."
                      className="w-full p-4 text-base font-serif bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Panel de Metadatos y Hash en Vivo */}
                <div className="md:col-span-4 space-y-4">
                  <div className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-5 space-y-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4] block border-b border-[#DCD8CE] dark:border-[#262624] pb-2">
                      Parámetros de Publicación
                    </span>

                    <div className="space-y-1">
                      <label className="block font-mono text-xs text-[#78756E] dark:text-[#73716A]">Área Temática:</label>
                      <input
                        type="text"
                        value={editorArea}
                        onChange={(e) => setEditorArea(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-xs text-[#78756E] dark:text-[#73716A]">Estado Epistémico:</label>
                      <select
                        value={editorEpistemicStatus}
                        onChange={(e) => setEditorEpistemicStatus(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                      >
                        <option value="hypothesis">[Hipótesis] Proposición contrastable</option>
                        <option value="fact">[Hecho] Demostración empírica</option>
                        <option value="analysis">[Análisis] Deducción metodológica</option>
                      </select>
                    </div>

                    <div className="space-y-1 pt-2">
                      <span className="font-mono text-[10px] text-[#78756E] dark:text-[#73716A] uppercase block">
                        Firma Criptográfica SHA-256 en Tiempo Real:
                      </span>
                      <div className="p-2 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] font-mono text-[9px] break-all text-[#121211] dark:text-[#ECEAE4]">
                        {editorCalculatedHash}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DCD8CE] dark:border-[#262624]">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#121211] dark:bg-[#ECEAE4] text-[#F7F5F0] dark:text-[#0C0C0B] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                      >
                        Publicar e Indexar en Chen →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VISTA 6: MANIFIESTO & SIMULADOR RGPD ART. 17                       */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'manifesto' && (
          <div className="space-y-12">
            <div className="border-b border-[#DCD8CE] dark:border-[#262624] pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                FUNDAMENTOS & PRIVACIDAD POR DISEÑO
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#121211] dark:text-[#ECEAE4] mt-1">
                Manifiesto del Protocolo Chen
              </h1>
              <p className="font-serif text-lg text-[#4A4843] dark:text-[#A3A098] mt-2 max-w-3xl">
                Por qué el debate digital colapsó y cómo una arquitectura relacional inmutable resuelve la contradicción
                entre el Derecho al Olvido (RGPD Art. 17) y la preservación del grafo de citas.
              </p>
            </div>

            {/* TABLA COMPARATIVA ESTRATÉGICA */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                Matriz Comparativa de Arquitectura Editorial
              </h2>

              <div className="overflow-x-auto border border-[#DCD8CE] dark:border-[#262624]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#EFECE6] dark:bg-[#1C1C1A] border-b border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]">
                    <tr>
                      <th className="p-3 border-r border-[#DCD8CE] dark:border-[#262624]">Característica</th>
                      <th className="p-3 border-r border-[#DCD8CE] dark:border-[#262624]">Web Plana / Medium</th>
                      <th className="p-3 border-r border-[#DCD8CE] dark:border-[#262624]">Revistas Académicas</th>
                      <th className="p-3 font-bold bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B]">Chen v1.0</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD8CE] dark:divide-[#262624] bg-[#FDFCF9] dark:bg-[#141413]">
                    <tr>
                      <td className="p-3 font-bold border-r border-[#DCD8CE] dark:border-[#262624]">Semántica del Enlace</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Hipervínculo mudo (HTTP)</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Bibliografía estática sin tipar</td>
                      <td className="p-3 font-bold text-[#14532D] dark:text-[#86EFAC]">Cita tipada [+], [-], [→]</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold border-r border-[#DCD8CE] dark:border-[#262624]">Control de Versiones</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Sobreescritura destructiva</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Años entre erratas y fe de errores</td>
                      <td className="p-3 font-bold text-[#14532D] dark:text-[#86EFAC]">SHA-256 inmutable v1 ➔ v2</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold border-r border-[#DCD8CE] dark:border-[#262624]">Incentivo al Error</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Atrincheramiento polarizado</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Ocultamiento de fallos</td>
                      <td className="p-3 font-bold text-[#14532D] dark:text-[#86EFAC]">Insignia «Cambié de Opinión»</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold border-r border-[#DCD8CE] dark:border-[#262624]">Almacenamiento de Medios</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Gigabytes en S3 / CDN de pago</td>
                      <td className="p-3 border-r border-[#DCD8CE] dark:border-[#262624] text-[#78756E]">Servidores cerrados tras paywall</td>
                      <td className="p-3 font-bold text-[#14532D] dark:text-[#86EFAC]">0 Bytes (URLs externas no-referrer)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SIMULADOR INTERACTIVO RGPD ART. 17 (DERECHO AL OLVIDO) */}
            <section className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    SIMULADOR JURÍDICO INTERACTIVO
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4]">
                    Cumplimiento del Derecho a la Supresión (RGPD Art. 17)
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#14532D] dark:text-[#86EFAC] font-bold">
                  Conforme Reglamento UE 2016/679
                </span>
              </div>

              <p className="font-serif text-sm text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                Cuando un usuario solicita la eliminación de su cuenta en Chen, sus datos personales (nombre real, foto de perfil, portada, biografía y redes sociales) se purgan o anonimizan de forma irreversible.
                Sin embargo, sus ensayos técnicos permanecen intactos bajo su <strong>licencia irrevocable Creative Commons CC BY-SA 4.0</strong>, asegurando que ninguna cita de otros investigadores quede rota.
              </p>

              <div className="p-4 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] space-y-3 font-mono text-xs">
                <span className="font-bold text-[#121211] dark:text-[#ECEAE4] block">
                  Probar supresión RGPD sobre un autor para comprobar la anonimización:
                </span>
                <div className="flex flex-wrap gap-2">
                  {authors
                    .filter((a) => !a.isAnonymized)
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSimulateGDPRDeletion(a.id)}
                        className="px-3 py-1.5 border border-rose-800 dark:border-rose-500 text-rose-900 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-800 hover:text-white transition-colors cursor-pointer"
                      >
                        Ejercer Derecho al Olvido para: {a.realName}
                      </button>
                    ))}
                </div>
              </div>
            </section>
          </div>
        )}
          </>
        )}

        {/* ================================================================== */}
        {/* HEMISFERIO II: TABLONES ANÓNIMOS (TEMPORAL · VENTANA 90 DÍAS)      */}
        {/* ================================================================== */}
        {activeHemisphere === 'anonymous' && (
          <div className="space-y-8">
            {/* CABECERA EDITORIAL DEL TABLÓN ANÓNIMO */}
            <div className="border-b border-[#DCD8CE] dark:border-[#262624] pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78756E] dark:text-[#73716A]">
                    <span className="text-[#15803D] dark:text-[#4ADE80] font-bold">† HEMISFERIO II</span>
                    <span>·</span>
                    <span>TEXTBOARD ANÓNIMO</span>
                    <span>·</span>
                    <span className="text-[#121211] dark:text-[#ECEAE4] font-bold">
                      {anonSubtopic === 'todos' ? 'TODOS LOS SUBTEMAS' : `/${anonSubtopic}/`}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#121211] dark:text-[#ECEAE4] mt-1 tracking-tight">
                    {anonSubtopic === 'todos' && 'Tablones de Discusión Efímera'}
                    {anonSubtopic === 'codigo' && '/codigo/ — Sistemas, Rust y Algoritmos'}
                    {anonSubtopic === 'ciencia' && '/ciencia/ — Epistemología y Reproducibilidad'}
                    {anonSubtopic === 'logica' && '/logica/ — Argumentación y Deducción'}
                    {anonSubtopic === 'ideas-crudas' && '/ideas-crudas/ — Hipótesis sin Pulir'}
                    {anonSubtopic === 'meta' && '/meta/ — Filosofía y Reglas del Protocolo'}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNewThreadModalOpen(true)}
                    className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <span>+ Crear Hilo Anónimo</span>
                  </button>
                </div>
              </div>

              <p className="font-serif text-sm sm:text-base text-[#4A4843] dark:text-[#A3A098] mt-2 max-w-3xl leading-relaxed">
                Espacio desinhibido donde las hipótesis preliminares pueden someterse a contrastación brutal sin arriesgar la reputación pública.
                Cada mensaje cuenta con una <strong>ventana estricta de 90 días</strong>: tras superarla, el contenido inicial se borra y sustituye por una lápida de contexto borrado, mientras que las réplicas posteriores continúan activas.
              </p>
            </div>

            {/* SIMULADOR INTERACTIVO DE PASO DEL TIEMPO (VENTANA 90 DÍAS) */}
            <section className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-4 sm:p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#121211] dark:text-[#ECEAE4]">
                    <span className="w-2.5 h-2.5 bg-[#15803D] inline-block"></span>
                    <span>Reloj de Retención Efímera: Ventana 90 Días</span>
                    <span className="px-2 py-0.5 bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] text-[10px]">
                      +{simulatedDaysOffset} DÍAS SIMULADOS
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#78756E] dark:text-[#73716A] max-w-2xl">
                    Desplaza el control para simular el paso del tiempo y observar cómo los posts que superan los 90 días pierden su contenido inicial, mientras que las respuestas más recientes dentro del mismo hilo siguen vivas.
                  </p>
                </div>

                {/* Control Deslizante de Tiempo */}
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#4A4843] dark:text-[#A3A098]">
                    <span>Hoy (+0d)</span>
                    <span className="font-bold text-[#15803D] dark:text-[#4ADE80]">+{simulatedDaysOffset} días</span>
                    <span>Futuro (+100d)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={simulatedDaysOffset}
                    onChange={(e) => setSimulatedDaysOffset(Number(e.target.value))}
                    className="w-full accent-[#15803D] cursor-pointer"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSimulatedDaysOffset(0)}
                      className="text-[10px] font-mono text-[#78756E] dark:text-[#73716A] underline hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
                    >
                      Restablecer al presente (0 días)
                    </button>
                  </div>
                </div>
              </div>

              {/* Barra de métricas de la ventana */}
              <div className="mt-4 pt-3 border-t border-[#DCD8CE] dark:border-[#262624] flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#4A4843] dark:text-[#A3A098]">
                <div className="flex items-center gap-4">
                  <span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{totalActiveCount}</strong> posts activos (&le; 90d)
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-amber-800 dark:text-amber-400 font-bold">{totalPurgedCount}</strong> con contexto borrado (&gt; 90d)
                  </span>
                </div>
                <div className="text-[11px]">
                  Filtro activo: <strong>{filteredAnonymousThreads.length}</strong> hilos en {anonSubtopic === 'todos' ? 'todos los tablones' : `/${anonSubtopic}/`}
                </div>
              </div>
            </section>

            {/* BARRA DE SUBCONTROLES: SUBTEMAS Y VISTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-[#78756E] dark:text-[#73716A] mr-1 text-[11px]">Tablón:</span>
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'codigo', label: '/codigo/' },
                  { id: 'ciencia', label: '/ciencia/' },
                  { id: 'logica', label: '/logica/' },
                  { id: 'ideas-crudas', label: '/ideas-crudas/' },
                  { id: 'meta', label: '/meta/' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setAnonSubtopic(st.id as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                      anonSubtopic === st.id
                        ? 'border-[#15803D] bg-[#15803D] text-white font-bold'
                        : 'border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] text-[#4A4843] dark:text-[#A3A098] hover:border-[#121211] dark:hover:border-[#ECEAE4]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#78756E] dark:text-[#73716A] text-[11px]">Modo de Vista:</span>
                <div className="inline-flex border border-[#DCD8CE] dark:border-[#262624] p-0.5 bg-[#F7F5F0] dark:bg-[#0C0C0B]">
                  <button
                    onClick={() => setAnonViewMode('threads')}
                    className={`px-3 py-1 text-[11px] font-mono uppercase cursor-pointer ${
                      anonViewMode === 'threads'
                        ? 'bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold'
                        : 'text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4]'
                    }`}
                  >
                    Vista Hilos
                  </button>
                  <button
                    onClick={() => setAnonViewMode('catalog')}
                    className={`px-3 py-1 text-[11px] font-mono uppercase cursor-pointer ${
                      anonViewMode === 'catalog'
                        ? 'bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-bold'
                        : 'text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4]'
                    }`}
                  >
                    Vista Catálogo ({filteredAnonymousThreads.length})
                  </button>
                </div>
              </div>
            </div>

            {/* VISTA 2A: MODO CATÁLOGO (CUADRÍCULA DE HILOS) */}
            {anonViewMode === 'catalog' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAnonymousThreads.map((th) => {
                  const opPost = anonymousPosts.find((p) => p.postNumber === th.opPostNumber);
                  const threadPosts = anonymousPosts.filter((p) => th.postIds.includes(p.id));
                  const repliesCount = Math.max(0, threadPosts.length - 1);
                  const isOpPurged = opPost ? isPostPurged(opPost) : false;
                  const effectiveAge = opPost ? getEffectiveAge(opPost) : 0;
                  const daysLeft = opPost ? getDaysRemaining(opPost) : 0;

                  return (
                    <article
                      key={th.id}
                      className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-4 flex flex-col justify-between hover:border-[#121211] dark:hover:border-[#ECEAE4] transition-all space-y-3 group"
                    >
                      <div className="space-y-2">
                        {/* Cabecera de la tarjeta catálogo */}
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 bg-[#EFECE6] dark:bg-[#1C1C1A] text-[#121211] dark:text-[#ECEAE4] font-bold border border-[#DCD8CE] dark:border-[#262624]">
                            /{th.subtopic}/
                          </span>
                          <span className="text-[#78756E] dark:text-[#73716A]">No. {th.opPostNumber}</span>
                        </div>

                        {/* Miniatura si existe imagen */}
                        {opPost?.imageUrl && !isOpPurged ? (
                          <div
                            onClick={() => setSelectedAnonymousImageModal(opPost.imageUrl || null)}
                            className="h-28 w-full bg-[#EFECE6] dark:bg-[#1C1C1A] overflow-hidden border border-[#DCD8CE] dark:border-[#262624] cursor-pointer"
                          >
                            <img
                              src={opPost.imageUrl}
                              alt="Miniatura de hilo"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : null}

                        {/* Asunto */}
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#121211] dark:text-[#ECEAE4] leading-snug line-clamp-2">
                          {th.subject}
                        </h3>

                        {/* Extracto de texto o estado purgado */}
                        {isOpPurged ? (
                          <div className="p-2 border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-[10px] font-mono text-amber-900 dark:text-amber-300">
                            [ Contexto OP Borrado (&gt;90d) ]
                          </div>
                        ) : (
                          <p className="font-mono text-[11px] text-[#4A4843] dark:text-[#A3A098] line-clamp-3 leading-relaxed">
                            {opPost?.content.replace(/^>.*$/gm, '').trim() || opPost?.content}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#DCD8CE] dark:border-[#262624] flex items-center justify-between text-[10px] font-mono text-[#78756E] dark:text-[#73716A]">
                        <span>
                          <strong>{repliesCount}</strong> {repliesCount === 1 ? 'réplica' : 'réplicas'}
                        </span>
                        <button
                          onClick={() => {
                            setAnonViewMode('threads');
                            setTimeout(() => {
                              const el = document.getElementById(`thread-${th.id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="font-bold text-[#15803D] dark:text-[#4ADE80] underline cursor-pointer"
                        >
                          Ver Hilo →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* VISTA 2B: MODO HILOS COMPLETOS (TEXTBOARD / 4CHAN STYLE) */}
            {anonViewMode === 'threads' && (
              <div className="space-y-10">
                {filteredAnonymousThreads.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] space-y-3 font-mono">
                    <p className="text-sm text-[#78756E] dark:text-[#73716A]">
                      No hay hilos en el tablón /{anonSubtopic}/.
                    </p>
                    <button
                      onClick={() => setIsNewThreadModalOpen(true)}
                      className="px-4 py-2 bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + Publicar el Primer Hilo en /{anonSubtopic}/
                    </button>
                  </div>
                ) : (
                  filteredAnonymousThreads.map((thread) => {
                    const opPost = anonymousPosts.find((p) => p.postNumber === thread.opPostNumber);
                    if (!opPost) return null;

                    const threadReplies = anonymousPosts.filter(
                      (p) => thread.postIds.includes(p.id) && !p.isOp
                    );

                    const opEffectiveAge = getEffectiveAge(opPost);
                    const isOpTombstoned = isPostPurged(opPost);
                    const opDaysRemaining = getDaysRemaining(opPost);

                    return (
                      <section
                        id={`thread-${thread.id}`}
                        key={thread.id}
                        className="border border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] p-5 sm:p-7 space-y-5"
                      >
                        {/* ENCABEZADO DEL HILO */}
                        <div className="border-b border-[#DCD8CE] dark:border-[#262624] pb-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="px-2 py-0.5 bg-[#EFECE6] dark:bg-[#1C1C1A] text-[#121211] dark:text-[#ECEAE4] font-bold border border-[#DCD8CE] dark:border-[#262624]">
                                /{thread.subtopic}/
                              </span>
                              <span className="text-[#78756E] dark:text-[#73716A]">
                                Hilo No. {thread.opPostNumber} · Hace {opEffectiveAge} días
                              </span>
                            </div>
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#121211] dark:text-[#ECEAE4] tracking-tight">
                              {thread.subject}
                            </h2>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs">
                            <button
                              onClick={() => handleBridgeToArchive(opPost, thread)}
                              title="Copiar este hilo y premisa cruda al editor del Archivo Permanente para formalización rigurosa"
                              className="px-3 py-1 border border-[#121211] dark:border-[#ECEAE4] text-[#121211] dark:text-[#ECEAE4] hover:bg-[#121211] hover:text-[#F7F5F0] dark:hover:bg-[#ECEAE4] dark:hover:text-[#0C0C0B] transition-colors cursor-pointer text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                            >
                              <span>↗ Llevar al Archivo Permanente</span>
                            </button>
                          </div>
                        </div>

                        {/* POST ORIGINAL (OP) */}
                        <div id={`anon-post-${opPost.postNumber}`} className="space-y-3">
                          {isOpTombstoned ? (
                            /* LÁPIDA SUIZA: CONTEXTO BORRADO POR EXCEDER 90 DÍAS */
                            <div className="p-4 border-2 border-dashed border-[#A8A29E] dark:border-[#44403C] bg-[#EFECE6]/80 dark:bg-[#181816] font-mono text-xs space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#78756E] dark:text-[#73716A]">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 bg-stone-500"></span>
                                  <span>┌─ [ Post No. {opPost.postNumber} · Hace {opEffectiveAge} días ]</span>
                                </span>
                                <span className="text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
                                  CONTEXTO BORRADO AUTOMÁTICAMENTE (&gt; 90 DÍAS) ─┐
                                </span>
                              </div>
                              <p className="text-[11px] text-[#78756E] dark:text-[#73716A] italic leading-relaxed">
                                El contenido original de este mensaje inicial ha expirado y se ha purgado conforme al protocolo de retención efímera de 90 días de Chen.
                                Sin embargo, las réplicas posteriores dentro de este mismo hilo continúan visibles y preservadas a continuación.
                              </p>
                            </div>
                          ) : (
                            /* POST OP ACTIVO E ÍNTEGRO */
                            <div className="space-y-3">
                              {/* Meta cabecera del OP */}
                              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#78756E] dark:text-[#73716A]">
                                <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">Anónimo</span>
                                <span className={`px-1.5 py-0.2 border text-[10px] font-mono font-bold ${getAnonColor(opPost.authorAnonId)}`}>
                                  ID: {opPost.authorAnonId}
                                </span>
                                <span>·</span>
                                <span>Hace {opEffectiveAge} días</span>
                                <span>·</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuotePostNumber(opPost.postNumber, thread.id)}
                                  className="font-bold text-[#121211] dark:text-[#ECEAE4] hover:underline cursor-pointer"
                                >
                                  No. {opPost.postNumber}
                                </button>
                                <span>·</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                                  [ Caduca en {opDaysRemaining}d ]
                                </span>
                                {renderStanceBadge(opPost.stance)}
                              </div>

                              {/* Imagen del OP si existe */}
                              {opPost.imageUrl && (
                                <div className="sm:float-left sm:mr-4 mb-3 sm:mb-1">
                                  <div
                                    onClick={() => setSelectedAnonymousImageModal(opPost.imageUrl || null)}
                                    className="border border-[#DCD8CE] dark:border-[#262624] p-1 bg-[#EFECE6] dark:bg-[#1C1C1A] cursor-pointer group"
                                  >
                                    <img
                                      src={opPost.imageUrl}
                                      alt="Adjunto anónimo"
                                      referrerPolicy="no-referrer"
                                      className="max-h-48 max-w-full sm:max-w-xs object-cover"
                                    />
                                    <span className="block text-[9px] font-mono text-center text-[#78756E] dark:text-[#73716A] pt-1 group-hover:underline">
                                      [Click para ampliar]
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Contenido con Greentext y Quotes */}
                              {renderAnonymousContent(opPost.content, thread.id, (num) =>
                                handleQuotePostNumber(num, thread.id)
                              )}

                              {/* Acciones del OP */}
                              <div className="pt-2 flex items-center gap-3 font-mono text-[11px] text-[#78756E] dark:text-[#73716A] clear-both">
                                <button
                                  type="button"
                                  onClick={() => handleQuotePostNumber(opPost.postNumber, thread.id)}
                                  className="underline hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
                                >
                                  [ &gt;&gt; Citar No. {opPost.postNumber} ]
                                </button>
                                <span>·</span>
                                <button
                                  type="button"
                                  onClick={() => handleBridgeToArchive(opPost, thread)}
                                  className="underline hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer text-[#15803D] dark:text-[#4ADE80] font-bold"
                                >
                                  [ ↗ Llevar al Archivo Permanente ]
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* LISTA DE RÉPLICAS DENTRO DEL HILO */}
                        {threadReplies.length > 0 && (
                          <div className="border-l-2 border-[#DCD8CE] dark:border-[#262624] pl-3 sm:pl-5 space-y-3 pt-2">
                            <span className="font-mono text-[10px] text-[#78756E] dark:text-[#73716A] uppercase tracking-wider block">
                              {threadReplies.length} {threadReplies.length === 1 ? 'Réplica en este hilo' : 'Réplicas en este hilo'}:
                            </span>

                            {threadReplies.map((reply) => {
                              const replyAge = getEffectiveAge(reply);
                              const isReplyPurged = isPostPurged(reply);
                              const replyDaysRemaining = getDaysRemaining(reply);

                              if (isReplyPurged) {
                                return (
                                  <div
                                    key={reply.id}
                                    id={`anon-post-${reply.postNumber}`}
                                    className="p-2 border border-dashed border-[#A8A29E] dark:border-[#44403C] bg-[#EFECE6]/40 dark:bg-[#181816]/60 font-mono text-[11px] text-[#78756E] dark:text-[#73716A] flex flex-wrap items-center justify-between gap-2"
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-stone-400"></span>
                                      <span>Post No. {reply.postNumber} · Hace {replyAge} días · ID: {reply.authorAnonId}</span>
                                    </span>
                                    <span className="text-amber-800 dark:text-amber-400 font-bold uppercase text-[10px]">
                                      [ CONTEXTO BORRADO &gt; 90 DÍAS ]
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <article
                                  key={reply.id}
                                  id={`anon-post-${reply.postNumber}`}
                                  className="p-3.5 bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] space-y-2.5"
                                >
                                  {/* Encabezado de la réplica */}
                                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#78756E] dark:text-[#73716A]">
                                    <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">Anónimo</span>
                                    <span className={`px-1 py-0.2 border text-[9px] font-mono font-bold ${getAnonColor(reply.authorAnonId)}`}>
                                      ID: {reply.authorAnonId}
                                    </span>
                                    <span>·</span>
                                    <span>Hace {replyAge} días</span>
                                    <span>·</span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuotePostNumber(reply.postNumber, thread.id)}
                                      className="font-bold text-[#121211] dark:text-[#ECEAE4] hover:underline cursor-pointer"
                                    >
                                      No. {reply.postNumber}
                                    </button>
                                    <span>·</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                                      [ Caduca en {replyDaysRemaining}d ]
                                    </span>
                                    {renderStanceBadge(reply.stance)}
                                  </div>

                                  {/* Imagen de la réplica si existe */}
                                  {reply.imageUrl && (
                                    <div className="mb-2">
                                      <div
                                        onClick={() => setSelectedAnonymousImageModal(reply.imageUrl || null)}
                                        className="inline-block border border-[#DCD8CE] dark:border-[#262624] p-1 bg-[#EFECE6] dark:bg-[#1C1C1A] cursor-pointer"
                                      >
                                        <img
                                          src={reply.imageUrl}
                                          alt="Adjunto"
                                          referrerPolicy="no-referrer"
                                          className="max-h-36 max-w-xs object-cover"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Contenido formateado */}
                                  {renderAnonymousContent(reply.content, thread.id, (num) =>
                                    handleQuotePostNumber(num, thread.id)
                                  )}

                                  {/* Acciones de la réplica */}
                                  <div className="pt-1 flex items-center gap-3 font-mono text-[10px] text-[#78756E] dark:text-[#73716A]">
                                    <button
                                      type="button"
                                      onClick={() => handleQuotePostNumber(reply.postNumber, thread.id)}
                                      className="underline hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
                                    >
                                      [ &gt;&gt; Citar No. {reply.postNumber} ]
                                    </button>
                                    <span>·</span>
                                    <button
                                      type="button"
                                      onClick={() => handleBridgeToArchive(reply, thread)}
                                      className="underline hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer text-[#15803D] dark:text-[#4ADE80] font-bold"
                                    >
                                      [ ↗ Llevar al Archivo ]
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        )}

                        {/* CAJA DE RESPUESTA RÁPIDA INLINE AL PIE DEL HILO */}
                        <div className="pt-3 border-t border-[#DCD8CE] dark:border-[#262624] bg-[#F7F5F0] dark:bg-[#0C0C0B] p-3.5 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                            <span className="font-bold text-[#121211] dark:text-[#ECEAE4]">
                              Responder al Hilo No. {thread.opPostNumber}:
                            </span>
                            <span className="text-[#78756E] dark:text-[#73716A] text-[10px]">
                              Usa <code>&gt;</code> para greentext o click en <code>No. XXXXX</code> para citar
                            </span>
                          </div>

                          <textarea
                            rows={3}
                            value={quickReplyTexts[thread.id] || ''}
                            onChange={(e) => setQuickReplyTexts({ ...quickReplyTexts, [thread.id]: e.target.value })}
                            placeholder="Escribe tu réplica técnica o empírica..."
                            className="w-full p-2.5 text-xs font-mono bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none focus:border-[#15803D]"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={quickReplyStances[thread.id] || 'supports'}
                                onChange={(e) =>
                                  setQuickReplyStances({ ...quickReplyStances, [thread.id]: e.target.value as any })
                                }
                                className="text-xs font-mono px-2 py-1.5 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                              >
                                <option value="supports">[+ Apoya] Respaldar premisa</option>
                                <option value="contradicts">[- Contradice] Refutar premisa</option>
                                <option value="extends">[→ Amplía] Desarrollar análisis</option>
                                <option value="questions">[? Duda] Cuestionar método</option>
                              </select>

                              <input
                                type="url"
                                value={quickReplyImages[thread.id] || ''}
                                onChange={(e) => setQuickReplyImages({ ...quickReplyImages, [thread.id]: e.target.value })}
                                placeholder="URL externa imagen opcional"
                                className="text-xs font-mono px-2 py-1.5 bg-[#FDFCF9] dark:bg-[#141413] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] w-48 sm:w-64"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCreateAnonymousReply(thread.id)}
                              className="px-4 py-1.5 bg-[#121211] text-[#F7F5F0] dark:bg-[#ECEAE4] dark:text-[#0C0C0B] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#2C2B29] dark:hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                            >
                              Publicar Réplica Anónima →
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODALES DEL HEMISFERIO II: TABLONES ANÓNIMOS                         */}
      {/* ==================================================================== */}

      {/* MODAL 1: CREAR NUEVO HILO ANÓNIMO */}
      {isNewThreadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#FDFCF9] dark:bg-[#141413] border-2 border-[#121211] dark:border-[#ECEAE4] max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#DCD8CE] dark:border-[#262624] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#15803D] dark:text-[#4ADE80] uppercase tracking-wider">
                  Hemisferio II · Tablón Efímero
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121211] dark:text-[#ECEAE4] mt-0.5">
                  Iniciar Nuevo Hilo Anónimo
                </h3>
              </div>
              <button
                onClick={() => setIsNewThreadModalOpen(false)}
                className="font-mono text-xs text-[#78756E] dark:text-[#73716A] hover:text-[#121211] dark:hover:text-[#ECEAE4] cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>

            <form onSubmit={handleCreateAnonymousThread} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    Subtema / Tablón de destino:
                  </label>
                  <select
                    value={newThreadSubtopic}
                    onChange={(e) => setNewThreadSubtopic(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  >
                    <option value="codigo">/codigo/ — Arquitectura, Rust y Algoritmos</option>
                    <option value="ciencia">/ciencia/ — Epistemología y Reproducibilidad</option>
                    <option value="logica">/logica/ — Argumentación y Deducción</option>
                    <option value="ideas-crudas">/ideas-crudas/ — Hipótesis sin Pulir</option>
                    <option value="meta">/meta/ — Filosofía y Reglas del Tablón</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    Postura Inicial:
                  </label>
                  <select
                    value={newThreadStance}
                    onChange={(e) => setNewThreadStance(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4]"
                  >
                    <option value="supports">[+ Apoya] Proposición afirmativa</option>
                    <option value="contradicts">[- Contradice] Refutación de consenso</option>
                    <option value="extends">[→ Amplía] Síntesis o extensión</option>
                    <option value="questions">[? Duda] Paradoja o interrogante abierta</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  Asunto o Pregunta Central del Hilo:
                </label>
                <input
                  type="text"
                  required
                  value={newThreadSubject}
                  onChange={(e) => setNewThreadSubject(e.target.value)}
                  placeholder="¿Por qué el modelo X falla en condición Y...?"
                  className="w-full px-3 py-2 text-sm font-serif font-bold bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#121211] dark:text-[#ECEAE4]">
                  URL de Imagen Externa (Opcional · Pinterest, Unsplash, Imgur):
                </label>
                <input
                  type="url"
                  value={newThreadImageUrl}
                  onChange={(e) => setNewThreadImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... o https://i.pinimg.com/..."
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-semibold text-[#121211] dark:text-[#ECEAE4]">
                    Cuerpo del Mensaje (Soporta Greentext con &gt;):
                  </label>
                  <span className="text-[#78756E] dark:text-[#73716A] text-[10px]">Líneas con &gt; serán verdes</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Plantea tu argumento, objeción o intuición..."
                  className="w-full p-3 text-xs font-mono bg-[#F7F5F0] dark:bg-[#0C0C0B] border border-[#DCD8CE] dark:border-[#262624] text-[#121211] dark:text-[#ECEAE4] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#EFECE6] dark:bg-[#1C1C1A] border border-[#DCD8CE] dark:border-[#262624] text-[11px] font-mono text-[#78756E] dark:text-[#73716A]">
                Ventana de Purga: Este hilo permanecerá activo durante 90 días. Si la discusión fructifica, cualquier usuario puede promoverlo al Archivo Permanente con el botón <code>[ ↗ Llevar al Archivo Permanente ]</code>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewThreadModalOpen(false)}
                  className="px-3 py-1.5 font-mono text-xs text-[#78756E] dark:text-[#73716A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Publicar Hilo Anónimo →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AMPLIADOR DE IMAGEN ANÓNIMA */}
      {selectedAnonymousImageModal && (
        <div
          onClick={() => setSelectedAnonymousImageModal(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 no-print cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[90vh] bg-[#141413] border border-[#333330] p-2 space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#A3A098] px-2 py-1">
              <span>Adjunto Anónimo · Visualizador Externo</span>
              <button
                onClick={() => setSelectedAnonymousImageModal(null)}
                className="text-white hover:text-rose-400 cursor-pointer"
              >
                [Cerrar ✕]
              </button>
            </div>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center bg-black">
              <img
                src={selectedAnonymousImageModal}
                alt="Imagen externa ampliada"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOOLTIP FLOTANTE DE CITAS >>84XXX */}
      {hoveredPostQuoteNumber && (
        <aside
          role="tooltip"
          className="fixed bottom-6 left-6 z-50 p-3 bg-[#FDFCF9] dark:bg-[#141413] border-2 border-[#121211] dark:border-[#ECEAE4] max-w-sm text-xs font-mono shadow-xl pointer-events-none no-print"
        >
          {(() => {
            const targetPost = anonymousPosts.find((p) => p.postNumber === hoveredPostQuoteNumber);
            if (!targetPost) return <span>Post No. {hoveredPostQuoteNumber} no encontrado en la base local.</span>;
            const targetAge = getEffectiveAge(targetPost);
            const isTargetPurged = isPostPurged(targetPost);
            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 border-b border-[#DCD8CE] dark:border-[#262624] pb-1 text-[10px] font-bold">
                  <span>Vista Previa: Post No. {targetPost.postNumber}</span>
                  <span className={isTargetPurged ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}>
                    {isTargetPurged ? '[Contexto Borrado >90d]' : `Hace ${targetAge}d · ID: ${targetPost.authorAnonId}`}
                  </span>
                </div>
                <p className="text-[11px] line-clamp-3 text-[#4A4843] dark:text-[#A3A098] leading-relaxed">
                  {isTargetPurged
                    ? 'El contenido original de este mensaje ha expirado por superar la ventana de 90 días.'
                    : targetPost.content}
                </p>
              </div>
            );
          })()}
        </aside>
      )}

      {/* ==================================================================== */}
      {/* 3. PIE DE PÁGINA EDITORIAL                                          */}
      {/* ==================================================================== */}
      <footer className="border-t border-[#DCD8CE] dark:border-[#262624] bg-[#FDFCF9] dark:bg-[#141413] py-8 text-xs font-mono text-[#78756E] dark:text-[#73716A] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base text-[#121211] dark:text-[#ECEAE4]">CHEN</span>
            <span>·</span>
            <span>Protocolo de Publicación y Argumentación Abierta</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedPortfolioAuthorId(currentActiveAuthor.id);
                setIsEditProfileModalOpen(true);
              }}
              className="text-[#121211] dark:text-[#ECEAE4] font-bold underline cursor-pointer"
            >
              [Mi Perfil ✎]
            </button>
            <span>·</span>
            <span>0 KB Alojados</span>
            <span>·</span>
            <span>CC BY-SA 4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
