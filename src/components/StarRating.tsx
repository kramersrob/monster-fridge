import { useId } from 'react';

type Props = {
  value: number;      // 0–10, stappen van 0.5
  onChange: (v: number) => void;
  readonly?: boolean;
};

const STAR_POINTS = '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26';

export default function StarRating({ value, onChange, readonly = false }: Props) {
  const uid  = useId().replace(/:/g, '');
  const size = readonly ? 11 : 20;
  const gap  = readonly ? 2  : 4;

  function getFill(i: number): 'full' | 'half' | 'empty' {
    if (value >= i)       return 'full';
    if (value >= i - 0.5) return 'half';
    return 'empty';
  }

  function handleClick(i: number, isLeft: boolean) {
    if (readonly) return;
    onChange(isLeft ? i - 0.5 : i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, userSelect: 'none', flexWrap: 'nowrap' }}>
      {Array.from({ length: 10 }, (_, idx) => idx + 1).map(i => {
        const fill   = getFill(i);
        const gradId = `sg-${uid}-${i}`;

        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            style={{ cursor: readonly ? 'default' : 'pointer', flexShrink: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>

            {/* Grey background star */}
            <polygon
              points={STAR_POINTS}
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />

            {/* Filled / half star */}
            {fill !== 'empty' && (
              <polygon
                points={STAR_POINTS}
                fill={fill === 'full' ? '#FFD700' : `url(#${gradId})`}
                stroke="rgba(255,215,0,0.25)"
                strokeWidth="0.5"
              />
            )}

            {/* Click zones (left = X.5, right = X.0) */}
            {!readonly && (
              <>
                <rect x="0"  y="0" width="12" height="24" fill="transparent" onClick={() => handleClick(i, true)}  />
                <rect x="12" y="0" width="12" height="24" fill="transparent" onClick={() => handleClick(i, false)} />
              </>
            )}
          </svg>
        );
      })}

      {/* Numerieke waarde */}
      <span style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: readonly ? 9 : 13,
        color: value > 0 ? '#FFD700' : '#444',
        fontWeight: 700,
        minWidth: readonly ? 22 : 30,
        marginLeft: 2,
      }}>
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  );
}
