import { Article, Author, ModerationAuditLog } from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'auth-clara-mendez',
    name: 'Dra. Clara Méndez',
    handle: 'claramendez-sci',
    email: 'clara.mendez@episteme-chen.org',
    role: 'Investigadora en Sistemas Distribuidos & Computación Teórica',
    githubUser: 'claramendez-sci',
    orcidId: '0000-0001-9234-8812',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-andres-keller',
    name: 'Ing. Andrés Keller',
    handle: 'andreskeller-dev',
    email: 'andres.keller@distrib-labs.io',
    role: 'Arquitecto de Protocolos de Consenso & Redes Peer-to-Peer',
    githubUser: 'andreskeller-dev',
    orcidId: '0000-0002-1825-0097',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-elena-vasconcelos',
    name: 'Dra. Elena Vasconcelos',
    handle: 'evasconcelos-phil',
    email: 'e.vasconcelos@filosofia-ciencia.edu',
    role: 'Catedrática de Epistemología y Lógica de la Investigación',
    githubUser: 'elena-vasconcelos',
    orcidId: '0000-0003-4412-7019',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-mateo-silvetti',
    name: 'Dr. Mateo Silvetti',
    handle: 'msilvetti-logic',
    email: 'silvetti@logica-holistica.net',
    role: 'Docente en Filosofía del Lenguaje y Lógica Modal',
    githubUser: 'mateosilvetti',
    orcidId: '0000-0002-6190-3341',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-julian-arispe',
    name: 'Dr. Julián Arispe',
    handle: 'jarispe-method',
    email: 'julian.arispe@heuristica-metodo.org',
    role: 'Investigador en Programas Científicos e Historia de la Ciencia',
    githubUser: 'julianarispe',
    orcidId: '0000-0001-7721-5509',
    avatarUrl: '',
    isErased: false,
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-flp-consenso',
    slug: 'imposibilidad-consenso-determinista-flp',
    title: 'Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)',
    subtitle: 'Análisis formal del resultado de Fischer, Lynch y Paterson (1985) y sus límites en sistemas reales.',
    author: INITIAL_AUTHORS[0], // Dra. Clara Méndez
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'fact',
    epistemicNote: 'Demostración matemática formal revisada por pares. Límite deductivo infranqueable para modelos deterministas puros.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '7e9f3b2184ad2c09ef488172b0c1e34589d892a013f99e4b3c82d911a03fc551',
    versions: [
      {
        id: 'ver-flp-1.0',
        versionNumber: 'v1.0',
        contentHash: '7e9f3b2184ad2c09ef488172b0c1e34589d892a013f99e4b3c82d911a03fc551',
        date: '12 de Octubre, 2026',
        authorName: 'Dra. Clara Méndez',
        reason: 'Publicación formal original de la tesis con demostración de estados bivalentes.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. El modelo formal asíncrono
En la computación distribuida, el modelo asíncrono puro no establece ningún límite superior sobre el tiempo de transmisión de mensajes a través de la red ni sobre la velocidad relativa de cómputo de los nodos. Cada nodo opera como un autómata de estados finito.

## 2. El Teorema de Imposibilidad FLP (1985)
En su célebre artículo *Impossibility of Distributed Consensus with One Unreliable Process*, Michael J. Fischer, Nancy Lynch y Michael S. Paterson demostraron que:

> «En una red completamente asíncrona, ningún protocolo de consenso determinista puede garantizar tanto seguridad (*safety*) como vivacidad (*liveness*) si existe la posibilidad de que tan solo un único proceso sufra una falla por caída (*crash failure*).»

La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables. Cualquier protocolo que intente asegurar que nunca se decida un valor erróneo se expondrá necesariamente a una ejecución infinita en la que la red nunca alcance una decisión final.

## 3. Estados bivalentes y configuraciones críticas
La prueba deductiva reposa sobre la existencia de *configuraciones bivalentes*: estados globales del sistema desde los cuales aún es posible derivar tanto el valor de decisión 0 como el valor 1.

FLP demuestra rigurosamente que, ante la demora indefinida de un mensaje de un nodo fallido, el adversario de la red siempre puede forzar una secuencia de pasos que mantenga al sistema perpetuamente en un estado bivalente.

## 4. Conclusión epistémica para arquitecturas contemporáneas
La búsqueda de algoritmos que pretendan ignorar este teorema mediante suposiciones de "sincronía perfecta oculta" conduce invariablemente a inconsistencias de datos o congelamientos de red cuando sobrevienen particiones particionales de red (*split-brain*).`,
    readTimeMinutes: 7,
    publishedDate: '12 de Octubre, 2026',
    lastUpdatedDate: '12 de Octubre, 2026',
    citationsOutbound: [],
    citedByInbound: [
      {
        id: 'cit-pbft-to-flp',
        sourceArticleId: 'art-pbft-castro-liskov',
        sourceArticleSlug: 'tolerancia-practica-fallas-bizantinas-pbft',
        sourceArticleTitle: 'Tolerancia práctica a fallas bizantinas (PBFT) bajo sincronía parcial',
        sourceVersionId: 'ver-pbft-1.0',
        sourceVersionHash: 'c2d854ab81f422998a12dc91a7e2b10901e9124403cd84b55ae21b033d211244',
        sourceAuthorName: 'Ing. Andrés Keller',
        sourceAuthorHandle: 'andreskeller-dev',
        targetArticleId: 'art-flp-consenso',
        targetArticleSlug: 'imposibilidad-consenso-determinista-flp',
        targetArticleTitle: 'Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)',
        targetVersionId: 'ver-flp-1.0',
        targetVersionHash: '7e9f3b2184ad2c09ef488172b0c1e34589d892a013f99e4b3c82d911a03fc551',
        targetAuthorName: 'Dra. Clara Méndez',
        quotedSnippet: 'La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables',
        relation: 'contradicts',
        reasoning: 'Demuestra que la imposibilidad de FLP se elude en entornos prácticos asumiendo sincronía parcial débil (timeouts adaptativos), permitiendo tolerancia bizantina determinista de 3f+1 nodos.',
        createdAt: '16 de Octubre, 2026',
      },
    ],
  },
  {
    id: 'art-pbft-castro-liskov',
    slug: 'tolerancia-practica-fallas-bizantinas-pbft',
    title: 'Tolerancia práctica a fallas bizantinas (PBFT) bajo sincronía parcial',
    subtitle: 'Superando el pesimismo de FLP: cómo el algoritmo de Castro y Liskov (1999) garantiza consenso seguro.',
    author: INITIAL_AUTHORS[1], // Ing. Andrés Keller
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'fact',
    epistemicNote: 'Implementación y demostración formal de safety invariante y liveness bajo sincronía débil.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: 'c2d854ab81f422998a12dc91a7e2b10901e9124403cd84b55ae21b033d211244',
    versions: [
      {
        id: 'ver-pbft-1.0',
        versionNumber: 'v1.0',
        contentHash: 'c2d854ab81f422998a12dc91a7e2b10901e9124403cd84b55ae21b033d211244',
        date: '16 de Octubre, 2026',
        authorName: 'Ing. Andrés Keller',
        reason: 'Publicación de la réplica y demostración práctica frente al pesimismo asíncrono.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. El falso dilema entre la teoría y la ingeniería de consenso
Es común invocar el resultado de Fischer, Lynch y Paterson para declarar que cualquier intento de consenso determinista en redes reales está condenado al fracaso. Esta lectura comete un error metodológico: asume que la única alternativa es el asincronismo absoluto.

## 2. Réplica a la tesis de inviabilidad determinista
En contraposición a la premisa generalizada de que «la complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables», Miguel Castro y Barbara Liskov (1999) demostraron que basta introducir una suposición física mínima y realista: la *sincronía parcial* o sincronía débil.

En PBFT:
1. **Safety estricto**: La consistencia es incondicional. Jamás se produce un bifurcamiento de estado ni se valida una transacción inválida, incluso si la red es completamente asíncrona o está bajo ataque activo de denegación de servicio.
2. **Liveness eventual**: El progreso se garantiza tan pronto como los retardos de mensaje $\\Delta$ se estabilicen temporalmente por debajo de un umbral finito, utilizando cambios de vista (*view-changes*) con temporizadores exponenciales.

## 3. Estructura del protocolo de tres fases
El algoritmo organiza el acuerdo en tres rondas criptográficamente autenticadas:
- **Pre-Prepare**: El nodo primario asigna un número de secuencia al mensaje del cliente.
- **Prepare**: Cada nodo hace broadcast a los demás validando que no existan colisiones de secuencia para vistas distintas. Se requiere un quórum de $2f + 1$ votos.
- **Commit**: Los nodos confirman que una mayoría calificada ha recibido la preparación. Tras $2f + 1$ confirmaciones, la operación se ejecuta localmente.

Con $3f + 1$ nodos totales, el sistema tolera hasta $f$ nodos actuando con fallas bizantinas arbitrarias (incluyendo colusión maliciosa).

## 4. Conclusión
El consenso determinista no es una quimera teórica; es una realidad de producción cuando la arquitectura desacopla la garantía inquebrantable de seguridad (*safety*) de la vivacidad (*liveness*) adaptativa.`,
    readTimeMinutes: 9,
    publishedDate: '16 de Octubre, 2026',
    lastUpdatedDate: '16 de Octubre, 2026',
    citationsOutbound: [
      {
        id: 'cit-pbft-to-flp',
        sourceArticleId: 'art-pbft-castro-liskov',
        sourceArticleSlug: 'tolerancia-practica-fallas-bizantinas-pbft',
        sourceArticleTitle: 'Tolerancia práctica a fallas bizantinas (PBFT) bajo sincronía parcial',
        sourceVersionId: 'ver-pbft-1.0',
        sourceVersionHash: 'c2d854ab81f422998a12dc91a7e2b10901e9124403cd84b55ae21b033d211244',
        sourceAuthorName: 'Ing. Andrés Keller',
        sourceAuthorHandle: 'andreskeller-dev',
        targetArticleId: 'art-flp-consenso',
        targetArticleSlug: 'imposibilidad-consenso-determinista-flp',
        targetArticleTitle: 'Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)',
        targetVersionId: 'ver-flp-1.0',
        targetVersionHash: '7e9f3b2184ad2c09ef488172b0c1e34589d892a013f99e4b3c82d911a03fc551',
        targetAuthorName: 'Dra. Clara Méndez',
        quotedSnippet: 'La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables',
        relation: 'contradicts',
        reasoning: 'Demuestra que la imposibilidad de FLP se elude en entornos prácticos asumiendo sincronía parcial débil (timeouts adaptativos), permitiendo tolerancia bizantina determinista de 3f+1 nodos.',
        createdAt: '16 de Octubre, 2026',
      },
    ],
    citedByInbound: [],
  },
  {
    id: 'art-falsacionismo-popper',
    slug: 'asimetria-deductiva-falsacionismo-popperiano',
    title: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
    subtitle: 'Por qué la verificación inductiva es lógicamente insostenible y la refutación formal es el único motor de avance.',
    author: INITIAL_AUTHORS[2], // Dra. Elena Vasconcelos
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'hypothesis',
    epistemicNote: 'Marco epistemológico fundacional propuesto como criterio de demarcación para artículos publicados en Chen.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
    versions: [
      {
        id: 'ver-popper-1.0',
        versionNumber: 'v1.0',
        contentHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
        date: '04 de Octubre, 2026',
        authorName: 'Dra. Elena Vasconcelos',
        reason: 'Versión fundacional sobre el criterio popperiano de refutación en plataformas de conocimiento.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. El problema de la inducción y la asimetría lógica
Ningún número finito de observaciones particulares favorables ($P_1, P_2, \\dots, P_n$) permite deducir con certeza matemática la verdad de una proposición universal:

$$\\forall x (C(x) \\to B(x))$$

El hecho de que hayamos registrado un millón de cisnes blancos jamás garantiza que el próximo espécimen no sea negro. Sin embargo, la observación rigurosa y confirmada de un único cisne negro basta deductivamente para destruir la proposición universal mediante la regla del *modus tollens*:

$$\\frac{T \\implies P, \\quad \\neg P}{\\neg T}$$

Esta asimetría lógica es el núcleo del falsacionismo: las teorías científicas no se verifican; únicamente se corroboran de manera provisional mientras resisten nuestros intentos más despiadados por refutarlas.

## 2. El criterio de demarcación
Un enunciado sólo tiene estatuto científico si es susceptible de entrar en conflicto con observaciones empíricas posibles. Si una teoría es inmune a toda observación contraria porque sus defensores introducen redefiniciones *ad hoc*, dicha teoría abandona el dominio de la ciencia.

Por ello, una hipótesis genuina debe estar dispuesta a responder siempre a la pregunta metodológica: *«¿Qué experimento u observación concebible obligaría a abandonar esta tesis?»*

## 3. Aplicación al protocolo de argumentación Chen
En Chen, todo artículo debe explicitar su estado epistémico. No se permite blindar tesis mediante jerga ambigua: las citas cruzadas sirven precisamente para que otros investigadores aporten el contraejemplo $\\neg P$ que active el modus tollens.`,
    readTimeMinutes: 6,
    publishedDate: '04 de Octubre, 2026',
    lastUpdatedDate: '04 de Octubre, 2026',
    citationsOutbound: [],
    citedByInbound: [
      {
        id: 'cit-duhem-to-popper',
        sourceArticleId: 'art-duhem-quine-holismo',
        sourceArticleSlug: 'tesis-holista-duhem-quine-objecion-falsacionismo',
        sourceArticleTitle: 'La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo',
        sourceVersionId: 'ver-duhem-1.0',
        sourceVersionHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
        sourceAuthorName: 'Dr. Mateo Silvetti',
        sourceAuthorHandle: 'msilvetti-logic',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-deductiva-falsacionismo-popperiano',
        targetArticleTitle: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'la observación rigurosa y confirmada de un único cisne negro basta deductivamente para destruir la proposición universal mediante la regla del modus tollens',
        relation: 'contradicts',
        reasoning: 'Objeción holista: una predicción experimental nunca se deduce de una hipótesis aislada T, sino de la conjunción (T ∧ A1 ∧ A2 ∧ C). Ante un resultado ¬P, la lógica formal sólo indica que la conjunción entera falló, pero no determina qué hipótesis individual debe descartarse.',
        createdAt: '08 de Octubre, 2026',
      },
      {
        id: 'cit-lakatos-to-popper',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-falsacionismo-sofisticado',
        sourceArticleTitle: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
        sourceAuthorName: 'Dr. Julián Arispe',
        sourceAuthorHandle: 'jarispe-method',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-deductiva-falsacionismo-popperiano',
        targetArticleTitle: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Un enunciado sólo tiene estatuto científico si es susceptible de entrar en conflicto con observaciones empíricas posibles',
        relation: 'extends',
        reasoning: 'Extiende el criterio de falsación aislada hacia el modelo de Lakatos: los científicos no abandonan teorías ante anomalías aisladas, sino que defienden un núcleo firme mediante un cinturón protector de hipótesis auxiliares progresivas.',
        createdAt: '11 de Octubre, 2026',
      },
    ],
  },
  {
    id: 'art-duhem-quine-holismo',
    slug: 'tesis-holista-duhem-quine-objecion-falsacionismo',
    title: 'La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo',
    subtitle: 'Por qué el modus tollens aislado es impracticable cuando la ciencia opera como una red corporativa de supuestos.',
    author: INITIAL_AUTHORS[3], // Dr. Mateo Silvetti
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'fact',
    epistemicNote: 'Tesis de lógica epistémica y filosofía analítica ampliamente corroborada en historia de la ciencia.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
    versions: [
      {
        id: 'ver-duhem-1.0',
        versionNumber: 'v1.0',
        contentHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
        date: '08 de Octubre, 2026',
        authorName: 'Dr. Mateo Silvetti',
        reason: 'Publicación de la objeción holista contra la visión aislada del modus tollens popperiano.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. La ilusión del experimento crucial aislado
El falsacionismo dogmático asume una estructura deductiva simplificada donde una hipótesis $T$ genera por sí sola la predicción $P$. Sin embargo, Pierre Duhem en 1906 y Willard Van Orman Quine en 1951 evidenciaron que en la física real ningún enunciado se somete a prueba en aislamiento.

Para obtener una predicción observable $P$, el científico debe asumir simultáneamente:
1. La teoría central $T$.
2. Un conjunto de hipótesis auxiliares $A_1, A_2, \\dots, A_k$ (como el funcionamiento óptico de los telescopios o la pureza química de los reactivos).
3. Condiciones iniciales $C$ y supuestos de calibración de los instrumentos.

Por lo tanto, la premisa deductiva real es:

$$(T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C) \\implies P$$

## 2. La indeterminación de la refutación
Si el experimento produce $\\neg P$, la regla de inferencia modus tollens únicamente nos permite concluir:

$$\\neg (T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C)$$

La lógica formal es categórica: el fallo experimental indica que **al menos uno** de los miembros del conjunto es falso, pero la lógica no nos dice cuál de ellos debe ser abandonado.

Un investigador puede perfectamente mantener intacta la teoría $T$ modificando una hipótesis auxiliar sobre la refracción atmosférica de su instrumento de medición, como hizo Galileo ante las discrepancias del tamaño aparente de las estrellas.

## 3. Consecuencias para los debates técnicos en Chen
Esta objeción demuestra por qué las citas en Chen no pueden ser simples marcas binarias de «aprobado/desaprobado». Una refutación argumental (etiqueta \`[- CONTRADICE]\`) debe detallar con precisión si ataca la hipótesis central, una premisa de contorno o la validez del instrumental de prueba.`,
    readTimeMinutes: 8,
    publishedDate: '08 de Octubre, 2026',
    lastUpdatedDate: '08 de Octubre, 2026',
    citationsOutbound: [
      {
        id: 'cit-duhem-to-popper',
        sourceArticleId: 'art-duhem-quine-holismo',
        sourceArticleSlug: 'tesis-holista-duhem-quine-objecion-falsacionismo',
        sourceArticleTitle: 'La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo',
        sourceVersionId: 'ver-duhem-1.0',
        sourceVersionHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
        sourceAuthorName: 'Dr. Mateo Silvetti',
        sourceAuthorHandle: 'msilvetti-logic',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-deductiva-falsacionismo-popperiano',
        targetArticleTitle: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'la observación rigurosa y confirmada de un único cisne negro basta deductivamente para destruir la proposición universal mediante la regla del modus tollens',
        relation: 'contradicts',
        reasoning: 'Objeción holista: una predicción experimental nunca se deduce de una hipótesis aislada T, sino de la conjunción (T ∧ A1 ∧ A2 ∧ C). Ante un resultado ¬P, la lógica formal sólo indica que la conjunción entera falló, pero no determina qué hipótesis individual debe descartarse.',
        createdAt: '08 de Octubre, 2026',
      },
    ],
    citedByInbound: [
      {
        id: 'cit-lakatos-to-duhem',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-falsacionismo-sofisticado',
        sourceArticleTitle: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
        sourceAuthorName: 'Dr. Julián Arispe',
        sourceAuthorHandle: 'jarispe-method',
        targetArticleId: 'art-duhem-quine-holismo',
        targetArticleSlug: 'tesis-holista-duhem-quine-objecion-falsacionismo',
        targetArticleTitle: 'La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo',
        targetVersionId: 'ver-duhem-1.0',
        targetVersionHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
        targetAuthorName: 'Dr. Mateo Silvetti',
        quotedSnippet: 'Un investigador puede perfectamente mantener intacta la teoría T modificando una hipótesis auxiliar sobre la refracción atmosférica',
        relation: 'extends',
        reasoning: 'Resuelve la ambigüedad de Duhem distinguiendo entre modificaciones ad-hoc regresivas (degenerativas) y ajustes que predicen hechos nuevos e inesperados (heurística positiva).',
        createdAt: '11 de Octubre, 2026',
      },
    ],
  },
  {
    id: 'art-lakatos-programas',
    slug: 'programas-investigacion-cientifica-falsacionismo-sofisticado',
    title: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
    subtitle: 'La síntesis de Imre Lakatos: cómo conciliar la fuerza lógica de Popper con la resistencia holista de Duhem.',
    author: INITIAL_AUTHORS[4], // Dr. Julián Arispe
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'hypothesis',
    epistemicNote: 'Modelo dinámico de cambio científico basado en heurísticas positivas y negativas en series de teorías.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
    versions: [
      {
        id: 'ver-lakatos-1.0',
        versionNumber: 'v1.0',
        contentHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
        date: '11 de Octubre, 2026',
        authorName: 'Dr. Julián Arispe',
        reason: 'Publicación de la propuesta integradora de programas de investigación y citas progresivas.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. Más allá del ensayo aislado: las series de teorías
El debate entre el falsacionismo puro de Popper y la objeción holista de Duhem-Quine parecía dejar a la epistemología en un callejón sin salida: o bien aceptamos un falsacionismo ingenuo que rechaza teorías fértiles ante la primera anomalía de laboratorio, o caemos en un relativismo donde cualquier dogma puede defenderse reacomodando ad-hoc premisas accesorias.

Imre Lakatos (1970) resolvió esta tensión proponiendo que la unidad de evaluación científica no es la teoría aislada, sino el **Programa de Investigación Científica (PIC)**.

## 2. Anatomía de un Programa de Investigación
Un PIC consta de dos zonas estructuralmente delimitadas:
- **Núcleo firme (*Hard Core*)**: Conjunto de postulados ontológicos centrales que los científicos deciden, por acuerdo metodológico (heurística negativa), no someter a refutación directa.
- **Cinturón protector (*Protective Belt*)**: Red de hipótesis auxiliares, modelos matemáticos y condiciones de contorno diseñadas específicamente para absorber las anomalías empíricas y ser modificadas conforme surgen discrepancias.

## 3. Criterio de demarcación dinámico: Programas progresivos vs degenerativos
¿Cuándo una modificación auxiliar es un avance legítimo y cuándo es una maniobra deshonesta?
- **Desplazamiento progresivo**: Cada nueva versión $T_{n+1}$ del cinturón protector no solo absorbe la anomalía anterior, sino que posee *excedente empírico*: predice hechos nuevos no sospechados que luego son corroborados (ej. el descubrimiento del planeta Neptuno para salvar las leyes de Newton).
- **Desplazamiento degenerativo**: Las modificaciones se introducen únicamente de forma defensiva para explicar anomalías ya observadas, sin generar nuevas predicciones independientes.

## 4. El protocolo Chen como realizador del modelo de Lakatos
El grafo de citas bidireccionales de Chen es la encarnación computacional del modelo de Lakatos. La relación \`[→ AMPLÍA]\` modela el crecimiento del cinturón protector, mientras que \`[- CONTRADICE]\` documenta las anomalías no resueltas que determinan si el programa sigue siendo progresivo o degenerativo.`,
    readTimeMinutes: 10,
    publishedDate: '11 de Octubre, 2026',
    lastUpdatedDate: '11 de Octubre, 2026',
    citationsOutbound: [
      {
        id: 'cit-lakatos-to-popper',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-falsacionismo-sofisticado',
        sourceArticleTitle: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
        sourceAuthorName: 'Dr. Julián Arispe',
        sourceAuthorHandle: 'jarispe-method',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-deductiva-falsacionismo-popperiano',
        targetArticleTitle: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Un enunciado sólo tiene estatuto científico si es susceptible de entrar en conflicto con observaciones empíricas posibles',
        relation: 'extends',
        reasoning: 'Extiende el criterio de falsación aislada hacia el modelo de Lakatos: los científicos no abandonan teorías ante anomalías aisladas, sino que defienden un núcleo firme mediante un cinturón protector de hipótesis auxiliares progresivas.',
        createdAt: '11 de Octubre, 2026',
      },
      {
        id: 'cit-lakatos-to-duhem',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-falsacionismo-sofisticado',
        sourceArticleTitle: 'Metodología de los programas de investigación científica y falsacionismo sofisticado',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: 'a3c9415ebc290177df819203ca99401823901bce4718290314ab81900139e8a7',
        sourceAuthorName: 'Dr. Julián Arispe',
        sourceAuthorHandle: 'jarispe-method',
        targetArticleId: 'art-duhem-quine-holismo',
        targetArticleSlug: 'tesis-holista-duhem-quine-objecion-falsacionismo',
        targetArticleTitle: 'La tesis holista de Duhem-Quine como objeción al falsacionismo ingenuo',
        targetVersionId: 'ver-duhem-1.0',
        targetVersionHash: '4b7e12f0a1c99831ef78201bca90138249018442bc1947e90192348abcdf1904',
        targetAuthorName: 'Dr. Mateo Silvetti',
        quotedSnippet: 'Un investigador puede perfectamente mantener intacta la teoría T modificando una hipótesis auxiliar sobre la refracción atmosférica',
        relation: 'extends',
        reasoning: 'Resuelve la ambigüedad de Duhem distinguiendo entre modificaciones ad-hoc regresivas (degenerativas) y ajustes que predicen hechos nuevos e inesperados (heurística positiva).',
        createdAt: '11 de Octubre, 2026',
      },
    ],
    citedByInbound: [],
  },
];

export const INITIAL_AUDIT_LOGS: ModerationAuditLog[] = [
  {
    id: 'mod-log-01',
    incidentHash: 'inc-9f8a32bc71',
    targetArticleId: 'art-flp-consenso',
    targetArticleTitle: 'Imposibilidad de consenso determinista en redes asíncronas no confiables (Teorema FLP)',
    targetVersionHash: '7e9f3b2184ad2c09ef488172b0c1e34589d892a013f99e4b3c82d911a03fc551',
    reporterAnonHash: 'usr-hash-4a11c0',
    violationType: 'misattribution',
    actionTaken: 'dismissed',
    moderatorRole: 'Comité de Revisión Epistémica (Par Ciego)',
    date: '14 de Octubre, 2026',
    publicRationale: 'El denunciante alegaba omisión de atribución de Dolev et al. (1983). Se comprobó que el texto cita formalmente la publicación fundacional FLP 1985 con la atribución canónica de la ACM.',
  },
  {
    id: 'mod-log-02',
    incidentHash: 'inc-124bd90e55',
    targetArticleId: 'art-falsacionismo-popper',
    targetArticleTitle: 'La asimetría deductiva del falsacionismo popperiano y los límites del empirismo',
    targetVersionHash: '8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca92019e1',
    reporterAnonHash: 'usr-hash-88c91f',
    violationType: 'spam',
    actionTaken: 'dismissed',
    moderatorRole: 'Moderador de Área (Filosofía de la Ciencia)',
    date: '19 de Octubre, 2026',
    publicRationale: 'Reporte automático desestimado: no se identificaron patrones de contenido generado para posicionamiento comercial.',
  },
];
