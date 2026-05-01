const RTL_RANGE = /[֐-׿؀-ۿݐ-ݿࢠ-ࣿיִ-﷿ﹰ-﻿]/g;
const EMOJI    = /[\u{1F000}-\u{1FFFF}\u{2300}-\u{27FF}\u{2B00}-\u{2BFF}]/gu;
const NEUTRAL  = /[\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~‌‍‎‏]/g;

const FONTS_ID  = 'claude-rtl-fonts';
const BLOCK_SEL = 'p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, dt, dd';

let cfg = {
  enabled: true, threshold: 25,
  fontPersian: true, fontEnglish: true, fixInput: true, fixCodeBlocks: false,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

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

function applyToBlock(el) {
  if (!cfg.fixCodeBlocks && el.closest('pre, code')) return;
  const dir = getDir(el.textContent || '');
  if (!dir) return;
  if (el.dataset.rtlDir === dir) return;   // already up-to-date

  el.style.direction = dir;
  el.style.textAlign = dir === 'rtl' ? 'right' : 'left';
  const font = fontFor(dir);
  if (font) el.style.fontFamily = font;
  el.dataset.rtlDir = dir;
}

function resetBlock(el) {
  el.style.direction = el.style.textAlign = el.style.fontFamily = '';
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
  // Clear caches so applyToBlock re-evaluates with new cfg
  document.querySelectorAll('[data-rtl-dir]').forEach(el => delete el.dataset.rtlDir);
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

chrome.storage.onChanged.addListener(changes => {
  if (!changes.rtlSettings) return;
  cfg = Object.assign(cfg, changes.rtlSettings.newValue);
  reprocessAll();
});

// ─── MutationObserver ────────────────────────────────────────────────────────

let debounce;
new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(processAll, 120);
}).observe(document.body, { childList: true, subtree: true, characterData: true });
