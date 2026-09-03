# Código Cero

Sitio educativo estático para aprender los fundamentos de programación en español.

La ruta inicial de Python está organizada en tres niveles de cuatro proyectos:

1. Fundamentos: mensajes, variables y operaciones.
2. Decisiones y ciclos: condiciones, repeticiones y listas.
3. Funciones y proyecto final: código reutilizable y un desafío integrador.

Cada proyecto incluye explicación, misión, tres pistas progresivas, ejecución segura en el navegador y tres comprobaciones antes de marcarlo como completado. El progreso y la preferencia de tema se guardan localmente en el navegador.

Las cuatro rutas extensas (Python, HTML/CSS, JavaScript y SQL) funcionan con puntos de control: solo el primer nivel está abierto al comenzar y el siguiente se
desbloquea al terminar los cuatro proyectos o módulos del anterior. Al cerrar un nivel aparece el mensaje de cierre de esa etapa
(conceptos básicos, avanzados o expertos) y se habilita un mini examen de cinco preguntas de selección múltiple, con
cuatro alternativas, explicación por pregunta y umbral de cuatro aciertos. Los exámenes se pueden repetir y la ruta se
da por completada cuando están los doce proyectos o módulos y los tres exámenes aprobados. El examen no impide
continuar al siguiente nivel, pero los tres deben aprobarse para cerrar la ruta. Reprobar un repaso no elimina una
aprobación previa. Los avances anteriores se conservan; los exámenes usan una clave propia por tecnología.

El catálogo incluye otras tres rutas con la misma profundidad: tres niveles de cuatro módulos cada una.

- HTML y CSS: estructura y semántica, estilos y modelo de caja, composición con flexbox, grid, diseño responsive y un componente final.
- JavaScript: datos y operaciones, decisiones y colecciones, funciones, métodos de arreglo y un proyecto integrador.
- SQL: introducción a tablas y registros, consultas y filtros, patrones, rangos, rankings, resúmenes y relaciones. Sus doce módulos tienen explicaciones ampliadas, ejemplos resueltos paso a paso, resultado esperado, errores frecuentes y preguntas de comprensión. La ruta suma un explorador de datos, diccionario de columnas, guía rápida y tres desafíos adicionales (comparaciones, IN y MIN/MAX) independientes del progreso.

Las cuatro rutas comparten la misma estructura pedagógica: explicación, misión, tres pistas progresivas, ejecución en el navegador y tres comprobaciones por módulo. HTML y CSS utiliza una vista previa aislada; JavaScript y SQL usan intérpretes propios que reconocen únicamente el subconjunto del lenguaje cubierto por los módulos, sin `eval` ni ejecución de código arbitrario.

## Nuevos mini cursos

El catálogo tiene además cuatro introducciones de tres mini proyectos cada una:

- Node.js: argumentos de terminal, lectura de JSON y respuesta HTTP.
- Datos con Python: conteo y promedio, limpieza de etiquetas y reporte de pedidos.
- React: JSX, componentes con props y un contador con estado.
- TypeScript: tipos primitivos, funciones tipadas e interfaces.

Son **constructores guiados**, no editores de código libre: el estudiante selecciona fragmentos, observa el código
resultante y prueba un modelo didáctico de esas opciones. La página aclara que no ejecuta Node, Python, React
o el compilador TypeScript completos. No hay acceso al sistema de archivos, puertos, paquetes externos ni
ejecución arbitraria. El código equivalente puede copiarse para continuar en un entorno real.

Cada proyecto incluye conceptos, pasos, datos, misión, resultado esperado, tres pistas, tres comprobaciones,
un error frecuente y una pregunta de comprensión. Los tres están abiertos para explorar; completar exige
aprobar las comprobaciones. No se presentan como rutas extensas de doce módulos ni incluyen exámenes.
Progreso, elecciones y proyecto activo usan claves propias, sin modificar las rutas anteriores:
codigo-cero.nodejs-mini-v1, codigo-cero.datos-python-mini-v1, codigo-cero.react-mini-v1 y
codigo-cero.typescript-mini-v1. Restablecer opciones no borra proyectos completados.

Archivos nuevos:

- nodejs.html, datos-python.html, react.html, typescript.html: páginas independientes.
- mini-courses.js: registro y normalización de opciones permitidas.
- nodejs-course.js, datos-python-course.js, react-course.js, typescript-course.js: contenido, plantillas y modelos.
- mini-course.js y mini-course.css: constructor compartido, pistas, comprobaciones, copia, resultados y progreso.
- mini-courses.test.mjs: doce proyectos, cien combinaciones, comparación con ejemplos Node/Python,
  persistencia, contador, copia y contratos de las nueve páginas.

Prueba adicional: node mini-courses.test.mjs. Compara los ejemplos de datos con Python 3 si está disponible
(se puede indicar el ejecutable mediante la variable de entorno PYTHON). Las comprobaciones de interfaz
son unitarias, no una revisión visual en un navegador.

## Estructura de páginas

- `index.html`: portada general, explicación del proyecto y catálogo de tecnologías.
- `python.html`: ruta independiente de Python con sus niveles y laboratorios.
- `html-css.html`: introducción práctica a estructura y estilos web.
- `javascript.html`: introducción práctica a la lógica con JavaScript.
- `sql.html`: introducción práctica a las consultas de datos.
- `site.js`: comportamiento compartido, como el selector de tema.
- `python.js`: contenido, ejecución y progreso exclusivo de la ruta Python.
- `starter-runtime.js`: intérprete de JavaScript y motor de SQL usados por los laboratorios.
- `sql-course.js`: contenido didáctico de los doce módulos de SQL, resultados esperados, comprobaciones exactas y tres desafíos extra. Conserva los índices y claves de progreso previos.
- `sql-guide.js` y `sql.css`: tablas de datos y resultados, explicaciones guiadas, consulta rápida y laboratorio extra; se cargan solo en SQL.
- `starter-exams.js`: nueve mini exámenes (45 preguntas con explicación) y corrección pura para HTML/CSS, JavaScript y SQL.
- `starter-course.js`: niveles, módulos, validación, desbloqueos, exámenes y progreso de las rutas de HTML/CSS, JavaScript y SQL.
- `starter-course.test.mjs`: resuelve 36 módulos, comprueba 108 validaciones y prueba los nueve exámenes, navegación, reintentos, persistencia y marcado real.
- `python-checkpoints.test.mjs`: prueba de los puntos de control, el desbloqueo de niveles y los tres mini exámenes.
- `sql-guide.test.mjs`: prueba los ejemplos, tablas, desafíos, errores, separación de los editores y preservación de los datos y del progreso.

Para comprobar el estado local: `node starter-course.test.mjs`, `node python-checkpoints.test.mjs` y `node sql-guide.test.mjs`.

La portada mantiene como próximas las rutas de Git y GitHub, Terminal, APIs e Inteligencia artificial.

Las tecnologías futuras deberán seguir el mismo patrón y vivir en su propia página, sin agregar sus ejercicios directamente a la portada.

El dominio público configurado en `CNAME` muestra temporalmente una pantalla de mantenimiento. En `localhost` se abre directamente la versión ampliada para continuar su desarrollo y revisión antes de publicarla.
