import { renderBubbleSort } from "./algorithms/bubble.js";

window.array = [];
window.isSorting = false;
window.pauseRequested = false;
window.killRequested = false;
window.animationSpeed = 300;

function generateArray(size = 8) {
  if (window.isSorting) return;
  window.array = [];
  for (let i = 0; i < size; i++) {
    window.array.push(Math.floor(Math.random() * 99) + 1);
  }
  drawArray();
  showMessage("✨ New array generated");
}

function drawArray() {
  const container = document.getElementById("array-container");
  if (!container) return;
  container.innerHTML = "";

  window.array.forEach(value => {
    const wrapper = document.createElement("div");
    wrapper.className = "box-wrapper";

    const arrowUp = document.createElement("div");
    arrowUp.className = "arrow-up";
    arrowUp.innerHTML = `<svg><use xlink:href="#curve-arrow-right"></use></svg>`;

    const box = document.createElement("div");
    box.className = "box";
    box.textContent = value;

    const arrowDown = document.createElement("div");
    arrowDown.className = "arrow-down";
    arrowDown.innerHTML = `<svg><use xlink:href="#curve-arrow-left"></use></svg>`;

    wrapper.append(arrowUp, box, arrowDown);
    container.appendChild(wrapper);
  });
}

function showMessage(msg) {
  const m = document.getElementById("message");
  if (m) m.textContent = msg;
}

async function sleep(ms = window.animationSpeed) {
  return new Promise(res => setTimeout(res, ms));
}

async function handlePause() {
  while (window.pauseRequested && !window.killRequested) {
    await sleep(100);
  }
}

function togglePause() {
  window.pauseRequested = !window.pauseRequested;
  const btn = document.getElementById("pauseBtn");
  btn.textContent = window.pauseRequested ? "▶ Continue" : "⏸ Pause";
}

function killSort() {
  window.killRequested = true;
  showMessage("🛑 Sorting stopped");
  setTimeout(() => {
    generateArray();
    window.killRequested = false;
    window.isSorting = false;
  }, 500);
}

function resetButtons() {
  window.isSorting = false;
  window.pauseRequested = false;
  const pauseBtn = document.getElementById("pauseBtn");
  const killBtn = document.getElementById("killBtn");
  if (pauseBtn) {
    pauseBtn.textContent = "⏸ Pause";
    pauseBtn.disabled = true;
  }
  if (killBtn) killBtn.disabled = true;
}

window.generateArray = generateArray;
window.drawArray = drawArray;
window.showMessage = showMessage;
window.sleep = sleep;
window.handlePause = handlePause;
window.togglePause = togglePause;
window.killSort = killSort;
window.resetButtons = resetButtons;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("bubbleBtn").addEventListener("click", () => {
    renderBubbleSort(document.getElementById("algo-container"));
  });
  // Load bubble sort by default
  renderBubbleSort(document.getElementById("algo-container"));
});
window.copyCode = function (id) {
  const codeEl = document.getElementById(id);
  if (!codeEl) return;
  const text = codeEl.textContent;
  navigator.clipboard.writeText(text).then(() => {
    window.showMessage("✅ Code copied!");
  }).catch(() => {
    window.showMessage("❌ Failed to copy.");
  });
};

window.useUserArray = function () {
  if (window.isSorting) return;

  const input = document.getElementById("userArray");
  if (!input) return;

  const raw = input.value;
  if (!raw.trim()) {
    window.showMessage("⚠️ Please enter array elements.");
    return;
  }

  const parts = raw
    .split(",")
    .map(x => parseInt(x.trim()))
    .filter(x => !isNaN(x));

  if (parts.length === 0) {
    window.showMessage("⚠️ No valid numbers found.");
    return;
  }

  window.array = parts;
  window.drawArray();
  window.showMessage("✅ Custom array loaded!");
};

