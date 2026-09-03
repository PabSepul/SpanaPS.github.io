import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./python.js", import.meta.url), "utf8");

class FakeElement {
  constructor(tag = "div") {
    this.tag = tag;
    this.attributes = {};
    this.children = [];
    this.classList = { add() {}, remove() {}, toggle() {}, contains: () => false };
    this.dataset = {};
    this.disabled = false;
    this.hidden = false;
    this.listeners = {};
    this.style = {};
    this.textContent = "";
    this.value = "";
  }

  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  focus() {}
  scrollIntoView() {}
  click() { for (const callback of this.listeners.click || []) callback(); }
  set innerHTML(value) { this._innerHTML = value; if (value === "") this.children = []; }
  get innerHTML() { return this._innerHTML || ""; }
}

function createContext() {
  const elements = new Map();
  const document = {
    createElement: (tag) => new FakeElement(tag),
    querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, new FakeElement(selector));
      return elements.get(selector);
    },
    querySelectorAll: () => []
  };
  const storage = new Map();
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value)
  };
  const sandbox = { document, localStorage };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  const run = (expression) => vm.runInContext(expression, sandbox);
  const runJson = (expression) => JSON.parse(vm.runInContext("JSON.stringify(" + expression + ")", sandbox));
  return { elements, storage, run, runJson };
}

/* 1. Los datos de los tres exámenes están completos y son coherentes. */

const data = createContext();
const exams = data.runJson("LEVEL_EXAMS");
const levels = data.runJson("COURSE_LEVELS.map((level) => ({ id: level.id, stage: level.stage, title: level.completionTitle, projects: level.projects.length }))");

assert.equal(levels.length, 3, "Python debe tener 3 niveles");
assert.deepEqual(levels.map((level) => level.projects), [4, 4, 4], "cada nivel debe tener 4 proyectos");
assert.deepEqual(
  levels.map((level) => level.stage),
  ["Conceptos básicos", "Conceptos avanzados", "Conceptos expertos"],
  "cada nivel debe declarar su etapa"
);
for (const level of levels) {
  assert.match(level.title, /^Finalizaste los conceptos .+ de Python\.$/, `nivel ${level.id} necesita mensaje de cierre`);
}

assert.equal(exams.length, 3, "debe existir un examen por nivel");
for (const exam of exams) {
  assert.equal(exam.questions.length, 5, `el examen ${exam.levelId} debe tener 5 preguntas`);
  assert.ok(exam.passing > 0 && exam.passing <= exam.questions.length, `umbral inválido en el examen ${exam.levelId}`);
  for (const [index, question] of exam.questions.entries()) {
    const position = `examen ${exam.levelId}, pregunta ${index + 1}`;
    assert.equal(question.options.length, 4, `${position} debe ofrecer 4 alternativas`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${position} tiene respuesta fuera de rango`);
    assert.equal(new Set(question.options).size, 4, `${position} repite alternativas`);
    assert.ok(question.explanation.length > 20, `${position} necesita una explicación`);
  }
}

/* 2. Los niveles se desbloquean al terminar el nivel anterior. */

const gate = createContext();
assert.equal(gate.run("isLevelUnlocked(1)"), true, "el nivel 1 siempre está disponible");
assert.equal(gate.run("isLevelUnlocked(2)"), false, "el nivel 2 comienza bloqueado");
assert.equal(gate.run("isLevelUnlocked(3)"), false, "el nivel 3 comienza bloqueado");
assert.equal(gate.run("isExamUnlocked(1)"), false, "el examen 1 comienza bloqueado");
assert.equal(gate.elements.get("#level-checkpoint").hidden, true, "el punto de control comienza oculto");

gate.run("[1, 2, 3].forEach((id) => completedProjects.add(id)); renderLevelTabs(); renderProject();");
assert.equal(gate.run("isLevelUnlocked(2)"), false, "3 de 4 proyectos no desbloquean el nivel siguiente");
assert.equal(gate.elements.get("#level-checkpoint").hidden, true, "el punto de control sigue oculto sin terminar el nivel");

gate.run("completedProjects.add(4); renderLevelTabs(); renderProject();");
assert.equal(gate.run("isLevelUnlocked(2)"), true, "terminar los 4 proyectos desbloquea el nivel 2");
assert.equal(gate.run("isExamUnlocked(1)"), true, "terminar los 4 proyectos desbloquea el examen");
assert.equal(gate.run("isLevelUnlocked(3)"), false, "el nivel 3 sigue bloqueado");
assert.equal(gate.elements.get("#level-checkpoint").hidden, false, "el punto de control aparece al terminar el nivel");
assert.equal(gate.elements.get("#checkpoint-title").textContent, "Finalizaste los conceptos básicos de Python.");
assert.match(gate.elements.get("#checkpoint-kicker").textContent, /^Punto de control · Conceptos básicos$/);
assert.match(gate.elements.get("#checkpoint-next").textContent, /conceptos avanzados/);
assert.equal(gate.elements.get("#checkpoint-next").hidden, false, "debe ofrecer continuar al nivel siguiente");

/* 3. La navegación no cruza hacia un nivel bloqueado. */

const walk = createContext();
walk.run("activateProject(5);");
assert.equal(walk.run("activeProjectId"), 1, "no se puede saltar a un proyecto de un nivel bloqueado");
walk.run("activateProject(2);");
assert.equal(walk.run("activeProjectId"), 2, "sí se navega dentro del nivel disponible");
walk.run("activateProject(4);");
assert.equal(walk.elements.get("#course-next").disabled, true, "el botón siguiente se bloquea al final del nivel");
walk.run("activateLevel(2);");
assert.equal(walk.run("activeLevelId"), 1, "no se puede activar un nivel bloqueado");

/* 4. El examen aprueba, guarda el avance y permite reintentar. */

const exam = createContext();
exam.run("[1, 2, 3, 4].forEach((id) => completedProjects.add(id)); renderLevelTabs(); renderProject();");
exam.run("openExam(1);");
assert.equal(exam.elements.get("#level-exam").hidden, false, "el examen se abre al rendirlo");
assert.equal(exam.elements.get("#exam-questions").children.length, 5, "el examen muestra sus 5 preguntas");
assert.match(exam.elements.get("#exam-title").textContent, /conceptos básicos/i);

exam.run("submitExam();");
assert.match(exam.elements.get("#exam-result").textContent, /Responde las 5 preguntas/, "no debe evaluarse incompleto");
assert.equal(exam.run("approvedExams.has(1)"), false, "un examen sin responder no aprueba");

exam.run("LEVEL_EXAMS[0].questions.forEach((question, index) => examAnswers.set(index, (question.answer + 1) % 4)); submitExam();");
assert.equal(exam.run("approvedExams.has(1)"), false, "cinco respuestas erróneas no aprueban");
assert.match(exam.elements.get("#exam-result").textContent, /necesitas 4/i, "debe indicar el umbral");
assert.equal(exam.elements.get("#exam-retry").hidden, false, "debe ofrecer reintentar");

exam.run("retryExam();");
assert.equal(exam.run("examAnswers.size"), 0, "reintentar limpia las respuestas");
assert.equal(exam.elements.get("#exam-submit").hidden, false, "reintentar vuelve a mostrar el botón de revisión");

exam.run("LEVEL_EXAMS[0].questions.forEach((question, index) => examAnswers.set(index, question.answer)); submitExam();");
assert.equal(exam.run("approvedExams.has(1)"), true, "responder bien aprueba el examen");
assert.match(exam.elements.get("#exam-result").textContent, /Aprobado con 5 de 5/);
assert.match(exam.elements.get("#exam-result").textContent, /conceptos avanzados/, "debe invitar al nivel siguiente");
assert.equal(exam.storage.get("codigo-cero.python-v2.exams"), "[1]", "el examen aprobado queda guardado");

/* 5. Una sola respuesta errónea todavía aprueba, dos no. */

const grade = createContext();
const almost = grade.runJson(
  "gradeExam(2, new Map(LEVEL_EXAMS[1].questions.map((question, index) => [index, index === 0 ? (question.answer + 1) % 4 : question.answer])))"
);
assert.equal(almost.correct, 4);
assert.equal(almost.passed, true, "4 de 5 aprueba");

const failed = grade.runJson(
  "gradeExam(2, new Map(LEVEL_EXAMS[1].questions.map((question, index) => [index, index < 2 ? (question.answer + 1) % 4 : question.answer])))"
);
assert.equal(failed.correct, 3);
assert.equal(failed.passed, false, "3 de 5 no aprueba");

/* 6. La ruta se cierra solo con los doce proyectos y los tres exámenes. */

const finish = createContext();
finish.run("for (let id = 1; id <= 12; id += 1) completedProjects.add(id); renderProgress();");
assert.equal(finish.elements.get("#course-finish").hidden, true, "sin exámenes la ruta no se cierra");
assert.equal(finish.elements.get("#route-progress-text").textContent, "12 de 12");

finish.run("approvedExams.add(1); approvedExams.add(2); renderProgress();");
assert.equal(finish.elements.get("#course-finish").hidden, true, "faltando un examen la ruta no se cierra");

finish.run("approvedExams.add(3); renderProgress();");
assert.equal(finish.elements.get("#course-finish").hidden, false, "con todo aprobado la ruta se cierra");

console.log("Python: 3 puntos de control, 15 preguntas y 6 escenarios de desbloqueo: OK");
