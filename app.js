/* =========================================================
   app.js - Lógica del experimento MonteRojo
   Requiere data.js (INTRO_QUESTION, PATHS, AGE_RANGES).
   ========================================================= */

// URL del Web App de Google Apps Script (ver README.md). Vacío = no se envía nada.
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzTqkMNS7_FZlF1xK8Xl7cBRQQof9roujNeiDNM_xkNU51sSrW8NbbdGtPnnr3bKAIOKg/exec";

// Estado de la sesión
const state = {
  participantId: "",
  alias: "",
  age: "",
  introAnswerText: "",
  pathKey: null,
  index: 0,       // índice de pregunta dentro del camino (0-5)
  answers: []     // letras "A"/"B" elegidas, en orden
};

const $ = (id) => document.getElementById(id);
const screens = document.querySelectorAll(".screen");

/* ---------- Utilidades ---------- */
function showScreen(name) {
  screens.forEach((s) => { s.hidden = s.dataset.screen !== name; });
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Lleva el foco al título de la pantalla para lectores de pantalla
  const heading = document.querySelector(`[data-screen="${name}"] h1, [data-screen="${name}"] h2`);
  if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
}

function randomId() {
  const bytes = new Uint8Array(6);
  (window.crypto || window.msCrypto).getRandomValues(bytes);
  return "P-" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Aplana las 6 preguntas del camino con su subcategoría y código (p. ej. SH01-1). */
function flattenPath(pathKey) {
  const list = [];
  PATHS[pathKey].subcategories.forEach((sub) => {
    sub.questions.forEach((q, i) => {
      list.push({ code: `${sub.code}-${i + 1}`, subName: sub.name, ...q });
    });
  });
  return list;
}

function createOption(letter, text, onChoose) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "option";
  btn.dataset.letter = letter;
  btn.innerHTML = '<span class="tag" aria-hidden="true"></span><span class="label"></span>';
  btn.querySelector(".tag").textContent = letter;
  btn.querySelector(".label").textContent = text;
  btn.addEventListener("click", () => onChoose(btn));
  return btn;
}

/* ---------- 1. Bienvenida ---------- */
function initWelcome() {
  const select = $("age");
  AGE_RANGES.forEach((r) => {
    const o = document.createElement("option");
    o.value = r; o.textContent = r;
    select.appendChild(o);
  });
  $("welcome-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.alias = $("alias").value.trim();
    state.age = select.value;
    state.participantId = randomId();
    renderIntro();
  });
}

/* ---------- 2. Pregunta inicial ---------- */
function renderIntro() {
  $("intro-text").textContent = INTRO_QUESTION.text;
  const box = $("intro-options");
  box.innerHTML = "";
  INTRO_QUESTION.answers.forEach((ans, i) => {
    // Etiquetas neutras (1, 2, 3) para no sesgar ni mostrar el nombre del camino
    const opt = createOption(String(i + 1), ans.text, (btn) => {
      btn.classList.add("selected");
      state.introAnswerText = ans.text;
      state.pathKey = ans.path;
      state.index = 0;
      state.answers = [];
      setTimeout(() => { renderQuestion(); showScreen("question"); }, 220);
    });
    box.appendChild(opt);
  });
  showScreen("intro");
}

/* ---------- 3. Preguntas A/B ---------- */
function renderQuestion() {
  const qs = flattenPath(state.pathKey);
  const q = qs[state.index];
  const total = qs.length;

  $("q-eyebrow").textContent = q.subName;
  $("q-text").textContent = q.text;
  $("progress-label").textContent = `Pregunta ${state.index + 1} de ${total}`;
  $("progress-bar").style.width = `${(state.index / total) * 100}%`;
  $("btn-back").disabled = false; // la primera pregunta vuelve a la pregunta inicial

  const box = $("q-options");
  box.innerHTML = "";
  const prev = state.answers[state.index]; // si el usuario retrocedió, muestra su elección
  ["A", "B"].forEach((letter) => {
    const opt = createOption(letter, letter === "A" ? q.a : q.b, (btn) => choose(letter, btn));
    if (prev === letter) opt.classList.add("selected");
    box.appendChild(opt);
  });
}

function choose(letter, btn) {
  if (state.locked) return;
  state.locked = true; // evita doble toque durante la transición
  btn.classList.add("selected");
  state.answers[state.index] = letter;
  const total = flattenPath(state.pathKey).length;

  setTimeout(() => {
    state.locked = false;
    if (state.index + 1 < total) {
      state.index += 1;
      renderQuestion();
    } else {
      $("progress-bar").style.width = "100%";
      finish();
    }
  }, 260);
}

function goBack() {
  if (state.locked) return;
  if (state.index === 0) { renderIntro(); return; }
  state.index -= 1;
  renderQuestion();
}

/* ---------- 4. Resultado ---------- */
function computeProfile(countA, countB) {
  const key = countA >= 4 ? "A" : countB >= 4 ? "B" : "balanced";
  return { key, ...PATHS[state.pathKey].profiles[key] };
}

function finish() {
  const qs = flattenPath(state.pathKey);
  const countA = state.answers.filter((a) => a === "A").length;
  const countB = state.answers.length - countA;
  const profile = computeProfile(countA, countB);
  const total = qs.length;

  $("profile-name").textContent = profile.name;
  $("profile-path").textContent = PATHS[state.pathKey].name;
  $("profile-text").textContent = profile.text;
  $("count-a").textContent = countA;
  $("count-b").textContent = countB;
  $("split-bar").setAttribute("aria-label", `${countA} respuestas A y ${countB} respuestas B`);

  // Desglose por subcategoría
  const list = $("breakdown");
  list.innerHTML = "";
  PATHS[state.pathKey].subcategories.forEach((sub, si) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = sub.name;
    const picks = document.createElement("span");
    picks.className = "picks";
    [0, 1].forEach((qi) => {
      const letter = state.answers[si * 2 + qi];
      const p = document.createElement("span");
      p.className = `pick pick-${letter}`;
      p.textContent = letter;
      p.setAttribute("aria-label", `Pregunta ${qi + 1}: opción ${letter}`);
      picks.appendChild(p);
    });
    li.append(name, picks);
    list.appendChild(li);
  });

  // Barra A vs B (se anima tras mostrar la pantalla)
  $("split-a").style.width = "0";
  $("split-b").style.width = "0";
  showScreen("result");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $("split-a").style.width = `${(countA / total) * 100}%`;
    $("split-b").style.width = `${(countB / total) * 100}%`;
  }));

  const status = $("save-status");
  status.hidden = true;
  sendToSheets(qs, countA, countB, profile).then((ok) => {
    if (ok) { status.textContent = "Respuestas guardadas"; status.hidden = false; }
  });
}

/* ---------- 5. Envío a Google Sheets ---------- */
async function sendToSheets(qs, countA, countB, profile) {
  const payload = {
    timestamp: new Date().toISOString(),
    participantId: state.participantId,
    alias: state.alias,
    ageRange: state.age,
    initialAnswer: state.introAnswerText,
    path: PATHS[state.pathKey].name,
    totalA: countA,
    totalB: countB,
    profile: profile.name,
    userAgent: navigator.userAgent
  };
  // Una clave por código de pregunta (SH01-1, ..., CM03-2) con "A" o "B"
  qs.forEach((q, i) => { payload[q.code] = state.answers[i]; });

  if (!SHEETS_ENDPOINT) {
    console.info("[MonteRojo] SHEETS_ENDPOINT vacío: no se envía. Payload:", payload);
    return false;
  }
  try {
    // no-cors + text/plain evita el preflight CORS; la respuesta es opaca
    await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.info("[MonteRojo] No se pudo enviar (no afecta al participante):", err);
    return false;
  }
}

/* ---------- Reinicio y teclado ---------- */
function restart() {
  Object.assign(state, { participantId: "", alias: "", age: "", introAnswerText: "", pathKey: null, index: 0, answers: [], locked: false });
  $("welcome-form").reset();
  showScreen("welcome");
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "select" || tag === "textarea") return;

  const k = e.key.toLowerCase();
  const visible = (n) => !document.querySelector(`[data-screen="${n}"]`).hidden;

  if (visible("question")) {
    if (k === "a" || k === "1") document.querySelector('#q-options [data-letter="A"]').click();
    else if (k === "b" || k === "2") document.querySelector('#q-options [data-letter="B"]').click();
    else if (k === "arrowleft" || k === "backspace") goBack();
  } else if (visible("intro")) {
    const n = parseInt(k, 10);
    const btns = document.querySelectorAll("#intro-options .option");
    if (n >= 1 && n <= btns.length) btns[n - 1].click();
  }
});

/* ---------- Inicio ---------- */
$("btn-back").addEventListener("click", goBack);
$("btn-restart").addEventListener("click", restart);
initWelcome();
