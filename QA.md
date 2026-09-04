# Revisión del 3 de septiembre de 2026

## Alcance

Ocho rutas, portada, continuidad local, ejercicios guiados y mantenimiento con vista previa por enlace.
El usuario autorizó publicar esta versión en GitHub Pages manteniendo cerrado el acceso general.
El enlace de revisión no autentica ni protege información privada.

## Pruebas automáticas

Las siete suites pasan:

- `starter-course.test.mjs`: 36 módulos, 108 validaciones y 9 exámenes / 45 preguntas;
  desbloqueos, reintentos, progreso, marcado y recursos de las páginas.
- `python-checkpoints.test.mjs`: 5 niveles, 20 proyectos resueltos con soluciones de referencia,
  60 validaciones, 5 exámenes / 25 preguntas, desbloqueos, cierre de ruta e invalidación al editar.
  Contrasta las 20 soluciones con CPython cuando está disponible.
- `python-runtime.test.mjs`: 65 programas con la salida registrada de CPython 3.12 y 10 errores
  explicados en español; vuelve a comparar en vivo si el equipo tiene Python.
- `sql-guide.test.mjs`: 12 lecciones, 12 ejemplos, 3 desafíos, tablas y aislamiento entre editores.
- `mini-courses.test.mjs`: 12 proyectos, 36 comprobaciones, 100 combinaciones;
  24 resultados contrastados con CPython y plantillas Node contrastadas con dobles de archivos/HTTP.
- `learning-state.test.mjs`: las 8 rutas, borradores, reanudación, progreso anterior,
  exámenes pendientes, cuota agotada, datos corruptos y actualización del catálogo.
- `review-preview.test.mjs`: las 9 páginas, ambos dominios, entrada/salida, prioridad del mantenimiento,
  sesión, enlace incorrecto, almacenamiento bloqueado y noindex. El HTML comienza en mantenimiento.

## Comprobaciones en navegador

Se usó `127.0.0.1:4174` para separar las pruebas del avance del usuario en `localhost:4174`.

- Python: ejecutar, invalidar aprobación al editar, conservar borrador y proyecto al recargar,
  completar los primeros 4 proyectos, desbloquear nivel 2, examen sin respuestas y aprobación 5/5.
  La portada reflejó 4/20 proyectos y 1/5 exámenes.
- HTML/CSS: resolver primer módulo, comprobar contenido de la vista previa aislada y completar;
  cambiar pestaña usando el teclado.
- JavaScript: ejecutar y completar el primer módulo.
- SQL: resolver primera misión; ejecutar el desafío adicional de cursos de hasta seis horas,
  comprobando sus tres filas ordenadas sin afectar al módulo principal.
- Node.js, Datos con Python, React y TypeScript: resolver y completar el primer mini proyecto de cada curso.
  El catálogo conserva los avances; React recupera su proyecto activo tras recargar.
- React: construir el contador, pulsar para pasar de 0 a 1 y reiniciarlo.
- Medición de anchura en las ocho rutas con viewports 1440×1000 y 390×844, en claro y oscuro;
  se comprueba que el documento no tenga desbordamiento horizontal y que los editores conserven ancho útil.
- Inspección visual de muestras de lecciones y resultados, incluidos HTML/CSS móvil, Node escritorio
  y Datos con Python móvil oscuro. No es una certificación de accesibilidad.

## Límites que se deben mantener explícitos

- Solo navegador integrado de escritorio con viewport móvil; falta probar dispositivos físicos, Safari y lectores de pantalla.
- Los doce ejercicios de cada ruta se cubren automáticamente; no se recorrieron manualmente todos en navegador.
- Python se ejecuta con un intérprete propio que cubre un subconjunto amplio del lenguaje, contrastado con CPython.
  No es CPython: no hay módulos externos (import), input(), lambda, clases ni archivos. Lo declara en pantalla.
- No hay un servidor Node real, compilador TypeScript ni runtime React en los laboratorios.
  Los mini cursos siguen siendo constructores guiados.
- Los ejemplos React/TypeScript no se compilaron en un proyecto externo.
- Las comprobaciones HTML/CSS son patrones educativos, no un validador completo de semántica o accesibilidad.
- Progreso y borradores se guardan en un solo navegador/origen. No hay cuentas ni sincronización.
- La vista previa permite revisar el sitio publicado, pero sus archivos y el repositorio siguen siendo públicos.

## Próxima revisión

Probar la experiencia con principiantes y dispositivos reales. Registrar tropiezos didácticos antes de ampliar
el catálogo o cambiar los simuladores por editores libres. Mantener el mantenimiento hasta autorización expresa.
