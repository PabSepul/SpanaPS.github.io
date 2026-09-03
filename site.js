const SITE_THEME_KEY = "codigo-cero.theme";
const siteThemeToggle = document.querySelector("#theme-toggle");
const siteThemeToggleLabel = document.querySelector("#theme-toggle-label");
const siteThemeColor = document.querySelector('meta[name="theme-color"]');

function saveSiteTheme(theme) {
  try {
    localStorage.setItem(SITE_THEME_KEY, theme);
  } catch {
    // El selector continúa funcionando aunque el almacenamiento esté bloqueado.
  }
}

function applySiteTheme(theme, persist = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  siteThemeToggle.setAttribute("aria-pressed", String(isDark));
  siteThemeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  siteThemeToggleLabel.textContent = isDark ? "Claro" : "Oscuro";
  siteThemeColor.content = isDark ? "#151a20" : "#1c69d4";
  if (persist) saveSiteTheme(isDark ? "dark" : "light");
}

siteThemeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applySiteTheme(nextTheme, true);
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

applySiteTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
