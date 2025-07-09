// QuickSort.js

export function renderQuickSort(container) {
  container.innerHTML = `
    <div class="algo-description">
      <h2>Quick Sort</h2>
      <p>Quick Sort picks a pivot and partitions the array into left and right subarrays, sorting them recursively.</p>
      <div class="complexity">
        <div class="complexity-item"><span class="complexity-label">Worst-case:</span> O(n²)</div>
        <div class="complexity-item"><span class="complexity-label">Average-case:</span> O(n log n)</div>
        <div class="complexity-item"><span class="complexity-label">Best-case:</span> O(n log n)</div>
        <div class="complexity-item"><span class="complexity-label">Space:</span> O(log n)</div>
      </div>
    </div>
    <div class="visualization-section">
      <div class="controls">
        <button onclick="window.generateArray()">Generate Array</button>
        <button onclick="window.startQuickSort()">Start Sort</button>
        <button id="pauseBtn" onclick="window.togglePause()" disabled>⏸ Pause</button>
        <button id="killBtn" onclick="window.killSort()" disabled>Stop</button>
      </div>
      <div id="array-container"></div>
      <div id="recursive-tree"></div>
      <div id="message"></div>
    </div>
    <div class="code-container">
      <div class="code-header">
        <span>Java Implementation</span>
        <button class="copy-btn" onclick="window.copyCode('quick-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="quick-code"><span class="keyword">public</span> <span class="keyword">class</span> QuickSort {
  <span class="keyword">public static void</span> quickSort(<span class="keyword">int</span>[] arr, <span class="keyword">int</span> low, <span class="keyword">int</span> high) {
    <span class="keyword">if</span> (low < high) {
      <span class="keyword">int</span> pi = partition(arr, low, high);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  <span class="keyword">private static int</span> partition(<span class="keyword">int</span>[] arr, <span class="keyword">int</span> low, <span class="keyword">int</span> high) {
    <span class="keyword">int</span> pivot = arr[low];
    <span class="keyword">int</span> left = low + 1;
    <span class="keyword">int</span> right = high;
    <span class="keyword">while</span> (left <= right) {
      <span class="keyword">while</span> (left <= high && arr[left] <= pivot) left++;
      <span class="keyword">while</span> (arr[right] > pivot) right--;
      <span class="keyword">if</span> (left < right) {
        <span class="keyword">int</span> temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
      }
    }
    arr[low] = arr[right];
    arr[right] = pivot;
    <span class="keyword">return</span> right;
  }
}</pre>
    </div>
  `;

  injectQuickStyles();

  window.generateArray();
  window.startQuickSort = startQuickSort;
}

// [Rest of QuickSort logic remains same, omitted here for brevity]
// Paste the earlier quick sort visualization code here.


async function startQuickSort() {
  if (window.isSorting) return;
  window.isSorting = true;
  window.killRequested = false;

  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("killBtn").disabled = false;

  const treeContainer = document.getElementById("recursive-tree");
  treeContainer.innerHTML = "";

  const arrayContainer = document.getElementById("array-container");
  arrayContainer.innerHTML = "<h3>Original Array:</h3>";
  const originalBoxes = createBoxArray([...window.array]);
  arrayContainer.appendChild(originalBoxes);

  const sorted = await visualizeQuickSort([...window.array], treeContainer);

  window.array = sorted;
  window.drawArray();
  window.showMessage("✅ Quick Sort completed!");
  window.resetButtons();
}

function createBoxArray(arr, extraClass = "", highlightIndexes = []) {
  const container = document.createElement("div");
  container.className = `box-array ${extraClass}`;
  arr.forEach((num, i) => {
    const box = document.createElement("div");
    box.className = `box ${highlightIndexes.includes(i) ? 'highlight' : ''}`;
    box.textContent = num;
    container.appendChild(box);
  });
  return container;
}

async function visualizeQuickSort(arr, container) {
  if (window.killRequested) return [];

  const node = document.createElement("div");
  node.className = "tree-node";

  const currentBoxes = createBoxArray(arr);
  node.appendChild(currentBoxes);
  container.appendChild(node);

  if (arr.length <= 1) {
    node.classList.add("base-case");
    return arr;
  }

  await window.handlePause();
  await window.sleep(800);

  // Choose pivot
  const pivotIndex = 0;
  const pivot = arr[pivotIndex];

  const pivotText = document.createElement("div");
  pivotText.textContent = `Pivot chosen: ${pivot}`;
  pivotText.className = "pivot-text";
  node.appendChild(pivotText);

  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (window.killRequested) return [];
    await window.handlePause();

    const compareText = document.createElement("div");
    compareText.textContent = `Comparing ${arr[i]} with pivot ${pivot}`;
    compareText.className = "comparison-text";
    node.appendChild(compareText);

    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
      compareText.textContent += ` → goes left`;
    } else {
      rightArr.push(arr[i]);
      compareText.textContent += ` → goes right`;
    }

    await window.sleep(800);
  }

  const divisionText = document.createElement("div");
  divisionText.textContent = `Left: [${leftArr}] | Pivot: ${pivot} | Right: [${rightArr}]`;
  divisionText.className = "division-text";
  node.appendChild(divisionText);

  const childrenContainer = document.createElement("div");
  childrenContainer.className = "children-container";
  node.appendChild(childrenContainer);

  const leftContainer = document.createElement("div");
  leftContainer.className = "child left-child";
  childrenContainer.appendChild(leftContainer);

  const rightContainer = document.createElement("div");
  rightContainer.className = "child right-child";
  childrenContainer.appendChild(rightContainer);

  const leftBoxes = createBoxArray(leftArr);
  leftBoxes.style.opacity = "0";
  leftBoxes.style.transform = "translateX(-50px)";
  leftContainer.appendChild(leftBoxes);

  const rightBoxes = createBoxArray(rightArr);
  rightBoxes.style.opacity = "0";
  rightBoxes.style.transform = "translateX(50px)";
  rightContainer.appendChild(rightBoxes);

  await window.sleep(400);
  leftBoxes.style.opacity = "1";
  leftBoxes.style.transform = "translateX(0)";
  rightBoxes.style.opacity = "1";
  rightBoxes.style.transform = "translateX(0)";
  await window.sleep(400);

  const sortedLeft = await visualizeQuickSort(leftArr, leftContainer);
  const sortedRight = await visualizeQuickSort(rightArr, rightContainer);

  const merged = [...sortedLeft, pivot, ...sortedRight];

  await window.sleep(600);

  const mergedBoxes = createBoxArray(merged, "merging");
  mergedBoxes.style.opacity = "0";
  mergedBoxes.style.transform = "translateY(20px)";
  node.appendChild(mergedBoxes);

  await window.sleep(400);
  mergedBoxes.style.opacity = "1";
  mergedBoxes.style.transform = "translateY(0)";
  await window.sleep(600);

  return merged;
}

function injectQuickStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .tree-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      transition: all 0.5s ease;
    }
    .box-array {
      display: flex;
      gap: 5px;
      margin: 5px 0;
      transition: all 0.5s ease;
    }
    .box {
      width: 40px;
      height: 40px;
      background-color: white;
      border: 2px solid #4a6fa5;
      color: #4a6fa5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-weight: bold;
      transition: all 0.4s ease;
    }
    .pivot-text {
      font-weight: bold;
      color: #f39c12;
      margin: 8px 0;
      font-style: italic;
    }
    .comparison-text {
      color: #8e44ad;
      margin: 5px 0;
      font-style: italic;
    }
    .division-text {
      font-weight: bold;
      color: #2ecc71;
      margin: 8px 0;
      font-style: italic;
    }
    .children-container {
      display: flex;
      justify-content: center;
      width: 100%;
      position: relative;
      margin: 20px 0;
    }
    .child {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .left-child::before {
      content: "← Left";
      position: absolute;
      top: -20px;
      left: 20%;
      transform: translateX(-50%);
      color: #ff6b6b;
      font-weight: bold;
    }
    .right-child::before {
      content: "Right →";
      position: absolute;
      top: -20px;
      right: 20%;
      transform: translateX(50%);
      color: #4ecdc4;
      font-weight: bold;
    }
    .merging {
      background-color: rgba(46, 204, 113, 0.2);
      padding: 5px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .base-case .box {
      background-color: #f39c12;
    }
    .highlight {
      transform: scale(1.2);
      box-shadow: 0 0 15px gold;
    }
    .sorted {
      background-color: #2ecc71;
      color: white;
    }
  `;
  document.head.appendChild(style);
}
