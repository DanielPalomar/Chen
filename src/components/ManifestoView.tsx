import React, { useState } from 'react';
import { Author, Article, ModerationAuditLog } from '../types';

interface ManifestoViewProps {
  authors: Author[];
  articles: Article[];
  auditLogs: ModerationAuditLog[];
  onSimulateErasure: (authorId: string) => void;
  onResetAllData: () => void;
  onNavigateToArticle: (articleId: string) => void;
}

export const ManifestoView: React.FC<ManifestoViewProps> = ({
  authors,
  articles,
  auditLogs,
  onSimulateErasure,
  onResetAllData,
  onNavigateToArticle,
}) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(authors[0]?.id || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [erasureFeedback, setErasureFeedback] = useState<string | null>(null);

  const selectedAuthor = authors.find((a) => a.id === selectedAuthorId) || authors[0];
  const authoredArticles = articles.filter((art) => art.author.id === selectedAuthor?.id);

  const handleExecuteErasure = () => {
    if (!selectedAuthor) return;
    onSimulateErasure(selectedAuthor.id);
    setErasureFeedback(
      `¡Simulación de Borrado RGPD Art. 17 completada! La PII ha sido anonimizada a 'Autor Retirado [Anonimizado] (${selectedAuthor.anonIdentifier || 'anon-hash'})'. Se comprueba que sus ${authoredArticles.length} artículos, sus hashes SHA-256 y todas las citas cruzadas hacia sus textos permanecen 100% intactas.`
    );
    setTimeout(() => setErasureFeedback(null), 8000);
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

-- 2. TABLA USERS (Con disociación y anonimización RGPD Art. 17)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anon_identifier VARCHAR(64) UNIQUE NOT NULL, -- ej. 'anon-8f3a9c21'
    real_name VARCHAR(255),                      -- Nullable al ejecutar RGPD Art. 17
    email VARCHAR(255) UNIQUE,                  -- Nullable al ejecutar RGPD Art. 17
    github_handle VARCHAR(100),                 -- Nullable al ejecutar RGPD Art. 17
    orcid_id VARCHAR(50),                       -- Nullable al ejecutar RGPD Art. 17
    is_erased BOOLEAN NOT NULL DEFAULT FALSE,
    erased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA ARTICLES (Contenedor maestro de la obra)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    license open_license_t NOT NULL DEFAULT 'CC BY-SA 4.0',
    original_author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    current_version_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA ARTICLE_VERSIONS (Inmutabilidad por hash criptográfico SHA-256)
CREATE TABLE article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    version_number VARCHAR(20) NOT NULL,        -- 'v1.0', 'v1.1'
    content_hash_sha256 CHAR(64) NOT NULL,     -- Hash SHA-256 del texto
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
    epistemic_reasoning TEXT NOT NULL,          -- 1-2 frases justificando la postura
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_anchor_length CHECK (LENGTH(target_anchor_text) BETWEEN 20 AND 1000)
);

-- 6. TABLA MODERATION_AUDIT_LOGS (Auditoría Pública Cero PII)
CREATE TABLE moderation_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_hash CHAR(32) UNIQUE NOT NULL,
    reporter_anon_hash CHAR(32) NOT NULL,
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
      {/* Encabezado General */}
      <header className="space-y-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          <span>Manifiesto · Posicionamiento Estratégico · RGPD</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          Manifiesto, Arquitectura y Privacidad por Diseño
        </h1>
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-sans max-w-3xl">
          Chen no es una red social de vanidad ni un blog aislado. Es un protocolo abierto diseñado para devolver el rigor, la trazabilidad deductiva y la soberanía de datos a la conversación intelectual en internet.
        </p>
      </header>

      {/* 1. TABLA COMPARATIVA ESTRATÉGICA */}
      <section aria-labelledby="strategic-table-heading" className="space-y-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Propuesta de Valor Clara
          </span>
          <h2 id="strategic-table-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            1. Tabla Comparativa Estratégica
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
            Por qué publicar en Chen frente a mantener un blog personal en Substack/Ghost o subir notas en un repositorio de GitHub.
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
                  Plataforma Chen (Protocolo Abierto)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Descubrimiento y Red</td>
                <td className="p-3.5 sm:p-4">Aislado. Depende 100% de que el autor traiga audiencia propia de redes sociales.</td>
                <td className="p-3.5 sm:p-4">Diseñado para código fuente ejecutable; los ensayos en Markdown quedan enterrados.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Grafo de citas cruzadas. Quien busca el tema encuentra tu réplica vinculada directamente a la tesis central.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Mecánica de Debate</td>
                <td className="p-3.5 sm:p-4">Comentarios caóticos lineales, descalificaciones y cámaras de eco.</td>
                <td className="p-3.5 sm:p-4">Issues y PRs para bugs de código, no para argumentación deductiva.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Citas con función lógica: <span className="font-mono text-emerald-700 dark:text-emerald-400">[ + Apoya ]</span>, <span className="font-mono text-rose-700 dark:text-rose-400">[ - Contradice ]</span>, <span className="font-mono text-teal-700 dark:text-teal-400">[ → Amplía ]</span> con justificación obligatoria.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Portafolio Profesional</td>
                <td className="p-3.5 sm:p-4">Métricas de vanidad: seguidores, clics y newsletters de pago.</td>
                <td className="p-3.5 sm:p-4">Commits técnicos de código, pero sin trazabilidad del pensamiento ensayístico.</td>
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

      {/* 2. HOJA DE RUTA REALISTA (FASES 1 A 3 A 0 €) */}
      <section aria-labelledby="roadmap-heading" className="space-y-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Desarrollo Sostenible
          </span>
          <h2 id="roadmap-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            2. Hoja de Ruta Realista (Fases 1 a 3 a 0 €)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
            Planificación basada en el principio de Pareto (80/20) para validar tracción real antes de introducir sobrecargas.
          </p>
        </div>

        <div className="space-y-4">
          {/* Fase 1 */}
          <div className="p-5 rounded-lg border-2 border-teal-700 bg-white dark:bg-stone-900 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-teal-800 dark:text-teal-300">
                Fase 1 (Meses 1-2) · EN EJECUCIÓN (MVP Nuclear)
              </span>
              <span className="font-mono text-xs text-stone-500 font-bold">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
              Validación de la Hipótesis Central de Citación Cruzada
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-sans leading-relaxed">
              <strong>Alcance:</strong> Editor Markdown puro, anclaje de citas funcionales (<code className="text-xs font-mono">[ + Apoya ]</code>, <code className="text-xs font-mono">[ - Contradice ]</code>, <code className="text-xs font-mono">[ → Amplía ]</code>), versiones inmutables SHA-256 y cumplimiento estricto del RGPD Art. 17.
            </p>
            <div className="mt-3 text-xs font-mono text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded border border-teal-200 dark:border-teal-900">
              <strong>KPI de éxito:</strong> 15 artículos técnicos publicados por autores ajenos al equipo fundador con Tasa de Citación Externa (ECR) &gt; 40%.
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

      {/* 3. DEMOSTRADOR INTERACTIVO RGPD VS. INMUTABILIDAD DEL GRAFO */}
      <section
        aria-labelledby="gdpr-demo-heading"
        className="p-6 sm:p-8 rounded-xl border-2 border-teal-600/70 bg-stone-50 dark:bg-[#13151A] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Privacidad por Diseño · RGPD Art. 17
            </span>
            <h2 id="gdpr-demo-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              3. Demostrador Interactivo RGPD vs. Inmutabilidad del Grafo
            </h2>
          </div>
          <button
            onClick={onResetAllData}
            className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
          >
            Restaurar datos de demostración
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
          <strong>El dilema legal resuelto:</strong> La licencia Creative Commons (CC BY-SA 4.0) es legalmente irrevocable sobre la obra intelectual, pero los datos personales (PII: nombre, correo, usuario de GitHub, ORCID) pertenecen a la persona física y deben poder suprimirse conforme al Art. 17 del RGPD. Chen los anonimiza sustituyéndolos por el formato ciego <code>Autor Retirado [Anonimizado] (anon-hash...)</code>.
        </p>

        {erasureFeedback && (
          <div role="status" className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 font-sans leading-relaxed shadow-2xs">
            {erasureFeedback}
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
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-stone-100 cursor-pointer"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.isErased ? a.name : `${a.name} (@${a.handle})`}
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
                : 'Simular Borrado RGPD de un Autor'}
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
                        className="text-teal-700 dark:text-teal-400 font-mono text-[11px] underline hover:text-teal-900 cursor-pointer"
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

      {/* 4. MODELO DE BASE DE DATOS RELACIONAL (POSTGRESQL) */}
      <section aria-labelledby="sql-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              Arquitectura de Persistencia
            </span>
            <h2 id="sql-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              4. Modelo Relacional de 5 Tablas (PostgreSQL)
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

      {/* 5. REGISTRO PÚBLICO Y TRANSPARENTE DE MODERACIÓN */}
      <section aria-labelledby="mod-logs-heading" className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
            Gobernanza Abierta
          </span>
          <h2 id="mod-logs-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            5. Registro Público y Transparente de Moderación
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
          En Chen cada incidente genera un registro auditable con hashes salteados, protegiendo tanto la identidad de quien reporta como la del autor sancionado, mientras se hace público el criterio de resolución.
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
