"""
Run this once from inside the claude-rtl-extension folder:
    python download_fonts.py
Downloads Vazirmatn (Persian) and Outfit (Latin) woff2 files into fonts/
"""
import urllib.request, os, re, sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR  = os.path.join(SCRIPT_DIR, 'fonts')
os.makedirs(FONTS_DIR, exist_ok=True)

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36')

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def save(name, data):
    path = os.path.join(FONTS_DIR, name)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'  saved  {name}  ({len(data)//1024} KB)')

# ── Vazirmatn (Persian) ── from jsDelivr mirror of rastikerdar/vazirmatn
print('Vazirmatn:')
BASE = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/'
for name in ['Vazirmatn-Regular.woff2', 'Vazirmatn-Medium.woff2', 'Vazirmatn-Bold.woff2']:
    try:
        save(name, fetch(BASE + name))
    except Exception as e:
        print(f'  ERROR {name}: {e}', file=sys.stderr)

# ── Outfit (Latin) ── fetch CSS from Google Fonts, extract latin woff2 URLs
print('Outfit:')
try:
    css = fetch(
        'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap'
    ).decode('utf-8')

    # Each block looks like:  /* latin */  @font-face { … url(…woff2) … font-weight: NNN … }
    pattern = re.compile(
        r'/\*\s*([\w\s-]+?)\s*\*/\s*@font-face\s*\{([^}]+)\}',
        re.DOTALL
    )
    downloaded = set()
    for m in pattern.finditer(css):
        subset = m.group(1).strip()
        block  = m.group(2)
        if subset != 'latin':
            continue
        w = re.search(r'font-weight:\s*(\d+)', block)
        u = re.search(r"url\(([^)]+\.woff2)\)", block)
        if not w or not u:
            continue
        weight = w.group(1)
        if weight in downloaded:
            continue
        downloaded.add(weight)
        name = 'Outfit-Regular.woff2' if weight == '400' else 'Outfit-Medium.woff2'
        save(name, fetch(u.group(1)))
except Exception as e:
    print(f'  ERROR Outfit: {e}', file=sys.stderr)

print('\nDone. Reload the extension in chrome://extensions/')
