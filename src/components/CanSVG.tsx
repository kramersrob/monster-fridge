import type { Monster } from '../data/monsters';

type Props = {
  monster: Monster;
  width?: number;
  height?: number;
};

export default function CanSVG({ monster, width = 56, height = 76 }: Props) {
  const { c1, c2, str, lbl, id, name } = monster;

  const gId   = `grad-${id}`;
  const bgId  = `bg-${id}`;
  const hlId  = `hl-${id}`;

  const rx = width * 0.14;
  const topEllipseH  = height * 0.06;
  const botEllipseH  = height * 0.05;
  const bodyTop      = topEllipseH * 0.6;
  const bodyH        = height - bodyTop - botEllipseH * 0.6;

  // Label band: middle 40% of body
  const bandTop = bodyTop + bodyH * 0.22;
  const bandH   = bodyH * 0.5;

  // M sizing
  const mSize     = Math.round(height * 0.34);
  const suffixSize = Math.round(height * 0.155);
  const mY        = bandTop + bandH * 0.69;
  const mX        = width * 0.5;

  // Watermark MONSTER behind M
  const wmSize = Math.round(height * 0.23);
  const wmY    = bandTop + bandH * 0.68;

  // Name line
  const nameSize = Math.max(5, Math.round(height * 0.085));
  const nameY    = mY + mSize * 0.08;

  // Short display name (truncate if too long)
  const displayName = name.length > 14 ? name.slice(0, 13) + '…' : name;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Main gradient: c1 → c2 → c1 */}
        <linearGradient id={gId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={c1} />
          <stop offset="50%"  stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>

        {/* Dark band gradient */}
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.55)" />
          <stop offset="40%"  stopColor="rgba(0,0,0,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </linearGradient>

        {/* Highlight gradient (3D effect) */}
        <linearGradient id={hlId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <clipPath id={`clip-${id}`}>
          <rect x="0" y={bodyTop} width={width} height={bodyH} rx={rx} />
        </clipPath>
      </defs>

      {/* ── Can body ── */}
      <rect
        x="0" y={bodyTop}
        width={width} height={bodyH}
        rx={rx}
        fill={`url(#${gId})`}
      />

      {/* Dark label band */}
      <rect
        x="0" y={bandTop}
        width={width} height={bandH}
        fill={`url(#${bgId})`}
        clipPath={`url(#clip-${id})`}
      />

      {/* Watermark MONSTER */}
      <text
        x={mX} y={wmY}
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={wmSize}
        fill={str}
        opacity={0.28}
        letterSpacing="1"
      >
        MONSTER
      </text>

      {/* Big M + ONSTER as one word, two sizes */}
      <text
        x={mX} y={mY}
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fontFamily="'Bebas Neue', sans-serif"
        fill={lbl}
        letterSpacing="0.5"
      >
        <tspan fontSize={mSize} dy="0">M</tspan>
        <tspan fontSize={suffixSize} dy={`${mSize - suffixSize}px`} dx="-1">ONSTER</tspan>
      </text>

      {/* Can name below M */}
      <text
        x={mX} y={nameY + nameSize * 1.1}
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={nameSize}
        fill={lbl}
        opacity={0.8}
        letterSpacing="0.5"
      >
        {displayName}
      </text>

      {/* Highlight streak (left edge, 3D) */}
      <rect
        x={0} y={bodyTop}
        width={width * 0.12} height={bodyH}
        rx={rx}
        fill={`url(#${hlId})`}
        clipPath={`url(#clip-${id})`}
      />

      {/* Top ellipse */}
      <ellipse
        cx={width / 2} cy={bodyTop}
        rx={width / 2} ry={topEllipseH}
        fill="#666"
      />
      <ellipse
        cx={width / 2} cy={bodyTop}
        rx={width / 2 - 2} ry={topEllipseH - 1}
        fill="#888"
      />

      {/* Bottom ellipse */}
      <ellipse
        cx={width / 2} cy={bodyTop + bodyH}
        rx={width / 2} ry={botEllipseH}
        fill="#222"
      />
      <ellipse
        cx={width / 2} cy={bodyTop + bodyH}
        rx={width / 2 - 1} ry={botEllipseH - 1}
        fill="#333"
      />
    </svg>
  );
}
