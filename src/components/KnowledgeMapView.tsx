import React, { useState, useMemo } from 'react';
import {
  Compass,
  GitBranch,
  Filter,
  Search,
  BookOpen,
  ArrowUpRight,
  Check,
  X,
  ExternalLink,
  Download,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Article, KnowledgeArea } from '../types';
import { EpistemicBadge, LevelIndicator } from './SemanticBadges';

interface KnowledgeMapViewProps {
  articles: Article[];
  areas: KnowledgeArea[];
  onSelectArticle: (articleId: string) => void;
  onNavigateArea?: (areaId: string) => void;
}

export const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({
  articles,
  areas,
  onSelectArticle,
  onNavigateArea,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedRelation, setSelectedRelation] = useState<'all' | 'supports' | 'contradicts' | 'extends'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?.id || null);
  const [viewMode, setViewMode] = useState<'graph' | 'matrix'>('graph');

  // Filtered nodes
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchArea = selectedArea === 'all' || art.area === selectedArea || art.areaId === selectedArea;
      const matchSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [articles, selectedArea, searchQuery]);

  // Selected article
  const selectedArticle = useMemo(() => {
    return articles.find((a) => a.id === selectedArticleId) || filteredArticles[0] || articles[0];
  }, [articles, selectedArticleId, filteredArticles]);

  // Network links based on semantic citations
  const links = useMemo(() => {
    const list: {
      sourceId: string;
      targetId: string;
      relation: 'supports' | 'contradicts' | 'extends';
      quoteText: string;
      targetTitle: string;
    }[] = [];

    articles.forEach((source) => {
      source.citations.forEach((c) => {
        const target = articles.find(
          (t) =>
            t.id === c.targetArticleId ||
            t.title.toLowerCase() === c.targetArticleTitle.toLowerCase() ||
            c.targetArticleTitle.toLowerCase().includes(t.title.toLowerCase())
        );

        if (target) {
          if (selectedRelation === 'all' || c.relation === selectedRelation) {
            list.push({
              sourceId: source.id,
              targetId: target.id,
              relation: c.relation,
              quoteText: c.quoteText,
              targetTitle: target.title,
            });
          }
        }
      });
    });

    return list;
  }, [articles, selectedRelation]);

  // Node layout positions (deterministic polar / radial layout by area)
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; area: string }>();
    const total = articles.length;
    const centerX = 360;
    const centerY = 240;
    const radius = 170;

    articles.forEach((art, idx) => {
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      map.set(art.id, { x, y, area: art.area });
    });

    return map;
  }, [articles]);

  const handleExportGraphviz = () => {
    let dot = 'digraph ChenKnowledgeGraph {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box, fontname="Helvetica", style=rounded];\n';
    articles.forEach((art) => {
      dot += `  "${art.id}" [label="${art.title.replace(/"/g, '\\"')}\\n(${art.area})"];\n`;
    });
    links.forEach((l) => {
      const color = l.relation === 'supports' ? 'green' : l.relation === 'contradicts' ? 'red' : 'blue';
      dot += `  "${l.sourceId}" -> "${l.targetId}" [label="${l.relation}", color="${color}"];\n`;
    });
    dot += '}\n';

    const blob = new Blob([dot], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chen-knowledge-graph-${new Date().toISOString().slice(0, 10)}.dot`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="space-y-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
                Pilar 2 · Conectar
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">Grafo Semántico de Conocimiento</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Mapa de Conocimiento y Grafo de Citas
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              En Chen las ideas no compiten por popularidad: se conectan por derivación lógica y citas semánticas verificables (<span className="text-emerald-700 dark:text-emerald-400 font-semibold">apoya</span>, <span className="text-rose-700 dark:text-rose-400 font-semibold">contradice</span> y <span className="text-teal-700 dark:text-teal-400 font-semibold">amplía</span>).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportGraphviz}
              className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
              title="Exportar archivo DOT compatible con Graphviz y Obsidian Graph View"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar DOT / Obsidian</span>
            </button>
          </div>
        </div>

        {/* Filters and Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
              <span className="font-semibold text-[var(--text-primary)]">Área:</span>
            </div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">Todas las áreas ({articles.length} nodos)</option>
              {areas.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>

            <span className="text-[var(--text-tertiary)]">·</span>

            <div className="flex items-center gap-1">
              <span className="font-semibold text-[var(--text-primary)]">Función de cita:</span>
            </div>
            <select
              value={selectedRelation}
              onChange={(e) => setSelectedRelation(e.target.value as any)}
              className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">Todas las citas ({links.length} enlaces)</option>
              <option value="supports">(+) Citas que apoyan</option>
              <option value="contradicts">(-) Citas que contradicen</option>
              <option value="extends">(→) Citas que amplían</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nodo por título o autor..."
                className="pl-8 pr-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none w-56 sm:w-64"
              />
            </div>

            <div className="flex items-center rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-[var(--action-primary)] text-white font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Grafo
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-[var(--action-primary)] text-white font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Matriz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Viewport + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas / SVG Graph */}
        <div className="lg:col-span-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Apoya ({links.filter((l) => l.relation === 'supports').length})
              </span>
              <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Contradice ({links.filter((l) => l.relation === 'contradicts').length})
              </span>
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Amplía ({links.filter((l) => l.relation === 'extends').length})
              </span>
            </div>
            <span className="font-mono text-[11px]">
              {filteredArticles.length} artículos representados
            </span>
          </div>

          {viewMode === 'graph' ? (
            <div className="relative w-full h-[480px] bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center select-none">
              <svg viewBox="0 0 720 480" className="w-full h-full">
                {/* Background Grid Lines */}
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.04" />
                  </pattern>
                  <marker id="arrow-supports" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                  </marker>
                  <marker id="arrow-contradicts" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#F43F5E" />
                  </marker>
                  <marker id="arrow-extends" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#0D9488" />
                  </marker>
                </defs>
                <rect width="720" height="480" fill="url(#grid-pattern)" />

                {/* Central Cluster Hub */}
                <circle cx="360" cy="240" r="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="360" y="243" textAnchor="middle" className="text-[10px] font-mono fill-[var(--text-tertiary)] uppercase tracking-wider">
                  Chen AGPL
                </text>

                {/* Edges / Citations Lines */}
                {links.map((link, idx) => {
                  const sPos = nodePositions.get(link.sourceId);
                  const tPos = nodePositions.get(link.targetId);
                  if (!sPos || !tPos) return null;

                  const isSelected = selectedArticle?.id === link.sourceId || selectedArticle?.id === link.targetId;
                  const strokeColor =
                    link.relation === 'supports'
                      ? '#10B981'
                      : link.relation === 'contradicts'
                      ? '#F43F5E'
                      : '#0D9488';
                  const markerId = `url(#arrow-${link.relation})`;

                  return (
                    <line
                      key={`link-${idx}`}
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                      strokeDasharray={link.relation === 'contradicts' ? '4 3' : undefined}
                      markerEnd={markerId}
                    />
                  );
                })}

                {/* Nodes (Articles) */}
                {filteredArticles.map((art) => {
                  const pos = nodePositions.get(art.id);
                  if (!pos) return null;
                  const isSelected = selectedArticle?.id === art.id;

                  return (
                    <g
                      key={art.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedArticleId(art.id)}
                      className="cursor-pointer transition-transform duration-200"
                    >
                      {/* Glow ring when selected */}
                      {isSelected && (
                        <circle
                          r="18"
                          fill="none"
                          stroke="var(--action-primary)"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                      )}
                      <circle
                        r="12"
                        fill={isSelected ? 'var(--action-primary)' : 'var(--bg-surface)'}
                        stroke={isSelected ? 'var(--action-primary)' : 'var(--border-strong)'}
                        strokeWidth="2"
                      />
                      <text
                        y="4"
                        textAnchor="middle"
                        className={`text-[9px] font-bold ${
                          isSelected ? 'fill-white' : 'fill-[var(--text-primary)]'
                        }`}
                      >
                        {art.citations.length}
                      </text>
                      {/* Node label */}
                      <text
                        y="22"
                        textAnchor="middle"
                        className={`text-[9px] font-serif transition-colors ${
                          isSelected
                            ? 'fill-[var(--action-primary)] font-bold'
                            : 'fill-[var(--text-secondary)]'
                        }`}
                      >
                        {art.title.length > 22 ? art.title.slice(0, 20) + '...' : art.title}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* Matrix View */
            <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-subtle)] text-[11px] font-mono border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <th className="p-3">Artículo Origen</th>
                    <th className="p-3">Función</th>
                    <th className="p-3">Artículo Citado</th>
                    <th className="p-3">Área</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {links.map((link, idx) => {
                    const source = articles.find((a) => a.id === link.sourceId);
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedArticleId(link.sourceId)}
                        className="hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-serif font-medium text-[var(--text-primary)]">
                          {source?.title}
                        </td>
                        <td className="p-3 font-mono text-[10px] font-bold">
                          {link.relation === 'supports' && <span className="text-emerald-700">APOYA</span>}
                          {link.relation === 'contradicts' && <span className="text-rose-700">CONTRADICE</span>}
                          {link.relation === 'extends' && <span className="text-teal-700">AMPLÍA</span>}
                        </td>
                        <td className="p-3 font-serif text-[var(--text-secondary)]">
                          {link.targetTitle}
                        </td>
                        <td className="p-3 text-[11px] text-[var(--text-tertiary)] font-mono">
                          {source?.area}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Inspector and Node Details */}
        <div className="lg:col-span-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-xs sticky top-24">
          {selectedArticle ? (
            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="font-mono text-[10px] uppercase text-[var(--action-primary)] font-semibold">
                    {selectedArticle.area}
                  </span>
                  <span className="text-[var(--text-tertiary)]">·</span>
                  <EpistemicBadge status={selectedArticle.epistemicStatus} />
                </div>

                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] leading-snug">
                  {selectedArticle.title}
                </h3>
                <p className="font-serif text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedArticle.subtitle}
                </p>
              </div>

              {/* Author & Metrics */}
              <div className="rounded-lg p-3 bg-[var(--bg-subtle)] text-xs space-y-1.5 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {selectedArticle.author.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    {selectedArticle.license}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {selectedArticle.author.role}
                </p>
              </div>

              {/* Citations connected to this node */}
              <div className="space-y-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Red de citas de este nodo ({selectedArticle.citations.length}):
                </span>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                  {selectedArticle.citations.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {c.targetArticleTitle}
                        </span>
                        {c.relation === 'supports' && <span className="text-emerald-700 font-bold">APOYA</span>}
                        {c.relation === 'contradicts' && <span className="text-rose-700 font-bold">CONTRADICE</span>}
                        {c.relation === 'extends' && <span className="text-teal-700 font-bold">AMPLÍA</span>}
                      </div>
                      <p className="font-serif italic text-[var(--text-secondary)] text-[11px] line-clamp-2">
                        "{c.quoteText}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Read complete article */}
              <button
                onClick={() => onSelectArticle(selectedArticle.id)}
                className="w-full py-2 rounded-md bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Leer artículo completo</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-tertiary)]">
              Selecciona un nodo del grafo para examinar sus conexiones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
