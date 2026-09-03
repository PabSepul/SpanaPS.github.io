(() => {
  "use strict";

  // Contenido local de repaso; no es una certificación ni una evaluación remota.
  const LEVEL_EXAMS = {
    "html-css": [
      {
        levelId: 1, title: "Mini examen de estructura HTML", passing: 4,
        intro: "Repasa etiquetas, enlaces, imágenes accesibles y estructura semántica. Responde las cinco preguntas; necesitas cuatro aciertos.",
        questions: [
          { question: "¿Qué etiqueta representa el título principal de una página?", options: ["<p>", "<h1>", "<footer>", "<li>"], answer: 1, explanation: "h1 identifica el título principal. p representa un párrafo y li un elemento de una lista." },
          { question: "¿Qué etiqueta contiene cada elemento dentro de una lista ul?", options: ["<img>", "<a>", "<li>", "<main>"], answer: 2, explanation: "Cada elemento de una lista se escribe dentro de li, que a su vez queda dentro de ul u ol." },
          { question: "¿Qué atributo indica a dónde lleva un enlace a?", options: ["href", "alt", "class", "src"], answer: 0, explanation: "href define la dirección de destino del enlace. src indica el recurso de una imagen y alt lo describe." },
          { question: "¿Para qué sirve un alt descriptivo en una imagen informativa?", options: ["Cambiar su ancho", "Agregar un borde", "Reemplazar su dirección", "Comunicar su contenido cuando no puede verse"], answer: 3, explanation: "alt ofrece una alternativa textual para lectores de pantalla o cuando la imagen no carga." },
          { question: "¿Dónde ubicarías el contenido principal, separado del encabezado y pie de página?", options: ["Dentro de footer", "Dentro de main", "Dentro de una etiqueta img", "Dentro de style"], answer: 1, explanation: "main identifica el contenido principal; header y footer organizan el encabezado y el pie de página." }
        ]
      },
      {
        levelId: 2, title: "Mini examen de estilos CSS", passing: 4,
        intro: "Comprueba cómo seleccionas elementos y controlas su espacio, lectura y estados. Necesitas cuatro de cinco aciertos.",
        questions: [
          { question: "¿Qué selector aplica estilos a class=\"mensaje\"?", options: ["#mensaje", "<mensaje>", ".mensaje", "@mensaje"], answer: 2, explanation: "El punto delante del nombre selecciona una clase: .mensaje encuentra los elementos con class=\"mensaje\"." },
          { question: "¿Qué propiedad agrega espacio entre el contenido y su borde?", options: ["padding", "margin", "color", "font-family"], answer: 0, explanation: "padding crea espacio interior. margin deja espacio exterior respecto a otros elementos." },
          { question: "¿Qué propiedad usarías para separar una caja de las cajas vecinas?", options: ["border-radius", "color", "font-size", "margin"], answer: 3, explanation: "margin controla el espacio exterior de la caja; no cambia la separación interna de su contenido." },
          { question: "¿Qué consigue line-height: 1.6 en un párrafo?", options: ["Crea seis columnas", "Ajusta la altura de línea para facilitar la lectura", "Redondea el borde", "Cambia la familia tipográfica"], answer: 1, explanation: "line-height define la altura de cada línea. El valor 1.6 es proporcional al tamaño de la fuente." },
          { question: "¿Cuándo se aplican los estilos de .accion:hover?", options: ["Siempre, aunque no exista el botón", "Solo al abrir un examen", "Cuando el puntero está sobre el elemento", "Únicamente en pantallas pequeñas"], answer: 2, explanation: ":hover es un estado que se activa al situar el puntero sobre el elemento; no es una regla de tamaño de pantalla." }
        ]
      },
      {
        levelId: 3, title: "Mini examen de composición web", passing: 4,
        intro: "Repasa flexbox, grid y diseño adaptable antes de cerrar tu ruta. Necesitas cuatro de cinco aciertos.",
        questions: [
          { question: "¿Qué declaración activa flexbox en el contenedor .fila?", options: ["display: flex", "font-family: flex", "position: grid", "color: flex"], answer: 0, explanation: "display: flex convierte al elemento en un contenedor flex y organiza sus hijos con ese sistema." },
          { question: "¿Qué describe grid-template-columns: repeat(3, 1fr)?", options: ["Tres filas de un píxel", "Una sola columna fija", "Tres bordes iguales", "Tres columnas con la misma fracción de espacio"], answer: 3, explanation: "repeat(3, 1fr) repite tres columnas de una fracción cada una, distribuyendo el espacio disponible." },
          { question: "¿Qué propiedad separa los elementos de un contenedor flex o grid?", options: ["alt", "gap", "href", "font-size"], answer: 1, explanation: "gap agrega separación entre los elementos de flex o grid sin crear espacio interior en cada elemento." },
          { question: "¿Cuándo se aplica @media (max-width: 600px)?", options: ["Solo cuando el ancho es mayor a 600px", "Cuando hay seis elementos", "Cuando la ventana tiene 600px de ancho o menos", "Solo cuando el texto mide 600px"], answer: 2, explanation: "max-width limita la regla a una ventana de hasta 600px inclusive; permite adaptar la interfaz a pantallas pequeñas." },
          { question: "¿Qué combinación permite una tarjeta con estructura y presentación adaptable?", options: ["article con contenido y CSS con una media query", "Solo un console.log", "Una consulta SELECT", "Eliminar todo el HTML y usar un color"], answer: 0, explanation: "HTML organiza el contenido de la tarjeta; CSS define su presentación y una media query puede ajustarla al ancho disponible." }
        ]
      }
    ],
    javascript: [
      {
        levelId: 1, title: "Mini examen de datos y operaciones", passing: 4,
        intro: "Comprueba variables, cálculos, textos y comparaciones. Responde las cinco preguntas; necesitas cuatro aciertos.",
        questions: [
          { question: "¿Qué ocurre si intentas reasignar una variable declarada con const?", options: ["Se convierte en una lista", "Se produce un error", "El navegador la elimina", "Se imprime automáticamente"], answer: 1, explanation: "const no permite reasignar la variable. Para un valor que necesitas reasignar durante un cálculo puedes utilizar let." },
          { question: "Si precio vale 4500 y cantidad vale 3, ¿cuánto vale precio * cantidad?", options: ["4503", "45003", "1500", "13500"], answer: 3, explanation: "El operador * multiplica los números: 4500 por 3 da un total de 13500." },
          { question: "¿Qué muestran console.log(lenguaje) y console.log(\"lenguaje\")?", options: ["Ambos muestran siempre JavaScript", "Ambos muestran el nombre de la variable", "El primero muestra el valor de la variable y el segundo el texto literal", "Ninguno puede mostrar texto"], answer: 2, explanation: "Sin comillas se consulta la variable. Con comillas se crea un texto literal, independiente del valor guardado." },
          { question: "Si nombre vale \"ada\", ¿qué devuelve nombre.toUpperCase()?", options: ["ADA", "ada", "3", "true"], answer: 0, explanation: "toUpperCase() devuelve una versión del texto en mayúsculas; por eso \"ada\" se transforma en \"ADA\"." },
          { question: "Si horas vale 12 y meta vale 10, ¿qué resultado tiene horas >= meta?", options: ["false", "true", "22", "\"horas\""], answer: 1, explanation: "La comparación pregunta si 12 es mayor o igual a 10. Como se cumple, su resultado booleano es true." }
        ]
      },
      {
        levelId: 2, title: "Mini examen de decisiones y colecciones", passing: 4,
        intro: "Aplica condiciones, arreglos y ciclos. Necesitas cuatro de cinco aciertos para aprobar esta etapa.",
        questions: [
          { question: "Con edad = 18, ¿se ejecuta la rama if (edad >= 18)?", options: ["No, solo acepta mayores de 18", "Se ejecutan siempre if y else", "Sí, la igualdad también cumple la condición", "No se pueden comparar números"], answer: 2, explanation: ">= incluye la igualdad. Cuando la condición de if se cumple, la rama else no se ejecuta." },
          { question: "Con nota = 5, if (nota >= 6) ... else if (nota >= 4) ... else ..., ¿qué rama se ejecuta?", options: ["else if (nota >= 4)", "if (nota >= 6)", "El último else", "Las tres ramas"], answer: 0, explanation: "Cinco no alcanza seis, pero sí es mayor o igual a cuatro. Se ejecuta la primera condición verdadera de la cadena." },
          { question: "¿Qué hace cursos.push(\"SQL\")?", options: ["Borra todos los cursos", "Ordena alfabéticamente", "Devuelve siempre el primer curso", "Agrega SQL al final del arreglo"], answer: 3, explanation: "push añade un elemento al final del arreglo y aumenta su cantidad de elementos." },
          { question: "En [\"Python\", \"SQL\"], ¿qué valor está en el índice 0?", options: ["SQL", "Python", "0", "No existe ningún valor"], answer: 1, explanation: "Los índices de los arreglos comienzan en cero: el primer elemento de este arreglo es \"Python\"." },
          { question: "Con total = 0, ¿cuánto queda después de sumar cada valor de [12, 6, 8] con for...of?", options: ["3", "8", "26", "1268"], answer: 2, explanation: "El acumulador suma cada número una vez: 0 + 12 + 6 + 8 da 26." }
        ]
      },
      {
        levelId: 3, title: "Mini examen de funciones y proyecto", passing: 4,
        intro: "Comprueba funciones y transformaciones de arreglos antes de cerrar la ruta. Necesitas cuatro de cinco aciertos.",
        questions: [
          { question: "¿Qué devuelve doblar(6) si la función retorna numero * 2?", options: ["12", "6", "2", "62"], answer: 0, explanation: "El parámetro recibe 6 y return entrega el resultado de 6 * 2, que es 12." },
          { question: "Si porcentaje tiene un valor por defecto de 10, ¿qué porcentaje usa descuento(1000)?", options: ["1000", "0", "Ninguno; siempre falla", "10"], answer: 3, explanation: "Cuando se omite ese argumento, se usa el valor por defecto declarado en el parámetro: 10." },
          { question: "¿Qué hace cursos.filter(curso => curso.horas >= 9)?", options: ["Suma todas las horas", "Crea un arreglo con los cursos que cumplen la condición", "Devuelve siempre un texto", "Cambia todas las horas por 9"], answer: 1, explanation: "filter conserva los elementos que cumplen la condición y devuelve un nuevo arreglo con ellos." },
          { question: "¿Qué devuelve cursos.map(curso => curso.nombre)?", options: ["La cantidad de cursos", "El primer curso", "Un arreglo con los nombres de los cursos", "Una suma de objetos"], answer: 2, explanation: "map transforma cada elemento con la función indicada; en este caso extrae el nombre de cada curso." },
          { question: "¿Qué expresión sirve para sumar el costo de un carrito, considerando la cantidad de cada producto?", options: ["items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)", "items.map(item => item.producto)", "items.filter(item => item.cantidad > 0)", "items.length"], answer: 0, explanation: "reduce acumula los subtotales precio por cantidad, empezando desde cero, y devuelve un único total." }
        ]
      }
    ],
    sql: [
      {
        levelId: 1, title: "Mini examen de consultas y filtros", passing: 4,
        intro: "Repasa columnas, tablas, valores distintos y condiciones. Responde las cinco preguntas; necesitas cuatro aciertos.",
        questions: [
          { question: "¿Qué indica SELECT nombre, nivel en una consulta?", options: ["Qué tabla borrar", "Qué columnas mostrar", "Qué filas insertar", "Qué contraseña utilizar"], answer: 1, explanation: "SELECT elige las columnas del resultado; nombre y nivel son los dos campos solicitados." },
          { question: "¿Qué parte indica la tabla de origen?", options: ["WHERE", "DISTINCT", "FROM cursos", "ORDER BY"], answer: 2, explanation: "FROM cursos especifica que los datos se obtienen de la tabla cursos." },
          { question: "¿Para qué se utiliza SELECT DISTINCT categoria?", options: ["Mostrar cada categoría sin repeticiones", "Borrar categorías", "Contar automáticamente las filas", "Ordenar siempre de mayor a menor"], answer: 0, explanation: "DISTINCT elimina las repeticiones del resultado de las columnas seleccionadas; no borra datos de la tabla." },
          { question: "¿Qué filtro selecciona los cursos de nivel Inicial?", options: ["ORDER BY 'Inicial'", "SELECT nivel > 'Inicial'", "FROM Inicial", "WHERE nivel = 'Inicial'"], answer: 3, explanation: "WHERE conserva las filas cuyo valor de nivel coincide con el texto 'Inicial'." },
          { question: "¿Qué exige WHERE nivel = 'Inicial' AND duracion > 6?", options: ["Que se cumpla solo una condición", "Que ambas condiciones se cumplan", "Que ninguna condición se cumpla", "Que la duración sea exactamente 6"], answer: 1, explanation: "AND exige que las dos condiciones sean verdaderas para incluir la fila en el resultado." }
        ]
      },
      {
        levelId: 2, title: "Mini examen de búsqueda y orden", passing: 4,
        intro: "Comprueba patrones, rangos, ordenamiento y límites. Necesitas cuatro de cinco aciertos.",
        questions: [
          { question: "¿Qué busca nombre LIKE '%Python%'?", options: ["Solo el nombre exacto Python", "Nombres sin Python", "Nombres que contienen Python", "Únicamente nombres que empiezan con el signo %"], answer: 2, explanation: "El comodín % permite texto antes y después de Python; por eso el patrón busca esa palabra dentro del nombre." },
          { question: "¿Qué duraciones incluye BETWEEN 5 AND 9?", options: ["De 5 a 9, incluyendo ambos extremos", "Solo 6, 7 y 8", "Solo 5 y 9", "Todas las mayores de 9"], answer: 0, explanation: "BETWEEN incluye los límites: selecciona los valores mayores o iguales a 5 y menores o iguales a 9." },
          { question: "¿Cómo ordena ORDER BY inscritos DESC?", options: ["De menor a mayor", "Por nombre", "En un orden aleatorio", "De mayor a menor cantidad de inscritos"], answer: 3, explanation: "DESC indica orden descendente; las filas con más inscritos aparecen primero." },
          { question: "¿Qué hace LIMIT 3 después de ordenar?", options: ["Multiplica cada duración por tres", "Conserva como máximo las tres primeras filas", "Muestra la tercera columna", "Elimina tres cursos de la tabla"], answer: 1, explanation: "LIMIT recorta la cantidad de filas del resultado; no modifica ni elimina los datos originales." },
          { question: "¿Qué final de consulta devuelve los tres cursos de mayor duración?", options: ["ORDER BY duracion ASC LIMIT 3", "LIMIT 3 ORDER BY nombre", "ORDER BY duracion DESC LIMIT 3", "WHERE duracion = 3"], answer: 2, explanation: "Primero se ordena de mayor a menor duración con DESC y luego se toman las tres primeras filas con LIMIT." }
        ]
      },
      {
        levelId: 3, title: "Mini examen de resúmenes y relaciones", passing: 4,
        intro: "Repasa funciones de resumen, agrupación y JOIN antes de cerrar la ruta. Necesitas cuatro de cinco aciertos.",
        questions: [
          { question: "¿Qué calcula COUNT(*)?", options: ["La cantidad de filas", "El promedio de duración", "El nombre más largo", "La suma de todos los identificadores"], answer: 0, explanation: "COUNT(*) cuenta las filas consideradas por la consulta, después de aplicar sus filtros." },
          { question: "¿Qué hace AS promedio en AVG(duracion) AS promedio?", options: ["Cambia la tabla original", "Filtra los cursos largos", "Duplica el promedio", "Da el nombre promedio a la columna del resultado"], answer: 3, explanation: "AS asigna un alias legible a la columna calculada; no renombra una columna de la tabla original." },
          { question: "¿Qué función calcula el total de todas las duraciones?", options: ["AVG(duracion)", "SUM(duracion)", "MIN(duracion)", "COUNT(*)"], answer: 1, explanation: "SUM suma los valores. AVG obtiene el promedio, MIN el menor valor y COUNT la cantidad de filas." },
          { question: "¿Qué produce SELECT categoria, COUNT(*) AS total FROM cursos GROUP BY categoria?", options: ["Una fila por cada estudiante", "Un único nombre de curso", "Una fila por categoría con su cantidad de cursos", "Una tabla nueva en la base de datos"], answer: 2, explanation: "GROUP BY forma grupos por categoría y COUNT(*) cuenta los cursos de cada grupo." },
          { question: "¿Qué relación permite unir cada estudiante con su curso?", options: ["estudiantes.curso_id = cursos.id", "estudiantes.nombre = cursos.nombre", "estudiantes.id = cursos.duracion", "cursos.id = cursos.duracion"], answer: 0, explanation: "curso_id indica el curso del estudiante y se relaciona con el identificador id de la tabla cursos mediante JOIN ... ON." }
        ]
      }
    ]
  };

  // Corrección pura: permite probar el umbral sin crear elementos de interfaz.
  function gradeExam(courseId, levelId, answers) {
    const exam = LEVEL_EXAMS[courseId]?.find((item) => item.levelId === levelId);
    if (!exam) return null;
    const details = exam.questions.map((question, index) => {
      const chosen = typeof answers?.get === "function" ? answers.get(index) : answers?.[index];
      return { index, chosen: chosen ?? null, answer: question.answer, isCorrect: chosen === question.answer };
    });
    const correct = details.filter((detail) => detail.isCorrect).length;
    return { total: exam.questions.length, correct, passing: exam.passing, passed: correct >= exam.passing, details };
  }

  globalThis.StarterExams = { LEVEL_EXAMS, gradeExam };
})();
