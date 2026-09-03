(() => {
  "use strict";
  const { courses, field, check } = globalThis.MiniCourses;
  courses.typescript = {
    name: "TypeScript",
    prerequisite: ["Variables, objetos y funciones de JavaScript", "javascript.html"],
    scope: "Revisión guiada de las combinaciones de tipos incluidas en estos ejercicios, no un compilador TypeScript completo. Los mensajes explican esos casos concretos; para código libre utiliza un entorno con comprobación de tipos.",
    next: "Lleva los ejemplos al Playground oficial de TypeScript para editarlos libremente y ver diagnósticos del compilador. Después podremos practicar uniones, propiedades opcionales y tipos de datos externos. Los tipos no validan automáticamente un JSON recibido por red.",
    source: ["Tipos cotidianos en TypeScript", "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"],
    lessons: [
      {
        title: "Un número no es un texto", duration: "10 min", file: "edad.ts",
        intro: 'TypeScript añade comprobaciones de tipos a JavaScript. 18 es un número, pero "18" es texto. La anotación : number describe el tipo esperado; no convierte automáticamente el dato.',
        concepts: [
          ["number y string", "number describe números y string describe texto. Las comillas cambian el tipo de un literal."],
          ["Anotación", "const edad: number declara la intención de guardar un número. TypeScript también puede inferir tipos en muchos casos."],
          ["Comprobación", "Un tipo incompatible se señala antes de ejecutar. Los tipos se eliminan al generar JavaScript: no son una conversión en tiempo de ejecución."]
        ],
        steps: ["Declara edad como number para que represente una cantidad.", "Asigna el literal numérico 18, sin comillas.", "Suma uno y guarda el resultado en siguiente, que también espera un número."],
        fixture: "Edad actual: 18\nEdad siguiente esperada: 19",
        goal: "Haz que edad y siguiente sean números y que el programa muestre 19.",
        expected: "19",
        fields: [
          field("type", "1. Tipo de edad", "string", [["string", "string · texto"], ["number", "number · número"]], "El tipo debe describir el dato con el que quieres operar."),
          field("value", "2. Valor asignado", "text", [["text", '"18" · con comillas'], ["number", "18 · sin comillas"]], ': number no transforma "18" en 18.'),
          field("operator", "3. Edad del próximo año", "-", [["-", "edad - 1"], ["+", "edad + 1"]], "Una operación puede ser válida en tipos y aun así resolver mal la misión.")
        ],
        hints: ["Declara const edad: number.", "Usa el valor 18, sin comillas.", "const siguiente: number = edad + 1 da como resultado 19."],
        solution: { type: "number", value: "number", operator: "+" },
        code(v) {
          return "const edad: " + v.type + " = " + (v.value === "number" ? "18" : '"18"') + ";\nconst siguiente: number = edad " + v.operator + " 1;\nconsole.log(siguiente);";
        },
        run(v) {
          const numeric = v.type === "number" && v.value === "number";
          const same = v.type === (v.value === "number" ? "number" : "string");
          const error = !same ? "Tipo incompatible: el valor asignado no coincide con el tipo declarado para edad." : !numeric ? "edad es texto: + concatenaría y - requiere operandos numéricos en TypeScript. Declara y asigna un número." : null;
          return { output: error || String(v.operator === "+" ? 19 : 17), checks: [
            check("Declara edad como number", v.type === "number"),
            check("Asigna un literal numérico compatible", numeric),
            check("Calcula la edad siguiente: 19", numeric && v.operator === "+")
          ] };
        },
        mistake: 'Una afirmación de tipo no convierte el valor. Para texto del exterior necesitas convertirlo con Number y validar que el resultado sea un número útil.',
        reflection: ["¿Los tipos evitan todos los errores?", "No. edad - 1 puede ser perfectamente numérico, pero no calcula el próximo año. Por eso comprobamos tanto tipos como resultados."]
      },
      {
        title: "Una función con entradas claras", duration: "12 min", file: "sumar.ts",
        intro: "Los tipos de una función explican qué recibe y qué devuelve. Esto ayuda a encontrar llamadas equivocadas y a comprender su contrato sin tener que leer todos sus detalles internos.",
        concepts: [
          ["Parámetros", "a: number y b: number especifican que ambas entradas deben ser números."],
          ["Retorno", "El : number después de los paréntesis describe el resultado esperado, no una tercera entrada."],
          ["Contrato y lógica", "El contrato evita tipos incompatibles; los ejemplos y las pruebas comprueban que la operación sea la que necesitas."]
        ],
        steps: ["Anota los dos parámetros como number y el retorno como number.", "Devuelve la suma a + b.", "Llama a sumar con 2 y 3 numéricos, sin comillas."],
        fixture: "Llamada de práctica: sumar(2, 3)\nResultado esperado: 5",
        goal: "Acepta dos números, devuelve su suma y muestra 5 sin incompatibilidades de tipos.",
        expected: "5",
        fields: [
          field("type", "1. Tipo de los parámetros", "string", [["string", "a: string, b: string"], ["number", "a: number, b: number"]], "El retorno de la función ya está declarado como number."),
          field("operator", "2. Operación de la función", "*", [["*", "return a * b"], ["+", "return a + b"]], "El nombre sumar describe su intención."),
          field("argument", "3. Segundo argumento", "text", [["text", '"3" · texto'], ["number", "3 · número"]], "El primer argumento siempre será el número 2.")
        ],
        hints: ["Las dos entradas deben tener tipo number.", "Para sumar utiliza a + b, no a * b.", 'Llama a sumar(2, 3); "3" no cumple el contrato numérico.'],
        solution: { type: "number", operator: "+", argument: "number" },
        code(v) {
          return "function sumar(a: " + v.type + ", b: " + v.type + "): number {\n  return a " + v.operator + " b;\n}\n\nconst resultado = sumar(2, " + (v.argument === "number" ? "3" : '"3"') + ");\nconsole.log(resultado);";
        },
        run(v) {
          const compatible = v.type === "number" && v.argument === "number";
          return { output: v.type !== "number" ? "Contrato incompatible: el primer argumento 2 es number, pero a espera string. Revisa también los tipos de la operación y el retorno." : v.argument !== "number" ? 'Argumento incompatible: b espera number y recibió el texto "3".' : String(v.operator === "+" ? 5 : 6), checks: [
            check("Define dos entradas numéricas", v.type === "number"),
            check("Llama a la función con dos números", compatible),
            check("Devuelve la suma 5", compatible && v.operator === "+")
          ] };
        },
        mistake: "Cambiar el parámetro a any para silenciar un error elimina una comprobación útil. Primero revisa si el valor recibido realmente cumple el contrato.",
        reflection: ["¿TypeScript detectaría que multiplicaste en vez de sumar?", "No si entradas y salida siguen siendo números. Ese error de lógica necesita una prueba con valores y resultado esperado."]
      },
      {
        title: "El contrato de una tarjeta de curso", duration: "15 min", file: "curso.ts",
        intro: "Una interfaz describe la forma de un objeto. Un curso necesita un título, una cantidad de horas y un indicador de publicación. Cada propiedad tiene un nombre y un tipo concretos.",
        concepts: [
          ["interface", "Da nombre a una estructura de datos que puedes reutilizar en variables, parámetros y resultados."],
          ["Propiedad requerida", "Sin el signo ?, una propiedad debe estar presente. publicada y publicado son nombres distintos."],
          ["boolean", 'true y false son valores lógicos; las cadenas "true" y "false" siguen siendo texto.']
        ],
        steps: ["Lee la interfaz Curso: titulo es string, horas es number y publicado es boolean.", "Construye un objeto con los mismos nombres de propiedad y valores compatibles.", "Muestra el título y las horas. Este contrato también podría usarse como tipo de props de una tarjeta."],
        fixture: "Contrato Curso:\n  titulo: string\n  horas: number\n  publicado: boolean",
        goal: "Construye un curso Python de 12 horas con la propiedad publicado booleana y muestra su resumen.",
        expected: "Python: 12 horas",
        fields: [
          field("hours", "1. Valor de horas", "text", [["text", '"12" · texto'], ["number", "12 · número"]], "La interfaz pide number."),
          field("name", "2. Nombre de la propiedad lógica", "publicada", [["publicada", "publicada"], ["publicado", "publicado"]], "Los nombres forman parte del contrato."),
          field("published", "3. Valor lógico", "text", [["text", '"true" · texto'], ["boolean", "true · booleano"]], "Los booleanos se escriben sin comillas.")
        ],
        hints: ["horas debe valer 12, sin comillas.", "La interfaz define publicado, no publicada.", 'Usa publicado: true para cumplir boolean; "true" es un string.'],
        solution: { hours: "number", name: "publicado", published: "boolean" },
        code(v) {
          return 'interface Curso {\n  titulo: string;\n  horas: number;\n  publicado: boolean;\n}\n\nconst curso: Curso = {\n  titulo: "Python",\n  horas: ' + (v.hours === "number" ? "12" : '"12"') + ",\n  " + v.name + ": " + (v.published === "boolean" ? "true" : '"true"') + '\n};\nconsole.log(curso.titulo + ": " + curso.horas + " horas");';
        },
        run(v) {
          const errors = [];
          if (v.hours !== "number") errors.push("horas espera number, pero recibió string.");
          if (v.name !== "publicado") errors.push("Falta publicado; publicada no es una propiedad de esta interfaz.");
          if (v.published !== "boolean") errors.push("El indicador de publicación debe ser boolean, no string.");
          return { output: errors.length ? "Revisa el contrato:\n" + errors.join("\n") : "Python: 12 horas", checks: [
            check("Guarda horas como number", v.hours === "number"),
            check("Incluye la propiedad requerida publicado", v.name === "publicado"),
            check("Asigna un booleano al indicador", v.name === "publicado" && v.published === "boolean")
          ] };
        },
        mistake: "Una interfaz no comprueba datos externos en tiempo de ejecución. Un JSON puede no cumplirla: antes de confiar en él debes validar su contenido.",
        reflection: ["¿La interfaz crea automáticamente un curso?", "No. Describe su estructura para la comprobación de tipos. El objeto real lo crea la expresión entre llaves que asignas a curso."]
      }
    ]
  };
})();
