const SITE_CONFIGS = {
  chatgpt: {
    inputSelector: "#prompt-textarea p",
    buttonStyles:
      "position: absolute; right: calc(var(--spacing)*13); bottom: calc(var(--spacing)*2); z-index: 9999; height: calc(var(--spacing)*9); width: calc(var(--spacing)*9); display: flex; justify-content: center; align-items:center; color: #b4b4b4; border: 1px solid #ffffff1a; border-radius: 50%; cursor: pointer;",
  },
  claudeAi: {
    inputSelector: ".ProseMirror p",
    buttonStyles:
      "position: absolute; right: 12.5rem; bottom: .875rem; z-index: 9999; height: 2rem; width: 2rem; display: flex; justify-content: center; align-items:center; color: hsla(50, 9%, 74%, 1); border: 1px solid hsla(51, 17%, 85%, 0.15); border-radius: .5rem; cursor: pointer;",
  },
  gemini: {
    inputSelector: ".ql-editor p",
    buttonStyles:
      "position: absolute; right: 60px; bottom: 12px; z-index: 9999; height: 36px; width: 36px; display: flex; justify-content: center; align-items:center; color: #5f6368; background: #282a2c; border:none; border-radius: 50%; cursor: pointer;",
  },
};

const getCurrentWebsite = () => {
  const host = window.location.hostname;
  if (host.includes("chatgpt.com")) return "chatgpt";
  if (host.includes("claude.ai")) return "claudeAi";
  if (host.includes("gemini.google.com")) return "gemini";
  return "chatgpt"; // Default to ChatGPT if unknown
};

const currentSite = getCurrentWebsite();

const findInput = () => {
  const input = document.querySelector(SITE_CONFIGS[currentSite].inputSelector);
  if (!input) {
    console.error("Input element not found");
    return null;
  }
  return input;
};

const createButton = () => {
  const targetInput = findInput();
  if (!targetInput) return null;

  const formatButton = document.createElement("button");
  formatButton.innerHTML =
    '<svg class="w-[18px] h-[18px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/></svg>';
  formatButton.style.cssText = SITE_CONFIGS[currentSite].buttonStyles;
  // console.log("buttonAdded");

  formatButton.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submit
    const original_text = targetInput.textContent;
    if (original_text == "") return;

    chrome.storage.sync.get(["mode"], async (data) => {
      const mode = data.mode;
      let prompt;
      if (mode === "default") {
        prompt =
          "Enhance this prompt to make it easier to understand for an AI assistant: '" +
          original_text +
          "' Return only the new prompt as text. Give an output no matter what.";
      } else if (mode === "development") {
        prompt =
          "Enhance this prompt to make it easier to understand for an AI assistant in context of a programming task: '" +
          original_text +
          "' Return only the new prompt as text. Give an output no matter what.";
      } else if (mode === "academic") {
        prompt =
          "Enhance this prompt to make it easier to understand for an AI assistant in context of an academic assignment: '" +
          original_text +
          "' Return only the new prompt as text. Give an output no matter what.";
      } else if (mode === "fun") {
        prompt =
          "Enhance this prompt to make it easier to understand for an AI assistant in a fun context: '" +
          original_text +
          "' Return only the new prompt as text. Give an output no matter what.";
      }

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBaIdrU-XwT0kpANWQUOkqaMNs_qtvuDTc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );
      const response = await res.json();
      // console.log(response.candidates[0].content.parts[0].text);
      const transformedText = response.candidates[0].content.parts[0].text;
      targetInput.textContent = transformedText;
      targetInput.dispatchEvent(new Event("input", { bubbled: true }));
    });

    // const transformedText = "bruh, " + original_text;

    // targetInput.textContent = transformedText;
    // targetInput.dispatchEvent(new Event("input", { bubbled: true }));
    // input event created for webpage error handling
  });

  // Place the button near the input field
  let inputParent;
  if (currentSite == "claudeAi") {
    inputParent =
      targetInput.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode;
  } else {
    inputParent =
      targetInput.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode.parentNode.parentNode;
  }
  inputParent.style.position = "relative";
  inputParent.appendChild(formatButton);
};

window.addEventListener("load", () => {
  setTimeout(createButton, 1000); // Slight delay to ensure dynamic elements are loaded
});
