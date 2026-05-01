const DEFAULTS = {
  enabled: true,
  threshold: 25,
  fontPersian: true,
  fontEnglish: true,
  fixInput: true,
};

const $ = id => document.getElementById(id);

const els = {
  enabled:      $('enabled'),
  threshold:    $('threshold'),
  thresholdVal: $('thresholdVal'),
  fontPersian:  $('fontPersian'),
  fontEnglish:  $('fontEnglish'),
  fixInput:     $('fixInput'),
  statusDot:    $('statusDot'),
  statusText:   $('statusText'),
  prevFa:       $('prevFa'),
  prevEn:       $('prevEn'),
};

function setStatus(on) {
  els.statusDot.className  = 'status-dot' + (on ? '' : ' off');
  els.statusText.textContent = on ? 'فعال' : 'غیرفعال';
}

function updateSliderFill(input) {
  const min = +input.min, max = +input.max, val = +input.value;
  // slider is RTL-dir visually (right = low, left = high)
  const pct = ((val - min) / (max - min)) * 100;
  // gradient goes right-to-left in RTL layout
  input.style.setProperty('--fill', pct + '%');
}

function updatePreview(fontPersian, fontEnglish) {
  els.prevFa.style.fontFamily = fontPersian
    ? "'Vazirmatn', sans-serif"
    : "'Segoe UI', 'Tahoma', sans-serif";
  els.prevEn.style.fontFamily = fontEnglish
    ? "'Outfit', sans-serif"
    : "'Segoe UI', 'Arial', sans-serif";
}

function collect() {
  return {
    enabled:     els.enabled.checked,
    threshold:   +els.threshold.value,
    fontPersian: els.fontPersian.checked,
    fontEnglish: els.fontEnglish.checked,
    fixInput:    els.fixInput.checked,
  };
}

function save() {
  const s = collect();
  chrome.storage.sync.set({ rtlSettings: s });
  setStatus(s.enabled);
  updatePreview(s.fontPersian, s.fontEnglish);
}

// Load saved settings on open
chrome.storage.sync.get('rtlSettings', ({ rtlSettings }) => {
  const s = Object.assign({}, DEFAULTS, rtlSettings);

  els.enabled.checked     = s.enabled;
  els.threshold.value     = s.threshold;
  els.fontPersian.checked = s.fontPersian;
  els.fontEnglish.checked = s.fontEnglish;
  els.fixInput.checked    = s.fixInput;

  els.thresholdVal.textContent = s.threshold + '%';
  updateSliderFill(els.threshold);
  setStatus(s.enabled);
  updatePreview(s.fontPersian, s.fontEnglish);
});

// Slider — live
els.threshold.addEventListener('input', () => {
  els.thresholdVal.textContent = els.threshold.value + '%';
  updateSliderFill(els.threshold);
  save();
});

// All checkboxes
['enabled', 'fontPersian', 'fontEnglish', 'fixInput'].forEach(k => {
  els[k].addEventListener('change', save);
});
