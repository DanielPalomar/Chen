import React, { useState } from 'react';
import { Author, Article, ModerationAuditLog } from '../types';

interface GdprArchitecturePanelProps {
  authors: Author[];
  articles: Article[];
  auditLogs: ModerationAuditLog[];
  onSimulateErasure: (authorId: string) => void;
  onResetAllData: () => void;
  onNavigateToArticle: (articleId: string) => void;
}

export const GdprArchitecturePanel: React.FC<GdprArchitecturePanelProps> = ({
  authors,
  articles,
  auditLogs,
  onSimulateErasure,
  onResetAllData,
  onNavigateToArticle,
}) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(authors[1]?.id || authors[0]?.id || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [erasureMessage, setErasureMessage] = useState<string | null>(null);

  const selectedAuthor = authors.find((a) => a.id === selectedAuthorId) || authors[0];
  const authoredArticles = articles.filter((art) => art.author.id === selectedAuthor?.id);

  const handleExecuteErasure = () => {
    if (!selectedAuthor) return;
    onSimulateErasure(selectedAuthor.id);
    setErasureMessage(
      `¡Derecho al olvido ejecutado con éxito! Los datos personales de ${selectedAuthor.name} han sido anonimizados a '${selectedAuthor.anonIdentifier || 'anon-hash'}'. Sus ${authoredArticles.length} artículos y todas las citas cruzadas siguen 100% intactas.`
    );
    setTimeout(() => setErasureMessage(null), 8000);
  };

  const sqlSchemaCode = `-- ============================================================================
-- ESQUEMA RELACIONAL CHEN v1.0 (PostgreSQL 15+)
-- Arquitectura de Inmutabilidad por Versión, RGPD Art. 17 y Logs Auditables
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS ESTRICTOS
CREATE TYPE epistemic_status_t AS ENUM ('fact', 'hypothesis', 'opinion');
CREATE TYPE citation_relation_t AS ENUM ('supports', 'contradicts', 'extends');
CREATE TYPE open_license_t AS ENUM ('CC BY 4.0', 'CC BY-SA 4.0', 'CC0 1.0');
CREATE TYPE moderation_action_t AS ENUM ('version_unlisted', 'metadata_redacted', 'dismissed');

-- 2. TABLA USERS (Con disociación RGPD Art. 17)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anon_identifier VARCHAR(64) UNIQUE NOT NULL, -- ej. 'anon-8f3a9c7b' generado por SHA-256
    real_name VARCHAR(255),                      -- Nullable al ejecutar RGPD Art. 17
    email VARCHAR(255) UNIQUE,                  -- Nullable al ejecutar RGPD Art. 17
    github_handle VARCHAR(100),                 -- Nullable al ejecutar RGPD Art. 17
    orcid_id VARCHAR(50),                       -- Nullable al ejecutar RGPD Art. 17
    is_erased BOOLEAN NOT NULL DEFAULT FALSE,
    erased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA ARTICLES (Contenedor de alto nivel)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    license open_license_t NOT NULL DEFAULT 'CC BY-SA 4.0',
    original_author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    current_version_id UUID, -- Referencia circular resuelta tras insertar primera versión
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA ARTICLE_VERSIONS (Inmutabilidad por hash SHA-256)
CREATE TABLE article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    version_number VARCHAR(20) NOT NULL,        -- ej. 'v1.0', 'v1.1'
    content_hash_sha256 CHAR(64) NOT NULL,     -- Hash inalterable del texto + frontmatter
    title VARCHAR(300) NOT NULL,
    subtitle VARCHAR(500),
    epistemic_status epistemic_status_t NOT NULL DEFAULT 'hypothesis',
    epistemic_falsification_note TEXT,
    markdown_body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_article_version UNIQUE (article_id, version_number)
);

ALTER TABLE articles 
    ADD CONSTRAINT fk_current_version 
    FOREIGN KEY (current_version_id) 
    REFERENCES article_versions(id) DEFERRABLE INITIALLY DEFERRED;

-- 5. TABLA CITATIONS (Grafo Bidireccional de Argumentación Granular)
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_version_id UUID NOT NULL REFERENCES article_versions(id) ON DELETE RESTRICT,
    target_version_id UUID NOT NULL REFERENCES article_versions(id) ON DELETE RESTRICT,
    target_anchor_text TEXT NOT NULL,           -- Fragmento citado exacto (20 a 400 car.)
    relation_type citation_relation_t NOT NULL, -- 'supports' | 'contradicts' | 'extends'
    epistemic_reasoning TEXT NOT NULL,          -- 1-2 oraciones justificando la postura
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_anchor_length CHECK (LENGTH(target_anchor_text) BETWEEN 20 AND 1000)
);

-- 6. TABLA MODERATION_AUDIT_LOGS (Auditoría Pública Cero PII)
CREATE TABLE moderation_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_hash CHAR(32) UNIQUE NOT NULL,     -- ej. 'inc-9f8a32bc71'
    reporter_anon_hash CHAR(32) NOT NULL,       -- Hash salteado no invertible del denunciante
    target_article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    target_version_id UUID NOT NULL REFERENCES article_versions(id) ON DELETE CASCADE,
    violation_type VARCHAR(50) NOT NULL,
    action_taken moderation_action_t NOT NULL,
    moderator_role VARCHAR(100) NOT NULL,
    public_rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de alto rendimiento para navegación bidireccional
CREATE INDEX idx_citations_target ON citations(target_version_id);
CREATE INDEX idx_citations_source ON citations(source_version_id);
CREATE INDEX idx_versions_content_hash ON article_versions(content_hash_sha256);
CREATE INDEX idx_users_anon_identifier ON users(anon_identifier);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-16">
      {/* 1. HEADER Y JUSTIFICACIÓN ARQUITECTÓNICA */}
      <section className="space-y-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          <span>Privacidad por Diseño · RGPD Art. 17 · DSA Europeo</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          Inmutabilidad de Versión vs Derecho al Olvido (RGPD)
        </h1>
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-sans max-w-3xl">
          El conflicto central en las plataformas académicas abiertas es la aparente incompatibilidad entre la <strong>irrevocabilidad de las licencias Creative Commons</strong> (necesarias para que los debates no pierdan sentido) y el <strong>derecho a la supresión de datos del RGPD</strong> si un usuario decide darse de baja.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs font-sans">
          <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              1. Principio de Obra Intelectual (CC BY-SA 4.0)
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              La licencia Creative Commons es irrevocable una vez concedida. El texto del artículo y su hash SHA-256 no pueden eliminarse arbitrariamente porque romperían las réplicas y deducciones formuladas por otros investigadores.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              2. Derecho al Olvido (RGPD Art. 17)
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Los datos personales (PII: nombre civil, correo, usuario de GitHub, ORCID) pertenecen a la persona física y deben ser suprimidos previa solicitud. Chen los disocia mediante un identificador criptográfico ciego <code className="font-mono">anon-[hash]</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DEMOSTRADOR INTERACTIVO DE BORRADO RGPD */}
      <section
        aria-labelledby="simulation-heading"
        className="p-6 sm:p-8 rounded-xl border-2 border-teal-600/70 bg-stone-50 dark:bg-[#13151A] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Simulador Interactivo en Vivo
            </span>
            <h2 id="simulation-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Prueba de Disociación RGPD sin Romper Citas
            </h2>
          </div>
          <button
            onClick={onResetAllData}
            className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
          >
            Restaurar datos iniciales
          </button>
        </div>

        {erasureMessage && (
          <div role="status" className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-sans leading-relaxed">
            {erasureMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Seleccionar Autor para la Prueba:
            </label>
            <select
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-stone-100"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.isErased ? `[YA ANONIMIZADO] ${a.name}` : `${a.name} (@${a.handle})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecuteErasure}
              disabled={selectedAuthor?.isErased}
              className={`w-full py-2.5 px-4 rounded-md font-mono text-xs font-bold transition-all ${
                selectedAuthor?.isErased
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs cursor-pointer'
              }`}
            >
              {selectedAuthor?.isErased
                ? 'Autor Ya Anonimizado bajo RGPD'
                : `Simular Borrado RGPD de ${selectedAuthor?.name}`}
            </button>
          </div>
        </div>

        {/* Inspección en Vivo del Estado del Autor y Artículos */}
        {selectedAuthor && (
          <div className="p-5 rounded-lg bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 space-y-4 text-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="font-mono text-[11px] text-stone-400">Estado de Identidad:</span>
                <div className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedAuthor.name}
                </div>
              </div>
              <span
                className={`font-mono text-xs px-2.5 py-1 rounded font-bold uppercase ${
                  selectedAuthor.isErased
                    ? 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                }`}
              >
                {selectedAuthor.isErased ? 'Anonimizado (PII Suprimida)' : 'Activo (Identidad Verificada)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-stone-400 block">Email:</span>
                <span className="text-stone-800 dark:text-stone-200">{selectedAuthor.email}</span>
              </div>
              <div>
                <span className="text-stone-400 block">GitHub:</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {selectedAuthor.githubUser ? `@${selectedAuthor.githubUser}` : 'Redactado [RGPD]'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">ORCID:</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {selectedAuthor.orcidId || 'Redactado [RGPD]'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Identificador Ciego:</span>
                <span className="text-teal-700 dark:text-teal-400 font-bold">
                  {selectedAuthor.anonIdentifier || 'N/A (Activo)'}
                </span>
              </div>
            </div>

            {/* Artículos asociados y comprobación del grafo */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="font-mono text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
                Comprobación de Integridad de Enlaces ({authoredArticles.length} artículos del autor):
              </span>
              {authoredArticles.length === 0 ? (
                <p className="text-stone-500 italic">Este autor no tiene artículos publicados en el seed.</p>
              ) : (
                <div className="space-y-2">
                  {authoredArticles.map((art) => (
                    <div
                      key={art.id}
                      className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-serif font-semibold text-stone-900 dark:text-stone-100">
                          {art.title}
                        </div>
                        <div className="font-mono text-[10px] text-stone-500 mt-0.5">
                          Hash SHA-256 inalterado: #{art.currentVersionHash.substring(0, 16)}... · Citado por {art.citedByInbound.length} réplicas
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigateToArticle(art.id)}
                        className="text-teal-700 dark:text-teal-400 font-mono text-[11px] underline hover:text-teal-900"
                      >
                        Ver en el lector &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3. MODELO DE BASE DE DATOS RELACIONAL (PostgreSQL) */}
      <section aria-labelledby="sql-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Arquitectura de Persistencia
            </span>
            <h2 id="sql-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Modelo Relacional de 5 Tablas (PostgreSQL)
            </h2>
          </div>
          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>{copiedSql ? '¡Código Copiado!' : 'Copiar Modelo SQL'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
          Diseño DDL con claves foráneas, restricciones de longitud para anclas de texto, enumeraciones y disociación de PII para compatibilidad con Cloud SQL, PostgreSQL o Supabase.
        </p>

        <div className="relative rounded-lg border border-stone-300 dark:border-stone-800 bg-[#0B0C10] p-4 text-xs font-mono text-stone-200 overflow-x-auto max-h-[460px] shadow-inner">
          <pre>{sqlSchemaCode}</pre>
        </div>
      </section>

      {/* 4. LOGS DE MODERACIÓN TRANSPARENTE (AUDITORÍA PÚBLICA CERO PII) */}
      <section aria-labelledby="mod-logs-heading" className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Gobernanza Abierta
          </span>
          <h2 id="mod-logs-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Registro Público y Transparente de Moderación
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
          En Chen la moderación no es un agujero negro opaco. Cada incidente genera un registro auditable con hashes salteados, protegiendo tanto la identidad de quien reporta como la del autor sancionado, mientras se hace público el criterio de resolución.
        </p>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13151A] text-xs space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Incidente: #{log.incidentHash}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500">Denunciante: {log.reporterAnonHash}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold uppercase">
                  Acción: {log.actionTaken}
                </span>
              </div>

              <div className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100">
                Artículo: {log.targetArticleTitle}
              </div>

              <p className="font-sans text-stone-700 dark:text-stone-300 leading-relaxed">
                <strong>Resolución del {log.moderatorRole}:</strong> {log.publicRationale}
              </p>

              <div className="text-[11px] font-mono text-stone-400 pt-1">
                Fecha del dictamen: {log.date} · Hash de versión evaluada: #{log.targetVersionHash.substring(0, 12)}...
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
