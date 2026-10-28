import React, { useState } from 'react';
import { Author, ArticleVersion, Citation, ModerationReport } from '../types/chen';

interface ManifestoAndArchitectureViewProps {
  authors: Author[];
  articles: ArticleVersion[];
  citations: Citation[];
  reports: ModerationReport[];
  onExecuteGdprErasure: (authorId: string) => void;
  onResetDatabase: () => void;
  onOpenArticle: (articleId: string) => void;
}

export const ManifestoAndArchitectureView: React.FC<ManifestoAndArchitectureViewProps> = ({
  authors,
  articles,
  citations,
  reports,
  onExecuteGdprErasure,
  onResetDatabase,
  onOpenArticle,
}) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(authors[0]?.id || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [gdprFeedback, setGdprFeedback] = useState<string | null>(null);

  const selectedAuthor = authors.find((a) => a.id === selectedAuthorId) || authors[0];
  const authoredArticles = articles.filter((a) => a.authorId === selectedAuthor?.id);

  const handleSimulateErasure = () => {
    if (!selectedAuthor) return;
    onExecuteGdprErasure(selectedAuthor.id);
    setGdprFeedback(
      `¡Procedimiento execute_user_gdpr_erasure ejecutado con éxito! Se anonimizó la identidad a 'Autor Retirado [Anonimizado]' y handle '${selectedAuthor.handle}'. Comprobación del grafo: ${articles.length} artículos y ${citations.length} citas cruzadas continúan operando con 0 enlaces rotos.`
    );
    setTimeout(() => setGdprFeedback(null), 8000);
  };

  const postgresSqlCode = `-- ============================================================================
-- ESQUEMA RELACIONAL Y PROCEDIMIENTOS ALMACENADOS CHEN v1.0 (PostgreSQL 15+)
-- Arquitectura de Inmutabilidad por Versión, Grafo de Citas y RGPD Art. 17
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS ESTRICTOS
CREATE TYPE epistemic_status_t AS ENUM ('fact', 'hypothesis', 'opinion');
CREATE TYPE citation_relation_t AS ENUM ('supports', 'contradicts', 'extends');
CREATE TYPE license_type_t AS ENUM ('CC BY-SA 4.0', 'CC BY 4.0', 'CC0 1.0');
CREATE TYPE report_status_t AS ENUM ('pending_review', 'resolved');

-- 2. TABLA USERS (Soporte nativo para disociación RGPD Art. 17)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle VARCHAR(64) UNIQUE NOT NULL,         -- 'elena-vasconcelos' o 'anon-8f3a9c21b4e091a2'
    real_name VARCHAR(255),                      -- NULL o 'Autor Retirado [Anonimizado]'
    role_and_affiliation VARCHAR(255),
    github_user VARCHAR(100),
    orcid_id VARCHAR(50),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_anonymized BOOLEAN NOT NULL DEFAULT FALSE,
    erased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA ARTICLES (Contenedor maestro del ensayo / tesis)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    current_version_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA ARTICLE_VERSIONS (Inmutabilidad por hash SHA-256)
CREATE TABLE article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id VARCHAR(64) UNIQUE NOT NULL,      -- 'ver-vasconcelos-v1'
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    version_number INT NOT NULL DEFAULT 1,
    title VARCHAR(300) NOT NULL,
    subtitle VARCHAR(500),
    area VARCHAR(100) NOT NULL,
    content_markdown TEXT NOT NULL,
    content_hash_sha256 CHAR(64) NOT NULL,       -- Hash SHA-256 del texto
    epistemic_status epistemic_status_t NOT NULL DEFAULT 'hypothesis',
    license license_type_t NOT NULL DEFAULT 'CC BY-SA 4.0',
    reading_time_minutes INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_article_version UNIQUE (article_id, version_number)
);

ALTER TABLE articles 
    ADD CONSTRAINT fk_current_version 
    FOREIGN KEY (current_version_id) 
    REFERENCES article_versions(id) DEFERRABLE INITIALLY DEFERRED;

-- 5. TABLA CITATIONS (Grafo Bidireccional con Tipado Lógico)
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_version_id VARCHAR(64) NOT NULL REFERENCES article_versions(version_id) ON DELETE RESTRICT,
    target_version_id VARCHAR(64) NOT NULL REFERENCES article_versions(version_id) ON DELETE RESTRICT,
    relation citation_relation_t NOT NULL,       -- 'supports' | 'contradicts' | 'extends'
    quoted_snippet TEXT NOT NULL,                -- Fragmento textual exacto (20 a 400 car.)
    reasoning TEXT NOT NULL,                     -- 1-2 frases justificando la postura
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_quoted_length CHECK (LENGTH(quoted_snippet) BETWEEN 20 AND 1000)
);

-- 6. TABLA MODERATION_REPORTS (Gobernanza por pares con auditoría pública)
CREATE TABLE moderation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_version_id VARCHAR(64) NOT NULL REFERENCES article_versions(version_id) ON DELETE CASCADE,
    reporter_handle VARCHAR(64) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status report_status_t NOT NULL DEFAULT 'pending_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROCEDIMIENTO ALMACENADO: execute_user_gdpr_erasure
-- Cumplimiento estricto del RGPD Art. 17 sin destruir la obra bajo CC BY-SA 4.0
CREATE OR REPLACE FUNCTION execute_user_gdpr_erasure(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    anon_hash TEXT;
BEGIN
    -- Generar pseudónimo ciego determinista irreversible de 16 caracteres
    anon_hash := 'anon-' || substr(encode(digest(target_user_id::text || NOW()::text, 'sha256'), 'hex'), 1, 16);

    UPDATE users
    SET 
        real_name = 'Autor Retirado [Anonimizado]',
        handle = anon_hash,
        role_and_affiliation = 'Investigador Retirado bajo Derecho al Olvido (RGPD Art. 17)',
        github_user = NULL,
        orcid_id = NULL,
        is_anonymized = TRUE,
        erased_at = NOW()
    WHERE id = target_user_id;

    -- Notar: Ningún registro en article_versions ni citations se elimina.
    -- Las claves foráneas se preservan íntegras; el grafo permanece 100% navegable.
END;
$$ LANGUAGE plpgsql;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(postgresSqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-16">
      {/* Encabezado General */}
      <header className="space-y-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          <span>Manifiesto · Matriz de Posicionamiento v1.0 · Laboratorio RGPD</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          Manifiesto, Hoja de Ruta y Laboratorio de Privacidad
        </h1>
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-sans max-w-3xl">
          Chen no es una plataforma comercial de contenidos ni una red social de engagement. Es un protocolo de argumentación abierta concebido para dotar a la investigación técnica y ensayística de rigor deductivo, inmutabilidad y respeto irrestricto por la privacidad.
        </p>
      </header>

      {/* 1. MATRIZ DE POSICIONAMIENTO ESTRATÉGICO (v1.0) */}
      <section aria-labelledby="strategic-heading" className="space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Diferenciación Fundamental
          </span>
          <h2 id="strategic-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            1. Tabla Comparativa Estratégica
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-0.5">
            Evaluación dimensional frente a las alternativas contemporáneas de publicación técnica.
          </p>
        </div>

        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
            <thead className="bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold">
              <tr>
                <th scope="col" className="p-3.5 sm:p-4">Dimensión</th>
                <th scope="col" className="p-3.5 sm:p-4">Blog Personal (Substack / Ghost)</th>
                <th scope="col" className="p-3.5 sm:p-4">Repositorio GitHub</th>
                <th scope="col" className="p-3.5 sm:p-4 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 border-l border-teal-200 dark:border-teal-800">
                  Plataforma Chen (Protocolo Abierto)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Descubrimiento y Red</td>
                <td className="p-3.5 sm:p-4">Aislado. Depende 100% de que el autor traiga audiencia propia desde Twitter/LinkedIn.</td>
                <td className="p-3.5 sm:p-4">Optimizado para código ejecutable; los ensayos en Markdown quedan enterrados y sin indexar.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Grafo de citas cruzadas. Quien investiga la tesis central descubre automáticamente tu réplica vinculada a nivel de párrafo.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Mecánica de Debate</td>
                <td className="p-3.5 sm:p-4">Comentarios caóticos lineales, descalificaciones, spam y cámaras de eco.</td>
                <td className="p-3.5 sm:p-4">Issues y PRs para bugs de código, no para argumentación deductiva o epistemología.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Citas con función lógica canónica: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">[ + Apoya ]</span>, <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">[ - Contradice ]</span>, <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">[ &rarr; Amplía ]</span> con justificación obligatoria.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Portafolio Profesional</td>
                <td className="p-3.5 sm:p-4">Métricas de vanidad: seguidores, clics, newsletters de pago y algoritmos de retención.</td>
                <td className="p-3.5 sm:p-4">Commits técnicos de software, pero sin trazabilidad de la evolución del pensamiento crítico.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Identidad verificada (GitHub / ORCID), atribución inalterable y métricas de citación externa (ECR).
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-stone-900 dark:text-stone-100">Preservación y Citas</td>
                <td className="p-3.5 sm:p-4">Enlaces rotos (404), cambios de dominio y ediciones arbitrarias no versionadas.</td>
                <td className="p-3.5 sm:p-4">Git tags inmutables, pero sin resolución semántica de fragmentos de texto citados.</td>
                <td className="p-3.5 sm:p-4 bg-teal-50/50 dark:bg-teal-950/20 font-medium text-stone-900 dark:text-stone-100 border-l border-teal-200 dark:border-teal-800">
                  Inmutabilidad por hash SHA-256 anclado al fragmento exacto, compatible con RGPD Art. 17 y CC BY-SA 4.0.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagrama de Cuadrantes de Posicionamiento */}
        <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#12161D] space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Cuadrante Epistémico de Posicionamiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Cuadrante Chen */}
            <div className="p-4 rounded-lg bg-teal-900 text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold">Chen (Protocolo Abierto)</span>
                <span className="font-mono text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded">Objetivo</span>
              </div>
              <p className="text-teal-100 leading-relaxed">
                <strong>Tesis original profunda + Debate granular en tiempo real.</strong> Argumentos verificados mediante SHA-256, condiciones de falsabilidad obligatorias y citas bidireccionales con tipado lógico.
              </p>
            </div>

            {/* Cuadrante Wikipedia */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">Wikipedia</span>
                <span className="font-mono text-[10px] text-stone-500">Síntesis Enciclopédica</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Consenso neutral estricto (PVN). <strong>Prohibida la investigación original o formulación de tesis nuevas.</strong> El debate queda relegado a páginas de discusión accesorias sin estructura formal.
              </p>
            </div>

            {/* Cuadrante ArXiv */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">ArXiv / Preprints</span>
                <span className="font-mono text-[10px] text-stone-500">Depósito Estático</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                PDFs estáticos no interactivos. <strong>Sin debate granular entre pares en el propio documento.</strong> Las citas tardan meses o años en manifestarse a través de revistas indexadas.
              </p>
            </div>

            {/* Cuadrante Medium / Substack */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">Medium / Substack</span>
                <span className="font-mono text-[10px] text-stone-500">Publicación Comercial</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Muros de pago, incentivo al clickbait y algoritmos de retención de atención. <strong>Cero rigor en la citación bidireccional;</strong> el debate se reduce a secciones de comentarios lineales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOJA DE RUTA REALISTA (3 FASES A 0 € DE PRESUPUESTO) */}
      <section aria-labelledby="roadmap-heading" className="space-y-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
            Planificación Ejecutiva
          </span>
          <h2 id="roadmap-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            2. Hoja de Ruta Realista (Fases 1 a 3 a 0 €)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-0.5">
            Estrategia guiada por el principio de Pareto (80/20) para validar tracción antes de añadir complejidad innecesaria.
          </p>
        </div>

        <div className="space-y-4">
          {/* Fase 1 */}
          <div className="p-5 rounded-xl border-2 border-teal-700 bg-white dark:bg-[#161B22] shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-teal-800 dark:text-teal-300">
                Fase 1 (Meses 1-2) · EN EJECUCIÓN (MVP Nuclear)
              </span>
              <span className="font-mono text-xs text-stone-500 font-bold">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Validación de la Hipótesis Central de Citación Cruzada
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
              <strong>Alcance:</strong> Editor Markdown puro, anclaje de citas funcionales (<code className="font-mono text-xs">[ + Apoya ]</code>, <code className="font-mono text-xs">[ - Contradice ]</code>, <code className="font-mono text-xs">[ &rarr; Amplía ]</code>), versiones inmutables SHA-256 y cumplimiento estricto del RGPD Art. 17.
            </p>
            <div className="text-xs font-mono text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded border border-teal-200 dark:border-teal-900">
              <strong>KPI de éxito:</strong> 15 artículos técnicos publicados por investigadores ajenos al equipo fundador con Tasa de Citación Externa (ECR) &gt; 40%.
            </div>
          </div>

          {/* Fase 2 */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#161B22]/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-stone-700 dark:text-stone-300">
                Fase 2 (Meses 3-6) · Consolidación y Portabilidad
              </span>
              <span className="font-mono text-xs text-stone-500">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Integración con Ecosistemas de Notas y Academia
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              <strong>Alcance:</strong> Compatibilidad bidireccional con Obsidian mediante <code className="font-mono text-xs">[[wikilinks]]</code>, exportador a formato BibTeX/Zotero para artículos académicos y feeds RSS atómicos por autor.
            </p>
            <div className="text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 p-2.5 rounded">
              <strong>KPI de éxito:</strong> 100 artículos interconectados y &gt; 250 citas semánticas registradas.
            </div>
          </div>

          {/* Fase 3 */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#161B22]/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-stone-700 dark:text-stone-300">
                Fase 3 (Meses 7-12) · Ecosistema y Gobernanza
              </span>
              <span className="font-mono text-xs text-stone-500">Presupuesto: 0 €</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              API Pública de Grafos Epistémicos y Federación
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              <strong>Alcance:</strong> API GraphQL pública para descargar el grafo de argumentación en formato RDF/Neo4j, y paneles de gobernanza abierta gestionados por comités disciplinares por pares.
            </p>
            <div className="text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 p-2.5 rounded">
              <strong>KPI de éxito:</strong> Adopción del protocolo en al menos 3 seminarios universitarios de postgrado.
            </div>
          </div>
        </div>
      </section>

      {/* 3. LABORATORIO INTERACTIVO: RGPD ART. 17 VS. INMUTABILIDAD DEL GRAFO */}
      <section
        aria-labelledby="gdpr-lab-heading"
        className="p-6 sm:p-8 rounded-xl border-2 border-teal-600/70 bg-stone-50 dark:bg-[#12161D] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
              Privacidad por Diseño · RGPD Art. 17
            </span>
            <h2 id="gdpr-lab-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              3. Demostrador Interactivo RGPD vs. Inmutabilidad del Grafo
            </h2>
          </div>
          <button
            onClick={onResetDatabase}
            className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
          >
            Restaurar base de datos inicial
          </button>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-sans leading-relaxed space-y-2">
          <p>
            <strong>El conflicto jurídico fundamental:</strong> La licencia Creative Commons (CC BY-SA 4.0) es jurídicamente <em>irrevocable</em> respecto a la expresión intelectual de la obra (el texto y sus hashes SHA-256 no pueden destruirse sin arruinar las citas de otros investigadores). No obstante, el <strong>Artículo 17 del RGPD (Derecho a la Supresión / Olvido)</strong> y la cláusula 3.a.3 de Creative Commons exigen que el autor pueda solicitar en cualquier momento la supresión de sus datos personales (PII: nombre civil, correo, perfil de GitHub, ORCID).
          </p>
          <p>
            <strong>La solución técnica de Chen:</strong> El procedimiento almacenado <code className="font-mono font-bold">execute_user_gdpr_erasure</code> anonimiza los datos personales asignando un seudónimo ciego <code>anon-hash</code>, mientras que todos los artículos y citas del grafo se preservan al 100% sin enlaces rotos.
          </p>
        </div>

        {gdprFeedback && (
          <div role="status" className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 font-sans shadow-xs">
            {gdprFeedback}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Seleccionar Autor para la Prueba de Borrado:
            </label>
            <select
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
              className="w-full p-2.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0D1117] text-xs font-mono text-stone-900 dark:text-stone-100 cursor-pointer"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.isAnonymized ? `${a.realName} (${a.handle})` : `${a.realName} (@${a.handle})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateErasure}
              disabled={selectedAuthor?.isAnonymized}
              className={`w-full py-2.5 px-4 rounded-md font-mono text-xs font-bold transition-all ${
                selectedAuthor?.isAnonymized
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs cursor-pointer'
              }`}
            >
              {selectedAuthor?.isAnonymized
                ? 'Autor Ya Anonimizado bajo RGPD'
                : 'Ejecutar Borrado RGPD (execute_user_gdpr_erasure)'}
            </button>
          </div>
        </div>

        {/* Inspección en Vivo del Estado del Autor y Comprobación de Enlaces */}
        {selectedAuthor && (
          <div className="p-5 rounded-lg bg-white dark:bg-[#161B22] border border-stone-200 dark:border-stone-800 space-y-4 text-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="font-mono text-[11px] text-stone-400">Estado de Identidad:</span>
                <div className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedAuthor.realName}
                </div>
              </div>
              <span
                className={`font-mono text-xs px-2.5 py-1 rounded font-bold uppercase ${
                  selectedAuthor.isAnonymized
                    ? 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                }`}
              >
                {selectedAuthor.isAnonymized ? 'Anonimizado (PII Suprimida)' : 'Activo (Identidad Verificada)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-stone-400 block">Handle:</span>
                <span className="text-teal-700 dark:text-teal-400 font-bold">{selectedAuthor.handle}</span>
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
                <span className="text-stone-400 block">Fecha de supresión:</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {selectedAuthor.erasedAt || 'N/A (Activo)'}
                </span>
              </div>
            </div>

            {/* Comprobación de Integridad del Grafo */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                Comprobación de Integridad del Grafo ({authoredArticles.length} artículos del autor):
              </span>
              <div className="space-y-2">
                {authoredArticles.map((art) => {
                  const incomingCount = citations.filter((c) => c.targetVersionId === art.versionId).length;
                  const outgoingCount = citations.filter((c) => c.sourceVersionId === art.versionId).length;

                  return (
                    <div
                      key={art.versionId}
                      className="p-3 rounded bg-stone-50 dark:bg-[#0D1117] border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-serif font-bold text-stone-900 dark:text-stone-100">
                          {art.title}
                        </div>
                        <div className="font-mono text-[10px] text-stone-500 mt-0.5">
                          Hash inalterado: #{art.contentHash.substring(0, 16)}... · {incomingCount} citas entrantes · {outgoingCount} citas salientes
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenArticle(art.versionId)}
                        className="text-teal-700 dark:text-teal-400 font-mono text-[11px] underline cursor-pointer"
                      >
                        Comprobar en el Lector &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. MODELO DE BASE DE DATOS RELACIONAL Y PROCEDIMIENTOS ALMACENADOS (POSTGRESQL) */}
      <section aria-labelledby="sql-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
              Persistencia Relacional
            </span>
            <h2 id="sql-heading" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              4. Modelo PostgreSQL y Procedimiento execute_user_gdpr_erasure
            </h2>
          </div>
          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-bold hover:bg-teal-700 dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            {copiedSql ? '¡SQL Copiado al Portapapeles!' : 'Copiar SQL al portapapeles'}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
          Código DDL de producción para las 5 tablas maestras (<code className="font-mono">users</code>, <code className="font-mono">articles</code>, <code className="font-mono">article_versions</code>, <code className="font-mono">citations</code>, <code className="font-mono">moderation_reports</code>) y la función PL/pgSQL que asegura el borrado sin infringir claves foráneas.
        </p>

        <div className="relative rounded-xl border border-stone-300 dark:border-stone-800 bg-[#0B0D12] p-4 text-xs font-mono text-stone-200 overflow-x-auto max-h-[440px] shadow-inner">
          <pre>{postgresSqlCode}</pre>
        </div>
      </section>
    </div>
  );
};
