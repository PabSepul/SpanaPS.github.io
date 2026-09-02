const PROGRESS_KEY = "codigo-cero.python-projects.completed";

const PROJECT_DEFAULTS = {
  1: 'print("Estoy aprendiendo Python")',
  2: 'nombre = "Ada"\nedad = 28\nprint(f"Soy {nombre} y tengo {edad} años")',
  3: 'minutos = 135\nhoras = minutos // 60\nresto = minutos % 60\nprint(f"{horas} h y {resto} min")',
};

const heroCode = document.querySelector("#hero-code");
const heroRun = document.querySelector("#hero-run");
const heroOutput = document.querySelector("#hero-output");
const projectTabs = [...document.querySelectorAll("[data-project-tab]")];
const projectPanels = [...document.querySelectorAll("[data-project-panel]")];
const projectTargetButtons = [...document.querySelectorAll("[data-project-target]")];
const previousProject = document.querySelector("#previous-project");
const nextProject = document.querySelector("#next-project");
const projectPosition = document.querySelector("#project-position");
const routeProgressText = document.querySelector("#route-progress-text");
const routeProgressFill = document.querySelector("#route-progress-fill");
const pythonFinish = document.querySelector("#python-finish");
const currentYear = document.querySelector("#current-year");

let activeProject = 1;
let completedProjects = loadProgress();
const validRuns = { 1: false, 2: false, 3: false };

function hasValue(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function parseString(expression) {
  const match = expression.match(/^(["'])([\s\S]*)\1$/);
  if (!match) return null;

  return match[2]
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function evaluateExpression(expression, environment) {
  const value = expression.trim();
  const fString = value.match(/^f(["'])([\s\S]*)\1$/);

  if (fString) {
    return fString[2].replace(/\{([A-Za-z_]\w*)\}/g, (_, name) => {
      if (!hasValue(environment, name)) throw new Error(`La variable “${name}” todavía no existe.`);
      return String(environment[name]);
    });
  }

  const text = parseString(value);
  if (text !== null) return text;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (/^[A-Za-z_]\w*$/.test(value)) {
    if (!hasValue(environment, value)) throw new Error(`La variable “${value}” todavía no existe.`);
    return environment[value];
  }

  const operation = value.match(/^([A-Za-z_]\w*|-?\d+(?:\.\d+)?)\s*(\/\/|%|\+|-|\*)\s*([A-Za-z_]\w*|-?\d+(?:\.\d+)?)$/);
  if (operation) {
    const left = evaluateExpression(operation[1], environment);
    const right = evaluateExpression(operation[3], environment);

    if (operation[2] === "//") {
      if (right === 0) throw new Error("No es posible dividir por cero.");
      return Math.floor(Number(left) / Number(right));
    }
    if (operation[2] === "%") {
      if (right === 0) throw new Error("No es posible dividir por cero.");
      return Number(left) % Number(right);
    }
    if (operation[2] === "+") return left + right;
    if (operation[2] === "-") return Number(left) - Number(right);
    if (operation[2] === "*") return Number(left) * Number(right);
  }

  throw new Error(`No reconozco la expresión “${value}” en este laboratorio.`);
}

function runPython(source) {
  const environment = {};
  const output = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;

    try {
      const assignment = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (assignment) {
        environment[assignment[1]] = evaluateExpression(assignment[2], environment);
        return;
      }

      const printCall = line.match(/^print\((.*)\)$/);
      if (printCall) {
        output.push(String(evaluateExpression(printCall[1], environment)));
        return;
      }

      throw new Error("Usa una asignación o print() como en el ejemplo.");
    } catch (error) {
      throw new Error(`Línea ${index + 1}: ${error.message}`);
    }
  });

  if (output.length === 0) throw new Error("El programa no mostró ningún resultado. Agrega print().");
  return { environment, output };
}

function renderOutput(element, lines) {
  element.textContent = lines.join("\n");
  element.classList.remove("is-error");
}

function renderError(element, message) {
  element.textContent = message;
  element.classList.add("is-error");
}

function validateProject(project, result, source) {
  if (project === 1) return result.output.some((line) => line.trim().length > 0);

  if (project === 2) {
    const { nombre, edad } = result.environment;
    return hasValue(result.environment, "nombre")
      && hasValue(result.environment, "edad")
      && result.output.some((line) => line.includes(String(nombre)) && line.includes(String(edad)));
  }

  if (project === 3) {
    const { minutos, horas, resto } = result.environment;
    return Number.isFinite(minutos)
      && horas === Math.floor(minutos / 60)
      && resto === minutos % 60
      && source.includes("//")
      && source.includes("%")
      && result.output.some((line) => line.includes(String(horas)) && line.includes(String(resto)));
  }

  return false;
}

function runHeroExample() {
  try {
    const result = runPython(heroCode.value);
    heroOutput.innerHTML = "";
    const prompt = document.createElement("span");
    prompt.setAttribute("aria-hidden", "true");
    prompt.textContent = "›";
    heroOutput.append(prompt, document.createTextNode(result.output.join("\n")));
    heroOutput.classList.remove("is-error");
  } catch (error) {
    renderError(heroOutput, error.message);
  }
}

function runProject(project) {
  const code = document.querySelector(`[data-project-code="${project}"]`);
  const output = document.querySelector(`[data-project-output="${project}"]`);
  const success = document.querySelector(`[data-project-success="${project}"]`);
  const completeButton = document.querySelector(`[data-complete-project="${project}"]`);

  try {
    const result = runPython(code.value);
    renderOutput(output, result.output);
    validRuns[project] = validateProject(project, result, code.value);
    success.hidden = !validRuns[project];

    if (!completedProjects.has(project)) completeButton.disabled = !validRuns[project];
    if (!validRuns[project]) renderError(output, "El código funciona, pero aún falta cumplir la misión del proyecto.");
  } catch (error) {
    validRuns[project] = false;
    success.hidden = true;
    if (!completedProjects.has(project)) completeButton.disabled = true;
    renderError(output, error.message);
  }
}

function resetProject(project) {
  const code = document.querySelector(`[data-project-code="${project}"]`);
  const output = document.querySelector(`[data-project-output="${project}"]`);
  const success = document.querySelector(`[data-project-success="${project}"]`);
  const completeButton = document.querySelector(`[data-complete-project="${project}"]`);

  code.value = PROJECT_DEFAULTS[project];
  output.textContent = project === 1 ? "Tu mensaje aparecerá aquí." : project === 2 ? "Tu ficha aparecerá aquí." : "La conversión aparecerá aquí.";
  output.classList.remove("is-error");
  validRuns[project] = false;
  success.hidden = true;
  if (!completedProjects.has(project)) completeButton.disabled = true;
  code.focus();
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    return new Set(saved.filter((project) => [1, 2, 3].includes(project)));
  } catch {
    return new Set();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedProjects]));
  } catch {
    // La práctica sigue disponible aunque el navegador bloquee el almacenamiento.
  }
}

function renderProgress() {
  const completed = completedProjects.size;
  routeProgressText.textContent = `${completed} de 3`;
  routeProgressFill.style.width = `${(completed / 3) * 100}%`;
  pythonFinish.hidden = completed !== 3;

  [1, 2, 3].forEach((project) => {
    const tab = document.querySelector(`[data-project-tab="${project}"]`);
    const tabState = document.querySelector(`[data-tab-state="${project}"]`);
    const completeButton = document.querySelector(`[data-complete-project="${project}"]`);

    if (completedProjects.has(project)) {
      tab.classList.add("is-complete");
      tabState.textContent = "Completado ✓";
      completeButton.textContent = "Proyecto completado ✓";
      completeButton.classList.add("is-complete");
      completeButton.disabled = true;
    } else {
      tab.classList.remove("is-complete");
      tabState.textContent = "Empezar";
      completeButton.textContent = "Completar proyecto";
      completeButton.classList.remove("is-complete");
      completeButton.disabled = !validRuns[project];
    }
  });
}

function activateProject(project, scroll = false) {
  activeProject = Math.min(3, Math.max(1, Number(project)));

  projectTabs.forEach((tab) => {
    const isActive = Number(tab.dataset.projectTab) === activeProject;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  projectPanels.forEach((panel) => {
    panel.hidden = Number(panel.dataset.projectPanel) !== activeProject;
  });

  previousProject.disabled = activeProject === 1;
  nextProject.disabled = activeProject === 3;
  projectPosition.textContent = `Proyecto ${activeProject} de 3`;

  if (scroll) document.querySelector("#proyectos").scrollIntoView({ behavior: "smooth", block: "start" });
}

heroRun.addEventListener("click", runHeroExample);
heroCode.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runHeroExample();
});

document.querySelectorAll("[data-run-project]").forEach((button) => {
  button.addEventListener("click", () => runProject(Number(button.dataset.runProject)));
});

document.querySelectorAll("[data-reset-project]").forEach((button) => {
  button.addEventListener("click", () => resetProject(Number(button.dataset.resetProject)));
});

document.querySelectorAll("[data-project-code]").forEach((editor) => {
  editor.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runProject(Number(editor.dataset.projectCode));
  });
});

document.querySelectorAll("[data-complete-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = Number(button.dataset.completeProject);
    if (!validRuns[project]) return;
    completedProjects.add(project);
    saveProgress();
    renderProgress();
  });
});

projectTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateProject(Number(tab.dataset.projectTab)));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + projectTabs.length) % projectTabs.length;
    activateProject(Number(projectTabs[nextIndex].dataset.projectTab));
    projectTabs[nextIndex].focus();
  });
});

projectTargetButtons.forEach((button) => {
  button.addEventListener("click", () => activateProject(Number(button.dataset.projectTarget), true));
});

previousProject.addEventListener("click", () => activateProject(activeProject - 1));
nextProject.addEventListener("click", () => activateProject(activeProject + 1));

currentYear.textContent = new Date().getFullYear();
renderProgress();
activateProject([1, 2, 3].find((project) => !completedProjects.has(project)) || 1);
