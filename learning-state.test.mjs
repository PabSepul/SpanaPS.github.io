import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const source = read('learning-state.js');
function setup(values = {}, blocked = false, full = false) {
  const storage = new Map(Object.entries(values));
  const context = vm.createContext({ localStorage: {
    getItem(key) { if (blocked) throw Error('blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blocked || full) throw Error('full'); storage.set(key, value); }
  }});
  vm.runInContext(source, context);
  return { state: context.LearningState, storage, context };
}
for (const id of ['python', 'html-css', 'javascript', 'sql', 'nodejs', 'datos-python', 'react', 'typescript']) {
  const {state, storage} = setup();
  assert.equal(state.progress(id).started, false);
  state.save(id, 1, 'borrador <seguro>');
  assert.equal(state.session(id).drafts[1], 'borrador <seguro>');
  assert.equal(state.resumeIndex(id), 1);
  assert.equal(state.progress(id).started, true);
  const restored = setup(Object.fromEntries(storage)).state;
  assert.equal(restored.resumeIndex(id), 1);
  assert.equal(restored.session(id).drafts[1], 'borrador <seguro>');
  restored.removeDraft(id, 1);
  assert.equal(restored.session(id).drafts[1], undefined);
  assert.equal(restored.session(id).active, 1);
}
for (const id of ['html-css', 'javascript', 'sql']) {
  const offset = 0;
  const completed = Array.from({length:12}, (_,i) => i + offset);
  const values = {
    [`codigo-cero.${id}-v2.completed`]: JSON.stringify([...completed, completed[0], -1, 99, '3']),
    [`codigo-cero.${id}-v2.exams`]: '[1,2,2,4,"3"]'
  };
  const {state, storage} = setup(values);
  assert.equal(state.progress(id).completed, 12);
  assert.equal(state.progress(id).exams, 2);
  assert.equal(state.progress(id).done, false);
  assert.equal(state.resumeIndex(id), 8, 'sin sesión, retoma el nivel del examen pendiente');
  storage.set(`codigo-cero.${id}-v2.exams`, '[1,2,3]');
  assert.equal(state.progress(id).done, true);
  storage.set(`codigo-cero.${id}-v2.completed`, JSON.stringify(completed.slice(0,4)));
  state.save(id, 10, 'no debe abrirse un nivel bloqueado');
  assert.equal(state.resumeIndex(id), 4);
  assert.equal(state.progress(id).exams, 1);
  assert.equal(storage.get(`codigo-cero.${id}-v2.exams`), '[1,2,3]', 'leer no migra ni destruye guardado');
}

{
  const todos = Array.from({length: 20}, (_, i) => i + 1);
  const values = {
    'codigo-cero.python-v2.completed': JSON.stringify([...todos.slice(0, 12), 1, 0, -1, 99, '3']),
    'codigo-cero.python-v2.exams': '[1,2,2,4,"3"]'
  };
  const {state, storage} = setup(values);
  assert.equal(state.progress('python').count, 20, 'Python tiene 20 proyectos');
  assert.equal(state.progress('python').completed, 12);
  assert.equal(state.progress('python').exams, 2, 'solo cuentan los exámenes de niveles terminados');
  assert.equal(state.progress('python').done, false);
  assert.equal(state.resumeIndex('python'), 12, 'con proyectos pendientes retoma el primero que falta');
  storage.set('codigo-cero.python-v2.completed', JSON.stringify(todos));
  storage.set('codigo-cero.python-v2.exams', '[1,2,3,4]');
  assert.equal(state.progress('python').completed, 20);
  assert.equal(state.progress('python').done, false, 'faltando el quinto examen la ruta sigue abierta');
  assert.equal(state.resumeIndex('python'), 16, 'sin proyectos pendientes retoma el nivel del examen que falta');
  storage.set('codigo-cero.python-v2.exams', '[1,2,3,4,5]');
  assert.equal(state.progress('python').exams, 5);
  assert.equal(state.progress('python').done, true, 'la ruta se cierra con 20 proyectos y 5 exámenes');
  assert.equal(state.progress('python').percent, 100);
}
const mini = setup({'codigo-cero.react-mini-v1':'{"completed":[0,0,2,99],"active":2}'}).state;
assert.equal(mini.progress('react').completed, 2);
assert.equal(mini.resumeIndex('react'), 2);
assert.equal(mini.progress('react').done, false);
for (const bad of ['{', 'null', '7', '"texto"', '[]']) {
  const s = setup({'codigo-cero.python.session-v1':bad, 'codigo-cero.python-v2.completed':bad}).state;
  assert.equal(s.resumeIndex('python'), 0);
  assert.equal(s.progress('python').completed, 0);
}
for (const [blocked, full] of [[true,false],[false,true]]) {
  const {state} = setup({'codigo-cero.sql.session-v1':'{"active":0,"drafts":{"0":"viejo"}}'}, blocked, full);
  state.save('sql', 0, 'nuevo');
  state.save('sql', 1, 'otro');
  assert.equal(state.session('sql').drafts[0], 'nuevo', 'escritura fallida no debe volver al dato viejo');
  assert.equal(state.session('sql').drafts[1], 'otro');
  assert.equal(state.storageAvailable(), false);
}
const invalid = setup().state;
invalid.save('python', 99, 'no');
invalid.save('python', 0, 'x'.repeat(30001));
assert.equal(invalid.session('python').drafts[0], undefined);
assert.equal(invalid.progress('no-existe'), null);

// Catálogo: DOM mínimo y estado real, sin ejecutar código en el navegador del usuario.
class Element {
  constructor() { this.textContent = ''; this.style = {}; this.hidden = true; this.children = new Map(); }
  querySelector(selector) { if (!this.children.has(selector)) this.children.set(selector, new Element()); return this.children.get(selector); }
}
const home = setup({'codigo-cero.python-v2.completed':'[1,2,3,4]', 'codigo-cero.python-v2.exams':'[1]'});
home.state.save('python', 4, 'edad = 20');
const root = new Element();
const events = {};
home.context.document = root;
home.context.window = {addEventListener(name, callback) { events[name] = callback; }};
vm.runInContext(read('catalog.js'), home.context);
assert.equal(root.querySelector('#continue-learning').hidden, false);
assert.match(root.querySelector('#continue-title').textContent, /Python/);
assert.match(root.querySelector('#continue-description').textContent, /Proyecto 5 de 20/);
assert.equal(root.querySelector('#continue-link').href, 'python.html#proyectos');
const pythonCard = root.querySelector('[data-learning-route="python"]');
assert.equal(pythonCard.querySelector('[data-route-progress]').textContent, '4/20 proyectos');
assert.match(pythonCard.querySelector('[data-route-detail]').textContent, /1\/5 exámenes/);
assert.equal(pythonCard.querySelector('[data-route-fill]').style.width, '20%');
home.storage.set('codigo-cero.python-v2.completed', JSON.stringify(Array.from({length:20},(_,i)=>i+1)));
home.storage.set('codigo-cero.python-v2.exams','[1,2,3,4,5]');
events.storage();
assert.equal(root.querySelector('#continue-learning').hidden, true);
assert.match(pythonCard.querySelector('[data-route-action]').textContent, /Repasar/);
assert.equal(typeof events.pageshow, 'function');

console.log('Continuidad: 8 rutas, compatibilidad del progreso, borradores, reanudación, exámenes, datos corruptos, cuota y catálogo: OK');
