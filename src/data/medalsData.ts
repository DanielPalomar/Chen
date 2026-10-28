import { EpistemicMedal, UserProfile, Author } from '../types';

export const OFFICIAL_CHEN_MEDALS: EpistemicMedal[] = [
  {
    id: 'medal-cambie-de-opinion',
    name: 'Insignia «Cambié de opinión»',
    shortName: 'Rectificación',
    category: 'epistemology',
    level: 'laurel',
    icon: 'RotateCcw',
    description: 'Concedida al autor que rectifica públicamente una postura ante nueva evidencia empírica contrastada o demostración formal irrefutable. En Chen el error corregido suma credibilidad.',
    criteria: 'Al menos 1 rectificación pública registrada en artículos o debates con registro de la tesis previa y la nueva evidencia.',
    unlocked: true,
    featured: true,
    earnedDate: '24 de Octubre, 2026',
    evidenceText: 'Rectificación pública documentada en artículo: "Notación estocástica en gradiente descendente".',
    evidenceLink: '#art-3',
    progressCurrent: 3,
    progressTarget: 1,
    verificationHash: 'SHA256:7c9d04...chen-epistemic-rec-2026',
  },
  {
    id: 'medal-revisor-riguroso',
    name: 'Revisor de Pares Riguroso',
    shortName: 'Pares Críticos',
    category: 'rigor',
    level: 'gold',
    icon: 'Award',
    description: 'Otorgada por auditar metodologías, contrastar citas primarias y validar derivaciones formales en artículos ajenos con cortesía epistémica y sin descalificaciones.',
    criteria: '5 o más revisiones por pares completadas con reporte metodológico detallado.',
    unlocked: true,
    featured: true,
    earnedDate: '15 de Octubre, 2026',
    evidenceText: '6 revisiones metodológicas aceptadas en las áreas de Filosofía y Computación.',
    progressCurrent: 6,
    progressTarget: 5,
    verificationHash: 'SHA256:3a1b8e...chen-peer-review-v1',
  },
  {
    id: 'medal-resolutor-huecos',
    name: 'Resolutor de Huecos del Saber',
    shortName: 'Hueco Resuelto',
    category: 'epistemology',
    level: 'silver',
    icon: 'HelpCircle',
    description: 'Reconoce a quien formula explicaciones razonadas con fuentes contrastadas a preguntas abiertas que ningún otro autor había clarificado.',
    criteria: '3 o más respuestas aportadas a "Huecos del Saber" comunitarios con citas primarias.',
    unlocked: true,
    featured: true,
    earnedDate: '11 de Octubre, 2026',
    evidenceText: '5 explicaciones aceptadas en epistemología de la ciencia y sistemas formales.',
    progressCurrent: 5,
    progressTarget: 3,
    verificationHash: 'SHA256:f52d19...chen-gap-solution-v1',
  },
  {
    id: 'medal-citas-semanticas',
    name: 'Tejedor de Citas Semánticas',
    shortName: 'Red de Fuentes',
    category: 'dialectic',
    level: 'gold',
    icon: 'GitBranch',
    description: 'Enriquece el grafo de conocimiento libre conectando artículos de Chen mediante citas clasificadas en: Apoya, Contradice o Amplía.',
    criteria: '10 o más citas funcionales enlazadas a artículos de la red abierta.',
    unlocked: true,
    featured: true,
    earnedDate: '8 de Octubre, 2026',
    evidenceText: '14 referencias semánticas conectadas: 8 de apoyo, 3 de contradicción y 3 de ampliación.',
    progressCurrent: 14,
    progressTarget: 10,
    verificationHash: 'SHA256:88e04b...chen-citations-network',
  },
  {
    id: 'medal-constructor-dialectico',
    name: 'Constructor Dialéctico',
    shortName: 'Tesis / Antítesis',
    category: 'dialectic',
    level: 'silver',
    icon: 'Scale',
    description: 'Formula síntesis equilibradas en el módulo de Tesis y Antítesis, contraponiendo hipótesis rivales con el mismo estándar probatorio.',
    criteria: '2 o más síntesis dialécticas publicadas sin sesgos personales ni falacias ad hominem.',
    unlocked: true,
    featured: false,
    earnedDate: '20 de Octubre, 2026',
    evidenceText: 'Aportes dialécticos en: "Falsacionismo vs. Paradigmas de Kuhn" y "Determinismo en Sistemas Complejos".',
    progressCurrent: 2,
    progressTarget: 2,
    verificationHash: 'SHA256:22c9b1...chen-thesis-synthesizer',
  },
  {
    id: 'medal-fuentes-abiertas',
    name: 'Curador de Fuentes Abiertas',
    shortName: 'Dominio Abierto',
    category: 'open_knowledge',
    level: 'gold',
    icon: 'BookOpen',
    description: 'Publica apuntes libres y cataloga volúmenes académicos de dominio público (CC0 / CC BY) en la biblioteca comunitaria.',
    criteria: '4 o más artículos o recursos catalogados con licencia abierta estricta.',
    unlocked: true,
    featured: false,
    earnedDate: '5 de Octubre, 2026',
    evidenceText: '4 monografías indexadas bajo licencia CC BY 4.0 con KaTeX y Markdown verificado.',
    progressCurrent: 4,
    progressTarget: 4,
    verificationHash: 'SHA256:91aa54...chen-open-curator',
  },
  {
    id: 'medal-identidad-verificada',
    name: 'Identidad Verificada (OAuth / ORCID)',
    shortName: 'Verificación',
    category: 'verification',
    level: 'silver',
    icon: 'ShieldCheck',
    description: 'Verificación técnica basada en firma de clave pública mediante GitHub OAuth o registro oficial ORCID para investigadores.',
    criteria: 'Cuenta verificada mediante GitHub u ORCID.',
    unlocked: true,
    featured: false,
    earnedDate: '1 de Octubre, 2026',
    evidenceText: 'Verificación dual activa: GitHub (@claramendez-sci) y ORCID (0000-0002-1825-0097).',
    progressCurrent: 2,
    progressTarget: 1,
    verificationHash: 'SHA256:66ef12...chen-oauth-verified',
  },
  {
    id: 'medal-pionero-fundador',
    name: 'Pionero Fundador AGPL',
    shortName: 'Génesis Chen',
    category: 'community',
    level: 'laurel',
    icon: 'Sparkles',
    description: 'Miembro activo durante la fase fundacional de Chen. Contribuyó al nacimiento de la plataforma abierta y libre de algoritmos comerciales.',
    criteria: 'Participación demostrada en la primera fase de desarrollo de Chen.',
    unlocked: true,
    featured: false,
    earnedDate: '1 de Octubre, 2026',
    evidenceText: 'Registro #0012 en el libro génesis de la comunidad Chen.',
    progressCurrent: 1,
    progressTarget: 1,
    verificationHash: 'SHA256:0001ff...chen-genesis-founder',
  },
  {
    id: 'medal-mecenas-agpl',
    name: 'Mecenas de la Infraestructura Libre',
    shortName: 'Sostén Libre',
    category: 'community',
    level: 'gold',
    icon: 'Heart',
    description: 'Apoya voluntariamente los costes de alojamiento de Chen o contribuye directamente a otros investigadores sin comisiones.',
    criteria: 'Contribución externa voluntaria comprobada en Liberapay / Ko-fi o servidores comunitarios.',
    unlocked: true,
    featured: false,
    earnedDate: '18 de Octubre, 2026',
    evidenceText: 'Apoyo voluntario registrado para digitalización de fondos en CC0.',
    progressCurrent: 1,
    progressTarget: 1,
    verificationHash: 'SHA256:55cc89...chen-patron-supporter',
  },
  {
    id: 'medal-puente-multilingue',
    name: 'Puente Multilingüe del Saber',
    shortName: 'Traductor Libre',
    category: 'open_knowledge',
    level: 'bronze',
    icon: 'Globe',
    description: 'Aporta versiones bilingües, traducciones de términos científicos o glosarios accesibles para hablantes de español y otras lenguas.',
    criteria: '2 o más artículos o glosarios traducidos con rigor terminológico.',
    unlocked: false,
    featured: false,
    progressCurrent: 1,
    progressTarget: 2,
    evidenceText: '1 traducción formal completada en Filosofía (falta 1 para desbloquear).',
  },
];

/**
 * Generate personal user medals according to user profile data
 */
export const getUserMedals = (user: UserProfile): EpistemicMedal[] => {
  const stats = user.communityStats || {
    citationsGivenCount: 0,
    changedMindCount: 0,
    gapsAnsweredCount: 0,
    articlesPublishedCount: 0,
    threadsCreatedCount: 0,
    reviewsDoneCount: 0,
  };

  // If user already has custom configured medals, respect their pinned/unlocked states
  if (user.medals && user.medals.length > 0) {
    return user.medals;
  }

  // Otherwise calculate dynamically
  return OFFICIAL_CHEN_MEDALS.map((base) => {
    let unlocked = base.unlocked;
    let progressCurrent = base.progressCurrent || 0;
    const progressTarget = base.progressTarget || 1;
    let evidenceText = base.evidenceText;

    if (base.id === 'medal-cambie-de-opinion') {
      progressCurrent = stats.changedMindCount;
      unlocked = stats.changedMindCount > 0;
      evidenceText = `${stats.changedMindCount} rectificaciones públicas registradas en Chen.`;
    } else if (base.id === 'medal-revisor-riguroso') {
      progressCurrent = stats.reviewsDoneCount;
      unlocked = stats.reviewsDoneCount >= 5;
      evidenceText = `${stats.reviewsDoneCount} revisiones metodológicas completadas.`;
    } else if (base.id === 'medal-resolutor-huecos') {
      progressCurrent = stats.gapsAnsweredCount;
      unlocked = stats.gapsAnsweredCount >= 3;
      evidenceText = `${stats.gapsAnsweredCount} huecos del saber resueltos con fuentes.`;
    } else if (base.id === 'medal-citas-semanticas') {
      progressCurrent = stats.citationsGivenCount;
      unlocked = stats.citationsGivenCount >= 10;
      evidenceText = `${stats.citationsGivenCount} referencias semánticas aportadas.`;
    } else if (base.id === 'medal-fuentes-abiertas') {
      progressCurrent = stats.articlesPublishedCount;
      unlocked = stats.articlesPublishedCount >= 4;
      evidenceText = `${stats.articlesPublishedCount} obras/artículos publicados bajo licencia CC.`;
    } else if (base.id === 'medal-identidad-verificada') {
      const verifications = (user.githubVerified ? 1 : 0) + (user.orcidVerified ? 1 : 0);
      progressCurrent = verifications;
      unlocked = verifications > 0;
      evidenceText = user.githubVerified && user.orcidVerified
        ? 'Doble verificación activa: GitHub y ORCID.'
        : user.githubVerified
        ? 'Identidad técnica verificada vía GitHub OAuth.'
        : user.orcidVerified
        ? 'Identidad académica verificada vía ORCID.'
        : 'Vincula tu GitHub o identificador ORCID.';
    }

    return {
      ...base,
      unlocked,
      progressCurrent,
      progressTarget,
      evidenceText,
    };
  });
};

/**
 * Generate medals for an Author
 */
export const getAuthorMedals = (author: Author): EpistemicMedal[] => {
  return OFFICIAL_CHEN_MEDALS.map((base) => {
    let unlocked = base.unlocked;
    if (base.id === 'medal-cambie-de-opinion') {
      unlocked = author.changedMindCount > 0;
    } else if (base.id === 'medal-identidad-verificada') {
      unlocked = Boolean(author.githubUser || author.orcidId);
    }
    return {
      ...base,
      unlocked,
    };
  });
};
