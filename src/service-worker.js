// Minimal: listens for install/activate events if you want to setup default data.
chrome.runtime.onInstalled.addListener(() => {
  // Ensure there's a default cursor value
  chrome.storage.local.get(["cursor"], (res) => {
    if (!res.cursor) {
      chrome.storage.local.set({ cursor: "none" });
    }
  });
});
