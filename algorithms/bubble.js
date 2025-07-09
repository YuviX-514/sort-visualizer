export function renderBubbleSort(container) {
  container.innerHTML = `
  <div class="algo-description">
    <h2>Bubble Sort</h2>
    <p>Bubble sort is a simple sorting algorithm that repeatedly steps through the list, 
    compares adjacent elements and swaps them if they are in the wrong order.</p>
    
    <div class="complexity">
      <div class="complexity-item">
        <span class="complexity-label">Worst-case:</span>
        <span class="complexity-value">O(n²)</span>
      </div>
      <div class="complexity-item">
        <span class="complexity-label">Average-case:</span>
        <span class="complexity-value">O(n²)</span>
      </div>
      <div class="complexity-item">
        <span class="complexity-label">Best-case:</span>
        <span class="complexity-value">O(n)</span>
      </div>
      <div class="complexity-item">
        <span class="complexity-label">Space:</span>
        <span class="complexity-value">O(1)</span>
      </div>
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
      <button class="copy-btn" onclick="window.copyCode('bubble-code')">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
        </svg>
        Copy Code
      </button>
    </div>
    <pre class="code-snippet" id="bubble-code"><span class="keyword">public</span> <span class="keyword">class</span> <span class="function">BubbleSort</span> {
  <span class="keyword">public static void</span> <span class="function">bubbleSort</span>(<span class="keyword">int</span>[] arr) {
    <span class="keyword">int</span> n = arr.length;
    <span class="keyword">for</span> (<span class="keyword">int</span> i = <span class="number">0</span>; i &lt; n - <span class="number">1</span>; i++) {
      <span class="keyword">for</span> (<span class="keyword">int</span> j = <span class="number">0</span>; j &lt; n - i - <span class="number">1</span>; j++) {
        <span class="keyword">if</span> (arr[j] &gt; arr[j + <span class="number">1</span>]) {
          <span class="comment">// Swap arr[j] and arr[j + 1]</span>
          <span class="keyword">int</span> temp = arr[j];
          arr[j] = arr[j + <span class="number">1</span>];
          arr[j + <span class="number">1</span>] = temp;
        }
      }
    }
  }

  <span class="keyword">public static void</span> <span class="function">main</span>(<span class="keyword">String</span>[] args) {
    <span class="keyword">int</span>[] data = {<span class="number">64</span>, <span class="number">34</span>, <span class="number">25</span>, <span class="number">12</span>, <span class="number">22</span>, <span class="number">11</span>, <span class="number">90</span>};
    bubbleSort(data);
    <span class="keyword">for</span> (<span class="keyword">int</span> num : data) {
      System.out.print(num + <span class="string">" "</span>);
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

  const pauseBtn = document.getElementById("pauseBtn");
  const killBtn = document.getElementById("killBtn");
  pauseBtn.disabled = false;
  killBtn.disabled = false;

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
