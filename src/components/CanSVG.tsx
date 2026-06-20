import type { Monster } from '../data/monsters';

type Props = {
  monster: Monster;
  width?: number;
  height?: number;
};

export default function CanSVG({ monster, width = 90, height = 130 }: Props) {
  const { c1, c2, name, id } = monster;

  const uid      = id.replace(/[^a-z0-9]/gi, '');
  const gId      = `g-${uid}`;
  const clipId   = `c-${uid}`;

  // Cylinder dimensions
  const rx       = width * 0.13;
  const ellH     = height * 0.06;
  const bodyTop  = ellH * 0.55;
  const bodyBot  = height - ellH * 0.55;
  const bodyH    = bodyBot - bodyTop;

  // Label band: bottom 35% of body
  const labelH   = bodyH * 0.35;
  const labelTop = bodyBot - labelH;

  // Three diagonal stripe ("M claw") geometry
  const stripeArea_top = bodyTop + 6;
  const stripeArea_bot = labelTop - 3;
  const stripeH    = stripeArea_bot - stripeArea_top;
  const sw         = width * 0.07;   // stripe half-width
  const slant      = stripeH * 0.14; // lean at top vs bottom

  function stripePoints(cx: number): string {
    const tl = `${(cx - sw + slant).toFixed(1)},${stripeArea_top.toFixed(1)}`;
    const tr = `${(cx + sw + slant).toFixed(1)},${stripeArea_top.toFixed(1)}`;
    const br = `${(cx + sw - slant).toFixed(1)},${stripeArea_bot.toFixed(1)}`;
    const bl = `${(cx - sw - slant).toFixed(1)},${stripeArea_bot.toFixed(1)}`;
    return `${tl} ${tr} ${br} ${bl}`;
  }

  const s1 = width * 0.24;
  const s2 = width * 0.50;
  const s3 = width * 0.76;

  // Label text: dynamic font size based on name length
  const labelMid = labelTop + labelH * 0.62;
  const maxW     = width - 10;
  const fontSize = name.length <= 7  ? Math.min(18, labelH * 0.46)
                 : name.length <= 11 ? Math.min(14, labelH * 0.38)
                 :                     Math.min(11, labelH * 0.30);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Body gradient: c1 left → c2 right (gives 3D cylinder look) */}
        <linearGradient id={gId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={c1} />
          <stop offset="55%"  stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>

        {/* Clip to rounded-rect body shape */}
        <clipPath id={clipId}>
          <rect x="1" y={bodyTop} width={width - 2} height={bodyH} rx={rx} />
        </clipPath>
      </defs>

      {/* ── Can body ── */}
      <rect
        x="1" y={bodyTop}
        width={width - 2} height={bodyH}
        rx={rx}
        fill={`url(#${gId})`}
      />

      {/* ── Three diagonal M-stripes (clipped to body) ── */}
      <g clipPath={`url(#${clipId})`}>
        {[s1, s2, s3].map((cx, i) => (
          <polygon
            key={i}
            points={stripePoints(cx)}
            fill={c2}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.5"
            opacity="0.82"
          />
        ))}
      </g>

      {/* ── Black label band ── */}
      <rect
        x="1" y={labelTop}
        width={width - 2} height={labelH + ellH}
        fill="#000"
        clipPath={`url(#${clipId})`}
      />

      {/* Subtle separator line between stripes and label */}
      <line
        x1="4" y1={labelTop}
        x2={width - 4} y2={labelTop}
        stroke={c2}
        strokeWidth="1"
        clipPath={`url(#${clipId})`}
        opacity="0.6"
      />

      {/* ── Name in label ── */}
      <text
        x={width / 2}
        y={labelMid}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={fontSize}
        fill="white"
        letterSpacing="1"
        clipPath={`url(#${clipId})`}
        style={{ userSelect: 'none' }}
      >
        <tspan textLength={name.length > 11 ? maxW : undefined} lengthAdjust="spacingAndGlyphs">
          {name.toUpperCase()}
        </tspan>
      </text>

      {/* ── Highlight (left edge 3D) ── */}
      <rect
        x="1" y={bodyTop}
        width={width * 0.11} height={bodyH}
        rx={rx}
        fill="rgba(255,255,255,0.10)"
        clipPath={`url(#${clipId})`}
      />

      {/* ── Top ellipse (aluminum lid) ── */}
      <ellipse cx={width / 2} cy={bodyTop} rx={(width - 2) / 2} ry={ellH}     fill="#555" />
      <ellipse cx={width / 2} cy={bodyTop} rx={(width - 6) / 2} ry={ellH - 1} fill="#999" />
      {/* Pull-tab hint */}
      <ellipse cx={width / 2 + width * 0.12} cy={bodyTop} rx={width * 0.07} ry={ellH * 0.55} fill="#777" />

      {/* ── Bottom ellipse ── */}
      <ellipse cx={width / 2} cy={bodyBot} rx={(width - 2) / 2} ry={ellH}     fill="#111" />
      <ellipse cx={width / 2} cy={bodyBot} rx={(width - 4) / 2} ry={ellH - 1} fill="#222" />
    </svg>
  );
}
