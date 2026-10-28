# Chen — Protocolo de Publicación y Argumentación Abierta (Versión 1.0 · MVP Nuclear)

## Resumen Ejecutivo de Arquitectura y Entrega
Se ha implementado de forma rigurosa la **Versión 1.0 (MVP Nuclear)** del protocolo Chen, erradicando por completo el bloatware (selectores de Modo Visual / Modo Ligero, pomodoros, calendarios, relojes y gamificación) y estableciendo una interfaz editorial sobria, accesible (WCAG 2.1 AAA) y ultrarrápida sin conexiones a terceros (cero Google Fonts, cero scripts de rastreo).

---

## 1. Cumplimiento de Reglas Estrictas Anti-Bloatware

1. **Extirpación Total de Widgets Ajenos:**
   - Eliminados por completo los componentes `AcademicCalendarView`, `SoundscapeWidget`, `FocusTimerWidget`, `MedalsShowcase` y `VideoPrivacyPlayer`.
   - Cero selectores de «Modo Visual / Modo Ligero». Existe una única interfaz editorial con tema pergamino claro (`#FAF9F5`) y obsidiana oscura (`#0F1115`).
2. **Privacidad por Diseño y 0 KB Externos:**
   - Cero llamadas a `fonts.googleapis.com` o CDNs externas.
   - Pila de fuentes nativas del sistema:
     - Serif editorial: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif`.
     - Sans UI: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
     - Mono para hashes de versión: `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`.
3. **Accesibilidad (WCAG 2.1 AAA):**
   - Contraste superior a 7:1 en textos principales.
   - Navegación semántica (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
   - Soporte exhaustivo para navegación por teclado (`:focus-visible`) y enlace de salto de accesibilidad inicial.

---

## 2. Las 4 Vistas Nucleares Implementadas

### Vista 1: Landing Estratégica & Explorador del Grafo (`HomeHeroAndPositioning`)
- **Hero Editorial:**
  - Título exacto: *«Internet ha resuelto la distribución del texto, pero ha roto la conversación intelectual.»*
  - Subtítulo exacto: *«Chen es el protocolo de publicación técnica y ensayística donde cada texto se integra en una red de argumentación verificable. Sin algoritmos de indignación, sin anuncios, con citas bidireccionales inmutables.»*
  - CTAs principales: `"Explorar Artículos y Debates"` y `"Publicar Tesis (Markdown)"`.
- **Demostrador Interactivo en Vivo (Anatomía de una Cita con Función):**
  - Tesis fuente: *«La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables»* `[Estado: Hipótesis] [Hash: #7e9f3b]`.
  - Pestañas interactivas de filtrado: `Todas`, `[+ APOYA]` (esmeralda), `[- CONTRADICE]` (rojo rubí con contraejemplo PBFT de Castro y Liskov 1999), `[→ AMPLÍA]` (azul cerceta con extensión epistemológica de Lakatos).
  - Al pulsar sobre cualquier tarjeta, navega directamente al lector para ese artículo.
- **Tabla de Posicionamiento y Comparativa (v1.0):**
  - Enfrenta en 4 dimensiones (*Descubrimiento y Red*, *Mecánica de Debate*, *Portafolio Profesional*, *Preservación y Citas Inmutables*) a *Blog Personal*, *Repositorio GitHub* y *Plataforma Chen*.
- **Cuadrante Visual de Posicionamiento Epistémico:**
  - Contrasta la propuesta de Chen con Wikipedia (consenso neutro sin tesis original), ArXiv (PDFs estáticos sin debate granular) y Medium/Substack (muros de pago y algoritmos de engagement).
- **Hoja de Ruta Ejecutiva (Fases 1 a 3):**
  - Fase 1 (Meses 1-2): Protocolo Nuclear (15 artículos, ECR > 40%, 0 € de presupuesto).
  - Fase 2 (Meses 3-6): Consolidación y Portabilidad (Obsidian `[[wikilinks]]`, BibTeX, 100 artículos, 0 €).
  - Fase 3 (Meses 7-12): Ecosistema y Gobernanza (API pública de grafos, federación, 3 seminarios universitarios).
- **Feed de Artículos Interconectados:**
  - 5 artículos seminales con insignias epistémicas, recuentos bidireccionales de citas y hashes SHA-256.

### Vista 2: Lector de Artículos con Subrayado y Cita en Caliente (`ArticleReader`)
- **Cabecera Rigurosa:** Autor verificado con handle, insignias de GitHub y ORCID, fecha, versión `v1.0 · SHA-256`, licencia CC BY-SA 4.0, badge epistémico (`Hecho`, `Hipótesis`, `Opinión`) y exportador a `.md` puro con frontmatter.
- **Interacción de Subrayado y Cita (`window.getSelection`):**
  - Al seleccionar entre 20 y 400 caracteres en el cuerpo del texto, emerge un botón flotante dinámico: `"Citar / Replicar este fragmento (XX car.)"`.
  - Al pulsarlo, transfiere automáticamente el fragmento seleccionado, el hash de versión y los metadatos al editor.
- **Subrayados Sutiles en Párrafos Citados:**
  - Los fragmentos que ya han recibido citas en la red aparecen subrayados sutilmente con una insignia `[1 réplica]`. Al hacer clic, desplazan suavemente al lector hacia la réplica en el grafo.
- **Sección «Citado por (Grafo Bidireccional)»:**
  - Filtro por postura argumental (`Todas`, `[+ Apoya]`, `[- Contradice]`, `[→ Amplía]`).
  - Muestra el fragmento citado, la justificación de 1-2 oraciones del autor citante y un botón para saltar al artículo de la réplica.

### Vista 3: Editor de Tesis con Cita Anclada (`CitationEditor`)
- **Evidencia Anclada Criptográficamente:**
  - Tarjeta destacada con el fragmento citado original, el autor fuente, la versión de destino y su hash SHA-256 inmutable.
- **Selector Obligatorio de Postura Argumental:**
  - `[+ APOYA]` (Verde esmeralda): Aporta datos empíricos, pruebas formales o deducciones compatibles.
  - `[- CONTRADICE]` (Rojo rubí): Identifica contraejemplos, fallos lógicos o refutaciones directas.
  - `[→ AMPLÍA]` (Azul cerceta): Extiende el marco teórico a nuevos dominios o aclara definiciones límite.
- **Justificación Epistémica Obligatoria:** Campo de texto (1-2 oraciones) donde el autor explica qué aporta su réplica.
- **Redacción en Markdown con Pestañas Escribir / Previsualizar:** Título, subtítulo, estado epistémico y nota de falsabilidad.
- **Publicación Inmutable:**
  - Generación de hash SHA-256 de contenido.
  - Persistencia en `localStorage`.
  - Actualización reactiva instantánea del array `citedByInbound` en el artículo destino y redirección al lector.

### Vista 4: Arquitectura, RGPD y Modelo SQL (`GdprArchitecturePanel`)
- **Inmutabilidad por Versión vs Derecho al Olvido (RGPD Art. 17):**
  - Desglose del equilibrio jurídico: las licencias Creative Commons son irrevocables para la obra, mientras que la PII debe eliminarse mediante disociación a `anon-[hash]`.
- **Simulador Interactivo en Vivo de Borrado RGPD:**
  - Permite seleccionar cualquier autor (ej. *Ing. Andrés Keller* o *Dra. Clara Méndez*).
  - Al pulsar `"Simular Borrado RGPD"`, suprime su nombre civil, correo, usuario de GitHub y ORCID, reemplazándolos por `anon-[hash]`.
  - Demuestra en vivo que sus artículos y todas las citas cruzadas hacia sus hashes SHA-256 se preservan al 100% sin romper el grafo.
  - Incluye botón para restaurar el estado de prueba.
- **Modelo Relacional PostgreSQL (5 Tablas):**
  - Código DDL completo para `users`, `articles`, `article_versions`, `citations` y `moderation_audit_logs`.
  - Botón interactivo `"Copiar Modelo SQL"` con retroalimentación visual.
- **Registro Público y Transparente de Moderación:**
  - Tabla de incidentes auditables con hashes salteados para garantizar gobernanza sin exponer la identidad de usuarios denunciantes o sancionados.

---

## 3. Semilla de Artículos Interconectados
1. **Dra. Clara Méndez**: *«Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)»* (`#7e9f3b21`, Hecho formal).
2. **Ing. Andrés Keller**: *«Tolerancia práctica a fallas bizantinas (PBFT) bajo sincronía parcial»* (`#c2d854ab`, Hecho formal) — Cita con `[- CONTRADICE]` a Méndez.
3. **Dra. Elena Vasconcelos**: *«La asimetría deductiva del falsacionismo popperiano y los límites del empirismo»* (`#8f3a9c7b`, Hipótesis).
4. **Dr. Mateo Silvetti**: *«La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo»* (`#4b7e12f0`, Hecho formal) — Cita con `[- CONTRADICE]` a Vasconcelos.
5. **Dr. Julián Arispe**: *«Metodología de los programas de investigación científica y falsacionismo sofisticado»* (`#a3c9415e`, Hipótesis) — Cita con `[→ AMPLÍA]` a Vasconcelos y Silvetti.
