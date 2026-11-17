
(() => {
  "use strict";

  const toggle = document.getElementById("pasteToggle");
  const state = document.getElementById("pasteState");

  if (!toggle || !state) return;

  let saving = false;

  function updateUI(enabled) {
    toggle.checked = enabled;

    state.textContent = enabled
      ? "ENABLED"
      : "DISABLED";

    state.className = enabled
      ? "enabled"
      : "disabled";
  }

  function showError() {
    state.textContent = "STORAGE ERROR";
    state.className = "disabled";
  }

  // Load saved setting.
  chrome.storage.local.get(
    { pasteCompatibilityEnabled: true },
    (result) => {
      if (chrome.runtime.lastError) {
        showError();
        return;
      }

      updateUI(result.pasteCompatibilityEnabled);
    }
  );

  // Save whenever the switch changes.
  toggle.addEventListener("change", () => {
    if (saving) return;

    saving = true;
    toggle.disabled = true;

    const enabled = toggle.checked;

    chrome.storage.local.set(
      { pasteCompatibilityEnabled: enabled },
      () => {
        saving = false;
        toggle.disabled = false;

        if (chrome.runtime.lastError) {
          showError();
          return;
        }

        updateUI(enabled);
      }
    );
  });

})();
