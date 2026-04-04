export type Bar = { id: number; value: number };

export type VizStep = {
  bars: Bar[];
  compare?: [number, number];
  swap?: [number, number];
  /** 最終位置が確定したインデックス */
  sorted?: number[];
  pivot?: number;
  range?: [number, number];
  caption?: string;
};

function clone(bars: Bar[]): Bar[] {
  return bars.map((b) => ({ ...b }));
}

function push(
  steps: VizStep[],
  bars: Bar[],
  extra: Omit<VizStep, "bars"> = {}
) {
  steps.push({ bars: clone(bars), ...extra });
}

export function bubbleSort(initial: Bar[]): VizStep[] {
  const steps: VizStep[] = [];
  const a = clone(initial);
  const n = a.length;
  push(steps, a, { caption: "バブルソート開始" });
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      push(steps, a, {
        compare: [j, j + 1],
        range: [0, n - i],
        caption: `${j} と ${j + 1} を比較`,
      });
      if (a[j].value > a[j + 1].value) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        push(steps, a, {
          swap: [j, j + 1],
          range: [0, n - i],
          caption: "交換",
        });
      }
    }
    push(steps, a, {
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      caption: `末尾 ${n - 1 - i} が確定`,
    });
  }
  push(steps, a, {
    sorted: a.map((_, i) => i),
    caption: "完了",
  });
  return steps;
}

export function selectionSort(initial: Bar[]): VizStep[] {
  const steps: VizStep[] = [];
  const a = clone(initial);
  const n = a.length;
  push(steps, a, { caption: "選択ソート開始" });
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      push(steps, a, {
        compare: [minIdx, j],
        range: [i, n - 1],
        caption: `最小候補と位置 ${j} を比較`,
      });
      if (a[j].value < a[minIdx].value) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      push(steps, a, {
        swap: [i, minIdx],
        sorted: Array.from({ length: i }, (_, k) => k),
        caption: "最小値を左端へ",
      });
    }
    push(steps, a, {
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      caption: `位置 ${i} が確定`,
    });
  }
  push(steps, a, {
    sorted: a.map((_, i) => i),
    caption: "完了",
  });
  return steps;
}

export function insertionSort(initial: Bar[]): VizStep[] {
  const steps: VizStep[] = [];
  const a = clone(initial);
  const n = a.length;
  push(steps, a, { caption: "挿入ソート開始" });
  for (let i = 1; i < n; i++) {
    push(steps, a, {
      range: [0, i],
      caption: `要素 ${i} を挿入位置へ`,
    });
    let j = i;
    while (j > 0) {
      push(steps, a, {
        compare: [j - 1, j],
        range: [0, i],
        caption: "左隣と比較",
      });
      if (a[j - 1].value <= a[j].value) break;
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      push(steps, a, {
        swap: [j - 1, j],
        range: [0, i],
        caption: "左へスワップ",
      });
      j--;
    }
    push(steps, a, {
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      caption: `0〜${i} は整列済み`,
    });
  }
  push(steps, a, {
    sorted: a.map((_, i) => i),
    caption: "完了",
  });
  return steps;
}

function partition(a: Bar[], low: number, high: number, steps: VizStep[]): number {
  const pivotVal = a[high].value;
  let i = low - 1;
  push(steps, clone(a), {
    pivot: high,
    range: [low, high],
    caption: "クイックソート: パーティション",
  });
  for (let j = low; j < high; j++) {
    push(steps, clone(a), {
      compare: [j, high],
      pivot: high,
      range: [low, high],
      caption: "ピボットと比較",
    });
    if (a[j].value <= pivotVal) {
      i++;
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        push(steps, clone(a), {
          swap: [i, j],
          pivot: high,
          range: [low, high],
          caption: "グループ分けのため交換",
        });
      }
    }
  }
  if (i + 1 !== high) {
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    push(steps, clone(a), {
      swap: [i + 1, high],
      range: [low, high],
      caption: "ピボットを境界へ",
    });
  }
  return i + 1;
}

function quickSortRange(a: Bar[], low: number, high: number, steps: VizStep[]) {
  if (low >= high) {
    if (low === high) {
      push(steps, clone(a), {
        sorted: [low],
        range: [low, high],
        caption: "1要素はそのまま",
      });
    }
    return;
  }
  const p = partition(a, low, high, steps);
  push(steps, clone(a), {
    sorted: [p],
    range: [low, high],
    caption: `ピボット ${p} は確定`,
  });
  quickSortRange(a, low, p - 1, steps);
  quickSortRange(a, p + 1, high, steps);
}

export function quickSort(initial: Bar[]): VizStep[] {
  const steps: VizStep[] = [];
  const a = clone(initial);
  push(steps, a, { caption: "クイックソート開始" });
  quickSortRange(a, 0, a.length - 1, steps);
  push(steps, a, {
    sorted: a.map((_, i) => i),
    caption: "完了",
  });
  return steps;
}

export type AlgorithmId = "bubble" | "selection" | "insertion" | "quick";

export const ALGORITHMS: Record<
  AlgorithmId,
  { label: string; description: string; run: (b: Bar[]) => VizStep[] }
> = {
  bubble: {
    label: "バブルソート",
    description: "隣同士を比較して大きい方を右へ送る。実装が簡単で動きが分かりやすい。",
    run: bubbleSort,
  },
  selection: {
    label: "選択ソート",
    description: "未整列部分から最小を選び、左端と入れ替える。",
    run: selectionSort,
  },
  insertion: {
    label: "挿入ソート",
    description: "整列済み区間に、次の1枚を挿入していく。ほぼ整列データに強い。",
    run: insertionSort,
  },
  quick: {
    label: "クイックソート",
    description: "ピボットで分割し再帰。平均は高速だが最悪は遅い。",
    run: quickSort,
  },
};

export function makeRandomBars(count: number): Bar[] {
  const values = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.map((value, id) => ({ id, value }));
}
