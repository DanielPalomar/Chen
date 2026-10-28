import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';

// ============================================================================
// 1. ERROR BOUNDARY DE RECUPERACIÓN EDITORIAL
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
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#141413] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white border border-[#E4E2DD] p-8 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>Incidente de Renderizado en Chen</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#141413]">
              El protocolo detectó un error de hidratación o estado
            </h1>
            <p className="text-xs text-[#605F5B] font-mono leading-relaxed">
              {this.state.error?.message || 'Error inesperado al inicializar la sesión.'}
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-[#141413] text-[#FBF9F5] rounded font-mono text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Limpiar Almacenamiento Local y Restaurar Estado
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
// 2. MODELO DE DATOS Y TIPOS
// ============================================================================
export type EpistemicStatus = 'hypothesis' | 'fact' | 'analysis';
export type CitationRelation = 'supports' | 'contradicts' | 'extends';

export interface Author {
  id: string;
  name: string;
  handle: string;
  affiliation: string;
  orcid?: string | null;
  github?: string | null;
  isAnonymized?: boolean;
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
}

// ============================================================================
// 3. SEMILLA DE DATOS CANÓNICA
// ============================================================================
const INITIAL_AUTHORS: Author[] = [
  {
    id: 'aut-vasconcelos',
    name: 'Dra. Elena Vasconcelos',
    handle: 'elena-vasconcelos',
    affiliation: 'Instituto de Investigaciones Epistemológicas · CSIC',
    orcid: '0000-0002-1825-0097',
    github: 'vasconcelos-lab',
    isAnonymized: false,
  },
  {
    id: 'aut-popper',
    name: 'Karl R. Popper',
    handle: 'karl-popper-archive',
    affiliation: 'Cátedra de Lógica y Método Científico · LSE',
    orcid: null,
    github: null,
    isAnonymized: false,
  },
  {
    id: 'aut-duhem-quine',
    name: 'Pierre Duhem & W.V.O. Quine',
    handle: 'duhem-quine-collective',
    affiliation: 'Seminario de Filosofía Analítica y Holismo Teórico',
    orcid: '0000-0001-9234-8812',
    github: null,
    isAnonymized: false,
  },
  {
    id: 'aut-valdes',
    name: 'Ing. Mateo Valdés',
    handle: 'mvaldes-systems',
    affiliation: 'Laboratorio de Algoritmos Distribuidos y Tolerancia a Fallas',
    orcid: '0000-0002-7711-3409',
    github: 'mvaldes-sys',
    isAnonymized: false,
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-vasconcelos-grafos',
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
    targetArticleId: 'art-vasconcelos-grafos',
    relation: 'supports',
    quotedSnippet: 'todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido (DAG) de argumentación',
    reasoning: 'La estructura de DAG formaliza de manera impecable la asimetría lógica de la falsación: basta una arista de contradicción fundada para derribar una generalización.',
    timestamp: '2026-02-18T10:14:00Z',
  },
  {
    id: 'cit-duhem-to-vasconcelos',
    sourceArticleId: 'art-duhem-quine-holismo',
    targetArticleId: 'art-vasconcelos-grafos',
    relation: 'contradicts',
    quotedSnippet: 'Si un postulado fundamental es desmentido mediante una contraprueba empírica rigurosa, todas las tesis derivadas quedan advertidas de la inestabilidad de sus cimientos.',
    reasoning: 'Objeción holista: la refutación nunca es quirúrgica ni definitiva, ya que el investigador puede modificar legítimamente las hipótesis auxiliares periféricas.',
    timestamp: '2026-02-24T15:30:00Z',
  },
  {
    id: 'cit-valdes-to-vasconcelos',
    sourceArticleId: 'art-valdes-pbft-consenso',
    targetArticleId: 'art-vasconcelos-grafos',
    relation: 'extends',
    quotedSnippet: 'Al anclar la cita no solo a la obra completa sino al párrafo exacto y al hash criptográfico de la versión leída, impedimos la tergiversación retórica',
    reasoning: 'Extensión computacional: proveemos el algoritmo formal de inmutabilidad Merkle-DAG que hace técnicamente realizable la propuesta de Vasconcelos.',
    timestamp: '2026-03-01T18:00:00Z',
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

// Claves de almacenamiento versionadas para aislar datos corruptos de sesiones antiguas
const STORAGE_KEY_AUTHORS = 'chen_protocol_v2_authors';
const STORAGE_KEY_ARTICLES = 'chen_protocol_v2_articles';
const STORAGE_KEY_CITATIONS = 'chen_protocol_v2_citations';

function getInitialAuthors(): Author[] {
  if (typeof window === 'undefined') return INITIAL_AUTHORS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUTHORS);
    if (!saved) return INITIAL_AUTHORS;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name) {
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
    if (Array.isArray(parsed) && parsed.length >= 4 && parsed[0]?.contentMarkdown && parsed[0]?.title) {
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
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.targetArticleId) {
      return parsed;
    }
  } catch {}
  return INITIAL_CITATIONS;
}

// ============================================================================
// 4. APLICACIÓN EDITORIAL CHEN
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'reader' | 'editor' | 'manifesto'>('home');
  const [authors, setAuthors] = useState<Author[]>(getInitialAuthors);
  const [articles, setArticles] = useState<Article[]>(getInitialArticles);
  const [citations, setCitations] = useState<Citation[]>(getInitialCitations);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('art-vasconcelos-grafos');
  const [demoRelationFilter, setDemoRelationFilter] = useState<'all' | CitationRelation>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincronizar con almacenamiento local
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(authors));
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
      localStorage.setItem(STORAGE_KEY_CITATIONS, JSON.stringify(citations));
    } catch {}
  }, [authors, articles, citations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cita bloqueada para el editor
  const [lockedQuote, setLockedQuote] = useState<{
    targetArticleId: string;
    targetArticleTitle: string;
    targetAuthorName: string;
    snippet: string;
    relation: CitationRelation;
  } | null>(null);

  // Selector de texto flotante
  const [textSelectionPopover, setTextSelectionPopover] = useState<{
    snippet: string;
    x: number;
    y: number;
  } | null>(null);

  const articleBodyRef = useRef<HTMLDivElement>(null);

  // Formulario de publicación
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSubtitle, setEditorSubtitle] = useState('');
  const [editorArea, setEditorArea] = useState('Epistemología & Ciencias');
  const [editorEpistemicStatus, setEditorEpistemicStatus] = useState<EpistemicStatus>('hypothesis');
  const [editorContent, setEditorContent] = useState('');
  const [editorReasoning, setEditorReasoning] = useState('');
  const [editorAuthorId, setEditorAuthorId] = useState(authors[0]?.id || 'aut-vasconcelos');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Restablecer a semilla original
  const handleResetSeed = () => {
    setAuthors(INITIAL_AUTHORS);
    setArticles(INITIAL_ARTICLES);
    setCitations(INITIAL_CITATIONS);
    setSelectedArticleId('art-vasconcelos-grafos');
    setLockedQuote(null);
    showToast('Base de datos restaurada al estado canónico inicial.');
  };

  // Simulación RGPD
  const handleGdprErasure = (authorId: string) => {
    const target = authors.find((a) => a.id === authorId);
    if (!target) return;

    const pseudoHash = computeSimpleHash(target.id + target.name).substring(0, 16);
    const updatedAuthors = authors.map((a) => {
      if (a.id === authorId) {
        return {
          ...a,
          name: 'Autor Retirado [Anonimizado]',
          handle: `anon-${pseudoHash}`,
          affiliation: 'Investigador Retirado bajo Derecho al Olvido (RGPD Art. 17)',
          orcid: null,
          github: null,
          isAnonymized: true,
        };
      }
      return a;
    });

    setAuthors(updatedAuthors);
    showToast(`RGPD Art. 17 ejecutado: ${target.name} anonimizado como 'anon-${pseudoHash}'.`);
  };

  // Detección de selección de texto
  const handleTextSelection = () => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTextSelectionPopover(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 15) {
      setTextSelectionPopover(null);
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTextSelectionPopover({
        snippet: text,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 10,
      });
    } catch {
      setTextSelectionPopover(null);
    }
  };

  const handleTriggerCitationFromSelection = (relation: CitationRelation) => {
    if (!textSelectionPopover) return;
    const curArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];
    const curAuthor = authors.find((a) => a.id === curArticle?.authorId);

    setLockedQuote({
      targetArticleId: curArticle.id,
      targetArticleTitle: curArticle.title,
      targetAuthorName: curAuthor?.name || 'Autor',
      snippet: textSelectionPopover.snippet,
      relation: relation,
    });

    setTextSelectionPopover(null);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Fragmento anclado con función ${relation === 'supports' ? '[+ Apoya]' : relation === 'contradicts' ? '[- Contradice]' : '[→ Amplía]'}.`);
  };

  const handleOpenArticleInReader = (articleId: string) => {
    setSelectedArticleId(articleId);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim() || !editorContent.trim()) {
      showToast('Por favor completa el título y el cuerpo del artículo.');
      return;
    }

    if (lockedQuote && !editorReasoning.trim()) {
      showToast('Por favor incluye 1-2 frases justificando la relación lógica.');
      return;
    }

    const newId = `art-${Date.now()}`;
    const newHash = computeSimpleHash(editorTitle + editorContent);

    const newArticle: Article = {
      id: newId,
      versionHash: newHash,
      title: editorTitle.trim(),
      subtitle: editorSubtitle.trim() || 'Ensayo publicado en el protocolo Chen',
      authorId: editorAuthorId || authors[0]?.id || 'aut-vasconcelos',
      area: editorArea || 'Epistemología',
      epistemicStatus: editorEpistemicStatus,
      license: 'CC BY-SA 4.0',
      publishedDate: 'Hoy',
      readingTimeMinutes: Math.max(1, Math.round(editorContent.split(/\s+/).length / 180)),
      contentMarkdown: editorContent.trim(),
    };

    let newCitationObj: Citation | null = null;
    if (lockedQuote) {
      newCitationObj = {
        id: `cit-${Date.now()}`,
        sourceArticleId: newId,
        targetArticleId: lockedQuote.targetArticleId,
        relation: lockedQuote.relation,
        quotedSnippet: lockedQuote.snippet,
        reasoning: editorReasoning.trim(),
        timestamp: new Date().toISOString(),
      };
    }

    setArticles([newArticle, ...articles]);
    if (newCitationObj) {
      setCitations([newCitationObj, ...citations]);
    }

    setEditorTitle('');
    setEditorSubtitle('');
    setEditorContent('');
    setEditorReasoning('');
    setLockedQuote(null);

    if (newCitationObj) {
      setSelectedArticleId(newCitationObj.targetArticleId);
      showToast('¡Réplica publicada! Tu cita ha quedado anclada y verificada en el grafo.');
    } else {
      setSelectedArticleId(newId);
      showToast('¡Tesis seminal publicada en el protocolo Chen!');
    }

    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Artículo actual en el lector con fallback seguro
  const currentReaderArticle =
    articles.find((a) => a.id === selectedArticleId) ||
    articles[0] ||
    INITIAL_ARTICLES[0];
  const currentReaderAuthor = authors.find((a) => a.id === currentReaderArticle?.authorId);

  // Citas del artículo actual
  const inboundCitations = citations.filter((c) => c.targetArticleId === currentReaderArticle?.id);
  const outboundCitations = citations.filter((c) => c.sourceArticleId === currentReaderArticle?.id);

  // Citas demostradoras para Elena Vasconcelos
  const vasconcelosDemoCitations = citations.filter(
    (c) => c.targetArticleId === 'art-vasconcelos-grafos'
  );
  const filteredDemoCitations =
    demoRelationFilter === 'all'
      ? vasconcelosDemoCitations
      : vasconcelosDemoCitations.filter((c) => c.relation === demoRelationFilter);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141413] flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900 font-sans antialiased">
      {/* Top Navbar Editorial */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E4E2DD]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-black tracking-tight text-[#141413] group-hover:text-amber-900 transition-colors">
                  Chen
                </span>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-[#605F5B] border-l border-[#E4E2DD] pl-2">
                  Protocolo v1.0
                </span>
              </div>
            </button>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'home', label: 'Explorar & Demostrador' },
              { id: 'reader', label: 'Lector & Grafo' },
              { id: 'editor', label: lockedQuote ? '• Publicar Réplica' : 'Publicar / Citar' },
              { id: 'manifesto', label: 'Manifiesto & RGPD' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#141413] text-[#FBF9F5]'
                    : 'text-[#605F5B] hover:text-[#141413] hover:bg-[#E4E2DD]/40'
                } ${tab.id === 'editor' && lockedQuote ? 'text-amber-800 font-bold' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#605F5B] bg-[#E4E2DD]/50 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{citations.length} citas verificadas</span>
          </div>
        </div>
      </header>

      {/* Notificación Toast */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded bg-[#141413] text-[#FBF9F5] text-xs font-mono shadow-2xl flex items-center gap-3 border border-[#E4E2DD] max-w-md animate-in fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Menú de Subrayado Flotante en Lector */}
      {activeTab === 'reader' && textSelectionPopover && (
        <div
          style={{
            position: 'absolute',
            top: `${textSelectionPopover.y}px`,
            left: `${textSelectionPopover.x}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="z-50 bg-[#141413] text-white p-1.5 rounded shadow-2xl border border-stone-700 flex items-center gap-1 text-[11px] font-mono animate-in fade-in zoom-in-95"
        >
          <span className="px-2 text-stone-400 select-none">Citar como:</span>
          <button
            onClick={() => handleTriggerCitationFromSelection('supports')}
            className="px-2 py-1 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 rounded transition-colors cursor-pointer"
          >
            + Apoyar
          </button>
          <button
            onClick={() => handleTriggerCitationFromSelection('contradicts')}
            className="px-2 py-1 bg-rose-900/90 hover:bg-rose-800 text-rose-200 rounded transition-colors cursor-pointer"
          >
            - Contradecir
          </button>
          <button
            onClick={() => handleTriggerCitationFromSelection('extends')}
            className="px-2 py-1 bg-sky-900/90 hover:bg-sky-800 text-sky-200 rounded transition-colors cursor-pointer"
          >
            → Ampliar
          </button>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 sm:py-12 w-full">
        {/* ================================================================== */}
        {/* VISTA 1: EXPLORAR & DEMOSTRADOR                                    */}
        {/* ================================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16">
            <section className="space-y-6 pt-4 pb-2 border-b border-[#E4E2DD]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E4E2DD]/60 font-mono text-xs text-[#605F5B]">
                <span>Protocolo de Publicación y Argumentación Abierta</span>
                <span>·</span>
                <span className="text-emerald-800 font-semibold">Fase 1 (MVP)</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#141413] tracking-tight leading-[1.15]">
                Donde cada afirmación se sostiene sobre una red de pruebas verificables.
              </h1>

              <p className="font-serif text-lg sm:text-xl text-[#605F5B] leading-relaxed max-w-3xl">
                Un entorno de publicación técnica y ensayística sin algoritmos de indignación, sin métricas
                de vanidad y sin hipervínculos mudos. Cada cita declara su función lógica deductiva:{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-300">
                  [ + Apoya ]
                </span>
                ,{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-300">
                  [ - Contradice ]
                </span>{' '}
                o{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-300">
                  [ → Amplía ]
                </span>
                .
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenArticleInReader('art-vasconcelos-grafos')}
                  className="px-5 py-2.5 rounded bg-[#141413] text-[#FBF9F5] font-mono text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
                >
                  Explorar Artículos Seminales →
                </button>
                <button
                  onClick={() => {
                    setLockedQuote(null);
                    setActiveTab('editor');
                  }}
                  className="px-5 py-2.5 rounded bg-white text-[#141413] border border-[#E4E2DD] font-mono text-xs font-semibold hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                >
                  Escribir una Tesis Raíz
                </button>
              </div>
            </section>

            {/* Demostrador Interactivo */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#141413]">
                    Anatomía de una Cita con Función en 5 Segundos
                  </h2>
                  <p className="text-xs font-mono text-[#605F5B] mt-1">
                    Comprueba cómo una sola afirmación es refutada, respaldada y extendida por la comunidad.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#E4E2DD] p-1 rounded font-mono text-xs">
                  <button
                    onClick={() => setDemoRelationFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      demoRelationFilter === 'all'
                        ? 'bg-[#141413] text-white'
                        : 'text-[#605F5B] hover:text-[#141413]'
                    }`}
                  >
                    Todas ({vasconcelosDemoCitations.length})
                  </button>
                  <button
                    onClick={() => setDemoRelationFilter('supports')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      demoRelationFilter === 'supports'
                        ? 'bg-emerald-100 text-emerald-900 font-semibold'
                        : 'text-[#605F5B] hover:text-emerald-900'
                    }`}
                  >
                    + Apoya (1)
                  </button>
                  <button
                    onClick={() => setDemoRelationFilter('contradicts')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      demoRelationFilter === 'contradicts'
                        ? 'bg-rose-100 text-rose-900 font-semibold'
                        : 'text-[#605F5B] hover:text-rose-900'
                    }`}
                  >
                    - Contradice (1)
                  </button>
                  <button
                    onClick={() => setDemoRelationFilter('extends')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      demoRelationFilter === 'extends'
                        ? 'bg-sky-100 text-sky-900 font-semibold'
                        : 'text-[#605F5B] hover:text-sky-900'
                    }`}
                  >
                    → Amplía (1)
                  </button>
                </div>
              </div>

              {/* Tesis Seminal */}
              <div className="bg-white border border-[#E4E2DD] rounded-lg p-6 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E2DD] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      [Hipótesis Seminal]
                    </span>
                    <span className="text-xs font-mono text-[#605F5B]">Dra. Elena Vasconcelos (CSIC)</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8F8E8A]">Hash: e3b0c442...b855</span>
                </div>

                <blockquote className="font-serif text-lg italic text-[#141413] leading-relaxed pl-4 border-l-3 border-[#141413]">
                  "Todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido
                  (DAG) de argumentación. Cada enlace entre proposiciones debe portar obligatoriamente una tipificación
                  lógica verificable: [+ Apoya], [- Contradice] o [→ Amplía]."
                </blockquote>

                <div className="flex items-center justify-between text-xs font-mono pt-2">
                  <span className="text-[#605F5B]">3 artículos citan este fragmento en el protocolo</span>
                  <button
                    onClick={() => handleOpenArticleInReader('art-vasconcelos-grafos')}
                    className="text-[#141413] underline hover:text-amber-900 font-semibold cursor-pointer"
                  >
                    Leer tesis completa en el Lector →
                  </button>
                </div>
              </div>

              {/* Tarjetas de Citas Conectadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredDemoCitations.map((cit) => {
                  const sourceArt = articles.find((a) => a.id === cit.sourceArticleId);
                  const sourceAuth = authors.find((a) => a.id === sourceArt?.authorId);

                  const badgeClass =
                    cit.relation === 'supports'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : cit.relation === 'contradicts'
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : 'bg-sky-50 text-sky-900 border-sky-300';

                  const badgeText =
                    cit.relation === 'supports'
                      ? '[ + Apoya ]'
                      : cit.relation === 'contradicts'
                      ? '[ - Contradice ]'
                      : '[ → Amplía ]';

                  return (
                    <article
                      key={cit.id}
                      className="bg-white border border-[#E4E2DD] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#141413] transition-colors shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${badgeClass} font-semibold`}>
                            {badgeText}
                          </span>
                          <span className="font-mono text-[11px] text-[#8F8E8A]">{sourceArt?.area || 'Ensayo'}</span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-[#141413] leading-snug">
                          {sourceArt?.title || 'Artículo réplica'}
                        </h3>

                        <p className="text-xs text-[#605F5B] font-mono">
                          Por: <span className="text-[#141413]">{sourceAuth?.name || 'Autor'}</span>
                        </p>

                        <p className="text-xs text-[#605F5B] leading-relaxed italic border-t border-[#E4E2DD] pt-3">
                          "{cit.reasoning}"
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-[#E4E2DD] text-xs font-mono">
                        <button
                          onClick={() => handleOpenArticleInReader(cit.sourceArticleId)}
                          className="text-[#141413] font-semibold hover:underline cursor-pointer"
                        >
                          Ver réplica →
                        </button>
                        <button
                          onClick={() => {
                            setLockedQuote({
                              targetArticleId: cit.sourceArticleId,
                              targetArticleTitle: sourceArt?.title || '',
                              targetAuthorName: sourceAuth?.name || '',
                              snippet: cit.reasoning,
                              relation: 'contradicts',
                            });
                            setActiveTab('editor');
                          }}
                          className="text-stone-500 hover:text-rose-800 cursor-pointer"
                        >
                          Refutar
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Catálogo de Artículos */}
            <section className="space-y-6 pt-6 border-t border-[#E4E2DD]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#141413]">
                  Índice de Tesis y Ensayos Publicados
                </h2>
                <p className="text-xs font-mono text-[#605F5B] mt-1">
                  Publicaciones inmutables registradas en el protocolo Chen v1.0.
                </p>
              </div>

              <div className="space-y-3">
                {articles.map((art) => {
                  const author = authors.find((a) => a.id === art.authorId);
                  const inCits = citations.filter((c) => c.targetArticleId === art.id);

                  return (
                    <div
                      key={art.id}
                      onClick={() => handleOpenArticleInReader(art.id)}
                      className="bg-white border border-[#E4E2DD] rounded-lg p-5 hover:border-[#141413] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className="font-semibold text-[#141413]">{author?.name || 'Autor'}</span>
                          <span className="text-[#8F8E8A]">·</span>
                          <span className="text-[#605F5B]">{art.area}</span>
                          <span className="text-[#8F8E8A]">·</span>
                          <span className="text-[#8F8E8A]">{art.readingTimeMinutes} min de lectura</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#141413] group-hover:text-amber-900 transition-colors">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#605F5B] line-clamp-1">{art.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                        <span className="px-2.5 py-1 rounded bg-[#E4E2DD]/50 text-[#605F5B]">
                          {inCits.length} {inCits.length === 1 ? 'cita entrante' : 'citas entrantes'}
                        </span>
                        <span className="text-[#141413] group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ================================================================== */}
        {/* VISTA 2: LECTOR INTERACTIVO Y RED DE CITAS                         */}
        {/* ================================================================== */}
        {activeTab === 'reader' && (
          <div className="space-y-12">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4E2DD] text-xs font-mono">
              <button
                onClick={() => setActiveTab('home')}
                className="text-[#605F5B] hover:text-[#141413] cursor-pointer flex items-center gap-1"
              >
                ← Volver al Índice
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[#8F8E8A]">SHA-256:</span>
                <span className="px-2 py-0.5 rounded bg-[#E4E2DD]/50 text-[#141413] text-[11px] select-all">
                  {(currentReaderArticle?.versionHash || '').substring(0, 16)}...
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-semibold">
                  Inmutable ({currentReaderArticle?.license || 'CC BY-SA 4.0'})
                </span>
              </div>
            </div>

            <article className="space-y-6">
              <header className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#605F5B]">
                  <span>{currentReaderArticle?.area}</span>
                  <span>·</span>
                  <span>{currentReaderArticle?.publishedDate}</span>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase font-semibold text-[10px]">
                    {currentReaderArticle?.epistemicStatus === 'hypothesis'
                      ? 'Hipótesis'
                      : currentReaderArticle?.epistemicStatus === 'fact'
                      ? 'Hecho empírico'
                      : 'Análisis teórico'}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#141413] leading-tight">
                  {currentReaderArticle?.title}
                </h1>

                <p className="font-serif text-lg sm:text-xl text-[#605F5B] leading-relaxed">
                  {currentReaderArticle?.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-white border border-[#E4E2DD]">
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs font-bold text-[#141413] flex items-center gap-1.5">
                      <span>{currentReaderAuthor?.name || 'Autor Desconocido'}</span>
                      {currentReaderAuthor?.isAnonymized && (
                        <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded">
                          Anonimizado (RGPD)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#605F5B] font-mono">{currentReaderAuthor?.affiliation}</p>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] text-[#605F5B]">
                    {currentReaderAuthor?.orcid && <span>ORCID: {currentReaderAuthor.orcid}</span>}
                    {currentReaderAuthor?.github && <span>GitHub: @{currentReaderAuthor.github}</span>}
                  </div>
                </div>
              </header>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs font-mono text-amber-900 flex items-center justify-between">
                <span>
                  💡 <strong>Instrucción interactiva:</strong> Selecciona cualquier frase o párrafo de este texto con tu
                  ratón para desplegar el menú de réplica inmediata con cita anclada.
                </span>
                <span className="hidden sm:inline text-amber-700">window.getSelection() activo</span>
              </div>

              <div
                ref={articleBodyRef}
                onMouseUp={handleTextSelection}
                className="font-serif text-lg text-[#141413] leading-relaxed space-y-6 pt-4 pb-8 border-b border-[#E4E2DD]"
              >
                {(currentReaderArticle?.contentMarkdown || '').split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            {/* Citas Salientes */}
            {outboundCitations.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#141413]">
                  Premisas Citadas en este Texto ({outboundCitations.length})
                </h3>
                <div className="space-y-3">
                  {outboundCitations.map((cit) => {
                    const targetArt = articles.find((a) => a.id === cit.targetArticleId);
                    const targetAuth = authors.find((a) => a.id === targetArt?.authorId);

                    return (
                      <div
                        key={cit.id}
                        className="bg-white border border-[#E4E2DD] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold border ${
                                cit.relation === 'supports'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : cit.relation === 'contradicts'
                                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                                  : 'bg-sky-50 text-sky-900 border-sky-300'
                              }`}
                            >
                              {cit.relation === 'supports'
                                ? '[ + Apoya ]'
                                : cit.relation === 'contradicts'
                                ? '[ - Contradice ]'
                                : '[ → Amplía ]'}
                            </span>
                            <span className="text-[#605F5B]">Hacia: {targetAuth?.name || 'Autor'}</span>
                          </div>
                          <p className="font-serif text-sm font-semibold text-[#141413]">{targetArt?.title}</p>
                          <p className="italic text-[#605F5B]">"{cit.quotedSnippet}"</p>
                        </div>
                        <button
                          onClick={() => handleOpenArticleInReader(cit.targetArticleId)}
                          className="font-mono text-xs font-semibold text-[#141413] underline hover:text-amber-900 shrink-0 cursor-pointer"
                        >
                          Ver artículo citado →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Red Argumentativa: Citado Por */}
            <section className="space-y-4 pt-4 border-t border-[#E4E2DD]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-bold text-[#141413]">
                  Red de Citas Argumentativas · Citado por ({inboundCitations.length})
                </h3>
                <span className="font-mono text-xs text-[#605F5B]">
                  Artículos del protocolo que debaten formalmente este texto
                </span>
              </div>

              {inboundCitations.length === 0 ? (
                <div className="p-8 text-center bg-white border border-dashed border-[#E4E2DD] rounded-lg space-y-3">
                  <p className="font-serif text-base text-[#605F5B]">
                    Aún ningún autor ha publicado una cita que apunte a esta versión.
                  </p>
                  <button
                    onClick={() => {
                      setLockedQuote({
                        targetArticleId: currentReaderArticle.id,
                        targetArticleTitle: currentReaderArticle.title,
                        targetAuthorName: currentReaderAuthor?.name || 'Autor',
                        snippet: (currentReaderArticle.contentMarkdown || '').substring(0, 150) + '...',
                        relation: 'extends',
                      });
                      setActiveTab('editor');
                    }}
                    className="px-4 py-2 bg-[#141413] text-[#FBF9F5] font-mono text-xs rounded hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Publicar la Primera Réplica o Ampliación →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inboundCitations.map((cit) => {
                    const sourceArt = articles.find((a) => a.id === cit.sourceArticleId);
                    const sourceAuth = authors.find((a) => a.id === sourceArt?.authorId);

                    const badgeClass =
                      cit.relation === 'supports'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : cit.relation === 'contradicts'
                        ? 'bg-rose-50 text-rose-900 border-rose-300'
                        : 'bg-sky-50 text-sky-900 border-sky-300';

                    const badgeText =
                      cit.relation === 'supports'
                        ? '[ + Apoya ]'
                        : cit.relation === 'contradicts'
                        ? '[ - Contradice ]'
                        : '[ → Amplía ]';

                    return (
                      <div
                        key={cit.id}
                        className="bg-white border border-[#E4E2DD] rounded-lg p-5 flex flex-col justify-between space-y-3 shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`font-mono text-xs px-2 py-0.5 rounded border ${badgeClass} font-semibold`}>
                              {badgeText}
                            </span>
                            <span className="font-mono text-[11px] text-[#8F8E8A]">{sourceAuth?.name || 'Autor'}</span>
                          </div>

                          <h4 className="font-serif font-bold text-base text-[#141413]">{sourceArt?.title || 'Artículo'}</h4>

                          <div className="p-2.5 bg-[#FBF9F5] border-l-2 border-[#141413] text-xs font-serif italic text-[#141413]">
                            "{cit.quotedSnippet}"
                          </div>

                          <p className="text-xs font-mono text-[#605F5B]">
                            <strong>Justificación:</strong> {cit.reasoning}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E4E2DD] flex items-center justify-between font-mono text-xs">
                          <button
                            onClick={() => handleOpenArticleInReader(cit.sourceArticleId)}
                            className="text-[#141413] font-semibold underline hover:text-amber-900 cursor-pointer"
                          >
                            Leer réplica completa →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ================================================================== */}
        {/* VISTA 3: EDITOR DE PUBLICACIÓN CON CITA ANCLADA                     */}
        {/* ================================================================== */}
        {activeTab === 'editor' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-2 border-b border-[#E4E2DD] pb-4">
              <h1 className="font-serif text-3xl font-bold text-[#141413]">
                {lockedQuote ? 'Publicar Réplica con Cita Bloqueada' : 'Publicar una Tesis Raíz'}
              </h1>
              <p className="text-xs font-mono text-[#605F5B]">
                {lockedQuote
                  ? 'Tu texto quedará indexado e inmutablemente vinculado a la evidencia seleccionada.'
                  : 'Publica una proposición seminal que servirá como punto de partida para el debate.'}
              </p>
            </div>

            {lockedQuote && (
              <div className="p-5 rounded-lg bg-white border-2 border-[#141413] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Evidencia Anclada Inmutable
                  </span>
                  <button
                    onClick={() => setLockedQuote(null)}
                    className="font-mono text-xs text-rose-800 underline hover:text-rose-950 cursor-pointer"
                  >
                    Desvincular Cita
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono text-[#605F5B]">
                    Artículo citado: <strong>{lockedQuote.targetArticleTitle}</strong> ({lockedQuote.targetAuthorName})
                  </p>
                  <blockquote className="p-3 bg-[#FBF9F5] border-l-3 border-[#141413] font-serif text-sm italic text-[#141413]">
                    "{lockedQuote.snippet}"
                  </blockquote>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs font-semibold text-[#141413]">
                    Función lógica de tu intervención frente a este fragmento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        rel: 'supports' as CitationRelation,
                        label: '[ + Apoya ]',
                        desc: 'Aporta prueba o deducción afín',
                        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
                      },
                      {
                        rel: 'contradicts' as CitationRelation,
                        label: '[ - Contradice ]',
                        desc: 'Señala contraejemplo o falacia',
                        bg: 'bg-rose-50 text-rose-900 border-rose-300',
                      },
                      {
                        rel: 'extends' as CitationRelation,
                        label: '[ → Amplía ]',
                        desc: 'Añade formalismo o aplicación',
                        bg: 'bg-sky-50 text-sky-900 border-sky-300',
                      },
                    ].map((btn) => (
                      <button
                        key={btn.rel}
                        type="button"
                        onClick={() => setLockedQuote({ ...lockedQuote, relation: btn.rel })}
                        className={`p-3 rounded border text-left cursor-pointer transition-all ${
                          lockedQuote.relation === btn.rel
                            ? `${btn.bg} ring-2 ring-[#141413]`
                            : 'bg-white border-[#E4E2DD] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold">{btn.label}</div>
                        <div className="text-[11px] text-[#605F5B] mt-1">{btn.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#141413]">
                    Justificación de la relación lógica (1-2 frases obligatorias):
                  </label>
                  <input
                    type="text"
                    required
                    value={editorReasoning}
                    onChange={(e) => setEditorReasoning(e.target.value)}
                    placeholder="Ejemplo: La deducción es inválida porque asume simetría en sistemas bizantinos..."
                    className="w-full px-3 py-2 text-xs font-mono bg-[#FBF9F5] border border-[#E4E2DD] rounded focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>
            )}

            <form onSubmit={handlePublishArticle} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#141413]">
                    Publicar con identidad de autor:
                  </label>
                  <select
                    value={editorAuthorId}
                    onChange={(e) => setEditorAuthorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E4E2DD] rounded focus:outline-none focus:border-[#141413]"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.affiliation.split('·')[0].trim()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#141413]">Área temática:</label>
                  <input
                    type="text"
                    required
                    value={editorArea}
                    onChange={(e) => setEditorArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E4E2DD] rounded focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#141413]">Título de la tesis:</label>
                <input
                  type="text"
                  required
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Ejemplo: Invalidez del consenso Nakamoto en redes asíncronas puras"
                  className="w-full px-4 py-2.5 text-base font-serif font-bold bg-white border border-[#E4E2DD] rounded focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#141413]">
                  Subtítulo / Resumen epistemológico:
                </label>
                <input
                  type="text"
                  value={editorSubtitle}
                  onChange={(e) => setEditorSubtitle(e.target.value)}
                  placeholder="Una frase sintética con la premisa central"
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-[#E4E2DD] rounded focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-semibold text-[#141413]">Estado epistémico:</label>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="epistemic"
                      checked={editorEpistemicStatus === 'hypothesis'}
                      onChange={() => setEditorEpistemicStatus('hypothesis')}
                    />
                    <span>Hipótesis [Falsable]</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="epistemic"
                      checked={editorEpistemicStatus === 'fact'}
                      onChange={() => setEditorEpistemicStatus('fact')}
                    />
                    <span>Hecho empírico [Contrastado]</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="epistemic"
                      checked={editorEpistemicStatus === 'analysis'}
                      onChange={() => setEditorEpistemicStatus('analysis')}
                    />
                    <span>Análisis teórico</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs font-semibold text-[#141413]">
                    Cuerpo del artículo (Markdown):
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="font-mono text-xs text-[#141413] underline hover:text-amber-900 cursor-pointer"
                  >
                    {isPreviewMode ? 'Volver a Escribir' : 'Vista Previa Editorial'}
                  </button>
                </div>

                {isPreviewMode ? (
                  <div className="min-h-[220px] p-6 bg-white border border-[#E4E2DD] rounded-lg font-serif text-base leading-relaxed space-y-4">
                    {editorContent ? (
                      editorContent.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
                    ) : (
                      <p className="text-[#8F8E8A] italic">No has redactado texto aún.</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={10}
                    required
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Redacta los argumentos, deducciones y evidencias. Divide en párrafos claros para permitir que otros investigadores citen tus secciones específicas..."
                    className="w-full p-4 font-serif text-base leading-relaxed bg-white border border-[#E4E2DD] rounded-lg focus:outline-none focus:border-[#141413]"
                  />
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-[#605F5B]">
                  <span>Firma SHA-256 estimada: {computeSimpleHash(editorTitle + editorContent).substring(0, 20)}...</span>
                  <span>Licencia irrevocable: CC BY-SA 4.0</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E4E2DD]">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2 font-mono text-xs text-[#605F5B] hover:text-[#141413] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-[#141413] text-[#FBF9F5] font-mono text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
                >
                  {lockedQuote ? 'Publicar Réplica y Anclar al Grafo →' : 'Publicar Tesis en el Protocolo →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================== */}
        {/* VISTA 4: MANIFIESTO, MATRIZ COMPARATIVA Y SIMULADOR RGPD            */}
        {/* ================================================================== */}
        {activeTab === 'manifesto' && (
          <div className="space-y-12">
            <div className="space-y-3 border-b border-[#E4E2DD] pb-6">
              <span className="font-mono text-xs text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300">
                Posicionamiento Estratégico & Legal v1.0
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#141413]">
                Manifiesto de Conocimiento Verificable y Privacidad por Diseño
              </h1>
              <p className="font-serif text-lg text-[#605F5B] leading-relaxed max-w-3xl">
                ¿Por qué un investigador, filósofo o ingeniero debería publicar en Chen en lugar de abrir su propio
                blog en Substack o crear un repositorio en GitHub?
              </p>
            </div>

            {/* Matriz Comparativa */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#141413]">
                Matriz Comparativa de Modelos de Publicación
              </h2>
              <div className="overflow-x-auto border border-[#E4E2DD] rounded-lg bg-white shadow-xs">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#E4E2DD]/40 border-b border-[#E4E2DD] text-[#141413]">
                      <th className="p-3.5 font-bold">Eje Estructural</th>
                      <th className="p-3.5 font-medium text-[#605F5B]">Blog Personal / Substack</th>
                      <th className="p-3.5 font-medium text-[#605F5B]">Repositorio GitHub</th>
                      <th className="p-3.5 font-bold text-amber-900 bg-amber-50/50">Chen Protocol v1.0</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E2DD]">
                    <tr>
                      <td className="p-3.5 font-bold text-[#141413]">Conexión entre Ideas</td>
                      <td className="p-3.5 text-[#605F5B]">Hipervínculo plano (sin función lógica)</td>
                      <td className="p-3.5 text-[#605F5B]">Issues / PRs (orientado a código)</td>
                      <td className="p-3.5 bg-amber-50/30 text-amber-950 font-semibold">
                        Citas con función [+ Apoya], [- Contradice], [→ Amplía]
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#141413]">Inmutabilidad y Enlaces</td>
                      <td className="p-3.5 text-[#605F5B]">Sujeto a 'Link rot' y borrado discrecional</td>
                      <td className="p-3.5 text-[#605F5B]">Git commit hash por repositorio aislado</td>
                      <td className="p-3.5 bg-amber-50/30 text-amber-950 font-semibold">
                        Hash SHA-256 por versión en Merkle-DAG compartido
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#141413]">Métricas de Descubrimiento</td>
                      <td className="p-3.5 text-[#605F5B]">Algoritmo de clics, seguidores y suscriptores</td>
                      <td className="p-3.5 text-[#605F5B]">Estrellas y forks (popularidad)</td>
                      <td className="p-3.5 bg-amber-50/30 text-amber-950 font-semibold">
                        Grafo de supervivencia deductiva y refutaciones formales
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#141413]">Privacidad & Rastreo</td>
                      <td className="p-3.5 text-[#605F5B]">Cookies, analíticas y rastreadores de correo</td>
                      <td className="p-3.5 text-[#605F5B]">Telemetría propietaria de plataforma</td>
                      <td className="p-3.5 bg-amber-50/30 text-amber-950 font-semibold">
                        0 KB externos, cero cookies, fuentes de sistema nativas
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#141413]">Licencia de Contenido</td>
                      <td className="p-3.5 text-[#605F5B]">Propietaria por defecto</td>
                      <td className="p-3.5 text-[#605F5B]">Licencias de software (MIT/GPL)</td>
                      <td className="p-3.5 bg-amber-50/30 text-amber-950 font-semibold">
                        Creative Commons (CC BY-SA 4.0) irrevocable
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Simulador RGPD Art. 17 */}
            <section className="space-y-4 pt-6 border-t border-[#E4E2DD]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 font-mono text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-300">
                  <span>Arquitectura Legal Europea</span>
                  <span>·</span>
                  <span>RGPD Art. 17 vs Grafo Inmutable</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#141413]">
                  Laboratorio de Anonimización Criptográfica
                </h2>
                <p className="font-serif text-sm text-[#605F5B] leading-relaxed max-w-2xl">
                  Bajo la legislación europea, un usuario tiene derecho inalienable a que se eliminen sus datos
                  personales. Sin embargo, en un protocolo de citas, borrar textos rompería las deducciones de
                  terceros. La solución de Chen: anonimizar irreversiblemente al autor mientras la obra con licencia CC
                  BY-SA 4.0 y los hashes permanecen intactos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {authors.map((auth) => (
                  <div
                    key={auth.id}
                    className={`p-4 rounded-lg border text-xs font-mono flex flex-col justify-between space-y-3 ${
                      auth.isAnonymized
                        ? 'bg-stone-100 border-stone-300 text-stone-500'
                        : 'bg-white border-[#E4E2DD] text-[#141413]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{auth.name}</span>
                        {auth.isAnonymized && (
                          <span className="text-[10px] bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded font-semibold">
                            ANONIMIZADO
                          </span>
                        )}
                      </div>
                      <p className="text-[#605F5B] text-[11px] truncate">@{auth.handle}</p>
                      <p className="text-[#8F8E8A] text-[11px] truncate">{auth.affiliation}</p>
                    </div>

                    <div className="pt-2 border-t border-[#E4E2DD]">
                      {auth.isAnonymized ? (
                        <span className="text-[11px] text-stone-500 italic">
                          Datos personales purgados.
                        </span>
                      ) : (
                        <button
                          onClick={() => handleGdprErasure(auth.id)}
                          className="w-full py-1.5 px-2 bg-rose-50 text-rose-900 border border-rose-300 hover:bg-rose-100 rounded text-center transition-colors cursor-pointer font-semibold text-[11px]"
                        >
                          Simular Borrado RGPD
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border border-[#E4E2DD] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#605F5B]">
                  ¿Quieres volver al estado original canónico con todos los autores identificados?
                </span>
                <button
                  onClick={handleResetSeed}
                  className="px-3 py-1.5 bg-[#141413] text-[#FBF9F5] rounded hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                >
                  Restaurar Semilla Original
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer Editorial */}
      <footer className="border-t border-[#E4E2DD] bg-[#FBF9F5] py-8 text-xs font-mono text-[#605F5B] mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-[#141413] text-sm">Chen</span>
            <span>— Protocolo de Publicación y Argumentación Abierta v1.0</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span>CC BY-SA 4.0</span>
            <span>·</span>
            <span>0 KB Externos</span>
            <span>·</span>
            <span>Sin Rastreo</span>
            <span>·</span>
            <button
              onClick={handleResetSeed}
              className="text-[#141413] underline hover:text-amber-900 cursor-pointer"
            >
              Restaurar Demostración
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
