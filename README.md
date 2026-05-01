<div align="center">

# ⇄ Claude RTL

<img src="https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Extension">
<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
<img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License">

**Automatic RTL/LTR text direction for claude.ai — Persian right-to-left, English left-to-right**  
**تنظیم خودکار جهت متن در claude.ai — فارسی راست‌چین، انگلیسی چپ‌چین**

[English](#english) | [فارسی](#فارسی)

---

</div>

## English

### 📖 Description

**Claude RTL** is a Chrome extension that automatically detects text language on [claude.ai](https://claude.ai) and applies the correct text direction — right-to-left for Persian/Arabic and left-to-right for English, paragraph by paragraph in real time.

**Key Features:**
- 🔤 **Smart detection** — Analyzes each paragraph independently
- 🅰️ **Vazirmatn font** — Clean modern Persian typography
- 🔡 **Outfit font** — Minimal Latin typography
- ⌨️ **Input fix** — Chat box switches direction while you type
- 💻 **Code blocks safe** — Always stay LTR, never broken
- ⚙️ **Settings popup** — Live preview and adjustable threshold

---

### 🚀 Installation

1. [Download the repository](https://github.com/phoseinq/claude-rtl-extension/archive/refs/heads/master.zip) and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the extracted folder

---

### ⚙️ Settings

Click the extension icon in the Chrome toolbar to open the settings panel:

| Setting | Description |
|---|---|
| **Enable / Disable** | Master on/off toggle |
| **Detection Threshold** | Minimum % of RTL characters to trigger right-align (default 25%) |
| **Vazirmatn font** | Apply Vazirmatn to Persian text |
| **Outfit font** | Apply Outfit to English text |
| **Fix input direction** | Auto-switch the chat input box direction while typing |

---

### 📝 How It Works

1. **Scan** — Finds all paragraph-level elements in the page
2. **Detect** — Counts RTL characters (Arabic/Persian) vs total characters (emojis and numbers excluded)
3. **Apply** — Sets `direction: rtl` + right-align, or `direction: ltr` + left-align
4. **Font** — Injects bundled Vazirmatn / Outfit via `@font-face`
5. **Watch** — MutationObserver keeps scanning as new messages stream in

---

### 🔧 Font Setup

Fonts are bundled in the `fonts/` folder. If you cloned the repo and fonts are missing, run once:

```bash
python download_fonts.py
```

Then click **Reload** in `chrome://extensions/`.

---

### 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

### 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

---

### ⭐ Support

If this project helped you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 📢 Sharing with others

---

<div dir="rtl" align="right">

## فارسی

### 📖 معرفی

**Claude RTL** یک افزونه کروم هست که به صورت خودکار زبان متن رو در [claude.ai](https://claude.ai) تشخیص می‌ده و جهت درست رو اعمال می‌کنه — راست‌چین برای فارسی و عربی، چپ‌چین برای انگلیسی، پاراگراف به پاراگراف و در لحظه.

**امکانات کلیدی:**
- 🔤 **تشخیص هوشمند** — هر پاراگراف مستقل بررسی می‌شه
- 🅰️ **فونت Vazirmatn** — تایپوگرافی مدرن و خوانای فارسی
- 🔡 **فونت Outfit** — تایپوگرافی مینیمال لاتین
- ⌨️ **تصحیح ورودی** — کادر چت هنگام تایپ جهتش عوض می‌شه
- 💻 **بلاک‌های کد سالم** — همیشه چپ‌چین می‌مونن و خراب نمی‌شن
- ⚙️ **پنل تنظیمات** — پیش‌نمایش زنده و آستانه قابل تنظیم

---

### 🚀 نصب

1. [دانلود ریپازیتوری](https://github.com/phoseinq/claude-rtl-extension/archive/refs/heads/master.zip) و اکسترکت کن
2. در کروم آدرس `chrome://extensions/` رو باز کن
3. **Developer mode** رو از گوشه بالا-راست روشن کن
4. روی **Load unpacked** کلیک کن و پوشه رو انتخاب کن

---

### ⚙️ تنظیمات

روی آیکون افزونه در نوار ابزار کروم کلیک کن تا پنل تنظیمات باز بشه:

| تنظیم | توضیح |
|---|---|
| **فعال / غیرفعال** | کلید اصلی روشن/خاموش |
| **آستانه تشخیص** | حداقل درصد کاراکتر RTL برای راست‌چین شدن (پیش‌فرض ۲۵٪) |
| **فونت Vazirmatn** | اعمال Vazirmatn به متن فارسی |
| **فونت Outfit** | اعمال Outfit به متن انگلیسی |
| **تصحیح جهت ورودی** | تغییر خودکار جهت کادر تایپ هنگام نوشتن فارسی |

---

### 📝 نحوه کار

1. **اسکن** — تمام المان‌های پاراگراف‌لول صفحه رو پیدا می‌کنه
2. **تشخیص** — کاراکترهای RTL (عربی/فارسی) رو در برابر کل کاراکترها می‌شماره (ایموجی و عدد حذف می‌شن)
3. **اعمال** — `direction: rtl` + راست‌چین، یا `direction: ltr` + چپ‌چین
4. **فونت** — Vazirmatn / Outfit بسته‌شده رو از طریق `@font-face` تزریق می‌کنه
5. **پایش** — MutationObserver ادامه می‌ده و پیام‌های جدید رو هم پردازش می‌کنه

---

### 🔧 راه‌اندازی فونت

فونت‌ها در پوشه `fonts/` همراه ریپو هستن. اگه با clone فونت‌ها نیومدن، یه‌بار این دستور رو بزن:

```bash
python download_fonts.py
```

بعد در `chrome://extensions/` روی **Reload** کلیک کن.

---

### 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده — فایل [LICENSE](LICENSE) رو ببین.

---

### 🤝 مشارکت

مشارکت‌ها خوش‌آمدن! می‌تونی:
- 🐛 باگ گزارش کنی
- 💡 ایده پیشنهاد بدی
- 🔧 پول ریکوئست بفرستی

---

### ⭐ حمایت

اگه این پروژه بهت کمک کرد، لطفاً:
- ⭐ به ریپازیتوری ستاره بده
- 🐛 مشکلات رو گزارش کن
- 📢 با دیگران به اشتراک بذار

---

</div>

<div align="center">

**Made with ❤️ for Persian Claude users**

[گزارش باگ](https://github.com/phoseinq/claude-rtl-extension/issues) · [درخواست قابلیت](https://github.com/phoseinq/claude-rtl-extension/issues)

</div>
