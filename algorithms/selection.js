export function renderSelectionSort(container) {
  container.innerHTML = `
    <div class="algo-description">
      <h2>Selection Sort</h2>
      <p>Selection sort divides the array into a sorted and unsorted part. 
         It repeatedly finds the minimum element and places it at the beginning.</p>
      <div class="complexity">
        <div class="complexity-item"><span class="complexity-label">Worst-case:</span> O(n²)</div>
        <div class="complexity-item"><span class="complexity-label">Average-case:</span> O(n²)</div>
        <div class="complexity-item"><span class="complexity-label">Best-case:</span> O(n²)</div>
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
        <button class="copy-btn" onclick="window.copyCode('selection-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="selection-code"><span class="keyword">public</span> <span class="keyword">class</span> SelectionSort {
  <span class="keyword">public static void</span> selectionSort(<span class="keyword">int</span>[] arr) {
    <span class="keyword">int</span> n = arr.length;
    <span class="keyword">for</span> (<span class="keyword">int</span> i = 0; i &lt; n - 1; i++) {
      <span class="keyword">int</span> minIdx = i;
      <span class="keyword">for</span> (<span class="keyword">int</span> j = i + 1; j &lt; n; j++) {
        <span class="keyword">if</span> (arr[j] &lt; arr[minIdx]) {
          minIdx = j;
        }
      }
      <span class="keyword">int</span> temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;
    }
  }
}</pre>
    </div>
  `;

  window.generateArray();
  window.startSort = selectionSort;
}

async function selectionSort() {
  if (window.isSorting) return;
  window.isSorting = true;
  window.killRequested = false;

  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("killBtn").disabled = false;

  const container = document.getElementById("array-container");
  let boxes = Array.from(container.children);

  for (let i = 0; i < window.array.length - 1; i++) {
    let minIndex = i;
    boxes[minIndex].querySelector(".box").classList.add("highlight-selected");
    window.showMessage(`🔍 Searching for minimum from index ${i}`);

    for (let j = i + 1; j < window.array.length; j++) {
      if (window.killRequested) return;

      boxes[j].querySelector(".box").classList.add("highlight");
      window.showMessage(`Comparing ${window.array[j]} and ${window.array[minIndex]}`);
      await window.handlePause();
      await window.sleep();

      if (window.array[j] < window.array[minIndex]) {
        boxes[minIndex].querySelector(".box").classList.remove("highlight-selected");
        minIndex = j;
        boxes[minIndex].querySelector(".box").classList.add("highlight-selected");
        window.showMessage(`✅ New minimum found: ${window.array[minIndex]}`);
      }

      boxes[j].querySelector(".box").classList.remove("highlight");
    }

    if (minIndex !== i) {
      window.showMessage(`🔄 Swapping ${window.array[i]} and ${window.array[minIndex]}`);

      let box1 = boxes[i];
      let box2 = boxes[minIndex];

      box1.querySelector(".arrow-up").classList.add("show");
      box2.querySelector(".arrow-down").classList.add("show");

      box1.classList.add("arc-up");
      box2.classList.add("arc-down");

      await window.sleep(800);

      [window.array[i], window.array[minIndex]] = [window.array[minIndex], window.array[i]];
      container.insertBefore(box2, box1);

      box1.classList.remove("arc-up");
      box2.classList.remove("arc-down");
      box1.querySelector(".arrow-up").classList.remove("show");
      box2.querySelector(".arrow-down").classList.remove("show");

      await window.sleep(300);

      boxes = Array.from(container.children);
    }

    boxes[i].querySelector(".box").classList.remove("highlight-selected");
    boxes[i].querySelector(".box").classList.add("sorted");
  }

  boxes[window.array.length - 1].querySelector(".box").classList.add("sorted");

  window.showMessage("✅ Selection Sort complete!");
  window.resetButtons();
}
