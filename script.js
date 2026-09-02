const PROGRESS_KEY = "codigo-cero.lesson-01.complete";

const heroCode = document.querySelector("#hero-code");
const heroRun = document.querySelector("#hero-run");
const heroOutput = document.querySelector("#hero-output");
const lessonCode = document.querySelector("#lesson-code");
const lessonRun = document.querySelector("#lesson-run");
const lessonReset = document.querySelector("#lesson-reset");
const lessonOutput = document.querySelector("#lesson-output");
const challengeSuccess = document.querySelector("#challenge-success");
const quizButtons = [...document.querySelectorAll("[data-answer]")];
const quizFeedback = document.querySelector("#quiz-feedback");
const completeButton = document.querySelector("#complete-lesson");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const firstProgressStep = document.querySelector(".progress-list li");
const currentYear = document.querySelector("#current-year");

function readConsoleMessage(source) {
  const match = source.trim().match(/^console\.log\(\s*(["'])([\s\S]*?)\1\s*\);?$/);
  return match ? match[2] : null;
}

function renderOutput(element, message) {
  element.innerHTML = "";
  const prompt = document.createElement("span");
  prompt.setAttribute("aria-hidden", "true");
  prompt.textContent = "› ";
  element.append(prompt, document.createTextNode(message || "(mensaje vacío)"));
  element.classList.remove("is-error");
}

function renderError(element) {
  element.textContent = 'Revisa que tu línea use console.log("tu mensaje");';
  element.classList.add("is-error");
}

function runHeroExample() {
  const message = readConsoleMessage(heroCode.value);
  message === null ? renderError(heroOutput) : renderOutput(heroOutput, message);
}

function runLessonExample() {
  const message = readConsoleMessage(lessonCode.value);

  if (message === null || message.trim() === "") {
    renderError(lessonOutput);
    challengeSuccess.hidden = true;
    return;
  }

  renderOutput(lessonOutput, message);
  challengeSuccess.hidden = false;
}

function updateProgress(isComplete) {
  progressPercent.textContent = isComplete ? "25%" : "0%";
  progressFill.style.width = isComplete ? "25%" : "0%";

  if (!isComplete) return;

  firstProgressStep.classList.add("is-complete");
  firstProgressStep.querySelector(":scope > span").textContent = "✓";
  firstProgressStep.querySelector("small").textContent = "Completada";
  completeButton.textContent = "Lección completada ✓";
  completeButton.classList.add("is-complete");
  completeButton.disabled = true;
}

function savedProgress() {
  try {
    return localStorage.getItem(PROGRESS_KEY) === "true";
  } catch {
    return false;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, "true");
  } catch {
    // La lección sigue funcionando aunque el navegador bloquee el almacenamiento.
  }
}

heroRun.addEventListener("click", runHeroExample);

heroCode.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runHeroExample();
});

lessonRun.addEventListener("click", runLessonExample);

lessonCode.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runLessonExample();
});

lessonReset.addEventListener("click", () => {
  lessonCode.value = 'console.log("Hola desde Chile");';
  lessonOutput.textContent = "Tu mensaje aparecerá aquí.";
  lessonOutput.classList.remove("is-error");
  challengeSuccess.hidden = true;
  lessonCode.focus();
});

quizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    quizButtons.forEach((option) => option.classList.remove("is-correct", "is-wrong"));

    if (button.dataset.answer === "correct") {
      button.classList.add("is-correct");
      quizFeedback.textContent = "¡Exacto! El texto entre comillas es el mensaje.";
      completeButton.disabled = savedProgress();
      return;
    }

    button.classList.add("is-wrong");
    quizFeedback.textContent = "Casi. Busca la parte que cambiarías para mostrar otro mensaje.";
    completeButton.disabled = true;
  });
});

completeButton.addEventListener("click", () => {
  saveProgress();
  updateProgress(true);
});

currentYear.textContent = new Date().getFullYear();
updateProgress(savedProgress());
