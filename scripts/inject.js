(function () {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  function getEditable() {
    return document.querySelector('[contenteditable="true"]');
  }

  async function clearLexicalWithBackspace() {
    const input = getEditable();
    if (!input) return;

    input.focus();

    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    for (let i = 0; i < 100; i++) {
      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        code: "Backspace",
        keyCode: 8,
        which: 8,
        bubbles: true,
      });
      input.dispatchEvent(event);
      await delay(15);
      if (input.innerText.trim() === "") break;
    }
  }

  async function replaceText(text) {
    const input = getEditable();
    if (!input) return;

    await clearLexicalWithBackspace();

    const event = new InputEvent("input", {
      inputType: "insertText",
      data: text,
      bubbles: true,
    });

    input.textContent = text;
    input.dispatchEvent(event);
  }

  // Listen for calls from content.js
  window.addEventListener("EXTENSION_REPLACE_TEXT", (e) => {
    replaceText(e.detail);
  });
})();
