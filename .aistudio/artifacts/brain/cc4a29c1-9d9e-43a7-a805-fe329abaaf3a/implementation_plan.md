# Plan de Descongestión Visual y Modos Ligero vs. Óptimo en Chen

## Resumen Ejecutivo
Transformar la experiencia visual de la plataforma para eliminar la sensación de sobrecarga («a petar»), despejar la cabecera y el muro principal con mayor espacio en blanco y tarjetas simplificadas, e implementar una distinción visual real y evidente entre el **Modo Ligero** (ahorro extremo de recursos, sin sombras ni animaciones, diseño plano y limpio estilo papel) y el **Modo Óptimo** (diseño enriquecido con Tailwind, micro-interacciones, sutiles elevaciones y transiciones suaves).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas por el usuario en la fase de clarificación:**
> 1. **Modo Ligero**: Máximo ahorro de recursos, ultra-liviano, sin decoraciones superfluas ni animaciones, para uso en cualquier dispositivo sin consumir CPU/batería.
> 2. **Modo Óptimo**: Diseño visual enriquecido con Tailwind CSS, micro-interacciones suaves, sombras sutiles, desenfoques y transiciones fluidas.
> 3. **Descongestión de la interfaz**: Introducción de mayor espacio en blanco, ritmo tipográfico respirado y simplificación radical de las tarjetas de artículos (eliminando la acumulación excesiva de etiquetas tipo píldora).

---

## 1. Overview & Core Concept

- **El problema**: La interfaz actual acumula múltiples elementos en poco espacio (filas de botones, badges acumulados, bordes densos y controles amontonados). Además, el botón de diseño óptimo no producía un cambio visual apreciable para el usuario al limitarse a micro-reglas CSS casi invisibles.
- **La solución**: 
  1. Rediseñar el conmutador de modo para que el cambio sea inmediato, visible e intuitivo:
     - **🍃 Modo Ligero**: Estilo minimalista plano (tipo texto editorial / papel de baja carga), cero desenfoques, cero animaciones, bordes ultrafinos o eliminados, máxima legibilidad y respuesta instantánea.
     - **✨ Modo Óptimo**: Estilo visual contemporáneo con Tailwind CSS, transiciones de elevación en tarjetas, gradaciones sutiles, micro-animaciones al interactuar y desenfoques elegantes.
  2. Aligerar el layout general (`HomeView`, `Header`, `FreeBooksView`, `StudyPathView`): espaciado generoso, eliminar el "sándwich de badges" en tarjetas y agrupar accesos secundarios de manera ordenada.

---

## 2. User Experience & Visual Design

### A. Cabecera y Navegación Despejada
- Reorganizar la barra superior para evitar amontonamiento horizontal:
  - Logotipo Chen + 4 enlaces directos esenciales: `Artículos`, `Libros`, `Rutas`, `Comunidad`.
  - Menú desplegable `Más` para herramientas accesorias (`Huecos del saber`, `Foro`, `Retos`, `Líneas rojas`, etc.).
  - Selector de modo claramente diferenciado en el extremo derecho:
    - Estado Ligero: Botón plano `[🍃 Ligero]` con indicador visual sutil.
    - Estado Óptimo: Botón refinado `[✨ Óptimo]` con acento visual claro.

### B. Muro Principal (`HomeView`) con Respiración Visual
- **Hero editorial limpio**: Reducir la fila de 4 botones apiñados a dos acciones principales (`Escribir artículo` y `Explorar catálogo`), dando aire y jerarquía al encabezado.
- **Tarjetas de artículos desaturadas**:
  - Eliminar los 5 chips/píldoras amontonados en la parte superior de cada tarjeta.
  - Reemplazar por una línea tipográfica limpia y sobria: `Área · Tiempo de lectura · Fecha`.
  - Títulos con escala tipográfica proporcional y espaciado de párrafo holgado.
  - El estado epistémico y la licencia se presentan de forma discreta como texto unboxed, evitando el ruido visual.

### C. Comportamiento Diferenciado: Ligero vs. Óptimo
```
┌────────────────────────────────────────────────────────────────────────┐
│ MODO LIGERO (data-ultralight="true")                                   │
│ • Fondo plano y contrastado sin desenfoques (backdrop-filter: none)    │
│ • Tarjetas con bordes ultra-sencillos (1px neutral) o fondo continuo   │
│ • Cero sombras complejas (box-shadow: none)                            │
│ • Cero animaciones / transiciones (rendering instantáneo)              │
│ • Elementos decorativos e iconos redundantes ocultos o simplificados    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ MODO ÓPTIMO (data-ultralight="false")                                  │
│ • Efectos de cristal esmerilado en cabecera (backdrop-blur-md)         │
│ • Elevación suave al pasar el ratón en tarjetas (translate-y, shadow)  │
│ • Transiciones fluidas de color y foco                                 │
│ • Indicadores semánticos con micro-detalles y estética pulida Tailwind  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Control global mediante atributo `data-ultralight` enriquecido en CSS y clases condicionales**:
  - *Enfoque*: En lugar de limitarse a desactivar animaciones CSS, aplicar estilos dedicados en `index.css` y condicionales en los componentes que simplifiquen estructuralmente los elementos visibles cuando el modo ligero está activado.
  - *Ventaja*: Cambio visual drástico, evidente y efectivo sin requerir dos codebases separadas.
- **Decisión 2: Descongestión de tarjetas según la constitución de diseño (Zero-Pill Discipline)**:
  - *Enfoque*: Sustituir los bloques de badges multicolores por metadatos tipográficos con separadores simples (`·`).
  - *Ventaja*: Transmite elegancia académica y reduce la fatiga visual de inmediato.

---

## 4. Technical Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                             App.tsx                                 │
│  - preferences.ultraLightMode: boolean                              │
│  - document.documentElement.setAttribute('data-ultralight', ...)     │
└──────────────┬──────────────────────────────────────┬───────────────┘
               │                                      │
               ▼                                      ▼
     ┌──────────────────┐                   ┌──────────────────┐
     │    Header.tsx    │                   │   HomeView.tsx   │
     │  - Botón Ligero  │                   │  - Hero aireado  │
     │    vs Óptimo     │                   │  - Tarjetas      │
     │  - Menú ordenado │                   │    desaturadas   │
     └──────────────────┘                   └──────────────────┘
               │                                      │
               └──────────────────┬───────────────────┘
                                  ▼
                     ┌───────────────────────────┐
                     │         index.css         │
                     │  - [data-ultralight="true"]│
                     │    Layout plano & sobrio  │
                     │  - Modo Óptimo Tailwind:  │
                     │    Sombras, desenfoques y │
                     │    transiciones activas   │
                     └───────────────────────────┘
```

---

## Plan de Verificación

1. **Prueba del conmutador Ligero / Óptimo**:
   - Activar «Ligero»: verificar que las sombras, animaciones y desenfoques desaparecen, adoptando una apariencia plana, directa y ultraligera.
   - Desactivar (Modo Óptimo): verificar que reaparecen las transiciones suaves, el desenfoque de la cabecera y las micro-interacciones de Tailwind.
2. **Prueba de respiración visual en `HomeView`**:
   - Comprobar que no hay saturación ni desbordamientos en móvil ni en escritorio (1440px).
   - Verificar que las tarjetas se leen con claridad y sin cúmulo de etiquetas circulares/píldoras.
3. **Validación técnica**:
   - Ejecutar `lint_applet` (`tsc --noEmit`) asegurando 0 errores de compilación y tipos.
   - Ejecutar `compile_applet` para certificar la compilación limpia de Vite.
