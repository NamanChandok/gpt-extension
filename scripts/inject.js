// inject.js
(function () {
    function updateMetaAIInput(text) {
      const editable = document.querySelector('[contenteditable="true"]');
      if (!editable) return;
  
      editable.focus();
  
      const range = document.createRange();
      range.selectNodeContents(editable);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  
      document.execCommand('insertText', false, text);
    }
  
    window.addEventListener('metaAIReplaceText', (e) => {
      updateMetaAIInput(e.detail.text);
    });
  })();
  