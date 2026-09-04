# Código Cero

Sitio educativo estático para aprender los fundamentos de programación en español.

La ruta de Python está organizada en cinco niveles de cuatro proyectos:

1. Fundamentos: mensajes, variables y operaciones.
2. Decisiones y ciclos: condiciones, repeticiones y recorridos.
3. Colecciones de datos: listas, orden, diccionarios e inventarios.
4. Funciones propias: parámetros, valores por defecto y resultados.
5. Integración final: comprensiones, manejo de errores y proyectos completos.

Cada proyecto incluye explicación, misión, tres pistas progresivas, ejecución real en el navegador y tres comprobaciones antes de marcarlo como completado. El progreso y la preferencia de tema se guardan localmente en el navegador.

El laboratorio de Python ejecuta el código con `python-runtime.js`, un intérprete propio escrito para el proyecto:
tokenizador con sangría, analizador sintáctico y evaluador. Reconoce variables, aritmética con enteros y decimales,
f-strings con formato, condiciones, `for`, `while`, listas, diccionarios, tuplas, rebanadas, funciones con valores por
defecto, recursión, comprensiones de listas, expresiones condicionales, `try`/`except`/`finally` y más de cuarenta
funciones y métodos incorporados. No usa `eval`, `Function` ni ejecución nativa, y limita pasos, profundidad y salida.
No incluye módulos externos (`import`), `input()` ni `lambda`, y lo dice explícitamente en lugar de simular un resultado.

Las salidas del intérprete se contrastan con CPython 3.12: `python-runtime.test.mjs` guarda 65 programas con la salida
real de Python y la vuelve a comparar en vivo cuando el equipo tiene Python instalado.

Las seis rutas extensas (Python, HTML/CSS, JavaScript, SQL, Git y GitHub, y APIs) funcionan con puntos de control: solo el primer nivel está abierto al comenzar y el siguiente se
desbloquea al terminar los cuatro proyectos o módulos del anterior. Al cerrar un nivel aparece el mensaje de cierre de esa etapa
(conceptos básicos, decisiones y ciclos, colecciones, funciones e integración final) y se habilita un mini examen de cinco preguntas, con
cuatro alternativas, explicación por pregunta y umbral de cuatro aciertos. Los exámenes se pueden repetir y la ruta se
da por completada cuando están todos sus proyectos o módulos y todos sus exámenes aprobados: 20 proyectos y 5 exámenes
en Python, 12 módulos y 3 exámenes en las demás. El examen no impide continuar al siguiente nivel, pero hay que
aprobarlos todos para cerrar la ruta. Reprobar un repaso no elimina una
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
- `python-runtime.js`: intérprete de Python del laboratorio, contrastado con CPython.
- `git-lab.js` y `git-course.js`: simulador de Git y los 12 módulos de la ruta Git y GitHub.
- `api-lab.js` y `apis-course.js`: servidor HTTP simulado y los 12 módulos de la ruta APIs.
- `routes-git-apis.test.mjs`: resuelve los 24 módulos nuevos y comprueba los laboratorios.
- `python.js`: los 5 niveles, 20 proyectos, 5 exámenes y el progreso de la ruta Python.
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

## Continuidad y revisión de septiembre de 2026

La portada separa rutas de fundamentos, mini cursos guiados y tecnologías próximas. Las ocho tarjetas muestran
el progreso guardado y permiten continuar. El panel «Continuar donde quedaste» abre la última ruta en curso.
`learning-state.js` lee las claves existentes sin migrarlas ni borrarlas; las rutas extensas también guardan
el módulo activo y sus borradores en `codigo-cero.<ruta>.session-v1`. No hay cuentas ni sincronización entre equipos.
`catalog.js` representa el avance y los exámenes por separado: doce ejercicios no significan ruta terminada
si faltan los tres mini exámenes. Los mini cursos mantienen sus propias elecciones y no tienen exámenes.

HTML/CSS y JavaScript incorporan resultados esperados, errores frecuentes y una pauta de práctica en
`learning-guidance.js`. `learning-review.css` mejora la lectura y el espacio de los editores móviles en ambos temas.
Los veinte proyectos de Python aceptan cualquier solución válida: el intérprete ejecuta el código escrito y las
validaciones revisan la salida y las variables resultantes, no la forma del texto. Cambiar el código invalida una
comprobación pendiente antes de poder completar.


### Git y GitHub, y APIs

Ambas rutas tienen la misma forma que las anteriores (3 niveles de 4 módulos, con un mini examen por nivel) y cada
una trae su propio laboratorio simulado:

- `git-lab.js` mantiene un repositorio en memoria: área de trabajo, área de preparación, commits encadenados, ramas,
  archivos ignorados y remoto. Entiende `init`, `status`, `add`, `commit`, `log`, `diff`, `restore`, `branch`,
  `switch`, `checkout`, `merge`, `remote` y `push`, y responde con mensajes equivalentes a los de Git en español.
  No ejecuta Git, no toca el disco y no se conecta a GitHub; un comando fuera de esa lista lo dice en lugar de
  inventar una salida. Cada módulo define la carpeta con la que empieza el laboratorio.
- `api-lab.js` simula un servidor HTTP con dos colecciones (`/cursos` y `/estudiantes`). Acepta GET, POST, PUT, PATCH
  y DELETE, cabeceras, cuerpos JSON, filtros, búsqueda, orden y paginación, y devuelve códigos reales: 200, 201, 204,
  400, 401, 404, 405 y 415. Se escriben varias peticiones en un mismo intento y se ejecutan en orden sobre los mismos
  datos, que se reinician en cada ejecución. No usa `fetch` ni sale a la red.

Las validaciones de estos módulos revisan el estado real del repositorio o las respuestas del servidor, no el texto
escrito, así que aceptan cualquier camino que llegue al mismo resultado.

Pruebas adicionales: `node learning-state.test.mjs`, `node review-preview.test.mjs`,
`node routes-git-apis.test.mjs`,
`node python-runtime.test.mjs` y `node python-checkpoints.test.mjs`. Las dos últimas comparan el intérprete y las
veinte soluciones de referencia con CPython cuando está disponible.

## Mantenimiento y vista previa publicada

El público en `intenta.cl` y `www.intenta.cl` sigue viendo mantenimiento, también al entrar directamente
en cualquiera de las ocho rutas. El HTML comienza con `is-maintenance`: sin JavaScript conserva esa pantalla.
En `localhost` se abre la experiencia de desarrollo. No se debe retirar el mantenimiento sin autorización.

- Vista previa: `https://intenta.cl/?revision=septiembre-2026`.
- Volver a mantenimiento y cerrar la revisión de la pestaña: `https://intenta.cl/?maintenance`.
- `review-preview.js` habilita la revisión por enlace y la conserva en `sessionStorage`.
- `site.js` muestra el aviso y la salida; los enlaces internos conservan el parámetro, incluso con guardado bloqueado.
- Tanto mantenimiento como revisión indican `noindex, nofollow`.

**No es autenticación ni una zona privada.** Cualquier persona con el enlace puede entrar; los archivos y el
repositorio siguen siendo públicos. Este mecanismo sirve para una presentación temporal de mantenimiento,
no para proteger información confidencial. Un acceso realmente privado requiere control en el servidor o proveedor.
