import React from 'react';
import {
  ScrollText,
  ShieldCheck,
  Compass,
  ArrowRight,
  Code2,
  Lock,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

interface ManifestoViewProps {
  onNavigateHome: () => void;
  onNavigateGaps: () => void;
}

export const ManifestoView: React.FC<ManifestoViewProps> = ({
  onNavigateHome,
  onNavigateGaps,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Manifesto Title */}
      <section className="border-b border-[var(--border-subtle)] pb-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
          <ScrollText className="h-4 w-4" />
          <span>Documento Fundacional · Octubre 2026 · Versión 0.9</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Manifiesto de Chen
        </h1>
        <p className="font-serif text-lg text-[var(--text-secondary)] leading-relaxed">
          «Conocimiento libre, debatido con argumentos, no con likes.»
        </p>
      </section>

      {/* Introduction */}
      <section className="prose-reading space-y-4">
        <p>
          Chen es una comunidad abierta de estudiantes, profesores, autodidactas e investigadores curiosos. Creemos que el conocimiento debe ser libre y que se aprende mejor debatiendo con argumentos que acumulando likes.
        </p>
        <p>
          Somos un proyecto sin ánimo de lucro, de código abierto (AGPLv3), que arranca a coste cero, con gobernanza compartida y protegido por este manifiesto para que la misión no pueda comprarse ni desviarse.
        </p>
        <blockquote>
          En una frase: una red de conocimiento donde las ideas se conectan por citas y evidencia, no por popularidad, y donde publicar es construir un portafolio público que cualquiera puede verificar.
        </blockquote>
      </section>

      {/* The 3 Mandarin meanings of Chen (calm, respectful, zero caricature) */}
      <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Por qué «Chen»
        </h2>
        <p className="font-serif text-sm text-[var(--text-secondary)] leading-relaxed">
          En mandarín, <em>chén</em> es el sonido de varias palabras, y tres de ellas resumen con precisión nuestra aspiración:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
            <span className="font-serif text-2xl font-bold text-[var(--accent-teal-dark)] dark:text-[var(--accent-teal)]">
              晨
            </span>
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
              chén · Amanecer
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              El conocimiento sale para todos, como la luz de la mañana. Sin muros de pago ni barreras artificiales.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
            <span className="font-serif text-2xl font-bold text-[var(--action-primary)]">
              陈
            </span>
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
              chén · Exponer
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Explicas tus ideas y las pones a la vista pública para que se revisen con rigor y respeto.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
            <span className="font-serif text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              沉
            </span>
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
              chén · Profundizar
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Pensar a fondo, sin prisa, sin algoritmos de dopamina y sin adicción a los aplausos superficiales.
            </p>
          </div>
        </div>
      </section>

      {/* Five Non-Negotiable Principles */}
      <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Cinco principios no negociables
        </h2>

        <div className="space-y-4 text-xs">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-sm">
              <span className="font-mono text-[var(--action-primary)]">1.</span>
              <span>Conocimiento libre</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
              Cada autor conserva su autoría y elige una licencia abierta de una lista cerrada (CC BY, CC BY-SA, CC0). El código de Chen es AGPLv3.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-sm">
              <span className="font-mono text-[var(--action-primary)]">2.</span>
              <span>Argumentos, no popularidad</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
              Nada se ordena ni se promociona por likes, seguidores o engagement. Se ordena por relevancia temática, fecha o evidencia demostrada.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-sm">
              <span className="font-mono text-[var(--action-primary)]">3.</span>
              <span>Dinero fuera de la plataforma</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
              Sin anuncios invasivos, patrocinios opacos, pasarelas de pago ni comisiones sobre autores. El dinero nunca compra reputación ni privilegios.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-sm">
              <span className="font-mono text-[var(--action-primary)]">4.</span>
              <span>Transparencia absoluta</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
              La moderación, los cambios de opinión, las correcciones y el uso de inteligencia artificial son públicos y están explícitamente etiquetados.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-sm">
              <span className="font-mono text-[var(--action-primary)]">5.</span>
              <span>Gobernanza compartida para que dure</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-5">
              Co-mantenedores, estatutos abiertos y manifiesto: el proyecto no puede depender del capricho ni de la supervivencia de una sola persona.
            </p>
          </div>
        </div>
      </section>

      {/* Four Phase Roadmap */}
      <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Hoja de ruta por fases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">
              Fase 1 (0 €) · Activa
            </span>
            <h4 className="font-semibold text-[var(--text-primary)]">Lo básico</h4>
            <p className="text-[var(--text-tertiary)] leading-normal">
              Cuentas, artículos en Markdown + KaTeX, citas funcionales, vídeo con capítulos, búsqueda neutral y huecos del saber.
            </p>
          </div>

          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <span className="font-mono font-semibold text-[var(--text-secondary)]">
              Fase 2 (0 €)
            </span>
            <h4 className="font-semibold text-[var(--text-primary)]">Debate y estudio</h4>
            <p className="text-[var(--text-tertiary)] leading-normal">
              Highlight & Discuss sobre frases, Tesis/Antítesis, práctica privada y marca de «Cambié de opinión».
            </p>
          </div>

          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <span className="font-mono font-semibold text-[var(--text-secondary)]">
              Fase 3 (0 €)
            </span>
            <h4 className="font-semibold text-[var(--text-primary)]">Extras complejos</h4>
            <p className="text-[var(--text-tertiary)] leading-normal">
              Revisión por pares abierta, mapas de conocimiento, libros colaborativos y sincronización con Obsidian.
            </p>
          </div>

          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1">
            <span className="font-mono font-semibold text-[var(--text-secondary)]">
              Fase 4 (De pago)
            </span>
            <h4 className="font-semibold text-[var(--text-primary)]">Con financiación</h4>
            <p className="text-[var(--text-tertiary)] leading-normal">
              Alojamiento propio de vídeo, traducción automática, servidores VPS ampliados y audio TTS de artículos.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation CTA */}
      <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]"
        >
          <span>Ir al explorador de artículos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onNavigateGaps}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
        >
          <span>Explorar Huecos del Saber</span>
        </button>
      </div>
    </div>
  );
};
