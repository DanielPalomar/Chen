# Chen — Plataforma de Conocimiento Libre y Debate con Argumentos

Plataforma web interactiva, ultraligera y universalmente accesible inspirada en el documento fundacional de Chen («Amanecer, Exponer y Profundizar»), diseñada para conectar ideas mediante citas funcionales, explorar «Huecos del saber», practicar en privado sin presiones de ranking y ofrecer soporte de publicidad/patrocinio ético 100% opcional y no intrusivo.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> A continuación se resumen las decisiones clave acordadas con el usuario para orientar la construcción de Chen:

- **Enfoque Principal Confirmado**: Plataforma interactiva completa que integra un explorador temático de conocimiento, visor/editor de artículos con citas estructuradas y el sistema de «Huecos del saber».
- **Publicidad Opcional No Intrusiva**: Switch discreto en Ajustes y en el pie de página. Por defecto viene desactivado (respetando el principio «sin anuncios molestos»), y al ser activado por el usuario muestra anuncios éticos de libros de libre acceso, cursos abiertos (MIT OCW, OpenStax, Khan Academy) o enlaces de patrocinio voluntario a autores (Ko-fi / Liberapay) en áreas marginales sin interferir en la lectura ni en la reputación.
- **Herramientas Priorizadas**:
  1. **Huecos del saber**: Preguntas abiertas de la comunidad con buscador previo de ideas similares para razonar y contrastar antes de publicar.
  2. **Citas conectadas con función**: Enlaces tipificados con etiquetas explícitas (`Apoya`, `Contradice`, `Amplía`) y versión citada.
  3. **Práctica privada con tarjetas**: Sistema de autoevaluación y repetición espaciada sin tablas de clasificación, niveles tóxicos ni recolección de métricas ajenas.
  4. **Mapa visual interactivo de argumentos**: Grafo interactivo en SVG/Canvas para explorar conexiones de tesis, antítesis y evidencias en vivo.

***

## 1. Overview & Core Concept

- **Qué hace Chen**: Es una red de conocimiento abierta y verificable donde los artículos, notas y vídeos embebidos se conectan mediante citas lógicas y evidencia, no por algoritmos de popularidad. Permite a cualquier persona (estudiante, docente, investigador o autodidacta) aprender a su propio ritmo, debatir sobre frases específicas y construir un portafolio de conocimiento verificable.
- **Audiencia objetivo**: Estudiantes, autodidactas, profesores e investigadores que buscan aprender con rigor intelectual, debatir con respeto y basarse en fuentes abiertas sin distracciones comerciales.
- **Propuesta de valor clave**: Coste cero de acceso, sin muros de pago ni cuentas obligatorias para leer y consultar; máxima velocidad de carga; almacenamiento local inmediato de notas y progresos con opción de exportación en Markdown/JSON.

***

## 2. User Experience & Visual Design

### Principales flujos de usuario
1. **Exploración Abierta (Amanecer / 晨)**:
   - Vista inicial con buscador temático (filtrado por área: Matemáticas, Filosofía, Computación, Ciencias Naturales, etc., nivel de dificultad y licencia libre CC BY / CC0).
   - Acceso inmediato al artículo o nota explicativa en Markdown con KaTeX y vídeos educativos embebidos (capítulos con marca de tiempo).
2. **Debate y Conexión de Ideas (Exponer / 陈)**:
   - Los artículos presentan sus afirmaciones con etiquetas epistémicas (`Hecho demostrado`, `Hipótesis`, `Opinión analítica`).
   - Citas conectadas funcionales: los usuarios pueden ver qué otros artículos *apoyan*, *contradicen* o *amplían* el texto.
   - Visor de Mapa de Argumentos: representación visual de nodos interconectados (tesis central $\to$ evidencias $\to$ objeciones).
3. **Huecos del Saber**:
   - Espacio comunitario donde se visibilizan las preguntas que aún no tienen respuesta rigurosa.
   - Flujo reflexivo: antes de enviar una pregunta nueva, Chen busca automáticamente respuestas ya existentes y pide al usuario resumir qué ha investigado previamente.
4. **Práctica Privada (Profundizar / 沉)**:
   - Cuaderno personal de tarjetas de estudio con repetición espaciada (SRS).
   - Práctica sin gamificación agresiva: sin contadores de rachas castigadoras ni rankings públicos.
5. **Configuración de Publicidad Ética Opcional**:
   - Un conmutador sutil permite a los simpatizantes apoyar la infraestructura mostrando patrocinios éticos seleccionados (OpenStax, Internet Archive, proyectos comunitarios).

### Identidad visual y tema
- **Dirección estética**: Editorial humanista y rigurosa, inspirada en la paleta de la presentación de Chen (azul noche profundo `#0B1120`, violeta nocturno `#1E1B4B`, toques turquesa/cian `#06B6D4` y verde esmeralda suave `#10B981` para evidencias).
- **Tipografía**: `Plus Jakarta Sans` para titulares limpios y amigables; `DM Sans` / `Inter` para cuerpo de lectura fluido y descansado; números tabulares (`tabular-nums`) para cifras de citas y referencias.
- **Disciplina visual**: Sin píldoras decorativas vacías; metadatos limpios separados por puntos tipográficos (`·`); sin puntuaciones de reputación artificiales; diseño responsivo completo (desde móvil hasta pantallas de 1440px).

***

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Arquitectura ultraligera del lado del cliente con persistencia local**:
  - *Elección*: Estado reactivo rápido respaldado por `localStorage` con importación/exportación JSON y Markdown puro compatible con Obsidian.
  - *Razón*: Máxima rapidez de respuesta, sin latencia de red innecesaria, privacidad garantizada y funcionamiento offline inmediato.
- **Decisión 2: Publicidad 100% ética y opcional con botón de alternancia**:
  - *Elección*: Módulo de patrocinio discreto ubicado en la base de la interfaz y panel de ajustes, desactivado por defecto o activable por voluntad del usuario.
  - *Razón*: Cumple estrictamente la solicitud del usuario ("opción de publicidad opcional y esté en lugares donde no moleste") manteniendo la coherencia con el manifiesto de Chen.
- **Decisión 3: Citas tipificadas de primera clase**:
  - *Elección*: Cada cita incluye su relación explícita (`Apoya`, `Contradice`, `Amplía`) y el pasaje exacto referenciado.
  - *Razón*: Evita discusiones vacías y fomenta el pensamiento crítico basado en argumentos.
- **Decisión 4: Huecos del saber con prevención de redundancia**:
  - *Elección*: Búsqueda instantánea mientras se redacta la duda y plantilla obligatoria de reflexión previa («Qué he leído y qué hipótesis tengo»).

***

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                Chen Web App                                │
├────────────────────────────────────────────────────────────────────────────┤
│ [Barra Superior: Marca Chen · Navegación Rápida · Ajustes / Ética]        │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ Panel de Navegación  │ Vista Principal Dinámica                            │
│ ├─ Explorador        │ ├─ Vista Artículo (Markdown + Citas + Vídeo)        │
│ ├─ Huecos del Saber  │ ├─ Vista Huecos (Preguntas abiertas + Búsqueda)    │
│ ├─ Práctica Privada  │ ├─ Mapa Visual de Argumentos (Canvas/SVG interactivo)│
│ └─ Mi Cuaderno       │ └─ Ajustes de Privacidad y Publicidad Opcional      │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ Datos & Persistencia (Almacenamiento Local + Semilla Inicial + Exportador) │
└────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos Principal:
- `Article`: id, title, slug, summary, contentMarkdown, author, license, level (`intro`, `intermediate`, `advanced`), epistemicStatus (`fact`, `hypothesis`, `analysis`), citations (`{ targetId, relation: 'supports' | 'contradicts' | 'expands', quote }`), videoEmbed? (`{ url, chapters }`).
- `KnowledgeGap` (Hueco del saber): id, question, context, userPriorReading, hypothesis, answersCount, status (`open`, `addressed`).
- `Flashcard`: id, topic, question, answer, dueInterval, repetitions, lastReviewed.
- `Preferences`: optionalAdsEnabled (boolean), theme (dark/light), readingMode (boolean).

***
