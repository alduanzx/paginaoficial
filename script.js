/*!
 * ============================================================================
 *  ENDURO — corrida noturna em JavaScript puro (Canvas 2D)
 *  Inspirado no clássico "Enduro" do Atari 2600 (1983).
 *
 *  COMO USAR — só o script.js é necessário
 *  1) Copie este arquivo para o seu site (script.js).
 *  2) Inclua no HTML, onde quiser que o jogo apareça:
 *         <script src="script.js"></script>
 *     O CSS já está embutido e o container é criado automaticamente
 *     logo abaixo da tag.
 *  3) OPCIONAL: para controlar a posição exata, crie o container:
 *         <div class="enduro" data-enduro></div>
 *
 *  O script injeta o CSS e monta HUD, canvas, overlay e controles.
 *  Não precisa de jQuery, imagens, fontes, style.css ou qualquer outra
 *  dependência.
 * ============================================================================
 */
(function () {
  "use strict";

  /* Guarda a referência da tag <script> que carregou este arquivo. */
  var SELF_SCRIPT = document.currentScript;

  /* CSS embutido: este arquivo é 100% autossuficiente.
     Não precisa de style.css, imagens, fontes ou bibliotecas. */
  var GAME_CSS = `/* ============================================================================
   ENDURO — estilos do jogo (embutidos no script.js)
   ----------------------------------------------------------------------------
   CSS autossuficiente: não precisa de style.css. Todos os seletores são
   prefixados com .enduro para não conflitar com o restante do site.
   O próprio script cria o container, o HUD, o canvas, os controles e o overlay.
   ========================================================================== */

.enduro {
  --en-bg: #05070f;
  --en-panel: #0b1120;
  --en-panel-2: #0f172a;
  --en-line: rgba(148, 178, 226, 0.16);
  --en-text: #e8eefc;
  --en-muted: #8b9ab8;
  --en-amber: #ffb020;
  --en-amber-soft: #ffd27a;
  --en-cyan: #38e8ff;
  --en-red: #ff4d4d;
  --en-font: "Space Grotesk", "Segoe UI", system-ui, -apple-system, sans-serif;
  --en-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --en-display: "Press Start 2P", var(--en-mono);

  width: 100%;
  max-width: 1080px;
  margin-inline: auto;
  color: var(--en-text);
  font-family: var(--en-font);
  font-size: 14px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  outline: none;
}

.enduro *,
.enduro *::before,
.enduro *::after { box-sizing: border-box; }

.enduro:focus-visible {
  outline: 2px solid var(--en-cyan);
  outline-offset: 6px;
  border-radius: 22px;
}

.enduro-frame {
  position: relative;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid var(--en-line);
  background:
    radial-gradient(120% 90% at 50% -10%, rgba(255, 176, 32, 0.09), transparent 60%),
    linear-gradient(180deg, #0d1526 0%, #080d18 100%);
  box-shadow:
    0 30px 70px -30px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* ------------------------------- HUD ---------------------------------- */
.enduro-hud {
  display: grid;
  grid-template-columns: 1fr 1fr 0.85fr 0.9fr 1.55fr 1fr auto;
  gap: 8px;
  margin-bottom: 12px;
}

.enduro-stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(148, 178, 226, 0.1);
  background: rgba(255, 255, 255, 0.028);
}

.enduro-stat__label {
  font-family: var(--en-mono);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--en-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.enduro-stat__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  font-family: var(--en-mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--en-text);
  font-variant-numeric: tabular-nums;
}

.enduro-stat__value b { font-weight: 700; }
.enduro-stat__value i {
  font-style: normal;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--en-muted);
}

.enduro-stat:nth-child(1) .enduro-stat__value b { color: var(--en-amber); }
.enduro-stat:nth-child(4) .enduro-stat__value b { color: var(--en-cyan); }

.enduro-stat--goal { justify-content: center; }

.enduro-bar {
  display: block;
  height: 4px;
  margin-top: 2px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.09);
  overflow: hidden;
}

.enduro-bar > i {
  display: block;
  height: 100%;
  width: 0%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--en-amber), #ffe6a3);
  box-shadow: 0 0 10px rgba(255, 176, 32, 0.7);
  transition: width 0.18s linear;
}

.enduro-crashes {
  display: flex;
  gap: 3px;
  align-items: center;
  height: 18px;
}

.enduro-crashes i {
  display: block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  transform: rotate(45deg);
}

.enduro-crashes i.is-full {
  background: var(--en-red);
  box-shadow: 0 0 8px rgba(255, 77, 77, 0.65);
}

.enduro-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(148, 178, 226, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: var(--en-muted);
  font-family: var(--en-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.enduro-icon:hover { color: var(--en-text); border-color: rgba(255, 176, 32, 0.5); }
.enduro-icon.is-muted { color: #ff9a9a; }
.enduro-icon svg { flex: none; }

/* ------------------------------ STAGE --------------------------------- */
.enduro-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: #03060d;
  border: 1px solid rgba(148, 178, 226, 0.14);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8);
  isolation: isolate;
}

.enduro-stage canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.enduro-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.035) 0px,
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px,
    transparent 3px
  );
  opacity: 0.5;
  mix-blend-mode: overlay;
}

.enduro-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 4;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(3, 6, 13, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(232, 238, 252, 0.6);
  font-family: var(--en-mono);
  font-size: 8px;
  letter-spacing: 0.16em;
  pointer-events: none;
}

.enduro-flash {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle at 50% 70%, rgba(255, 90, 60, 0.55), rgba(255, 0, 0, 0.12) 70%);
  transition: opacity 0.08s linear;
}

.enduro-flash.is-on { opacity: 1; }

/* ----------------------------- OVERLAY -------------------------------- */
.enduro-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  background: radial-gradient(circle at 50% 42%, rgba(5, 8, 16, 0.55), rgba(4, 7, 14, 0.94) 78%);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.enduro-overlay.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.enduro-overlay__inner {
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  animation: enduro-rise 0.35s ease both;
}

@keyframes enduro-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.enduro-overlay__eyebrow {
  margin: 0;
  font-family: var(--en-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--en-amber);
}

.enduro-overlay__title {
  margin: 0;
  font-family: var(--en-display);
  font-size: clamp(24px, 4.6vw, 42px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: #ffd27a;
  text-shadow:
    0 0 22px rgba(255, 176, 32, 0.45),
    0 4px 0 #7a3d00,
    0 8px 24px rgba(0, 0, 0, 0.6);
}

.enduro-overlay__text {
  margin: 0;
  max-width: 46ch;
  font-size: 12.5px;
  line-height: 1.6;
  color: #b9c6dd;
}

.enduro-overlay__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 2px 0;
}

.enduro-overlay__stats > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 84px;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid rgba(148, 178, 226, 0.14);
  background: rgba(255, 255, 255, 0.035);
}

.enduro-overlay__stats span {
  font-family: var(--en-mono);
  font-size: 7.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--en-muted);
}

.enduro-overlay__stats b {
  font-family: var(--en-mono);
  font-size: 12px;
  color: var(--en-text);
  font-variant-numeric: tabular-nums;
}

.enduro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  padding: 12px 24px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-family: var(--en-font);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
}

.enduro-btn--primary {
  color: #1a1000;
  background: linear-gradient(180deg, #ffd166, #ffab00);
  box-shadow: 0 5px 0 #a35c00, 0 12px 26px -8px rgba(255, 171, 0, 0.7);
}

.enduro-btn--primary:hover { filter: brightness(1.06); transform: translateY(-1px); }
.enduro-btn--primary:active { transform: translateY(3px); box-shadow: 0 2px 0 #a35c00; }
.enduro-btn:focus-visible { outline: 2px solid var(--en-cyan); outline-offset: 3px; }

.enduro-overlay__hint {
  margin: 0;
  font-family: var(--en-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  color: var(--en-muted);
}

.enduro kbd,
.enduro-overlay kbd {
  display: inline-block;
  min-width: 18px;
  margin: 0 1px;
  padding: 2px 5px;
  border: 1px solid rgba(148, 178, 226, 0.28);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #dbe6f7;
  font-family: var(--en-mono);
  font-size: 9px;
  line-height: 1.3;
  text-align: center;
}

/* --------------------------- TOUCH / RODAPE --------------------------- */
.enduro-touch {
  display: none;
  grid-template-columns: 1fr 1fr 1.15fr 1.35fr;
  gap: 8px;
  margin-top: 10px;
}

.enduro-touch__btn {
  padding: 14px 8px;
  border-radius: 10px;
  border: 1px solid rgba(148, 178, 226, 0.2);
  border-bottom-width: 3px;
  background: linear-gradient(180deg, #16203a, #0e1628);
  color: var(--en-text);
  font-family: var(--en-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.enduro-touch__btn--gas {
  color: #1a1000;
  background: linear-gradient(180deg, #ffd166, #ffab00);
  border-color: #a35c00;
}

.enduro-touch__btn.is-pressed { transform: translateY(2px); filter: brightness(1.15); }

.enduro-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  margin-top: 10px;
  padding: 0 2px;
  font-family: var(--en-mono);
  font-size: 9px;
  letter-spacing: 0.02em;
  color: var(--en-muted);
}

.enduro-foot span { display: inline-flex; align-items: center; gap: 4px; }

.enduro-foot__hint { margin-left: auto; color: rgba(255, 210, 122, 0.85); }
.enduro-foot__hint b { color: var(--en-amber); }

/* ---------------------------- RESPONSIVO ------------------------------ */
@media (max-width: 900px) {
  .enduro-hud { grid-template-columns: repeat(3, minmax(0, 1fr)) auto; }
  .enduro-stat--goal { grid-column: span 2; }
  .enduro-icon { grid-row: span 2; min-height: 100%; }
  .enduro-foot__hint { margin-left: 0; width: 100%; }
}

@media (max-width: 620px) {
  .enduro { font-size: 13px; }
  .enduro-frame { padding: 9px; border-radius: 16px; }
  .enduro-hud { gap: 6px; margin-bottom: 8px; }
  .enduro-stat { padding: 6px 8px; border-radius: 8px; }
  .enduro-stat__label { font-size: 7px; letter-spacing: 0.08em; }
  .enduro-stat__value { font-size: 13px; }
  .enduro-stat__value i { font-size: 7px; }
  .enduro-stat:nth-child(2) { display: none; }
  .enduro-icon span { display: none; }
  .enduro-icon { min-height: 38px; padding: 0 8px; }
  .enduro-stage { border-radius: 10px; }
  .enduro-overlay { padding: 14px; }
  .enduro-overlay__text { font-size: 11px; }
  .enduro-overlay__stats > div { min-width: 70px; padding: 5px 8px; }
  .enduro-tag { display: none; }
  .enduro-foot { font-size: 8px; gap: 5px 10px; }
  .enduro-foot span:nth-child(2),
  .enduro-foot span:nth-child(3) { display: none; }
  .enduro-overlay { padding: 10px; }
  .enduro-overlay__inner { gap: 7px; }
  .enduro-overlay__stats { display: none; }
  .enduro-overlay__hint { display: none; }
  .enduro-overlay__title { font-size: 22px; }
  .enduro-overlay__text { font-size: 10.5px; line-height: 1.45; }
  .enduro-btn { padding: 9px 16px; font-size: 10px; }
}

@media (hover: none), (max-width: 820px) {
  .enduro-touch { display: grid; }
}

@media (prefers-reduced-motion: reduce) {
  .enduro-overlay__inner { animation: none; }
  .enduro-bar > i { transition: none; }
  .enduro-flash { transition: none; }
}`;

  /* Se o script já foi carregado, apenas monta novos containers. */
  if (window.EnduroGame) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", window.EnduroGame.mountAll);
    } else {
      window.EnduroGame.mountAll();
    }
    return;
  }

  /* ==========================================================================
   * 1. CONFIGURAÇÃO
   * ========================================================================== */
  var CFG = {
    width: 960,
    height: 540,
    segmentLength: 200,
    rumbleLength: 3,
    roadWidth: 2200,
    cameraHeight: 1150,
    fieldOfView: 100,
    drawDistance: 220,
    lanes: 3,
    maxSpeed: 12000,
    accel: 2500,
    brake: -6400,
    decel: -1500,
    offRoadDecel: -4300,
    offRoadLimit: 3600,
    steer: 2.4,
    centrifugal: 0.34,
    crashLimit: 5,
    baseGoal: 20,
    goalStep: 8,
  };

  var CAMERA_DEPTH = 1 / Math.tan(((CFG.fieldOfView / 2) * Math.PI) / 180);
  var PLAYER_Z = CFG.cameraHeight * CAMERA_DEPTH;

  /* ==========================================================================
   * 2. UTILITÁRIOS
   * ========================================================================== */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function interpolate(a, b, p) { return a + (b - a) * p; }
  function easeIn(a, b, p) { return a + (b - a) * Math.pow(p, 2); }
  function easeInOut(a, b, p) { return a + (b - a) * (-Math.cos(p * Math.PI) / 2 + 0.5); }
  function wrap(v, max) { return ((v % max) + max) % max; }
  function wrapDelta(d, max) { d = wrap(d, max); return d > max / 2 ? d - max : d; }
  function exponentialFog(distance, density) { return 1 / Math.pow(Math.E, distance * distance * density); }
  function rndRange(min, max) { return min + Math.random() * (max - min); }
  function formatNumber(n) { return Math.round(n).toLocaleString("pt-BR"); }
  function pad(n, len) { var s = String(n); while (s.length < len) s = "0" + s; return s; }

  function polygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }

  function mixColor(a, b, t) {
    var ca = hexToRgb(a), cb = hexToRgb(b);
    return "rgb(" + Math.round(interpolate(ca[0], cb[0], t)) + "," +
      Math.round(interpolate(ca[1], cb[1], t)) + "," +
      Math.round(interpolate(ca[2], cb[2], t)) + ")";
  }

  /* ==========================================================================
   * 3. PALETAS (dia <-> noite)
   * ========================================================================== */
  var DAY = {
    skyTop: "#2f7fd0", skyBottom: "#bfe6ff",
    sun: "#fff6c9", mountainFar: "#8fb4d4", mountainNear: "#5b86a8",
    grassLight: "#3f8f4f", grassDark: "#378347",
    roadLight: "#6a6f78", roadDark: "#62676f",
    rumbleLight: "#f2f2f2", rumbleDark: "#d64545",
    lane: "#f4f4f4", fog: "#cfe6f5",
  };
  var NIGHT = {
    skyTop: "#03060f", skyBottom: "#111c33",
    sun: "#e6eeff", mountainFar: "#16233c", mountainNear: "#0c1626",
    grassLight: "#0e2a1c", grassDark: "#0b2317",
    roadLight: "#24272f", roadDark: "#1e2129",
    rumbleLight: "#cfd6e6", rumbleDark: "#8e2f3a",
    lane: "#b9c2d6", fog: "#0a1120",
  };
  var paletteCache = {};
  function getPalette(t) {
    var key = Math.round(clamp(t, 0, 1) * 40);
    if (paletteCache[key]) return paletteCache[key];
    var p = {};
    for (var k in DAY) p[k] = mixColor(DAY[k], NIGHT[k], key / 40);
    paletteCache[key] = p;
    return p;
  }

  /* ==========================================================================
   * 4. PISTA (pseudo-3D)
   * ========================================================================== */
  var segments = [];
  var TRACK_LENGTH = 0;

  function lastY() {
    return segments.length === 0 ? 0 : segments[segments.length - 1].p2.world.y;
  }

  function addSegment(curve, y) {
    var n = segments.length;
    segments.push({
      index: n,
      p1: { world: { x: 0, y: lastY(), z: n * CFG.segmentLength }, camera: {}, screen: {} },
      p2: { world: { x: 0, y: y, z: (n + 1) * CFG.segmentLength }, camera: {}, screen: {} },
      curve: curve,
      color: Math.floor(n / CFG.rumbleLength) % 2 ? "dark" : "light",
      looped: false,
      fog: 1,
      clip: 0,
    });
  }

  function addRoad(enter, hold, leave, curve, y) {
    var startY = lastY();
    var endY = startY + y * CFG.segmentLength;
    var total = enter + hold + leave;
    var n;
    for (n = 0; n < enter; n++) addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
    for (n = 0; n < hold; n++) addSegment(curve, easeInOut(startY, endY, (enter + n) / total));
    for (n = 0; n < leave; n++) addSegment(easeInOut(curve, 0, n / leave), easeInOut(startY, endY, (enter + hold + n) / total));
  }

  function addStraight(num) { addRoad(num, num, num, 0, 0); }
  function addHill(num, height) { addRoad(num, num, num, 0, height); }
  function addCurve(num, curve, height) { addRoad(num, num, num, curve, height); }
  function addSCurves() {
    addRoad(10, 10, 10, -2, 0);
    addRoad(10, 10, 10, 3, 8);
    addRoad(10, 10, 10, -3, -8);
    addRoad(10, 10, 10, 2, 0);
  }
  function addLowRollingHills(num, height) {
    addRoad(num, num, num, 0, height);
    addRoad(num, num, num, 0, -height);
    addRoad(num, num, num, 0, height * 0.6);
    addRoad(num, num, num, 0, 0);
  }

  function buildTrack() {
    addStraight(30);
    addLowRollingHills(16, 22);
    addSCurves();
    addCurve(18, -2, 10);
    addStraight(18);
    addCurve(18, 2, 26);
    addHill(18, 34);
    addSCurves();
    addCurve(18, -3, -22);
    addStraight(26);
    addLowRollingHills(16, 30);
    addCurve(18, 3, 34);
    addStraight(30);
    addSCurves();
    addCurve(18, -2, -30);
    addStraight(40);
    TRACK_LENGTH = segments.length * CFG.segmentLength;
  }
  buildTrack();

  function findSegment(z) {
    return segments[Math.floor(wrap(z, TRACK_LENGTH) / CFG.segmentLength) % segments.length];
  }

  /* ==========================================================================
   * 5. ÁUDIO (WebAudio, sintetizado — sem arquivos)
   * ========================================================================== */
  function createSound() {
    var ctx = null, master = null, engineGain = null, filter = null, osc1 = null, osc2 = null;
    var muted = false;
    try { muted = window.localStorage.getItem("enduro:muted") === "1"; } catch (e) { /* sem localStorage */ }

    function init() {
      if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.55;
        master.connect(ctx.destination);
        filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 480;
        engineGain = ctx.createGain();
        engineGain.gain.value = 0;
        filter.connect(engineGain);
        engineGain.connect(master);
        osc1 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.value = 58;
        osc2 = ctx.createOscillator();
        osc2.type = "square";
        osc2.frequency.value = 40;
        var g2 = ctx.createGain();
        g2.gain.value = 0.32;
        osc1.connect(filter);
        osc2.connect(g2);
        g2.connect(filter);
        osc1.start();
        osc2.start();
      } catch (e) { ctx = null; }
    }

    function engine(ratio, on) {
      if (!ctx || !engineGain) return;
      var t = ctx.currentTime;
      engineGain.gain.setTargetAtTime(on ? 0.03 + ratio * 0.05 : 0, t, 0.12);
      osc1.frequency.setTargetAtTime(50 + ratio * 125, t, 0.1);
      osc2.frequency.setTargetAtTime(32 + ratio * 82, t, 0.1);
      filter.frequency.setTargetAtTime(300 + ratio * 1500, t, 0.1);
    }

    function burst(duration, volume, cutoff) {
      if (!ctx || !master) return;
      try {
        var rate = ctx.sampleRate;
        var buffer = ctx.createBuffer(1, Math.floor(rate * duration), rate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        var src = ctx.createBufferSource();
        src.buffer = buffer;
        var lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = cutoff;
        var g = ctx.createGain();
        g.gain.setValueAtTime(volume, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        src.connect(lp); lp.connect(g); g.connect(master);
        src.start();
      } catch (e) { /* silêncio */ }
    }

    function crash() {
      burst(0.42, 0.55, 1100);
      if (!ctx || !master) return;
      try {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(120, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
        o.connect(g); g.connect(master);
        o.start(); o.stop(ctx.currentTime + 0.34);
      } catch (e) { /* silêncio */ }
    }

    function blip(freq) {
      if (!ctx || !master) return;
      try {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "square";
        o.frequency.value = freq || 880;
        g.gain.setValueAtTime(0.035, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
        o.connect(g); g.connect(master);
        o.start(); o.stop(ctx.currentTime + 0.1);
      } catch (e) { /* silêncio */ }
    }

    function setMuted(v) {
      muted = !!v;
      if (master) master.gain.value = muted ? 0 : 0.55;
      try { window.localStorage.setItem("enduro:muted", muted ? "1" : "0"); } catch (e) { /* ok */ }
    }

    return { init: init, engine: engine, crash: crash, blip: blip, setMuted: setMuted, isMuted: function () { return muted; } };
  }

  /* ==========================================================================
   * 6. CÉU, ESTRELAS E MONTANHAS
   * ========================================================================== */
  var stars = [];
  for (var si = 0; si < 80; si++) {
    stars.push({ x: Math.random(), y: Math.random() * 0.42, r: Math.random() * 1.3 + 0.4, p: Math.random() * Math.PI * 2 });
  }
  var peaksFar = [], peaksNear = [];
  for (var pi = 0; pi < 22; pi++) peaksFar.push(0.35 + Math.random() * 0.65);
  for (var pj = 0; pj < 16; pj++) peaksNear.push(0.3 + Math.random() * 0.7);

  function drawRidge(ctx, W, horizon, offset, peaks, step, color, maxHeight) {
    var total = peaks.length * step;
    var start = -wrap(offset, total) - total;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(start, horizon + 2);
    for (var x = start; x < W + total; x += total) {
      for (var i = 0; i < peaks.length; i++) {
        var px = x + i * step;
        ctx.lineTo(px, horizon - peaks[i] * maxHeight);
        ctx.lineTo(px + step * 0.5, horizon + 2);
      }
    }
    ctx.lineTo(W + total, horizon + 2);
    ctx.closePath();
    ctx.fill();
  }

  function drawSky(ctx, W, H, pal, night, progress, offset) {
    var horizon = H * 0.5 + 2;
    var grad = ctx.createLinearGradient(0, 0, 0, horizon + 30);
    grad.addColorStop(0, pal.skyTop);
    grad.addColorStop(1, pal.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    if (night > 0.03) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = night * (0.35 + 0.65 * Math.abs(Math.sin(s.p + progress * 6)));
        ctx.fillStyle = "rgba(226,238,255," + alpha.toFixed(3) + ")";
        ctx.fillRect(s.x * W, s.y * H, s.r, s.r);
      }
    }

    /* sol / lua em arco */
    var angle = Math.PI * (0.14 + clamp(progress, 0, 1) * 0.72);
    var cx = W * 0.5 - Math.cos(angle) * W * 0.44;
    var cy = horizon - Math.sin(angle) * H * 0.36;
    var sunAlpha = 1 - night;
    if (sunAlpha > 0.02) {
      var glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 90);
      glow.addColorStop(0, "rgba(255,246,201," + (0.85 * sunAlpha).toFixed(3) + ")");
      glow.addColorStop(0.35, "rgba(255,214,120," + (0.35 * sunAlpha).toFixed(3) + ")");
      glow.addColorStop(1, "rgba(255,214,120,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 100, cy - 100, 200, 200);
      ctx.fillStyle = pal.sun;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    if (night > 0.02) {
      var halo = ctx.createRadialGradient(cx, cy, 4, cx, cy, 70);
      halo.addColorStop(0, "rgba(214,230,255," + (0.5 * night).toFixed(3) + ")");
      halo.addColorStop(1, "rgba(214,230,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - 80, cy - 80, 160, 160);
      ctx.fillStyle = "rgba(232,240,255," + night.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(10,17,32," + (0.9 * night).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx + 8, cy - 5, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRidge(ctx, W, horizon, offset * 0.35, peaksFar, 150, pal.mountainFar, H * 0.20);
    drawRidge(ctx, W, horizon, offset * 0.7 + 400, peaksNear, 120, pal.mountainNear, H * 0.13);
  }

  /* ==========================================================================
   * 7. CARROS
   * ========================================================================== */
  var CAR_COLORS = ["#e63946", "#f4a261", "#2a9d8f", "#457b9d", "#8338ec", "#ff006e", "#ffbe0b", "#3a86ff", "#fb5607", "#8ac926"];

  function drawTrafficCar(ctx, cx, baseY, w, color, oncoming, night) {
    if (w < 7) {
      ctx.fillStyle = color;
      ctx.fillRect(cx - w / 2, baseY - w * 0.6, w, w * 0.6);
      return;
    }
    var h = w * 0.66;
    var x = cx - w / 2;
    var y = baseY - h;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, baseY, w * 0.52, Math.max(1, h * 0.1), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#07090f";
    rr(ctx, x - w * 0.02, y + h * 0.58, w * 0.15, h * 0.4, 3); ctx.fill();
    rr(ctx, x + w * 0.87, y + h * 0.58, w * 0.15, h * 0.4, 3); ctx.fill();

    var body = ctx.createLinearGradient(0, y, 0, baseY);
    body.addColorStop(0, color);
    body.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = body;
    rr(ctx, x + w * 0.07, y + h * 0.2, w * 0.86, h * 0.74, w * 0.06); ctx.fill();

    ctx.fillStyle = "rgba(8,14,26,0.92)";
    rr(ctx, x + w * 0.2, y + h * 0.02, w * 0.6, h * 0.34, w * 0.05); ctx.fill();

    ctx.fillStyle = "rgba(150,215,255,0.4)";
    rr(ctx, x + w * 0.25, y + h * 0.07, w * 0.5, h * 0.2, 2); ctx.fill();

    if (oncoming) {
      ctx.fillStyle = "#fff8d8";
      rr(ctx, x + w * 0.13, y + h * 0.5, w * 0.18, h * 0.12, 2); ctx.fill();
      rr(ctx, x + w * 0.69, y + h * 0.5, w * 0.18, h * 0.12, 2); ctx.fill();
      if (night > 0.1 && w > 26) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var g = ctx.createRadialGradient(cx, y + h * 0.56, 1, cx, y + h * 0.56, w * 0.9);
        g.addColorStop(0, "rgba(255,248,210," + (0.5 * night).toFixed(3) + ")");
        g.addColorStop(1, "rgba(255,248,210,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - w, y + h * 0.1, w * 2, h);
        ctx.restore();
      }
    } else {
      ctx.fillStyle = "#ff3b30";
      rr(ctx, x + w * 0.12, y + h * 0.52, w * 0.2, h * 0.1, 2); ctx.fill();
      rr(ctx, x + w * 0.68, y + h * 0.52, w * 0.2, h * 0.1, 2); ctx.fill();
      if (night > 0.1 && w > 26) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var g2 = ctx.createRadialGradient(cx, y + h * 0.57, 1, cx, y + h * 0.57, w * 0.55);
        g2.addColorStop(0, "rgba(255,60,48," + (0.35 * night).toFixed(3) + ")");
        g2.addColorStop(1, "rgba(255,60,48,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(cx - w * 0.7, y + h * 0.3, w * 1.4, h * 0.6);
        ctx.restore();
      }
    }

    ctx.fillStyle = "rgba(10,16,28,0.9)";
    ctx.fillRect(x + w * 0.1, y + h * 0.86, w * 0.8, h * 0.08);
  }

  function drawPlayerCar(ctx, cx, baseY, w, night, steer) {
    var h = w * 0.6;
    var x = cx - w / 2;
    var y = baseY - h;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 1, w * 0.52, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#07090f";
    rr(ctx, x - w * 0.02, y + h * 0.54, w * 0.15, h * 0.44, 4); ctx.fill();
    rr(ctx, x + w * 0.87, y + h * 0.54, w * 0.15, h * 0.44, 4); ctx.fill();

    var body = ctx.createLinearGradient(0, y, 0, baseY);
    body.addColorStop(0, "#ff8a5c");
    body.addColorStop(0.5, "#f0442e");
    body.addColorStop(1, "#9e1b17");
    ctx.fillStyle = body;
    rr(ctx, x + w * 0.06, y + h * 0.16, w * 0.88, h * 0.8, w * 0.07); ctx.fill();

    ctx.fillStyle = "#0d1524";
    rr(ctx, x + w * 0.2, y + h * 0.01, w * 0.6, h * 0.37, w * 0.06); ctx.fill();

    var glass = ctx.createLinearGradient(0, y, 0, y + h * 0.4);
    glass.addColorStop(0, "rgba(160,225,255,0.6)");
    glass.addColorStop(1, "rgba(28,58,96,0.3)");
    ctx.fillStyle = glass;
    rr(ctx, x + w * 0.245, y + h * 0.07, w * 0.51, h * 0.22, 4); ctx.fill();

    ctx.fillStyle = "#0b1220";
    rr(ctx, x + w * 0.13, y - h * 0.015, w * 0.74, h * 0.08, 3); ctx.fill();
    ctx.fillStyle = "#1d2940";
    ctx.fillRect(x + w * 0.21, y + h * 0.06, w * 0.05, h * 0.09);
    ctx.fillRect(x + w * 0.74, y + h * 0.06, w * 0.05, h * 0.09);

    ctx.fillStyle = "rgba(255,240,200,0.9)";
    ctx.fillRect(cx - w * 0.035, y + h * 0.18, w * 0.07, h * 0.64);

    ctx.save();
    if (night > 0.08) { ctx.shadowColor = "rgba(255,45,32,0.9)"; ctx.shadowBlur = 18 * night; }
    ctx.fillStyle = "#ff2d20";
    rr(ctx, x + w * 0.12, y + h * 0.52, w * 0.2, h * 0.1, 3); ctx.fill();
    rr(ctx, x + w * 0.68, y + h * 0.52, w * 0.2, h * 0.1, 3); ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#232c3d";
    rr(ctx, x + w * 0.08, y + h * 0.84, w * 0.84, h * 0.1, 3); ctx.fill();
    ctx.fillStyle = "#e8eefc";
    ctx.fillRect(cx - w * 0.08, y + h * 0.865, w * 0.16, h * 0.05);
    ctx.fillStyle = "#1a2233";
    ctx.fillRect(cx - w * 0.06, y + h * 0.875, w * 0.12, h * 0.025);

    /* leve inclinação ao esterçar */
    if (Math.abs(steer) > 0.05) {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(cx + steer * w * 0.5, y + h * 0.3, w * 0.05, h * 0.5);
    }
    ctx.restore();
  }

  /* ==========================================================================
   * 8. JOGO
   * ========================================================================== */
  var TEMPLATE = [
    '<div class="enduro-frame">',
    '  <div class="enduro-hud">',
    '    <div class="enduro-stat"><span class="enduro-stat__label">Velocidade</span><span class="enduro-stat__value"><b data-hud="speed">0</b><i>km/h</i></span></div>',
    '    <div class="enduro-stat"><span class="enduro-stat__label">Distância</span><span class="enduro-stat__value"><b data-hud="distance">0</b><i>m</i></span></div>',
    '    <div class="enduro-stat"><span class="enduro-stat__label">Dia</span><span class="enduro-stat__value"><b data-hud="day">1</b><i data-hud="phase">dia</i></span></div>',
    '    <div class="enduro-stat"><span class="enduro-stat__label">Pontos</span><span class="enduro-stat__value"><b data-hud="score">0</b></span></div>',
    '    <div class="enduro-stat enduro-stat--goal"><span class="enduro-stat__label">Meta do dia</span><span class="enduro-stat__value"><b data-hud="goal">0/20</b></span><span class="enduro-bar"><i data-hud="progress"></i></span></div>',
    '    <div class="enduro-stat"><span class="enduro-stat__label">Batidas</span><span class="enduro-crashes" data-hud="crashes"></span></div>',
    '    <button type="button" class="enduro-icon" data-enduro-sound aria-label="Ligar ou desligar o som" aria-pressed="false"></button>',
    '  </div>',
    '  <div class="enduro-stage">',
    '    <canvas data-enduro-canvas width="960" height="540" aria-label="Pista de corrida do jogo Enduro"></canvas>',
    '    <div class="enduro-overlay" data-enduro-overlay></div>',
    '    <div class="enduro-flash" data-enduro-flash></div>',
    '    <div class="enduro-tag">CANVAS 2D · 60 FPS</div>',
    '  </div>',
    '  <div class="enduro-touch" aria-label="Controles de toque">',
    '    <button type="button" class="enduro-touch__btn" data-key="left" aria-label="Desviar para a esquerda">◀</button>',
    '    <button type="button" class="enduro-touch__btn" data-key="right" aria-label="Desviar para a direita">▶</button>',
    '    <button type="button" class="enduro-touch__btn enduro-touch__btn--wide" data-key="down">FREAR</button>',
    '    <button type="button" class="enduro-touch__btn enduro-touch__btn--wide enduro-touch__btn--gas" data-key="up">ACELERAR</button>',
    '  </div>',
    '  <div class="enduro-foot">',
    '    <span><kbd>←</kbd><kbd>→</kbd> desviar</span>',
    '    <span><kbd>↑</kbd> acelerar</span>',
    '    <span><kbd>↓</kbd> frear</span>',
    '    <span><kbd>P</kbd> pausar</span>',
    '    <span class="enduro-foot__hint">Ultrapasse <b data-hud="goalShort">20</b> carros para virar o dia</span>',
    '  </div>',
    '</div>',
  ].join("\n");

  var ICON_SOUND_ON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var ICON_SOUND_OFF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/></svg>';

  function createGame(root) {
    var canvas = root.querySelector("[data-enduro-canvas]");
    var ctx = canvas.getContext("2d");
    var overlay = root.querySelector("[data-enduro-overlay]");
    var flash = root.querySelector("[data-enduro-flash]");
    var soundBtn = root.querySelector("[data-enduro-sound]");
    var hud = {
      speed: root.querySelector('[data-hud="speed"]'),
      distance: root.querySelector('[data-hud="distance"]'),
      day: root.querySelector('[data-hud="day"]'),
      phase: root.querySelector('[data-hud="phase"]'),
      score: root.querySelector('[data-hud="score"]'),
      goal: root.querySelector('[data-hud="goal"]'),
      goalShort: root.querySelector('[data-hud="goalShort"]'),
      progress: root.querySelector('[data-hud="progress"]'),
      crashes: root.querySelector('[data-hud="crashes"]'),
    };
    var sound = createSound();
    var best = 0;
    try { best = parseInt(window.localStorage.getItem("enduro:best") || "0", 10) || 0; } catch (e) { best = 0; }

    var state = {
      mode: "ready",
      position: 0,
      speed: 0,
      playerX: 0,
      steer: 0,
      distance: 0,
      day: 1,
      goal: CFG.baseGoal,
      dayOvertakes: 0,
      totalOvertakes: 0,
      crashes: 0,
      score: 0,
      night: 0.3,
      shake: 0,
      time: 0,
      skyOffset: 0,
    };

    var keys = { left: false, right: false, up: false, down: false };
    var cars = [];
    for (var i = 0; i < 16; i++) {
      cars.push({
        z: 0, offset: 0, speed: 0, oncoming: false,
        color: CAR_COLORS[i % CAR_COLORS.length],
        counted: true, cooldown: 0,
      });
    }

    var raf = 0;
    var lastTime = 0;
    var flashTimer = 0;

    /* ------------------------------ HUD ------------------------------ */
    function setText(el, value) {
      if (el && el.textContent !== String(value)) el.textContent = String(value);
    }

    function updateCrashes() {
      if (!hud.crashes) return;
      var html = "";
      for (var i = 0; i < CFG.crashLimit; i++) {
        html += '<i class="' + (i < CFG.crashLimit - state.crashes ? "is-full" : "") + '"></i>';
      }
      if (hud.crashes.innerHTML !== html) hud.crashes.innerHTML = html;
    }

    function phaseLabel() {
      if (state.night < 0.22) return "dia";
      if (state.night < 0.55) return "entardecer";
      if (state.night < 0.85) return "noite";
      return "madrugada";
    }

    function updateHud(force) {
      var kmh = Math.round((state.speed / CFG.maxSpeed) * 240);
      setText(hud.speed, kmh);
      if (state.distance < 1000) {
        setText(hud.distance, Math.round(state.distance));
        if (hud.distance && hud.distance.nextElementSibling) hud.distance.nextElementSibling.textContent = "m";
      } else {
        setText(hud.distance, (state.distance / 1000).toFixed(2));
        if (hud.distance && hud.distance.nextElementSibling) hud.distance.nextElementSibling.textContent = "km";
      }
      setText(hud.day, state.day);
      setText(hud.phase, phaseLabel());
      setText(hud.score, formatNumber(state.score));
      setText(hud.goal, state.dayOvertakes + "/" + state.goal);
      setText(hud.goalShort, state.goal);
      if (hud.progress) hud.progress.style.width = clamp((state.dayOvertakes / state.goal) * 100, 0, 100).toFixed(1) + "%";
      updateCrashes();
      if (force) updateSoundButton();
    }

    function updateSoundButton() {
      if (!soundBtn) return;
      var muted = sound.isMuted();
      soundBtn.innerHTML = (muted ? ICON_SOUND_OFF : ICON_SOUND_ON) + '<span>' + (muted ? "SOM OFF" : "SOM ON") + "</span>";
      soundBtn.classList.toggle("is-muted", muted);
      soundBtn.setAttribute("aria-pressed", muted ? "true" : "false");
      soundBtn.setAttribute("aria-label", muted ? "Ligar o som" : "Desligar o som");
    }

    /* ---------------------------- OVERLAY ---------------------------- */
    function showOverlay(html) {
      overlay.innerHTML = '<div class="enduro-overlay__inner">' + html + "</div>";
      overlay.classList.remove("is-hidden");
    }
    function hideOverlay() { overlay.classList.add("is-hidden"); }

    function statsRow(items) {
      return '<div class="enduro-overlay__stats">' + items.map(function (it) {
        return "<div><span>" + it[0] + "</span><b>" + it[1] + "</b></div>";
      }).join("") + "</div>";
    }

    function showReady() {
      state.mode = "ready";
      showOverlay(
        '<p class="enduro-overlay__eyebrow">Atari 2600 · 1983 · recriado em JS</p>' +
        '<h2 class="enduro-overlay__title">ENDURO</h2>' +
        '<p class="enduro-overlay__text">A noite está chegando. Ultrapasse carros, desvie do trânsito em sentido contrário e sobreviva ao nevoeiro.</p>' +
        statsRow([["Recorde", formatNumber(best)], ["Meta do dia", CFG.baseGoal + " carros"], ["Batidas", CFG.crashLimit + " no máximo"]]) +
        '<button type="button" class="enduro-btn enduro-btn--primary" data-enduro-action="start">Iniciar corrida</button>' +
        '<p class="enduro-overlay__hint">ou pressione <kbd>Enter</kbd></p>'
      );
    }

    function showPaused() {
      showOverlay(
        '<p class="enduro-overlay__eyebrow">Intervalo</p>' +
        '<h2 class="enduro-overlay__title">PAUSADO</h2>' +
        '<p class="enduro-overlay__text">A estrada espera por você. Respire e volte quando estiver pronto.</p>' +
        statsRow([["Dia", state.day], ["Pontos", formatNumber(state.score)], ["Distância", state.distance < 1000 ? Math.round(state.distance) + " m" : (state.distance / 1000).toFixed(2) + " km"]]) +
        '<button type="button" class="enduro-btn enduro-btn--primary" data-enduro-action="resume">Continuar</button>' +
        '<p class="enduro-overlay__hint">pressione <kbd>P</kbd> para continuar</p>'
      );
    }

    function showDayComplete() {
      showOverlay(
        '<p class="enduro-overlay__eyebrow">Fim do dia ' + state.day + '</p>' +
        '<h2 class="enduro-overlay__title">AMANHECEU</h2>' +
        '<p class="enduro-overlay__text">Você sobreviveu à noite. O próximo dia traz mais carros e menos margem para erro.</p>' +
        statsRow([["Ultrapassagens", state.dayOvertakes], ["Pontos", formatNumber(state.score)], ["Batidas", state.crashes + "/" + CFG.crashLimit]]) +
        '<button type="button" class="enduro-btn enduro-btn--primary" data-enduro-action="next">Próximo dia</button>' +
        '<p class="enduro-overlay__hint">meta do próximo dia: ' + (state.goal + CFG.goalStep) + ' carros</p>'
      );
    }

    function showGameOver() {
      showOverlay(
        '<p class="enduro-overlay__eyebrow">Fim da linha</p>' +
        '<h2 class="enduro-overlay__title">GAME OVER</h2>' +
        '<p class="enduro-overlay__text">Cinco batidas encerraram a corrida. A estrada é implacável — tente outra vez.</p>' +
        statsRow([["Pontos", formatNumber(state.score)], ["Recorde", formatNumber(best)], ["Dia", state.day], ["Distância", state.distance < 1000 ? Math.round(state.distance) + " m" : (state.distance / 1000).toFixed(2) + " km"]]) +
        '<button type="button" class="enduro-btn enduro-btn--primary" data-enduro-action="restart">Correr de novo</button>' +
        '<p class="enduro-overlay__hint">pressione <kbd>Enter</kbd> para reiniciar</p>'
      );
    }

    /* ----------------------------- CARROS ---------------------------- */
    function placeCar(car, minAhead, maxAhead) {
      car.z = wrap(state.position + PLAYER_Z + rndRange(minAhead, maxAhead), TRACK_LENGTH);
      car.offset = rndRange(-0.72, 0.72);
      car.speed = CFG.maxSpeed * (car.oncoming ? rndRange(0.3, 0.52) : rndRange(0.2, 0.46));
      car.counted = false;
      car.cooldown = 0.5;
    }

    function resetCars() {
      for (var i = 0; i < cars.length; i++) {
        var car = cars[i];
        /* os primeiros carros são todos no mesmo sentido: o jogador tem
           tempo de pegar a estrada antes do primeiro trânsito em sentido
           contrário, que é o mais perigoso. */
        car.oncoming = i >= 4 && i % 3 === 0;
        placeCar(car, 7000 + i * 2400, 9500 + i * 2400);
      }
    }

    function respawnCar(car) {
      placeCar(car, 14000, 42000);
    }

    function registerCrash(car) {
      state.crashes++;
      state.speed = CFG.maxSpeed * 0.16;
      state.shake = 1;
      sound.crash();
      flash.classList.add("is-on");
      window.clearTimeout(flashTimer);
      flashTimer = window.setTimeout(function () { flash.classList.remove("is-on"); }, 190);
      car.cooldown = 3;
      car.counted = true;
      car.z = wrap(state.position + PLAYER_Z + rndRange(7000, 11000), TRACK_LENGTH);
      car.offset = clamp(car.offset + (Math.random() > 0.5 ? 0.9 : -0.9), -0.8, 0.8);
      updateCrashes();
      if (state.crashes >= CFG.crashLimit) endRun();
    }

    function registerOvertake() {
      state.dayOvertakes++;
      state.totalOvertakes++;
      sound.blip(760 + Math.min(state.dayOvertakes, 12) * 30);
      if (state.dayOvertakes >= state.goal) completeDay();
    }

    function updateCars(dt) {
      var playerZPos = state.position + PLAYER_Z;
      for (var i = 0; i < cars.length; i++) {
        var car = cars[i];
        if (car.cooldown > 0) car.cooldown -= dt;
        var before = wrapDelta(car.z - playerZPos, TRACK_LENGTH);
        car.z = wrap(car.z + (car.oncoming ? -car.speed : car.speed) * dt, TRACK_LENGTH);
        var after = wrapDelta(car.z - playerZPos, TRACK_LENGTH);

        if (car.cooldown <= 0 && Math.abs(after) < 260 && Math.abs(car.offset - state.playerX) < 0.32) {
          registerCrash(car);
          if (state.mode !== "running") return;
        } else if (!car.counted && before > 0 && after <= 0) {
          car.counted = true;
          registerOvertake();
          if (state.mode !== "running") return;
        }

        if (after < -9000 || after > 46000) respawnCar(car);
      }
    }

    /* --------------------------- ESTADOS ----------------------------- */
    function startRun() {
      sound.init();
      state.mode = "running";
      state.position = 0;
      state.speed = CFG.maxSpeed * 0.22;
      state.playerX = 0;
      state.steer = 0;
      state.distance = 0;
      state.day = 1;
      state.goal = CFG.baseGoal;
      state.dayOvertakes = 0;
      state.totalOvertakes = 0;
      state.crashes = 0;
      state.score = 0;
      state.night = 0;
      state.shake = 0;
      state.time = 0;
      resetCars();
      hideOverlay();
      updateHud(true);
      if (root.focus) root.focus({ preventScroll: true });
    }

    function endRun() {
      state.mode = "over";
      state.speed = 0;
      sound.engine(0, false);
      if (state.score > best) {
        best = state.score;
        try { window.localStorage.setItem("enduro:best", String(best)); } catch (e) { /* ok */ }
      }
      showGameOver();
    }

    function completeDay() {
      state.mode = "day";
      sound.engine(0, false);
      sound.blip(1180);
      if (state.score > best) {
        best = state.score;
        try { window.localStorage.setItem("enduro:best", String(best)); } catch (e) { /* ok */ }
      }
      showDayComplete();
    }

    function nextDay() {
      state.day++;
      state.goal = CFG.baseGoal + (state.day - 1) * CFG.goalStep;
      state.dayOvertakes = 0;
      state.crashes = 0;
      state.speed = CFG.maxSpeed * 0.22;
      state.playerX = 0;
      state.night = 0;
      state.mode = "running";
      resetCars();
      hideOverlay();
      updateHud(true);
      if (root.focus) root.focus({ preventScroll: true });
    }

    function togglePause() {
      if (state.mode === "running") {
        state.mode = "paused";
        sound.engine(0, false);
        showPaused();
      } else if (state.mode === "paused") {
        state.mode = "running";
        hideOverlay();
        sound.init();
      }
    }

    function toggleSound() {
      sound.init();
      sound.setMuted(!sound.isMuted());
      updateSoundButton();
    }

    /* ---------------------------- UPDATE ----------------------------- */
    function update(dt) {
      state.time += dt;
      state.skyOffset += (state.speed / CFG.maxSpeed) * dt * 60 + dt * 6;

      if (state.mode === "ready") {
        state.speed = CFG.maxSpeed * 0.34;
        state.position = wrap(state.position + state.speed * dt, TRACK_LENGTH);
        state.playerX = Math.sin(state.time * 0.45) * 0.42;
        state.night = 0.34 + Math.sin(state.time * 0.12) * 0.16;
        state.score = 0;
        updateHud();
        return;
      }

      if (state.mode !== "running") {
        updateHud();
        return;
      }

      var speedRatio = state.speed / CFG.maxSpeed;
      var dx = dt * CFG.steer * Math.max(0.3, speedRatio);
      var steerInput = 0;
      if (keys.left) { state.playerX -= dx; steerInput -= 1; }
      if (keys.right) { state.playerX += dx; steerInput += 1; }
      state.steer = interpolate(state.steer, steerInput, Math.min(1, dt * 10));

      var playerSegment = findSegment(state.position + PLAYER_Z);
      state.playerX -= dx * speedRatio * playerSegment.curve * CFG.centrifugal;

      if (keys.up) state.speed += CFG.accel * dt;
      else if (keys.down) state.speed += CFG.brake * dt;
      else state.speed += CFG.accel * 0.45 * dt;

      if ((state.playerX < -1 || state.playerX > 1) && state.speed > CFG.offRoadLimit) {
        state.speed += CFG.offRoadDecel * dt;
        state.shake = Math.max(state.shake, 0.25);
      }

      state.speed = clamp(state.speed, 0, CFG.maxSpeed);
      state.playerX = clamp(state.playerX, -2.3, 2.3);
      state.position = wrap(state.position + state.speed * dt, TRACK_LENGTH);

      var kmh = (state.speed / CFG.maxSpeed) * 240;
      state.distance += (kmh / 3.6) * dt;
      state.score = Math.floor(state.distance / 10) + state.totalOvertakes * 50 + (state.day - 1) * 250;

      var progress = clamp(state.dayOvertakes / state.goal, 0, 1);
      state.night = clamp((progress - 0.18) / 0.82, 0, 1);
      state.shake = Math.max(0, state.shake - dt * 2.6);

      updateCars(dt);
      sound.engine(state.speed / CFG.maxSpeed, true);
      updateHud();
    }

    /* ---------------------------- RENDER ----------------------------- */
    function project(p, cameraX, cameraY, cameraZ) {
      p.camera.x = (p.world.x || 0) - cameraX;
      p.camera.y = (p.world.y || 0) - cameraY;
      p.camera.z = (p.world.z || 0) - cameraZ;
      p.screen.scale = CAMERA_DEPTH / p.camera.z;
      p.screen.x = Math.round(CFG.width / 2 + (p.screen.scale * p.camera.x * CFG.width) / 2);
      p.screen.y = Math.round(CFG.height / 2 - (p.screen.scale * p.camera.y * CFG.height) / 2);
      p.screen.w = Math.round((p.screen.scale * CFG.roadWidth * CFG.width) / 2);
    }

    function renderSegment(seg, pal) {
      var p1 = seg.p1.screen, p2 = seg.p2.screen;
      var light = seg.color === "light";
      var grass = light ? pal.grassLight : pal.grassDark;
      var road = light ? pal.roadLight : pal.roadDark;
      var rumble = light ? pal.rumbleLight : pal.rumbleDark;
      var r1 = p1.w / 5, r2 = p2.w / 5;
      var l1 = p1.w / 26, l2 = p2.w / 26;

      ctx.fillStyle = grass;
      ctx.fillRect(0, p2.y, CFG.width, p1.y - p2.y + 1);

      polygon(ctx, p1.x - p1.w - r1, p1.y, p1.x - p1.w, p1.y, p2.x - p2.w, p2.y, p2.x - p2.w - r2, p2.y, rumble);
      polygon(ctx, p1.x + p1.w + r1, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x + p2.w + r2, p2.y, rumble);
      polygon(ctx, p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, road);

      if (light) {
        var laneW1 = (p1.w * 2) / CFG.lanes;
        var laneW2 = (p2.w * 2) / CFG.lanes;
        var lx1 = p1.x - p1.w + laneW1;
        var lx2 = p2.x - p2.w + laneW2;
        for (var lane = 1; lane < CFG.lanes; lane++) {
          polygon(ctx, lx1 - l1 / 2, p1.y, lx1 + l1 / 2, p1.y, lx2 + l2 / 2, p2.y, lx2 - l2 / 2, p2.y, pal.lane);
          lx1 += laneW1;
          lx2 += laneW2;
        }
      }

      if (seg.fog < 1) {
        ctx.globalAlpha = 1 - seg.fog;
        ctx.fillStyle = pal.fog;
        ctx.fillRect(0, p2.y, CFG.width, p1.y - p2.y + 1);
        ctx.globalAlpha = 1;
      }
    }

    function render() {
      var W = CFG.width, H = CFG.height;
      var pal = getPalette(state.night);
      var baseSegment = findSegment(state.position);
      var basePercent = (state.position % CFG.segmentLength) / CFG.segmentLength;
      var playerSegment = findSegment(state.position + PLAYER_Z);
      var playerPercent = ((state.position + PLAYER_Z) % CFG.segmentLength) / CFG.segmentLength;
      var playerY = interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
      var speedRatio = state.speed / CFG.maxSpeed;
      var progress = state.mode === "ready" ? (state.time * 0.03) % 1 : clamp(state.dayOvertakes / state.goal, 0, 1);
      var fogDensity = 1.5 + state.night * 2.4 + (state.day % 3 === 0 ? 1.1 : 0);
      var shakeX = state.shake > 0 ? (Math.random() - 0.5) * 12 * state.shake : 0;
      var shakeY = state.shake > 0 ? (Math.random() - 0.5) * 9 * state.shake : 0;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.translate(shakeX, shakeY);

      drawSky(ctx, W, H, pal, state.night, progress, state.skyOffset + state.playerX * 60);

      var maxy = H;
      var x = 0;
      var dx = -(baseSegment.curve * basePercent);
      var cameraX = state.playerX * CFG.roadWidth;
      var cameraY = playerY + CFG.cameraHeight;
      var camZ = state.position;

      for (var n = 0; n < CFG.drawDistance; n++) {
        var seg = segments[(baseSegment.index + n) % segments.length];
        seg.looped = seg.index < baseSegment.index;
        seg.fog = exponentialFog(n / CFG.drawDistance, fogDensity);
        seg.clip = maxy;
        var segmentCamZ = camZ - (seg.looped ? TRACK_LENGTH : 0);
        project(seg.p1, cameraX - x, cameraY, segmentCamZ);
        project(seg.p2, cameraX - x - dx, cameraY, segmentCamZ);
        x += dx;
        dx += seg.curve;

        if (seg.p1.camera.z <= CAMERA_DEPTH || seg.p2.screen.y >= seg.p1.screen.y || seg.p2.screen.y >= maxy) continue;
        renderSegment(seg, pal);
        maxy = seg.p2.screen.y;
      }

      /* carros: de longe para perto */
      var visible = [];
      for (var c = 0; c < cars.length; c++) {
        var car = cars[c];
        var rel = wrapDelta(car.z - (state.position + PLAYER_Z), TRACK_LENGTH);
        if (rel <= 0 || rel > CFG.drawDistance * CFG.segmentLength) continue;
        var carSeg = findSegment(car.z);
        if (!carSeg.p1.screen.scale) continue;
        visible.push({ car: car, rel: rel, seg: carSeg });
      }
      visible.sort(function (a, b) { return b.rel - a.rel; });
      for (var v = 0; v < visible.length; v++) {
        var item = visible[v];
        var seg2 = item.seg;
        var pct = (item.car.z % CFG.segmentLength) / CFG.segmentLength;
        var scale = interpolate(seg2.p1.screen.scale, seg2.p2.screen.scale, pct);
        var sx = interpolate(seg2.p1.screen.x, seg2.p2.screen.x, pct) + (scale * item.car.offset * CFG.roadWidth * W) / 2;
        var sy = interpolate(seg2.p1.screen.y, seg2.p2.screen.y, pct);
        var cw = scale * CFG.roadWidth * 0.32 * (W / 2);
        if (cw < 2 || sy < 0 || sy > H + 40) continue;
        drawTrafficCar(ctx, sx, sy, cw, item.car.color, item.car.oncoming, state.night);
      }

      /* carro do jogador */
      var bounce = Math.sin(state.time * 22) * speedRatio * 1.8 + (state.playerX < -1 || state.playerX > 1 ? Math.sin(state.time * 40) * 2 : 0);
      drawPlayerCar(ctx, W / 2 + state.steer * 10, H - 16 + bounce, 250, state.night, state.steer);

      /* faróis e vinheta noturna */
      if (state.night > 0.04) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var beam = ctx.createRadialGradient(W / 2, H * 0.94, 20, W / 2, H * 0.94, H * 0.9);
        beam.addColorStop(0, "rgba(255,238,180," + (0.22 * state.night).toFixed(3) + ")");
        beam.addColorStop(0.4, "rgba(255,226,150," + (0.08 * state.night).toFixed(3) + ")");
        beam.addColorStop(1, "rgba(255,226,150,0)");
        ctx.fillStyle = beam;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        var vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.86);
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0," + (0.6 * state.night).toFixed(3) + ")");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
    }

    /* ----------------------------- LOOP ------------------------------ */
    function frame(now) {
      raf = window.requestAnimationFrame(frame);
      if (!root.isConnected) {
        window.cancelAnimationFrame(raf);
        return;
      }
      if (!lastTime) lastTime = now;
      var dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      update(dt);
      render();
    }

    /* ---------------------------- EVENTOS ---------------------------- */
    function onKeyDown(e) {
      var tag = e.target && e.target.tagName ? e.target.tagName : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      var k = e.key;
      if (k === "ArrowLeft" || k === "a" || k === "A") { keys.left = true; if (state.mode === "running") e.preventDefault(); }
      else if (k === "ArrowRight" || k === "d" || k === "D") { keys.right = true; if (state.mode === "running") e.preventDefault(); }
      else if (k === "ArrowUp" || k === "w" || k === "W") { keys.up = true; if (state.mode === "running") e.preventDefault(); }
      else if (k === "ArrowDown" || k === "s" || k === "S") { keys.down = true; if (state.mode === "running") e.preventDefault(); }
      else if (k === " " || k === "p" || k === "P" || k === "Escape") {
        if (state.mode === "running" || state.mode === "paused") e.preventDefault();
        togglePause();
      } else if (k === "Enter") {
        if (state.mode === "ready" || state.mode === "over") { e.preventDefault(); startRun(); }
        else if (state.mode === "day") { e.preventDefault(); nextDay(); }
        else if (state.mode === "paused") { e.preventDefault(); togglePause(); }
      }
    }

    function onKeyUp(e) {
      var k = e.key;
      if (k === "ArrowLeft" || k === "a" || k === "A") keys.left = false;
      else if (k === "ArrowRight" || k === "d" || k === "D") keys.right = false;
      else if (k === "ArrowUp" || k === "w" || k === "W") keys.up = false;
      else if (k === "ArrowDown" || k === "s" || k === "S") keys.down = false;
    }

    function clearKeys() { keys.left = keys.right = keys.up = keys.down = false; }

    function onVisibility() {
      if (document.hidden) {
        clearKeys();
        if (state.mode === "running") togglePause();
      }
    }

    overlay.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-enduro-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-enduro-action");
      if (action === "start" || action === "restart") startRun();
      else if (action === "resume") togglePause();
      else if (action === "next") nextDay();
    });

    if (soundBtn) soundBtn.addEventListener("click", toggleSound);

    var touchButtons = root.querySelectorAll("[data-key]");
    Array.prototype.forEach.call(touchButtons, function (btn) {
      var key = btn.getAttribute("data-key");
      function press(e) {
        e.preventDefault();
        keys[key] = true;
        if (state.mode === "ready" || state.mode === "over") startRun();
        else if (state.mode === "paused") togglePause();
        btn.classList.add("is-pressed");
        if (btn.setPointerCapture && e.pointerId !== undefined) {
          try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
        }
      }
      function release(e) {
        if (e) e.preventDefault();
        keys[key] = false;
        btn.classList.remove("is-pressed");
      }
      btn.addEventListener("pointerdown", press);
      btn.addEventListener("pointerup", release);
      btn.addEventListener("pointercancel", release);
      btn.addEventListener("pointerleave", release);
      btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    });

    canvas.addEventListener("pointerdown", function () {
      if (root.focus) root.focus({ preventScroll: true });
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    document.addEventListener("visibilitychange", onVisibility);

    root.tabIndex = 0;
    updateSoundButton();
    updateCrashes();
    showReady();
    updateHud(true);
    raf = window.requestAnimationFrame(frame);

    return {
      start: startRun,
      pause: togglePause,
      destroy: function () {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("blur", clearKeys);
        document.removeEventListener("visibilitychange", onVisibility);
      },
    };
  }

  /* ==========================================================================
   * 9. MONTAGEM
   * ========================================================================== */
  var games = [];
  var STYLE_ID = "enduro-styles";

  /* Injeta o CSS do jogo uma única vez. */
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = GAME_CSS;
    var head = document.head || document.getElementsByTagName("head")[0];
    (head || document.body).appendChild(style);
  }

  /* Procura um container já existente na página. */
  function findContainer() {
    return (
      document.querySelector("[data-enduro]") ||
      document.querySelector("#enduro-game") ||
      document.querySelector(".enduro")
    );
  }

  /* Se não existir container, cria um logo depois da tag <script>.
     Assim você só precisa do arquivo .js e da tag <script>. */
  function ensureContainer() {
    var existing = findContainer();
    if (existing) return existing;

    var container = document.createElement("div");
    container.className = "enduro";
    container.setAttribute("data-enduro", "");

    var script = SELF_SCRIPT;
    var parent = script && script.parentElement;
    if (parent && parent.tagName !== "HEAD" && document.body && document.body.contains(parent)) {
      parent.insertBefore(container, script.nextSibling);
    } else if (document.body) {
      document.body.appendChild(container);
    }
    return container;
  }

  function mount(container) {
    if (!container || container.getAttribute("data-enduro-mounted") === "1") return null;
    container.setAttribute("data-enduro-mounted", "1");
    container.innerHTML = TEMPLATE;
    var game = createGame(container);
    games.push(game);
    return game;
  }

  function mountAll() {
    injectStyles();
    var nodes = document.querySelectorAll("[data-enduro]");
    if (!nodes.length) {
      var container = ensureContainer();
      if (container) mount(container);
      return;
    }
    Array.prototype.forEach.call(nodes, function (node) { mount(node); });
  }

  function destroyAll() {
    games.forEach(function (game) { game.destroy(); });
    games = [];
    var nodes = document.querySelectorAll("[data-enduro]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.removeAttribute("data-enduro-mounted");
      node.innerHTML = "";
    });
  }

  window.EnduroGame = {
    mountAll: mountAll,
    mount: mount,
    destroyAll: destroyAll,
    startAll: function () { games.forEach(function (game) { game.start(); }); },
    version: "1.1.0",
  };

  function boot() {
    injectStyles();
    mountAll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
