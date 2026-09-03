import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { spawnSync } from "node:child_process";

const ids = ["nodejs", "datos-python", "react", "typescript"];
const read = (name) => fs.readFileSync(new URL(name, import.meta.url), "utf8");
const content = ["mini-courses.js", ...ids.map((id) => id + "-course.js")].map(read);
const ui = read("mini-course.js");
const copy = (value) => JSON.parse(JSON.stringify(value));
const pure = vm.createContext({});
content.forEach((source) => vm.runInContext(source, pure));
const { courses, valuesFor } = pure.MiniCourses;

function combinations(fields, candidate = {}, at = 0) {
  if (at === fields.length) return [candidate];
  return fields[at].options.flatMap(([value]) => combinations(fields, { ...candidate, [fields[at].name]: value }, at + 1));
}

let count = 0;
for (const id of ids) {
  assert.equal(courses[id].lessons.length, 3);
  for (const lesson of courses[id].lessons) {
    assert.equal(lesson.fields.length, 3);
    assert.equal(lesson.hints.length, 3);
    assert.equal(lesson.steps.length, 3);
    assert.equal(lesson.concepts.length, 3);
    assert.equal(lesson.reflection.length, 2);
    assert.equal(lesson.run(valuesFor(lesson)).checks.every((c) => c.pass), false);
    assert.equal(lesson.run(lesson.solution).checks.every((c) => c.pass), true);
    assert.equal(lesson.run(lesson.solution).output, lesson.expected);
    const cases = combinations(lesson.fields);
    assert.equal(cases.filter((v) => lesson.run(v).checks.every((c) => c.pass)).length, 1, lesson.title + ": solo la combinación correcta aprueba");
    for (const candidate of cases) {
      const original = JSON.stringify(candidate);
      const result = lesson.run(candidate);
      assert.equal(result.checks.length, 3);
      assert.ok(result.output.length > 0);
      assert.ok(lesson.code(candidate).length > 30);
      assert.equal(JSON.stringify(candidate), original, "el modelo no muta los valores");
      count++;
    }
    const untrusted = Object.fromEntries(lesson.fields.map((field) => [field.name, "<script>bad()</script>"]));
    assert.deepEqual(copy(valuesFor(lesson, untrusted)), copy(valuesFor(lesson)), "ignora opciones guardadas no admitidas");
    assert.deepEqual(copy(valuesFor(lesson, null)), copy(valuesFor(lesson)));
  }
}

// Los modelos Node deben coincidir con ejecutar los fragmentos generados.
// VM solo ejecuta nuestras plantillas cerradas. fs y HTTP son dobles en memoria:
// este test no lee archivos de estudiantes ni abre un puerto.
for (let i = 0; i < 3; i++) {
  const lesson = courses.nodejs.lessons[i];
  for (const values of combinations(lesson.fields)) {
    const output = [];
    let handler;
    let listening = false;
    const context = {
      process: { argv: ["/runtime/node", "/curso/tiempo.cjs", "90"] },
      console: { log: (...args) => output.push(args.join(" ")) },
      require(name) {
        if (name === "node:fs") return { readFileSync(file, encoding) {
          assert.equal(encoding, "utf8");
          if (file !== "cursos.json") throw new Error("Archivo inexistente");
          return '[{"id":1,"nombre":"Python","horas":12},{"id":2,"nombre":"SQL","horas":5}]';
        } };
        if (name === "node:http") return { createServer(callback) {
          handler = callback;
          return { listen(port, host) { assert.equal(port, 3000); assert.equal(host, "127.0.0.1"); listening = true; } };
        } };
        throw new Error("Módulo no permitido en esta prueba");
      }
    };
    let error;
    try { vm.runInNewContext(lesson.code(values), context, { timeout: 100 }); } catch (caught) { error = caught; }
    const result = lesson.run(values);
    if (i === 1 && (values.file !== "cursos.json" || values.parse !== "JSON.parse")) {
      assert.ok(error);
      assert.match(result.output, /Error/);
    } else {
      assert.equal(error, undefined);
      if (i < 2) assert.equal(output.join("\n"), result.output);
    }
    if (i === 2) {
      assert.equal(listening, true);
      const results = ["/saludo", "/no-existe"].map((url) => {
        let body = ""; let ended = false;
        const res = { statusCode: 200, setHeader() {}, write(text) { body += text; }, end(text) { body += text; ended = true; } };
        handler({ url }, res);
        return "GET " + url + " → " + res.statusCode + " · " + body + (ended ? "" : " · respuesta sin finalizar");
      });
      assert.equal(result.output, results.join("\n"));
    }
  }
}

// Comprueba las 24 combinaciones de datos con CPython si está disponible.
// PYTHON permite usar un intérprete diferente sin modificar la prueba.
const bundledPython = "C:/Users/l3_pa/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const python = process.env.PYTHON || (fs.existsSync(bundledPython) ? bundledPython : "python");
const pythonCases = courses["datos-python"].lessons.flatMap((lesson) => combinations(lesson.fields).map((values) => ({ code: lesson.code(values), output: lesson.run(values).output })));
const pythonTest = spawnSync(python, ["-X", "utf8", "-c", "import sys,json,io,contextlib\ncases=json.load(sys.stdin)\nresults=[]\nfor case in cases:\n    output=io.StringIO()\n    with contextlib.redirect_stdout(output):\n        exec(case['code'], {})\n    results.append(output.getvalue().strip())\nprint(json.dumps(results,ensure_ascii=True))"], { input: JSON.stringify(pythonCases), encoding: "utf8", timeout: 15000 });
if (pythonTest.error?.code === "ENOENT") {
  console.log("CPython no disponible: se omite la comparación nativa (modelos y UI sí se prueban).");
} else {
  assert.equal(pythonTest.status, 0, pythonTest.stderr);
  const results = JSON.parse(pythonTest.stdout);
  results.forEach((output, i) => assert.equal(output, pythonCases[i].output, "CPython: caso " + i));
  console.log("Datos: 24 combinaciones coinciden con Python 3 real.");
}

class Element {
  constructor(registry, tag = "div") {
    this.registry = registry; this.tagName = tag; this.children = []; this.attributes = {};
    this.listeners = {}; this.style = {}; this.textContent = ""; this.value = "";
    this.disabled = false; this.hidden = false; this.open = false;
  }
  set id(value) { this._id = value; this.registry.set(value, this); }
  get id() { return this._id; }
  set innerHTML(_) { throw new Error("No se permite HTML dinámico en los mini cursos."); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  addEventListener(event, listener) { (this.listeners[event] ||= []).push(listener); }
  setAttribute(name, value) { this.attributes[name] = value; }
  fire(event) { return Promise.all((this.listeners[event] || []).map((listener) => listener())); }
  click() { if (!this.disabled) return this.fire("click"); }
  focus() { this.focused = true; }
  select() { this.selected = true; }
}

function setup(id, storage = new Map(), blocked = false, clipboardBlocked = false) {
  const elements = new Map();
  const html = read(id + ".html");
  const matches = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(matches).size, matches.length, id + ": IDs duplicados");
  for (const key of matches) { const el = new Element(elements); el.id = key; }
  const document = {
    body: { dataset: { miniCourse: id } },
    getElementById(name) { assert.ok(elements.has(name), "Falta #" + name); return elements.get(name); },
    createElement: (tag) => new Element(elements, tag)
  };
  let copied = null;
  const context = vm.createContext({
    document,
    localStorage: {
      getItem(key) { if (blocked) throw new Error("bloqueado"); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error("bloqueado"); storage.set(key, value); }
    },
    navigator: { clipboard: { writeText(value) { if (clipboardBlocked) return Promise.reject(new Error("bloqueado")); copied = value; return Promise.resolve(); } } }
  });
  content.forEach((source) => vm.runInContext(source, context));
  vm.runInContext(ui, context);
  return { get: (name) => elements.get("mini-" + name), elements, storage, context, copied: () => copied };
}

function choose(app, values) {
  for (const [name, value] of Object.entries(values)) {
    const field = app.get("field-" + name);
    field.value = value; field.fire("change");
  }
}

const storage = new Map([["codigo-cero.python-v2.completed", "[1,2,3]"], ["codigo-cero.theme", "dark"]]);
for (const id of ids) {
  const app = setup(id, storage);
  assert.equal(app.get("practice").hidden, false);
  assert.equal(app.get("modules").children.length, 3);
  assert.equal(app.get("previous").disabled, true);
  assert.equal(app.get("finish").hidden, true);
  assert.equal(app.get("complete").disabled, true);
  for (let i = 0; i < 3; i++) {
    const lesson = courses[id].lessons[i];
    if (i) app.get("next").click();
    assert.equal(app.get("title").textContent, lesson.title);
    assert.equal(app.get("modules").children[i].attributes["aria-current"], "step");
    app.get("run").click();
    assert.equal(app.get("complete").disabled, true, "inicio incompleto");
    app.get("hint").click();
    assert.equal(app.get("hints").children.length, 1);
    app.get("hint").click(); app.get("hint").click(); app.get("hint").click();
    assert.equal(app.get("hints").children.length, 3);
    assert.equal(app.get("hint").disabled, true);
    choose(app, lesson.solution);
    assert.equal(app.get("complete").disabled, true, "elegir no equivale a comprobar");
    assert.equal(app.get("code").value, lesson.code(lesson.solution));
    app.get("run").click();
    assert.equal(app.get("output").textContent, lesson.expected);
    assert.equal(app.get("complete").disabled, false);
    assert.ok(app.get("checks").children.every((node) => node.className === "validation-passed"));
    await app.get("copy").click();
    assert.equal(app.copied(), lesson.code(lesson.solution));
    const first = lesson.fields[0];
    // Un cambio de valor sin evento tampoco puede aprovechar una aprobación vieja.
    app.get("field-" + first.name).value = first.initial;
    app.get("complete").click();
    assert.equal(JSON.parse(storage.get("codigo-cero." + id + "-mini-v1")).completed.length, i);
    app.get("field-" + first.name).fire("change");
    assert.equal(app.get("complete").disabled, true);
    assert.equal(app.get("visual-panel").hidden, true);
    choose(app, lesson.solution);
    app.get("run").click();
    if (id === "react" && i === 2) {
      const [button, reset] = app.get("visual").children;
      button.click(); button.click(); button.click();
      assert.equal(button.textContent, "Clics: 3");
      reset.click(); assert.equal(button.textContent, "Clics: 0");
    }
    if (id === "datos-python" && i === 2) assert.equal(app.get("visual").children[0].children[2].children.length, 3);
    app.get("complete").click();
    assert.equal(app.get("progress").textContent, (i + 1) + " de 3 mini proyectos completados");
    assert.equal(app.get("complete").disabled, true);
    assert.equal(app.get("finish").hidden, i !== 2);
  }
  assert.equal(app.get("next").disabled, true);
  assert.equal(app.get("progressbar").attributes["aria-valuenow"], "3");
  const resumed = setup(id, storage);
  assert.equal(resumed.get("finish").hidden, false);
  assert.equal(resumed.get("title").textContent, courses[id].lessons[2].title);
  assert.equal(resumed.get("code").value, courses[id].lessons[2].code(courses[id].lessons[2].solution));
  resumed.get("reset").click();
  assert.equal(resumed.get("finish").hidden, false, "restablecer opciones no elimina progreso");
  resumed.get("previous").click();
  assert.equal(resumed.get("code").value, courses[id].lessons[1].code(courses[id].lessons[1].solution), "conserva elecciones entre módulos");
  resumed.get("modules").children[0].click();
  assert.equal(resumed.get("title").textContent, courses[id].lessons[0].title);
  assert.equal(resumed.get("title").focused, true);
}
assert.equal(storage.get("codigo-cero.python-v2.completed"), "[1,2,3]");
assert.equal(storage.get("codigo-cero.theme"), "dark");
assert.equal(storage.size, 6, "cuatro claves nuevas aisladas");

const invalidStates = [
  "not json", "null", "[]", '{"completed":[0,0,8,-1,"1",null],"active":99,"drafts":[{"index":"malicious"}]}'
];
for (const saved of invalidStates) {
  const app = setup("nodejs", new Map([["codigo-cero.nodejs-mini-v1", saved]]));
  assert.equal(app.get("title").textContent, courses.nodejs.lessons[0].title);
  assert.equal(app.get("finish").hidden, true);
  app.get("run").click();
  assert.equal(app.get("complete").disabled, true);
}
const blocked = setup("typescript", new Map(), true, true);
assert.match(blocked.get("storage").textContent, /no está disponible/);
choose(blocked, courses.typescript.lessons[0].solution);
blocked.get("run").click(); blocked.get("complete").click();
assert.match(blocked.get("progress").textContent, /^1 de/);
await blocked.get("copy").click();
assert.equal(blocked.get("code").selected, true);
assert.match(blocked.get("copy-status").textContent, /Ctrl\+C/);
assert.equal(setup("typescript").get("progress").textContent, "0 de 3 mini proyectos completados", "un navegador nuevo no hereda avances");

// Contratos del HTML, orden de scripts, versiones, enlaces y mantenimiento.
const home = read("index.html");
const allPages = ["index", "python", "html-css", "javascript", "sql", ...ids];
const versionByAsset = new Map();
for (const name of allPages) {
  const html = read(name + ".html");
  for (const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:\?v=([^"]+))?"/g)) {
    const [, file, version] = match;
    if (/^https?:/.test(file)) continue;
    assert.ok(fs.existsSync(new URL(file, import.meta.url)), name + ": archivo inexistente " + file);
    if (version) {
      if (versionByAsset.has(file)) assert.equal(version, versionByAsset.get(file), "versión inconsistente: " + file);
      versionByAsset.set(file, version);
    }
  }
  if (!ids.includes(name)) continue;
  assert.match(home, new RegExp('href="' + name + '\\.html"'));
  assert.match(html, /readonly spellcheck="false" wrap="off"/);
  assert.match(html, /no es un editor de código libre/i);
  assert.ok(html.indexOf('src="mini-courses.js') < html.indexOf('src="' + name + '-course.js'));
  assert.ok(html.indexOf('src="' + name + '-course.js') < html.indexOf('src="mini-course.js'));
  const boot = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const hostname of ["localhost", "intenta.cl", "www.intenta.cl"]) {
    for (const search of ["", "?maintenance"]) {
      const classes = []; const root = { classList: { add: (name) => classes.push(name), remove: (name) => { const i = classes.indexOf(name); if (i >= 0) classes.splice(i, 1); } }, dataset: {} };
      const document = { documentElement: root, head: { append() {} }, createElement: () => ({}) };
      vm.runInNewContext(boot, { document, window: { location: { hostname, search }, matchMedia: () => ({ matches: false }) }, URLSearchParams, localStorage: { getItem: () => "dark" } });
      assert.equal(classes.includes("is-maintenance"), hostname !== "localhost" || Boolean(search));
      assert.equal(root.dataset.theme, "dark");
    }
  }
}
assert.match(read("mini-course.css"), /\.mini-page \.mini-code\s*\{[^}]*display: block;[^}]*width: 100%;[^}]*min-width: 0;/);
assert.match(read("mini-course.css"), /@media \(max-width: 600px\)/);
assert.doesNotMatch(ui, /\.innerHTML|eval\(|new Function/);
console.log("4 mini cursos, 12 proyectos, 36 comprobaciones y " + count + " combinaciones: OK");
console.log("Node: código contrastado; UI: progreso, borradores, pistas, copia, contador, guardado bloqueado y aislamiento: OK");
console.log("9 páginas: enlaces, versiones, editor ancho, tema y mantenimiento: OK");
