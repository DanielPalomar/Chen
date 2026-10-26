import React from 'react';
import { ShieldCheck, Heart, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppLanguage, t } from '../i18n/translations';

interface SustainabilityViewProps {
  language: AppLanguage;
  onNavigateHome: () => void;
  onNavigateManifesto: () => void;
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({
  language,
  onNavigateHome,
  onNavigateManifesto,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
            Transparencia Financiera
          </span>
          <span className="text-[var(--text-tertiary)]">·</span>
          <span className="text-xs text-[var(--text-tertiary)]">Fase 1 a 3: Coste 0 €</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Sostenibilidad y Cuentas Públicas
        </h1>
        <p className="font-serif text-base text-[var(--text-secondary)] leading-relaxed">
          {t('sustainabilityPledge', language)} En Chen el dinero nunca compra visibilidad, privilegios de moderación ni reputación intelectual.
        </p>
      </div>

      {/* 3 Core Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2">
          <div className="h-7 w-7 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Cero Publicidad
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Sin anuncios comerciales, sin banners de patrocinadores ni acuerdos de afiliados. La atención del lector está protegida.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2">
          <div className="h-7 w-7 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Sin Inversores Privados
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Sin rondas de capital de riesgo que exijan métricas de adicción, retención forzada ni mercantilización de los datos.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2">
          <div className="h-7 w-7 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Costes Públicos y Claros
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Cada euro recaudado por donaciones voluntarias se reporta públicamente con facturas y balances abiertos mes a mes.
          </p>
        </div>
      </div>

      {/* Roadmap Financial Breakdown */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6">
        <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
          Plan de sostenibilidad por fases (Manifiesto v0.9)
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">
                  Fase 1 a 3: Arranque a coste cero
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  Activa (0 € / mes)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Alojamientos en capas gratuitas portables, vídeos embebidos (sin coste de streaming) y trabajo voluntario de los co-mantenedores.
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--text-primary)] shrink-0">
              0,00 €
            </span>
          </div>

          <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">
                  Fase de escalado: Servidor VPS dedicado y copias de seguridad
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[var(--bg-subtle)] text-[var(--text-tertiary)] font-medium">
                  Objetivo futuro
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Si la comunidad crece y excede las cuotas gratuitas, se activará una meta pública y voluntaria de microdonaciones transparentes (estimada en ~20 €/mes).
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--text-secondary)] shrink-0">
              ~20,00 € / mes
            </span>
          </div>

          <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">
                  Fase 4: Servicios con coste real (Vídeo propio, IA declarada, TTS)
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[var(--bg-subtle)] text-[var(--text-tertiary)] font-medium">
                  Solo con financiación cubierta
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Funcionalidades que consumen ancho de banda intensivo o APIs de terceros solo se implementarán cuando una subvención pública o fondo comunitario garantice su viabilidad durante varios meses seguidos.
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--text-tertiary)] shrink-0">
              Bajo demanda
            </span>
          </div>
        </div>
      </div>

      {/* External Support to Authors */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-3">
        <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <span>Apoyo directo a autores: siempre fuera de Chen</span>
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Los lectores que deseen agradecer el trabajo de un docente o investigador pueden hacerlo a través de los enlaces directos a sus perfiles externos (Liberapay, Ko-fi o PayPal). Chen no cobra ninguna comisión ni porcentaje, y recibir donaciones externas no otorga ninguna ventaja de posicionamiento ni medallas en la plataforma.
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={onNavigateHome}
          className="text-xs text-[var(--action-primary)] hover:underline"
        >
          ← Volver a la portada
        </button>
        <button
          onClick={onNavigateManifesto}
          className="text-xs text-[var(--action-primary)] hover:underline flex items-center gap-1"
        >
          <span>Leer Manifiesto de Chen</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
