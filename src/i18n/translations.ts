export type AppLanguage = 'es' | 'en';

export const TRANSLATIONS = {
  es: {
    // Brand & Tagline
    brandName: 'Chen',
    tagline: 'Conocimiento libre, debatido con argumentos, no con likes.',
    subTagline: 'Comunidad abierta sin ánimo de lucro. Licencia libre AGPLv3. Sin algoritmos de engagement, sin publicidad y sin muros de pago.',
    sustainabilityPledge: 'Sin anuncios. Sin rastreo. Sostenido por aportes públicos voluntarios.',
    sustainabilityLink: 'Ver sostenibilidad y cuentas',

    // Navigation
    navArticles: 'Artículos',
    navAreas: 'Áreas',
    navBooks: 'Libros gratis',
    navRepositories: 'Directorio de fuentes',
    navGaps: 'Huecos del saber',
    navForum: 'Foro',
    navStudy: 'Estudio y práctica',
    navThesis: 'Tesis y Antítesis',
    navClaims: 'Reclamaciones',
    navSearch: 'Buscar',
    navWrite: 'Escribir',
    navLogin: 'Iniciar sesión',
    navProfile: 'Mi perfil',
    navSettings: 'Ajustes',
    settingsTitle: 'Ajustes, Lectura y Privacidad',
    navManifesto: 'Manifiesto',
    navModeration: 'Moderación',
    navReputation: 'Cómo funciona la reputación',
    navRedLines: 'Líneas rojas',

    // Reading Controls
    readingOptions: 'Opciones de lectura',
    fontSerif: 'Serif (Editorial)',
    fontSans: 'Sans (Inter)',
    fontMono: 'Mono (Código)',
    fontAssisted: 'Lectura asistida',
    assistedDesc: 'Espaciado aumentado, tipografía hiperlegible y medida corta para mayor descanso visual.',
    sizeStandard: 'Estándar (18px)',
    sizeLarge: 'Grande (20px)',
    lineFocus: 'Enfoque de línea',
    themeLight: 'Blanco cálido (#FAFAF9)',
    themeSepia: 'Modo Sepia (#F6F1E7)',
    themeDark: 'Oscuro índigo (#0F0E1A)',

    // Common Actions
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    publish: 'Publicar',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Descargar',
    exportData: 'Exportar datos',
    searchPlaceholder: 'Buscar artículos, áreas, fórmulas o autores...',
    filterByArea: 'Filtrar por área',
    sortByDate: 'Más recientes',
    sortByRelevance: 'Relevancia',

    // Epistemic labels
    labelFact: 'Hecho comprobado',
    labelHypothesis: 'Hipótesis falsable',
    labelOpinion: 'Opinión analítica',
    labelAi: 'Declarado con IA',

    // Citation relations
    relationSupports: 'Apoya',
    relationContradicts: 'Contradice',
    relationExtends: 'Amplía',

    // Levels
    levelIntro: 'Introductorio',
    levelInter: 'Intermedio',
    levelAdv: 'Avanzado',

    // Content types
    typeExplanation: 'Explicación',
    typeTutorial: 'Tutorial paso a paso',
    typeThesis: 'Tesis / Argumento',
    typeReview: 'Reseña crítica',
    typeNote: 'Apunte personal',
  },
  en: {
    // Brand & Tagline
    brandName: 'Chen',
    tagline: 'Free knowledge, debated with arguments, not likes.',
    subTagline: 'Open non-profit community. AGPLv3 open license. No engagement algorithms, no ads, no paywalls.',
    sustainabilityPledge: 'No ads. No tracking. Sustained by voluntary public contributions.',
    sustainabilityLink: 'View sustainability & accounts',

    // Navigation
    navArticles: 'Articles',
    navAreas: 'Areas',
    navBooks: 'Free Books',
    navRepositories: 'Source Directory',
    navGaps: 'Knowledge Gaps',
    navForum: 'Forum',
    navStudy: 'Study & Practice',
    navThesis: 'Thesis / Antithesis',
    navClaims: 'Complaints Book',
    navSearch: 'Search',
    navWrite: 'Write',
    navLogin: 'Sign In',
    navProfile: 'My Profile',
    navSettings: 'Settings',
    settingsTitle: 'Settings, Reading & Privacy',
    navManifesto: 'Manifesto',
    navModeration: 'Moderation',
    navReputation: 'How reputation works',
    navRedLines: 'Red lines',

    // Reading Controls
    readingOptions: 'Reading options',
    fontSerif: 'Serif (Newsreader)',
    fontSans: 'Sans (Inter)',
    fontMono: 'Mono (Code)',
    fontAssisted: 'Assisted reading',
    assistedDesc: 'Wider letter and word spacing, high-legibility measure and relaxed line-height.',
    sizeStandard: 'Standard (18px)',
    sizeLarge: 'Large (20px)',
    lineFocus: 'Line focus',
    themeLight: 'Warm paper (#FAFAF9)',
    themeSepia: 'Sepia mode (#F6F1E7)',
    themeDark: 'Dark indigo (#0F0E1A)',

    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    publish: 'Publish',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    exportData: 'Export data',
    searchPlaceholder: 'Search articles, areas, formulas or authors...',
    filterByArea: 'Filter by area',
    sortByDate: 'Most recent',
    sortByRelevance: 'Relevance',

    // Epistemic labels
    labelFact: 'Verified fact',
    labelHypothesis: 'Falsifiable hypothesis',
    labelOpinion: 'Analytical opinion',
    labelAi: 'Declared with AI',

    // Citation relations
    relationSupports: 'Supports',
    relationContradicts: 'Contradicts',
    relationExtends: 'Extends',

    // Levels
    levelIntro: 'Introductory',
    levelInter: 'Intermediate',
    levelAdv: 'Advanced',

    // Content types
    typeExplanation: 'Explanation',
    typeTutorial: 'Step-by-step tutorial',
    typeThesis: 'Thesis / Argument',
    typeReview: 'Critical review',
    typeNote: 'Personal note',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.es;

export const t = (key: TranslationKey, lang: AppLanguage = 'es'): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.es[key] || key;
};
