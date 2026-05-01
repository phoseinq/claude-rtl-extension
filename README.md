# Claude RTL

A Chrome extension that automatically fixes text direction on [claude.ai](https://claude.ai) — right-to-left for Persian/Arabic, left-to-right for English, paragraph by paragraph.

![icon](icon128.png)

## Features

- Auto-detects Persian and English text in every message
- RTL for Persian, LTR for English — per paragraph
- Applies **Vazirmatn** font to Persian text and **Outfit** font to English text
- Fixes the chat input box direction while typing
- Settings popup with live font preview and adjustable detection threshold
- Code blocks always stay LTR — never broken

## Installation

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

## Settings

Click the extension icon in Chrome toolbar to open settings:

| Setting | Description |
|---|---|
| Enable / Disable | Master toggle |
| Detection Threshold | Minimum % of RTL characters to trigger right-align (default 25%) |
| Vazirmatn font | Apply Vazirmatn to Persian text |
| Outfit font | Apply Outfit to Latin text |
| Fix input direction | Auto-switch chat box direction while typing |

## Font Setup

Fonts are bundled. If you cloned the repo without them, run once:

```bash
python download_fonts.py
```

Then reload the extension in `chrome://extensions/`.

## License

Published under [MIT](./LICENSE).
