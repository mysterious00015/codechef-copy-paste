
(() => {
  "use strict";

  // Prevent duplicate initialization
  if (window.__codeChefCopyActive) return;
  window.__codeChefCopyActive = true;

  // ==========================================
  // MYSTERIOUS PREMIUM CONFIGURATION
  // ==========================================

  const CONFIG = {
    buttonText: "Copy",
    successText: "✓ Copied!",
    errorText: "Copy failed"
  };

  // --------------------------------
  // PREMIUM COPY BUTTON STYLING
  // --------------------------------

  const css = `
    .copyBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-width: 88px;
      border: 1px solid rgba(96,165,250,.4);
      border-radius: 9px;
      background: linear-gradient(135deg,#2563eb,#1d4ed8);
      color: white;
      padding: 8px 17px;
      margin: 8px;
      font-family: system-ui,sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .3px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(37,99,235,.22);
      transition: all .22s ease;
    }

    .copyBtn:hover {
      background: linear-gradient(135deg,#3b82f6,#2563eb);
      box-shadow: 0 6px 20px rgba(37,99,235,.35);
      transform: translateY(-2px);
    }

    .copyBtn:active {
      transform: scale(.96);
    }

    .copyBtn:disabled {
      opacity: .85;
      cursor: default;
    }

    .copyBtn.cc-success {
      background: linear-gradient(135deg,#059669,#047857);
      border-color: rgba(52,211,153,.4);
      box-shadow: 0 4px 14px rgba(5,150,105,.2);
    }

    .copyBtn.cc-error {
      background: linear-gradient(135deg,#dc2626,#991b1b);
      border-color: rgba(248,113,113,.4);
    }
  `;

  function addStyles() {
    if (document.getElementById("cc-copy-styles")) return;

    const style = document.createElement("style");
    style.id = "cc-copy-styles";
    style.textContent = css;

    (document.head || document.documentElement).appendChild(style);
  }

  // --------------------------------
  // COPY SAMPLE TEST CASES
  // --------------------------------

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      return success;
    }
  }

  // --------------------------------
  // CREATE PREMIUM COPY BUTTONS
  // --------------------------------

  function addCopyButtons() {
    document.querySelectorAll("pre").forEach((test) => {
      if (test.dataset.ccCopyAdded) return;

      test.dataset.ccCopyAdded = "true";

      const button = document.createElement("button");
      button.className = "copyBtn";
      button.type = "button";
      button.textContent = CONFIG.buttonText;

      button.addEventListener("click", async () => {
        if (button.disabled) return;

        const success = await copyText(test.innerText);

        button.textContent = success
          ? CONFIG.successText
          : CONFIG.errorText;

        button.classList.toggle("cc-success", success);
        button.classList.toggle("cc-error", !success);

        button.disabled = true;

        setTimeout(() => {
          button.textContent = CONFIG.buttonText;
          button.classList.remove("cc-success", "cc-error");
          button.disabled = false;
        }, 1500);
      });

      test.parentNode.insertBefore(button, test);
    });
  }

  // --------------------------------
  // IDENTIFY CODE EDITORS
  // --------------------------------

  function isEditor(element) {
    if (!(element instanceof Element)) return false;

    return !!element.closest([
      "textarea",
      "input",
      "[contenteditable='true']",
      ".monaco-editor",
      ".monaco-editor textarea",
      ".ace_editor",
      ".ace_text-input",
      ".CodeMirror",
      ".cm-editor",
      ".cm-content",
      ".cm-textarea",
      ".editor"
    ].join(","));
  }

  // --------------------------------
  // ORIGINAL PASTE EVENT HANDLING
  // --------------------------------

  document.addEventListener("paste", (event) => {
    if (isEditor(event.target)) {
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    const pasteShortcut =
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "v";

    if (pasteShortcut && isEditor(event.target)) {
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener("contextmenu", (event) => {
    if (isEditor(event.target)) {
      event.stopImmediatePropagation();
    }
  }, true);

  // --------------------------------
  // AUTOMATIC INITIALIZATION
  // --------------------------------

  function initialize() {
    addStyles();
    addCopyButtons();

    const observer = new MutationObserver(() => {
      addCopyButtons();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    initialize();
  }

})();
