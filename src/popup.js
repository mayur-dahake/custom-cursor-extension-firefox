import { CURSORS } from "../cursors/index.js";

// Restricted URLs where content scripts cannot be injected
const RESTRICTED_PATTERNS = [
  "chrome://",
  "edge://",
  "about:",
  "moz-extension://",
  "chrome-extension://",
];

// === Utility Functions ===

function makeCursorSpec(file, hotspot) {
  if (!file) return "none";
  const url = chrome.runtime.getURL(file);
  return `url("${url}") ${hotspot || ""}, auto`;
}

function queryActiveTabs() {
  return new Promise((resolve) => {
    chrome.tabs.query({ url: ["http://*/*", "https://*/*"] }, (tabs) =>
      resolve(tabs)
    );
  });
}

async function isRestrictedTab(tab) {
  if (!tab || !tab.url) return true;
  return RESTRICTED_PATTERNS.some((pattern) => tab.url.startsWith(pattern));
}

// === Core Logic ===

function buildList(selectedId) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  CURSORS.forEach((c) => {
    const div = document.createElement("div");
    div.className = "item";
    div.title = c.name;

    const img = document.createElement("img");
    img.className = "preview";
    img.src = c.file ? chrome.runtime.getURL(c.file) : "";

    const label = document.createElement("div");
    label.textContent = c.name;

    if (c.id === selectedId) div.style.outline = "2px solid #0078d4";

    div.appendChild(img);
    div.appendChild(label);

    div.addEventListener("click", async () => {
      const spec = makeCursorSpec(c.file, c.hotspot);

      await chrome.storage.local.set({ cursor: c.id, cursorSpec: spec });

      const tabs = await queryActiveTabs();
      for (const t of tabs) {
        if (await isRestrictedTab(t)) {
          console.warn("Skipping restricted URL:", t.url);
          continue;
        }

        try {
          await chrome.tabs.sendMessage(t.id, {
            type: "SET_CURSOR",
            cursorSpec: spec,
          });
        } catch (e) {
          // If tab doesn’t have the content script, try injecting it
          try {
            await chrome.scripting.executeScript({
              target: { tabId: t.id },
              files: ["src/content.js"],
            });
            await chrome.tabs.sendMessage(t.id, {
              type: "SET_CURSOR",
              cursorSpec: spec,
            });
          } catch (ex) {
            console.warn("❌ Could not inject content script on tab", t.id, ex);
          }
        }
      }

      window.close();
    });

    list.appendChild(div);
  });
}

// === Clear Button ===
document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ cursor: "none", cursorSpec: "" });

  const tabs = await queryActiveTabs();
  for (const t of tabs) {
    if (await isRestrictedTab(t)) continue;
    chrome.tabs.sendMessage(t.id, { type: "SET_CURSOR", cursorSpec: "" });
  }

  window.close();
});

// === Auto-Inject Content Script (for first use) ===
(async function autoInjectIfNeeded() {
  const [tab] = await queryActiveTabs();
  if (!tab || (await isRestrictedTab(tab))) return;

  try {
    // Attempt to inject silently
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content.js"],
    });
    console.log("✅ Auto-injected content script successfully.");
  } catch (err) {
    console.warn("⚠️ Auto-injection skipped:", err.message);
  }
})();

// === Initialize Popup ===
chrome.storage.local.get(["cursor"], (res) => {
  const selected = res.cursor || "none";
  buildList(selected);
});
