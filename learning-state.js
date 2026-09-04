/* Lectura del progreso existente y borradores locales. Sin red ni migraciones
   destructivas: las claves de módulos/exámenes siguen siendo la fuente de verdad. */
(() => {
  "use strict";
  const routes = [
    { id: "python", name: "Python", count: 20, offset: 1, unit: "proyectos", anchor: "proyectos" },
    { id: "html-css", name: "HTML y CSS", count: 12, offset: 0, unit: "módulos" },
    { id: "javascript", name: "JavaScript", count: 12, offset: 0, unit: "módulos" },
    { id: "sql", name: "SQL", count: 12, offset: 0, unit: "módulos" },
    { id: "nodejs", name: "Node.js", count: 3 },
    { id: "datos-python", name: "Datos con Python", count: 3 },
    { id: "react", name: "React", count: 3 },
    { id: "typescript", name: "TypeScript", count: 3 }
  ].map((route) => ({ offset: 0, unit: "mini proyectos", anchor: "laboratorio", ...route, mini: route.count === 3, path: route.id + ".html" }));
  let available = true;
  const memory = new Map();
  const pendingWrites = new Set();
  const routeFor = (id) => routes.find((route) => route.id === id);
  function read(key, fallback) {
    if (pendingWrites.has(key)) return memory.get(key) ?? fallback;
    try {
      const value = localStorage.getItem(key);
      return value === null ? (memory.get(key) ?? fallback) : JSON.parse(value);
    } catch { available = false; return memory.get(key) ?? fallback; }
  }
  function write(key, value) {
    memory.set(key, value);
    try { localStorage.setItem(key, JSON.stringify(value)); pendingWrites.delete(key); }
    catch { available = false; pendingWrites.add(key); }
  }
  function session(id) {
    const route = routeFor(id);
    if (!route) return { active: null, drafts: {}, updatedAt: 0 };
    const raw = read("codigo-cero." + id + ".session-v1", {});
    const drafts = {};
    for (const [key, code] of Object.entries(raw?.drafts && typeof raw.drafts === "object" ? raw.drafts : {})) {
      if (/^\d+$/.test(key) && Number(key) < route.count && typeof code === "string" && code.length <= 30000) drafts[key] = code;
    }
    return {
      active: Number.isInteger(raw?.active) && raw.active >= 0 && raw.active < route.count ? raw.active : null,
      updatedAt: Number.isFinite(raw?.updatedAt) && raw.updatedAt > 0 && raw.updatedAt <= Date.now() + 60000 ? raw.updatedAt : 0,
      drafts
    };
  }
  function save(id, index, code) {
    const route = routeFor(id);
    if (!route || !Number.isInteger(index) || index < 0 || index >= route.count) return;
    const value = session(id);
    value.active = index;
    value.updatedAt = Date.now();
    if (typeof code === "string" && code.length <= 30000) value.drafts[index] = code;
    write("codigo-cero." + id + ".session-v1", value);
  }
  function removeDraft(id, index) {
    const value = session(id);
    delete value.drafts[index];
    write("codigo-cero." + id + ".session-v1", value);
  }
  function progress(id) {
    const route = routeFor(id);
    if (!route) return null;
    const miniState = route.mini ? read("codigo-cero." + id + "-mini-v1", {}) : null;
    const raw = route.mini ? miniState?.completed : read("codigo-cero." + id + "-v2.completed", []);
    const completed = new Set((Array.isArray(raw) ? raw : [])
      .filter((i) => Number.isInteger(i) && i >= route.offset && i < route.count + route.offset)
      .map((i) => i - route.offset));
    const unlocked = (i) => route.mini || Array.from({ length: Math.floor(i / 4) * 4 }, (_, n) => n).every((n) => completed.has(n));
    const levels = route.mini ? 0 : Math.ceil(route.count / 4);
    const examValues = route.mini ? [] : read("codigo-cero." + id + "-v2.exams", []);
    const exams = new Set((Array.isArray(examValues) ? examValues : []).filter((i) =>
      Number.isInteger(i) && i >= 1 && i <= levels && Array.from({ length: i * 4 }, (_, n) => n).every((n) => completed.has(n))));
    const saved = session(id);
    let active = saved.active;
    if (route.mini && Number.isInteger(miniState?.active) && miniState.active >= 0 && miniState.active < route.count) active = miniState.active;
    const first = Array.from({ length: route.count }, (_, i) => i).find((i) => !completed.has(i) && unlocked(i));
    const pendingExam = Array.from({ length: levels }, (_, n) => n + 1).find((id) => !exams.has(id));
    if (active === null || !unlocked(active)) active = first ?? (route.mini ? 0 : ((pendingExam || 1) - 1) * 4);
    const done = completed.size === route.count && (route.mini || exams.size === levels);
    return { ...route, completed: completed.size, exams: exams.size, active, done,
      started: completed.size > 0 || saved.updatedAt > 0 || (route.mini && miniState?.active > 0),
      updatedAt: saved.updatedAt, percent: Math.round(completed.size / route.count * 100),
      href: route.path + "#" + route.anchor
    };
  }
  globalThis.LearningState = { routes, session, save, removeDraft, progress, resumeIndex: (id) => progress(id)?.active ?? 0, storageAvailable: () => available };
})();
