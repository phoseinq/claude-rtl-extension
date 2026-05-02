const RTL_RANGE = /[֐-׿؀-ۿݐ-ݿࢠ-ࣿיִ-﷿ﹰ-﻿]/g;
const EMOJI    = /[\u{1F000}-\u{1FFFF}\u{2300}-\u{27FF}\u{2B00}-\u{2BFF}]/gu;
const NEUTRAL  = /[\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~‌‍‎‏]/g;

const FONTS_ID  = 'claude-rtl-fonts';
const BLOCK_SEL = 'p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, dt, dd';
// Common line-wrapper selectors used by shiki, prism-react-renderer, CodeMirror 6, Monaco
const LINE_SEL  = '.line, .token-line, .cm-line, .view-line';

let cfg = {
  enabled: true, threshold: 25,
  fontPersian: true, fontEnglish: true, fixInput: true, fixCodeBlocks: false,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

// First strong character — Unicode Bidi P2/P3 algorithm
// Scans until it finds a clearly RTL or LTR letter and returns its direction.
function firstStrongDir(text) {
  for (const ch of text) {
    if (RTL_RANGE.test(ch))  { RTL_RANGE.lastIndex = 0; return 'rtl'; }
    if (/[A-Za-zÀ-ɏ]/.test(ch)) return 'ltr';
  }
  return null;
}

function getDir(text) {
  const clean = text.replace(EMOJI, '').replace(NEUTRAL, '');
  if (clean.length < 2) return null;
  const rtl = (clean.match(RTL_RANGE) || []).length;
  return rtl / clean.length > (cfg.threshold / 100) ? 'rtl' : 'ltr';
}

function fontFor(dir) {
  if (dir === 'rtl' && cfg.fontPersian) return "'Vazirmatn', sans-serif";
  if (dir === 'ltr' && cfg.fontEnglish) return "'Outfit', sans-serif";
  return '';
}

// ─── Font injection ─────────────────────────────────────────────────────────

function injectFonts() {
  if (document.getElementById(FONTS_ID)) return;
  const b = chrome.runtime.getURL('fonts/');
  const style = document.createElement('style');
  style.id = FONTS_ID;
  style.textContent = [
    `@font-face{font-family:'Vazirmatn';src:url('${b}Vazirmatn-Regular.woff2')format('woff2');font-weight:400;font-display:swap}`,
    `@font-face{font-family:'Vazirmatn';src:url('${b}Vazirmatn-Medium.woff2')format('woff2');font-weight:500;font-display:swap}`,
    `@font-face{font-family:'Vazirmatn';src:url('${b}Vazirmatn-Bold.woff2')format('woff2');font-weight:700;font-display:swap}`,
    `@font-face{font-family:'Outfit';src:url('${b}Outfit-Regular.woff2')format('woff2');font-weight:400;font-display:swap}`,
    `@font-face{font-family:'Outfit';src:url('${b}Outfit-Medium.woff2')format('woff2');font-weight:500;font-display:swap}`,
  ].join('\n');
  (document.head || document.documentElement).appendChild(style);
}

function removeFonts() {
  document.getElementById(FONTS_ID)?.remove();
}

// ─── Block processing ────────────────────────────────────────────────────────

// Per-line detection: find line wrappers inside <code> and apply direction individually.
// Uses setProperty('...', 'important') to beat the "pre * { direction: ltr !important }" rule.
// Returns true if line wrappers were found and processed.
function applyToLines(pre) {
  const code = pre.querySelector('code');
  if (!code) return false;
  const lines = code.querySelectorAll(LINE_SEL);
  if (lines.length < 2) return false;

  lines.forEach(line => {
    if (line.dataset.rtlDir) return;
    const dir = firstStrongDir(line.textContent || '');
    if (!dir) return;
    line.style.setProperty('direction', dir, 'important');
    line.style.setProperty('text-align', dir === 'rtl' ? 'right' : 'left', 'important');
    line.style.setProperty('display', 'block', 'important');
    line.dataset.rtlDir = dir;
  });
  return true;
}

function applyToBlock(el) {
  const codeParent = el.closest('pre, code');

  if (codeParent) {
    if (!cfg.fixCodeBlocks) return;
    if (codeParent !== el) return;
    // Prefer per-line detection; fall back to whole-block if no line wrappers exist.
    if (applyToLines(el)) return;
    const dir = firstStrongDir(el.textContent || '');
    if (!dir || el.dataset.rtlDir === dir) return;
    el.dataset.rtlDir = dir;   // CSS attribute rule handles the actual styling
    return;
  }

  // Use first-strong-character (Unicode Bidi P2/P3) for every block:
  // the first clearly RTL or LTR letter decides direction.
  // Ratio-based detection failed on mixed lines like "F = 0 توی ردیف‌های ..."
  // because Persian comment words pushed the ratio above the threshold.
  const dir = firstStrongDir(el.textContent || '');
  if (!dir || el.dataset.rtlDir === dir) return;

  el.style.direction = dir;
  el.style.textAlign = dir === 'rtl' ? 'right' : 'left';
  const font = fontFor(dir);
  if (font) el.style.fontFamily = font;
  el.dataset.rtlDir = dir;
}

function resetBlock(el) {
  el.style.direction = el.style.textAlign = el.style.fontFamily = el.style.display = '';
  delete el.dataset.rtlDir;
}

// ─── Input handling ──────────────────────────────────────────────────────────

function updateInputDir(input) {
  if (!cfg.fixInput) return;
  const text = input.tagName === 'TEXTAREA' ? input.value : (input.textContent || '');
  const dir  = getDir(text) || 'ltr';
  if (input.dataset.rtlInputDir === dir) return;
  input.style.direction = dir;
  input.style.textAlign = dir === 'rtl' ? 'right' : 'left';
  const font = fontFor(dir);
  if (font) input.style.fontFamily = font;
  input.dataset.rtlInputDir = dir;
}

function watchInputs() {
  document.querySelectorAll(
    'textarea, div[contenteditable="true"], div[role="textbox"]'
  ).forEach(input => {
    if (input.dataset.rtlWatch) return;
    input.dataset.rtlWatch = '1';
    input.addEventListener('input', () => updateInputDir(input));
    updateInputDir(input);
  });
}

// ─── Main pass ───────────────────────────────────────────────────────────────

function processAll() {
  if (!cfg.enabled) return;
  if (cfg.fontPersian || cfg.fontEnglish) injectFonts(); else removeFonts();
  document.querySelectorAll(BLOCK_SEL).forEach(applyToBlock);
  if (cfg.fixCodeBlocks) document.querySelectorAll('pre').forEach(applyToBlock);
  watchInputs();
}

function disableAll() {
  removeFonts();
  document.querySelectorAll('[data-rtl-dir]').forEach(resetBlock);
  document.querySelectorAll('[data-rtl-watch]').forEach(el => {
    el.style.direction = el.style.textAlign = el.style.fontFamily = '';
    delete el.dataset.rtlWatch;
    delete el.dataset.rtlInputDir;
  });
}

function reprocessAll() {
  // Clear all previously applied styles + caches so processAll re-evaluates from scratch.
  // Must clear styles (not just attributes) because per-line setProperty !important styles
  // won't be re-applied if fixCodeBlocks is now off.
  document.querySelectorAll('[data-rtl-dir]').forEach(resetBlock);
  document.querySelectorAll('[data-rtl-watch]').forEach(el => {
    delete el.dataset.rtlWatch;
    delete el.dataset.rtlInputDir;
  });
  if (cfg.enabled) processAll(); else disableAll();
}

// ─── Storage ─────────────────────────────────────────────────────────────────

chrome.storage.sync.get('rtlSettings', ({ rtlSettings }) => {
  if (rtlSettings) cfg = Object.assign(cfg, rtlSettings);
  if (cfg.enabled) processAll();
});

// Direct message from popup — instant, no page refresh needed
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== 'rtlSettingsUpdated') return;
  cfg = Object.assign(cfg, msg.settings);
  reprocessAll();
});

// ─── MutationObserver ────────────────────────────────────────────────────────

let debounce;
new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(processAll, 120);
}).observe(document.body, { childList: true, subtree: true, characterData: true });
