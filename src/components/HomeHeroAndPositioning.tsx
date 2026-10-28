import React, { useState } from 'react';
import { Article } from '../types';

interface HomeHeroAndPositioningProps {
  articles: Article[];
  onOpenArticle: (articleId: string) => void;
  onOpenEditor: (prefilledQuote?: {
    sourceSnippet: string;
    targetArticleId: string;
    targetArticleTitle: string;
    targetVersionHash: string;
    targetAuthorName: string;
  }) => void;
}

export const HomeHeroAndPositioning: React.FC<HomeHeroAndPositioningProps> = ({
  articles,
  onOpenArticle,
  onOpenEditor,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'supports' | 'contradicts' | 'extends'>('all');

  // Interactive Live Demo data items (Distributed Consensus & PBFT case study)
  const demoResponses = [
    {
      id: 'demo-contra',
      relation: 'contradicts' as const,
      relationLabel: '[- CONTRADICE]',
      relationColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800',
      badgeColor: 'text-rose-700 dark:text-rose-400 font-semibold',
      author: 'Ing. Andrés Keller',
      authorHandle: '@andreskeller-dev',
      articleId: 'art-pbft-castro-liskov',
      title: 'Tolerancia práctica a fallas bizantinas (PBFT) bajo sincronía parcial',
      versionHash: '#c2d854ab',
      reasoning:
        'Castro y Liskov (1999) demuestran que el pesimismo de FLP se supera en producción: con sincronía débil (timeouts adaptativos) y 3f+1 nodos, el consenso determinista no solo es viable sino eficiente.',
      actionLabel: 'Leer réplica de refutación',
    },
    {
      id: 'demo-supports',
      relation: 'supports' as const,
      relationLabel: '[+ APOYA]',
      relationColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
      badgeColor: 'text-emerald-700 dark:text-emerald-400 font-semibold',
      author: 'Dra. Clara Méndez',
      authorHandle: '@claramendez-sci',
      articleId: 'art-flp-consenso',
      title: 'Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)',
      versionHash: '#7e9f3b21',
      reasoning:
        'El resultado de Fischer, Lynch & Paterson (1985) establece una cota matemática irrevocable: en asincronía total, ningún protocolo determinista puede garantizar seguridad y vivacidad si tan solo 1 nodo falla.',
      actionLabel: 'Leer demostración formal',
    },
    {
      id: 'demo-extends',
      relation: 'extends' as const,
      relationLabel: '[→ AMPLÍA]',
      relationColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-800',
      badgeColor: 'text-teal-700 dark:text-teal-400 font-semibold',
      author: 'Dr. Julián Arispe',
      authorHandle: '@jarispe-method',
      articleId: 'art-lakatos-programas',
      title: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
      versionHash: '#a3c9415e',
      reasoning:
        'Aplica el modelo de Lakatos a la informática: las demostraciones de imposibilidad actúan como núcleo firme, mientras que los protocolos de sincronía parcial son el cinturón protector progresivo.',
      actionLabel: 'Leer extensión epistemológica',
    },
  ];

  const filteredDemoCards =
    activeFilter === 'all'
      ? demoResponses
      : demoResponses.filter((item) => item.relation === activeFilter);

  return (
    <div className="space-y-20 pb-24">
      {/* 1. HERO EDITORIAL */}
      <section
        aria-labelledby="hero-title"
        className="pt-12 sm:pt-16 pb-6 border-b border-stone-200 dark:border-stone-800/80"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <span>Versión 1.0 (MVP Nuclear)</span>
            <span className="text-stone-400">·</span>
            <span>Cero Rastreo · Cero Algoritmos · WCAG 2.1 AAA</span>
          </div>

          <h1
            id="hero-title"
            className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]"
          >
            Internet ha resuelto la distribución del texto, pero ha roto la conversación intelectual.
          </h1>

          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Chen es el protocolo de publicación técnica y ensayística donde cada texto se integra en una red de argumentación verificable. Sin algoritmos de indignación, sin anuncios, con citas bidireccionales inmutables.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('explorador-articulos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium text-sm hover:bg-stone-800 dark:hover:bg-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              Explorar Artículos y Debates
            </button>

            <button
              onClick={() => onOpenEditor()}
              className="px-5 py-3 rounded-md bg-transparent text-teal-800 dark:text-teal-300 font-medium text-sm border border-teal-700/40 dark:border-teal-500/40 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              Publicar Tesis (Markdown)
            </button>
          </div>
        </div>
      </section>

      {/* 2. DEMOSTRADOR INTERACTIVO EN VIVO (Anatomía de una Cita con Función) */}
      <section
        aria-labelledby="demo-heading"
        className="max-w-4xl mx-auto bg-stone-50 dark:bg-[#13151A] rounded-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Demostrador Interactivo en Vivo
            </span>
            <h2 id="demo-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Anatomía de una Cita con Función Lógica
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-xs">
            Selecciona una postura argumental para comprobar cómo los artículos se vinculan de manera bidireccional e inmutable.
          </p>
        </div>

        {/* Párrafo Fuente de Ejemplo */}
        <div className="mt-6 p-5 rounded-lg bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Artículo Fuente: Dra. Clara Méndez (@claramendez-sci)
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] uppercase font-bold">
                Estado: Hipótesis
              </span>
              <span className="font-mono text-[10px] text-stone-400">Hash: #7e9f3b</span>
            </div>
          </div>
          <blockquote className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 italic border-l-4 border-stone-300 dark:border-stone-700 pl-4 py-1">
            «La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables»
          </blockquote>
        </div>

        {/* Pestañas de Filtrado de Postura */}
        <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar réplicas argumentativas">
          <button
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-950 font-bold shadow-xs'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            Todas ({demoResponses.length})
          </button>
          <button
            role="tab"
            aria-selected={activeFilter === 'supports'}
            onClick={() => setActiveFilter('supports')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
              activeFilter === 'supports'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            [+ APOYA] (1)
          </button>
          <button
            role="tab"
            aria-selected={activeFilter === 'contradicts'}
            onClick={() => setActiveFilter('contradicts')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
              activeFilter === 'contradicts'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800'
            }`}
          >
            [- CONTRADICE] (1)
          </button>
          <button
            role="tab"
            aria-selected={activeFilter === 'extends'}
            onClick={() => setActiveFilter('extends')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
              activeFilter === 'extends'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-300 dark:border-teal-800'
            }`}
          >
            [→ AMPLÍA] (1)
          </button>
        </div>

        {/* Tarjetas de Réplicas Conectadas */}
        <div className="mt-5 space-y-3">
          {filteredDemoCards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-lg border transition-all ${card.relationColor}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-mono text-xs uppercase ${card.badgeColor}`}>
                  {card.relationLabel} · por {card.author}
                </span>
                <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400">
                  Versión: {card.versionHash}
                </span>
              </div>

              <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 mt-1.5">
                {card.title}
              </h4>

              <p className="font-sans text-xs sm:text-sm text-stone-800 dark:text-stone-200 mt-2 leading-relaxed">
                {card.reasoning}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => onOpenArticle(card.articleId)}
                  className="font-mono text-xs font-semibold underline underline-offset-4 text-stone-900 dark:text-stone-100 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {card.actionLabel} &rarr;
                </button>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  Cita con ancla SHA-256 inmutable
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TABLA COMPARATIVA DE POSICIONAMIENTO */}
      <section aria-labelledby="positioning-table-heading" className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Propuesta de Valor v1.0
          </span>
          <h2 id="positioning-table-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Comparativa de Ecosistemas de Publicación
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-sans">
            Qué gana un autor técnico y pensador al publicar en Chen frente a su propio blog o en GitHub.
          </p>
        </div>

        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
            <thead className="bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold">
              <tr>
                <th scope="col" className="p-3.5 sm:p-4">Dimensión</th>
                <th scope="col" className="p-3.5 sm:p-4">Blog Personal (Substack/Ghost)</th>
                <th scope="col" className="p-3.5 sm:p-4">Repositorio GitHub</th>
                <th scope="col" className="p-3.5 sm:p-4 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 border-l border-teal-200 dark:border-teal-800">
                  Chen (Protocolo Abierto)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Descubrimiento y Red</td>
                <td className="p-3.5 sm:p-4">Aislado. Depende 100% de que el autor traiga audiencia de Twitter/LinkedIn.</td>
                <td className="p-3.5 sm:p-4">Optimizado para código ejecutable; los ensayos en Markdown quedan enterrados.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Grafo de citas cruzadas. Quien busca el tema encuentra tu réplica vinculada directamente a la tesis central.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Mecánica de Debate</td>
                <td className="p-3.5 sm:p-4">Comentarios caóticos no estructurados, spam y cámaras de eco.</td>
                <td className="p-3.5 sm:p-4">Issues y PRs para bugs de código, no para debate epistemológico o deducción.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Citas con función lógica: <span className="font-mono text-emerald-700 dark:text-emerald-400">[+APOYA]</span>, <span className="font-mono text-rose-700 dark:text-rose-400">[-CONTRADICE]</span>, <span className="font-mono text-teal-700 dark:text-teal-400">[→AMPLÍA]</span> con justificación obligatoria.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Portafolio Profesional</td>
                <td className="p-3.5 sm:p-4">Métricas de vanidad: seguidores, clics y newsletters de pago.</td>
                <td className="p-3.5 sm:p-4">Historial de commits técnicos, pero sin trazabilidad del pensamiento ensayístico.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Identidad verificada (GitHub / ORCID), atribución inalterable y métricas de citación externa (ECR).
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Preservación y Citas</td>
                <td className="p-3.5 sm:p-4">Enlaces rotos (404), cambios de dominio y ediciones no versionadas.</td>
                <td className="p-3.5 sm:p-4">Git tags inmutables, pero sin resolución semántica de fragmentos de texto.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Inmutabilidad por hash SHA-256 anclado al fragmento exacto, compatible con RGPD y CC BY-SA 4.0.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. CUADRANTE VISUAL DE POSICIONAMIENTO */}
      <section aria-labelledby="quadrant-heading" className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Espacio de Diseño
          </span>
          <h2 id="quadrant-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Cuadrante de Posicionamiento Epistémico
          </h2>
        </div>

        <div className="p-6 sm:p-8 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-[#121419]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cuadrante 1: Chen */}
            <div className="p-4 rounded-lg bg-teal-900 text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold">Chen</span>
                <span className="font-mono text-[11px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded">
                  Cuadrante Objetivo
                </span>
              </div>
              <p className="text-xs text-teal-100 leading-relaxed font-sans">
                <strong>Tesis original profunda + Debate granular en tiempo real.</strong> Textos técnicos con autoría verificada, hipótesis explícitas y refutaciones deductivas conectadas por SHA-256.
              </p>
            </div>

            {/* Cuadrante 2: Wikipedia */}
            <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">Wikipedia</span>
                <span className="font-mono text-[11px] text-stone-500">Síntesis Enciclopédica</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Consenso neutral estricto (Punto de Vista Neutral). <strong>Prohibida la investigación original o tesis nuevas.</strong> Las discusiones están relegadas a páginas de charla accesorias.
              </p>
            </div>

            {/* Cuadrante 3: ArXiv */}
            <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">ArXiv / BioRxiv</span>
                <span className="font-mono text-[11px] text-stone-500">Repositorio de Preprints</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                PDFs estáticos no interactivos. <strong>Sin debate granular entre pares en el propio documento.</strong> Las citas tardan meses o años en manifestarse a través de revistas formales.
              </p>
            </div>

            {/* Cuadrante 4: Medium / Substack */}
            <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">Medium / Substack</span>
                <span className="font-mono text-[11px] text-stone-500">Publicación Monetizada</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Muros de pago, incentivo al clickbait y algoritmos de retención. <strong>Cero rigor en la citación bidireccional;</strong> el debate se reduce a secciones de comentarios lineales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOJA DE RUTA EJECUTIVA (Fases 1 a 3) */}
      <section aria-labelledby="roadmap-heading" className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Plan de Ejecución Realista (0 €)
          </span>
          <h2 id="roadmap-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Hoja de Ruta Ejecutiva (2026-2027)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-sans">
            Desarrollo guiado por el principio de Pareto (80/20) para validar tracción antes de añadir complejidad técnica.
          </p>
        </div>

        <div className="space-y-4">
          {/* Fase 1 */}
          <div className="p-5 rounded-lg border-2 border-teal-700/60 bg-white dark:bg-stone-900 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-teal-800 dark:text-teal-300">
                Fase 1 (Meses 1-2) · EN EJECUCIÓN (MVP Nuclear)
              </span>
              <span className="font-mono text-xs text-stone-500">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
              Validación de la Hipótesis Central de Citación Cruzada
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-sans leading-relaxed">
              <strong>Alcance:</strong> Editor Markdown puro, anclaje de citas funcionales (<code className="text-xs font-mono">[+APOYA]</code>, <code className="text-xs font-mono">[-CONTRADICE]</code>, <code className="text-xs font-mono">[→AMPLÍA]</code>), versiones inmutables SHA-256 y cumplimiento RGPD Art. 17.
            </p>
            <div className="mt-3 text-xs font-mono text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded border border-teal-200 dark:border-teal-900">
              <strong>KPI de éxito:</strong> 15 artículos técnicos publicados por investigadores independientes con Tasa de Citación Externa (ECR) &gt; 40%.
            </div>
          </div>

          {/* Fase 2 */}
          <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-stone-700 dark:text-stone-300">
                Fase 2 (Meses 3-6) · Consolidación y Portabilidad
              </span>
              <span className="font-mono text-xs text-stone-500">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
              Integración con Ecosistemas de Notas y Academia
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-sans leading-relaxed">
              <strong>Alcance:</strong> Compatibilidad bidireccional con Obsidian mediante <code className="text-xs font-mono">[[wikilinks]]</code>, exportador a formato BibTeX/Zotero para artículos académicos y feeds RSS atómicos por autor.
            </p>
            <div className="mt-3 text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 p-2.5 rounded">
              <strong>KPI de éxito:</strong> 100 artículos interconectados y &gt; 250 citas semánticas registradas.
            </div>
          </div>

          {/* Fase 3 */}
          <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-stone-700 dark:text-stone-300">
                Fase 3 (Meses 7-12) · Ecosistema y Gobernanza
              </span>
              <span className="font-mono text-xs text-stone-500">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
              API Pública de Grafos Epistémicos y Federación
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-sans leading-relaxed">
              <strong>Alcance:</strong> API GraphQL pública para descargar el grafo de argumentación en formato RDF/Neo4j, y paneles de gobernanza abierta gestionados por comités disciplinares por pares.
            </p>
            <div className="mt-3 text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 p-2.5 rounded">
              <strong>KPI de éxito:</strong> Adopción del protocolo en al menos 3 seminarios universitarios de postgrado.
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPLORADOR DE ARTÍCULOS INTERCONECTADOS */}
      <section id="explorador-articulos" aria-labelledby="feed-heading" className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Red de Textos Seminales
            </span>
            <h2 id="feed-heading" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Artículos y Tesis del Protocolo
            </h2>
          </div>
          <span className="font-mono text-xs text-stone-500">
            {articles.length} artículos enlazados
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => {
            const epistemicBadge =
              article.epistemicStatus === 'fact'
                ? { label: 'Hecho Formal / Empírico', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200' }
                : article.epistemicStatus === 'hypothesis'
                ? { label: 'Hipótesis de Trabajo', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200' }
                : { label: 'Ensayo / Opinión', color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200' };

            return (
              <article
                key={article.id}
                className="group p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13151A] hover:border-teal-600/60 dark:hover:border-teal-500/60 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${epistemicBadge.color}`}>
                        {epistemicBadge.label}
                      </span>
                      <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                        {article.currentVersionNumber} · #{article.currentVersionHash.substring(0, 8)}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      {article.publishedDate}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3
                      onClick={() => onOpenArticle(article.id)}
                      className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 cursor-pointer transition-colors"
                    >
                      {article.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                      {article.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer with author and citation count */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-200">
                      {article.author.name}
                    </span>
                    {!article.author.isErased && article.author.githubUser && (
                      <span className="font-mono text-[11px] text-stone-500">
                        @{article.author.githubUser}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      <span>Citado por {article.citedByInbound.length}</span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span>Cita {article.citationsOutbound.length}</span>
                    </div>

                    <button
                      onClick={() => onOpenArticle(article.id)}
                      className="px-3 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 transition-colors"
                    >
                      Leer artículo &rarr;
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
