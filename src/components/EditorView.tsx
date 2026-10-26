import React, { useState, useEffect } from 'react';
import {
  FileText,
  Eye,
  Edit3,
  GitBranch,
  Shield,
  Bot,
  Check,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  Clock,
  Sparkles,
  Lock,
  Globe,
  EyeOff,
} from 'lucide-react';
import {
  Article,
  EpistemicStatus,
  ContentLevel,
  OpenLicense,
  CitationRelation,
  Citation,
  VideoChapter,
} from '../types';
import { INITIAL_AUTHORS, INITIAL_AREAS } from '../data/initialData';

interface EditorViewProps {
  existingArticles: Article[];
  onBack: () => void;
  onSaveArticle: (article: Article) => void;
}

const TEMPLATES = {
  explicacion: `## 1. El concepto fundamental

Explica aquí la idea principal en términos claros y directos.

## 2. Desarrollo formal y matemático

Puedes incluir fórmulas matemáticas usando KaTeX:

$$E = mc^2$$

## 3. Ejemplo concreto o caso de estudio

Desarrolla una ilustración práctica del principio.`,
  tesis: `## 1. Tesis central a defender

Formulación precisa de la afirmación o modelo propuesto.

## 2. Condición de refutación popperiana

> **¿Qué observación empírica o demostración exacta obligaría al autor a admitir que su tesis es errónea?**

Explica aquí qué evidencia cambiaría tu postura de forma inequívoca.

## 3. Evidencias y argumentos en favor

Argumentación lógica y deducciones contrastables.`,
  tutorial: `## 1. Prerrequisitos necesarios

Qué conceptos o herramientas deben dominarse antes de iniciar.

## 2. Paso a paso estructurado

Procedimiento metódico y ordenado.

## 3. Comprobación y autoevaluación

Cómo verificar de forma independiente que se ha obtenido el resultado esperado.`,
  resena: `## 1. Obra o artículo analizado

Referencia completa con enlace y licencia.

## 2. Puntos fuertes y aportes originales

Qué aporta de nuevo al estado del arte.

## 3. Objeciones y limitaciones identificadas

Aspectos no resueltos o contradicciones formales.`,
};

export const EditorView: React.FC<EditorViewProps> = ({
  existingArticles,
  onBack,
  onSaveArticle,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [area, setArea] = useState('Filosofía y Epistemología');
  const [level, setLevel] = useState<ContentLevel>('intermediate');
  const [license, setLicense] = useState<OpenLicense>('CC BY-SA 4.0');
  const [epistemicStatus, setEpistemicStatus] = useState<EpistemicStatus>('opinion');
  const [epistemicNote, setEpistemicNote] = useState('');
  const [aiDeclared, setAiDeclared] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [prerequisiteText, setPrerequisiteText] = useState('');
  const [content, setContent] = useState(TEMPLATES.tesis);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [lastSaved, setLastSaved] = useState<string>('Guardado local activo');
  const [isSaved, setIsSaved] = useState(false);

  // Video embed editor
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoChapters, setVideoChapters] = useState<VideoChapter[]>([
    { time: '00:00', seconds: 0, title: 'Introducción al tema' },
    { time: '03:15', seconds: 195, title: 'Demostración fundamental' },
  ]);

  // Citations list
  const [citations, setCitations] = useState<Citation[]>([
    {
      id: 'cit-demo-1',
      targetArticleTitle: 'Logik der Forschung (Popper, 1934)',
      targetAuthor: 'Karl Popper',
      relation: 'supports',
      quoteText: 'La falsabilidad como criterio de demarcación científica.',
      explanation: 'Fundamento deductivo del argumento.',
    },
    {
      id: 'cit-demo-2',
      targetArticleTitle: 'Dos dogmas del empirismo (Quine, 1951)',
      targetAuthor: 'W.V.O. Quine',
      relation: 'contradicts',
      quoteText: 'Nuestros enunciados acerca del mundo exterior se someten al tribunal de la experiencia en conjunto.',
      explanation: 'Objeción holista que delimita el alcance de la refutación aislada.',
    },
  ]);

  // New citation form state
  const [showCitationForm, setShowCitationForm] = useState(false);
  const [newCitTitle, setNewCitTitle] = useState('');
  const [newCitAuthor, setNewCitAuthor] = useState('');
  const [newCitRelation, setNewCitRelation] = useState<CitationRelation>('supports');
  const [newCitQuote, setNewCitQuote] = useState('');
  const [newCitExplanation, setNewCitExplanation] = useState('');

  // Chapter adder
  const handleAddChapter = () => {
    setVideoChapters((prev) => [
      ...prev,
      { time: '05:00', seconds: 300, title: 'Nueva sección explicativa' },
    ]);
  };

  const handleRemoveChapter = (index: number) => {
    setVideoChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateChapter = (index: number, field: keyof VideoChapter, value: any) => {
    setVideoChapters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  // Add Citation
  const handleAddCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitTitle.trim() || !newCitQuote.trim()) return;

    const newCitation: Citation = {
      id: `cit-${Date.now().toString(36)}`,
      targetArticleTitle: newCitTitle.trim(),
      targetAuthor: newCitAuthor.trim() || 'Autor citado',
      relation: newCitRelation,
      quoteText: newCitQuote.trim(),
      explanation: newCitExplanation.trim() || 'Aporte argumentativo',
    };

    setCitations((prev) => [...prev, newCitation]);
    setShowCitationForm(false);
    setNewCitTitle('');
    setNewCitAuthor('');
    setNewCitQuote('');
    setNewCitExplanation('');
  };

  const handleRemoveCitation = (id: string) => {
    setCitations((prev) => prev.filter((c) => c.id !== id));
  };

  // Autosave simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(`Autoguardado local a las ${new Date().toLocaleTimeString().slice(0, 5)}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, citations]);

  const handleApplyTemplate = (type: keyof typeof TEMPLATES) => {
    if (content.length > 50 && !window.confirm('¿Deseas reemplazar el contenido con la plantilla seleccionada?')) {
      return;
    }
    setContent(TEMPLATES[type]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newArticle: Article = {
      id: `art-${Date.now().toString(36)}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: title.trim(),
      subtitle: subtitle.trim() || 'Sin subtítulo descriptivo',
      excerpt: content.slice(0, 180).replace(/[#>*_`$]/g, '').trim() + '...',
      contentMarkdown: content,
      author: INITIAL_AUTHORS['usr-clara'],
      areaId: INITIAL_AREAS.find((a) => a.name === area)?.id || 'area-filosofia',
      area,
      level,
      license,
      epistemicStatus,
      epistemicNote: epistemicNote.trim() || 'Aporte razonado para revisión abierta por pares en Chen.',
      aiDeclared,
      visibility,
      readTimeMinutes: Math.max(2, Math.ceil(content.split(/\s+/).length / 200)),
      publishedDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      lastUpdatedDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      versionNumber: '1.0',
      citedByCount: 0,
      citations,
      prerequisites: prerequisiteText.trim() ? [{ id: 'p-1', title: prerequisiteText.trim() }] : [],
      videoEmbed: hasVideo && videoUrl.trim() ? {
        title: videoTitle.trim() || 'Vídeo explicativo asociado',
        embedUrl: videoUrl.trim(),
        provider: videoUrl.includes('peertube') ? 'peertube' : 'youtube',
        chapters: videoChapters,
        transcriptExcerpt: 'Transcripción aportada por el autor.',
      } : undefined,
    };

    onSaveArticle(newArticle);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar with autosave and Publish action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver sin guardar</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] hidden sm:inline">
            {lastSaved}
          </span>

          <button
            onClick={handleSave}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-xs transition-colors text-xs"
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>¡Publicado con éxito!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Publicar artículo con citas</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Title and Subtitle */}
        <div className="space-y-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del artículo o tesis..."
            className="w-full font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] bg-transparent border-b border-[var(--border-subtle)] pb-2 placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--action-primary)]"
          />

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtítulo o tesis resumida en una frase clara..."
            className="w-full font-serif text-base text-[var(--text-secondary)] bg-transparent border-b border-[var(--border-subtle)] pb-2 placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--action-primary)]"
          />
        </div>

        {/* Metadata Controls Bar: Area, Level, License, Epistemic, Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs shadow-xs">
          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Área:</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs focus:outline-none"
            >
              {INITIAL_AREAS.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Nivel:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ContentLevel)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs focus:outline-none"
            >
              <option value="intro">Introductorio (1)</option>
              <option value="intermediate">Intermedio (2)</option>
              <option value="advanced">Avanzado (3)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1" title="Licencia libre cerrada">
              Licencia abierta:
            </label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value as OpenLicense)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs focus:outline-none font-mono text-[11px]"
            >
              <option value="CC BY-SA 4.0">CC BY-SA 4.0 (Compartir Igual)</option>
              <option value="CC BY 4.0">CC BY 4.0 (Atribución libre)</option>
              <option value="CC0 1.0">CC0 1.0 (Dominio Público)</option>
              <option value="CC BY-NC 4.0">CC BY-NC 4.0 (No comercial)</option>
              <option value="CC BY-ND 4.0">CC BY-ND 4.0 (Sin derivadas)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Estado epistémico:</label>
            <select
              value={epistemicStatus}
              onChange={(e) => setEpistemicStatus(e.target.value as EpistemicStatus)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs focus:outline-none"
            >
              <option value="opinion">Opinión / Análisis crítico</option>
              <option value="hypothesis">Hipótesis falsable</option>
              <option value="fact">Hecho empírico verificado</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">Visibilidad:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs focus:outline-none"
            >
              <option value="public">Público en Chen</option>
              <option value="unlisted">No listado (por enlace)</option>
              <option value="private">Apunte privado</option>
            </select>
          </div>
        </div>

        {/* Prerequisites and AI Declaration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-1">
            <label className="block font-medium text-[var(--text-primary)]">
              Conviene saber antes (Prerrequisitos previos):
            </label>
            <input
              type="text"
              value={prerequisiteText}
              onChange={(e) => setPrerequisiteText(e.target.value)}
              placeholder="Ej. Cálculo proposicional básico o límites funcionales"
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs focus:outline-none"
            />
          </div>

          <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-medium text-[var(--text-primary)] block">
                Declaración transparente de IA
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)]">
                Marca si usaste modelos de lenguaje para redactar o sintetizar.
              </span>
            </div>
            <input
              type="checkbox"
              checked={aiDeclared}
              onChange={(e) => setAiDeclared(e.target.checked)}
              className="h-4 w-4 rounded text-[var(--action-primary)]"
            />
          </div>
        </div>

        {/* Citations Manager (Section 1.2 & 1.8: supports / contradicts / extends) */}
        <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <GitBranch className="h-4 w-4 text-[var(--action-primary)]" />
              <span>Citas con función declarada ({citations.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCitationForm(!showCitationForm)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] font-medium"
            >
              <Plus className="h-3 w-3" />
              <span>Añadir cita con función</span>
            </button>
          </div>

          {showCitationForm && (
            <div className="p-3.5 rounded border border-indigo-200 bg-[var(--bg-subtle-lilac)] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Título del artículo o libro citado..."
                  value={newCitTitle}
                  onChange={(e) => setNewCitTitle(e.target.value)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Autor de la fuente..."
                  value={newCitAuthor}
                  onChange={(e) => setNewCitAuthor(e.target.value)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs"
                />
                <select
                  value={newCitRelation}
                  onChange={(e) => setNewCitRelation(e.target.value as CitationRelation)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs font-bold"
                >
                  <option value="supports">Función: APOYA (Respaldo)</option>
                  <option value="contradicts">Función: CONTRADICE (Objeción)</option>
                  <option value="extends">Función: AMPLÍA (Generalización)</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Pasaje exacto citado entre comillas..."
                value={newCitQuote}
                onChange={(e) => setNewCitQuote(e.target.value)}
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCitationForm(false)}
                  className="px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddCitation}
                  className="px-3 py-1 rounded bg-[var(--action-primary)] text-white font-medium"
                >
                  Guardar cita
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {citations.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      c.relation === 'supports'
                        ? 'bg-indigo-100 text-indigo-800'
                        : c.relation === 'contradicts'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {c.relation.toUpperCase()}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {c.targetArticleTitle}
                    </span>
                    <span className="text-[var(--text-tertiary)]">({c.targetAuthor})</span>
                  </div>
                  <p className="italic text-[11px] text-[var(--text-secondary)] truncate max-w-lg">
                    "{c.quoteText}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCitation(c.id)}
                  className="text-[var(--text-tertiary)] hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video Embed & Chapter Editor (Section 1.2 & 1.14) */}
        <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[var(--action-primary)]" />
              <span className="font-semibold text-[var(--text-primary)]">
                Vídeo explicativo embebido con capítulos por minuto
              </span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVideo}
                onChange={(e) => setHasVideo(e.target.checked)}
                className="rounded"
              />
              <span>Incluir vídeo explicativo</span>
            </label>
          </div>

          {hasVideo && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="URL del vídeo (YouTube sin cookies o PeerTube)..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Título del seminario o clase..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs"
                />
              </div>

              {/* Chapters List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                  <span>Capítulos para citas por minuto:</span>
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="text-[var(--action-primary)] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Añadir capítulo</span>
                  </button>
                </div>

                {videoChapters.map((chap, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="00:00"
                      value={chap.time}
                      onChange={(e) => handleUpdateChapter(i, 'time', e.target.value)}
                      className="w-16 font-mono text-center rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Título del pasaje..."
                      value={chap.title}
                      onChange={(e) => handleUpdateChapter(i, 'title', e.target.value)}
                      className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(i)}
                      className="text-[var(--text-tertiary)] hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template Chooser Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[var(--text-tertiary)]">Plantillas de estructura:</span>
          <button
            type="button"
            onClick={() => handleApplyTemplate('tesis')}
            className="px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--action-primary)]"
          >
            Tesis (con refutación)
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('explicacion')}
            className="px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--action-primary)]"
          >
            Explicación con KaTeX
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('tutorial')}
            className="px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--action-primary)]"
          >
            Tutorial paso a paso
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('resena')}
            className="px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--action-primary)]"
          >
            Reseña crítica
          </button>
        </div>

        {/* Split Editor / Live Preview on Desktop, Tabbed on Mobile */}
        <div className="space-y-2">
          <div className="flex lg:hidden rounded border border-[var(--border-subtle)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setMobileTab('editor')}
              className={`flex-1 py-1 rounded ${mobileTab === 'editor' ? 'bg-[var(--action-primary)] text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              Editor Markdown
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={`flex-1 py-1 rounded ${mobileTab === 'preview' ? 'bg-[var(--action-primary)] text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              Vista previa
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor Column */}
            <div className={`space-y-2 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
                <span>Markdown + Fórmulas KaTeX ($$)</span>
                <span className="font-mono text-[11px]">{content.length} caracteres</span>
              </div>
              <textarea
                required
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe aquí tu aporte..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 font-mono text-xs text-[var(--text-primary)] leading-relaxed focus:border-[var(--action-primary)] focus:outline-none"
              />
            </div>

            {/* Live Preview Column */}
            <div className={`space-y-2 ${mobileTab === 'editor' ? 'hidden lg:block' : ''}`}>
              <div className="text-xs text-[var(--text-tertiary)] px-1">
                Vista previa en tiempo real (Tipografía de lectura Chen)
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 min-h-[380px] prose-reading overflow-y-auto max-h-[500px]">
                {content.split('\n').map((line, idx) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={idx}>{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="my-3">
                        {line.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (line.startsWith('$$') && line.endsWith('$$')) {
                    return (
                      <div key={idx} className="math-block">
                        {line.replace(/\$\$/g, '')}
                      </div>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
