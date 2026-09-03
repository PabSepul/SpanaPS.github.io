(() => {
  "use strict";
  const { courses, field, check } = globalThis.MiniCourses;
  courses.nodejs = {
    name: "Node.js",
    prerequisite: ["Variables y funciones de JavaScript", "javascript.html"],
    scope: "Simulador guiado de terminal, archivo y respuesta HTTP. No es un proceso Node.js: no accede a tus archivos, no instala paquetes ni abre puertos. Los ejemplos usan CommonJS (.cjs).",
    next: "Para continuar fuera de aquí, instala Node.js desde su sitio oficial. Guarda el código con el nombre indicado y ejecútalo con node nombre-del-archivo.cjs. En el proyecto 2 crea también cursos.json en esa carpeta; en el 3 abre localhost:3000/saludo y detén el servidor con Ctrl+C.",
    source: ["Introducción oficial a Node.js", "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"],
    lessons: [
      {
        title: "Tu primera herramienta de terminal", duration: "10 min", file: "tiempo.cjs",
        intro: "Node.js ejecuta JavaScript sin una página web. Tu programa puede recibir argumentos: los valores escritos después del nombre del archivo. Vamos a transformar 90 minutos en horas.",
        concepts: [
          ["Terminal", "Es el lugar donde escribes un comando para iniciar un programa; no es la consola de tu página web."],
          ["process.argv", "Es una lista: la posición 0 identifica Node, la 1 el archivo y la 2 el primer argumento que tú entregas."],
          ["Number()", "Los argumentos llegan como texto. Number convierte un texto numérico en un número para trabajar con él."]
        ],
        steps: ["Imagina que ejecutas node tiempo.cjs 90. El dato que necesitas está en process.argv[2].", "Convierte ese texto a número y guárdalo en minutos.", "Divide los minutos entre 60 y muestra las horas con console.log."],
        fixture: 'Comando: node tiempo.cjs 90\nArgumentos simulados:\n["/runtime/node", "/curso/tiempo.cjs", "90"]',
        goal: "Lee el primer argumento como número y convierte 90 minutos en 1.5 horas.",
        expected: "1.5",
        fields: [
          field("index", "1. Posición del argumento", "1", [["0", "0 · programa Node"], ["1", "1 · archivo"], ["2", "2 · primer dato"]], "Las posiciones de un arreglo comienzan en cero."),
          field("convert", "2. Tipo del dato", "text", [["text", "Dejarlo como texto"], ["number", "Convertir con Number()"]], "Aunque / convierte textos numéricos implícitamente, aquí practicamos una conversión explícita."),
          field("operator", "3. Convertir minutos a horas", "*", [["*", "Multiplicar por 60"], ["/", "Dividir entre 60"]], "Una hora contiene 60 minutos.")
        ],
        hints: ["Después de Node y del archivo viene tu primer dato: posición 2.", "Usa Number(process.argv[2]) para guardar un número.", "La conversión es minutos / 60: 90 / 60 = 1.5."],
        solution: { index: "2", convert: "number", operator: "/" },
        code(v) {
          return "const minutos = " + (v.convert === "number" ? "Number(" : "") + "process.argv[" + v.index + "]" + (v.convert === "number" ? ")" : "") + ";\nconst horas = minutos " + v.operator + " 60;\nconsole.log(horas);";
        },
        run(v) {
          const arg = ["/runtime/node", "/curso/tiempo.cjs", "90"][Number(v.index)];
          const minutes = v.convert === "number" ? Number(arg) : arg;
          const hours = v.operator === "/" ? minutes / 60 : minutes * 60;
          return { output: String(hours), checks: [
            check("Lee process.argv[2]", v.index === "2"),
            check("Convierte explícitamente a número", typeof minutes === "number"),
            check("Obtiene 1.5 horas", hours === 1.5)
          ] };
        },
        mistake: "process.argv[1] es el archivo, no tu dato. Convertir una ruta a número produce NaN: significa «no es un número».",
        reflection: ["¿Qué pasaría si escribieras 120 en vez de 90?", "El mismo programa mostraría 2. Cambiar un argumento permite reutilizar una herramienta sin editar su código."]
      },
      {
        title: "Un pequeño reporte desde JSON", duration: "12 min", file: "reporte.cjs",
        intro: "Un archivo puede guardar datos para tu programa. JSON representa listas y objetos como texto; primero debes leer ese texto y luego convertirlo a valores de JavaScript.",
        concepts: [
          ["node:fs", "Es un módulo integrado de Node para archivos. require lo carga en este ejemplo CommonJS; no necesitas instalarlo con npm."],
          ["JSON.parse", "Convierte texto JSON en una lista u objeto que puedes recorrer."],
          ["reduce", "Recorre una lista y acumula un resultado. El 0 final es el valor inicial del acumulador."]
        ],
        steps: ["Lee cursos.json con codificación utf8 para recibir texto.", "Aplica JSON.parse para recuperar la lista de cursos.", "Suma la propiedad horas de cada curso, no su identificador."],
        fixture: 'Archivo virtual cursos.json:\n[\n  {"id": 1, "nombre": "Python", "horas": 12},\n  {"id": 2, "nombre": "SQL", "horas": 5}\n]',
        goal: "Lee el archivo disponible, interpreta su JSON y calcula 17 horas en total.",
        expected: "17",
        fields: [
          field("file", "1. Archivo que quieres leer", "curso.json", [["curso.json", "curso.json"], ["cursos.json", "cursos.json"]], "El nombre debe coincidir con el archivo de práctica."),
          field("parse", "2. Convertir el contenido", "String", [["String", "String(texto)"], ["JSON.parse", "JSON.parse(texto)"]], "Una cadena con corchetes no es todavía un arreglo."),
          field("property", "3. Dato que se acumula", "id", [["id", "id · identificador"], ["horas", "horas · duración"]], "La suma debe representar tiempo de estudio.")
        ],
        hints: ["El nombre del archivo está en plural: cursos.json.", "JSON.parse(texto) devuelve el arreglo; String lo deja como texto.", "Acumula curso.horas con reduce y un valor inicial de 0."],
        solution: { file: "cursos.json", parse: "JSON.parse", property: "horas" },
        code(v) {
          return 'const fs = require("node:fs");\nconst texto = fs.readFileSync("' + v.file + '", "utf8");\nconst cursos = ' + v.parse + "(texto);\nconst total = cursos.reduce((suma, curso) => suma + curso." + v.property + ", 0);\nconsole.log(total);";
        },
        run(v) {
          const exists = v.file === "cursos.json";
          const parsed = v.parse === "JSON.parse";
          const total = v.property === "horas" ? 17 : 3;
          return { output: !exists ? "Error: no existe el archivo virtual «curso.json»." : !parsed ? "Error: cursos sigue siendo texto; no tiene el método reduce de un arreglo." : String(total), checks: [
            check("Encuentra el archivo cursos.json", exists),
            check("Convierte el texto JSON en una lista", exists && parsed),
            check("Acumula 17 horas", exists && parsed && total === 17)
          ] };
        },
        mistake: "readFileSync bloquea mientras lee: lo usamos por simplicidad en una herramienta pequeña. Más adelante veremos lectura asíncrona, errores y validación de archivos externos.",
        reflection: ["¿Por qué no basta con leer el archivo?", "Leerlo entrega texto. JSON.parse interpreta ese formato y crea los objetos; recién entonces puedes acceder a curso.horas."]
      },
      {
        title: "Tu primera respuesta HTTP", duration: "15 min", file: "servidor.cjs",
        intro: "Un servidor espera peticiones y responde. La petición incluye una ruta; la respuesta incluye un estado y un contenido. Atenderemos /saludo y devolveremos 404 para las demás rutas.",
        concepts: [
          ["Petición y respuesta", "req contiene lo que pidió el cliente; res permite construir lo que recibirá."],
          ["Estado HTTP", "200 indica éxito. 404 indica que la ruta solicitada no fue encontrada."],
          ["res.end", "Envía el contenido final y termina la respuesta. res.write escribe, pero por sí solo no la termina."]
        ],
        steps: ["Carga node:http y entrega una función a createServer. Se llamará por cada petición.", "Compara req.url con /saludo y responde con estado 200 y el texto Hola desde Node.", "Para otras rutas devuelve 404. listen inicia la escucha solo cuando ejecutas el archivo en Node real."],
        fixture: "Peticiones simuladas:\nGET /saludo\nGET /no-existe\n\nAquí no se abre ningún puerto ni se envían peticiones reales.",
        goal: "Responde 200 y «Hola desde Node» a /saludo, termina la respuesta y conserva el 404 para otras rutas.",
        expected: "GET /saludo → 200 · Hola desde Node\nGET /no-existe → 404 · Ruta no encontrada",
        fields: [
          field("path", "1. Ruta disponible", "/hola", [["/hola", "/hola"], ["/saludo", "/saludo"]], "La URL que visita el cliente debe coincidir."),
          field("status", "2. Estado de éxito", "404", [["404", "404 · no encontrado"], ["200", "200 · correcto"]], "El estado comunica el resultado de la petición."),
          field("method", "3. Finalizar la respuesta", "write", [["write", "res.write(...)"], ["end", "res.end(...)"]], "El cliente necesita saber cuándo terminó la respuesta.")
        ],
        hints: ["La petición de prueba es GET /saludo: compara esa ruta exacta.", "Usa 200 cuando encuentres /saludo; conserva el 404 del else.", 'Llama a res.end("Hola desde Node") para enviar y terminar.'],
        solution: { path: "/saludo", status: "200", method: "end" },
        code(v) {
          return ['const http = require("node:http");', "const servidor = http.createServer((req, res) => {", '  res.setHeader("Content-Type", "text/plain; charset=utf-8");', '  if (req.url === "' + v.path + '") {', "    res.statusCode = " + v.status + ";", '    res.' + v.method + '("Hola desde Node");', "  } else {", "    res.statusCode = 404;", '    res.end("Ruta no encontrada");', "  }", "});", 'servidor.listen(3000, "127.0.0.1");'].join("\n");
        },
        run(v) {
          const found = v.path === "/saludo";
          const ended = v.method === "end";
          return { output: "GET /saludo → " + (found ? v.status + " · Hola desde Node" + (ended ? "" : " · respuesta sin finalizar") : "404 · Ruta no encontrada") + "\nGET /no-existe → 404 · Ruta no encontrada", checks: [
            check("Reconoce la ruta /saludo", found),
            check("Responde 200 al saludo y 404 a rutas desconocidas", found && v.status === "200"),
            check("Finaliza la respuesta con res.end", found && ended)
          ] };
        },
        mistake: "La comparación exacta de este ejemplo no procesa parámetros de consulta ni distingue métodos HTTP. No es todavía una API completa ni un servidor listo para producción.",
        reflection: ["¿Un estado 200 garantiza que el contenido sea correcto?", "No. El estado comunica éxito, pero también debes comprobar la ruta, el contenido y que la respuesta termine."]
      }
    ]
  };
})();
