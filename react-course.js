(() => {
  "use strict";
  const { courses, field, check } = globalThis.MiniCourses;
  courses.react = {
    name: "React",
    prerequisite: ["Funciones de JavaScript; también te servirá HTML", "javascript.html"],
    scope: "Constructor guiado y vista didáctica de componentes. La vista representa las opciones del ejercicio; no carga React ni compila JSX libre. Los fragmentos son ejemplos de App.jsx para un proyecto React preparado.",
    next: "Lleva el código a un entorno React para editar JSX libremente. El proyecto ya debe renderizar App: estos ejemplos reemplazan App.jsx, no son archivos HTML que puedas abrir directamente. Después seguiremos con listas, formularios y composición.",
    source: ["Tu primer componente en la guía de React", "https://react.dev/learn/your-first-component"],
    lessons: [
      {
        title: "Un saludo hecho componente", duration: "10 min", file: "App.jsx",
        intro: "Un componente es una función que describe una parte de la interfaz. JSX permite escribir esa descripción con etiquetas dentro de JavaScript. Las llaves insertan una expresión, no el nombre literal de una variable.",
        concepts: [
          ["Componente", "Usamos un nombre con mayúscula inicial, como App, para distinguir componentes de etiquetas como h1."],
          ["JSX", "Se parece a HTML, pero es sintaxis que una herramienta transforma antes de ejecutarla en el navegador."],
          ["Llaves y fragmentos", "{nombre} inserta el valor de nombre. <>...</> agrupa elementos sin añadir un div al documento."]
        ],
        steps: ["Declara nombre con el valor Ada dentro de App.", "Agrupa el título y el párrafo en un único fragmento de JSX.", "Usa un h1 para el título e inserta {nombre} dentro del saludo."],
        fixture: 'Dato del componente: nombre = "Ada"\nInterfaz: un título «Hola, Ada» y un párrafo.',
        goal: "Agrupa el JSX correctamente y muestra «Hola, Ada» como encabezado principal, seguido del párrafo.",
        expected: "Hola, Ada\nTu primer componente.",
        fields: [
          field("root", "1. Agrupar título y párrafo", "none", [["none", "Dejar dos elementos separados"], ["fragment", "Usar un fragmento <>...</>"]], "return debe recibir una sola expresión JSX."),
          field("tag", "2. Etiqueta del título", "p", [["p", "p · párrafo"], ["h1", "h1 · encabezado principal"]], "La etiqueta aporta significado, no solo tamaño."),
          field("expression", "3. Leer la variable nombre", "literal", [["literal", "nombre · texto literal"], ["value", "{nombre} · valor de la variable"]], "Las llaves cambian de texto JSX a una expresión JavaScript.")
        ],
        hints: ["Un fragmento permite devolver dos elementos como una sola expresión.", "El saludo principal va dentro de <h1>...</h1>.", "Escribe Hola, {nombre}; así React usará el valor Ada."],
        solution: { root: "fragment", tag: "h1", expression: "value" },
        code(v) {
          return 'export default function App() {\n  const nombre = "Ada";\n  return (\n' + (v.root === "fragment" ? "    <>\n" : "") + "      <" + v.tag + ">Hola, " + (v.expression === "value" ? "{nombre}" : "nombre") + "</" + v.tag + ">\n      <p>Tu primer componente.</p>\n" + (v.root === "fragment" ? "    </>\n" : "") + "  );\n}";
        },
        run(v) {
          const text = "Hola, " + (v.expression === "value" ? "Ada" : "nombre");
          const valid = v.root === "fragment";
          return { output: valid ? text + "\nTu primer componente." : "JSX sin agrupar: el título y el párrafo necesitan un único elemento padre o fragmento.",
            preview: valid ? { kind: "greeting", tag: v.tag, text } : null,
            checks: [
              check("Agrupa los dos elementos en un fragmento", valid),
              check("Usa h1 para el encabezado principal", valid && v.tag === "h1"),
              check("Inserta el valor Ada con una expresión", valid && v.expression === "value")
            ]
          };
        },
        mistake: "JSX no es una cadena HTML. No puedes pegar este componente en un archivo .html y esperar que el navegador lo ejecute sin un entorno preparado.",
        reflection: ["¿Qué verías al cambiar nombre a Grace?", "Con {nombre} verías Hola, Grace. Sin llaves seguirías viendo el texto literal nombre."]
      },
      {
        title: "Dos tarjetas, un solo componente", duration: "12 min", file: "App.jsx",
        intro: "Las props son datos que un componente recibe de su padre. Una tarjeta puede tener una estructura única y mostrar títulos diferentes sin copiar y mantener dos diseños separados.",
        concepts: [
          ["Props", "Son entradas del componente. El padre decide qué valor entrega a cada instancia."],
          ["Desestructuración", "function Tarjeta({ titulo }) extrae la prop titulo del objeto de props recibido."],
          ["Reutilización", "Dos <Tarjeta /> crean dos instancias. Ambas usan la misma función, pero pueden recibir datos distintos."]
        ],
        steps: ["Crea Tarjeta con una prop llamada titulo.", "Muestra esa prop en el encabezado usando {titulo}.", "Usa Tarjeta dos veces en App y entrega Python y SQL como títulos."],
        fixture: "Primera tarjeta: Python\nSegunda tarjeta: SQL\nUna misma función Tarjeta para ambas.",
        goal: "Muestra tarjetas tituladas Python y SQL, pasando la prop correcta y reutilizando Tarjeta en los dos casos.",
        expected: "Tarjeta 1: Python\nTarjeta 2: SQL",
        fields: [
          field("prop", "1. Nombre de la prop enviada", "nombre", [["nombre", "nombre"], ["titulo", "titulo"]], "Debe coincidir con el nombre que recibe Tarjeta."),
          field("render", "2. Contenido del encabezado", "literal", [["literal", "titulo · texto literal"], ["value", "{titulo} · prop recibida"]], "El componente debe leer sus datos de entrada."),
          field("reuse", "3. Crear la segunda tarjeta", "copy", [["copy", "Copiar un article con SQL"], ["component", "Usar otra instancia de Tarjeta"]], "Copiar puede verse parecido, pero deja de compartir la estructura.")
        ],
        hints: ["Tarjeta recibe titulo, no nombre.", "Dentro del h2 utiliza {titulo}.", 'En App usa <Tarjeta titulo="Python" /> y <Tarjeta titulo="SQL" />.'],
        solution: { prop: "titulo", render: "value", reuse: "component" },
        code(v) {
          return "function Tarjeta({ titulo }) {\n  return <article><h2>" + (v.render === "value" ? "{titulo}" : "titulo") + "</h2></article>;\n}\n\nexport default function App() {\n  return (\n    <div>\n      <Tarjeta " + v.prop + '="Python" />\n      ' + (v.reuse === "component" ? "<Tarjeta " + v.prop + '="SQL" />' : "<article><h2>SQL</h2></article>") + "\n    </div>\n  );\n}";
        },
        run(v) {
          const title = (value) => v.render === "literal" ? "titulo" : v.prop === "titulo" ? value : "";
          const titles = [title("Python"), v.reuse === "component" ? title("SQL") : "SQL"];
          return { output: titles.map((t, i) => "Tarjeta " + (i + 1) + ": " + (t || "(sin título: prop no recibida)")).join("\n"),
            preview: { kind: "cards", titles },
            checks: [
              check("Entrega una prop llamada titulo", v.prop === "titulo"),
              check("Muestra los valores Python y SQL", titles.join() === "Python,SQL"),
              check("Reutiliza Tarjeta en ambas instancias", v.reuse === "component")
            ]
          };
        },
        mistake: "Las props se tratan como datos de solo lectura. No cambies titulo dentro de Tarjeta para comunicarte con el padre; más adelante veremos eventos y estado compartido.",
        reflection: ["¿Por qué reutilizar si copiar el HTML también se ve bien?", "Con un solo componente, una mejora de estructura o accesibilidad se aplica a todas las tarjetas. Las props mantienen diferentes sus datos."]
      },
      {
        title: "Un contador que recuerda", duration: "15 min", file: "App.jsx",
        intro: "Una variable local no conserva por sí sola el estado de una interfaz entre renderizados. useState proporciona un valor y una función para actualizarlo; React vuelve a renderizar después de esa actualización.",
        concepts: [
          ["useState", "Devuelve un par: el estado actual y su función actualizadora. La desestructuración les da nombres: cuenta y setCuenta."],
          ["Evento", "onClick recibe una función que se ejecutará al hacer clic, no el resultado de llamarla inmediatamente."],
          ["Actualización funcional", "setCuenta(actual => actual + 1) calcula el siguiente valor a partir del anterior."]
        ],
        steps: ["Importa useState y crea el estado al nivel superior de App.", "Pasa una función a onClick para que no se ejecute durante el renderizado.", "Suma uno al valor anterior; prueba el botón de la vista didáctica varias veces."],
        fixture: "Estado inicial: 0\nDespués de tres clics: 3",
        goal: "Inicia en cero, actualiza solo al hacer clic y aumenta de uno en uno. Prueba el botón del resultado.",
        expected: "Inicial: 0\nDespués de 3 clics: 3",
        fields: [
          field("initial", "1. Estado inicial", "1", [["1", "useState(1)"], ["0", "useState(0)"]], "Este valor se usa al iniciar el componente."),
          field("event", "2. Cuándo actualizar", "immediate", [["immediate", "Llamar a setCuenta al renderizar"], ["callback", "Entregar una función a onClick"]], "El clic debe iniciar el cambio, no el propio renderizado."),
          field("operator", "3. Cambio por clic", "-", [["-", "actual - 1"], ["+", "actual + 1"]], "Calcula el siguiente estado desde el anterior.")
        ],
        hints: ["El valor inicial debe ser useState(0).", "Usa onClick={() => setCuenta(...)} para esperar al clic.", "La actualización completa es setCuenta(actual => actual + 1)."],
        solution: { initial: "0", event: "callback", operator: "+" },
        code(v) {
          return 'import { useState } from "react";\n\nexport default function App() {\n  const [cuenta, setCuenta] = useState(' + v.initial + ");\n  return (\n    <button onClick={" + (v.event === "callback" ? "() => " : "") + "setCuenta(actual => actual " + v.operator + " 1)}>\n      Clics: {cuenta}\n    </button>\n  );\n}";
        },
        run(v) {
          const initial = Number(v.initial);
          const delta = v.operator === "+" ? 1 : -1;
          const safe = v.event === "callback";
          return { output: safe ? "Inicial: " + initial + "\nDespués de 3 clics: " + (initial + 3 * delta) : "Actualización durante el renderizado: este ejemplo volvería a renderizar sin parar. Pasa una función a onClick.",
            preview: safe ? { kind: "counter", initial, delta } : null,
            checks: [
              check("Inicia el contador en cero", initial === 0),
              check("Espera al evento de clic", safe),
              check("Llega a 3 después de tres clics", safe && initial + 3 * delta === 3)
            ]
          };
        },
        mistake: "No llames a useState dentro de una condición o un ciclo. Los hooks deben mantener el mismo orden en cada renderizado del componente.",
        reflection: ["¿Por qué el botón recibe una función?", "Así React puede llamarla cuando ocurra el clic. Si llamas al actualizador mientras renderizas, el cambio vuelve a disparar otro renderizado."]
      }
    ]
  };
})();
