import { Article, Author, ModerationAuditLog } from '../types';

export const INITIAL_AUTHORS: Author[] = [
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
    id: 'auth-duhem-quine',
    name: 'Pierre Duhem & W.V.O. Quine (Edición comentada)',
    handle: 'duhem-quine-archive',
    email: 'archivo@filosofia-analitica-open.org',
    role: 'Comité de Edición de Textos Históricos de Epistemología',
    githubUser: 'filosofia-analitica-open',
    orcidId: '0000-0002-6190-3341',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-imre-lakatos',
    name: 'Imre Lakatos (Archivo Abierto)',
    handle: 'lakatos-archive',
    email: 'lakatos-metodologia@heuristica-abierta.org',
    role: 'Grupo de Investigación en Dinámica de Teorías Científicas',
    githubUser: 'heuristica-metodo',
    orcidId: '0000-0001-7721-5509',
    avatarUrl: '',
    isErased: false,
  },
  {
    id: 'auth-mateo-valdes',
    name: 'Dr. Mateo Valdés · Sistemas Distribuidos',
    handle: 'mvaldes-distrib',
    email: 'valdes@distrib-systems-lab.org',
    role: 'Profesor Principal de Arquitecturas Distribuidas y Tolerancia a Fallas',
    githubUser: 'mateovaldes-p2p',
    orcidId: '0000-0002-1825-0097',
    avatarUrl: '',
    isErased: false,
  },
];

export const INITIAL_ARTICLES: Article[] = [
  // 1. Dra. Elena Vasconcelos: Falsacionismo popperiano
  {
    id: 'art-falsacionismo-popper',
    slug: 'asimetria-logica-falsacionismo-problema-induccion',
    title: 'La asimetría lógica del falsacionismo y el problema de la inducción',
    subtitle: 'Por qué la verificación empírica es deductivamente imposible y la refutación formal constituye el único motor genuino de demarcación científica.',
    author: INITIAL_AUTHORS[0], // Dra. Elena Vasconcelos
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'hypothesis',
    epistemicNote: 'Marco epistemológico falsacionista formulado como hipótesis de demarcación metodológica para publicaciones en Chen.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
    versions: [
      {
        id: 'ver-popper-1.0',
        versionNumber: 'v1.0',
        contentHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        date: '10 de Octubre, 2026',
        authorName: 'Dra. Elena Vasconcelos',
        reason: 'Publicación original del artículo con formulación de la asimetría lógica del Modus Tollens.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. El fracaso de la inferencia inductiva

Desde David Hume sabemos que ningún número finito de observaciones particulares favorables ($P_1, P_2, \\dots, P_n$) autoriza lógicamente a inferir un enunciado universal sobre la totalidad de los fenómenos. Aunque observemos diez millones de cisnes blancos, no existe deducción formal válida que garantice la ausencia de un cisne de otro color en el futuro.

Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.

Esta verdad elemental es la base de la asimetría lógica: las proposiciones universales nunca son derivables a partir de enunciados singulares, pero sí pueden ser contradichas de forma concluyente por un solo enunciado singular.

## 2. La regla formal del Modus Tollens

La estructura lógica de la refutación científica no procede sumando probabilidades estocásticas, sino aplicando la regla deductiva clásica del *modus tollens*:

$$\\frac{T \\implies P, \\quad \\neg P}{\\neg T}$$

Donde $T$ representa el sistema teórico y $P$ una predicción observable arriesgada. Si la observación controlada constata $\\neg P$, la falsedad de la teoría se deduce de manera inevitable. En cambio, si se constata $P$, la teoría no queda "probada", sino meramente *corroborada de forma provisional* mientras persista sin ser refutada.

## 3. Criterio de demarcación frente a los dogmatismos

Un sistema conceptual solo pertenece a la ciencia empírica si formula predicciones que puedan entrar en conflicto con la experiencia. Una afirmación que explica cualquier resultado imaginable sin arriesgar nada no es una teoría profunda; es un mito o un dogma inmune a la crítica.

Por este motivo, en el protocolo Chen exigimos que toda tesis técnica declare con precisión su condición de falsabilidad: *«¿Qué experimento u observación concebible obligaría a abandonar esta afirmación?»*.`,
    readTimeMinutes: 7,
    publishedDate: '10 de Octubre, 2026',
    lastUpdatedDate: '10 de Octubre, 2026',
    citationsOutbound: [],
    citedByInbound: [
      {
        id: 'cit-popper-canonical',
        sourceArticleId: 'art-falsacionismo-popper',
        sourceArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        sourceArticleTitle: 'Logik der Forschung (1934)',
        sourceVersionId: 'ver-popper-origin',
        sourceVersionHash: '1934popper8f3a9c',
        sourceAuthorName: 'Karl Popper (1934)',
        sourceAuthorHandle: 'popper-canon',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'las proposiciones universales nunca son derivables a partir de enunciados singulares, pero sí pueden ser contradichas de forma concluyente por un solo enunciado singular',
        relation: 'supports',
        reasoning: 'Demostración formal deductiva del modus tollens como único mecanismo lógicamente válido para el progreso del conocimiento sin caer en el problema de la inducción.',
        createdAt: '10 de Octubre, 2026',
      },
      {
        id: 'cit-duhem-to-vasconcelos',
        sourceArticleId: 'art-duhem-quine-holismo',
        sourceArticleSlug: 'holismo-confirmacional-ninguna-hipotesis-se-contrasta-en-solitario',
        sourceArticleTitle: 'El holismo confirmacional: por qué ninguna hipótesis se contrasta en solitario',
        sourceVersionId: 'ver-duhem-1.0',
        sourceVersionHash: '5a2e88f0bc2100874e112450091aa389104ef9018442bc1947e90192348abcdf',
        sourceAuthorName: 'Pierre Duhem & W.V.O. Quine (Edición comentada)',
        sourceAuthorHandle: 'duhem-quine-archive',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.',
        relation: 'contradicts',
        reasoning: 'Objeción crucial (tesis Duhem-Quine): ninguna hipótesis se contrasta en aislamiento. Si falla una predicción, el modus tollens solo demuestra que el conjunto (hipótesis + supuestos auxiliares + condiciones instrumentales) contiene un error, no qué elemento individual debe ser descartado.',
        createdAt: '14 de Octubre, 2026',
      },
      {
        id: 'cit-lakatos-to-vasconcelos',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-cinturones-protectores',
        sourceArticleTitle: 'Programas de investigación científica y cinturones protectores',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: '7c4b19e290881bce4718290314ab81900139e8a71203ca99401823901bce4718',
        sourceAuthorName: 'Imre Lakatos (Archivo Abierto)',
        sourceAuthorHandle: 'lakatos-archive',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Un sistema conceptual solo pertenece a la ciencia empírica si formula predicciones que puedan entrar en conflicto con la experiencia.',
        relation: 'extends',
        reasoning: 'Extiende el falsacionismo ingenuo de enunciados aislados hacia el concepto de Programas de Investigación Científica (PIC): las teorías no mueren por anomalías singulares, sino cuando su cinturón protector degenera y es superado por un programa progresivo rival.',
        createdAt: '18 de Octubre, 2026',
      },
    ],
  },

  // 2. Pierre Duhem & W.V.O. Quine: Holismo confirmacional
  {
    id: 'art-duhem-quine-holismo',
    slug: 'holismo-confirmacional-ninguna-hipotesis-se-contrasta-en-solitario',
    title: 'El holismo confirmacional: por qué ninguna hipótesis se contrasta en solitario',
    subtitle: 'La objeción definitiva contra el falsacionismo ingenuo: la indeterminación deductiva ante los fracasos experimentales.',
    author: INITIAL_AUTHORS[1], // Pierre Duhem & W.V.O. Quine
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'fact',
    epistemicNote: 'Demostración de lógica de la ciencia ampliamente consensuada en la filosofía analítica del siglo XX.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '5a2e88f0bc2100874e112450091aa389104ef9018442bc1947e90192348abcdf',
    versions: [
      {
        id: 'ver-duhem-1.0',
        versionNumber: 'v1.0',
        contentHash: '5a2e88f0bc2100874e112450091aa389104ef9018442bc1947e90192348abcdf',
        date: '14 de Octubre, 2026',
        authorName: 'Pierre Duhem & W.V.O. Quine (Edición comentada)',
        reason: 'Publicación de la objeción holista contra la visión aislada del modus tollens popperiano.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. La ficción del experimento crucial aislado

El falsacionismo popperiano imagina una confrontación idílica entre una teoría $T$ aislada y un hecho experimental $\\neg P$. Sin embargo, en la física real ningún enunciado se somete a prueba en soledad. Para derivar una predicción concreta $P$, el investigador se ve obligado a asumir simultáneamente:

1. La hipótesis teórica principal $T$.
2. Una serie de hipótesis auxiliares $A_1, A_2, \\dots, A_k$ (teorías ópticas de los telescopios, pureza de los materiales, ecuaciones de calibración).
3. Condiciones iniciales específicas del entorno $C_1, C_2$.

Por ende, la premisa deductiva no es $T \\implies P$, sino una conjunción corporativa:

$$(T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C) \\implies P$$

## 2. La indeterminación de la refutación

Cuando la experiencia arroja $\\neg P$, el *modus tollens* funciona estrictamente sobre la totalidad de la conjunción:

$$\\neg (T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C)$$

La lógica formal no indica **cuál** de los elementos es el responsable del fallo. El científico puede salvar legítimamente la teoría central $T$ modificando una hipótesis auxiliar sobre la refracción de la lente o sobre la conductividad del cable.

Una hipótesis nunca se somete a contraste de forma aislada; siempre se refuta un sistema entero de supuestos auxiliares.

## 3. Implicaciones para el protocolo de debate Chen

Esta lección de epistemología explica por qué en Chen las citas de réplica no pueden ser un mero pulgar hacia abajo o una descalificación sumaria. Quien cite con \`[ - Contradice ]\` debe identificar explícitamente si su contraejemplo ataca la hipótesis ontológica central, las hipótesis de contorno o la validez de los instrumentos de medición.`,
    readTimeMinutes: 8,
    publishedDate: '14 de Octubre, 2026',
    lastUpdatedDate: '14 de Octubre, 2026',
    citationsOutbound: [
      {
        id: 'cit-duhem-to-vasconcelos',
        sourceArticleId: 'art-duhem-quine-holismo',
        sourceArticleSlug: 'holismo-confirmacional-ninguna-hipotesis-se-contrasta-en-solitario',
        sourceArticleTitle: 'El holismo confirmacional: por qué ninguna hipótesis se contrasta en solitario',
        sourceVersionId: 'ver-duhem-1.0',
        sourceVersionHash: '5a2e88f0bc2100874e112450091aa389104ef9018442bc1947e90192348abcdf',
        sourceAuthorName: 'Pierre Duhem & W.V.O. Quine (Edición comentada)',
        sourceAuthorHandle: 'duhem-quine-archive',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.',
        relation: 'contradicts',
        reasoning: 'Objeción crucial (tesis Duhem-Quine): ninguna hipótesis se contrasta en aislamiento. Si falla una predicción, el modus tollens solo demuestra que el conjunto (hipótesis + supuestos auxiliares + condiciones instrumentales) contiene un error, no qué elemento individual debe ser descartado.',
        createdAt: '14 de Octubre, 2026',
      },
    ],
    citedByInbound: [],
  },

  // 3. Imre Lakatos: Programas de investigación científica
  {
    id: 'art-lakatos-programas',
    slug: 'programas-investigacion-cientifica-cinturones-protectores',
    title: 'Programas de investigación científica y cinturones protectores',
    subtitle: 'La metodología de Lakatos: cómo resolver la tensión entre el rigor lógico popperiano y la resistencia holista de Duhem.',
    author: INITIAL_AUTHORS[2], // Imre Lakatos (Archivo Abierto)
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'hypothesis',
    epistemicNote: 'Modelo dinámico de evaluación del progreso en series de teorías sucesivas.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '7c4b19e290881bce4718290314ab81900139e8a71203ca99401823901bce4718',
    versions: [
      {
        id: 'ver-lakatos-1.0',
        versionNumber: 'v1.0',
        contentHash: '7c4b19e290881bce4718290314ab81900139e8a71203ca99401823901bce4718',
        date: '18 de Octubre, 2026',
        authorName: 'Imre Lakatos (Archivo Abierto)',
        reason: 'Publicación formal de la metodología de programas de investigación y cinturones protectores.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. La superación del falsacionismo ingenuo

Si los científicos hubieran actuado como aconsejaba el falsacionismo ingenuo, la física moderna jamás habría existido. La teoría de gravitación de Newton nació refutada por la órbita anómala de la Luna y la precesión del perihelio de Mercurio. Lejos de abandonar la teoría, los físicos perseveraron reajustando hipótesis auxiliares.

La ciencia no progresa por refutaciones aisladas, sino mediante programas de investigación con un núcleo firme protegido por un cinturón heurístico modificable.

## 2. Anatomía de un Programa de Investigación Científica (PIC)

Un PIC consta de dos estructuras bien diferenciadas:

- **El núcleo firme (*Hard Core*)**: Conjunto de principios fundamentales que la comunidad científica decide no someter a falsación mediante una directriz metodológica (heurística negativa).
- **El cinturón protector (*Protective Belt*)**: Serie de hipótesis auxiliares, modelos de aproximación y técnicas de medición que reciben el impacto de los experimentos y son ajustadas o sustituidas para absorber anomalías.

## 3. Desplazamientos progresivos vs. degenerativos

¿Cómo distinguir un ajuste legítimo de una trampa pseudocientífica *ad-hoc*?

- **Desplazamiento Progresivo**: Cada nueva versión del cinturón protector $T_{n+1}$ no solo explica las anomalías precedentes, sino que posee *excedente empírico*: predice hechos nuevos, inesperados y audaces que posteriormente resultan confirmados (como la predicción de Neptuno para salvar las ecuaciones newtonianas).
- **Desplazamiento Degenerativo**: Las hipótesis se introducen exclusivamente a posteriori para tapar parches sin abrir ninguna nueva línea de predicción.

## 4. El protocolo Chen como cinturón protector dialéctico

En Chen, la etiqueta \`[ → Amplía ]\` representa exactamente el crecimiento progresivo de un cinturón protector. Los autores conectan extensiones que ensanchan el poder explicativo de una tesis sin abandonar su núcleo formal.`,
    readTimeMinutes: 9,
    publishedDate: '18 de Octubre, 2026',
    lastUpdatedDate: '18 de Octubre, 2026',
    citationsOutbound: [
      {
        id: 'cit-lakatos-to-vasconcelos',
        sourceArticleId: 'art-lakatos-programas',
        sourceArticleSlug: 'programas-investigacion-cientifica-cinturones-protectores',
        sourceArticleTitle: 'Programas de investigación científica y cinturones protectores',
        sourceVersionId: 'ver-lakatos-1.0',
        sourceVersionHash: '7c4b19e290881bce4718290314ab81900139e8a71203ca99401823901bce4718',
        sourceAuthorName: 'Imre Lakatos (Archivo Abierto)',
        sourceAuthorHandle: 'lakatos-archive',
        targetArticleId: 'art-falsacionismo-popper',
        targetArticleSlug: 'asimetria-logica-falsacionismo-problema-induccion',
        targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
        targetVersionId: 'ver-popper-1.0',
        targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
        targetAuthorName: 'Dra. Elena Vasconcelos',
        quotedSnippet: 'Un sistema conceptual solo pertenece a la ciencia empírica si formula predicciones que puedan entrar en conflicto con la experiencia.',
        relation: 'extends',
        reasoning: 'Extiende el falsacionismo ingenuo de enunciados aislados hacia el concepto de Programas de Investigación Científica (PIC): las teorías no mueren por anomalías singulares, sino cuando su cinturón protector degenera y es superado por un programa progresivo rival.',
        createdAt: '18 de Octubre, 2026',
      },
    ],
    citedByInbound: [],
  },

  // 4. Dr. Mateo Valdés: Sistemas Distribuidos y PBFT
  {
    id: 'art-consenso-pbft-valdes',
    slug: 'limites-consenso-determinista-tolerancia-faltas-bizantinas-pbft',
    title: 'Límites del consenso determinista y tolerancia a faltas bizantinas (PBFT)',
    subtitle: 'Cómo superar el pesimismo del Teorema FLP mediante sincronía parcial y quórums de dos tercios.',
    author: INITIAL_AUTHORS[3], // Dr. Mateo Valdés
    license: 'CC BY-SA 4.0',
    epistemicStatus: 'fact',
    epistemicNote: 'Demostración de safety condicional y liveness adaptativo verificado en producción.',
    currentVersionNumber: 'v1.0',
    currentVersionHash: '4b9e10d48174aa92bc11200388d01912a7e2b10901e9124403cd84b55ae21b03',
    versions: [
      {
        id: 'ver-valdes-1.0',
        versionNumber: 'v1.0',
        contentHash: '4b9e10d48174aa92bc11200388d01912a7e2b10901e9124403cd84b55ae21b03',
        date: '22 de Octubre, 2026',
        authorName: 'Dr. Mateo Valdés · Sistemas Distribuidos',
        reason: 'Publicación formal de la formulación de PBFT y quórums bizantinos bajo sincronía débil.',
        contentMarkdown: '',
      },
    ],
    contentMarkdown: `## 1. El límite formal del Teorema FLP (1985)

El célebre teorema de Fischer, Lynch y Paterson demostró una de las cotas deductivas más severas de la computación distribuida: en una red puramente asíncrona, no existe ningún algoritmo de consenso determinista que pueda garantizar simultáneamente consistencia estricta (*safety*) y progreso continuo (*liveness*) si tan solo un único proceso puede fallar por detención (*crash failure*).

La complejidad algorítmica de los sistemas distribuidos modernos hace inviable el consenso determinista en redes no confiables si nos atenemos a la asincronía absoluta.

## 2. La solución de Castro & Liskov (1999): Sincronía parcial

El protocolo Practical Byzantine Fault Tolerance (PBFT) demostró que el dilema se elude introduciendo una hipótesis física realista: la *sincronía parcial o sincronía débil*. 

Bajo este modelo:
1. **Safety incondicional**: Jamás se llega a estados divergentes (bifurcaciones de consenso), incluso si la red sufre ataques de denegación de servicio o particiones arbitrarias.
2. **Liveness eventual**: El sistema avanza con certeza matemática tan pronto como los retardos de transmisión $\\Delta$ se estabilicen temporalmente por debajo de un umbral finito mediante cambios de vista (*view-changes*).

## 3. La regla de quórum de dos tercios ($3f + 1$)

Para tolerar hasta $f$ nodos actuando de forma maliciosa o bizantina coordinada, se requiere un conjunto total de:

$$N \\ge 3f + 1$$

En cada ronda criptográfica (Pre-Prepare, Prepare, Commit), cada réplica espera confirmaciones de una mayoría calificada de $2f + 1$ votos. Esto garantiza que cualesquiera dos mayorías de quórum se intersecten en al menos un nodo honesto, impidiendo el doble gasto o la colusión.

## 4. Conclusión

El consenso seguro y determinista no es una utopía matemática: es una realidad de ingeniería cuando la arquitectura separa rigurosamente las garantías invariables de consistencia de la vivacidad adaptativa.`,
    readTimeMinutes: 10,
    publishedDate: '22 de Octubre, 2026',
    lastUpdatedDate: '22 de Octubre, 2026',
    citationsOutbound: [],
    citedByInbound: [],
  },
];

export const INITIAL_AUDIT_LOGS: ModerationAuditLog[] = [
  {
    id: 'mod-log-01',
    incidentHash: 'inc-9f8a32bc71',
    targetArticleId: 'art-falsacionismo-popper',
    targetArticleTitle: 'La asimetría lógica del falsacionismo y el problema de la inducción',
    targetVersionHash: '8f3a9c2174de0b89af11200192ea01992bc443187a10294e0193bbca92019e1',
    reporterAnonHash: 'usr-hash-4a11c0',
    violationType: 'misattribution',
    actionTaken: 'dismissed',
    moderatorRole: 'Comité de Revisión Epistémica (Par Ciego)',
    date: '16 de Octubre, 2026',
    publicRationale: 'El denunciante argumentaba falta de atribución de David Hume en el planteamiento inductivo. Se constató que la sección 1 del artículo cita expresamente a Hume con mención expresa al problema de los cisnes.',
  },
  {
    id: 'mod-log-02',
    incidentHash: 'inc-124bd90e55',
    targetArticleId: 'art-consenso-pbft-valdes',
    targetArticleTitle: 'Límites del consenso determinista y tolerancia a faltas bizantinas (PBFT)',
    targetVersionHash: '4b9e10d48174aa92bc11200388d01912a7e2b10901e9124403cd84b55ae21b03',
    reporterAnonHash: 'usr-hash-88c91f',
    violationType: 'spam',
    actionTaken: 'dismissed',
    moderatorRole: 'Moderador de Área (Sistemas Distribuidos)',
    date: '24 de Octubre, 2026',
    publicRationale: 'Reporte automático desestimado tras verificación formal: la publicación contiene demostraciones rigurosas de quórums bizantinos conforme al estándar ACM/IEEE.',
  },
];
