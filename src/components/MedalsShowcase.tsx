import React, { useState } from 'react';
import {
  RotateCcw,
  Award,
  HelpCircle,
  GitBranch,
  Scale,
  BookOpen,
  ShieldCheck,
  Heart,
  Sparkles,
  Globe,
  Check,
  Lock,
  Pin,
  X,
  ExternalLink,
  Copy,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { EpistemicMedal } from '../types';

interface MedalsShowcaseProps {
  medals: EpistemicMedal[];
  isOwner?: boolean;
  onTogglePin?: (medalId: string) => void;
}

export const MedalIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = 'h-4 w-4' }) => {
  switch (icon) {
    case 'RotateCcw':
      return <RotateCcw className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    default:
      return <Award className={className} />;
  }
};

export const getMedalLevelStyles = (level: EpistemicMedal['level'], unlocked: boolean) => {
  if (!unlocked) {
    return {
      bg: 'bg-[var(--bg-subtle)] opacity-70',
      border: 'border-[var(--border-subtle)] border-dashed',
      text: 'text-[var(--text-tertiary)]',
      badge: 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)] border-[var(--border-subtle)]',
      label: 'Bloqueada',
      glow: '',
    };
  }

  switch (level) {
    case 'laurel':
      return {
        bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
        border: 'border-emerald-500/40 dark:border-emerald-500/30',
        text: 'text-emerald-800 dark:text-emerald-300',
        badge: 'bg-emerald-600 text-white shadow-xs',
        label: 'Laurel de Honor',
        glow: 'ring-1 ring-emerald-500/20',
      };
    case 'gold':
      return {
        bg: 'bg-amber-50/70 dark:bg-amber-950/30',
        border: 'border-amber-500/40 dark:border-amber-500/30',
        text: 'text-amber-800 dark:text-amber-300',
        badge: 'bg-amber-600 text-white shadow-xs',
        label: 'Medalla de Oro',
        glow: 'ring-1 ring-amber-500/20',
      };
    case 'silver':
      return {
        bg: 'bg-indigo-50/70 dark:bg-indigo-950/30',
        border: 'border-indigo-500/40 dark:border-indigo-500/30',
        text: 'text-indigo-800 dark:text-indigo-300',
        badge: 'bg-indigo-600 text-white shadow-xs',
        label: 'Medalla de Plata',
        glow: 'ring-1 ring-indigo-500/20',
      };
    case 'bronze':
      return {
        bg: 'bg-orange-50/70 dark:bg-orange-950/30',
        border: 'border-orange-500/40 dark:border-orange-500/30',
        text: 'text-orange-800 dark:text-orange-300',
        badge: 'bg-orange-700 text-white shadow-xs',
        label: 'Medalla de Bronce',
        glow: 'ring-1 ring-orange-500/20',
      };
  }
};

export const getCategoryLabel = (cat: EpistemicMedal['category']) => {
  switch (cat) {
    case 'epistemology':
      return 'Epistemología';
    case 'rigor':
      return 'Rigor y Pares';
    case 'dialectic':
      return 'Dialéctica';
    case 'open_knowledge':
      return 'Saber Libre';
    case 'verification':
      return 'Identidad';
    case 'community':
      return 'Comunidad AGPL';
  }
};

/**
 * Compact Pill for profile headers / cards
 */
export const MedalHeaderPill: React.FC<{
  medal: EpistemicMedal;
  onClick?: () => void;
}> = ({ medal, onClick }) => {
  const styles = getMedalLevelStyles(medal.level, medal.unlocked);

  return (
    <button
      onClick={onClick}
      title={`${medal.name} · ${styles.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105 shadow-xs ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <MedalIcon icon={medal.icon} className="h-3.5 w-3.5 shrink-0" />
      <span className="font-serif">{medal.shortName}</span>
      {medal.level === 'laurel' && (
        <Award className="h-3 w-3 shrink-0 opacity-80" />
      )}
    </button>
  );
};

export const MedalsShowcase: React.FC<MedalsShowcaseProps> = ({
  medals,
  isOwner = false,
  onTogglePin,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in_progress' | 'epistemology' | 'rigor' | 'open_knowledge'>('all');
  const [selectedMedal, setSelectedMedal] = useState<EpistemicMedal | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredMedals = medals.filter((m) => {
    if (filter === 'unlocked') return m.unlocked;
    if (filter === 'in_progress') return !m.unlocked;
    if (filter === 'epistemology') return m.category === 'epistemology';
    if (filter === 'rigor') return m.category === 'rigor' || m.category === 'dialectic';
    if (filter === 'open_knowledge') return m.category === 'open_knowledge' || m.category === 'community';
    return true;
  });

  const unlockedCount = medals.filter((m) => m.unlocked).length;

  const handleCopyBadgeMarkdown = (medal: EpistemicMedal) => {
    const md = `[![Chen Medal: ${medal.name}](https://img.shields.io/badge/Chen_Epistemic-${encodeURIComponent(
      medal.shortName
    )}-4338ca?style=flat-square&logo=academia)](https://chen-knowledge.org/medals/${medal.id})`;
    navigator.clipboard.writeText(md);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[var(--action-primary)]" />
              <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                Medallero e Insignias Epistémicas
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              En Chen las medallas no premian la popularidad ni el tiempo en pantalla. Reconocen la honestidad intelectual, la revisión de pares rigurosa, la rectificación de errores propios y el aporte al procomún del saber libre bajo licencias CC y AGPL.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-right">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-mono tracking-wider block">
                Distinciones Obtenidas
              </span>
              <span className="font-mono text-xl font-bold text-[var(--action-primary)]">
                {unlockedCount} <span className="text-xs text-[var(--text-tertiary)] font-normal">/ {medals.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-[var(--border-subtle)] text-xs">
          <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            Filtrar:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'all'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Todas ({medals.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'unlocked'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Concedidas ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'in_progress'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            En progreso ({medals.length - unlockedCount})
          </button>
          <button
            onClick={() => setFilter('epistemology')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'epistemology'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Epistemología
          </button>
          <button
            onClick={() => setFilter('rigor')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'rigor'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Rigor y Pares
          </button>
          <button
            onClick={() => setFilter('open_knowledge')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'open_knowledge'
                ? 'bg-[var(--action-primary)] text-white font-medium'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Saber Libre
          </button>
        </div>
      </div>

      {/* Grid of Medals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMedals.map((medal) => {
          const styles = getMedalLevelStyles(medal.level, medal.unlocked);

          return (
            <div
              key={medal.id}
              onClick={() => setSelectedMedal(medal)}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md cursor-pointer ${styles.bg} ${styles.border} ${styles.glow}`}
            >
              <div className="space-y-3">
                {/* Top badge row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        medal.unlocked
                          ? `${styles.border} bg-[var(--bg-surface)] shadow-xs`
                          : 'bg-black/5 dark:bg-white/5 border-dashed border-[var(--border-subtle)]'
                      }`}
                    >
                      <MedalIcon
                        icon={medal.icon}
                        className={`h-5 w-5 ${medal.unlocked ? styles.text : 'text-[var(--text-tertiary)]'}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                          {getCategoryLabel(medal.category)}
                        </span>
                        <span
                          className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${styles.badge}`}
                        >
                          {styles.label}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)]">
                        {medal.name}
                      </h3>
                    </div>
                  </div>

                  {/* Pin action for owner */}
                  {isOwner && medal.unlocked && onTogglePin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(medal.id);
                      }}
                      title={medal.featured ? 'Desfijar de la cabecera del perfil' : 'Fijar en cabecera del perfil'}
                      className={`p-1.5 rounded transition-colors ${
                        medal.featured
                          ? 'bg-[var(--action-primary)] text-white shadow-xs'
                          : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Pin className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-serif">
                  {medal.description}
                </p>

                {/* Progress bar if locked, or evidence if unlocked */}
                {medal.unlocked ? (
                  <div className="rounded p-2.5 bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] font-mono">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Concedida oficialmente
                      </span>
                      {medal.earnedDate && <span>{medal.earnedDate}</span>}
                    </div>
                    {medal.evidenceText && (
                      <p className="text-xs text-[var(--text-secondary)] font-medium">
                        "{medal.evidenceText}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded p-2.5 bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)] text-[11px] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] font-mono">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Requisito de concesión
                      </span>
                      {medal.progressTarget && (
                        <span>
                          {medal.progressCurrent || 0} / {medal.progressTarget}
                        </span>
                      )}
                    </div>
                    {medal.progressTarget && (
                      <div className="w-full bg-[var(--bg-subtle)] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[var(--action-primary)] h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((medal.progressCurrent || 0) / medal.progressTarget) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      {medal.criteria}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                <span className="font-mono text-[10px]">
                  {medal.unlocked && medal.verificationHash
                    ? medal.verificationHash.slice(0, 16) + '...'
                    : 'Auditable en registro público'}
                </span>
                <span className="text-[var(--action-primary)] font-medium flex items-center gap-0.5 hover:underline">
                  <span>Ver detalles</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal with Full Verifiable Details */}
      {selectedMedal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedMedal(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMedal(null)}
              className="absolute top-4 right-4 p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Emblem Header */}
            <div className="flex items-start gap-4">
              <div
                className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 border ${
                  getMedalLevelStyles(selectedMedal.level, selectedMedal.unlocked).border
                } ${getMedalLevelStyles(selectedMedal.level, selectedMedal.unlocked).bg}`}
              >
                <MedalIcon
                  icon={selectedMedal.icon}
                  className={`h-7 w-7 ${
                    getMedalLevelStyles(selectedMedal.level, selectedMedal.unlocked).text
                  }`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] uppercase text-[var(--text-tertiary)]">
                    {getCategoryLabel(selectedMedal.category)}
                  </span>
                  <span
                    className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      getMedalLevelStyles(selectedMedal.level, selectedMedal.unlocked).badge
                    }`}
                  >
                    {getMedalLevelStyles(selectedMedal.level, selectedMedal.unlocked).label}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                  {selectedMedal.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {selectedMedal.unlocked ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      Concedida el {selectedMedal.earnedDate || 'Fase 1'}
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 font-medium">
                      Insignia en proceso de consecución
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Body Description */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Descripción del Reconocimiento:
                </span>
                <p className="text-[var(--text-secondary)] font-serif leading-relaxed">
                  {selectedMedal.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Criterio Epistémico Oficial:
                </span>
                <p className="text-[var(--text-secondary)]">
                  {selectedMedal.criteria}
                </p>
              </div>

              {selectedMedal.evidenceText && (
                <div className="rounded p-3 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                    Evidencia Verificada en Chen:
                  </span>
                  <p className="font-serif italic text-[var(--text-primary)]">
                    "{selectedMedal.evidenceText}"
                  </p>
                </div>
              )}

              {/* Cryptographic Hash */}
              <div className="rounded p-2.5 bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] font-mono text-[10px] space-y-1">
                <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                  <span>Registro Inmutable AGPL</span>
                  <span>v1.0</span>
                </div>
                <div className="text-[var(--text-secondary)] break-all">
                  {selectedMedal.verificationHash || 'SHA256:4b9f0102a34491cba0998319f0...chen'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
              <button
                type="button"
                onClick={() => handleCopyBadgeMarkdown(selectedMedal)}
                className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
                title="Copiar código Markdown para GitHub README o web personal"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar insignia Markdown (GitHub/Web)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedMedal(null)}
                className="px-4 py-1.5 rounded bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
