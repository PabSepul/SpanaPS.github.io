(() => {
  "use strict";
  const { courses, field, check } = globalThis.MiniCourses;
  const sales = [12000, 8000, 10000, 6000];
  const names = [" Ana ", "LUIS", " ana ", "Luis "];
  const products = [
    { producto: "Cuaderno", unidades: 2, precio: 1500 },
    { producto: "Lápiz", unidades: 3, precio: 500 },
    { producto: "Libro", unidades: 1, precio: 8000 }
  ];
  const pyList = (values) => "[" + values.map((v) => typeof v === "string" ? "'" + v + "'" : v).join(", ") + "]";
  courses["datos-python"] = {
    name: "Datos con Python",
    prerequisite: ["Listas, ciclos y funciones de Python", "python.html"],
    scope: "Ejercicios guiados con datos ficticios incluidos. La vista calcula únicamente las operaciones seleccionadas; no ejecuta un intérprete Python libre. El código equivalente usa Python 3, sin pandas ni paquetes adicionales.",
    next: "Copia un ejemplo a un archivo .py y ejecútalo con Python 3 para modificar los datos libremente. Después podremos incorporar CSV, valores ausentes, pandas y gráficos, conservando la idea de comprobar cada transformación.",
    source: ["Estructuras de datos en Python", "https://docs.python.org/3/tutorial/datastructures.html"],
    lessons: [
      {
        title: "Resume una semana de ventas", duration: "10 min", file: "resumen.py",
        intro: "Una lista reúne varios valores en un orden. Antes de analizar datos conviene preguntar cuántos hay, cuánto suman y cuál es su promedio. Aquí cada número representa una venta ficticia en pesos.",
        concepts: [
          ["Lista", "Los corchetes agrupan elementos separados por comas. Cada elemento representa una observación."],
          ["sum y len", "sum suma los valores; len cuenta elementos. Responden preguntas distintas."],
          ["Promedio", "Es la suma dividida entre la cantidad. Aquí se interpreta como pesos por venta."]
        ],
        steps: ["Cuenta las cuatro ventas con len(ventas).", "Suma sus montos con sum(ventas).", "Divide el total entre la cantidad, no entre uno."],
        fixture: "Ventas ficticias (pesos): [12000, 8000, 10000, 6000]",
        goal: "Obtén 4 ventas, un total de 36000 pesos y un promedio de 9000 pesos por venta.",
        expected: "Cantidad: 4\nTotal: 36000\nPromedio: 9000.0",
        fields: [
          field("count", "1. Contar ventas", "sum", [["sum", "sum(ventas)"], ["len", "len(ventas)"]], "Contar no es sumar los montos."),
          field("total", "2. Sumar montos", "max", [["max", "max(ventas)"], ["sum", "sum(ventas)"]], "max obtiene solo el mayor valor."),
          field("divisor", "3. Calcular el promedio", "1", [["1", "total / 1"], ["cantidad", "total / cantidad"]], "Reparte el total entre todas las observaciones.")
        ],
        hints: ["len(ventas) devuelve 4.", "sum(ventas) devuelve 36000; max devuelve 12000.", "El promedio es total / cantidad: 36000 / 4 = 9000."],
        solution: { count: "len", total: "sum", divisor: "cantidad" },
        code(v) {
          return 'ventas = [12000, 8000, 10000, 6000]\ncantidad = ' + v.count + '(ventas)\ntotal = ' + v.total + '(ventas)\npromedio = total / ' + v.divisor + '\nprint("Cantidad:", cantidad)\nprint("Total:", total)\nprint("Promedio:", promedio)';
        },
        run(v) {
          const count = v.count === "len" ? sales.length : sales.reduce((a, b) => a + b, 0);
          const total = v.total === "sum" ? sales.reduce((a, b) => a + b, 0) : Math.max(...sales);
          const average = total / (v.divisor === "cantidad" ? count : 1);
          return { output: "Cantidad: " + count + "\nTotal: " + total + "\nPromedio: " + (Number.isInteger(average) ? average.toFixed(1) : average), checks: [
            check("Cuenta 4 ventas", count === 4),
            check("Suma 36000 pesos", total === 36000),
            check("Calcula 9000 pesos por venta", average === 9000)
          ] };
        },
        mistake: "Si la lista estuviera vacía, su cantidad sería cero y no podrías dividir por ella. Un análisis real debe comprobar ese caso antes de calcular el promedio.",
        reflection: ["¿El promedio cuenta toda la historia?", "No. Resume los datos, pero puede ocultar diferencias grandes entre ventas. Conviene mirar también los valores individuales, el mínimo y el máximo."]
      },
      {
        title: "Limpia nombres antes de contar", duration: "12 min", file: "limpieza.py",
        intro: "Una etiqueta puede aparecer con espacios o mayúsculas diferentes. En estos datos ficticios sabemos que esas variaciones representan la misma etiqueta; normalizarlas evita contarlas varias veces.",
        concepts: [
          ["strip()", "Quita espacios al comienzo y al final. No borra los espacios entre palabras."],
          ["lower()", "Convierte letras a minúsculas para comparar etiquetas con el mismo criterio."],
          ["set y sorted", "set elimina valores idénticos repetidos. sorted produce una lista ordenada para mostrar un resultado predecible."]
        ],
        steps: ["Recorre cada nombre y quita sus espacios exteriores.", "Pasa el texto a minúsculas; guarda el resultado en una lista nueva.", "Elimina duplicados después de limpiar y ordena las etiquetas resultantes."],
        fixture: 'Nombres ficticios: [" Ana ", "LUIS", " ana ", "Luis "]',
        goal: "Conserva los datos originales y obtén solo las etiquetas ana y luis, ordenadas.",
        expected: "['ana', 'luis']\nEtiquetas únicas: 2",
        fields: [
          field("spaces", "1. Espacios exteriores", "keep", [["keep", "Conservar espacios"], ["strip", "Quitar con strip()"]], "Un espacio también forma parte del texto."),
          field("case", "2. Mayúsculas y minúsculas", "keep", [["keep", "Conservar letras originales"], ["lower", "Normalizar con lower()"]], "LUIS y Luis no son cadenas idénticas."),
          field("unique", "3. Preparar el resultado", "all", [["all", "sorted(limpios)"], ["set", "sorted(set(limpios))"]], "Ordenar por sí solo no elimina repeticiones.")
        ],
        hints: ["Empieza con nombre.strip().", "Encadena nombre.strip().lower() dentro de la comprensión de lista.", "Usa sorted(set(limpios)): primero elimina repeticiones y luego ordena."],
        solution: { spaces: "strip", case: "lower", unique: "set" },
        code(v) {
          return 'nombres = [" Ana ", "LUIS", " ana ", "Luis "]\nlimpios = [nombre' + (v.spaces === "strip" ? ".strip()" : "") + (v.case === "lower" ? ".lower()" : "") + ' for nombre in nombres]\nunicos = sorted(' + (v.unique === "set" ? "set(limpios)" : "limpios") + ')\nprint(unicos)\nprint("Etiquetas únicas:", len(unicos))';
        },
        run(v) {
          const clean = names.map((name) => {
            const trimmed = v.spaces === "strip" ? name.trim() : name;
            return v.case === "lower" ? trimmed.toLowerCase() : trimmed;
          });
          const unique = (v.unique === "set" ? [...new Set(clean)] : [...clean]).sort();
          return { output: pyList(unique) + "\nEtiquetas únicas: " + unique.length, checks: [
            check("Elimina espacios exteriores", clean.every((name) => name === name.trim())),
            check("Normaliza las etiquetas a minúsculas", clean.every((name) => name === name.toLowerCase())),
            check("Obtiene exactamente ana y luis", JSON.stringify(unique) === '["ana","luis"]')
          ] };
        },
        mistake: "Dos personas pueden tener el mismo nombre: no dedupliques personas solo por su nombre. Aquí limpiamos etiquetas ficticias, no identidades.",
        reflection: ["¿Por qué eliminar duplicados después de limpiar?", "Porque ' Ana ' y ' ana ' son diferentes antes de normalizar. Solo se vuelven iguales después de quitar espacios y unificar mayúsculas."]
      },
      {
        title: "Construye un reporte de pedidos", duration: "15 min", file: "pedidos.py",
        intro: "Una fila puede representarse con un diccionario: cada clave nombra un atributo. Combinaremos unidades y precio unitario para saber cuánto aporta cada pedido al total.",
        concepts: [
          ["Diccionario", "Guarda pares clave-valor. pedido['unidades'] lee un atributo por su nombre."],
          ["Importe", "Unidades × precio unitario produce pesos por pedido. Sumar unidades y pesos no tiene sentido como importe."],
          ["Comprensión de lista", "[expresión for pedido in pedidos] calcula un valor por cada pedido y crea una lista nueva."]
        ],
        steps: ["Lee unidades y precio de cada diccionario.", "Multiplica ambos valores y guarda los importes sin cambiar los pedidos originales.", "Suma los importes y encuentra el mayor pedido; no confundas precio unitario e importe."],
        fixture: "Producto | Unidades | Precio unitario (pesos)\nCuaderno | 2 | 1500\nLápiz    | 3 | 500\nLibro    | 1 | 8000",
        goal: "Calcula los importes 3000, 1500 y 8000; un total de 12500 pesos y un pedido mayor de 8000 pesos.",
        expected: "Importes: [3000, 1500, 8000]\nTotal: 12500\nMayor pedido: 8000",
        fields: [
          field("operator", "1. Importe de cada pedido", "+", [["+", "unidades + precio"], ["*", "unidades * precio"]], "Piensa en la unidad del resultado: pesos por pedido."),
          field("total", "2. Total vendido", "len", [["len", "len(importes)"], ["sum", "sum(importes)"]], "Queremos dinero, no cantidad de pedidos."),
          field("largest", "3. Mayor pedido", "min", [["min", "min(importes)"], ["max", "max(importes)"]], "Compara importes completos, no precios unitarios.")
        ],
        hints: ["El cuaderno cuesta 2 × 1500 = 3000 pesos en ese pedido.", "sum(importes) reúne el dinero de los tres pedidos.", "max(importes) devuelve 8000: el pedido de un libro."],
        solution: { operator: "*", total: "sum", largest: "max" },
        code(v) {
          return ['pedidos = [', '    {"producto": "Cuaderno", "unidades": 2, "precio": 1500},', '    {"producto": "Lápiz", "unidades": 3, "precio": 500},', '    {"producto": "Libro", "unidades": 1, "precio": 8000},', "]", 'importes = [pedido["unidades"] ' + v.operator + ' pedido["precio"] for pedido in pedidos]', "total = " + v.total + "(importes)", "mayor = " + v.largest + "(importes)", 'print("Importes:", importes)', 'print("Total:", total)', 'print("Mayor pedido:", mayor)'].join("\n");
        },
        run(v) {
          const amounts = products.map((p) => v.operator === "*" ? p.unidades * p.precio : p.unidades + p.precio);
          const total = v.total === "sum" ? amounts.reduce((a, b) => a + b, 0) : amounts.length;
          const largest = v.largest === "max" ? Math.max(...amounts) : Math.min(...amounts);
          return { output: "Importes: " + pyList(amounts) + "\nTotal: " + total + "\nMayor pedido: " + largest,
            table: { columns: ["Producto", "Importe calculado (pesos)"], rows: products.map((p, i) => [p.producto, amounts[i]]) },
            checks: [
              check("Calcula los tres importes correctamente", amounts.join() === "3000,1500,8000"),
              check("Suma 12500 pesos", total === 12500),
              check("Encuentra el pedido de 8000 pesos", largest === 8000)
            ]
          };
        },
        mistake: "Un reporte necesita unidades claras. Precio unitario, cantidad e importe no son intercambiables aunque todos sean números.",
        reflection: ["¿Por qué conviene conservar la lista pedidos?", "Así puedes revisar el origen de cada importe, corregir una transformación y volver a calcular sin perder la información inicial."]
      }
    ]
  };
})();
