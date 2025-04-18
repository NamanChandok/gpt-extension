const SITE_CONFIGS = {
  chatgpt: {
    inputSelector: "#prompt-textarea p",
    buttonStyles:
      "height: calc(var(--spacing)*9); width: calc(var(--spacing)*9); display: flex; justify-content: center; align-items:center; color: #b4b4b4; border: 1px solid #2c2c2c; border-radius: 50%; cursor: pointer;",
  },
  claudeAi: {
    inputSelector: ".ProseMirror p",
    buttonStyles:
      "position: absolute; right: 200px; bottom: .875rem; z-index: 9999; height: 2rem; width: 2rem; display: flex; justify-content: center; align-items:center; color: hsla(50, 9%, 74%, 1); border: 1px solid hsla(51, 17%, 85%, 0.15); border-radius: .5rem; cursor: pointer;",
  },
  gemini: {
    inputSelector: ".ql-editor p",
    buttonStyles:
      "position: absolute; right: 60px; bottom: 12px; z-index: 9999; height: 36px; width: 36px; display: flex; justify-content: center; align-items:center; color: #9a9b9c; background: #282a2c; border:none; border-radius: 50%; cursor: pointer;",
  },
  deepseek: {
    inputSelector: "#chat-input",
    buttonStyles:
      "position: absolute; right: 90px; bottom: 8px; z-index: 9999; height: 36px; width: 36px; display: flex; justify-content: center; align-items:center; color: #F8FAFF; background: transparent; border: 1px solid #626262; border-radius: 50%; cursor: pointer;",
  },
};

const getCurrentWebsite = () => {
  const host = window.location.hostname;
  if (host.includes("chatgpt.com")) return "chatgpt";
  if (host.includes("claude.ai")) return "claudeAi";
  if (host.includes("gemini.google.com")) return "gemini";
  if (host.includes("chat.deepseek.com")) return "deepseek";
  return "chatgpt"; // Default to ChatGPT if unknown
};

// Cache DOM references and avoid repeated lookups
let cachedInput = null;
let previousText = "";
let transformationInProgress = false;

const currentSite = getCurrentWebsite();
const findInput = () => {
  // Use cached input if available
  if (cachedInput) return cachedInput;

  const input = document.querySelector(SITE_CONFIGS[currentSite].inputSelector);
  if (!input) {
    console.error("Input element not found");
    return null;
  }
  // Cache the input element for future use
  cachedInput = input;
  return input;
};

const createButton = () => {
  const targetInput = findInput();
  if (!targetInput) {
    console.log("Input element not found for", currentSite);
    return null;
  }

  const formatButton = document.createElement("button");
  // Use more efficient SVG setup
  formatButton.innerHTML =
    '<svg class="w-[18px] h-[18px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/></svg>';
  formatButton.style.cssText = SITE_CONFIGS[currentSite].buttonStyles;

  // Add a visual indicator for the button
  const originalColor = formatButton.style.color;
  const originalBorderColor = formatButton.style.borderColor;

  // Pre-compile prompts for each mode to avoid string concatenation during click
  const createPrompt = (mode, text) => {
    const basePrompt =
      "Enhance this prompt to make it easier to understand for an AI assistant";

    switch (mode) {
      case "development":
        return `${basePrompt} in context of a programming task: '${text}' Return only the new prompt as text. Give an output no matter what.`;
      case "academic":
        return `${basePrompt} in context of an academic assignment: '${text}' Return only the new prompt as text. Give an output no matter what.`;
      case "fun":
        return `${basePrompt} in a fun context: '${text}' Return only the new prompt as text. Give an output no matter what.`;
      default: // "default" mode
        return `${basePrompt}: '${text}' Return only the new prompt as text. Give an output no matter what.`;
    }
  };

  formatButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // Prevent multiple clicks while processing
    if (transformationInProgress) {
      console.log("Transformation already in progress");
      return;
    }

    // Visual feedback - button turns to processing state
    transformationInProgress = true;
    formatButton.style.color = "#4caf50"; // Green color to indicate processing
    formatButton.style.borderColor = "#4caf50";
    formatButton.style.cursor = "wait";
    formatButton.disabled = true;

    // Get text based on site type
    let original_text =
      currentSite === "deepseek" ? targetInput.value : targetInput.textContent;

    if (!original_text || original_text === "") {
      console.log("No text to format");
      resetButtonState();
      return;
    }

    // Check if the text is the same as the previous request to avoid unnecessary API calls
    if (original_text === previousText) {
      console.log("Text already transformed, skipping API call");
      resetButtonState();
      return;
    }

    previousText = original_text;

    try {
      // Use chrome.storage.sync.get as a Promise for cleaner code
      const getStorageData = () => {
        return new Promise((resolve) => {
          chrome.storage.sync.get(["mode"], (data) =>
            resolve(data.mode || "default"),
          );
        });
      };

      const mode = await getStorageData();
      const prompt = createPrompt(mode, original_text);

      // Make the API request
      const response = await fetchTransformedText(prompt);

      // Update the input field with the transformed text
      updateInputWithTransformedText(targetInput, response);
    } catch (error) {
      console.error("Error during transformation:", error);
    } finally {
      resetButtonState();
    }

    function resetButtonState() {
      transformationInProgress = false;
      formatButton.style.color = originalColor;
      formatButton.style.borderColor = originalBorderColor;
      formatButton.style.cursor = "pointer";
      formatButton.disabled = false;
    }
  });

  // Optimize the API call function
  async function fetchTransformedText(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBaIdrU-XwT0kpANWQUOkqaMNs_qtvuDTc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API response: ${res.status}`);
      }

      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("API fetch error:", error);
      return original_text; // Return original text on error
    }
  }

  // Function to update the input field with transformed text
  function updateInputWithTransformedText(input, text) {
    if (currentSite === "deepseek") {
      input.value = text;

      // Batch DOM updates with requestAnimationFrame
      requestAnimationFrame(() => {
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });

        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      });
    } else {
      input.textContent = text;

      requestAnimationFrame(() => {
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  }

  // Find parent element with optimized approach
  let inputParent;
  if (currentSite === "chatgpt") {
    inputParent = document.querySelector("div.ms-auto.flex.items-center");
  } else if (currentSite === "claudeAi") {
    inputParent = findClaudeParent(targetInput);
  } else if (currentSite === "deepseek") {
    inputParent = findDeepseekParent(targetInput);
  } else {
    inputParent = findDefaultParent(targetInput);
  }

  if (!inputParent) {
    console.error("Could not find suitable parent element");
    return;
  }

  // Only set position once
  if (inputParent.style.position !== "relative") {
    inputParent.style.position = "relative";
  }

  inputParent.prepend(formatButton);

  function findClaudeParent(input) {
    return (
      input.closest(".parent-container") ||
      input.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode
    );
  }

  function findDeepseekParent(input) {
    if (input.parentNode && input.parentNode.parentNode) {
      return input.parentNode.parentNode;
    }
    return document.querySelector("._77cefa5");
  }

  function findDefaultParent(input) {
    return (
      input.closest(".parent-container") ||
      input.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode.parentNode
    );
  }
};

// More efficient element detection with early exit
const waitForElement = (selector, maxAttempts = 10, interval = 300) => {
  let attempts = 0;

  const checkElement = () => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`Element ${selector} found`);
      createButton();
      return true;
    }

    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(checkElement, interval);
      return false;
    }

    console.error(
      `Element ${selector} not found after ${maxAttempts} attempts`,
    );
    return false;
  };

  return checkElement();
};

// Use requestIdleCallback for non-critical initialization
window.addEventListener("load", () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      waitForElement(SITE_CONFIGS[currentSite].inputSelector);
    });
  } else {
    setTimeout(() => {
      waitForElement(SITE_CONFIGS[currentSite].inputSelector);
    }, 100);
  }
});
