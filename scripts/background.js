chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Prompt Formatter extension installed");

  // Initialize mode
  chrome.storage.sync.set({
    mode: "default",
  });
});
