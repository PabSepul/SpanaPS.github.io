/* Ejercicios guiados: los controles construyen código de ejemplo.
   Los modelos calculan exclusivamente las opciones ofrecidas: no ejecutan
   código libre ni reemplazan Node.js, Python, React o TypeScript. */
(() => {
  "use strict";
  const courses = {};
  function field(name, label, initial, options, help) {
    return { name, label, initial, options, help };
  }
  function check(label, pass) { return { label, pass: Boolean(pass) }; }
  function valuesFor(lesson, candidate = {}) {
    return Object.fromEntries(lesson.fields.map((f) => [
      f.name,
      f.options.some(([key]) => key === candidate?.[f.name]) ? candidate[f.name] : f.initial
    ]));
  }
  globalThis.MiniCourses = { courses, field, check, valuesFor };
})();
