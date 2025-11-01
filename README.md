# 🖱️ Custom Cursor — Cross‑Browser Browser Extension

A **lightweight, cross‑browser (Chrome, Edge, Firefox)** extension that lets users personalize their browsing experience with fun and elegant mouse cursors. Easily switch between a collection of cursor styles or restore the default cursor with one click.

---

## ✨ Features

- 🎨 **One‑click cursor changer** — Change your mouse pointer instantly from the popup.
- 🖼️ **Collection of stylish cursors** — Choose from a built‑in set or add your own images.
- 💾 **Persistent settings** — Keeps your selected cursor even after restarting the browser.
- 💡 **Presentation‑friendly** — Highlight your cursor to help audiences follow during demos or screen recordings.
- 🧩 **Cross‑browser** — Works in **Chrome**, **Edge**, and **Firefox** (Manifest V3).

---

## 🧭 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/<your-username>/custom-cursor-extension.git
cd custom-cursor-extension
```

### 2. Load in Browser

#### Chrome / Edge

1. Open `chrome://extensions` or `edge://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the project folder

#### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file

---

## 📂 Folder Structure

```
custom-cursor-extension/
├─ icons/                 # Extension icons
│  ├─ icon-16.png
│  ├─ icon-48.png
│  └─ icon-128.png
├─ cursors/               # Cursor images
│  ├─ classic-arrow.png
│  ├─ star-cursor.png
│  └─ fancy-dot.cur
├─ src/
│  ├─ popup.html          # Popup UI
│  ├─ popup.js            # Popup logic
│  ├─ popup.css           # Popup styles
│  ├─ content.js          # Injected script applying cursor
│  └─ service-worker.js   # Background logic
├─ manifest.json          # Chrome/Edge/Firefox MV3 manifest
└─ README.md
```

---

## ⚙️ How It Works

1. The popup lets users select a cursor image.
2. The selection is stored using `chrome.storage.local`.
3. The `content.js` script applies a CSS rule like:

   ```css
   * {
     cursor: url("cursor-image.png") 8 8, auto !important;
   }
   ```

4. The cursor remains active until cleared or changed again.

---

## 🧰 Development

### Prerequisites

- Node.js (optional, if you plan to build additional tooling)
- A Chromium-based or Firefox browser

### Debugging Tips

- Use **Developer Tools → Console** in popup and page to view logs.
- Some pages (like `chrome://` or the Web Store) do not allow extensions to inject scripts — this is normal.

---

## 🌈 Customizing Cursors

You can add new cursor images to the `/cursors` folder.

- Supported formats: `.png`, `.cur`, `.ico`, `.svg`
- Recommended size: **24x24 to 48x48 px**
- Update `CURSORS` array in `src/popup.js` to include your new file.

Example:

```js
{ id: 'sparkle', name: 'Sparkle', file: 'cursors/sparkle.png', hotspot: '4 4' }
```

---

## 🧩 Manifest Permissions

```json
"permissions": [
  "storage",
  "activeTab",
  "scripting"
],
"host_permissions": ["<all_urls>"]
```

- **storage** — Save selected cursor choice.
- **activeTab** — Access and modify current page.
- **scripting** — Inject cursor style dynamically.
- **host_permissions** — Allow cursor to work on any webpage.

---

## 🔒 Known Limitations

- Does not work on browser‑internal pages (e.g., `chrome://`, `addons.mozilla.org`).
- Some web apps with strict CSP (Content Security Policy) may block style injection.
- Inline styles with high specificity may override the cursor CSS.

---

## 🚀 Future Enhancements

- 🔧 Add **Options Page** to upload your own cursor images.
- 🌐 Create a **cursor store** with downloadable packs.
- ⚡ Add **keyboard shortcuts** to toggle or cycle cursors.
- 🧠 Store per‑site preferences.

---

## 🪄 Credits

- Designed & Developed by **Mayur Dahake**
- Inspired by fun personalization tools like _Custom Cursor for Chrome_

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and share.

```text
MIT License
Copyright (c) 2025 Mayur Dahake

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
