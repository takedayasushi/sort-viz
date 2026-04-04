import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowDownWideNarrow,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Droplets,
  Gauge,
  GitCompare,
  GitCompareArrows,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ALGORITHMS, type AlgorithmId, makeRandomBars } from "./sorters";

const ALGO_ICONS: Record<AlgorithmId, LucideIcon> = {
  bubble: Droplets,
  selection: Crosshair,
  insertion: ArrowDownToLine,
  quick: Zap,
};

const BAR_COUNT = 18;

const speedToMs = (slider: number) => {
  const t = slider / 100;
  return Math.round(900 * (1 - t) + 40 * t);
};

function IconButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="icon-btn"
      data-active={active ? "true" : undefined}
    >
      {children}
    </button>
  );
}

export function App() {
  const [bars, setBars] = useState(() => makeRandomBars(BAR_COUNT));
  const [algo, setAlgo] = useState<AlgorithmId>("bubble");
  const steps = useMemo(() => ALGORITHMS[algo].run(bars), [bars, algo]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(55);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [bars, algo]);

  const step = steps[index] ?? null;
  const maxVal = useMemo(
    () => Math.max(...bars.map((x) => x.value), 1),
    [bars]
  );

  const sortedSet = useMemo(() => new Set(step?.sorted ?? []), [step]);

  useEffect(() => {
    if (!playing || steps.length <= 1) return;
    const ms = speedToMs(speed);
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, ms);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, steps.length, speed]);

  const goShuffle = () => setBars(makeRandomBars(BAR_COUNT));

  const goAlgo = (id: AlgorithmId) => setAlgo(id);

  const replay = () => {
    setBars((b) => [...b]);
  };

  const togglePlay = () => {
    if (steps.length <= 1) return;
    if (index >= steps.length - 1) setIndex(0);
    setPlaying((p) => !p);
  };

  const meta = ALGORITHMS[algo];

  return (
    <div className="app">
      <style>{`
        .app { max-width: 1100px; margin: 0 auto; padding: 28px 20px 48px; }
        .header {
          display: flex; flex-wrap: wrap; align-items: flex-start; gap: 16px 24px;
          margin-bottom: 24px;
        }
        .title-row { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 220px; }
        .title-row h1 {
          margin: 0; font-size: 1.55rem; font-weight: 700; letter-spacing: -0.02em;
        }
        .title-row p { margin: 4px 0 0; color: var(--muted); font-size: 0.92rem; }
        .sparkle { color: var(--accent); flex-shrink: 0; }
        .toolbar {
          display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: var(--radius); background: var(--surface);
          border: 1px solid var(--border); box-shadow: var(--shadow);
        }
        .toolbar-group {
          display: flex; align-items: center; gap: 6px;
          padding-right: 12px; margin-right: 4px;
          border-right: 1px solid var(--border);
        }
        .toolbar-group:last-child { border-right: 0; margin-right: 0; padding-right: 0; }
        .icon-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px;
          border: 1px solid var(--border); background: var(--bg1);
          color: var(--text); transition: transform 0.15s ease, background 0.15s, border-color 0.15s;
        }
        .icon-btn:hover:not(:disabled) {
          background: var(--surface2); border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .icon-btn[data-active="true"] {
          background: linear-gradient(135deg, rgba(124,156,255,0.25), rgba(167,139,250,0.2));
          border-color: rgba(124,156,255,0.45); color: #fff;
        }
        .speed-wrap {
          display: flex; align-items: center; gap: 8px; min-width: 140px;
          color: var(--muted); font-size: 0.85rem;
        }
        .speed-wrap svg { color: var(--accent); flex-shrink: 0; }
        .algo-panel {
          margin-top: 20px; display: grid; gap: 16px;
          grid-template-columns: 1fr; 
        }
        @media (min-width: 880px) {
          .algo-panel { grid-template-columns: 220px 1fr; align-items: start; }
        }
        .algo-list {
          display: flex; flex-direction: column; gap: 8px;
          padding: 14px; border-radius: var(--radius); background: var(--surface);
          border: 1px solid var(--border);
        }
        .algo-list h2 {
          margin: 0 0 8px; font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--muted); display: flex; align-items: center; gap: 6px;
        }
        .algo-btn {
          text-align: left; padding: 12px 14px; border-radius: 12px;
          border: 1px solid transparent; background: transparent; color: var(--text);
          transition: background 0.15s, border-color 0.15s;
        }
        .algo-btn:hover { background: rgba(255,255,255,0.06); }
        .algo-btn[data-on="true"] {
          border-color: rgba(124,156,255,0.4);
          background: linear-gradient(135deg, rgba(124,156,255,0.12), rgba(167,139,250,0.08));
        }
        .algo-btn strong { display: block; font-size: 0.95rem; }
        .algo-btn span { display: block; margin-top: 4px; font-size: 0.8rem; color: var(--muted); line-height: 1.35; }
        .stage-wrap {
          padding: 20px; border-radius: var(--radius); background: var(--surface);
          border: 1px solid var(--border); min-height: 320px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .legend {
          display: flex; flex-wrap: wrap; gap: 14px 20px; font-size: 0.8rem; color: var(--muted);
        }
        .legend-item { display: inline-flex; align-items: center; gap: 8px; }
        .legend-item svg {
          flex-shrink: 0;
          stroke-width: 2.25;
          filter: drop-shadow(0 0 6px currentColor);
        }
        .legend-compare { color: var(--compare); }
        .legend-swap { color: var(--swap); }
        .legend-pivot { color: var(--pivot); }
        .legend-sorted { color: var(--sorted); }
        .algo-btn .algo-icon {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: rgba(255,255,255,0.06); border: 1px solid var(--border);
          color: var(--accent);
        }
        .algo-btn[data-on="true"] .algo-icon {
          background: rgba(124,156,255,0.15);
          border-color: rgba(124,156,255,0.35);
          color: #c4d4ff;
        }
        .algo-btn-inner { display: flex; align-items: flex-start; gap: 12px; }
        .algo-btn-text { min-width: 0; }
        .caption-bar {
          display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px;
          min-height: 40px;
        }
        .caption {
          flex: 1; min-width: 200px; font-size: 0.95rem; color: var(--text);
          display: flex; align-items: center; gap: 8px;
        }
        .caption svg { flex-shrink: 0; color: var(--accent2); }
        .step-meter {
          font-family: "JetBrains Mono", monospace; font-size: 0.8rem; color: var(--muted);
        }
        .bars {
          flex: 1; display: flex; align-items: flex-end; justify-content: center;
          gap: clamp(4px, 1.2vw, 10px); min-height: 220px; padding: 8px 4px 0;
        }
        .bar-col {
          flex: 1; max-width: 36px; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end; min-width: 0;
        }
        .bar {
          width: 100%; border-radius: 10px 10px 4px 4px;
          background: linear-gradient(180deg, #9cb4ff 0%, #5b7cff 45%, #3d5bdc 100%);
          box-shadow: 0 0 24px rgba(91, 124, 255, 0.25);
          transition: height 0.38s cubic-bezier(0.34, 1.2, 0.64, 1),
            background 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
        }
        .bar[data-compare="true"] {
          background: linear-gradient(180deg, #fde68a 0%, #f59e0b 50%, #d97706 100%);
          box-shadow: 0 0 28px rgba(245, 158, 11, 0.45);
          transform: scaleX(1.08);
        }
        .bar[data-swap="true"] {
          background: linear-gradient(180deg, #fbcfe8 0%, #ec4899 55%, #db2777 100%);
          box-shadow: 0 0 32px rgba(236, 72, 153, 0.5);
          transform: scaleX(1.12) translateY(-4px);
        }
        .bar[data-pivot="true"] {
          background: linear-gradient(180deg, #7dd3fc 0%, #0ea5e9 55%, #0369a1 100%);
          box-shadow: 0 0 28px rgba(14, 165, 233, 0.45);
        }
        .bar[data-sorted="true"] {
          background: linear-gradient(180deg, #6ee7b7 0%, #10b981 50%, #059669 100%);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
        }
        .bar-val {
          margin-top: 8px; font-family: "JetBrains Mono", monospace;
          font-size: clamp(0.65rem, 1.5vw, 0.75rem); color: var(--muted);
        }
      `}</style>

      <header className="header">
        <div className="title-row">
          <Sparkles className="sparkle" size={36} strokeWidth={1.75} aria-hidden />
          <div>
            <h1>Sort Viz</h1>
            <p>ソートの「比較」「交換」「確定」を色と動きで追跡</p>
          </div>
        </div>
        <div className="toolbar" role="toolbar" aria-label="再生と配列操作">
          <div className="toolbar-group">
            <IconButton
              label={playing ? "一時停止" : "再生"}
              onClick={togglePlay}
              disabled={steps.length <= 1}
              active={playing}
            >
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </IconButton>
            <IconButton
              label="1ステップ戻る"
              onClick={() => {
                setPlaying(false);
                setIndex((i) => Math.max(0, i - 1));
              }}
              disabled={index <= 0}
            >
              <ChevronLeft size={22} />
            </IconButton>
            <IconButton
              label="1ステップ進む"
              onClick={() => {
                setPlaying(false);
                setIndex((i) => Math.min(steps.length - 1, i + 1));
              }}
              disabled={index >= steps.length - 1}
            >
              <ChevronRight size={22} />
            </IconButton>
            <IconButton
              label="最初へ"
              onClick={() => {
                setPlaying(false);
                setIndex(0);
              }}
              disabled={index <= 0}
            >
              <ChevronFirst size={22} />
            </IconButton>
            <IconButton
              label="最後へ"
              onClick={() => {
                setPlaying(false);
                setIndex(steps.length - 1);
              }}
              disabled={index >= steps.length - 1}
            >
              <ChevronLast size={22} />
            </IconButton>
          </div>
          <div className="toolbar-group">
            <IconButton label="配列をシャッフル" onClick={goShuffle}>
              <Shuffle size={22} />
            </IconButton>
            <IconButton label="同じアルゴリズムでやり直し" onClick={replay}>
              <RotateCcw size={22} />
            </IconButton>
          </div>
          <div className="toolbar-group speed-wrap">
            <Gauge size={20} aria-hidden />
            <span>速さ</span>
            <input
              type="range"
              min={0}
              max={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              aria-label="アニメーションの速さ"
            />
          </div>
        </div>
      </header>

      <div className="algo-panel">
        <aside className="algo-list" aria-label="アルゴリズム選択">
          <h2>
            <ArrowDownWideNarrow size={14} aria-hidden />
            アルゴリズム
          </h2>
          {(Object.keys(ALGORITHMS) as AlgorithmId[]).map((id) => {
            const Icon = ALGO_ICONS[id];
            return (
              <button
                key={id}
                type="button"
                className="algo-btn"
                data-on={algo === id ? "true" : undefined}
                onClick={() => goAlgo(id)}
              >
                <div className="algo-btn-inner">
                  <span className="algo-icon" aria-hidden>
                    <Icon size={22} strokeWidth={1.85} />
                  </span>
                  <div className="algo-btn-text">
                    <strong>{ALGORITHMS[id].label}</strong>
                    <span>{ALGORITHMS[id].description}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        <section className="stage-wrap" aria-live="polite">
          <div className="legend" aria-label="棒の色の意味">
            <span className="legend-item legend-compare">
              <GitCompare size={18} aria-hidden />
              比較中
            </span>
            <span className="legend-item legend-swap">
              <ArrowLeftRight size={18} aria-hidden />
              交換
            </span>
            <span className="legend-item legend-pivot">
              <Target size={18} aria-hidden />
              ピボット
            </span>
            <span className="legend-item legend-sorted">
              <CheckCircle2 size={18} aria-hidden />
              確定
            </span>
          </div>

          <div className="caption-bar">
            <div className="caption">
              <BookOpen size={18} aria-hidden />
              {step?.caption ?? "準備中"}
            </div>
            <div className="step-meter">
              ステップ {index + 1} / {Math.max(1, steps.length)}
            </div>
          </div>

          <div className="bars" role="img" aria-label="値の棒グラフ">
            {step?.bars.map((b, i) => {
              const h = (b.value / maxVal) * 100;
              const isCompare =
                step.compare?.includes(i) && !step.swap?.includes(i);
              const isSwap = step.swap?.includes(i);
              const isPivot = step.pivot === i;
              const isSorted = sortedSet.has(i);
              return (
                <div key={b.id} className="bar-col">
                  <div
                    className="bar"
                    style={{ height: `${h}%` }}
                    data-compare={isCompare ? "true" : undefined}
                    data-swap={isSwap ? "true" : undefined}
                    data-pivot={isPivot ? "true" : undefined}
                    data-sorted={isSorted && !isCompare && !isSwap ? "true" : undefined}
                  />
                  <span className="bar-val">{b.value}</span>
                </div>
              );
            })}
          </div>

          <div className="legend" style={{ marginTop: 4 }}>
            <span>
              <GitCompareArrows size={14} aria-hidden />
              {meta.label} · {BAR_COUNT} 要素
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
