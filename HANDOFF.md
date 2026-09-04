# Traspaso del proyecto Código Cero / intenta.cl

## Actualización vigente: 3 de septiembre de 2026

Esta sección reemplaza el estado operativo y los próximos pasos de las notas históricas que siguen.

El usuario autorizó publicar **toda la actualización**, manteniendo la pantalla de mantenimiento para
el público. No autorizó abrir el sitio de forma general. El destino sigue siendo GitHub Pages, `main`, raíz `/`,
repositorio `PabSepul/SpanaPS.github.io`; no se migró el hosting ni se añadieron servicios.

- Respaldo previo local: `38667bf`, con todo el desarrollo que estaba sin confirmar.
- Portada: avance en las ocho tarjetas, grupos separados de rutas y mini cursos y «Continuar donde quedaste».
- `learning-state.js`: conserva las claves anteriores; añade módulo activo, fecha y borradores por ruta.
- `catalog.js`: muestra proyectos/módulos y exámenes por separado; cada ruta exige todos sus módulos y un examen
  por nivel (Python: 20 + 5; las demás: 12 + 3). El número de exámenes se deduce de `count / 4`.
- `learning-guidance.js`: 24 ayudas (HTML/CSS y JavaScript) con resultado esperado y error frecuente.
- `learning-review.css`: ajustes de lectura, controles y anchura de editores móviles en ambos temas.
- Python: cambios de código invalidan la validación pendiente. Los veinte proyectos se ejecutan con el intérprete
  real de `python-runtime.js`, así que aceptan cualquier solución válida; las validaciones revisan la salida y las
  variables, no la forma del texto.
- Los niveles de Python se llaman por su contenido: conceptos básicos, decisiones y ciclos, colecciones de datos,
  funciones propias e integración final. No se promete dominio «experto».
- Navegación con teclado en pestañas y foco de los exámenes mejorados.

### Revisar el sitio montado sin abrirlo al público

Entrada: `https://intenta.cl/?revision=septiembre-2026`.
Salida: `https://intenta.cl/?maintenance`, o el enlace «Salir y ver mantenimiento» del aviso de revisión.

`review-preview.js` se carga inmediatamente después de la lógica de mantenimiento de cada HTML.
El HTML comienza cerrado (`class="is-maintenance"`), por lo que sin JavaScript sigue mostrando mantenimiento.
El enlace habilita la revisión en esa pestaña y conserva el estado en `sessionStorage`. Los enlaces internos
incluyen el parámetro para funcionar incluso si el almacenamiento está bloqueado. `?maintenance` tiene prioridad.
No hay credenciales: **es una vista previa por enlace, no autenticación ni privacidad**; fuente y contenido
siguen siendo públicos. Ambos modos declaran `noindex, nofollow`.


### Intérprete de Python del 3 de septiembre de 2026

`python-runtime.js` reemplazó al intérprete de una línea y a los ocho modelos guiados. Es un intérprete escrito para
el proyecto: tokenizador con INDENT/DEDENT, analizador sintáctico descendente y evaluador propio.

Qué reconoce:

- Enteros y decimales con la distinción real de Python (`10 / 5` da `2.0`, `10 // 5` da `2`).
- Textos, f-strings con expresiones y formato `:.2f`, listas, diccionarios, tuplas, rebanadas y desempaquetado.
- `if` / `elif` / `else`, `for`, `for ... in ... .items()`, `while`, `break`, `continue`, expresiones condicionales.
- `def` con parámetros por defecto y argumentos con nombre, `return`, recursión y comprensiones de listas.
- `try` / `except NombreDelError` / `finally` y `raise ValueError("...")`.
- Más de cuarenta funciones y métodos: `print` (con `sep` y `end`), `len`, `range`, `sum`, `min`, `max`, `abs`,
  `round` (mitad al par, como CPython), `int`, `float`, `str`, `bool`, `list`, `dict`, `tuple`, `sorted` (con `key`
  y `reverse`), `reversed`, `enumerate`, `zip`, `type`, más los métodos habituales de texto, listas y diccionarios.

Qué no reconoce, y lo dice en pantalla en vez de simular: `import`, `input()`, `lambda`, clases y archivos.

Garantías que no se deben romper:

- No usa `eval`, `Function` ni ejecución nativa. Hay una prueba que lo verifica sobre el texto del archivo.
- Límite de pasos, de profundidad de llamadas y de líneas de salida: un ciclo infinito se detiene con un aviso.
- El acceso a métodos usa tablas explícitas por tipo, así que no se llega al prototipo de JavaScript.
- Los errores se explican en español con el número de línea y el nombre del error de Python.

La fidelidad se comprueba contra CPython 3.12: `python-runtime.test.mjs` guarda 65 programas con su salida real y la
vuelve a comparar en vivo si el equipo tiene Python; `python-checkpoints.test.mjs` hace lo mismo con las 20 soluciones
de referencia de los proyectos. Si se agrega contenido nuevo, conviene ampliar esas listas antes que ajustar el motor.

### Verificación y próximos pasos

Ejecutar las siete suites antes de publicar nuevos cambios:

```powershell
node starter-course.test.mjs
node python-runtime.test.mjs
node python-checkpoints.test.mjs
node sql-guide.test.mjs
node mini-courses.test.mjs
node learning-state.test.mjs
node review-preview.test.mjs
```

Para comparar los modelos de datos con CPython, indicar un Python 3 disponible mediante `$env:PYTHON`.
No hay instalación npm, compilación ni dependencias nuevas. `QA.md` registra el alcance de las comprobaciones.

Próximo paso de producto: recorrer la vista publicada con usuarios principiantes, registrar dónde se traban
y ajustar las explicaciones. Después decidir si se necesitan editores libres con runtimes reales y/o cuentas.
No retirar mantenimiento ni presentar este enlace como un sistema privado. Para privacidad real, evaluar
autenticación en un proveedor o servidor con autorización explícita del usuario.

## Notas históricas del 2 de septiembre (no usar como estado operativo actual)

Fecha del traspaso: 2 de septiembre de 2026  
Repositorio: <https://github.com/PabSepul/SpanaPS.github.io>  
Dominio público: <https://intenta.cl>  
Rama actual: `main`  
Último commit publicado: `05dd2a5 Activa pantalla temporal de mantenimiento`

## 1. Objetivo general

Transformar la antigua página de intenta.cl en **Código Cero**, una plataforma educativa en español para personas que quieren comenzar a programar mediante explicaciones breves, ejercicios editables y validación inmediata.

La arquitectura buscada es:

- Una portada general para explicar el proyecto y elegir qué tecnología aprender.
- Una página independiente para cada tecnología, evitando acumular todas las lecciones en una sola vista.
- Aprendizaje mediante proyectos o módulos pequeños agrupados en niveles.
- Pistas progresivas, validaciones y progreso guardado en el navegador.
- Funcionamiento correcto en modo claro, modo oscuro, escritorio y móvil.

El dominio público debe continuar mostrando mantenimiento hasta que el usuario autorice expresamente publicar la nueva experiencia.

## 2. Stack tecnológico

El proyecto es un sitio estático sin framework ni proceso de compilación:

- HTML5 semántico.
- CSS nativo en `styles.css`, con variables para temas claro y oscuro y diseño responsive.
- JavaScript vanilla.
- `localStorage` para el tema y el progreso de cada ruta.
- `iframe` con `sandbox=""` para la vista previa segura de HTML/CSS.
- Intérpretes propios y controlados para los ejercicios de Python, JavaScript y SQL. No se utiliza `eval`, `Function()` ni ejecución de código arbitrario.
- Pruebas con Node.js y módulos incorporados, sin dependencias externas.
- GitHub Pages mediante el archivo `CNAME` para `intenta.cl`.
- Fuente Inter cargada desde Google Fonts, con fuentes del sistema como alternativa.

No existen `package.json`, bundler, React, base de datos ni servidor backend.

## 3. Estado actual

### Publicado

`main` y `origin/main` apuntan al commit `05dd2a5`. El sitio público muestra una pantalla de mantenimiento.

La detección ocurre al comienzo de cada página:

```js
const publicHosts = ["intenta.cl", "www.intenta.cl"];
const showMaintenance = publicHosts.includes(window.location.hostname)
  || new URLSearchParams(window.location.search).has("maintenance");
```

Cuando se detecta el dominio público se agrega la clase `is-maintenance`, se oculta el resto del sitio y se añade `noindex, nofollow`.

### Solo en local, todavía sin commit ni publicación

- La portada fue separada del contenido educativo y ahora funciona como catálogo de rutas.
- Python tiene una página propia con 5 niveles, 20 proyectos, explicaciones, pistas, validaciones y progreso independiente.
- **HTML/CSS, JavaScript y SQL alcanzaron la misma profundidad: 3 niveles y 12 módulos cada una.**
- Las tres rutas comparten el motor de `starter-course.js` y los intérpretes de `starter-runtime.js`.
- El selector de tema vive en `site.js` y se comparte entre todas las páginas.
- La preferencia de tema y el progreso de cada tecnología usan claves separadas de `localStorage`.
- Las cuatro rutas tienen puntos de control: niveles que se desbloquean y un mini examen por etapa.
- La portada enlaza a ocho tecnologías: cuatro rutas extensas y cuatro mini cursos nuevos.
- **El servidor local se detuvo al terminar esta revisión.** Se inició temporalmente para comprobar HTTP y preparar la vista local. El usuario había pedido detenerlo al pausar el trabajo anterior; no se deja un proceso activo al finalizar. Usar localhost:4174 al iniciarlo de nuevo conserva el origen del progreso.

### Última ampliación: cuatro mini cursos locales

Se añadieron Node.js, Datos con Python, React y TypeScript, cada uno con página independiente y tres proyectos
guiados de aproximadamente 10, 12 y 15 minutos. El catálogo ya los enlaza como disponibles. Git/GitHub,
Terminal, APIs e IA siguen como próximos.

| Mini curso | Proyecto 1 | Proyecto 2 | Proyecto 3 |
| --- | --- | --- | --- |
| Node.js | Argumentos y conversión de minutos | Archivo JSON y reporte | Ruta HTTP, estado y fin de respuesta |
| Datos con Python | Cantidad, total y promedio | Normalización y etiquetas únicas | Diccionarios e importes por pedido |
| React | JSX y fragmentos | Componentes reutilizables y props | Estado y evento de un contador |
| TypeScript | Números frente a texto | Parámetros y retorno tipados | Interfaz y forma de un objeto |

Decisión de alcance: son **constructores por selectores con simulación didáctica**, no editores libres ni runtimes
nuevos. Las opciones generan ejemplos para copiar a un entorno real. Los modelos solo representan las
alternativas ofrecidas. Las páginas lo advierten antes de practicar y junto al código/resultado; no debe afirmarse
que ejecutan React, JSX, un compilador TypeScript, Node o Python completos. Node no abre puertos ni lee archivos
reales. React tiene una representación de tarjetas y un contador interactivo, no una dependencia React.
No se añadieron paquetes ni cambios en los intérpretes existentes.

Cada proyecto tiene introducción, tres conceptos, tres pasos, datos, misión, salida esperada, errores frecuentes,
tres pistas, pregunta de reflexión y tres comprobaciones. Para marcarlo completado hay que aprobar las tres;
cambiar opciones invalida la aprobación pendiente. Los tres proyectos están abiertos para explorar y son
introductorios, sin los niveles/exámenes de las rutas extensas.

Archivos nuevos:

- nodejs.html, datos-python.html, react.html, typescript.html.
- mini-courses.js: registro y saneamiento de opciones.
- nodejs-course.js, datos-python-course.js, react-course.js, typescript-course.js: contenido y modelos puros.
- mini-course.js y mini-course.css: constructor, resultados, progreso y estilos aislados.
- mini-courses.test.mjs: pruebas de los doce proyectos y de su interfaz.

Los recursos nuevos usan v=20260902-mini1; las versiones compartidas anteriores se conservan.

Claves de guardado (JSON con completed, drafts y active):

- codigo-cero.nodejs-mini-v1
- codigo-cero.datos-python-mini-v1
- codigo-cero.react-mini-v1
- codigo-cero.typescript-mini-v1

completed guarda índices 0, 1 y 2; se filtran valores inválidos y duplicados. Los borradores solo admiten opciones
de las listas declaradas. El guardado bloqueado no impide practicar; copiar tiene alternativa manual.
Restablecer opciones conserva el progreso. Las claves anteriores no se migran ni se borran.

Verificado con node mini-courses.test.mjs: 12 proyectos, 36 comprobaciones, 100 combinaciones, 24 resultados
contrastados con CPython, fragmentos Node contrastados con dobles en memoria de fs/HTTP, navegación,
persistencia, copia y alternativa manual, contador, datos corruptos/bloqueados, nueve páginas y mantenimiento.
Las tres suites anteriores también pasan. No se hizo QA visual de navegador ni se instaló un compilador JSX/TS:
las plantillas React/TypeScript requieren esa verificación adicional en un entorno real antes de ampliar su alcance.

### Ampliación de contenido del 2 de septiembre de 2026

Las tres rutas introductorias pasaron de 3 a 12 módulos, organizados en niveles como la ruta de Python.

| Ruta | Nivel 1 | Nivel 2 | Nivel 3 |
| --- | --- | --- | --- |
| HTML y CSS | Estructura: etiquetas, listas y enlaces, imágenes accesibles, semántica | Estilos: primeros estilos, tipografía, modelo de caja, estados `:hover` | Composición: flexbox, grid, responsive, componente final |
| JavaScript | Datos: variables, números, plantillas, booleanos | Decisiones y colecciones: `if/else`, `else if`, arreglos, ciclos | Funciones y proyecto: funciones, flechas, `map`/`filter`/`reduce`, carrito |
| SQL | Consultar: `SELECT`, `DISTINCT`, `WHERE`, comparaciones con `AND` | Buscar y ordenar: `LIKE`, `BETWEEN`, `ORDER BY`, `LIMIT` | Resumir y combinar: `COUNT`, `AVG`/`SUM`, `GROUP BY`, `JOIN` |

Cada módulo conserva la estructura pedagógica de Python: kicker, título, introducción, ejemplo, explicación, tres conceptos, misión, tres pistas progresivas, código inicial, duración, dificultad, mensaje de éxito y tres validaciones.

Para sostener ese contenido se creó `starter-runtime.js`, que contiene dos motores nuevos:

- **Intérprete de JavaScript.** Tokenizador, analizador sintáctico y evaluador propios. Soporta `const`/`let`, funciones declaradas y flecha, parámetros por defecto, `if/else if/else`, `for`, `for...of`, `while`, `break`, `continue`, plantillas con acentos graves, objetos, arreglos y sus métodos habituales (`push`, `map`, `filter`, `reduce`, `sort`, `join`, entre otros), además de `console.log`, `Math`, `Object`, `Number` y `String`. El acceso a propiedades usa listas explícitas, así que no se alcanza el prototipo ni `Function`. Hay límite de pasos, de profundidad de llamadas y de líneas de salida, y los errores se explican en español.
- **Motor de SQL.** Analizador propio para `SELECT` con `DISTINCT`, alias con `AS`, `WHERE` con `AND`/`OR`/`NOT`, paréntesis, `LIKE`, `IN`, `BETWEEN` y comparaciones, `GROUP BY`, funciones `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `ORDER BY` con `ASC`/`DESC`, `LIMIT` y `JOIN ... ON` entre dos tablas. La base de práctica ahora tiene `cursos` (7 filas) y `estudiantes` (8 filas) relacionadas por `curso_id`.

Las validaciones ya no dependen solo de expresiones regulares: cada módulo de JavaScript y SQL comprueba también el resultado real de la ejecución, es decir la salida de la consola, las variables creadas o las filas y columnas devueltas por la consulta.

Cambios de interfaz que acompañan la ampliación:

- Las tres páginas muestran pestañas de nivel (`#starter-level-tabs`) que reutilizan los estilos `.level-tabs` de Python.
- El listado de módulos muestra los 4 módulos del nivel activo: 4 columnas en escritorio, 2 hasta 980px y 1 hasta 820px.
- La etiqueta de dificultad y la duración se toman del módulo activo (`#starter-difficulty`).
- El mensaje de éxito es propio de cada módulo (`#starter-success-copy`).

Como el número de módulos cambió, el progreso guardado usa claves nuevas para no arrastrar avances antiguos que ya no corresponden: `codigo-cero.html-css-v2.completed`, `codigo-cero.javascript-v2.completed` y `codigo-cero.sql-v2.completed`.


### Puntos de control y mini exámenes de Python

La ruta de Python avanza por etapas: 5 niveles de 4 proyectos con un mini examen cada uno.

- Cada nivel declara su etapa (`stage`): conceptos básicos, avanzados y expertos.
- Al comenzar solo el nivel 1 está disponible. El nivel siguiente se desbloquea cuando los cuatro proyectos del
  anterior están completados; las pestañas de nivel, la franja superior y el botón de proyecto siguiente respetan ese
  bloqueo.
- Al terminar un nivel aparece el panel `#level-checkpoint` con el mensaje de cierre, el botón para rendir el mini
  examen y el acceso directo al nivel siguiente.
- Cada nivel tiene un mini examen de 5 preguntas de selección múltiple con 4 alternativas, explicación por pregunta y
  umbral de 4 aciertos. Se puede reintentar cuantas veces se quiera y al aprobar queda registrado.
- La ruta se marca como completada solo con los 20 proyectos y los 5 exámenes aprobados.

Los exámenes aprobados se guardan aparte del avance de proyectos, en `codigo-cero.python-v2.exams`.

La corrección vive en `gradeExam(levelId, answers)`, una función pura que recibe las respuestas y devuelve
`{ total, correct, passing, passed, details }`. La interfaz solo renderiza ese resultado, así que la lógica de
aprobación se puede probar sin DOM.

Durante la revisión en el navegador apareció un desborde horizontal en móvil: el botón del examen llevaba
`white-space: nowrap` y estiraba el panel a 406px dentro de una pantalla de 375px. Se corrigió permitiendo que el texto
del botón se ajuste y agregando `min-width: 0` a las columnas del panel.

### Avance posterior: puntos de control en HTML/CSS, JavaScript y SQL

Ya se implementó el pendiente del traspaso anterior. Las cuatro tecnologías comparten ahora el mismo recorrido:

- Completar los cuatro módulos de un nivel abre el siguiente y habilita el examen de esa etapa.
- Cada examen contiene cinco preguntas con cuatro alternativas y explicación individual. Se aprueba con cuatro aciertos.
- El examen no bloquea el siguiente nivel, pero los doce módulos y los tres exámenes son necesarios para cerrar la ruta.
- Se pueden repetir los exámenes; un repaso fallido no borra una aprobación anterior.
- Las pestañas y los botones de navegación impiden saltar hacia niveles bloqueados. Cambiar de nivel cierra el examen abierto.
- `starter-exams.js` reúne nueve exámenes y 45 preguntas específicas de las tres tecnologías, y exporta la función pura
  `StarterExams.gradeExam(courseId, levelId, answers)` para corregirlos.
- `starter-course.js` gestiona el estado, los puntos de control y la interfaz. Los índices de módulos son 0–11; los
  identificadores guardados de exámenes son 1–3.
- Se conservan las claves de módulos `codigo-cero.<ruta>-v2.completed`; se agregan
  `codigo-cero.html-css-v2.exams`, `codigo-cero.javascript-v2.exams` y `codigo-cero.sql-v2.exams`.
- Los módulos ya completados no se reinician. Si el avance previo tiene huecos, se conserva, pero es necesario terminar
  los niveles anteriores para acceder al siguiente. Valores corruptos de almacenamiento se ignoran de forma segura.
- Se invalida la comprobación al editar código: no se puede completar un módulo con una validación de un texto anterior.
- La interfaz reutiliza los paneles y temas de Python. Se ajustó el quiebre de líneas de respuestas largas y se mantuvo
  el arreglo de ancho de los editores.

Las pruebas nuevas son automatizadas con un DOM simulado y comprobaciones del HTML real. No se realizó una nueva
revisión visual de estos exámenes en el navegador; la revisión visual descrita a continuación corresponde al estado anterior.

### Reestructuración didáctica de SQL

El usuario pidió una segunda revisión de SQL, explicaciones mucho más didácticas y más secciones. Se conservaron los
doce módulos, sus índices, los tres exámenes y las claves v2, para no borrar avances. No cambió el intérprete.

- La ruta comienza explicando base de datos, tabla, fila, columna, consulta y resultado con el ejemplo de una academia.
- El explorador muestra los datos reales del motor (cursos y estudiantes) y un diccionario con tipos, unidades y relación
  curso_id → id. Aclara que inscritos es una cifra ficticia del catálogo y no el conteo de los ocho estudiantes de muestra.
- Los doce módulos se reescribieron con párrafos explicativos, pasos de un ejemplo distinto de la misión, ejemplo resuelto
  ejecutable, tabla esperada, tres pistas, dos errores frecuentes y pregunta de comprensión con respuesta desplegable.
- Los resultados se muestran como tablas HTML accesibles y con desplazamiento horizontal contenido, no como tablas ASCII.
  Los errores y resultados vacíos tienen mensajes diferentes.
- Hay secciones de guía rápida, modelo mental del orden de una consulta, diccionario, solución de errores y límites del laboratorio.
- Se añadieron tres desafíos fuera del progreso: cursos cortos ordenados, ciudades con IN y extremos con MIN/MAX. Su editor
  es independiente, conserva borradores en memoria y no altera el código del módulo ni las aprobaciones.
- La validación de SQL ahora compara columnas, valores y orden cuando corresponde. No basta devolver el mismo número de filas.
  En GROUP BY se admiten órdenes diferentes entre grupos empatados.
- SQL utiliza los nombres de etapa Primeras consultas, Búsquedas y rankings, y Reportes y relaciones; no promete nivel experto.

El contenido SQL se extrajo de starter-course.js hacia `sql-course.js` (`globalThis.SQLCourse`). La presentación adicional
vive en `sql-guide.js` (`globalThis.SQLGuide`) y `sql.css`, cargados solamente por sql.html. Orden de scripts: site → runtime
→ sql-course → sql-guide → starter-exams → starter-course. Las otras rutas conservan su presentación y contenidos.

Las comprobaciones son automatizadas con dobles de DOM y marcado real. No se hizo una nueva revisión visual en navegador
durante esta reestructuración. El navegador se abrió solo para entregar la vista local.

### Revisión visual previa del 2 de septiembre de 2026

La revisión se hizo con el navegador integrado sobre `http://localhost:4174/`, midiendo la geometría real de cada editor en lugar de confiar solo en capturas.

- `.code-input.starter-code-input` resuelve `display: block` y `grid-template-columns: none` en las tres rutas.
- Escritorio de 1280 px: `textarea` de 468 px. Móvil de 375 px: `textarea` de 225 px.
- Sin desbordamiento horizontal en el `textarea` ni en el documento, en modo claro y oscuro.
- Contraste del código sobre su fondo: 17.08 en modo oscuro y 16.24 en modo claro.
- Python conserva su editor con numeración: `grid-template-columns: 26px 360.5px` en escritorio.
- `?maintenance` sigue ocultando el sitio y aplicando `noindex, nofollow`.

Corrección aplicada durante esa revisión: `index.html` pedía `site.js?v=20260902-multiroute1` mientras el resto usaba
`multiroute2`, así que la portada podía servir un `site.js` viejo desde la caché.

La regla que quedó: **cada archivo lleva la versión de su último cambio, y todas las páginas que lo cargan deben pedir
esa misma versión.** Estado actual:

| Archivo | Versión en la URL | Páginas que lo cargan |
| --- | --- | --- |
| `styles.css` | `20260902-checkpoints2` | las cinco |
| `site.js` | `20260902-depth1` | las cinco |
| `starter-runtime.js` | `20260902-depth1` | html-css, javascript, sql |
| `starter-exams.js` | `20260902-checkpoints2` | html-css, javascript, sql |
| `starter-course.js` | `20260902-sql1` | html-css, javascript, sql |
| `sql-course.js` | `20260902-sql1` | sql |
| `sql-guide.js` | `20260902-sql1` | sql |
| `sql.css` | `20260902-sql1` | sql |
| `python.js` | `20260902-checkpoints1` | python |

Que `site.js` siga en `depth1` no es un error: ese archivo no ha cambiado desde entonces. Si se edita un archivo, hay
que subir su versión en **todas** las páginas que lo piden.

### Validaciones ejecutadas

- Las cinco páginas responden con HTTP 200 en local. La revisión de consola sin errores corresponde a la sesión visual anterior.
- No hay referencias locales faltantes ni IDs duplicados en las páginas.
- `site.js`, `python.js`, `starter-runtime.js`, `starter-exams.js`, `starter-course.js`, `sql-course.js` y `sql-guide.js` pasan `node --check`.
- `starter-course.test.mjs` resuelve los 36 módulos, comprueba que el código inicial de cada módulo **no** valide y que la solución sí lo haga, y verifica los mensajes de error de los intérpretes.
- La misma prueba ahora valida los nueve mini exámenes y sus 45 preguntas, umbrales, bloqueo, reintentos, explicaciones,
  conservación del progreso anterior, recarga, aislamiento entre rutas, almacenamiento bloqueado y cierre de cada ruta.
- También contrasta los selectores con el HTML real, busca IDs duplicados, comprueba archivos enlazados, versiones de caché,
  el orden de carga de scripts y la regla que corrige el ancho del editor.
- `python-checkpoints.test.mjs` revisa los datos de los tres exámenes, el desbloqueo progresivo de niveles, la navegación bloqueada, el examen aprobado, reprobado y reintentado, y el cierre de la ruta.
- `sql-guide.test.mjs` prueba las doce lecciones y ejemplos, los tres desafíos, el explorador y las tablas de resultados,
  consultas erróneas y vacías, valores dibujados como texto seguro, borradores y aislamiento respecto al progreso existente.
- Los 36 módulos se resolvieron dentro del navegador real en la sesión anterior; falta esa revisión para los nueve exámenes nuevos.
- Las llaves de `styles.css` están equilibradas.
- `git diff --check` no reporta errores de whitespace; solo aparecen advertencias normales de conversión LF/CRLF en Windows.

Para repetir las tres pruebas desde la raíz del repositorio:

```powershell
node starter-course.test.mjs
node python-checkpoints.test.mjs
node sql-guide.test.mjs
```

Resultado esperado:

```text
3 rutas, 36 módulos y 108 validaciones: OK
HTML/CSS, JavaScript y SQL: 9 mini exámenes, 45 preguntas; desbloqueo, reintentos, persistencia y cierre: OK
5 páginas: IDs, archivos, versiones, orden de carga y editor: OK
Python: 3 puntos de control, 15 preguntas y 6 escenarios de desbloqueo: OK
SQL didáctico: 12 lecciones, 12 ejemplos ejecutables, 3 desafíos, tablas, errores, aislamiento y progreso: OK
```

Las tres pruebas pasan después de la reestructuración de SQL.

## 4. Errores actuales y problemas pendientes

No hay errores funcionales conocidos.

Quedan estos puntos pendientes:

1. Los cambios están sin commit. No deben subirse sin autorización explícita del usuario.
2. El sitio público continúa en mantenimiento intencionalmente.
3. Los intérpretes de JavaScript y SQL cubren el subconjunto usado por los módulos más un margen razonable. Es una restricción deliberada: no son un motor de JavaScript ni una base de datos completa. Cualquier módulo nuevo debe comprobarse contra el intérprete antes de darlo por listo.
4. Falta la revisión visual del SQL reestructurado, los exámenes y los cuatro mini cursos en modo claro/oscuro y escritorio/móvil; la lógica tiene pruebas automatizadas.
5. Git y GitHub, Terminal, APIs e Inteligencia artificial siguen como próximas, sin contenido. Las otras cuatro ya tienen mini cursos guiados.
6. La revisión visual se hizo midiendo el DOM en Chromium. Si el usuario quiere, puede confirmar el aspecto en sus propios navegadores y dispositivos.

Estado de Git al actualizar este documento:

```text
## main...origin/main
 M README.md
 M index.html
 D script.js
 M styles.css
?? HANDOFF.md
?? datos-python.html
?? datos-python-course.js
?? nodejs.html
?? nodejs-course.js
?? react.html
?? react-course.js
?? typescript.html
?? typescript-course.js
?? mini-courses.js
?? mini-course.js
?? mini-course.css
?? mini-courses.test.mjs
?? html-css.html
?? javascript.html
?? python-checkpoints.test.mjs
?? python.html
?? python.js
?? site.js
?? sql-course.js
?? sql-guide.js
?? sql-guide.test.mjs
?? sql.css
?? sql.html
?? starter-course.js
?? starter-course.test.mjs
?? starter-exams.js
?? starter-runtime.js
```

Estos avances todavía no están confirmados ni publicados en `origin/main`: si se pierde el directorio local, se pierde
el trabajo no respaldado de esta actualización.

`script.js` no se eliminó conceptualmente: su contenido evolucionó y fue movido a `python.js`. Git todavía lo muestra como archivo eliminado y archivo nuevo porque los cambios no se han preparado ni confirmado.

## 5. Próximo paso exacto

### Antes de tocar nada: reconstruir el entorno

No hace falta instalar nada. Desde la raíz del repositorio:

```powershell
cd C:\Users\l3_pa\OneDrive\Documentos\ChatGPT\intenta
node starter-course.test.mjs
node python-checkpoints.test.mjs
node sql-guide.test.mjs
node mini-courses.test.mjs
& 'C:\Users\l3_pa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -u -m http.server 4174 --bind 127.0.0.1
```

El comando `python` no está en PATH en esta sesión; el comando anterior usa el intérprete incluido en el entorno.
Si se trabaja desde otro equipo, puede utilizarse `python -m http.server 4174` cuando Python esté instalado.

El servidor debe quedar en el puerto **4174** para conservar las URL usadas en este documento. Usar **localhost**
en el navegador conserva el origen del progreso anterior (127.0.0.1 tiene almacenamiento diferente). Con él arriba:

- <http://localhost:4174/> portada
- <http://localhost:4174/python.html> ruta con puntos de control
- <http://localhost:4174/html-css.html#laboratorio>, `javascript.html`, `sql.html`
- <http://localhost:4174/nodejs.html>, `datos-python.html`, `react.html`, `typescript.html`: mini cursos.
- Agregar `?maintenance` a cualquier URL para ver la pantalla pública.

Para probar desde cero, utilizar un perfil de prueba separado. No limpiar el progreso real del usuario. Las pruebas
automatizadas ya crean almacenamiento en memoria independiente y no modifican el avance del navegador.

### Siguiente paso pendiente

Revisar primero un mini proyecto de cada tecnología nueva: elecciones, pistas, salida, avance y copia. Pedir al usuario
una revisión de claro/oscuro y móvil; las pruebas unitarias no sustituyen esa revisión visual. Después revisar SQL: leer las tablas, recorrer un ejemplo, resolver una misión
y probar los desafíos adicionales. Después revisar el flujo de exámenes en HTML/CSS, JavaScript y SQL: completar un nivel, responder,
revisar explicaciones, reintentar y regresar al curso. Verificar claro/oscuro y escritorio/móvil sin borrar el progreso
real. No volver a implementar los puntos de control: ya están terminados.

Después de esa revisión, pedir autorización antes de confirmar o publicar los cambios. La pantalla pública de
mantenimiento debe permanecer hasta que el usuario pida explícitamente abrir el sitio.

Si se pide pasar los mini cursos a editores libres, decidir e integrar runtimes reales aislados: los modelos actuales
solo cubren los selectores declarados. No ampliar las promesas de ejecución sin cambiar esa arquitectura y probarla.

## 6. Estructura de archivos y código relevante

```text
intenta/
├── CNAME                    # Dominio intenta.cl
├── HANDOFF.md               # Este documento
├── README.md                # Descripción general y arquitectura
├── index.html               # Portada y catálogo de tecnologías
├── python.html              # Vista independiente de Python
├── html-css.html            # Ruta de HTML y CSS
├── javascript.html          # Ruta de JavaScript
├── sql.html                 # Ruta de SQL
├── nodejs.html / datos-python.html / react.html / typescript.html # Mini cursos
├── mini-courses.js          # Registro y opciones permitidas
├── nodejs-course.js / datos-python-course.js / react-course.js / typescript-course.js # Contenido
├── mini-course.js / mini-course.css # Interfaz, modelos visibles y progreso independiente
├── mini-courses.test.mjs    # Doce proyectos y cien combinaciones
├── site.js                  # Tema compartido y año del footer
├── python-runtime.js        # Intérprete de Python del laboratorio (contrastado con CPython)
├── python.js                # 20 proyectos, puntos de control y exámenes de Python
├── starter-runtime.js       # Intérprete de JavaScript y motor de SQL
├── sql-course.js            # 12 lecciones didácticas y 3 desafíos extra de SQL
├── sql-guide.js             # Explorador, tablas de resultados y guía didáctica
├── sql.css                  # Estilos exclusivos de SQL sobre el tema compartido
├── sql-guide.test.mjs       # Prueba de la experiencia didáctica de SQL
├── starter-exams.js         # 9 exámenes, 45 preguntas y corrección pura
├── starter-course.js        # Módulos, desbloqueos, exámenes y progreso de las 3 rutas
├── starter-course.test.mjs  # 36 módulos, 108 validaciones, 9 exámenes y pruebas de marcado
├── python-checkpoints.test.mjs # Prueba de niveles y mini exámenes de Python
├── styles.css               # Diseño compartido, temas y responsive
├── favicon.svg
└── og.png
```

### Responsabilidades principales

`site.js`

- Alterna entre `light` y `dark`.
- Guarda la preferencia en `codigo-cero.theme`.
- Actualiza `theme-color` y el año del pie de página.

`python.js`

- Contiene la estructura de los 5 niveles y 20 proyectos de Python.
- Renderiza lecciones, pistas, navegación y validaciones.
- Ejecuta únicamente el subconjunto de Python permitido por los ejercicios.
- Guarda el progreso de proyectos en `codigo-cero.python-v2.completed` y los exámenes aprobados en `codigo-cero.python-v2.exams`.
- Controla el desbloqueo de niveles (`isLevelUnlocked`), el panel de punto de control y los tres mini exámenes.
- `gradeExam(levelId, answers)` corrige sin tocar el DOM y es el punto de entrada para las pruebas.

`starter-runtime.js`

- Publica `globalThis.StarterRuntime` con `runJavaScript(code)` y `runSql(code)`.
- `runJavaScript` devuelve `{ output, text, error, environment }`.
- `runSql` devuelve `{ columns, rows, error, text }`, con `text` ya formateado como tabla.
- Contiene la base de práctica `cursos` y `estudiantes`.

`starter-course.js`

- Selecciona la ruta mediante `body[data-course]`.
- Contiene `COURSES` con 3 niveles y 12 módulos para `html-css` y `javascript`; incorpora SQL desde `globalThis.SQLCourse`.
- Aplana los niveles en una lista de módulos y mantiene la navegación anterior y siguiente sobre esa lista.
- Renderiza pestañas de nivel, listado, lección, pistas y validaciones.
- Para HTML/CSS construye `iframe.srcdoc` dentro de un iframe aislado.
- Para JavaScript y SQL delega la ejecución en `StarterRuntime`.
- Cada validación recibe `(code, result)`, así que puede comprobar el texto escrito y el resultado real de la ejecución.
- Controla el desbloqueo, renderiza puntos de control y exámenes, guarda aprobaciones y muestra el cierre de la ruta.

`starter-exams.js`

- Publica `globalThis.StarterExams` con el banco `LEVEL_EXAMS` y `gradeExam(courseId, levelId, answers)`.
- `gradeExam` recibe respuestas como arreglo, objeto indexado o Map, y devuelve `{ total, correct, passing, passed, details }`.
- Debe cargarse antes de `starter-course.js` en las tres páginas de rutas.

### Fragmento central de selección de ruta

```js
const course = COURSES[document.body.dataset.course];
if (!course) return;
```

Cada página declara su tecnología así:

```html
<body class="course-page starter-page" data-course="html-css">
<body class="course-page starter-page" data-course="javascript">
<body class="course-page starter-page" data-course="sql">
```

### Seguridad importante

- No sustituir los intérpretes por `eval`, `Function()` o ejecución directa del código del usuario.
- Mantener las listas explícitas de propiedades y métodos del intérprete de JavaScript: son las que impiden llegar al prototipo o a `Function`.
- Conservar los límites de pasos, profundidad y salida del intérprete.
- Mantener `sandbox=""` en el iframe de HTML/CSS.
- No quitar la lógica de mantenimiento ni publicar hasta que el usuario lo solicite.
- Preservar los cambios locales existentes: el árbol de trabajo está deliberadamente sin commit.
