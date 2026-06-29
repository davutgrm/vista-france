/**
 * PropertyImage — hand-drawn SVG "listing photos". Stands in for the
 * AI-generated renders in demo mode, but looks like curated, on-brand art
 * instead of a flat placeholder. Parameterised by scene + hue.
 */
import type { CSSProperties } from "react";

export type Scene = "city" | "coast" | "house" | "loft" | "vineyard";

const L = "#ffd27a"; // lit window (gold)

function Windows({
  x, y, w, h, cols, rows, gap = 3, hue, seed = 1,
}: { x: number; y: number; w: number; h: number; cols: number; rows: number; gap?: number; hue: string; seed?: number }) {
  const cw = (w - gap * (cols + 1)) / cols;
  const ch = (h - gap * (rows + 1)) / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const on = (i * 7 + seed * 3) % 5 === 0; // deterministic "lit" pattern
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + gap + c * (cw + gap)}
          y={y + gap + r * (ch + gap)}
          width={cw}
          height={ch}
          rx={0.6}
          fill={on ? L : `oklch(34% 0.07 ${hue})`}
          opacity={on ? 0.95 : 0.7}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

export function PropertyImage({
  scene = "city",
  hue = "255",
  className,
  style,
}: { scene?: Scene; hue?: string; className?: string; style?: CSSProperties }) {
  const id = `${scene}-${hue}`;
  const v = scene === "loft" ? "loft" : scene === "vineyard" ? "vineyard" : scene;

  return (
    <svg viewBox="0 0 400 225" className={className} style={style} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`oklch(90% 0.05 ${hue})`} />
          <stop offset="0.55" stopColor={`oklch(78% 0.1 ${hue})`} />
          <stop offset="1" stopColor={`oklch(86% 0.09 75)`} />
        </linearGradient>
        <radialGradient id={`sun-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="0.4" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${id}`} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#0a1430" stopOpacity="0.34" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect width="400" height="225" fill={`url(#sky-${id})`} />
      {/* sun glow */}
      <circle cx="300" cy="74" r="64" fill={`url(#sun-${id})`} />
      <circle cx="300" cy="74" r="15" fill="#ffe6a8" />

      {v === "city" && (
        <g>
          {/* haze hills */}
          <path d="M0 150 Q100 132 210 148 T400 142 V225 H0 Z" fill={`oklch(64% 0.09 ${hue})`} opacity="0.5" />
          {/* back row */}
          <rect x="20" y="108" width="44" height="100" fill={`oklch(50% 0.09 ${hue})`} />
          <rect x="78" y="92" width="40" height="116" fill={`oklch(46% 0.1 ${hue})`} />
          <rect x="330" y="100" width="46" height="108" fill={`oklch(48% 0.09 ${hue})`} />
          <Windows x={330} y={100} w={46} h={108} cols={3} rows={7} hue={hue} seed={4} />
          {/* hero towers */}
          <rect x="130" y="66" width="58" height="142" rx="2" fill={`oklch(42% 0.11 ${hue})`} />
          <Windows x={130} y={66} w={58} h={142} cols={4} rows={9} hue={hue} seed={1} />
          <rect x="200" y="44" width="64" height="164" rx="2" fill={`oklch(38% 0.12 ${hue})`} />
          <Windows x={200} y={44} w={64} h={164} cols={4} rows={11} hue={hue} seed={2} />
          <rect x="276" y="82" width="48" height="126" rx="2" fill={`oklch(44% 0.1 ${hue})`} />
          <Windows x={276} y={82} w={48} h={126} cols={3} rows={8} hue={hue} seed={3} />
          <Windows x={20} y={108} w={44} h={100} cols={3} rows={6} hue={hue} seed={5} />
          <Windows x={78} y={92} w={40} h={116} cols={3} rows={7} hue={hue} seed={6} />
        </g>
      )}

      {v === "coast" && (
        <g>
          {/* sea */}
          <rect x="0" y="150" width="400" height="75" fill={`oklch(60% 0.12 ${hue})`} />
          <rect x="0" y="150" width="400" height="75" fill={`url(#vig-${id})`} opacity="0.0" />
          <path d="M0 150 H400 V164 Q300 158 200 164 T0 162 Z" fill={`oklch(72% 0.1 ${hue})`} opacity="0.5" />
          {/* villa */}
          <rect x="120" y="116" width="170" height="42" fill="#f4efe6" />
          <rect x="120" y="116" width="170" height="6" fill="#e3d8c4" />
          <rect x="138" y="128" width="22" height="26" fill={`oklch(40% 0.08 ${hue})`} />
          <rect x="172" y="128" width="40" height="30" fill={L} opacity="0.85" />
          <rect x="224" y="128" width="40" height="30" fill={`oklch(40% 0.08 ${hue})`} />
          {/* palms */}
          <rect x="66" y="120" width="4" height="40" fill="#6b5a3c" />
          <path d="M68 120 q-22 -6 -30 2 q20 -2 30 6 q14 -16 30 -10 q-16 0 -30 2 z" fill="#3f7d52" />
          <rect x="330" y="124" width="4" height="36" fill="#6b5a3c" />
          <path d="M332 124 q22 -6 30 2 q-20 -2 -30 6 q-14 -16 -30 -10 q16 0 30 2 z" fill="#3f7d52" />
        </g>
      )}

      {(v === "house" || v === "vineyard") && (
        <g>
          {/* hills */}
          <path d="M0 150 Q120 120 240 146 T400 138 V225 H0 Z" fill={`oklch(70% 0.13 135)`} opacity="0.85" />
          <path d="M0 172 Q160 150 280 170 T400 166 V225 H0 Z" fill={`oklch(60% 0.14 138)`} />
          {v === "vineyard" &&
            Array.from({ length: 7 }).map((_, i) => (
              <line key={i} x1={20 + i * 54} y1="186" x2={40 + i * 54} y2="220" stroke={`oklch(42% 0.1 135)`} strokeWidth="2" opacity="0.5" />
            ))}
          {/* house */}
          <rect x="150" y="118" width="100" height="50" fill="#f5efe4" />
          <path d="M142 118 L200 84 L258 118 Z" fill={`oklch(46% 0.13 28)`} />
          <rect x="190" y="138" width="20" height="30" fill={`oklch(40% 0.1 28)`} />
          <rect x="160" y="128" width="20" height="18" fill={L} opacity="0.9" />
          <rect x="220" y="128" width="20" height="18" fill={L} opacity="0.9" />
          {/* tree */}
          <rect x="300" y="138" width="6" height="34" fill="#6b5a3c" />
          <circle cx="303" cy="130" r="20" fill={`oklch(58% 0.14 145)`} />
          <circle cx="291" cy="138" r="13" fill={`oklch(54% 0.14 145)`} />
        </g>
      )}

      {v === "loft" && (
        <g>
          {/* brick facade */}
          <rect x="40" y="40" width="320" height="168" fill={`oklch(52% 0.1 ${hue})`} />
          <rect x="40" y="40" width="320" height="168" fill="#000" opacity="0.06" />
          {/* big industrial windows */}
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => {
              const on = (r * 4 + c) % 3 === 0;
              return (
                <g key={`${r}-${c}`}>
                  <rect x={64 + c * 74} y={58 + r * 50} width="54" height="34" rx="1.5" fill={on ? L : `oklch(34% 0.08 ${hue})`} opacity={on ? 0.92 : 0.85} />
                  <line x1={64 + c * 74 + 27} y1={58 + r * 50} x2={64 + c * 74 + 27} y2={58 + r * 50 + 34} stroke={`oklch(52% 0.1 ${hue})`} strokeWidth="2" />
                  <line x1={64 + c * 74} y1={58 + r * 50 + 17} x2={64 + c * 74 + 54} y2={58 + r * 50 + 17} stroke={`oklch(52% 0.1 ${hue})`} strokeWidth="2" />
                </g>
              );
            }),
          )}
        </g>
      )}

      {/* vignette + grain feel */}
      <rect width="400" height="225" fill={`url(#vig-${id})`} />
    </svg>
  );
}
