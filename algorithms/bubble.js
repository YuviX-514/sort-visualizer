export function renderBubbleSort(container) {
  container.innerHTML = `
    <div class="algo-description">
      <h2>Bubble Sort</h2>
      <p>Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.</p>
      <div class="complexity">
        <div class="complexity-item"><span class="complexity-label">Worst-case:</span> O(n²)</div>
        <div class="complexity-item"><span class="complexity-label">Average-case:</span> O(n²)</div>
        <div class="complexity-item"><span class="complexity-label">Best-case:</span> O(n)</div>
        <div class="complexity-item"><span class="complexity-label">Space:</span> O(1)</div>
      </div>
    </div>
    <div class="visualization-section">
      <div class="controls">
        <button onclick="window.generateArray()">Generate Array</button>
        <button onclick="window.startSort()">Start Sort</button>
        <button id="pauseBtn" onclick="window.togglePause()" disabled>⏸ Pause</button>
        <button id="killBtn" onclick="window.killSort()" disabled>Stop</button>
      </div>
      <div id="array-container"></div>
      <div id="message"></div>
    </div>
    <div class="code-container">
      <div class="code-header">
        <span>Java Implementation</span>
        <button class="copy-btn" onclick="window.copyCode('bubble-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="bubble-code"><span class="keyword">public</span> <span class="keyword">class</span> BubbleSort {
  <span class="keyword">public static void</span> bubbleSort(<span class="keyword">int</span>[] arr) {
    <span class="keyword">int</span> n = arr.length;
    <span class="keyword">for</span> (<span class="keyword">int</span> i = 0; i &lt; n-1; i++) {
      <span class="keyword">for</span> (<span class="keyword">int</span> j = 0; j &lt; n-i-1; j++) {
        <span class="keyword">if</span> (arr[j] &gt; arr[j+1]) {
          <span class="keyword">int</span> temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
      }
    }
  }
}</pre>
    </div>
  `;

  window.generateArray();
  window.startSort = bubbleSort;
}

async function bubbleSort() {
  if (window.isSorting) return;
  window.isSorting = true;
  window.killRequested = false;

  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("killBtn").disabled = false;

  const container = document.getElementById("array-container");
  let boxes = Array.from(container.children);

  for (let i = 0; i < window.array.length; i++) {
    for (let j = 0; j < window.array.length - i - 1; j++) {
      if (window.killRequested) return;

      const left = boxes[j];
      const right = boxes[j + 1];
      const leftBox = left.querySelector(".box");
      const rightBox = right.querySelector(".box");

      leftBox.classList.add("highlight");
      rightBox.classList.add("highlight");
      window.showMessage(`Comparing ${window.array[j]} and ${window.array[j + 1]}`);

      await window.handlePause();
      if (window.killRequested) return;

      if (window.array[j] > window.array[j + 1]) {
        window.showMessage(`Swapping ${window.array[j]} and ${window.array[j + 1]}`);
        left.querySelector(".arrow-up").classList.add("show");
        right.querySelector(".arrow-down").classList.add("show");

        left.classList.add("arc-up");
        right.classList.add("arc-down");

        await window.sleep(800);

        [window.array[j], window.array[j + 1]] = [window.array[j + 1], window.array[j]];
        container.insertBefore(right, left);

        left.classList.remove("arc-up");
        right.classList.remove("arc-down");
        left.querySelector(".arrow-up").classList.remove("show");
        right.querySelector(".arrow-down").classList.remove("show");

        await window.sleep(300);
      } else {
        await window.sleep(600);
      }

      leftBox.classList.remove("highlight");
      rightBox.classList.remove("highlight");

      boxes = Array.from(container.children);
      if (window.killRequested) return;
    }
    boxes[window.array.length - i - 1].querySelector(".box").classList.add("sorted");
  }

  window.showMessage("✅ Sorting complete!");
  window.resetButtons();
}
