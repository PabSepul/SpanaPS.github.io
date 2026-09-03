(() => {
  "use strict";
  const { courses, valuesFor } = globalThis.MiniCourses;
  const id = document.body.dataset.miniCourse;
  const course = courses[id];
  if (!course) return;
  const $ = (name) => document.getElementById("mini-" + name);
  const key = "codigo-cero." + id + "-mini-v1";
  let persistent = true;
  let saved = {};
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    if (raw && typeof raw === "object" && !Array.isArray(raw)) saved = raw;
  } catch { persistent = false; }
  const completed = new Set((Array.isArray(saved.completed) ? saved.completed : []).filter((i) => Number.isInteger(i) && i >= 0 && i < course.lessons.length));
  const drafts = course.lessons.map((lesson, index) => valuesFor(lesson, saved.drafts?.[index]));
  const hints = course.lessons.map(() => 0);
  let active = Number.isInteger(saved.active) && saved.active >= 0 && saved.active < course.lessons.length ? saved.active : 0;
  let validated = null;
  let controls = [];

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ completed: [...completed], drafts, active })); persistent = true; }
    catch { persistent = false; }
    globalThis.LearningState?.save(id, active);
    storageNotice();
  }

  function storageNotice() {
    $("storage").textContent = persistent
      ? "Tus elecciones y tu progreso se guardan solo en este navegador. No hay cuenta ni sincronización."
      : "El guardado local no está disponible o no se pudo leer. Puedes practicar; este avance podría perderse al cerrar la página.";
  }

  function currentValues() {
    return valuesFor(course.lessons[active], Object.fromEntries(controls.map(({ name, element }) => [name, element.value])));
  }

  function renderProgress() {
    $("progress").textContent = completed.size + " de " + course.lessons.length + " mini proyectos completados";
    $("progressbar").setAttribute("aria-valuenow", String(completed.size));
    $("progress-fill").style.width = (completed.size / course.lessons.length * 100) + "%";
    $("finish").hidden = completed.size !== course.lessons.length;
    $("previous").disabled = active === 0;
    $("next").disabled = active === course.lessons.length - 1;
    $("position").textContent = "Proyecto " + (active + 1) + " de " + course.lessons.length;
    const buttons = course.lessons.map((lesson, index) => {
      const button = node("button", undefined, "mini-module");
      button.type = "button";
      if (index === active) button.setAttribute("aria-current", "step");
      button.setAttribute("aria-controls", "mini-workspace");
      button.append(node("span", String(index + 1).padStart(2, "0")), node("strong", lesson.title), node("small", completed.has(index) ? "✓ Completado · repasar" : lesson.duration + " · práctica guiada"));
      button.addEventListener("click", () => selectLesson(index, true));
      return button;
    });
    $("modules").replaceChildren(...buttons);
  }

  function renderChecks(checks, reviewed) {
    $("checks").replaceChildren(...checks.map((item) => {
      const li = node("li", undefined, reviewed ? (item.pass ? "validation-passed" : "validation-failed") : "");
      const symbol = node("span", reviewed ? (item.pass ? "✓" : "×") : "·");
      symbol.setAttribute("aria-hidden", "true");
      li.append(symbol, node("span", (reviewed ? (item.pass ? "Correcto: " : "Revisar: ") : "") + item.label));
      return li;
    }));
  }

  function invalidate() {
    validated = null;
    $("complete").disabled = true;
    $("complete").textContent = completed.has(active) ? "Proyecto ya completado" : "Completar proyecto";
    $("feedback").textContent = "Selecciona las opciones y pulsa «Probar y comprobar».";
    $("output").textContent = "El resultado de tus elecciones aparecerá aquí.";
    $("visual").replaceChildren();
    $("visual-panel").hidden = true;
    $("copy-status").textContent = "";
    renderChecks(course.lessons[active].run(drafts[active]).checks, false);
  }

  function renderHints() {
    const lesson = course.lessons[active];
    $("hints").replaceChildren(...lesson.hints.slice(0, hints[active]).map((text) => node("li", text)));
    $("hint").disabled = hints[active] >= lesson.hints.length;
    $("hint").textContent = hints[active] >= lesson.hints.length ? "Todas las pistas visibles" : "Ver pista " + (hints[active] + 1);
  }

  function renderVisual(result) {
    $("visual").replaceChildren();
    $("visual-panel").hidden = !result.preview && !result.table;
    if (result.table) {
      const table = node("table");
      table.append(node("caption", "Importes calculados con tus opciones"));
      const head = node("thead");
      const header = node("tr");
      result.table.columns.forEach((title) => {
        const th = node("th", title); th.scope = "col"; header.append(th);
      });
      head.append(header);
      const body = node("tbody");
      result.table.rows.forEach((row) => {
        const tr = node("tr");
        row.forEach((value) => tr.append(node("td", String(value))));
        body.append(tr);
      });
      table.append(head, body);
      $("visual").append(table);
    }
    const model = result.preview;
    if (!model) return;
    if (model.kind === "greeting") {
      $("visual").append(node(model.tag === "h1" ? "h3" : "p", model.text), node("p", "Tu primer componente."));
    } else if (model.kind === "cards") {
      const cards = node("div", undefined, "mini-demo-cards");
      model.titles.forEach((title) => {
        const card = node("article");
        card.append(node("h3", title || "(sin título)"));
        cards.append(card);
      });
      $("visual").append(cards);
    } else if (model.kind === "counter") {
      let count = model.initial;
      const button = node("button", "Clics: " + count, "button button-primary");
      button.type = "button";
      button.addEventListener("click", () => {
        count += model.delta;
        button.textContent = "Clics: " + count;
      });
      const reset = node("button", "Reiniciar contador", "mini-text-button");
      reset.type = "button";
      reset.addEventListener("click", () => { count = model.initial; button.textContent = "Clics: " + count; });
      $("visual").append(button, reset, node("p", "Modelo didáctico del estado. No se está ejecutando React en esta vista."));
    }
  }

  function selectLesson(index, focus = false) {
    if (!Number.isInteger(index) || index < 0 || index >= course.lessons.length) return;
    active = index;
    const lesson = course.lessons[active];
    $("kicker").textContent = course.name + " · Mini proyecto " + (active + 1) + " · " + lesson.duration;
    $("title").textContent = lesson.title;
    $("intro").textContent = lesson.intro;
    $("concepts").replaceChildren(...lesson.concepts.map(([title, copy]) => {
      const div = node("div"); div.append(node("dt", title), node("dd", copy)); return div;
    }));
    $("steps").replaceChildren(...lesson.steps.map((text) => node("li", text)));
    $("fixture").textContent = lesson.fixture;
    $("goal").textContent = lesson.goal;
    $("expected").textContent = lesson.expected;
    $("mistake").textContent = lesson.mistake;
    $("question").textContent = lesson.reflection[0];
    $("answer").textContent = lesson.reflection[1];
    $("reflection").open = false;
    $("file").textContent = lesson.file;
    controls = [];
    $("fields").replaceChildren(...lesson.fields.map((field) => {
      const wrapper = node("div", undefined, "mini-field");
      const select = node("select");
      select.id = "mini-field-" + field.name;
      select.name = field.name;
      const label = node("label", field.label);
      label.htmlFor = select.id;
      const help = node("small", field.help);
      help.id = select.id + "-help";
      select.setAttribute("aria-describedby", help.id);
      field.options.forEach(([value, label]) => {
        const option = node("option", label); option.value = value; select.append(option);
      });
      select.value = drafts[active][field.name];
      controls.push({ name: field.name, element: select });
      select.addEventListener("change", () => {
        drafts[active] = currentValues();
        $("code").value = lesson.code(drafts[active]);
        invalidate();
        persist();
      });
      wrapper.append(label, select, help);
      return wrapper;
    }));
    $("code").value = lesson.code(drafts[active]);
    renderProgress();
    renderHints();
    invalidate();
    if (focus) { persist(); $("title").focus(); }
  }

  $("run").addEventListener("click", () => {
    drafts[active] = currentValues();
    const lesson = course.lessons[active];
    $("code").value = lesson.code(drafts[active]);
    const result = lesson.run(drafts[active]);
    const passed = result.checks.every((item) => item.pass);
    validated = passed ? JSON.stringify(drafts[active]) : null;
    $("output").textContent = result.output;
    renderChecks(result.checks, true);
    renderVisual(result);
    $("complete").disabled = !passed || completed.has(active);
    $("feedback").textContent = passed
      ? (completed.has(active) ? "¡Buen repaso! Este proyecto ya está completado." : "¡Las tres comprobaciones están correctas! Ya puedes completar el proyecto.")
      : "Todavía hay decisiones por revisar. Compara con el resultado esperado o abre una pista.";
    persist();
  });
  $("complete").addEventListener("click", () => {
    if ($("complete").disabled || validated !== JSON.stringify(currentValues())) return;
    completed.add(active);
    persist();
    renderProgress();
    $("complete").disabled = true;
    $("complete").textContent = "Proyecto completado";
    $("feedback").textContent = completed.size === course.lessons.length
      ? "¡Completaste los tres mini proyectos! Ya puedes seguir con la documentación o repasar."
      : "Proyecto completado. Usa «Siguiente» para continuar o elige otro proyecto.";
  });
  $("hint").addEventListener("click", () => { hints[active] = Math.min(hints[active] + 1, course.lessons[active].hints.length); renderHints(); });
  $("reset").addEventListener("click", () => {
    drafts[active] = valuesFor(course.lessons[active]);
    hints[active] = 0;
    selectLesson(active);
    persist();
    $("feedback").textContent = "Opciones restablecidas. Tus proyectos completados se conservan.";
  });
  $("previous").addEventListener("click", () => selectLesson(active - 1, true));
  $("next").addEventListener("click", () => selectLesson(active + 1, true));
  $("copy").addEventListener("click", async () => {
    const lessonIndex = active;
    const code = $("code").value;
    try {
      await navigator.clipboard.writeText(code);
      if (active === lessonIndex && $("code").value === code) $("copy-status").textContent = "Código copiado. Revisa las instrucciones para ejecutarlo fuera de aquí.";
    } catch {
      if (active === lessonIndex && $("code").value === code) {
        $("code").focus(); $("code").select();
        $("copy-status").textContent = "El navegador no permitió copiar automáticamente. El código está seleccionado: usa Ctrl+C o ⌘C.";
      }
    }
  });
  $("prerequisite").textContent = course.prerequisite[0];
  $("prerequisite").href = course.prerequisite[1];
  $("scope").textContent = course.scope;
  $("continuation").textContent = course.next;
  $("source").textContent = course.source[0];
  $("source").href = course.source[1];
  $("practice").hidden = false;
  $("loading-note").hidden = true;
  storageNotice();
  selectLesson(active);
})();
