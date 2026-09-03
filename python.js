const PROGRESS_KEY = "codigo-cero.python-v2.completed";

const COURSE_LEVELS = [
  {
    id: 1,
    title: "Fundamentos",
    description: "Mensajes, variables y operaciones",
    stage: "Conceptos básicos",
    completionTitle: "Finalizaste los conceptos básicos de Python.",
    completionCopy: "Completaste los cuatro proyectos del nivel. Rinde el mini examen para certificar lo aprendido; los conceptos avanzados ya quedaron disponibles.",
    approvedCopy: "Aprobaste el mini examen de conceptos básicos. Puedes repetirlo cuando quieras para repasar.",
    projects: [
      {
        id: 1,
        title: "Tu primer mensaje",
        shortTitle: "Primer mensaje",
        duration: "8 min",
        difficulty: "Inicio",
        file: "proyecto_01.py",
        summary: "Todo programa comienza con una instrucción. print() le pide a Python que muestre información.",
        example: 'print("Hola, Python")',
        explanation: "print() es una función incorporada. El texto entre comillas es el valor que queremos mostrar en la consola.",
        concepts: ["Llamar una función", "Escribir texto entre comillas", "Leer la salida de un programa"],
        goal: "Escribe un mensaje propio, ejecuta el código y comprueba que aparezca en la consola.",
        starter: 'print("Estoy aprendiendo Python")',
        hints: [
          "Conserva la palabra print y los paréntesis.",
          "El mensaje debe quedar entre comillas dobles o simples.",
          'Una solución válida se parece a print("Mi primer programa").',
        ],
        checks: ["Usas print()", "El programa muestra un mensaje", "El mensaje contiene texto"],
        success: "Ya sabes ejecutar una instrucción y leer su resultado.",
        validate(result, source) {
          return [
            /print\s*\(/.test(source),
            result.output.length > 0,
            result.output.some((line) => line.trim().length >= 3),
          ];
        },
      },
      {
        id: 2,
        title: "Construye tu ficha",
        shortTitle: "Ficha personal",
        duration: "12 min",
        difficulty: "Fundamentos",
        file: "proyecto_02.py",
        summary: "Las variables permiten guardar datos con un nombre y volver a utilizarlos en otras instrucciones.",
        example: 'nombre = "Ada"',
        explanation: "El signo igual guarda el valor de la derecha dentro del nombre de la izquierda. Una f-string combina variables y texto.",
        concepts: ["Variables de texto y número", "Asignación con =", "Texto con formato usando f"],
        goal: "Cambia el nombre y la edad, y muestra ambos valores en una frase.",
        starter: 'nombre = "Ada"\nedad = 28\nprint(f"Soy {nombre} y tengo {edad} años")',
        hints: [
          "Guarda el nombre entre comillas y la edad como un número.",
          "Dentro de una f-string puedes escribir {nombre} y {edad}.",
          'Comprueba que la última línea comience con print(f".',
        ],
        checks: ["Creas nombre y edad", "Usas una f-string", "La salida muestra ambos datos"],
        success: "Combinaste variables de distintos tipos dentro de una frase.",
        validate(result, source) {
          const hasData = Object.prototype.hasOwnProperty.call(result.environment, "nombre")
            && Object.prototype.hasOwnProperty.call(result.environment, "edad");
          return [
            hasData,
            /print\s*\(\s*f["']/.test(source),
            hasData && result.output.some((line) => line.includes(String(result.environment.nombre))
              && line.includes(String(result.environment.edad))),
          ];
        },
      },
      {
        id: 3,
        title: "Calcula una propina",
        shortTitle: "Calculadora",
        duration: "15 min",
        difficulty: "Operaciones",
        file: "proyecto_03.py",
        summary: "Python puede combinar variables y operadores para transformar datos y producir un resultado nuevo.",
        example: "total = cuenta + propina",
        explanation: "Las operaciones se evalúan antes de guardar el resultado. Separarlas en pasos hace que el cálculo sea fácil de leer y comprobar.",
        concepts: ["Multiplicar y dividir", "Reutilizar resultados", "Construir un cálculo por pasos"],
        goal: "Calcula la propina y el total de una cuenta utilizando el porcentaje indicado.",
        starter: 'cuenta = 20000\nporcentaje = 10\npropina = cuenta * porcentaje\npropina = propina / 100\ntotal = cuenta + propina\nprint(f"Propina: {propina}")\nprint(f"Total: {total}")',
        hints: [
          "Primero multiplica la cuenta por el porcentaje.",
          "Divide ese resultado por 100 para obtener la propina real.",
          "El total se obtiene sumando cuenta + propina.",
        ],
        checks: ["Calculas la propina", "Calculas el total", "Muestras ambos resultados"],
        success: "Convertiste una fórmula cotidiana en instrucciones de Python.",
        validate(result) {
          const env = result.environment;
          const expectedTip = Number(env.cuenta) * Number(env.porcentaje) / 100;
          const expectedTotal = Number(env.cuenta) + expectedTip;
          return [
            Number.isFinite(env.propina) && Math.abs(env.propina - expectedTip) < 0.001,
            Number.isFinite(env.total) && Math.abs(env.total - expectedTotal) < 0.001,
            result.output.some((line) => line.includes(String(env.propina)))
              && result.output.some((line) => line.includes(String(env.total))),
          ];
        },
      },
      {
        id: 4,
        title: "Convierte minutos",
        shortTitle: "Conversor de tiempo",
        duration: "15 min",
        difficulty: "Práctico",
        file: "proyecto_04.py",
        summary: "La división entera obtiene unidades completas y el módulo conserva el resto de una división.",
        example: "135 // 60  →  2",
        explanation: "// devuelve horas completas y % devuelve los minutos que sobran. Juntos permiten expresar una duración con claridad.",
        concepts: ["División entera //", "Resto con %", "Combinar resultados"],
        goal: "Cambia la cantidad de minutos y muestra su equivalente en horas y minutos.",
        starter: 'minutos = 135\nhoras = minutos // 60\nresto = minutos % 60\nprint(f"{horas} h y {resto} min")',
        hints: [
          "Divide minutos // 60 para obtener horas completas.",
          "Usa minutos % 60 para calcular lo que sobra.",
          "Muestra horas y resto dentro de una f-string.",
        ],
        checks: ["Calculas horas completas", "Calculas los minutos restantes", "Muestras la conversión"],
        success: "Usaste dos operadores para resolver un problema de tiempo.",
        validate(result, source) {
          const env = result.environment;
          return [
            Number.isFinite(env.minutos) && env.horas === Math.floor(env.minutos / 60) && source.includes("//"),
            Number.isFinite(env.minutos) && env.resto === env.minutos % 60 && source.includes("%"),
            result.output.some((line) => line.includes(String(env.horas)) && line.includes(String(env.resto))),
          ];
        },
      },
    ],
  },
  {
    id: 2,
    title: "Decisiones y ciclos",
    description: "Condiciones, repeticiones y listas",
    stage: "Conceptos avanzados",
    completionTitle: "Finalizaste los conceptos avanzados de Python.",
    completionCopy: "Ya controlas decisiones, ciclos y listas. Rinde el mini examen del nivel; los conceptos expertos ya quedaron disponibles.",
    approvedCopy: "Aprobaste el mini examen de conceptos avanzados. Puedes repetirlo cuando quieras para repasar.",
    projects: [
      {
        id: 5,
        title: "Decide según una edad",
        shortTitle: "Mayoría de edad",
        duration: "16 min",
        difficulty: "Condiciones",
        file: "proyecto_05.py",
        summary: "Una condición permite que el programa elija qué camino seguir según el valor de una expresión.",
        example: "if edad >= 18:",
        explanation: "if comprueba una condición. Si es verdadera ejecuta el primer bloque; else define qué sucede en cualquier otro caso.",
        concepts: ["Comparar con >=", "Crear bloques con sangría", "Elegir entre dos resultados"],
        goal: "Cambia la edad y consigue que el programa indique correctamente si la persona es mayor o menor de edad.",
        starter: 'edad = 17\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")',
        hints: [
          "La comparación debe quedar después de if y terminar con dos puntos.",
          "Las líneas dentro de if y else necesitan cuatro espacios de sangría.",
          "Usa edad >= 18 para representar la mayoría de edad.",
        ],
        checks: ["Creas una condición con if", "Incluyes una alternativa con else", "El resultado corresponde a la edad"],
        success: "Tu programa ya puede elegir entre dos caminos.",
        execute: runAgeDecision,
        validate(result, source) {
          const expected = result.environment.edad >= 18 ? "Mayor de edad" : "Menor de edad";
          return [
            /if\s+edad\s*>=\s*18\s*:/.test(source),
            /else\s*:/.test(source),
            result.output.includes(expected) && /print\s*\(/.test(source),
          ];
        },
      },
      {
        id: 6,
        title: "Clasifica la temperatura",
        shortTitle: "Clasificador",
        duration: "18 min",
        difficulty: "Condiciones",
        file: "proyecto_06.py",
        summary: "elif agrega alternativas intermedias cuando una decisión necesita más de dos resultados posibles.",
        example: "elif temperatura < 25:",
        explanation: "Python evalúa las condiciones de arriba hacia abajo y ejecuta solamente el primer bloque que resulte verdadero.",
        concepts: ["Encadenar if, elif y else", "Ordenar condiciones", "Clasificar un valor numérico"],
        goal: "Prueba diferentes temperaturas y clasifícalas como frío, agradable o calor.",
        starter: 'temperatura = 22\nif temperatura < 10:\n    print("Hace frío")\nelif temperatura < 25:\n    print("Clima agradable")\nelse:\n    print("Hace calor")',
        hints: [
          "Comienza comprobando el rango más bajo.",
          "elif temperatura < 25 cubre el rango intermedio.",
          "else se encarga de cualquier temperatura restante.",
        ],
        checks: ["Usas if, elif y else", "Mantienes los límites 10 y 25", "La clasificación coincide con la temperatura"],
        success: "Construiste una decisión con tres resultados posibles.",
        execute: runTemperatureClassifier,
        validate(result, source) {
          const value = result.environment.temperatura;
          const expected = value < 10 ? "Hace frío" : value < 25 ? "Clima agradable" : "Hace calor";
          return [
            /if\s+temperatura/.test(source) && /elif\s+temperatura/.test(source) && /else\s*:/.test(source),
            source.includes("< 10") && source.includes("< 25"),
            result.output.includes(expected) && /print\s*\(/.test(source),
          ];
        },
      },
      {
        id: 7,
        title: "Construye un contador",
        shortTitle: "Contador",
        duration: "16 min",
        difficulty: "Ciclos",
        file: "proyecto_07.py",
        summary: "Un ciclo for repite un bloque para cada valor producido por range().",
        example: "for numero in range(1, 6):",
        explanation: "range(1, 6) produce los números desde 1 hasta 5. El límite final no se incluye.",
        concepts: ["Repetir con for", "Crear secuencias con range", "Usar una variable de iteración"],
        goal: "Haz que el contador muestre cinco números consecutivos, comenzando desde 1.",
        starter: "for numero in range(1, 6):\n    print(numero)",
        hints: [
          "range necesita un inicio y un límite final.",
          "Para obtener del 1 al 5, el límite final debe ser 6.",
          "print(numero) debe estar dentro del ciclo y llevar sangría.",
        ],
        checks: ["Usas un ciclo for", "Generas cinco valores con range", "Muestras los números del 1 al 5"],
        success: "Automatizaste una tarea repetitiva con un ciclo.",
        execute: runRangeLoop,
        validate(result, source) {
          return [
            /for\s+\w+\s+in\s+range\s*\(/.test(source),
            result.environment.values.length === 5,
            result.output.join(",") === "1,2,3,4,5" && /print\s*\(\s*numero\s*\)/.test(source),
          ];
        },
      },
      {
        id: 8,
        title: "Recorre una lista de tareas",
        shortTitle: "Lista de tareas",
        duration: "20 min",
        difficulty: "Listas",
        file: "proyecto_08.py",
        summary: "Una lista reúne varios valores en orden y un ciclo permite trabajar con cada elemento por separado.",
        example: 'tareas = ["Leer", "Practicar"]',
        explanation: "Los corchetes crean una lista. En cada vuelta del ciclo, la variable tarea recibe uno de sus elementos.",
        concepts: ["Crear una lista", "Recorrer elementos", "Mostrar cada valor"],
        goal: "Agrega al menos tres tareas y consigue que el programa muestre cada una en una línea.",
        starter: 'tareas = ["Leer", "Practicar", "Crear"]\nfor tarea in tareas:\n    print(tarea)',
        hints: [
          "Separa los textos de la lista con comas.",
          "Usa for tarea in tareas para recorrerla.",
          "La instrucción print(tarea) debe tener sangría.",
        ],
        checks: ["Creas una lista con tres elementos", "Recorres la lista con for", "Muestras todas las tareas"],
        success: "Guardaste y recorriste una colección completa.",
        execute: runListLoop,
        validate(result, source) {
          return [
            result.environment.tareas.length >= 3,
            /for\s+tarea\s+in\s+tareas\s*:/.test(source),
            result.output.length === result.environment.tareas.length && /print\s*\(\s*tarea\s*\)/.test(source),
          ];
        },
      },
    ],
  },
  {
    id: 3,
    title: "Funciones y proyecto final",
    description: "Código reutilizable y un desafío completo",
    stage: "Conceptos expertos",
    completionTitle: "Finalizaste los conceptos expertos de Python.",
    completionCopy: "Terminaste los doce proyectos. Aprueba este último mini examen para cerrar la ruta completa.",
    approvedCopy: "Aprobaste los tres mini exámenes de la ruta. Completaste Python de principio a fin.",
    projects: [
      {
        id: 9,
        title: "Crea una función para saludar",
        shortTitle: "Función saludar",
        duration: "18 min",
        difficulty: "Funciones",
        file: "proyecto_09.py",
        summary: "Una función agrupa instrucciones bajo un nombre para poder utilizarlas cuantas veces sea necesario.",
        example: "def saludar(nombre):",
        explanation: "def crea la función, el parámetro recibe un dato y return entrega el resultado a quien llamó la función.",
        concepts: ["Definir con def", "Recibir parámetros", "Devolver con return"],
        goal: "Crea saludar(nombre) y úsala para generar un saludo personalizado.",
        starter: 'def saludar(nombre):\n    return f"Hola, {nombre}"\n\nprint(saludar("Ada"))',
        hints: [
          "La definición debe comenzar con def saludar(nombre):",
          "Dentro de la función devuelve una f-string usando return.",
          'Llama la función dentro de print, por ejemplo saludar("Ada").',
        ],
        checks: ["Defines saludar(nombre)", "Devuelves un texto con return", "Llamas la función y muestras el saludo"],
        success: "Creaste y utilizaste tu primera función.",
        execute: runGreetingFunction,
        validate(result, source) {
          return [
            /def\s+saludar\s*\(\s*nombre\s*\)\s*:/.test(source),
            /return\s+f?["']/.test(source),
            result.output.some((line) => line.includes(result.environment.nombre)) && /print\s*\(/.test(source),
          ];
        },
      },
      {
        id: 10,
        title: "Calcula un precio final",
        shortTitle: "Función descuento",
        duration: "22 min",
        difficulty: "Funciones",
        file: "proyecto_10.py",
        summary: "Los parámetros permiten reutilizar una misma fórmula con diferentes precios y porcentajes.",
        example: "precio_final(25000, 15)",
        explanation: "Una función puede recibir varios parámetros, realizar operaciones internas y devolver un único resultado.",
        concepts: ["Usar dos parámetros", "Calcular dentro de una función", "Reutilizar una fórmula"],
        goal: "Completa precio_final(precio, descuento) y muestra el resultado de una compra.",
        starter: 'def precio_final(precio, descuento):\n    rebaja = precio * descuento\n    rebaja = rebaja / 100\n    return precio - rebaja\n\nprint(precio_final(25000, 15))',
        hints: [
          "Multiplica precio por descuento para comenzar la rebaja.",
          "Divide la rebaja por 100 antes de restarla.",
          "La última línea de la función debe devolver precio - rebaja.",
        ],
        checks: ["Defines dos parámetros", "Devuelves el precio menos la rebaja", "El resultado numérico es correcto"],
        success: "Encapsulaste una fórmula reutilizable dentro de una función.",
        execute: runDiscountFunction,
        validate(result, source) {
          return [
            /def\s+precio_final\s*\(\s*precio\s*,\s*descuento\s*\)\s*:/.test(source),
            /return\s+precio\s*-\s*rebaja/.test(source),
            Math.abs(Number(result.output[0]) - result.environment.expected) < 0.001 && /print\s*\(/.test(source),
          ];
        },
      },
      {
        id: 11,
        title: "Obtén un promedio",
        shortTitle: "Promedio de notas",
        duration: "20 min",
        difficulty: "Datos",
        file: "proyecto_11.py",
        summary: "Las funciones sum() y len() permiten resumir una lista sin recorrerla manualmente.",
        example: "promedio = sum(notas) / len(notas)",
        explanation: "sum(notas) suma los valores y len(notas) cuenta cuántos existen. Dividir ambos resultados produce el promedio.",
        concepts: ["Guardar números en listas", "Sumar con sum", "Contar con len"],
        goal: "Agrega varias notas, calcula su promedio y muéstralo en la consola.",
        starter: 'notas = [6.5, 5.8, 6.2]\npromedio = sum(notas) / len(notas)\nprint(f"Promedio: {promedio}")',
        hints: [
          "Las notas deben ir dentro de corchetes y separadas por comas.",
          "Usa sum(notas) para obtener el total.",
          "Divide ese total por len(notas).",
        ],
        checks: ["Creas una lista de notas", "Utilizas sum() y len()", "El promedio mostrado es correcto"],
        success: "Resumiste una colección de datos con funciones incorporadas.",
        execute: runAverageProject,
        validate(result, source) {
          const shown = result.output.join(" ");
          return [
            result.environment.notas.length >= 3,
            /sum\s*\(\s*notas\s*\)/.test(source) && /len\s*\(\s*notas\s*\)/.test(source),
            shown.includes(String(result.environment.promedio)) && /print\s*\(/.test(source),
          ];
        },
      },
      {
        id: 12,
        title: "Recomienda una sesión de estudio",
        shortTitle: "Proyecto final",
        duration: "30 min",
        difficulty: "Desafío final",
        file: "proyecto_12.py",
        summary: "El proyecto final combina variables, decisiones, funciones y texto con formato en un pequeño recomendador.",
        example: "recomendar(horas, tema)",
        explanation: "El programa recibe un tiempo disponible y un tema, decide la profundidad adecuada y devuelve una recomendación personalizada.",
        concepts: ["Combinar fundamentos", "Tomar una decisión dentro de una función", "Construir una salida útil"],
        goal: "Modifica horas y tema, y consigue una recomendación que cambie según el tiempo disponible.",
        starter: 'horas = 3\ntema = "funciones"\n\ndef recomendar(horas, tema):\n    if horas >= 2:\n        return f"Practica {tema} con un proyecto"\n    return f"Repasa {tema} durante 20 minutos"\n\nprint(recomendar(horas, tema))',
        hints: [
          "La función necesita recibir horas y tema.",
          "Dentro de la función usa if horas >= 2.",
          "Ambos caminos deben devolver una recomendación que incluya tema.",
        ],
        checks: ["Defines las variables de entrada", "Combinas función, condición y return", "La recomendación cambia según las horas"],
        success: "Completaste una solución que combina toda la ruta.",
        execute: runStudyRecommender,
        validate(result, source) {
          const env = result.environment;
          const expectedPhrase = env.horas >= 2 ? "Practica" : "Repasa";
          return [
            Number.isFinite(env.horas) && typeof env.tema === "string",
            /def\s+recomendar/.test(source) && /if\s+horas\s*>=\s*2/.test(source) && /return\s+f?["']/.test(source),
            result.output.some((line) => line.includes(expectedPhrase) && line.includes(env.tema)) && /print\s*\(\s*recomendar/.test(source),
          ];
        },
      },
    ],
  },
];

const EXAMS_KEY = "codigo-cero.python-v2.exams";

const LEVEL_EXAMS = [
  {
    levelId: 1,
    title: "Mini examen de conceptos básicos",
    intro: "Cinco preguntas sobre mensajes, variables y operaciones. Necesitas 4 respuestas correctas para aprobar.",
    passing: 4,
    questions: [
      {
        question: "¿Qué hace print(\"Hola\")?",
        options: [
          "Guarda el texto dentro de una variable",
          "Muestra el texto en la consola",
          "Convierte el texto en un número",
          "Crea un archivo con ese texto"
        ],
        answer: 1,
        explanation: "print() es una función incorporada: escribe en la consola el valor que recibe entre paréntesis."
      },
      {
        question: "¿Cuál línea guarda el número 28 dentro de la variable edad?",
        options: ["edad == 28", "28 = edad", "edad = 28", "print(edad)"],
        answer: 2,
        explanation: "El signo igual asigna: a la izquierda va el nombre de la variable y a la derecha el valor."
      },
      {
        question: "Si nombre = \"Ada\", ¿qué muestra print(f\"Hola {nombre}\")?",
        options: ["Hola {nombre}", "Hola Ada", "f\"Hola Ada\"", "Un error, porque falta una coma"],
        answer: 1,
        explanation: "La f inicial convierte el texto en una f-string y reemplaza {nombre} por el valor guardado."
      },
      {
        question: "¿Cuál es el resultado de 7 // 2?",
        options: ["3.5", "3", "1", "14"],
        answer: 1,
        explanation: "// es la división entera: entrega 3 y descarta la parte decimal. Con / obtendrías 3.5."
      },
      {
        question: "¿En qué se diferencian 5 y \"5\"?",
        options: [
          "En nada, Python los trata igual",
          "5 es un número y \"5\" es texto",
          "\"5\" es un número decimal",
          "5 solo puede usarse dentro de print"
        ],
        answer: 1,
        explanation: "Las comillas convierten el valor en texto: \"5\" + \"5\" entrega \"55\", mientras que 5 + 5 entrega 10."
      }
    ]
  },
  {
    levelId: 2,
    title: "Mini examen de conceptos avanzados",
    intro: "Cinco preguntas sobre condiciones, ciclos y listas. Necesitas 4 respuestas correctas para aprobar.",
    passing: 4,
    questions: [
      {
        question: "Con edad = 15, ¿qué imprime un if edad >= 18 que tiene un else?",
        options: [
          "El mensaje del if",
          "El mensaje del else",
          "Los dos mensajes",
          "Nada, porque falta un elif"
        ],
        answer: 1,
        explanation: "15 >= 18 es falso, así que Python ejecuta el bloque else."
      },
      {
        question: "¿Para qué sirve elif?",
        options: [
          "Para repetir un bloque de código",
          "Para revisar otra condición cuando la anterior resultó falsa",
          "Para terminar el programa",
          "Para declarar una variable nueva"
        ],
        answer: 1,
        explanation: "elif encadena condiciones: solo se evalúa si las anteriores no se cumplieron."
      },
      {
        question: "¿Cuántas veces se repite for numero in range(1, 5)?",
        options: ["5 veces", "4 veces", "6 veces", "1 vez"],
        answer: 1,
        explanation: "range(1, 5) recorre 1, 2, 3 y 4: incluye el inicio y excluye el final."
      },
      {
        question: "Si tareas = [\"Leer\", \"Practicar\"], ¿cómo obtienes \"Leer\"?",
        options: ["tareas[1]", "tareas[0]", "tareas(\"Leer\")", "tareas.primero"],
        answer: 1,
        explanation: "Las posiciones empiezan en cero, así que el primer elemento es tareas[0]."
      },
      {
        question: "¿Qué símbolo compara si dos valores son iguales?",
        options: ["=", "==", "=>", "><"],
        answer: 1,
        explanation: "Un signo igual asigna un valor; dos signos iguales comparan y entregan True o False."
      }
    ]
  },
  {
    levelId: 3,
    title: "Mini examen de conceptos expertos",
    intro: "Cinco preguntas sobre funciones, parámetros y resultados. Necesitas 4 respuestas correctas para aprobar.",
    passing: 4,
    questions: [
      {
        question: "¿Cuál línea define correctamente una función?",
        options: [
          "function saludar(nombre):",
          "def saludar(nombre):",
          "def saludar[nombre]:",
          "saludar = def(nombre)"
        ],
        answer: 1,
        explanation: "En Python una función se define con def, el nombre, los paréntesis y dos puntos."
      },
      {
        question: "¿Qué hace return dentro de una función?",
        options: [
          "Muestra el valor en la consola",
          "Entrega el resultado a quien llamó la función",
          "Detiene el programa completo",
          "Convierte la función en variable"
        ],
        answer: 1,
        explanation: "return entrega el valor y termina la función. print solo lo muestra, no lo devuelve."
      },
      {
        question: "Si una función no tiene return, ¿qué devuelve al llamarla?",
        options: ["0", "None", "Un error", "El último print"],
        answer: 1,
        explanation: "Sin return, Python devuelve None: la función hizo su trabajo pero no entregó un valor."
      },
      {
        question: "¿Qué es un parámetro?",
        options: [
          "El nombre de la función",
          "El dato que la función recibe para trabajar",
          "El resultado final de la función",
          "Un comentario dentro del código"
        ],
        answer: 1,
        explanation: "El parámetro es la entrada: se declara entre paréntesis y toma el valor de cada llamada."
      },
      {
        question: "¿Cómo se calcula el promedio de notas = [4, 5, 6]?",
        options: [
          "sum(notas)",
          "sum(notas) / len(notas)",
          "len(notas) / sum(notas)",
          "notas / 3"
        ],
        answer: 1,
        explanation: "sum() suma los valores y len() cuenta cuántos hay: el promedio es la división entre ambos."
      }
    ]
  }
];

const allProjects = () => COURSE_LEVELS.flatMap((level) => level.projects);
const hasValue = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const heroCode = document.querySelector("#hero-code");
const heroRun = document.querySelector("#hero-run");
const heroOutput = document.querySelector("#hero-output");
const levelTabs = document.querySelector("#level-tabs");
const projectList = document.querySelector("#project-list");
const projectCode = document.querySelector("#course-project-code");
const projectOutput = document.querySelector("#course-project-output");
const validationList = document.querySelector("#project-validations");
const successPanel = document.querySelector("#course-project-success");
const completeButton = document.querySelector("#complete-course-project");
const previousButton = document.querySelector("#course-previous");
const nextButton = document.querySelector("#course-next");
const positionText = document.querySelector("#course-project-position");
const hintsList = document.querySelector("#project-hints");
const hintButton = document.querySelector("#show-hint");
const routeProgressText = document.querySelector("#route-progress-text");
const routeProgressFill = document.querySelector("#route-progress-fill");
const courseFinish = document.querySelector("#course-finish");
const checkpointPanel = document.querySelector("#level-checkpoint");
const checkpointKicker = document.querySelector("#checkpoint-kicker");
const checkpointTitle = document.querySelector("#checkpoint-title");
const checkpointCopy = document.querySelector("#checkpoint-copy");
const checkpointExam = document.querySelector("#checkpoint-exam");
const checkpointNext = document.querySelector("#checkpoint-next");
const examPanel = document.querySelector("#level-exam");
const examKicker = document.querySelector("#exam-kicker");
const examTitle = document.querySelector("#exam-title");
const examIntro = document.querySelector("#exam-intro");
const examQuestions = document.querySelector("#exam-questions");
const examSubmit = document.querySelector("#exam-submit");
const examRetry = document.querySelector("#exam-retry");
const examClose = document.querySelector("#exam-close");
const examResult = document.querySelector("#exam-result");

let activeLevelId = 1;
let activeProjectId = 1;
let completedProjects = loadProgress();
const validRuns = new Map();
const revealedHints = new Map();
const drafts = new Map();
let approvedExams = loadApprovedExams();
let examLevelId = 1;
let examAnswers = new Map();
let examReviewed = false;

function parseString(expression) {
  const match = expression.match(/^(["'])([\s\S]*)\1$/);
  if (!match) return null;
  return match[2]
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function evaluateExpression(expression, environment) {
  const value = expression.trim();
  const formatted = value.match(/^f(["'])([\s\S]*)\1$/);

  if (formatted) {
    return formatted[2].replace(/\{([A-Za-z_]\w*)\}/g, (_, name) => {
      if (!hasValue(environment, name)) throw new Error("La variable “" + name + "” todavía no existe.");
      return String(environment[name]);
    });
  }

  const text = parseString(value);
  if (text !== null) return text;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (/^[A-Za-z_]\w*$/.test(value)) {
    if (!hasValue(environment, value)) throw new Error("La variable “" + value + "” todavía no existe.");
    return environment[value];
  }

  const operation = value.match(/^([A-Za-z_]\w*|-?\d+(?:\.\d+)?)\s*(\/\/|\/|%|\+|-|\*)\s*([A-Za-z_]\w*|-?\d+(?:\.\d+)?)$/);
  if (operation) {
    const left = evaluateExpression(operation[1], environment);
    const right = evaluateExpression(operation[3], environment);
    if (["//", "/", "%"].includes(operation[2]) && Number(right) === 0) throw new Error("No es posible dividir por cero.");
    if (operation[2] === "//") return Math.floor(Number(left) / Number(right));
    if (operation[2] === "/") return Number(left) / Number(right);
    if (operation[2] === "%") return Number(left) % Number(right);
    if (operation[2] === "+") return left + right;
    if (operation[2] === "-") return Number(left) - Number(right);
    if (operation[2] === "*") return Number(left) * Number(right);
  }

  throw new Error("No reconozco la expresión “" + value + "” en este laboratorio.");
}

function runPython(source) {
  const environment = {};
  const output = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;
    try {
      const assignment = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (assignment) {
        environment[assignment[1]] = evaluateExpression(assignment[2], environment);
        return;
      }
      const printCall = line.match(/^print\((.*)\)$/);
      if (printCall) {
        output.push(String(evaluateExpression(printCall[1], environment)));
        return;
      }
      throw new Error("Usa una asignación o print() como en el ejemplo.");
    } catch (error) {
      throw new Error("Línea " + (index + 1) + ": " + error.message);
    }
  });

  if (output.length === 0) throw new Error("El programa no mostró ningún resultado. Agrega print().");
  return { environment, output };
}

function readNumberVariable(source, name) {
  const pattern = new RegExp("^\\s*" + name + "\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*$", "m");
  const match = source.match(pattern);
  if (!match) throw new Error("Define “" + name + "” con un valor numérico.");
  return Number(match[1]);
}

function readStringVariable(source, name) {
  const pattern = new RegExp("^\\s*" + name + "\\s*=\\s*[\"']([^\"']+)[\"']\\s*$", "m");
  const match = source.match(pattern);
  if (!match) throw new Error("Define “" + name + "” con un texto entre comillas.");
  return match[1];
}

function readStringList(source, name) {
  const pattern = new RegExp("^\\s*" + name + "\\s*=\\s*\\[([^\\]]*)\\]\\s*$", "m");
  const match = source.match(pattern);
  if (!match) throw new Error("Crea la lista “" + name + "” utilizando corchetes.");
  const values = [];
  const valuePattern = /["']([^"']+)["']/g;
  let valueMatch = valuePattern.exec(match[1]);
  while (valueMatch) {
    values.push(valueMatch[1]);
    valueMatch = valuePattern.exec(match[1]);
  }
  if (values.length === 0) throw new Error("Agrega textos entre comillas dentro de “" + name + "”.");
  return values;
}

function readNumberList(source, name) {
  const pattern = new RegExp("^\\s*" + name + "\\s*=\\s*\\[([^\\]]*)\\]\\s*$", "m");
  const match = source.match(pattern);
  if (!match) throw new Error("Crea la lista “" + name + "” utilizando corchetes.");
  const values = match[1].split(",").map((value) => Number(value.trim()));
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error("La lista “" + name + "” debe contener únicamente números separados por comas.");
  }
  return values;
}

function runAgeDecision(source) {
  const edad = readNumberVariable(source, "edad");
  return { environment: { edad }, output: [edad >= 18 ? "Mayor de edad" : "Menor de edad"] };
}

function runTemperatureClassifier(source) {
  const temperatura = readNumberVariable(source, "temperatura");
  const label = temperatura < 10 ? "Hace frío" : temperatura < 25 ? "Clima agradable" : "Hace calor";
  return { environment: { temperatura }, output: [label] };
}

function runRangeLoop(source) {
  const loop = source.match(/for\s+([A-Za-z_]\w*)\s+in\s+range\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*:/);
  if (!loop) throw new Error("Escribe un ciclo con for y range(inicio, límite).");
  const start = Number(loop[2]);
  const end = Number(loop[3]);
  if (end <= start || end - start > 30) throw new Error("Utiliza un rango ascendente de hasta 30 valores.");
  const values = Array.from({ length: end - start }, (_, index) => start + index);
  return { environment: { values }, output: values.map(String) };
}

function runListLoop(source) {
  const tareas = readStringList(source, "tareas");
  return { environment: { tareas }, output: [...tareas] };
}

function runGreetingFunction(source) {
  const call = source.match(/print\s*\(\s*saludar\s*\(\s*["']([^"']+)["']\s*\)\s*\)/);
  if (!call) throw new Error("Llama saludar() dentro de print() usando un nombre entre comillas.");
  const nombre = call[1];
  return { environment: { nombre }, output: ["Hola, " + nombre] };
}

function runDiscountFunction(source) {
  const call = source.match(/precio_final\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/g);
  if (!call) throw new Error("Llama precio_final() con un precio y un descuento.");
  const lastCall = call[call.length - 1];
  const values = lastCall.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const precio = values[0];
  const descuento = values[1];
  const expected = precio - precio * descuento / 100;
  return { environment: { precio, descuento, expected }, output: [String(expected)] };
}

function runAverageProject(source) {
  const notas = readNumberList(source, "notas");
  const promedio = notas.reduce((total, value) => total + value, 0) / notas.length;
  return { environment: { notas, promedio }, output: ["Promedio: " + promedio] };
}

function runStudyRecommender(source) {
  const horas = readNumberVariable(source, "horas");
  const tema = readStringVariable(source, "tema");
  const message = horas >= 2
    ? "Practica " + tema + " con un proyecto"
    : "Repasa " + tema + " durante 20 minutos";
  return { environment: { horas, tema }, output: [message] };
}

const EXAM_LETTERS = ["A", "B", "C", "D"];

function loadApprovedExams() {
  try {
    const saved = JSON.parse(localStorage.getItem(EXAMS_KEY) || "[]");
    return new Set(saved.filter((levelId) => Number.isInteger(levelId) && levelId >= 1 && levelId <= COURSE_LEVELS.length));
  } catch {
    return new Set();
  }
}

function saveApprovedExams() {
  try {
    localStorage.setItem(EXAMS_KEY, JSON.stringify([...approvedExams]));
  } catch {
    // El avance sigue funcionando aunque el navegador bloquee el almacenamiento.
  }
}

function levelOfProject(projectId) {
  return COURSE_LEVELS.find((level) => level.projects.some((project) => project.id === Number(projectId)));
}

function levelProjectsDone(level) {
  return Boolean(level) && level.projects.length > 0 && level.projects.every((project) => completedProjects.has(project.id));
}

function isLevelUnlocked(levelId) {
  const index = COURSE_LEVELS.findIndex((level) => level.id === Number(levelId));
  if (index < 0) return false;
  if (index === 0) return true;
  return levelProjectsDone(COURSE_LEVELS[index - 1]);
}

function isExamUnlocked(levelId) {
  return levelProjectsDone(COURSE_LEVELS.find((level) => level.id === Number(levelId)));
}

function getExam(levelId) {
  return LEVEL_EXAMS.find((exam) => exam.levelId === Number(levelId));
}

function gradeExam(levelId, answers) {
  const exam = getExam(levelId);
  if (!exam) return null;
  const read = (index) => {
    if (!answers) return undefined;
    if (typeof answers.get === "function") return answers.get(index);
    return answers[index];
  };
  const details = exam.questions.map((question, index) => {
    const chosen = read(index);
    return {
      index,
      chosen: chosen === undefined ? null : chosen,
      answer: question.answer,
      isCorrect: chosen === question.answer
    };
  });
  const correct = details.filter((detail) => detail.isCorrect).length;
  return { total: exam.questions.length, correct, passing: exam.passing, passed: correct >= exam.passing, details };
}

function levelStatusLabel(level) {
  if (level.locked) return "Preparando";
  if (!isLevelUnlocked(level.id)) return "Bloqueado";
  if (approvedExams.has(level.id)) return "Examen aprobado ✓";
  if (levelProjectsDone(level)) return "Examen disponible";
  const done = level.projects.filter((project) => completedProjects.has(project.id)).length;
  return done + " de " + level.projects.length + " proyectos";
}

function renderRouteStrip() {
  document.querySelectorAll("[data-level-target]").forEach((button) => {
    const level = COURSE_LEVELS.find((item) => item.id === Number(button.dataset.levelTarget));
    if (!level) return;
    button.disabled = Boolean(level.locked) || !isLevelUnlocked(level.id);
    const caption = button.querySelector("small");
    if (caption) caption.textContent = levelStatusLabel(level);
  });
}

function renderCheckpoint() {
  const level = getActiveLevel();
  if (!checkpointPanel || !level) return;
  const done = levelProjectsDone(level);
  checkpointPanel.hidden = !done;
  if (!done) return;
  const approved = approvedExams.has(level.id);
  const next = COURSE_LEVELS.find((item) => item.id === level.id + 1);
  checkpointKicker.textContent = "Punto de control · " + level.stage;
  checkpointTitle.textContent = level.completionTitle;
  checkpointCopy.textContent = approved ? level.approvedCopy : level.completionCopy;
  checkpointExam.textContent = approved
    ? "Repetir el mini examen"
    : "Rendir el mini examen de " + level.stage.toLowerCase();
  checkpointNext.hidden = !next;
  if (next) checkpointNext.textContent = "Continuar con " + next.stage.toLowerCase();
}

function renderExam() {
  const exam = getExam(examLevelId);
  const level = COURSE_LEVELS.find((item) => item.id === examLevelId);
  if (!exam || !level || !examQuestions) return;
  examKicker.textContent = "Mini examen · " + level.stage;
  examTitle.textContent = exam.title;
  examIntro.textContent = exam.intro;
  examQuestions.replaceChildren();

  exam.questions.forEach((question, index) => {
    const chosen = examAnswers.has(index) ? examAnswers.get(index) : null;
    const item = document.createElement("li");
    item.className = "exam-question"
      + (examReviewed ? (chosen === question.answer ? " is-correct" : " is-wrong") : "");

    const statement = document.createElement("p");
    statement.className = "exam-statement";
    statement.textContent = question.question;
    item.append(statement);

    const options = document.createElement("div");
    options.className = "exam-options";
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "exam-option"
        + (chosen === optionIndex ? " is-selected" : "")
        + (examReviewed && optionIndex === question.answer ? " is-answer" : "");
      button.dataset.question = String(index);
      button.dataset.option = String(optionIndex);
      button.setAttribute("aria-pressed", String(chosen === optionIndex));
      button.disabled = examReviewed;
      const letter = document.createElement("span");
      letter.textContent = EXAM_LETTERS[optionIndex] || "•";
      const text = document.createElement("small");
      text.textContent = option;
      button.append(letter);
      button.append(text);
      options.append(button);
    });
    item.append(options);

    if (examReviewed) {
      const feedback = document.createElement("p");
      feedback.className = "exam-feedback";
      feedback.textContent = question.explanation;
      item.append(feedback);
    }

    examQuestions.append(item);
  });

  examSubmit.hidden = examReviewed;
  examRetry.hidden = !examReviewed;
}

function openExam(levelId) {
  if (!isExamUnlocked(levelId)) return;
  examLevelId = Number(levelId);
  examAnswers = new Map();
  examReviewed = false;
  examResult.textContent = "";
  examResult.className = "exam-result";
  examPanel.hidden = false;
  renderExam();
  if (typeof examPanel.scrollIntoView === "function") examPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeExam() {
  if (examPanel) examPanel.hidden = true;
}

function submitExam() {
  const exam = getExam(examLevelId);
  if (!exam) return;
  if (examAnswers.size < exam.questions.length) {
    examResult.textContent = "Responde las " + exam.questions.length + " preguntas antes de revisar.";
    examResult.className = "exam-result is-pending";
    return;
  }
  const result = gradeExam(examLevelId, examAnswers);
  examReviewed = true;
  renderExam();
  const next = COURSE_LEVELS.find((item) => item.id === examLevelId + 1);
  if (result.passed) {
    approvedExams.add(examLevelId);
    saveApprovedExams();
    examResult.textContent = "Aprobado con " + result.correct + " de " + result.total + " respuestas correctas. "
      + (next ? "Ya puedes continuar con " + next.stage.toLowerCase() + "." : "Con esto cierras la ruta de Python.");
    examResult.className = "exam-result is-passed";
  } else {
    examResult.textContent = "Obtuviste " + result.correct + " de " + result.total + " y necesitas " + result.passing
      + " para aprobar. Revisa las explicaciones y vuelve a intentarlo.";
    examResult.className = "exam-result is-failed";
  }
  renderLevelTabs();
  renderProgress();
  renderCheckpoint();
}

function retryExam() {
  examAnswers = new Map();
  examReviewed = false;
  examResult.textContent = "";
  examResult.className = "exam-result";
  renderExam();
}

function getActiveLevel() {
  return COURSE_LEVELS.find((level) => level.id === activeLevelId);
}

function getActiveProject() {
  return allProjects().find((project) => project.id === activeProjectId);
}

function saveCurrentDraft() {
  if (projectCode && getActiveProject()) drafts.set(activeProjectId, projectCode.value);
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    return new Set(saved.filter((project) => Number.isInteger(project) && project >= 1 && project <= 12));
  } catch {
    return new Set();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedProjects]));
  } catch {
    // La ruta sigue funcionando aunque el navegador bloquee el almacenamiento.
  }
}

function renderLevelTabs() {
  levelTabs.innerHTML = "";
  COURSE_LEVELS.forEach((level) => {
    const button = document.createElement("button");
    const isActive = level.id === activeLevelId;
    button.type = "button";
    button.role = "tab";
    button.id = "level-tab-" + level.id;
    button.className = "level-tab";
    button.dataset.level = String(level.id);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("aria-controls", "course-project");
    button.tabIndex = isActive ? 0 : -1;
    button.disabled = Boolean(level.locked) || !isLevelUnlocked(level.id);
    button.innerHTML = '<span>0' + level.id + '</span><strong>' + level.title + '</strong><small>'
      + levelStatusLabel(level) + "</small>";
    levelTabs.append(button);
  });
  renderRouteStrip();
}

function renderProjectList() {
  const level = getActiveLevel();
  projectList.innerHTML = "";
  level.projects.forEach((project) => {
    const button = document.createElement("button");
    const isComplete = completedProjects.has(project.id);
    button.type = "button";
    button.className = "project-index-button";
    button.dataset.project = String(project.id);
    button.setAttribute("aria-current", project.id === activeProjectId ? "step" : "false");
    button.innerHTML = '<span>' + String(project.id).padStart(2, "0") + '</span><div><strong>'
      + project.shortTitle + '</strong><small>' + project.duration + '</small></div><i>'
      + (isComplete ? "✓" : "→") + "</i>";
    projectList.append(button);
  });
}

function renderHints() {
  const project = getActiveProject();
  const visibleCount = revealedHints.get(project.id) || 0;
  hintsList.innerHTML = "";
  project.hints.slice(0, visibleCount).forEach((hint) => {
    const item = document.createElement("li");
    item.textContent = hint;
    hintsList.append(item);
  });
  hintButton.disabled = visibleCount >= project.hints.length;
  hintButton.textContent = visibleCount >= project.hints.length ? "Todas las pistas visibles" : "Ver pista " + (visibleCount + 1);
}

function renderValidations(results = null) {
  const project = getActiveProject();
  validationList.innerHTML = "";
  project.checks.forEach((label, index) => {
    const item = document.createElement("li");
    const state = results === null ? "pending" : results[index] ? "passed" : "failed";
    item.className = "validation-" + state;
    item.innerHTML = '<span aria-hidden="true">' + (state === "passed" ? "✓" : state === "failed" ? "×" : "·")
      + "</span><span>" + label + "</span>";
    validationList.append(item);
  });
}

function renderProgress() {
  const completed = completedProjects.size;
  routeProgressText.textContent = completed + " de 12";
  routeProgressFill.style.width = (completed / 12 * 100) + "%";
  const approvedAll = COURSE_LEVELS.every((level) => approvedExams.has(level.id));
  courseFinish.hidden = !(completed === 12 && approvedAll);
}

function renderProject() {
  const project = getActiveProject();
  const level = getActiveLevel();
  document.querySelector("#course-project-kicker").textContent = "Nivel 0" + level.id + " · Proyecto "
    + String(project.id).padStart(2, "0") + " · " + project.duration;
  document.querySelector("#course-project-title").textContent = project.title;
  document.querySelector("#course-project-summary").textContent = project.summary;
  document.querySelector("#course-project-example").textContent = project.example;
  document.querySelector("#course-project-explanation").textContent = project.explanation;
  document.querySelector("#course-project-concepts").innerHTML = project.concepts.map((concept) => "<li>" + concept + "</li>").join("");
  document.querySelector("#course-project-goal").textContent = project.goal;
  document.querySelector("#course-lab-title").textContent = project.shortTitle;
  document.querySelector("#course-project-difficulty").textContent = project.difficulty;
  document.querySelector("#course-project-file").textContent = project.file;
  document.querySelector("#course-project-success-copy").textContent = project.success;
  document.querySelector("#course-project").setAttribute("aria-labelledby", "level-tab-" + level.id + " course-project-title");

  projectCode.value = drafts.has(project.id) ? drafts.get(project.id) : project.starter;
  const lineCount = Math.max(7, projectCode.value.split(/\r?\n/).length);
  document.querySelector("#course-code-lines").innerHTML = Array.from({ length: lineCount }, (_, index) => index + 1).join("<br>");
  projectOutput.textContent = "Tu resultado aparecerá aquí.";
  projectOutput.classList.remove("is-error");
  successPanel.hidden = true;
  renderHints();
  renderValidations();

  const isComplete = completedProjects.has(project.id);
  completeButton.disabled = true;
  completeButton.classList.toggle("is-complete", isComplete);
  completeButton.textContent = isComplete ? "Proyecto completado ✓" : "Completar proyecto";

  const available = allProjects();
  const projectIndex = available.findIndex((item) => item.id === project.id);
  const nextProject = available[projectIndex + 1];
  previousButton.disabled = projectIndex <= 0;
  nextButton.disabled = !nextProject || !isLevelUnlocked(levelOfProject(nextProject.id).id);
  positionText.textContent = "Proyecto " + project.id + " de 12";
  renderProjectList();
  renderCheckpoint();
}

function activateLevel(levelId, scroll = false) {
  const level = COURSE_LEVELS.find((item) => item.id === Number(levelId));
  if (!level || level.locked || !isLevelUnlocked(level.id) || level.projects.length === 0) return;
  saveCurrentDraft();
  activeLevelId = level.id;
  activeProjectId = level.projects[0].id;
  renderLevelTabs();
  renderProject();
  if (scroll) document.querySelector("#proyectos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function activateProject(projectId, scroll = false) {
  const project = allProjects().find((item) => item.id === Number(projectId));
  if (!project) return;
  const owner = levelOfProject(project.id);
  if (!owner || !isLevelUnlocked(owner.id)) return;
  saveCurrentDraft();
  activeProjectId = project.id;
  activeLevelId = COURSE_LEVELS.find((level) => level.projects.some((item) => item.id === project.id)).id;
  renderLevelTabs();
  renderProject();
  if (scroll) document.querySelector("#proyectos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function runHeroExample() {
  try {
    const result = runPython(heroCode.value);
    heroOutput.innerHTML = '<span aria-hidden="true">›</span> ' + result.output.join("\n");
    heroOutput.classList.remove("is-error");
  } catch (error) {
    heroOutput.textContent = error.message;
    heroOutput.classList.add("is-error");
  }
}

function runActiveProject() {
  const project = getActiveProject();
  drafts.set(project.id, projectCode.value);
  try {
    const result = project.execute ? project.execute(projectCode.value) : runPython(projectCode.value);
    projectOutput.textContent = result.output.join("\n");
    projectOutput.classList.remove("is-error");
    const validationResults = project.validate(result, projectCode.value);
    const isValid = validationResults.every(Boolean);
    validRuns.set(project.id, isValid);
    renderValidations(validationResults);
    successPanel.hidden = !isValid;
    if (!completedProjects.has(project.id)) completeButton.disabled = !isValid;
    if (!isValid) {
      projectOutput.textContent += "\n\nEl programa se ejecutó, pero todavía falta cumplir toda la misión.";
    }
  } catch (error) {
    validRuns.set(project.id, false);
    projectOutput.textContent = error.message;
    projectOutput.classList.add("is-error");
    successPanel.hidden = true;
    completeButton.disabled = true;
    renderValidations(project.checks.map(() => false));
  }
}

function resetActiveProject() {
  const project = getActiveProject();
  drafts.delete(project.id);
  validRuns.set(project.id, false);
  renderProject();
  projectCode.focus();
}

levelTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-level]");
  if (button) activateLevel(button.dataset.level);
});

levelTabs.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const tabs = [...levelTabs.querySelectorAll(".level-tab:not(:disabled)")];
  const currentIndex = tabs.indexOf(event.target.closest(".level-tab"));
  if (currentIndex < 0) return;
  event.preventDefault();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const target = tabs[(currentIndex + direction + tabs.length) % tabs.length];
  const targetLevel = target.dataset.level;
  activateLevel(targetLevel);
  levelTabs.querySelector('[data-level="' + targetLevel + '"]').focus();
});

projectList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project]");
  if (button) activateProject(button.dataset.project);
});

document.querySelectorAll("[data-level-target]").forEach((button) => {
  button.addEventListener("click", () => activateLevel(button.dataset.levelTarget, true));
});

heroRun.addEventListener("click", runHeroExample);
heroCode.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runHeroExample();
});

document.querySelector("#run-course-project").addEventListener("click", runActiveProject);
document.querySelector("#reset-course-project").addEventListener("click", resetActiveProject);
projectCode.addEventListener("input", () => {
  document.querySelector("#course-code-lines").innerHTML = Array.from(
    { length: Math.max(7, projectCode.value.split(/\r?\n/).length) },
    (_, index) => index + 1,
  ).join("<br>");
});
projectCode.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runActiveProject();
});

hintButton.addEventListener("click", () => {
  const project = getActiveProject();
  const current = revealedHints.get(project.id) || 0;
  revealedHints.set(project.id, Math.min(project.hints.length, current + 1));
  renderHints();
});

completeButton.addEventListener("click", () => {
  const project = getActiveProject();
  if (!validRuns.get(project.id)) return;
  completedProjects.add(project.id);
  saveProgress();
  renderProgress();
  renderLevelTabs();
  renderProject();
});

previousButton.addEventListener("click", () => {
  const projects = allProjects();
  const index = projects.findIndex((project) => project.id === activeProjectId);
  if (index > 0) activateProject(projects[index - 1].id);
});

nextButton.addEventListener("click", () => {
  const projects = allProjects();
  const index = projects.findIndex((project) => project.id === activeProjectId);
  if (index < projects.length - 1) activateProject(projects[index + 1].id);
});

if (checkpointExam) {
  checkpointExam.addEventListener("click", () => openExam(getActiveLevel().id));
}

if (checkpointNext) {
  checkpointNext.addEventListener("click", () => {
    const next = COURSE_LEVELS.find((item) => item.id === getActiveLevel().id + 1);
    if (!next) return;
    closeExam();
    activateLevel(next.id, true);
  });
}

if (examQuestions) {
  examQuestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option]");
    if (!button || examReviewed) return;
    examAnswers.set(Number(button.dataset.question), Number(button.dataset.option));
    renderExam();
  });
}

if (examSubmit) examSubmit.addEventListener("click", submitExam);
if (examRetry) examRetry.addEventListener("click", retryExam);
if (examClose) examClose.addEventListener("click", closeExam);

renderLevelTabs();
renderProgress();
renderProject();
