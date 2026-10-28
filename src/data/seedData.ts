import { Author, ArticleVersion, Citation, ModerationReport, DatabaseState } from '../types/chen';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'auth-vasconcelos',
    handle: 'elena-vasconcelos',
    realName: 'Dra. Elena Vasconcelos',
    roleAndAffiliation: 'Investigadora Principal en Epistemología y Lógica · CSIC / UCM',
    githubUser: 'evasconcelos-epist',
    orcidId: '0000-0002-1825-0097',
    isVerified: true,
    isAnonymized: false,
    erasedAt: null,
  },
  {
    id: 'auth-popper',
    handle: 'archivo-popper',
    realName: 'Archivo Karl Popper (Edición Abierta)',
    roleAndAffiliation: 'Fideicomiso de Textos Canónicos de Filosofía de la Ciencia',
    githubUser: 'popper-archive-org',
    orcidId: '0000-0001-9999-1934',
    isVerified: true,
    isAnonymized: false,
    erasedAt: null,
  },
  {
    id: 'auth-salgado',
    handle: 'hsalgado-holismo',
    realName: 'Dr. Héctor Salgado',
    roleAndAffiliation: 'Catedrático de Filosofía del Lenguaje y Lógica Analítica · UBA',
    githubUser: 'hsalgado-phil',
    orcidId: '0000-0003-4412-8890',
    isVerified: true,
    isAnonymized: false,
    erasedAt: null,
  },
  {
    id: 'auth-mendez',
    handle: 'clara-mendez',
    realName: 'Dra. Clara Méndez',
    roleAndAffiliation: 'Investigadora en Metodología Científica y Dinámica de Teorías · UNAM',
    githubUser: 'cmendez-lakatos',
    orcidId: '0000-0002-7710-3311',
    isVerified: true,
    isAnonymized: false,
    erasedAt: null,
  },
  {
    id: 'auth-valdes',
    handle: 'mvaldes-dist',
    realName: 'Ing. Mateo Valdés',
    roleAndAffiliation: 'Arquitecto de Protocolos Distribuidos y Consenso P2P · Distributed Systems Lab',
    githubUser: 'mvaldes-systems',
    orcidId: '0000-0002-9901-4433',
    isVerified: true,
    isAnonymized: false,
    erasedAt: null,
  },
];

export const INITIAL_ARTICLES: ArticleVersion[] = [
  // Artículo 1: Elena Vasconcelos
  {
    versionId: 'ver-vasconcelos-v1',
    articleId: 'art-vasconcelos-falsacionismo',
    versionNumber: 1,
    title: 'La asimetría lógica del falsacionismo y el límite de la inducción empírica',
    subtitle: 'Por qué la verificación positiva es deductivamente insostenible y la refutación formal constituye el único criterio de demarcación científica rigurosa.',
    area: 'Epistemología',
    authorId: 'auth-vasconcelos',
    epistemicStatus: 'hypothesis',
    license: 'CC BY-SA 4.0',
    createdAt: '12 de Octubre, 2026',
    readingTimeMinutes: 8,
    contentHash: '8f3a9c21b4e091a27e3d81fa09c812d45e9903b1287c90e14a552bf10984ee21',
    contentMarkdown: `## 1. El colapso formal de la inferencia inductiva

La pretensión de fundamentar el conocimiento científico sobre la acumulación pasiva de observaciones particulares constituye el error metodológico más persistente de la epistemología tradicional. Tal como expuso David Hume, no existe ningún puente lógico válido que permita transitar desde enunciados singulares repetidos hacia una ley universal irrestricta. El hecho observable de haber registrado diez millones de cisnes blancos no autoriza deductivamente a afirmar que todos los cisnes son blancos.

Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.

Esta asimetría lógica elemental entre verificación y falsación es irrevocable: las proposiciones universales jamás pueden derivarse de observaciones finitas, pero sí pueden ser destruidas deductivamente por una sola instancia contradictoria verificada. Intentar salvar la inducción apelando al cálculo de probabilidades incurre en una regresión infinita o en una petición de principio insalvable.

## 2. La estructura deductiva del Modus Tollens

Frente a la debilidad de la verificación inductiva, el falsacionismo popperiano ancla el progreso científico en la regla deductiva clásica del *modus tollens*:

$$\\frac{T \\implies P, \\quad \\neg P}{\\neg T}$$

Donde $T$ representa el sistema teórico formulado axiomáticamente y $P$ es una consecuencia empírica observable deducida con precisión matemática. Si el experimento u observación controlada constata formalmente $\\neg P$, la falsedad de la teoría se deduce de manera inevitable y definitiva. En cambio, si la observación confirma $P$, la teoría no queda demostrada ni "confirmada"; simplemente sobrevive provisionalmente con un estatus de corroboración transitoria hasta el próximo intento de refutación sistemática.

## 3. Criterio de demarcación estricto frente a las pseudociencias

Un enunciado conceptual o una tesis ensayística solo pertenece al dominio del conocimiento racional si es intrínsecamente susceptible de entrar en contradicción directa con el mundo empírico. Cuando una teoría se inmuniza mediante formulaciones vagas o introduce salvedades ad-hoc que explican cualquier resultado contradictorio, abandona el terreno de la ciencia y se transforma en un dogma circular.

Un sistema conceptual solo pertenece a la ciencia empírica si formula predicciones que puedan entrar en conflicto con la experiencia.

La demarcación no depende de la certeza de partida del autor, sino de su predisposición metodológica: formular con audacia qué hallazgo observable obligaría a abandonar la hipótesis. Sin esa condición de falsabilidad explícita, no existe diálogo intelectual verificable, sino mera retórica persuasiva.

## 4. Aplicación al protocolo de argumentación Chen

En el protocolo Chen, esta asimetría lógica se traslada a la arquitectura del grafo de publicaciones. No toleramos sistemas de votación por popularidad, likes o algoritmos opacos de indignación, porque la verdad científica jamás ha sido un asunto de mayorías electorales. Cada texto publicado debe declarar su condición de falsabilidad e interactuar con réplicas estructuradas que demuestren si aportan una deducción formal congruente, un contraejemplo riguroso o una ampliación delimitada del marco epistemológico.`,
  },

  // Artículo 2: Karl Popper
  {
    versionId: 'ver-popper-v1',
    articleId: 'art-popper-modus-tollens',
    versionNumber: 1,
    title: 'Modus tollens y la corroboración provisional en la lógica de la investigación',
    subtitle: 'Análisis axiomático de la deducción estricta: superando el inductivismo del Círculo de Viena mediante la corroboración negativa.',
    area: 'Filosofía de la Ciencia',
    authorId: 'auth-popper',
    epistemicStatus: 'fact',
    license: 'CC BY-SA 4.0',
    createdAt: '15 de Octubre, 2026',
    readingTimeMinutes: 7,
    contentHash: '1934popper8f3a9c7b2e104d8a9f338290192ea01992bc443187a10294e0193bbca920',
    contentMarkdown: `## 1. La refutación deductiva como único mecanismo seguro

En *Logik der Forschung* (1934) se demostró que el positivismo lógico incurría en una contradicción insostenible al intentar reducir el significado a la verificabilidad empírica. Los enunciados universales que componen las leyes físicas (tales como las leyes de la termodinámica o la gravitación) tienen un alcance infinito en el espacio y en el tiempo. Ninguna serie finita de mediciones experimentales puede jamás agotar su verificación.

Por consiguiente, si exigimos verificación concluyente para otorgar validez epistémica a una proposición, debemos descartar las leyes naturales más fundamentales de la ciencia. La salida a esta encrucijada no consiste en debilitar la lógica apelando a la inducción probabilística, sino en reconocer que el único esquema deductivamente riguroso es la refutación orientada mediante *modus tollens*.

## 2. El concepto formal de corroboración frente a probabilidad

Es común confundir el grado de corroboración de una teoría con una probabilidad matemática subjetiva. Esta confusión es letal para el rigor científico. Una teoría sumamente probable suele ser aquella que dice muy poco sobre la realidad (un enunciado tautológico tiene probabilidad 1, pero nulo contenido informativo). Las grandes teorías científicas, como la relatividad general de Einstein, poseen una probabilidad a priori extraordinariamente baja porque formulan predicciones asombrosamente arriesgadas y precisas.

La corroboración no es un valor de verdad definitivo ni una acumulación acumulativa de certezas; es únicamente un informe evaluativo del rendimiento histórico de una teoría frente a los ensayos sistemáticos concebidos para derribarla. Cuanto más severas sean las pruebas superadas, mayor será su grado de corroboración provisional.

## 3. La responsabilidad epistémica del investigador

El científico genuino no busca proteger su hipótesis contra las objeciones, sino que actúa como su crítico más implacable. En una comunidad de argumentación abierta, el aporte más valioso que un par puede formular no es la alabanza complaciente, sino la identificación rigurosa de una incompatibilidad empírica o formal. La ciencia avanza eliminando el error mediante el descarte deductivo, despejando el camino hacia conjeturas de mayor alcance explicativo.`,
  },

  // Artículo 3: Héctor Salgado (Holismo confirmacional)
  {
    versionId: 'ver-duhem-quine-v1',
    articleId: 'art-salgado-holismo-duhem',
    versionNumber: 1,
    title: 'El holismo confirmacional: por qué ninguna hipótesis aislada enfrenta el tribunal de la experiencia',
    subtitle: 'La tesis de Duhem-Quine y la indeterminación de la refutación: los límites insalvables del falsacionismo popperiano ingenuo.',
    area: 'Epistemología',
    authorId: 'auth-salgado',
    epistemicStatus: 'hypothesis',
    license: 'CC BY-SA 4.0',
    createdAt: '18 de Octubre, 2026',
    readingTimeMinutes: 9,
    contentHash: '5a2e88f0bc2100874e112450091aa389104ef9018442bc1947e90192348abcdf1904',
    contentMarkdown: `## 1. La ilusión del experimento crucial aislado

El falsacionismo popperiano presupone un esquema simplificado y descontextualizado en el que una hipótesis teórica $T$ se enfrenta en solitario al tribunal de la experiencia y resulta fulminada por un único contraejemplo $\\neg P$. Sin embargo, la historia de la ciencia y la epistemología analítica demuestran que esta confrontación aislada jamás ocurre en la práctica científica real.

Tal como señalaron Pierre Duhem en 1906 y Willard Van Orman Quine en 1951, los enunciados acerca del mundo físico no comparecen individualmente ante el experimento, sino como un bloque interconectado. Para deducir una predicción observable $P$, el investigador nunca utiliza únicamente la teoría central $T$, sino una vasta red corporativa compuesta por:
1. La hipótesis ontológica central $T$.
2. Hipótesis auxiliares sobre el comportamiento de los instrumentos $A_1, A_2, \\dots, A_k$.
3. Condiciones iniciales del entorno experimental $C_1, C_2$.
4. Supuestos de calibración y teorías ópticas, eléctricas o de software subyacentes.

## 2. La formulación lógica de la indeterminación

La premisa deductiva que efectivamente se somete a prueba no es $T \\implies P$, sino una conjunción solidaria:

$$(T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C) \\implies P$$

Cuando el experimento arroja un resultado anómalo $\\neg P$, la aplicación ineludible del *modus tollens* produce estrictamente:

$$\\neg (T \\land A_1 \\land A_2 \\land \\dots \\land A_k \\land C)$$

La lógica formal es contundente e implacable: la experiencia nos informa de que **al menos uno** de los componentes de la conjunción es falso, pero la lógica formal es absolutamente incapaz de señalarnos cuál de ellos debe ser sacrificado.

## 3. La maleabilidad de la red teórica

Ante un supuesto cisne negro u órbita planetaria desviada, el científico no tiene por qué abandonar la teoría central de Newton o de la termodinámica. Puede optar, con plena legitimidad lógica, por revisar la hipótesis auxiliar sobre la refracción atmosférica del telescopio, sospechar de la pureza de los reactivos químicos o conjeturar la presencia de un cuerpo celeste no observado (como hicieron Adams y Le Verrier para salvar a Newton mediante el descubrimiento de Neptuno).

Cualquier enunciado particular puede conservarse como verdadero si se introducen ajustes suficientemente audaces en otras zonas de la red epistémica. Del mismo modo, ningún enunciado es inmune a la revisión. La imagen del "experimento crucial" que derriba una teoría en un solo instante es un mito pedagógico.

## 4. Consecuencias para las citas con función en Chen

Esta realidad holista fundamenta la necesidad de estructurar debates argumentales profundos. La etiqueta \`[- Contradice]\` en Chen no puede ser una descalificación abstracta; debe especificar si la objeción refuta la hipótesis central, si ataca una premisa de contorno o si expone un fallo en el diseño experimental. El desacuerdo científico fecundo es un debate sobre qué hipótesis auxiliar reajustar para maximizar el poder explicativo general.`,
  },

  // Artículo 4: Clara Méndez (Lakatos)
  {
    versionId: 'ver-lakatos-v1',
    articleId: 'art-mendez-lakatos-programas',
    versionNumber: 1,
    title: 'Programas de investigación científica: núcleo firme y cinturón protector heurístico',
    subtitle: 'La síntesis dialéctica de Imre Lakatos: conciliando la fuerza del rigor lógico con la resistencia histórica del holismo.',
    area: 'Filosofía de la Ciencia',
    authorId: 'auth-mendez',
    epistemicStatus: 'hypothesis',
    license: 'CC BY-SA 4.0',
    createdAt: '22 de Octubre, 2026',
    readingTimeMinutes: 10,
    contentHash: '7c4b19e290881bce4718290314ab81900139e8a71203ca99401823901bce47182903',
    contentMarkdown: `## 1. La superación del dilema entre falsacionismo e inconmensurabilidad

El debate epistemológico de mediados del siglo XX parecía atrapado en una falsa dicotomía: o bien aceptábamos un falsacionismo ingenuo que rechaza teorías fértiles ante la primera anomalía de laboratorio, o caíamos en el relativismo sociológico de Thomas Kuhn, donde el cambio de paradigmas se asimilaba a una conversión religiosa colectiva sin criterios racionales de progreso.

Imre Lakatos (1970) resolvió magistralmente esta tensión demostrando que la unidad básica de evaluación en la ciencia madura no es la hipótesis aislada ni la teoría solitaria, sino el **Programa de Investigación Científica (PIC)** concebido como una serie histórica de teorías sucesivas $T_1, T_2, \\dots, T_n$.

## 2. Estructura dual: Núcleo Firme y Cinturón Protector

Un programa de investigación científica posee una arquitectura epistemológica deliberada y jerárquica:
- **El núcleo firme (*Hard Core*)**: Un conjunto de axiomas y premisas ontológicas centrales que los científicos deciden, por convención metodológica, no someter a refutación directa mientras el programa continúe rindiendo frutos (la *heurística negativa*).
- **El cinturón protector (*Protective Belt*)**: Una red densa de hipótesis auxiliares, modelos matemáticos, ecuaciones de aproximación y técnicas observacionales que absorben el impacto constante de las anomalías empíricas y son continuamente modificadas, expandidas o reemplazadas (la *heurística positiva*).

La ciencia no progresa por refutaciones aisladas, sino mediante programas de investigación con un núcleo firme protegido por un cinturón heurístico modificable.

## 3. Criterio de demarcación dinámico: Desplazamientos progresivos vs. degenerativos

¿Cuándo una modificación en el cinturón protector es un avance legítimo y cuándo constituye una maniobra pseudocientífica regresiva?
- **Desplazamiento progresivo (*Progressive Problemshift*)**: Cada nueva versión del cinturón protector $T_{n+1}$ no solo absorbe la anomalía empírica que amenazaba al programa, sino que posee *excedente empírico*: predice hechos nuevos, inesperados y audaces que luego son corroborados independientemente.
- **Desplazamiento degenerativo (*Degenerating Problemshift*)**: Las modificaciones se introducen únicamente de forma ad-hoc a posteriori para tapar parches y justificar fracasos observacionales conocidos, sin predecir ningún hecho novedoso.

## 4. El protocolo Chen como encarnación del cinturón protector abierto

El grafo de citas bidireccionales con tipado funcional de Chen materializa el modelo de Lakatos en una plataforma de lectura y argumentación digital. Cuando un investigador responde a un texto anterior con la etiqueta \`[→ Amplía]\`, está construyendo heurística positiva: expande el cinturón protector para abarcar nuevas condiciones de contorno. Cuando responde con \`[- Contradice]\`, documenta una anomalía no resuelta que evalúa si el programa sigue siendo progresivo o si ha entrado en fase degenerativa.`,
  },

  // Artículo 5: Mateo Valdés (Sistemas Distribuidos y PBFT)
  {
    versionId: 'ver-valdes-pbft-v1',
    articleId: 'art-valdes-sistemas-pbft',
    versionNumber: 1,
    title: 'Consenso determinista bajo sincronía parcial y tolerancia a faltas bizantinas (PBFT)',
    subtitle: 'Análisis de la cota teórica de FLP (1985) frente a la solución práctica de Castro y Liskov (1999) mediante quórums bizantinos de dos tercios.',
    area: 'Sistemas Distribuidos',
    authorId: 'auth-valdes',
    epistemicStatus: 'fact',
    license: 'CC BY-SA 4.0',
    createdAt: '26 de Octubre, 2026',
    readingTimeMinutes: 11,
    contentHash: '4b9e10d48174aa92bc11200388d01912a7e2b10901e9124403cd84b55ae21b0388d0',
    contentMarkdown: `## 1. El límite formal del Teorema FLP (1985)

En la teoría de sistemas distribuidos, el resultado de Fischer, Lynch y Paterson (conocido universalmente como Teorema FLP) estableció una de las cotas negativas más célebres y rotundas de la informática: en un sistema asíncrono puro, ningún algoritmo determinista puede garantizar consenso seguro si existe la posibilidad de que tan solo un único nodo sufra una falla por caída (*crash failure*).

La prueba deductiva descansa en la existencia de configuraciones bivalentes. En una red asíncrona pura no es posible distinguir entre un proceso que ha colapsado y otro que simplemente experimenta un retardo infinito en el canal de comunicación. Cualquier protocolo que intente asegurar consistencia estricta (*safety*) se expondrá necesariamente a una ejecución no terminable (*liveness violation*).

## 2. La ingeniería de Castro & Liskov (1999): Sincronía Parcial

Durante más de una década, la cota de FLP se interpretó con un pesimismo paralizante. Sin embargo, Miguel Castro y Barbara Liskov revolucionaron la computación distribuida con su protocolo Practical Byzantine Fault Tolerance (PBFT) al introducir una hipótesis de ingeniería realista: la sincronía parcial o sincronía débil.

En PBFT se desacoplan las garantías del sistema:
1. **Safety incondicional**: La coherencia del estado replicado se preserva matemáticamente bajo cualquier condición de retardo de red o ataque malicioso activo. Jamás se produce una bifurcación de estado (*split-brain*).
2. **Liveness eventual**: El sistema garantiza avance continuo y respuesta a las transacciones tan pronto como los retardos de transmisión $\\Delta$ se estabilicen temporalmente por debajo de un umbral finito, apoyándose en temporizadores exponenciales y cambios de vista (*view-changes*).

## 3. La cota óptima de resiliencia bizantina: 3f + 1

Para tolerar hasta $f$ nodos actuando con fallas bizantinas arbitrarias (incluyendo colusión maliciosa, envío de mensajes contradictorios o manipulación criptográfica), PBFT demuestra formalmente que el número total de nodos $N$ debe cumplir estrictamente:

$$N \\ge 3f + 1$$

El protocolo estructura cada decisión en tres fases criptográficamente autenticadas: Pre-Prepare, Prepare y Commit. Cada nodo recopila un quórum de $2f + 1$ votos válidos antes de proceder a la siguiente fase. Dado que cualesquiera dos mayorías de $2f + 1$ nodos en un universo de $3f + 1$ deben intersectarse en al menos $f + 1$ participantes, se garantiza que al menos un nodo honesto audite cada transición de estado.

## 4. Demarcación empírica en infraestructuras abiertas

El Teorema FLP y el protocolo PBFT ilustran a la perfección la tesis popperiana y lakatosiana: el teorema formal fija la frontera de imposibilidad abstracta (núcleo deductivo), mientras que la ingeniería de sistemas distribuidos construye un cinturón protector fecundo introduciendo supuestos físicos comprobables sobre la sincronía de las redes. En Chen aplicamos este mismo rigor: el grafo de citas no depende de la confianza ciega en un servidor central, sino de hashes de contenido verificables e inmutabilidad por diseño.`,
  },
];

export const INITIAL_CITATIONS: Citation[] = [
  // Cita 1: Popper -> Vasconcelos (Supports / [+ Apoya])
  {
    id: 'cit-popper-to-vasconcelos',
    sourceVersionId: 'ver-popper-v1',
    targetVersionId: 'ver-vasconcelos-v1',
    relation: 'supports',
    quotedSnippet: 'Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.',
    reasoning: 'Demuestra formalmente mediante lógica de primer orden (modus tollens) que la refutación de un enunciado universal a partir de un enunciado existencial singular es deductivamente estricta.',
    createdAt: '15 de Octubre, 2026',
  },

  // Cita 2: Duhem-Quine -> Vasconcelos (Contradicts / [- Contradice])
  {
    id: 'cit-duhem-to-vasconcelos',
    sourceVersionId: 'ver-duhem-quine-v1',
    targetVersionId: 'ver-vasconcelos-v1',
    relation: 'contradicts',
    quotedSnippet: 'Ninguna cantidad de cisnes blancos observados puede justificar deductivamente que todos los cisnes son blancos; la observación de un único cisne negro basta para refutarla de forma concluyente.',
    reasoning: 'Refuta la existencia de experimentos cruciales aislados: ante una anomalía empírica, siempre es posible reajustar hipótesis auxiliares del cinturón instrumental sin descartar la tesis principal.',
    createdAt: '18 de Octubre, 2026',
  },

  // Cita 3: Lakatos -> Vasconcelos (Extends / [→ Amplía])
  {
    id: 'cit-lakatos-to-vasconcelos',
    sourceVersionId: 'ver-lakatos-v1',
    targetVersionId: 'ver-vasconcelos-v1',
    relation: 'extends',
    quotedSnippet: 'Un sistema conceptual solo pertenece a la ciencia empírica si formula predicciones que puedan entrar en conflicto con la experiencia.',
    reasoning: 'Amplía el falsacionismo ingenuo hacia una estructura dinámica donde las teorías tienen un núcleo firme convencionalmente irrefutable rodeado de un cinturón protector de hipótesis auxiliares.',
    createdAt: '22 de Octubre, 2026',
  },

  // Cita 4: Lakatos -> Duhem-Quine (Supports / [+ Apoya])
  {
    id: 'cit-lakatos-to-duhem',
    sourceVersionId: 'ver-lakatos-v1',
    targetVersionId: 'ver-duhem-quine-v1',
    relation: 'supports',
    quotedSnippet: 'La experiencia nos informa de que al menos uno de los componentes de la conjunción es falso, pero la lógica formal es absolutamente incapaz de señalarnos cuál de ellos debe ser sacrificado.',
    reasoning: 'Incorpora la crítica holista de Duhem-Quine dentro de la heurística negativa del programa de investigación.',
    createdAt: '22 de Octubre, 2026',
  },

  // Cita 5: Valdés (PBFT) -> Vasconcelos (Extends / [→ Amplía])
  {
    id: 'cit-valdes-to-vasconcelos',
    sourceVersionId: 'ver-valdes-pbft-v1',
    targetVersionId: 'ver-vasconcelos-v1',
    relation: 'extends',
    quotedSnippet: 'Esta asimetría lógica elemental entre verificación y falsación es irrevocable: las proposiciones universales jamás pueden derivarse de observaciones finitas, pero sí pueden ser destruidas deductivamente por una sola instancia contradictoria verificada.',
    reasoning: 'Extiende el principio popperiano de demarcación hacia la computación distribuida: formaliza la asimetría entre la inviabilidad teórica asíncrona pura y la corroboración empírica en redes parcialmente síncronas.',
    createdAt: '26 de Octubre, 2026',
  },

  // Cita 6: Valdés (PBFT) -> Lakatos (Supports / [+ Apoya])
  {
    id: 'cit-valdes-to-lakatos',
    sourceVersionId: 'ver-valdes-pbft-v1',
    targetVersionId: 'ver-lakatos-v1',
    relation: 'supports',
    quotedSnippet: 'La ciencia no progresa por refutaciones aisladas, sino mediante programas de investigación con un núcleo firme protegido por un cinturón heurístico modificable.',
    reasoning: 'Ejemplifica un programa progresivo en ingeniería: el paso de Paxos a PBFT no descartó el núcleo de replicación de máquinas de estados, sino que extendió su cinturón protector para absorber faltas bizantinas maliciosas.',
    createdAt: '26 de Octubre, 2026',
  },
];

export const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 'rep-01',
    targetVersionId: 'ver-vasconcelos-v1',
    reporterHandle: 'anon-auditor-99',
    reason: 'unattributed_plagiarism',
    description: 'Reporte de revisión preliminar: se verificó si el texto atribuía adecuadamente a David Hume el problema de la inducción. Tras la auditoría se constató que la sección 1 cita explícitamente a Hume.',
    status: 'resolved',
    createdAt: '14 de Octubre, 2026',
  },
];

export const INITIAL_DATABASE_STATE: DatabaseState = {
  authors: INITIAL_AUTHORS,
  articles: INITIAL_ARTICLES,
  citations: INITIAL_CITATIONS,
  reports: INITIAL_REPORTS,
};
