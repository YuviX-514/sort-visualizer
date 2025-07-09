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

    <div class="controls">
      <button onclick="window.generateArray()">Generate Array</button>
      <button onclick="window.startSort()">Start Sort</button>
      <button id="pauseBtn" onclick="window.togglePause()" disabled>Pause</button>
      <button id="killBtn" onclick="window.killSort()" disabled>Stop</button>
    </div>

    <div id="array-container"></div>
    <div id="message">Ready to sort!</div>

    <div class="code-container">
      <div class="code-header">
        <span>Java Implementation</span>
        <button class="copy-btn" onclick="window.copyCode('selection-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="selection-code"><span class="keyword">public</span> <span class="keyword">class</span> SelectionSort {
  <span class="keyword">public static void</span> selectionSort(<span class="keyword">int</span>[] arr) {
    <span class="keyword">int</span> n = arr.length;
    <span class="keyword">for</span> (<span class="keyword">int</span> i = 0; i &lt; n-1; i++) {
      <span class="keyword">int</span> minIndex = i;
      <span class="keyword">for</span> (<span class="keyword">int</span> j = i+1; j &lt; n; j++) {
        <span class="keyword">if</span> (arr[j] &lt; arr[minIndex]) {
          minIndex = j;
        }
      }
      <span class="keyword">if</span> (minIndex != i) {
        <span class="keyword">int</span> temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
      }
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

  const container = document.getElementById("array-container");
  let boxes = Array.from(container.children);
  const n = window.array.length;

  // Enable controls
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("killBtn").disabled = false;

  for (let i = 0; i < n - 1; i++) {
    if (window.killRequested) break;
    
    boxes = Array.from(container.children);
    boxes[i].querySelector(".box").classList.add("current");
    window.showMessage(`Finding minimum in unsorted portion starting at index ${i}`);

    let minIndex = i;

    // Highlight the current minimum candidate
    boxes[minIndex].querySelector(".box").classList.add("min-candidate");

    for (let j = i + 1; j < n; j++) {
      if (window.killRequested) break;

      boxes = Array.from(container.children);
      boxes[j].querySelector(".box").classList.add("comparing");
      window.showMessage(`Comparing ${window.array[j]} with current minimum ${window.array[minIndex]}`);

      await window.handlePause();
      await window.sleep(500); // Slower for better visualization

      if (window.array[j] < window.array[minIndex]) {
        // Remove highlight from previous minimum
        boxes[minIndex].querySelector(".box").classList.remove("min-candidate");
        minIndex = j;
        // Highlight new minimum
        boxes[minIndex].querySelector(".box").classList.add("min-candidate");
        window.showMessage(`New minimum found: ${window.array[minIndex]}`);
      }

      boxes[j].querySelector(".box").classList.remove("comparing");
    }

    if (minIndex !== i) {
      window.showMessage(`Swapping ${window.array[i]} with minimum ${window.array[minIndex]}`);

      // Highlight swap positions
      boxes[i].querySelector(".box").classList.add("swapping");
      boxes[minIndex].querySelector(".box").classList.add("swapping");

      // Animate the swap
      await animateSwap(boxes[i], boxes[minIndex]);

      // Perform the actual swap in the array
      [window.array[i], window.array[minIndex]] = [window.array[minIndex], window.array[i]];

      // Remove swap highlights
      boxes[i].querySelector(".box").classList.remove("swapping");
      boxes[minIndex].querySelector(".box").classList.remove("swapping");
    }

    // Mark as sorted
    boxes = Array.from(container.children);
    boxes[i].querySelector(".box").classList.remove("current", "min-candidate");
    boxes[i].querySelector(".box").classList.add("sorted");
  }

  // Mark last element as sorted
  if (!window.killRequested && n > 0) {
    boxes = Array.from(container.children);
    boxes[n - 1].querySelector(".box").classList.add("sorted");
    window.showMessage("Selection Sort complete!");
  }

  window.resetButtons();
}

// Helper function to animate the swap
async function animateSwap(box1, box2) {
  // Get positions
  const rect1 = box1.getBoundingClientRect();
  const rect2 = box2.getBoundingClientRect();
  
  // Calculate distances
  const dx = rect2.left - rect1.left;
  const dy = rect2.top - rect1.top;
  
  // Apply transform to move boxes
  box1.style.transform = `translate(${dx}px, ${dy}px)`;
  box2.style.transform = `translate(${-dx}px, ${-dy}px)`;
  
  // Wait for animation to complete
  await new Promise(resolve => {
    setTimeout(() => {
      // Reset transforms
      box1.style.transform = '';
      box2.style.transform = '';
      
      // Swap the DOM elements
      const parent = box1.parentNode;
      const next1 = box1.nextSibling;
      const next2 = box2.nextSibling;
      
      if (next1 === box2) {
        parent.insertBefore(box2, box1);
      } else if (next2 === box1) {
        parent.insertBefore(box1, box2);
      } else {
        parent.insertBefore(box2, next1);
        parent.insertBefore(box1, next2);
      }
      
      resolve();
    }, 500); // Animation duration
  });
}