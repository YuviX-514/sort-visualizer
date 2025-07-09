export function renderInsertionSort(container) {
  container.innerHTML = `
    <div class="algo-description">
      <h2>Insertion Sort</h2>
      <p>Insertion sort builds the final sorted array one element at a time by inserting each element into its correct position.</p>
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
        <button class="copy-btn" onclick="window.copyCode('insertion-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="insertion-code"><span class="keyword">public</span> <span class="keyword">class</span> InsertionSort {
  <span class="keyword">public static void</span> insertionSort(<span class="keyword">int</span>[] arr) {
    <span class="keyword">for</span> (<span class="keyword">int</span> i = 1; i &lt; arr.length; i++) {
      <span class="keyword">int</span> key = arr[i];
      <span class="keyword">int</span> j = i - 1;
      <span class="keyword">while</span> (j &gt;= 0 && arr[j] &gt; key) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
    }
  }
}</pre>
    </div>
  `;

  window.generateArray();
  window.startSort = insertionSort;
}

async function insertionSort() {
  if (window.isSorting) return;
  window.isSorting = true;
  window.killRequested = false;

  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("killBtn").disabled = false;

  const container = document.getElementById("array-container");
  let boxes = Array.from(container.children);

  for (let i = 1; i < window.array.length; i++) {
    if (window.killRequested) return;

    boxes[i].querySelector(".box").classList.add("highlight-selected");

    let j = i;
    while (j > 0 && window.array[j - 1] > window.array[j]) {
      if (window.killRequested) return;

      window.showMessage(`Swapping ${window.array[j - 1]} and ${window.array[j]}`);

      const left = boxes[j - 1];
      const right = boxes[j];

      left.querySelector(".arrow-up").classList.add("show");
      right.querySelector(".arrow-down").classList.add("show");

      left.classList.add("arc-up");
      right.classList.add("arc-down");

      await window.sleep(800);
      await window.handlePause();

      [window.array[j - 1], window.array[j]] = [window.array[j], window.array[j - 1]];
      container.insertBefore(right, left);

      left.classList.remove("arc-up");
      right.classList.remove("arc-down");
      left.querySelector(".arrow-up").classList.remove("show");
      right.querySelector(".arrow-down").classList.remove("show");

      await window.sleep(300);
      await window.handlePause();

      boxes = Array.from(container.children);
      j--;
    }

    boxes[i].querySelector(".box").classList.remove("highlight-selected");
  }

  boxes.forEach(box => {
    const b = box.querySelector(".box");
    b.classList.remove("highlight-selected");
    b.classList.add("sorted");
  });

  window.showMessage("✅ Insertion Sort complete!");
  window.resetButtons();
}
