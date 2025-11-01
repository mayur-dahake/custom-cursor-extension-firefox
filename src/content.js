// src/content.js

// Listen for cursor change messages from popup.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SET_CURSOR") {
    applyCustomCursor(msg.cursorSpec);
  }
});

// Apply saved cursor on load
chrome.storage.local.get(["cursorSpec"], (res) => {
  if (res.cursorSpec) {
    applyCustomCursor(res.cursorSpec);
  }
});

function applyCustomCursor(cursorSpec) {
  // Remove any previously injected style
  const existingStyle = document.getElementById("custom-cursor-style");
  if (existingStyle) existingStyle.remove();

  // Create a new <style> element
  const style = document.createElement("style");
  style.id = "custom-cursor-style";

  if (!cursorSpec || cursorSpec === "none") {
    style.innerHTML = `* { cursor: auto !important; }`;
  } else {
    style.innerHTML = `* { cursor: ${cursorSpec} !important; }`;
  }

  document.head.appendChild(style);
}
