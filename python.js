const PROGRESS_KEY = "codigo-cero.python-v2.completed";

const EXAMS_KEY = "codigo-cero.python-v2.exams";

const clean = (source) => String(source).replace(/#.*$/gm, "");
const uses = (source, pattern) => pattern.test(clean(source));
const shows = (result, text) => result.output.some((line) => line.includes(String(text)));
const near = (value, expected) => typeof value === "number" && Math.abs(value - expected) < 0.001;
const isList = (value) => Array.isArray(value);
const sameList = (value, expected) => isList(value) && value.length === expected.length
  && value.every((item, index) => item === expected[index]);

const COURSE_LEVELS = [
  {
    id: 1,
    title: "Fundamentos",
    description: "Mensajes, variables y operaciones",
    stage: "Conceptos básicos",
    completionTitle: "Finalizaste los conceptos básicos de Python.",
    completionCopy: "Ya sabes mostrar información, guardar datos y calcular con ellos. Rinde el mini examen del nivel; las decisiones y ciclos quedaron disponibles.",
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
        goal: "Escribe un mensaje propio, ejecútalo y comprueba que aparezca en la consola.",
        starter: 'print("Estoy aprendiendo Python")',
        hints: [
          "Conserva la palabra print y los paréntesis.",
          "El mensaje debe quedar entre comillas dobles o simples.",
          'Una solución válida se parece a print("Mi primer programa").'
        ],
        checks: ["Usas print()", "El programa muestra un mensaje", "El mensaje contiene texto"],
        success: "Ya sabes ejecutar una instrucción y leer su resultado.",
        validate(result, source) {
          return [
            uses(source, /print\s*\(/),
            result.output.length > 0,
            result.output.some((line) => line.trim().length >= 3)
          ];
        }
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
        goal: "Cambia el nombre y la edad por los tuyos, y muestra ambos valores dentro de una sola frase.",
        starter: 'nombre = "Ada"\nedad = 28\nprint(f"Soy {nombre} y tengo {edad} años")',
        hints: [
          "Guarda el nombre entre comillas y la edad como un número.",
          "Dentro de una f-string puedes escribir {nombre} y {edad}.",
          'Comprueba que la última línea comience con print(f".'
        ],
        checks: ["Creas nombre y edad", "Usas una f-string", "La salida muestra ambos datos"],
        success: "Combinaste variables de distintos tipos dentro de una frase.",
        validate(result, source) {
          const nombre = result.environment.nombre;
          const edad = result.environment.edad;
          const tieneDatos = typeof nombre === "string" && typeof edad === "number";
          return [
            tieneDatos,
            uses(source, /print\s*\(\s*f["']/),
            tieneDatos && result.output.some((line) => line.includes(nombre) && line.includes(String(edad)))
          ];
        }
      },
      {
        id: 3,
        title: "Calcula una propina",
        shortTitle: "Calculadora",
        duration: "15 min",
        difficulty: "Operaciones",
        file: "proyecto_03.py",
        summary: "Python combina variables y operadores para transformar datos y producir un resultado nuevo.",
        example: "propina = cuenta * porcentaje / 100",
        explanation: "Las operaciones se evalúan antes de guardar el resultado. Separarlas en pasos hace que el cálculo sea fácil de leer y comprobar.",
        concepts: ["Multiplicar y dividir", "Reutilizar resultados", "Construir un cálculo por pasos"],
        goal: "Calcula la propina y el total de la cuenta usando el porcentaje indicado, y muestra ambos valores.",
        starter: 'cuenta = 20000\nporcentaje = 10\npropina = cuenta * porcentaje\ntotal = cuenta\nprint(f"Propina: {propina}")\nprint(f"Total: {total}")',
        hints: [
          "La propina es cuenta * porcentaje / 100.",
          "El total suma la cuenta y la propina.",
          "Con cuenta 20000 y 10 %, la propina es 2000.0 y el total 22000.0."
        ],
        checks: ["Calculas la propina", "Calculas el total", "Muestras ambos resultados"],
        success: "Convertiste una fórmula cotidiana en instrucciones de Python.",
        validate(result) {
          const { cuenta, porcentaje, propina, total } = result.environment;
          const esperada = Number(cuenta) * Number(porcentaje) / 100;
          return [
            near(propina, esperada),
            near(total, Number(cuenta) + esperada),
            near(propina, esperada) && shows(result, propina) && shows(result, total)
          ];
        }
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
        goal: "Calcula cuántas horas completas y cuántos minutos sobran, y muéstralo en una sola línea.",
        starter: 'minutos = 135\nhoras = minutos\nresto = minutos\nprint(f"{horas} h y {resto} min")',
        hints: [
          "Usa minutos // 60 para las horas completas.",
          "Usa minutos % 60 para lo que sobra.",
          "Con 135 minutos el resultado es 2 h y 15 min."
        ],
        checks: ["Calculas horas completas", "Calculas los minutos restantes", "Muestras la conversión"],
        success: "Usaste dos operadores para resolver un problema de tiempo.",
        validate(result, source) {
          const { minutos, horas, resto } = result.environment;
          const validos = typeof minutos === "number";
          return [
            validos && horas === Math.floor(minutos / 60) && uses(source, /\/\//),
            validos && resto === minutos % 60 && uses(source, /%/),
            validos && result.output.some((line) => line.includes(String(horas)) && line.includes(String(resto)))
          ];
        }
      }
    ]
  },
  {
    id: 2,
    title: "Decisiones y ciclos",
    description: "Condiciones, repeticiones y listas",
    stage: "Decisiones y ciclos",
    completionTitle: "Finalizaste las decisiones y ciclos de Python.",
    completionCopy: "Tus programas ya eligen caminos y repiten trabajo. Rinde el mini examen del nivel; las colecciones de datos quedaron disponibles.",
    approvedCopy: "Aprobaste el mini examen de decisiones y ciclos. Puedes repetirlo cuando quieras para repasar.",
    projects: [
      {
        id: 5,
        title: "Decide según una edad",
        shortTitle: "Mayoría de edad",
        duration: "12 min",
        difficulty: "Decisiones",
        file: "proyecto_05.py",
        summary: "Una condición compara valores y ejecuta un camino distinto según el resultado.",
        example: "if edad >= 18:",
        explanation: "if evalúa una comparación. Si resulta falsa, el bloque else entrega la respuesta alternativa.",
        concepts: ["Comparar con >=", "Bloques con sangría", "El camino alternativo con else"],
        goal: "Deja la edad en 20 y muestra un mensaje que incluya la edad y la palabra “mayor”.",
        starter: 'edad = 16\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")',
        hints: [
          "Cambia el valor guardado en edad.",
          "Dentro del if puedes usar una f-string: print(f\"Tienes {edad} años: mayor de edad\").",
          "La sangría de cuatro espacios indica qué instrucciones pertenecen a cada camino."
        ],
        checks: ["Usas if y else", "La edad es 20", "El mensaje incluye la edad y la palabra mayor"],
        success: "Tu programa ya elige entre dos caminos.",
        validate(result, source) {
          return [
            uses(source, /\bif\b/) && uses(source, /\belse\b/),
            result.environment.edad === 20,
            result.output.some((line) => line.includes("20") && /mayor/i.test(line))
          ];
        }
      },
      {
        id: 6,
        title: "Clasifica la temperatura",
        shortTitle: "Clasificador",
        duration: "15 min",
        difficulty: "Decisiones",
        file: "proyecto_06.py",
        summary: "Cuando hay más de dos respuestas posibles, elif encadena condiciones en orden.",
        example: "elif temperatura < 25:",
        explanation: "Python revisa las condiciones de arriba hacia abajo y ejecuta solamente la primera que se cumple.",
        concepts: ["Encadenar con elif", "El orden de las condiciones", "Cerrar con else"],
        goal: "Completa las tres respuestas (frío, agradable y calor) y deja la temperatura en 30.",
        starter: 'temperatura = 5\nif temperatura < 10:\n    print("Hace frío")\nelse:\n    print("Hace calor")',
        hints: [
          "Agrega un elif temperatura < 25 entre el if y el else.",
          "El mensaje intermedio es “Clima agradable”.",
          "Con temperatura 30 debe aparecer “Hace calor”."
        ],
        checks: ["Usas elif", "La temperatura es 30", "La salida es “Hace calor”"],
        success: "Ya sabes encadenar decisiones en el orden correcto.",
        validate(result, source) {
          return [
            uses(source, /\belif\b/) && uses(source, /Clima agradable/),
            result.environment.temperatura === 30,
            result.output.length === 1 && result.output[0].includes("Hace calor")
          ];
        }
      },
      {
        id: 7,
        title: "Construye un contador",
        shortTitle: "Contador",
        duration: "15 min",
        difficulty: "Ciclos",
        file: "proyecto_07.py",
        summary: "Un ciclo repite instrucciones sin escribirlas una y otra vez.",
        example: "for numero in range(1, 6):",
        explanation: "range(inicio, fin) recorre desde el inicio hasta el número anterior al fin. La variable del ciclo cambia en cada vuelta.",
        concepts: ["Repetir con for", "Rangos con range()", "Usar la variable del ciclo"],
        goal: "Muestra cinco líneas, de “Vuelta 1” a “Vuelta 5”.",
        starter: 'for numero in range(1, 3):\n    print(numero)',
        hints: [
          "range(1, 6) recorre 1, 2, 3, 4 y 5.",
          "Dentro del ciclo usa una f-string con la variable.",
          'La primera línea debe decir exactamente "Vuelta 1".'
        ],
        checks: ["Usas for con range()", "Muestras cinco líneas", "Las líneas van de Vuelta 1 a Vuelta 5"],
        success: "Automatizaste una repetición con una sola instrucción.",
        validate(result, source) {
          return [
            uses(source, /\bfor\b/) && uses(source, /range\s*\(/),
            result.output.length === 5,
            result.output.length === 5
              && result.output[0].includes("Vuelta 1")
              && result.output[4].includes("Vuelta 5")
          ];
        }
      },
      {
        id: 8,
        title: "Recorre una lista de tareas",
        shortTitle: "Lista de tareas",
        duration: "15 min",
        difficulty: "Ciclos",
        file: "proyecto_08.py",
        summary: "Una lista guarda varios valores en orden y un ciclo puede recorrerlos uno por uno.",
        example: "for tarea in tareas:",
        explanation: "Los corchetes crean la lista y for entrega cada elemento por turno. len() indica cuántos elementos contiene.",
        concepts: ["Crear listas con corchetes", "Recorrer con for", "Contar con len()"],
        goal: "Escribe al menos tres tareas, muestra cada una precedida por un guion y termina indicando cuántas hay.",
        starter: 'tareas = ["Leer la lección"]\nfor tarea in tareas:\n    print(tarea)',
        hints: [
          "Separa los elementos de la lista con comas.",
          'Dentro del ciclo puedes escribir print("-", tarea).',
          'Al final agrega print(f"Total: {len(tareas)} tareas").'
        ],
        checks: ["La lista tiene al menos tres tareas", "Muestras cada tarea con un guion", "Indicas cuántas tareas hay"],
        success: "Recorriste una colección completa con un solo ciclo.",
        validate(result, source) {
          const tareas = result.environment.tareas;
          const conGuion = result.output.filter((line) => line.trim().startsWith("-"));
          return [
            isList(tareas) && tareas.length >= 3,
            isList(tareas) && conGuion.length >= tareas.length,
            isList(tareas) && uses(source, /len\s*\(/) && shows(result, tareas.length)
          ];
        }
      }
    ]
  },
  {
    id: 3,
    title: "Colecciones de datos",
    description: "Listas, orden, diccionarios e inventarios",
    stage: "Colecciones de datos",
    completionTitle: "Finalizaste las colecciones de datos de Python.",
    completionCopy: "Ya guardas y consultas conjuntos de información. Rinde el mini examen del nivel; las funciones propias quedaron disponibles.",
    approvedCopy: "Aprobaste el mini examen de colecciones de datos. Puedes repetirlo cuando quieras para repasar.",
    projects: [
      {
        id: 9,
        title: "Administra una lista de compras",
        shortTitle: "Lista de compras",
        duration: "15 min",
        difficulty: "Listas",
        file: "proyecto_09.py",
        summary: "Las listas cambian con el tiempo: se les agregan y se les quitan elementos.",
        example: 'compras.append("huevos")',
        explanation: "append() agrega al final, remove() elimina la primera coincidencia y los corchetes leen una posición, empezando en cero.",
        concepts: ["Agregar con append()", "Quitar con remove()", "Leer posiciones desde cero"],
        goal: "Agrega “huevos”, quita “leche”, muestra la lista final y cuántos productos quedan.",
        starter: 'compras = ["pan", "leche"]\nprint(compras)',
        hints: [
          'Usa compras.append("huevos") para agregar al final.',
          'Usa compras.remove("leche") para quitar ese producto.',
          "Al final la lista debe ser ['pan', 'huevos'] y quedar 2 productos."
        ],
        checks: ["Agregas huevos con append()", "Quitas leche con remove()", "Muestras la lista final y su tamaño"],
        success: "Modificaste una colección y comprobaste el resultado.",
        validate(result, source) {
          const compras = result.environment.compras;
          return [
            uses(source, /\.append\s*\(/) && isList(compras) && compras.includes("huevos"),
            uses(source, /\.remove\s*\(/) && isList(compras) && !compras.includes("leche"),
            sameList(compras, ["pan", "huevos"]) && shows(result, 2)
          ];
        }
      },
      {
        id: 10,
        title: "Ordena y resume números",
        shortTitle: "Resumen de precios",
        duration: "18 min",
        difficulty: "Listas",
        file: "proyecto_10.py",
        summary: "Python trae funciones listas para ordenar y resumir una colección de números.",
        example: "sorted(precios)",
        explanation: "sorted() devuelve una lista nueva ordenada, min() y max() buscan los extremos y sum() acumula todos los valores.",
        concepts: ["Ordenar con sorted()", "Extremos con min() y max()", "Promediar con sum() y len()"],
        goal: "Muestra los precios ordenados, el más barato, el más caro y el promedio con dos decimales.",
        starter: 'precios = [1200, 890, 2300, 450]\nprint(precios)',
        hints: [
          "sorted(precios) entrega la lista ordenada sin modificar la original.",
          "El promedio se obtiene con sum(precios) / len(precios).",
          'Para dos decimales usa una f-string: f"{promedio:.2f}".'
        ],
        checks: ["Muestras la lista ordenada", "Muestras el más barato y el más caro", "Muestras el promedio con dos decimales"],
        success: "Resumiste una colección completa en pocas líneas.",
        validate(result) {
          return [
            shows(result, "[450, 890, 1200, 2300]"),
            shows(result, 450) && shows(result, 2300),
            shows(result, "1210.00")
          ];
        }
      },
      {
        id: 11,
        title: "Guarda datos con diccionarios",
        shortTitle: "Diccionarios",
        duration: "18 min",
        difficulty: "Diccionarios",
        file: "proyecto_11.py",
        summary: "Un diccionario guarda pares de clave y valor, así cada dato tiene nombre propio.",
        example: 'curso["nivel"] = "inicial"',
        explanation: "Se consulta por clave con corchetes. get() evita el error cuando la clave no existe y permite entregar un valor por defecto.",
        concepts: ["Pares clave y valor", "Agregar claves nuevas", "Consultar seguro con get()"],
        goal: "Agrega la clave “nivel” con el valor “inicial”, muestra el diccionario completo y consulta con get() una clave que no exista mostrando “sin datos”.",
        starter: 'curso = {"nombre": "Python", "horas": 12}\nprint(curso["nombre"])',
        hints: [
          'Para agregar una clave escribe curso["nivel"] = "inicial".',
          "print(curso) muestra el diccionario completo.",
          'curso.get("profesor", "sin datos") devuelve el valor por defecto.'
        ],
        checks: ["Agregas la clave nivel", "Muestras el diccionario completo", "Usas get() con un valor por defecto"],
        success: "Ya organizas datos con nombre en lugar de posiciones.",
        validate(result, source) {
          const curso = result.environment.curso;
          const tieneNivel = curso && typeof curso === "object" && curso.nivel === "inicial";
          return [
            Boolean(tieneNivel),
            result.output.some((line) => line.includes("'nombre'") && line.includes("'nivel'")),
            uses(source, /\.get\s*\(/) && shows(result, "sin datos")
          ];
        }
      },
      {
        id: 12,
        title: "Recorre un inventario",
        shortTitle: "Inventario",
        duration: "20 min",
        difficulty: "Diccionarios",
        file: "proyecto_12.py",
        summary: "items() entrega la clave y el valor de cada par, así puedes revisar todo el diccionario.",
        example: "for producto, cantidad in stock.items():",
        explanation: "El ciclo reparte cada par en dos variables. Dentro puedes decidir con condiciones y acumular un total.",
        concepts: ["Recorrer con items()", "Repartir clave y valor", "Acumular dentro del ciclo"],
        goal: "Muestra cada producto con su cantidad, avisa cuáles están agotados y termina mostrando el total de unidades.",
        starter: 'stock = {"teclado": 3, "mouse": 0, "monitor": 5}\nfor producto in stock:\n    print(producto)',
        hints: [
          "Cambia el ciclo por for producto, cantidad in stock.items():.",
          "Dentro usa if cantidad == 0 para avisar que está agotado.",
          "Suma las cantidades en una variable total que empiece en 0; el resultado es 8."
        ],
        checks: ["Recorres el inventario con items()", "Avisas los productos agotados", "Muestras el total de unidades"],
        success: "Recorriste un diccionario tomando decisiones por cada dato.",
        validate(result, source) {
          return [
            uses(source, /\.items\s*\(\s*\)/),
            result.output.some((line) => /agotad/i.test(line) && line.toLowerCase().includes("mouse")),
            shows(result, 8)
          ];
        }
      }
    ]
  },
  {
    id: 4,
    title: "Funciones propias",
    description: "Reutilizar lógica con parámetros y resultados",
    stage: "Funciones propias",
    completionTitle: "Finalizaste las funciones propias de Python.",
    completionCopy: "Ya encapsulas lógica y la reutilizas. Rinde el mini examen del nivel; la integración final quedó disponible.",
    approvedCopy: "Aprobaste el mini examen de funciones propias. Puedes repetirlo cuando quieras para repasar.",
    projects: [
      {
        id: 13,
        title: "Crea una función para saludar",
        shortTitle: "Función saludar",
        duration: "15 min",
        difficulty: "Funciones",
        file: "proyecto_13.py",
        summary: "Una función agrupa instrucciones bajo un nombre para poder repetirlas cuando quieras.",
        example: "def saludar(nombre):",
        explanation: "def crea la función, el parámetro recibe el dato de cada llamada y return entrega el resultado a quien la llamó.",
        concepts: ["Definir con def", "Recibir un parámetro", "Entregar con return"],
        goal: "Completa saludar() para que devuelva “Hola, ” seguido del nombre, y pruébala con dos nombres distintos.",
        starter: 'def saludar(nombre):\n    return nombre\n\nprint(saludar("Ada"))',
        hints: [
          'Dentro de la función escribe return "Hola, " + nombre.',
          "También puedes usar una f-string: return f\"Hola, {nombre}\".",
          "Llama la función dos veces con nombres distintos."
        ],
        checks: ["Defines la función saludar", "Devuelve el saludo con el nombre", "La pruebas con dos nombres distintos"],
        success: "Encapsulaste una tarea y la reutilizaste sin repetir código.",
        validate(result, source) {
          const saludos = result.output.filter((line) => /^hola,\s*\S/i.test(line.trim()));
          return [
            uses(source, /def\s+saludar\s*\(\s*\w+\s*\)/),
            saludos.length >= 1,
            saludos.length >= 2 && new Set(saludos).size >= 2
          ];
        }
      },
      {
        id: 14,
        title: "Calcula un precio final",
        shortTitle: "Función descuento",
        duration: "18 min",
        difficulty: "Funciones",
        file: "proyecto_14.py",
        summary: "Un parámetro con valor por defecto se usa cuando quien llama no envía ese dato.",
        example: "def precio_final(precio, descuento=10):",
        explanation: "Los parámetros con valor por defecto van al final. Así la función sirve para el caso común y para los casos especiales.",
        concepts: ["Varios parámetros", "Valores por defecto", "Probar distintos casos"],
        goal: "Haz que precio_final aplique el descuento en porcentaje y muestra el resultado para 1000 sin descuento indicado y para 1000 con 50 %.",
        starter: 'def precio_final(precio, descuento):\n    return precio\n\nprint(precio_final(1000, 10))',
        hints: [
          "El precio con descuento es precio - precio * descuento / 100.",
          "Escribe descuento=10 en la definición para darle un valor por defecto.",
          "Los resultados esperados son 900.0 y 500.0."
        ],
        checks: ["El descuento tiene valor por defecto", "Muestras el precio con el descuento por defecto", "Muestras el precio con 50 % de descuento"],
        success: "Tu función cubre el caso habitual y también las excepciones.",
        validate(result, source) {
          return [
            uses(source, /def\s+precio_final\s*\([^)]*descuento\s*=\s*10/),
            shows(result, "900"),
            shows(result, "500")
          ];
        }
      },
      {
        id: 15,
        title: "Obtén un promedio",
        shortTitle: "Promedio de notas",
        duration: "18 min",
        difficulty: "Funciones",
        file: "proyecto_15.py",
        summary: "Una función puede recibir una lista completa y devolver un único resultado.",
        example: "def promedio(notas):",
        explanation: "sum() suma los valores y len() cuenta cuántos hay. Dividir ambos entrega el promedio de cualquier lista.",
        concepts: ["Recibir una lista", "Combinar sum() y len()", "Reutilizar con datos distintos"],
        goal: "Escribe promedio(notas) y muestra con dos decimales el promedio de [4, 5, 6, 7] y el de [6, 7].",
        starter: 'def promedio(notas):\n    return 0\n\nprint(promedio([4, 5, 6, 7]))',
        hints: [
          "Dentro de la función devuelve sum(notas) / len(notas).",
          'Para dos decimales usa f"{promedio(notas):.2f}".',
          "Los resultados esperados son 5.50 y 6.50."
        ],
        checks: ["Defines la función promedio", "Muestras 5.50 para la primera lista", "Muestras 6.50 para la segunda lista"],
        success: "Una sola función te sirve para cualquier lista de notas.",
        validate(result, source) {
          return [
            uses(source, /def\s+promedio\s*\(\s*\w+\s*\)/) && uses(source, /sum\s*\(/) && uses(source, /len\s*\(/),
            shows(result, "5.50"),
            shows(result, "6.50")
          ];
        }
      },
      {
        id: 16,
        title: "Analiza una frase",
        shortTitle: "Analizador de texto",
        duration: "20 min",
        difficulty: "Texto",
        file: "proyecto_16.py",
        summary: "Los textos también tienen métodos: se pueden separar, contar y transformar.",
        example: 'frase.split()',
        explanation: "split() divide la frase en una lista de palabras, len() las cuenta y upper() devuelve el texto en mayúsculas.",
        concepts: ["Dividir con split()", "Contar palabras", "Transformar con upper()"],
        goal: "Escribe contar_palabras(frase) que devuelva cuántas palabras hay, y muestra el total junto con la frase en mayúsculas.",
        starter: 'frase = "aprender python abre puertas"\n\ndef contar_palabras(texto):\n    return 0\n\nprint(contar_palabras(frase))',
        hints: [
          "texto.split() devuelve la lista de palabras separadas por espacios.",
          "Devuelve len(texto.split()).",
          "La frase de ejemplo tiene 4 palabras; muestra también frase.upper()."
        ],
        checks: ["Usas split() dentro de la función", "Muestras el total de palabras", "Muestras la frase en mayúsculas"],
        success: "Ya combinas funciones propias con los métodos del texto.",
        validate(result, source) {
          const frase = result.environment.frase;
          const total = typeof frase === "string" ? frase.trim().split(/\s+/).length : 0;
          return [
            uses(source, /def\s+contar_palabras\s*\(/) && uses(source, /\.split\s*\(/),
            total > 0 && shows(result, total),
            typeof frase === "string" && shows(result, frase.toUpperCase())
          ];
        }
      }
    ]
  },
  {
    id: 5,
    title: "Integración final",
    description: "Filtros, errores y proyectos completos",
    stage: "Integración final",
    completionTitle: "Finalizaste la integración final de Python.",
    completionCopy: "Terminaste los veinte proyectos. Aprueba este último mini examen para cerrar la ruta completa.",
    approvedCopy: "Aprobaste los cinco mini exámenes de la ruta. Completaste Python de principio a fin.",
    projects: [
      {
        id: 17,
        title: "Filtra con una comprensión",
        shortTitle: "Comprensión de listas",
        duration: "18 min",
        difficulty: "Integración",
        file: "proyecto_17.py",
        summary: "Una comprensión de listas construye una lista nueva describiendo qué quieres conservar.",
        example: "grandes = [n for n in numeros if n > 10]",
        explanation: "Se lee de izquierda a derecha: qué guardar, de dónde sacarlo y qué condición debe cumplir. Reemplaza a un ciclo con append().",
        concepts: ["Construir listas en una línea", "Filtrar con una condición", "Leer el resultado con len()"],
        goal: "Crea la lista grandes con los números mayores a 10 usando una comprensión, muéstrala e indica cuántos son.",
        starter: 'numeros = [12, 7, 30, 4, 18]\nprint(numeros)',
        hints: [
          "La estructura es [valor for valor in lista if condicion].",
          "La condición que necesitas es n > 10.",
          "Deben quedar 3 números: 12, 30 y 18."
        ],
        checks: ["Usas una comprensión de listas", "grandes contiene 12, 30 y 18", "Indicas que son 3"],
        success: "Escribiste un filtro completo en una sola línea legible.",
        validate(result, source) {
          return [
            uses(source, /\[[^\]]*\bfor\b[^\]]*\bin\b[^\]]*\]/),
            sameList(result.environment.grandes, [12, 30, 18]),
            shows(result, 3)
          ];
        }
      },
      {
        id: 18,
        title: "Maneja errores con try",
        shortTitle: "Manejo de errores",
        duration: "20 min",
        difficulty: "Integración",
        file: "proyecto_18.py",
        summary: "Un programa útil no se detiene ante un dato inesperado: lo detecta y sigue adelante.",
        example: "try:\n    numero = int(dato)\nexcept ValueError:\n    print(\"Dato inválido\")",
        explanation: "try intenta ejecutar el bloque y except captura el error indicado. Así el resto del programa continúa funcionando.",
        concepts: ["Proteger con try", "Capturar ValueError", "Continuar después del error"],
        goal: "Recorre la lista de datos, suma los que sean números y avisa “Dato inválido” con el valor que falló. Muestra el total al final.",
        starter: 'datos = ["12", "hola", "30"]\ntotal = 0\n\nfor dato in datos:\n    total += int(dato)\n\nprint(total)',
        hints: [
          "Rodea la conversión con try: dentro del ciclo.",
          "Agrega except ValueError: con el aviso correspondiente.",
          "El total esperado es 42 y debe aparecer un aviso para “hola”."
        ],
        checks: ["Usas try y except", "Avisas del dato inválido", "El total es 42"],
        success: "Tu programa resiste datos imperfectos, como los de la vida real.",
        validate(result, source) {
          return [
            uses(source, /\btry\s*:/) && uses(source, /\bexcept\b/),
            result.output.some((line) => /inv[áa]lid/i.test(line) && line.includes("hola")),
            result.environment.total === 42 && shows(result, 42)
          ];
        }
      },
      {
        id: 19,
        title: "Arma un reporte de ventas",
        shortTitle: "Reporte de ventas",
        duration: "22 min",
        difficulty: "Integración",
        file: "proyecto_19.py",
        summary: "Un reporte combina un diccionario, una función y un mensaje claro para quien lo lee.",
        example: "def mejor_dia(ventas):",
        explanation: "La función recorre el diccionario, compara los montos y devuelve la clave ganadora. Después se arma el mensaje final.",
        concepts: ["Recorrer y comparar", "Devolver el resultado", "Presentar el reporte"],
        goal: "Escribe mejor_dia(ventas) y muestra el mejor día con su monto y, en otra línea, el total vendido.",
        starter: 'ventas = {"lunes": 120, "martes": 340, "miercoles": 90}\n\ndef mejor_dia(datos):\n    return ""\n\nprint(mejor_dia(ventas))',
        hints: [
          "Dentro de la función guarda el mejor día y el mayor monto mientras recorres datos.items().",
          'Arma el mensaje con una f-string: f"El mejor día fue {dia} con {monto}".',
          "El total sale de sum(ventas.values()) y es 550."
        ],
        checks: ["Defines la función mejor_dia", "El reporte indica martes y 340", "Muestras el total 550"],
        success: "Convertiste datos sueltos en un reporte que cualquiera entiende.",
        validate(result, source) {
          return [
            uses(source, /def\s+mejor_dia\s*\(/),
            result.output.some((line) => line.includes("martes") && line.includes("340")),
            shows(result, 550)
          ];
        }
      },
      {
        id: 20,
        title: "Proyecto final: gestor de tareas",
        shortTitle: "Proyecto final",
        duration: "30 min",
        difficulty: "Proyecto",
        file: "proyecto_20.py",
        summary: "El cierre de la ruta reúne listas, diccionarios, funciones, condiciones y formato de texto.",
        example: 'tareas = [{"nombre": "Practicar", "hecha": False}]',
        explanation: "Cada tarea es un diccionario dentro de una lista. La función recorre la colección, cuenta lo completado y arma el resumen.",
        concepts: ["Listas de diccionarios", "Contar con condiciones", "Reportar el avance"],
        goal: "Escribe resumen(tareas) que muestre “Completadas 1 de 3 (33%)” y liste las tareas pendientes con un guion delante.",
        starter: 'tareas = [\n    {"nombre": "Leer la guía", "hecha": True},\n    {"nombre": "Practicar", "hecha": False},\n    {"nombre": "Repasar", "hecha": False}\n]\n\ndef resumen(items):\n    print(len(items))\n\nresumen(tareas)',
        hints: [
          "Cuenta las hechas recorriendo la lista y revisando tarea[\"hecha\"].",
          "El porcentaje es int(hechas / len(items) * 100).",
          'Para las pendientes usa print("-", tarea["nombre"]) dentro de un if.'
        ],
        checks: ["Defines resumen() y la llamas", "Muestras “1 de 3” con su porcentaje", "Listas las dos tareas pendientes"],
        success: "Cerraste la ruta con un programa completo de principio a fin.",
        validate(result, source) {
          const pendientes = result.output.filter((line) => line.trim().startsWith("-"));
          return [
            uses(source, /def\s+resumen\s*\(/) && uses(source, /resumen\s*\(\s*tareas\s*\)/),
            result.output.some((line) => line.includes("1 de 3")) && shows(result, 33),
            pendientes.length >= 2
              && pendientes.some((line) => line.includes("Practicar"))
              && pendientes.some((line) => line.includes("Repasar"))
          ];
        }
      }
    ]
  }
];

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
    title: "Mini examen de decisiones y ciclos",
    intro: "Cinco preguntas sobre condiciones, repeticiones y recorridos. Necesitas 4 respuestas correctas para aprobar.",
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
        question: "¿Qué hace la palabra continue dentro de un ciclo?",
        options: [
          "Termina el ciclo por completo",
          "Salta a la siguiente vuelta sin ejecutar el resto del bloque",
          "Vuelve a empezar el programa",
          "Repite la vuelta actual otra vez"
        ],
        answer: 1,
        explanation: "continue abandona solo la vuelta actual; break es el que termina el ciclo completo."
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
    title: "Mini examen de colecciones de datos",
    intro: "Cinco preguntas sobre listas, diccionarios y recorridos. Necesitas 4 respuestas correctas para aprobar.",
    passing: 4,
    questions: [
      {
        question: "Si compras = [\"pan\", \"leche\"], ¿cómo obtienes \"pan\"?",
        options: ["compras[1]", "compras[0]", "compras(\"pan\")", "compras.primero"],
        answer: 1,
        explanation: "Las posiciones empiezan en cero, así que el primer elemento es compras[0]."
      },
      {
        question: "¿Qué hace lista.append(\"nuevo\")?",
        options: [
          "Reemplaza toda la lista",
          "Agrega el elemento al final de la lista",
          "Ordena la lista alfabéticamente",
          "Elimina el último elemento"
        ],
        answer: 1,
        explanation: "append() agrega al final y modifica la lista original, sin crear una copia."
      },
      {
        question: "¿Qué devuelve len({\"a\": 1, \"b\": 2})?",
        options: ["1", "2", "3", "Un error"],
        answer: 1,
        explanation: "len() sobre un diccionario cuenta cuántos pares de clave y valor contiene."
      },
      {
        question: "¿Cuál es la ventaja de curso.get(\"nivel\", \"sin datos\")?",
        options: [
          "Ordena las claves del diccionario",
          "Entrega un valor por defecto si la clave no existe, en vez de fallar",
          "Agrega la clave al diccionario",
          "Convierte el diccionario en lista"
        ],
        answer: 1,
        explanation: "Con corchetes una clave inexistente provoca un KeyError; get() permite entregar una alternativa."
      },
      {
        question: "En for producto, cantidad in stock.items(), ¿qué recibe cada variable?",
        options: [
          "Las dos reciben la clave",
          "producto recibe la clave y cantidad recibe el valor",
          "producto recibe el valor y cantidad la posición",
          "Ambas reciben la lista completa"
        ],
        answer: 1,
        explanation: "items() entrega pares de clave y valor, y el for los reparte en ese mismo orden."
      }
    ]
  },
  {
    levelId: 4,
    title: "Mini examen de funciones propias",
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
        question: "En def precio_final(precio, descuento=10), ¿qué significa descuento=10?",
        options: [
          "Que el descuento siempre vale 10",
          "Que si no envías ese dato, la función usa 10",
          "Que el parámetro es obligatorio",
          "Que la función devuelve 10"
        ],
        answer: 1,
        explanation: "Es un valor por defecto: cubre el caso habitual y se puede reemplazar en cada llamada."
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
  },
  {
    levelId: 5,
    title: "Mini examen de integración final",
    intro: "Cinco preguntas sobre filtros, errores y formato. Necesitas 4 respuestas correctas para aprobar.",
    passing: 4,
    questions: [
      {
        question: "¿Qué produce [n for n in numeros if n > 10]?",
        options: [
          "Un número con la cantidad de elementos",
          "Una lista nueva con los elementos mayores a 10",
          "La lista original ordenada",
          "Un error, porque falta append()"
        ],
        answer: 1,
        explanation: "Una comprensión construye una lista nueva; la original no se modifica."
      },
      {
        question: "¿Para qué sirve try / except?",
        options: [
          "Para repetir un bloque hasta que funcione",
          "Para ejecutar una alternativa cuando ocurre un error, sin detener el programa",
          "Para comentar código que no se usa",
          "Para definir funciones más rápidas"
        ],
        answer: 1,
        explanation: "El bloque try intenta la operación y except decide qué hacer si falla."
      },
      {
        question: "¿Qué error ocurre al ejecutar int(\"hola\")?",
        options: ["ZeroDivisionError", "ValueError", "IndexError", "NameError"],
        answer: 1,
        explanation: "El texto no representa un número entero, así que Python levanta un ValueError."
      },
      {
        question: "¿Qué muestra print(f\"{2 / 3:.2f}\")?",
        options: ["0.666666", "0.67", "2/3", "0.66"],
        answer: 1,
        explanation: "El formato .2f redondea a dos decimales al mostrar el valor."
      },
      {
        question: "¿Por qué conviene mover un cálculo repetido a una función?",
        options: [
          "Porque el programa ocupa menos memoria",
          "Porque se escribe y se corrige en un solo lugar, y se puede probar aparte",
          "Porque Python obliga a usar funciones",
          "Porque las funciones se ejecutan más rápido siempre"
        ],
        answer: 1,
        explanation: "Reunir la lógica en una función evita repetir código y facilita corregirlo y probarlo."
      }
    ]
  }
];

const allProjects = () => COURSE_LEVELS.flatMap((level) => level.projects);
const TOTAL_PROJECTS = COURSE_LEVELS.reduce((total, level) => total + level.projects.length, 0);
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
const drafts = new Map(Object.entries(globalThis.LearningState?.session("python").drafts || {}).map(([index, code]) => [Number(index) + 1, code]));
const validatedSources = new Map();
let approvedExams = loadApprovedExams();
let examLevelId = 1;
let examAnswers = new Map();
let examReviewed = false;

function runPython(source) {
  const runtime = globalThis.PythonRuntime;
  if (!runtime) throw new Error("El intérprete de Python no se cargó. Recarga la página para volver a intentarlo.");
  const result = runtime.run(source);
  if (result.error) {
    const failure = new Error(result.error);
    failure.output = result.output;
    throw failure;
  }
  if (result.output.length === 0) {
    throw new Error("El programa no mostró ningún resultado. Agrega print() para ver la salida.");
  }
  return result;
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
    statement.id = "python-exam-question-" + index;
    statement.textContent = question.question;
    item.append(statement);

    const options = document.createElement("div");
    options.className = "exam-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-labelledby", statement.id);
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
  examTitle.focus?.({ preventScroll: true });
  if (typeof examPanel.scrollIntoView === "function") examPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeExam(returnFocus = false) {
  if (examPanel) examPanel.hidden = true;
  if (returnFocus) checkpointExam?.focus?.();
}

function submitExam() {
  if (examPanel.hidden || examReviewed || !isExamUnlocked(examLevelId)) return;
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
      + (next ? "Ya puedes continuar con " + next.stage.toLowerCase() + "."
        : approvedExams.size === 3 ? "Con esto cierras la ruta de Python." : "Revisa los otros mini exámenes: necesitas aprobar los tres para cerrar la ruta.");
    examResult.className = "exam-result is-passed";
  } else {
    examResult.textContent = "Obtuviste " + result.correct + " de " + result.total + " y necesitas " + result.passing
      + " para aprobar. Revisa las explicaciones y vuelve a intentarlo.";
    examResult.className = "exam-result is-failed";
  }
  renderLevelTabs();
  renderProgress();
  renderCheckpoint();
  examResult.focus?.();
}

function retryExam() {
  examAnswers = new Map();
  examReviewed = false;
  examResult.textContent = "";
  examResult.className = "exam-result";
  renderExam();
  examTitle.focus?.();
}

function getActiveLevel() {
  return COURSE_LEVELS.find((level) => level.id === activeLevelId);
}

function getActiveProject() {
  return allProjects().find((project) => project.id === activeProjectId);
}

function saveCurrentDraft() {
  if (projectCode && getActiveProject()) {
    drafts.set(activeProjectId, projectCode.value);
    globalThis.LearningState?.save("python", activeProjectId - 1, projectCode.value);
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    return new Set(saved.filter((project) => Number.isInteger(project) && project >= 1 && project <= TOTAL_PROJECTS));
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
  routeProgressText.textContent = completed + " de " + TOTAL_PROJECTS;
  routeProgressFill.style.width = (completed / TOTAL_PROJECTS * 100) + "%";
  const approvedAll = COURSE_LEVELS.every((level) => approvedExams.has(level.id));
  courseFinish.hidden = !(completed === TOTAL_PROJECTS && approvedAll);
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
  const scopeNote = document.querySelector("#python-lab-scope");
  if (scopeNote) {
    scopeNote.textContent = "Intérprete de Python del laboratorio: ejecuta variables, operaciones, f-strings, condiciones, ciclos, listas, diccionarios, funciones, comprensiones y try/except. Escribe tu propia solución: la salida se calcula de verdad. No incluye módulos externos (import) ni input().";
  }
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
  positionText.textContent = "Proyecto " + project.id + " de " + TOTAL_PROJECTS;
  renderProjectList();
  renderCheckpoint();
  globalThis.LearningState?.save("python", project.id - 1, projectCode.value);
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
    heroOutput.textContent = "› " + result.output.join("\n");
    heroOutput.classList.remove("is-error");
  } catch (error) {
    heroOutput.textContent = error.message;
    heroOutput.classList.add("is-error");
  }
}

function runActiveProject() {
  const project = getActiveProject();
  drafts.set(project.id, projectCode.value);
  globalThis.LearningState?.save("python", project.id - 1, projectCode.value);
  try {
    const result = runPython(projectCode.value);
    projectOutput.textContent = result.output.join("\n");
    projectOutput.classList.remove("is-error");
    const validationResults = project.validate(result, projectCode.value);
    const isValid = validationResults.every(Boolean);
    validRuns.set(project.id, isValid);
    if (isValid) validatedSources.set(project.id, projectCode.value);
    else validatedSources.delete(project.id);
    renderValidations(validationResults);
    successPanel.hidden = !isValid;
    if (!completedProjects.has(project.id)) completeButton.disabled = !isValid;
    if (!isValid) {
      projectOutput.textContent += "\n\nEl programa se ejecutó, pero todavía falta cumplir toda la misión.";
    }
  } catch (error) {
    validRuns.set(project.id, false);
    validatedSources.delete(project.id);
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
  globalThis.LearningState?.removeDraft("python", project.id - 1);
  validatedSources.delete(project.id);
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
  validRuns.set(activeProjectId, false);
  validatedSources.delete(activeProjectId);
  completeButton.disabled = true;
  successPanel.hidden = true;
  renderValidations();
  saveCurrentDraft();
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
  if (completeButton.disabled || !validRuns.get(project.id) || validatedSources.get(project.id) !== projectCode.value) return;
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
    examQuestions.querySelectorAll('[data-question="' + button.dataset.question + '"]').forEach((option) => {
      const selected = option.dataset.option === button.dataset.option;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  });
}

if (examSubmit) examSubmit.addEventListener("click", submitExam);
if (examRetry) examRetry.addEventListener("click", retryExam);
if (examClose) examClose.addEventListener("click", () => closeExam(true));

const resumePythonId = (globalThis.LearningState?.resumeIndex("python") ?? 0) + 1;
const resumePythonLevel = levelOfProject(resumePythonId);
if (resumePythonLevel && isLevelUnlocked(resumePythonLevel.id)) {
  activeProjectId = resumePythonId;
  activeLevelId = resumePythonLevel.id;
}
renderLevelTabs();
renderProgress();
renderProject();
