// MergeSort.js

export function renderMergeSort(container) {
  container.innerHTML = `
    <div class="algo-description">
      <h2>Merge Sort</h2>
      <p>Merge Sort uses divide and conquer to split the array into halves and merge them back in sorted order.</p>
      <div class="complexity">
        <div class="complexity-item"><span class="complexity-label">Worst-case:</span> O(n log n)</div>
        <div class="complexity-item"><span class="complexity-label">Average-case:</span> O(n log n)</div>
        <div class="complexity-item"><span class="complexity-label">Best-case:</span> O(n log n)</div>
        <div class="complexity-item"><span class="complexity-label">Space:</span> O(n)</div>
      </div>
    </div>
    <div class="visualization-section">
      <div class="controls">
        <button onclick="window.generateArray()">Generate Array</button>
        <button onclick="window.startMergeSort()">Start Sort</button>
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
        <button class="copy-btn" onclick="window.copyCode('merge-code')">Copy Code</button>
      </div>
      <pre class="code-snippet" id="merge-code"><span class="keyword">public</span> <span class="keyword">class</span> MergeSort {
  <span class="keyword">public static void</span> mergeSort(<span class="keyword">int</span>[] arr, <span class="keyword">int</span> l, <span class="keyword">int</span> r) {
    <span class="keyword">if</span> (l < r) {
      <span class="keyword">int</span> m = l + (r - l) / 2;
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }

  <span class="keyword">private static void</span> merge(<span class="keyword">int</span>[] arr, <span class="keyword">int</span> l, <span class="keyword">int</span> m, <span class="keyword">int</span> r) {
    <span class="keyword">int</span> n1 = m - l + 1;
    <span class="keyword">int</span> n2 = r - m;
    <span class="keyword">int</span>[] L = <span class="keyword">new int</span>[n1];
    <span class="keyword">int</span>[] R = <span class="keyword">new int</span>[n2];

    <span class="keyword">for</span> (<span class="keyword">int</span> i = 0; i < n1; i++)
      L[i] = arr[l + i];
    <span class="keyword">for</span> (<span class="keyword">int</span> j = 0; j < n2; j++)
      R[j] = arr[m + 1 + j];

    <span class="keyword">int</span> i = 0, j = 0, k = l;
    <span class="keyword">while</span> (i < n1 && j < n2) {
      <span class="keyword">if</span> (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } <span class="keyword">else</span> {
        arr[k] = R[j];
        j++;
      }
      k++;
    }
    <span class="keyword">while</span> (i < n1) {
      arr[k++] = L[i++];
    }
    <span class="keyword">while</span> (j < n2) {
      arr[k++] = R[j++];
    }
  }
}</pre>
    </div>
  `;

  injectCommonStyles();

  window.generateArray();
  window.startMergeSort = startMergeSort;
}

// [Rest of MergeSort logic remains same, omitted here for brevity]
// Paste the earlier merge sort visualization code here.


async function startMergeSort() {
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

  const sorted = await visualizeMergeSort([...window.array], treeContainer);

  window.array = sorted;
  window.drawArray();
  window.showMessage("✅ Merge Sort completed!");
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

async function visualizeMergeSort(arr, container) {
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

  const mid = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);

  const divisionText = document.createElement("div");
  divisionText.textContent = `Dividing into left=[${leftArr}] and right=[${rightArr}]`;
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

  const sortedLeft = await visualizeMergeSort(leftArr, leftContainer);
  const sortedRight = await visualizeMergeSort(rightArr, rightContainer);

  const mergingText = document.createElement("div");
  mergingText.textContent = `Merging left=[${sortedLeft}] and right=[${sortedRight}]`;
  mergingText.className = "merging-text";
  node.appendChild(mergingText);

  const merged = await mergeArrays(sortedLeft, sortedRight, node);

  await window.sleep(800);

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

async function mergeArrays(left, right, parentNode) {
  let i = 0, j = 0;
  let result = [];

  const mergeContainer = document.createElement("div");
  mergeContainer.className = "merge-process";
  parentNode.appendChild(mergeContainer);

  while (i < left.length && j < right.length) {
    if (window.killRequested) return [];

    await window.handlePause();

    const leftBoxes = createBoxArray(left, "", [i]);
    const rightBoxes = createBoxArray(right, "", [j]);

    mergeContainer.innerHTML = "";
    mergeContainer.appendChild(leftBoxes);
    mergeContainer.appendChild(document.createTextNode(" + "));
    mergeContainer.appendChild(rightBoxes);

    const comparisonText = document.createElement("div");
    comparisonText.textContent = `Comparing ${left[i]} and ${right[j]}`;
    mergeContainer.appendChild(comparisonText);

    await window.sleep(800);

    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }

    const resultBoxes = createBoxArray(result, "sorted");
    mergeContainer.appendChild(document.createElement("br"));
    mergeContainer.appendChild(resultBoxes);
    await window.sleep(800);
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
    const resultBoxes = createBoxArray(result, "sorted");
    mergeContainer.innerHTML = "Adding remaining left elements:";
    mergeContainer.appendChild(resultBoxes);
    await window.sleep(600);
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
    const resultBoxes = createBoxArray(result, "sorted");
    mergeContainer.innerHTML = "Adding remaining right elements:";
    mergeContainer.appendChild(resultBoxes);
    await window.sleep(600);
  }

  parentNode.removeChild(mergeContainer);
  return result;
}

function injectCommonStyles() {
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
    .division-text {
      font-weight: bold;
      font-style: italic;
      color: #8e44ad;
      margin: 8px 0;
    }
    .merging-text {
      font-weight: bold;
      font-style: italic;
      color: #2ecc71;
      margin: 8px 0;
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
