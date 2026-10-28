import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronRight,
  RotateCw,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  HelpCircle,
  Award,
  Layers,
  GitFork,
  MessageSquare,
  ExternalLink,
  Search,
  Check,
  Compass,
  FileText,
  Clock,
  Sparkles,
  Share2,
  ArrowRight,
  User,
  ListChecks,
} from 'lucide-react';
import {
  Flashcard,
  CommunityStudyPath,
  StudyPathStep,
  StudyPathStepResource,
  StudyPathComment,
  UserProfile,
} from '../types';

interface StudyPathViewProps {
  flashcards: Flashcard[];
  onReviewCard: (cardId: string, rating: 'hard' | 'good' | 'easy') => void;
  onAddCard: (card: Omit<Flashcard, 'id' | 'intervalDays' | 'repetitionCount' | 'nextReviewDate'>) => void;
  onDeleteCard: (cardId: string) => void;
  studyPaths: CommunityStudyPath[];
  onAddStudyPath: (newPath: CommunityStudyPath) => void;
  onUpdateStudyPath: (updatedPath: CommunityStudyPath) => void;
  onSelectArticle?: (articleId: string) => void;
  onNavigateBooks?: () => void;
  currentUser?: UserProfile | null;
}

const STEPS = [
  { num: '1', name: 'Elegir', action: 'Fijas objetivo y nivel de partida', tool: 'Plan de estudio personal' },
  { num: '2', name: 'Aprender', action: 'Sigues rutas con fuentes abiertas', tool: 'Paquetes de lecturas y vídeos' },
  { num: '3', name: 'Practicar', action: 'Autoevaluación con tarjetas privadas', tool: 'Repetición espaciada sin rankings' },
  { num: '4', name: 'Demostrar', action: 'Explicas el tema y recibes revisión', tool: 'Retos de demostración pública' },
  { num: '5', name: 'Compartir', action: 'Publicas apuntes y notas abiertas', tool: 'Licencias Creative Commons' },
];

export const StudyPathView: React.FC<StudyPathViewProps> = ({
  flashcards,
  onReviewCard,
  onAddCard,
  onDeleteCard,
  studyPaths,
  onAddStudyPath,
  onUpdateStudyPath,
  onSelectArticle,
  onNavigateBooks,
  currentUser,
}) => {
  // Primary Tab
  const [activeTab, setActiveTab] = useState<'community_paths' | 'personal_deck' | 'my_active_paths'>('community_paths');

  // Search & Filter in Community Paths
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('todos');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(studyPaths[0]?.id || null);

  // Modal: Create Study Path
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDesc, setNewPathDesc] = useState('');
  const [newPathArea, setNewPathArea] = useState('Computación y Sistemas');
  const [newPathWeeks, setNewPathWeeks] = useState(6);
  const [newPathLevel, setNewPathLevel] = useState<'intro' | 'intermediate' | 'advanced'>('intro');

  // Comment input on active path
  const [commentText, setCommentText] = useState('');
  const [commentResource, setCommentResource] = useState('');

  // Personal Deck (Stage 3 Flashcards)
  const [activeStep, setActiveStep] = useState(2);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [copiedPathId, setCopiedPathId] = useState<string | null>(null);

  // New card inputs
  const [topic, setTopic] = useState('');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Filtered community paths
  const filteredPaths = useMemo(() => {
    return studyPaths.filter((path) => {
      const matchArea = selectedArea === 'todos' || path.area.toLowerCase().includes(selectedArea.toLowerCase());
      const matchQuery =
        searchQuery === '' ||
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchQuery;
    });
  }, [studyPaths, selectedArea, searchQuery]);

  // Selected Path
  const selectedPath = useMemo(() => {
    return studyPaths.find((p) => p.id === selectedPathId) || filteredPaths[0] || studyPaths[0];
  }, [studyPaths, selectedPathId, filteredPaths]);

  // User forked paths
  const myForkedPaths = useMemo(() => {
    return studyPaths.filter((p) => p.isCustomFork);
  }, [studyPaths]);

  // Flashcards helpers
  const currentCard = flashcards[currentCardIndex % (flashcards.length || 1)];

  const handleRating = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    onReviewCard(currentCard.id, rating);
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !question.trim() || !answer.trim()) return;

    onAddCard({
      topic: topic.trim(),
      area,
      question: question.trim(),
      answer: answer.trim(),
    });

    setTopic('');
    setQuestion('');
    setAnswer('');
    setIsAddCardOpen(false);
  };

  const handleExportObsidian = () => {
    const md = [
      '# Cuaderno de Estudio Autónomo — Chen',
      `> Sincronización en Markdown puro · Exportado el ${new Date().toLocaleDateString()}\n`,
      ...flashcards.map(
        (c, i) =>
          `\n## ${i + 1}. [${c.area}] ${c.topic}\n**Pregunta:** ${c.question}\n\n**Respuesta razonada:**\n${c.answer}\n\n*Intervalo actual:* ${c.intervalDays} días\n`
      ),
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chen-cuaderno-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fork / Clone study path
  const handleForkPath = (path: CommunityStudyPath) => {
    const clonedPath: CommunityStudyPath = {
      ...path,
      id: `path-fork-${Date.now()}`,
      title: `${path.title} (Mi versión adaptada)`,
      authorName: currentUser ? currentUser.name : 'Estudiante de Chen',
      authorRole: currentUser ? currentUser.role : 'Comunidad Chen',
      clonesCount: 0,
      forkedFromId: path.id,
      forkedFromTitle: path.title,
      isOfficial: false,
      isCustomFork: true,
      lastUpdated: 'Recién clonada',
      steps: path.steps.map((st) => ({
        ...st,
        completed: false,
      })),
      comments: [
        {
          id: `fcomm-${Date.now()}`,
          authorName: 'Chen',
          authorRole: 'Sistema de Estudio',
          date: 'Ahora',
          content: 'Esta es tu copia personal. Puedes marcar hitos completados, añadir nuevos recursos y editar los pasos libremente.',
        },
      ],
    };

    onAddStudyPath(clonedPath);

    // Update parent clonesCount
    onUpdateStudyPath({
      ...path,
      clonesCount: path.clonesCount + 1,
    });

    setCopiedPathId(path.id);
    setSelectedPathId(clonedPath.id);
    setTimeout(() => {
      setCopiedPathId(null);
      setActiveTab('my_active_paths');
    }, 1200);
  };

  // Toggle step completion in a personal or forked path
  const handleToggleStepCompleted = (pathId: string, stepId: string) => {
    const target = studyPaths.find((p) => p.id === pathId);
    if (!target) return;

    const updatedSteps = target.steps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );

    onUpdateStudyPath({
      ...target,
      steps: updatedSteps,
    });
  };

  // Add comment / recommendation to active path
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPath || !commentText.trim()) return;

    const newComment: StudyPathComment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser ? currentUser.name : 'Estudiante de Chen',
      authorRole: currentUser ? currentUser.role : 'Comunidad de Estudio',
      isGithubVerified: currentUser?.githubVerified,
      date: 'Ahora',
      content: commentText.trim(),
      suggestedResource: commentResource.trim() || undefined,
    };

    onUpdateStudyPath({
      ...selectedPath,
      comments: [...selectedPath.comments, newComment],
    });

    setCommentText('');
    setCommentResource('');
  };

  // Create new custom study path
  const handleCreatePathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathTitle.trim() || !newPathDesc.trim()) return;

    const newPath: CommunityStudyPath = {
      id: `path-custom-${Date.now()}`,
      title: newPathTitle.trim(),
      slug: newPathTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newPathDesc.trim(),
      authorName: currentUser ? currentUser.name : 'Estudiante de Chen',
      authorRole: currentUser ? currentUser.role : 'Comunidad Chen',
      isOfficial: false,
      isCustomFork: true,
      areaId: 'area-custom',
      area: newPathArea,
      level: newPathLevel,
      estimatedWeeks: Number(newPathWeeks) || 4,
      clonesCount: 0,
      lastUpdated: 'Recién publicada',
      steps: [
        {
          id: `step-${Date.now()}-1`,
          order: 1,
          title: 'Fase Inicial: Fundamentos y lectura preparatoria',
          description: 'Revisión de conceptos previos y lectura de los artículos introductorios.',
          estimatedHours: 8,
          completed: false,
          resources: [
            {
              id: `res-${Date.now()}-1`,
              title: 'Explorar artículos y manuales en Chen',
              type: 'internal_article',
              urlOrSlug: 'la-asimetria-deductiva-del-falsacionismo-popperiano',
              description: 'Lectura base para calibrar el método riguroso.',
              isFree: true,
            },
          ],
        },
      ],
      comments: [],
    };

    onAddStudyPath(newPath);
    setSelectedPathId(newPath.id);
    setIsCreatePathOpen(false);
    setNewPathTitle('');
    setNewPathDesc('');
    setActiveTab('community_paths');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-[var(--border-subtle)] pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--action-primary)] font-semibold">
              <Compass className="h-4 w-4" />
              <span>Rutas de Estudio y Práctica Autónoma</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Rutas de Aprendizaje y Cuaderno Personal
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
              Itinerarios estructurados con fuentes abiertas internas y documentación oficial externa. Puedes clonar cualquier ruta a tu cuaderno, personalizarla, marcar tu progreso y debatir recomendaciones sin algoritmos ni calificaciones competitivas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreatePathOpen(true)}
              className="px-3.5 py-1.5 rounded-md bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Proponer nueva ruta</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setActiveTab('community_paths')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'community_paths'
                ? 'bg-[var(--action-primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Rutas Comunitarias ({studyPaths.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_active_paths')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'my_active_paths'
                ? 'bg-[var(--action-primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span>Mis Rutas en Curso ({myForkedPaths.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('personal_deck')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'personal_deck'
                ? 'bg-[var(--action-primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Práctica Privada (SRS) ({flashcards.length})</span>
          </button>
        </div>
      </section>

      {/* TAB 1: COMMUNITY STUDY PATHS */}
      {activeTab === 'community_paths' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter & List of Paths */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search and Area Filter */}
            <div className="space-y-2 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar rutas por título o autor..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                {['todos', 'Computación', 'Filosofía', 'Matemáticas'].map((areaName) => (
                  <button
                    key={areaName}
                    onClick={() => setSelectedArea(areaName)}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      selectedArea === areaName
                        ? 'border-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {areaName === 'todos' ? 'Todas las áreas' : areaName}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Study Paths */}
            <div className="space-y-3">
              {filteredPaths.map((path) => {
                const isSelected = selectedPath?.id === path.id;
                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`p-4 rounded-xl border cursor-pointer card-elevation ${
                      isSelected
                        ? 'border-[var(--action-primary)] bg-[var(--bg-surface)] ring-1 ring-[var(--action-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[var(--action-primary)]">
                        {path.area}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {path.estimatedWeeks} semanas
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)] mt-1 line-clamp-2">
                      {path.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                      {path.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="h-3 w-3" />
                        {path.authorName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <GitFork className="h-3 w-3" />
                          {path.clonesCount} copias
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <MessageSquare className="h-3 w-3" />
                          {path.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Path Detailed Syllabus & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {selectedPath ? (
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-xs">
                {/* Header of Path */}
                <div className="space-y-3 pb-5 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--action-primary)] bg-[var(--bg-subtle-lilac)] px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                      {selectedPath.area} · Nivel {selectedPath.level}
                    </span>

                    {/* Clone / Fork Button */}
                    <button
                      onClick={() => handleForkPath(selectedPath)}
                      className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      {copiedPathId === selectedPath.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>¡Clonada a tus rutas!</span>
                        </>
                      ) : (
                        <>
                          <GitFork className="h-3.5 w-3.5" />
                          <span>Copiar a mi cuaderno (Fork)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                    {selectedPath.title}
                  </h2>

                  <p className="font-serif text-sm text-[var(--text-secondary)] leading-relaxed">
                    {selectedPath.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-tertiary)] pt-2">
                    <span>Autor: <strong className="text-[var(--text-primary)]">{selectedPath.authorName}</strong> ({selectedPath.authorRole})</span>
                    <span>·</span>
                    <span>Duración estimada: <strong className="text-[var(--text-primary)]">{selectedPath.estimatedWeeks} semanas</strong></span>
                    <span>·</span>
                    <span>Pasos: <strong className="text-[var(--text-primary)]">{selectedPath.steps.length} etapas</strong></span>
                  </div>
                </div>

                {/* Steps Accordion / Syllabus */}
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-[var(--action-primary)]" />
                    <span>Plan de Estudio Paso a Paso ({selectedPath.steps.length} etapas)</span>
                  </h3>

                  <div className="space-y-4">
                    {selectedPath.steps.map((step) => (
                      <div
                        key={step.id}
                        className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase font-semibold text-[var(--action-primary)] block">
                              Etapa 0{step.order} · ~{step.estimatedHours} horas sugeridas
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[var(--text-primary)]">
                              {step.title}
                            </h4>
                          </div>

                          {selectedPath.isCustomFork && (
                            <button
                              onClick={() => handleToggleStepCompleted(selectedPath.id, step.id)}
                              className={`p-1.5 rounded border transition-colors flex items-center gap-1 text-[11px] ${
                                step.completed
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                              }`}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>{step.completed ? 'Completada' : 'Marcar hito'}</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {step.description}
                        </p>

                        {/* Step Resources (Mixed internal Chen + official external) */}
                        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[var(--text-tertiary)] block">
                            Recursos de estudio asociados:
                          </span>
                          <div className="space-y-1.5">
                            {step.resources.map((res) => {
                              const isInternal = res.type === 'internal_article' || res.type === 'internal_book';
                              return (
                                <div
                                  key={res.id}
                                  className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                >
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-semibold ${
                                          isInternal
                                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                            : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                                        }`}
                                      >
                                        {isInternal ? 'Chen Interno' : 'Fuente Abierta'}
                                      </span>
                                      <span className="font-semibold text-[var(--text-primary)]">
                                        {res.title}
                                      </span>
                                    </div>
                                    {res.description && (
                                      <p className="text-[11px] text-[var(--text-tertiary)]">
                                        {res.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="shrink-0">
                                    {isInternal ? (
                                      <button
                                        onClick={() => {
                                          if (onSelectArticle) {
                                            onSelectArticle('art-popper-falsabilidad');
                                          }
                                        }}
                                        className="text-xs text-[var(--action-primary)] hover:underline font-medium flex items-center gap-1"
                                      >
                                        <span>Abrir en Chen</span>
                                        <ArrowRight className="h-3 w-3" />
                                      </button>
                                    ) : (
                                      <a
                                        href={res.urlOrSlug}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-medium flex items-center gap-1"
                                      >
                                        <span>Ver documentación oficial</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations and Peer Comments */}
                <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[var(--action-primary)]" />
                      <span>Recomendaciones y Consejos de la Comunidad ({selectedPath.comments.length})</span>
                    </h3>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Espacio para sugerir bibliografía complementaria, advertir dificultades comunes y mejorar este itinerario.
                  </p>

                  {/* Comments list */}
                  <div className="space-y-2.5">
                    {selectedPath.comments.length === 0 ? (
                      <p className="text-xs text-[var(--text-tertiary)] italic p-3 rounded bg-[var(--bg-subtle)]">
                        Aún no hay recomendaciones para esta ruta. Sé la primera persona en compartir un consejo.
                      </p>
                    ) : (
                      selectedPath.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[var(--text-primary)]">
                              {comm.authorName} · <span className="font-normal text-[var(--text-tertiary)]">{comm.authorRole}</span>
                            </span>
                            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">{comm.date}</span>
                          </div>
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {comm.content}
                          </p>
                          {comm.suggestedResource && (
                            <div className="pt-1 text-[11px] text-[var(--action-primary)] font-medium">
                              Recurso recomendado: {comm.suggestedResource}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={handleAddComment} className="space-y-2.5 pt-2">
                    <textarea
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escribe tu recomendación o consejo fundamentado para quienes sigan esta ruta..."
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <input
                        type="text"
                        value={commentResource}
                        onChange={(e) => setCommentResource(e.target.value)}
                        placeholder="Enlace o título de recurso sugerido (opcional)"
                        className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="px-3.5 py-1.5 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] disabled:opacity-50 transition-colors"
                      >
                        Publicar recomendación
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded-lg">
                Selecciona una ruta de la lista para ver su temario completo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY ACTIVE FORKED PATHS */}
      {activeTab === 'my_active_paths' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
            <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
              Tus Rutas Adaptadas y en Curso
            </h3>
            <p>
              Aquí tienes las rutas que has clonado a tu espacio privado. Puedes marcar tus hitos completados, añadir notas y seguir tu ritmo de estudio personal sin presiones ni fechas límite obligatorias.
            </p>
          </div>

          {myForkedPaths.length === 0 ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center text-xs space-y-3">
              <Compass className="h-8 w-8 text-[var(--text-tertiary)] mx-auto opacity-50" />
              <p className="text-[var(--text-secondary)] font-medium">
                Aún no has clonado ninguna ruta comunitaria a tu cuaderno.
              </p>
              <button
                onClick={() => setActiveTab('community_paths')}
                className="px-4 py-2 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-hover)] transition-colors"
              >
                Explorar Rutas Comunitarias
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myForkedPaths.map((path) => {
                const totalSteps = path.steps.length;
                const completedSteps = path.steps.filter((s) => s.completed).length;
                const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                return (
                  <div
                    key={path.id}
                    className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-400">
                          En curso · {path.area}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] mt-0.5">
                          {path.title}
                        </h3>
                        {path.forkedFromTitle && (
                          <p className="text-[11px] text-[var(--text-tertiary)]">
                            Basada en: <em>{path.forkedFromTitle}</em>
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-semibold text-[var(--action-primary)]">
                          {completedSteps} de {totalSteps} hitos ({progressPct}%)
                        </span>
                        <div className="w-36 h-2 rounded-full bg-[var(--bg-subtle)] mt-1.5 overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Steps checklist */}
                    <div className="space-y-2.5">
                      {path.steps.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => handleToggleStepCompleted(path.id, st.id)}
                          className={`p-3 rounded-md border cursor-pointer flex items-start gap-3 transition-colors ${
                            st.completed
                              ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 text-[var(--text-secondary)]'
                              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(st.completed)}
                            onChange={() => {}}
                            className="mt-1 rounded text-emerald-600"
                          />
                          <div className="space-y-0.5 flex-1">
                            <span className={`text-xs font-medium block ${st.completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                              Etapa {st.order}: {st.title}
                            </span>
                            <p className="text-[11px] text-[var(--text-tertiary)]">
                              {st.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERSONAL DECK (STAGE 3 FLASHCARDS) */}
      {activeTab === 'personal_deck' && (
        <div className="space-y-8">
          {/* Methodology Chevron Stepper */}
          <nav aria-label="Etapas de estudio autónomo" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 overflow-x-auto">
            <div className="flex items-center min-w-[640px]">
              {STEPS.map((s, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <React.Fragment key={s.num}>
                    <button
                      onClick={() => setActiveStep(idx)}
                      className={`flex-1 p-2.5 rounded text-left transition-colors ${
                        isCurrent
                          ? 'bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-semibold'
                          : 'hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span>{s.num}.</span>
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[11px] font-normal text-[var(--text-tertiary)] truncate mt-0.5">
                        {s.action}
                      </div>
                    </button>
                    {idx < STEPS.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-[var(--border-strong)] shrink-0 mx-1" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </nav>

          {/* Flashcards Practice Deck */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                  Tu cuaderno privado de tarjetas ({flashcards.length})
                </h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Almacenamiento exclusivo en tu navegador · Cero recolección de telemetría
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddCardOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Crear tarjeta</span>
                </button>
                <button
                  onClick={handleExportObsidian}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Exportar Markdown</span>
                </button>
              </div>
            </div>

            {flashcards.length === 0 ? (
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)]">
                Aún no has añadido tarjetas a tu cuaderno.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Flashcard Box */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[220px] cursor-pointer rounded-lg border p-6 flex flex-col justify-between transition-colors ${
                    isFlipped
                      ? 'border-[var(--accent-teal)] bg-[var(--bg-surface)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pb-3 border-b border-[var(--border-subtle)]">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {currentCard.topic}
                      </span>
                      <span className="font-mono text-[var(--action-primary)]">
                        {isFlipped ? 'Respuesta fundamentada' : 'Pregunta o tesis'}
                      </span>
                    </div>

                    <div className="mt-6 font-serif text-lg text-[var(--text-primary)] leading-relaxed">
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-subtle)]">
                    <span className="flex items-center gap-1">
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Haz clic para voltear</span>
                    </span>
                    <span>
                      Intervalo: {currentCard.intervalDays} día(s) · {currentCard.repetitionCount} repasos
                    </span>
                  </div>
                </div>

                {/* Rating Buttons */}
                {isFlipped && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">
                      Autoevaluación honesta:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRating('hard')}
                        className="px-3 py-1.5 rounded border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-medium"
                      >
                        Difícil / Repasar pronto (1d)
                      </button>
                      <button
                        onClick={() => handleRating('good')}
                        className="px-3 py-1.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-medium"
                      >
                        Bien / Entendido (3d)
                      </button>
                      <button
                        onClick={() => handleRating('easy')}
                        className="px-3 py-1.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium"
                      >
                        Fácil / Dominado (7d)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal: Create Study Path */}
      {isCreatePathOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
              Proponer Nueva Ruta de Estudio
            </h3>
            <p className="text-[var(--text-secondary)]">
              Diseña un itinerario con objetivos formativos claros. Podrás añadir recursos de Chen y documentación oficial abierta.
            </p>

            <form onSubmit={handleCreatePathSubmit} className="space-y-3">
              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Título de la ruta:
                </label>
                <input
                  type="text"
                  required
                  value={newPathTitle}
                  onChange={(e) => setNewPathTitle(e.target.value)}
                  placeholder="Ej: Fundamentos de Concurrencia y Memoria Virtual"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Descripción pedagógica y objetivos:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newPathDesc}
                  onChange={(e) => setNewPathDesc(e.target.value)}
                  placeholder="Describe qué aprenderá el estudiante y los prerrequisitos recomendados..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[var(--text-primary)] font-medium mb-1">
                    Área:
                  </label>
                  <select
                    value={newPathArea}
                    onChange={(e) => setNewPathArea(e.target.value)}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                  >
                    <option value="Computación y Sistemas">Computación</option>
                    <option value="Filosofía y Epistemología">Filosofía</option>
                    <option value="Matemáticas y Lógica">Matemáticas</option>
                    <option value="Física y Cosmología">Física</option>
                    <option value="Ciencias Biológicas">Biología</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-medium mb-1">
                    Nivel:
                  </label>
                  <select
                    value={newPathLevel}
                    onChange={(e) => setNewPathLevel(e.target.value as any)}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                  >
                    <option value="intro">Introductorio</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-medium mb-1">
                    Semanas:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={newPathWeeks}
                    onChange={(e) => setNewPathWeeks(Number(e.target.value))}
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsCreatePathOpen(false)}
                  className="px-3 py-1.5 rounded text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                >
                  Crear y publicar ruta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Flashcard */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Nueva tarjeta conceptual
            </h3>
            <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Concepto o tema:
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Teorema de Bayes..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Pregunta a resolver:
                </label>
                <textarea
                  required
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enunciado de la prueba..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-medium mb-1">
                  Respuesta o deducción:
                </label>
                <textarea
                  required
                  rows={3}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explicación rigurosa..."
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="px-3 py-1.5 rounded text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
                >
                  Guardar tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
