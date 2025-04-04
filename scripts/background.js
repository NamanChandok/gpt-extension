chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Prompt Formatter extension installed");

  // Initialize with the four preset transformation templates
  chrome.storage.sync.set({
    transformationTemplates: [
      {
        name: "Default",
        description: "Standard prompt format",
        template: "bruh, {text}",
      },
      {
        name: "Development",
        description: "Format for coding and development tasks",
        template: "coder, {text}",
      },
      {
        name: "Academic",
        description: "Format for academic research and study",
        template: "padhai, {text}",
      },
      {
        name: "Fun",
        description: "Creative and entertaining format",
        template: "ganja, {text}",
      },
    ],
    activeTemplateIndex: 0,
  });
});
