import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const runtimeSource = fs.readFileSync(new URL("./starter-runtime.js", import.meta.url), "utf8");
const examSource = fs.readFileSync(new URL("./starter-exams.js", import.meta.url), "utf8");
const sqlCourseSource = fs.readFileSync(new URL("./sql-course.js", import.meta.url), "utf8");
const courseSource = fs.readFileSync(new URL("./starter-course.js", import.meta.url), "utf8");

class FakeElement {
  constructor() {
    this.attributes = {};
    this.children = [];
    this.classList = { add() {}, toggle() {} };
    this.disabled = false;
    this.hidden = false;
    this.listeners = {};
    this.style = {};
    this.textContent = "";
    this.value = "";
  }

  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  append(child) { this.children.push(child); }
  click() { for (const callback of this.listeners.click || []) callback(); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = value; }
  focus() { this.focused = true; }
  scrollIntoView() {}
  set innerHTML(value) { this._innerHTML = value; }
  get innerHTML() { return this._innerHTML || ""; }
}

function createCourseContext(courseName, storage = new Map(), blockStorage = false) {
  const elements = new Map();
  const document = {
    body: { dataset: { course: courseName } },
    createElement: () => new FakeElement(),
    querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, new FakeElement());
      return elements.get(selector);
    }
  };
  const localStorage = {
    getItem: (key) => { if (blockStorage) throw new Error("Storage bloqueado"); return storage.get(key) ?? null; },
    setItem: (key, value) => { if (blockStorage) throw new Error("Storage bloqueado"); storage.set(key, value); }
  };
  const sandbox = { document, localStorage };
  vm.createContext(sandbox);
  vm.runInContext(runtimeSource, sandbox);
  vm.runInContext(sqlCourseSource, sandbox);
  vm.runInContext(examSource, sandbox);
  vm.runInContext(courseSource, sandbox);
  return { elements, sandbox, storage };
}

const SOLUTIONS = {
  "html-css": [
    "<h1>Mi primera página</h1>\n<p>Quiero aprender cada día.</p>",
    "<h2>Mis pasos</h2>\n<ul><li>Leer</li><li>Practicar</li><li>Repetir</li></ul>\n<a href=\"https://developer.mozilla.org\">Documentación</a>",
    "<figure><img src=\"foto.png\" alt=\"Equipo trabajando frente a un computador\"><figcaption>Nuestro equipo</figcaption></figure>",
    "<header><h1>Mi sitio</h1></header>\n<main><h2>Contenido</h2><p>Texto principal.</p></main>\n<footer>Hecho para aprender</footer>",
    "<style>.mensaje { color: blue; padding: 16px; }</style>\n<p class=\"mensaje\">Hola</p>",
    "<style>body { font-family: system-ui, sans-serif; font-size: 18px; } p { line-height: 1.6; }</style>\n<p>Un párrafo cómodo.</p>",
    "<style>.caja { padding: 24px; margin: 16px; border: 2px solid #1c69d4; border-radius: 8px; }</style>\n<div class=\"caja\">Una caja</div>",
    "<style>.accion { transition: background .2s ease; } .accion:hover { background: #14509f; }</style>\n<button class=\"accion\" type=\"button\">Comenzar</button>",
    "<style>.fila { display: flex; gap: 16px; justify-content: space-between; }</style>\n<div class=\"fila\"><div>Uno</div><div>Dos</div><div>Tres</div></div>",
    "<style>.grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }</style>\n<div class=\"grilla\"><article>A</article><article>B</article><article>C</article></div>",
    "<style>.grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } @media (max-width: 600px) { .grilla { grid-template-columns: 1fr; } }</style>\n<div class=\"grilla\"><article>A</article></div>",
    "<style>.curso { border: 1px solid #d7dee8; border-radius: 12px; padding: 24px; } .curso:hover { border-color: #1c69d4; } @media (max-width: 600px) { .curso { padding: 16px; } }</style>\n<article class=\"curso\"><h2>Ruta de SQL</h2><p>Consulta datos reales.</p><button type=\"button\">Comenzar</button></article>"
  ],
  javascript: [
    "const lenguaje = \"JavaScript\";\nconsole.log(lenguaje);",
    "const precio = 4500;\nconst cantidad = 3;\nconst total = precio * cantidad;\nconsole.log(total);",
    "const nombre = \"ada\";\nconst modulos = 3;\nconsole.log(`Hola, ${nombre.toUpperCase()}: llevas ${modulos} módulos`);",
    "const horas = 12;\nconst meta = 10;\nconst cumplio = horas >= meta;\nconsole.log(cumplio);",
    "const edad = 18;\nif (edad >= 18) { console.log(\"Puede entrar\"); } else { console.log(\"Aún no\"); }",
    "const nota = 5;\nif (nota >= 6) { console.log(\"Excelente\"); } else if (nota >= 4) { console.log(\"Aprobado\"); } else { console.log(\"A reforzar\"); }",
    "const cursos = [\"Python\", \"HTML y CSS\", \"JavaScript\"];\ncursos.push(\"SQL\");\nconsole.log(cursos.length);\nconsole.log(cursos[0]);",
    "const horas = [12, 6, 8, 5, 14];\nlet total = 0;\nfor (const hora of horas) { total += hora; }\nconsole.log(total);",
    "function doblar(numero) { return numero * 2; }\nconsole.log(doblar(6));",
    "const descuento = (precio, porcentaje = 10) => precio - (precio * porcentaje) / 100;\nconsole.log(descuento(1000));\nconsole.log(descuento(1000, 50));",
    "const cursos = [\n  { nombre: \"Python\", horas: 12 },\n  { nombre: \"SQL\", horas: 5 },\n  { nombre: \"APIs\", horas: 9 }\n];\nconst largos = cursos.filter((curso) => curso.horas >= 9);\nconsole.log(largos.map((curso) => curso.nombre).join(\", \"));\nconsole.log(cursos.reduce((total, curso) => total + curso.horas, 0));",
    "const carrito = [\n  { producto: \"Teclado\", precio: 25990, cantidad: 1 },\n  { producto: \"Mouse\", precio: 12990, cantidad: 2 }\n];\nfunction total(items) {\n  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);\n}\nconst unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);\nconsole.log(`Carrito: ${unidades} productos · Total: $${total(carrito)}`);"
  ],
  sql: [
    "SELECT nombre, nivel FROM cursos;",
    "SELECT DISTINCT categoria FROM cursos;",
    "SELECT nombre, duracion FROM cursos WHERE nivel = 'Inicial';",
    "SELECT nombre, duracion FROM cursos WHERE nivel = 'Inicial' AND duracion > 6;",
    "SELECT nombre, categoria FROM cursos WHERE nombre LIKE '%Python%';",
    "SELECT nombre, duracion FROM cursos WHERE duracion BETWEEN 5 AND 9;",
    "SELECT nombre, inscritos FROM cursos ORDER BY inscritos DESC;",
    "SELECT nombre, duracion FROM cursos ORDER BY duracion DESC LIMIT 3;",
    "SELECT COUNT(*) AS total FROM cursos WHERE nivel = 'Inicial';",
    "SELECT AVG(duracion) AS promedio, SUM(duracion) AS total FROM cursos;",
    "SELECT categoria, COUNT(*) AS total FROM cursos GROUP BY categoria ORDER BY total DESC;",
    "SELECT e.nombre AS estudiante, c.nombre AS curso FROM estudiantes e JOIN cursos c ON e.curso_id = c.id ORDER BY estudiante;"
  ]
};

let moduleCount = 0;
let checkCount = 0;

for (const [courseName, solutions] of Object.entries(SOLUTIONS)) {
  const { elements } = createCourseContext(courseName);

  assert.equal(elements.get("#starter-level-tabs").children.length, 3, `${courseName} debe mostrar 3 niveles`);
  assert.equal(elements.get("#starter-module-list").children.length, 4, `${courseName} debe mostrar 4 módulos por nivel`);
  assert.match(elements.get("#starter-position").textContent, /de 12$/, `${courseName} debe tener 12 módulos`);

  for (let index = 0; index < solutions.length; index += 1) {
    if (index > 0) elements.get("#starter-next").click();
    const label = `${courseName}, módulo ${index + 1}`;

    elements.get("#starter-code").value = elements.get("#starter-code").value;
    elements.get("#starter-run").click();
    assert.equal(elements.get("#starter-complete").disabled, true, `${label}: el código inicial no debe validar`);

    elements.get("#starter-code").value = solutions[index];
    elements.get("#starter-run").click();
    const failed = elements.get("#starter-validations").children
      .map((item, position) => (item.className === "validation-passed" ? null : position + 1))
      .filter(Boolean);
    assert.deepEqual(failed, [], `${label}: validaciones sin cumplir ${failed.join(", ")}`);
    assert.equal(elements.get("#starter-complete").disabled, false, `${label} debe validar`);
    assert.equal(elements.get("#starter-success").hidden, false, `${label} debe mostrar éxito`);

    moduleCount += 1;
    checkCount += elements.get("#starter-validations").children.length;
    elements.get("#starter-complete").click();
  }

  assert.equal(elements.get("#starter-completed").textContent, "12 completados", `${courseName} debe registrar el avance`);
  assert.equal(elements.get("#starter-next").disabled, true, `${courseName} debe terminar en el último módulo`);
}

const { elements: javascriptElements } = createCourseContext("javascript");
javascriptElements.get("#starter-code").value = "console.log(1 + 1);\nconsole.log(\"listo\");";
javascriptElements.get("#starter-run").click();
assert.equal(javascriptElements.get("#starter-output").textContent, "2\nlisto");

javascriptElements.get("#starter-code").value = "while (true) { }";
javascriptElements.get("#starter-run").click();
assert.match(javascriptElements.get("#starter-output").textContent, /ciclo nunca termina/);

javascriptElements.get("#starter-code").value = "const a = 1;\na = 2;";
javascriptElements.get("#starter-run").click();
assert.match(javascriptElements.get("#starter-output").textContent, /const/);

const { elements: sqlElements } = createCourseContext("sql");
sqlElements.get("#starter-code").value = "DELETE FROM cursos;";
sqlElements.get("#starter-run").click();
assert.match(sqlElements.get("#starter-output").textContent, /SELECT|consulta/i);

sqlElements.get("#starter-code").value = "SELECT nombre FROM cursos WHERE nivel = 'Inexistente';";
sqlElements.get("#starter-run").click();
assert.match(sqlElements.get("#starter-output").textContent, /0 filas/);

sqlElements.get("#starter-code").value = "SELECT nombre FROM estudiantes JOIN cursos ON estudiantes.curso_id = cursos.id;";
sqlElements.get("#starter-run").click();
assert.match(sqlElements.get("#starter-output").textContent, /existe en las dos tablas/);

console.log(`3 rutas, ${moduleCount} módulos y ${checkCount} validaciones: OK`);

function chooseAnswers(context, exam, correctCount = 5) {
  exam.questions.forEach((question, index) => {
    const option = index < correctCount ? question.answer : (question.answer + 1) % 4;
    const item = context.elements.get("#exam-questions").children[index];
    const buttons = item.children[1].children;
    buttons[option].click();
    assert.equal(buttons[option].attributes["aria-pressed"], "true", "la opción elegida queda anunciada");
    assert.equal(context.elements.get("#exam-questions").children[index], item, "elegir no reemplaza el control ni pierde el foco");
  });
}

function solveModule(context, courseName, index) {
  const elements = context.elements;
  elements.get("#starter-code").value = SOLUTIONS[courseName][index];
  elements.get("#starter-run").click();
  assert.equal(elements.get("#starter-complete").disabled, false);
  elements.get("#starter-complete").click();
}

let examCount = 0;
let questionCount = 0;
const sharedStorage = new Map();

for (const courseName of Object.keys(SOLUTIONS)) {
  const context = createCourseContext(courseName);
  const elements = context.elements;
  const bank = context.sandbox.StarterExams.LEVEL_EXAMS[courseName];
  const completeKey = `codigo-cero.${courseName}-v2.completed`;
  const examsKey = `codigo-cero.${courseName}-v2.exams`;
  assert.equal(bank.length, 3);

  // Las nueve evaluaciones tienen cinco preguntas y un umbral real de cuatro aciertos.
  bank.forEach((exam, index) => {
    assert.equal(exam.levelId, index + 1);
    assert.equal(exam.questions.length, 5);
    assert.equal(exam.passing, 4);
    for (const question of exam.questions) {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
      assert.ok(question.explanation.length > 20);
    }
    for (const correctCount of [0, 3, 4, 5]) {
      const answers = exam.questions.map((question, position) => position < correctCount ? question.answer : (question.answer + 1) % 4);
      const grade = context.sandbox.StarterExams.gradeExam(courseName, exam.levelId, answers);
      assert.equal(grade.correct, correctCount);
      assert.equal(grade.passed, correctCount >= 4);
    }
    assert.equal(context.sandbox.StarterExams.gradeExam(courseName, exam.levelId, undefined).passed, false);
    examCount += 1;
    questionCount += exam.questions.length;
  });
  assert.equal(context.sandbox.StarterExams.gradeExam(courseName, 99, []), null);

  // Las guardas funcionan incluso al invocar el listener de un botón deshabilitado.
  assert.deepEqual(elements.get("#starter-level-tabs").children.map((button) => button.disabled), [false, true, true]);
  elements.get("#starter-level-tabs").children[1].click();
  assert.equal(elements.get("#starter-position").textContent, "Módulo 1 de 12");
  elements.get("#starter-complete").click();
  assert.equal(elements.get("#starter-completed").textContent, "0 completados");
  elements.get("#starter-previous").click();
  assert.equal(elements.get("#starter-position").textContent, "Módulo 1 de 12");
  elements.get("#checkpoint-exam").click();
  assert.equal(elements.get("#level-exam").hidden, true);
  elements.get("#starter-module-list").children[3].click();
  assert.equal(elements.get("#starter-next").disabled, true);
  elements.get("#starter-next").click();
  assert.equal(elements.get("#starter-position").textContent, "Módulo 4 de 12");

  for (let index = 0; index < 4; index += 1) {
    elements.get("#starter-module-list").children[index].click();
    solveModule(context, courseName, index);
    assert.equal(elements.get("#level-checkpoint").hidden, index < 3);
    assert.equal(elements.get("#starter-level-tabs").children[1].disabled, index < 3);
  }
  assert.deepEqual(elements.get("#starter-level-tabs").children.map((button) => button.disabled), [false, false, true]);
  assert.equal(elements.get("#starter-next").disabled, false, "el siguiente nivel abre sin exigir todavía el examen");
  assert.equal(elements.get("#checkpoint-next").hidden, false);

  elements.get("#checkpoint-exam").click();
  assert.equal(elements.get("#level-exam").hidden, false);
  assert.equal(elements.get("#exam-questions").children.length, 5);
  elements.get("#exam-submit").click();
  assert.match(elements.get("#exam-result").textContent, /Responde las 5 preguntas/);
  assert.equal(context.storage.has(examsKey), false);
  chooseAnswers(context, bank[0], 3);
  elements.get("#exam-submit").click();
  assert.match(elements.get("#exam-result").textContent, /necesitas 4/);
  assert.equal(context.storage.has(examsKey), false);
  assert.equal(elements.get("#exam-questions").children[0].children.length, 3, "se muestra explicación por pregunta");
  assert.ok(elements.get("#exam-questions").children.every((item) => item.children[1].children.every((button) => button.disabled)));

  elements.get("#exam-retry").click();
  assert.ok(elements.get("#exam-questions").children.every((item) => item.children[1].children.every((button) => button.attributes["aria-pressed"] === "false")));
  chooseAnswers(context, bank[0], 4);
  elements.get("#exam-submit").click();
  assert.match(elements.get("#exam-result").textContent, /Aprobado con 4 de 5/);
  assert.equal(context.storage.get(examsKey), "[1]");
  assert.equal(elements.get("#starter-exam-progress").textContent, "Mini exámenes: 1 de 3 aprobados");
  elements.get("#exam-retry").click();
  chooseAnswers(context, bank[0], 0);
  elements.get("#exam-submit").click();
  assert.equal(context.storage.get(examsKey), "[1]", "reprobar un repaso no borra la aprobación");
  assert.match(elements.get("#exam-result").textContent, /aprobación anterior se conserva/);
  elements.get("#exam-close").click();
  assert.equal(elements.get("#level-exam").hidden, true);
  assert.equal(elements.get("#checkpoint-exam").focused, true);
  elements.get("#checkpoint-exam").click();
  elements.get("#checkpoint-next").click();
  assert.equal(elements.get("#starter-position").textContent, "Módulo 5 de 12");
  assert.equal(elements.get("#level-exam").hidden, true, "cambiar de nivel cierra el examen anterior");
  assert.equal(elements.get("#level-checkpoint").hidden, true);

  // No se obliga a repetir módulos ya terminados antes de introducir los exámenes.
  sharedStorage.set(completeKey, JSON.stringify(Array.from({ length: 12 }, (_, index) => index)));
  const legacy = createCourseContext(courseName, sharedStorage);
  assert.equal(legacy.elements.get("#starter-completed").textContent, "12 completados");
  assert.equal(legacy.elements.get("#starter-finish").hidden, true, "doce módulos sin exámenes no cierran la ruta");
  assert.ok(legacy.elements.get("#starter-level-tabs").children.every((button) => !button.disabled));
  for (let level = 0; level < 3; level += 1) {
    legacy.elements.get("#starter-level-tabs").children[level].click();
    legacy.elements.get("#checkpoint-exam").click();
    chooseAnswers(legacy, bank[level]);
    legacy.elements.get("#exam-submit").click();
    assert.equal(legacy.elements.get("#starter-finish").hidden, level < 2);
  }
  assert.equal(legacy.elements.get("#checkpoint-next").hidden, true);
  assert.match(legacy.elements.get("#exam-result").textContent, /Completaste la ruta/);
  const reload = createCourseContext(courseName, sharedStorage);
  assert.equal(reload.elements.get("#starter-finish").hidden, false, "módulos y exámenes sobreviven a recargar");
  assert.equal(reload.elements.get("#starter-exam-progress").textContent, "Mini exámenes: 3 de 3 aprobados");

  const sparse = createCourseContext(courseName, new Map([[completeKey, "[4,5,6,7,8,9,10,11]"]]));
  assert.equal(sparse.elements.get("#starter-completed").textContent, "8 completados");
  assert.deepEqual(sparse.elements.get("#starter-level-tabs").children.map((button) => button.disabled), [false, true, true]);
  solveModule(sparse, courseName, 0);
  assert.equal(JSON.parse(sparse.storage.get(completeKey)).length, 9, "los avances no consecutivos se conservan");
  const corrupt = createCourseContext(courseName, new Map([[completeKey, '[0,"1",-1,0.5,12,null]'], [examsKey, '{'] ]));
  assert.equal(corrupt.elements.get("#starter-completed").textContent, "1 completados");
  assert.equal(corrupt.elements.get("#starter-exam-progress").textContent, "Mini exámenes: 0 de 3 aprobados");

  const noStorage = createCourseContext(courseName, new Map(), true);
  for (let index = 0; index < 4; index += 1) {
    noStorage.elements.get("#starter-module-list").children[index].click();
    solveModule(noStorage, courseName, index);
  }
  noStorage.elements.get("#checkpoint-exam").click();
  chooseAnswers(noStorage, bank[0]);
  noStorage.elements.get("#exam-submit").click();
  assert.equal(noStorage.elements.get("#starter-exam-progress").textContent, "Mini exámenes: 1 de 3 aprobados");

  const stale = createCourseContext(courseName);
  stale.elements.get("#starter-code").value = SOLUTIONS[courseName][0];
  stale.elements.get("#starter-run").click();
  stale.elements.get("#starter-code").value = "";
  stale.elements.get("#starter-complete").click();
  assert.equal(stale.elements.get("#starter-completed").textContent, "0 completados", "no se completa con una validación de código distinto");
  for (const handler of stale.elements.get("#starter-code").listeners.input) handler();
  assert.equal(stale.elements.get("#starter-complete").disabled, true);
}
assert.equal(sharedStorage.size, 6, "cada ruta guarda módulos y exámenes sin sobrescribir las otras");
console.log(`HTML/CSS, JavaScript y SQL: ${examCount} mini exámenes, ${questionCount} preguntas; desbloqueo, reintentos, persistencia y cierre: OK`);

// Verifica también el marcado real: un doble de DOM por sí solo no detecta IDs o scripts faltantes.
const assetVersions = new Map();
for (const page of ["index.html", "python.html", "html-css.html", "javascript.html", "sql.html", "git.html", "apis.html"]) {
  const html = fs.readFileSync(new URL(`./${page}`, import.meta.url), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: no debe repetir IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|data:|#)/.test(ref)) continue;
    const file = ref.split(/[?#]/)[0];
    assert.ok(fs.existsSync(new URL(`./${file}`, import.meta.url)), `${page}: falta ${file}`);
    if (!/\.(js|css)$/.test(file)) continue;
    if (assetVersions.has(file)) assert.equal(assetVersions.get(file), ref, `${file}: versión consistente entre páginas`);
    assetVersions.set(file, ref);
  }
  if (!["html-css.html", "javascript.html", "sql.html", "git.html", "apis.html"].includes(page)) continue;
  for (const match of courseSource.matchAll(/document\.querySelector\("#([^"]+)"\)/g)) {
    assert.ok(ids.includes(match[1]), `${page}: falta #${match[1]}`);
  }
  assert.ok(html.indexOf('src="starter-exams.js') < html.indexOf('src="starter-course.js'), "las preguntas cargan antes del controlador");
  assert.match(html, /id="starter-preview"[^>]*sandbox=""/);
  assert.match(html, /publicHosts\.includes\(window\.location\.hostname\)/);
}
const css = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");
assert.match(css, /\.code-input\.starter-code-input\s*\{[^}]*display:\s*block;[^}]*grid-template-columns:\s*none;/, "se conserva el arreglo de ancho de los editores");
console.log("7 páginas: IDs, archivos, versiones, orden de carga y editor: OK");
