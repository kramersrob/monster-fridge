type Props = {
  value: number;      // 0–10, steps of 0.5
  onChange: (v: number) => void;
  readonly?: boolean;
};

export default function StarRating({ value, onChange, readonly = false }: Props) {
  const stars = [1, 2, 3, 4, 5]; // each star = 2 points (0–10 scale)

  function getStarFill(starIdx: number): 'full' | 'half' | 'empty' {
    const starVal = starIdx * 2;
    if (value >= starVal)       return 'full';
    if (value >= starVal - 1)   return 'half';
    return 'empty';
  }

  function handleClick(starIdx: number, half: boolean) {
    if (readonly) return;
    const newVal = half ? starIdx * 2 - 1 : starIdx * 2;
    onChange(newVal);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}>
      {stars.map((s) => {
        const fill = getStarFill(s);
        const gradId = `star-grad-${s}-${Math.random().toString(36).slice(2,5)}`;

        return (
          <svg
            key={s}
            width={readonly ? 14 : 24}
            height={readonly ? 14 : 24}
            viewBox="0 0 24 24"
            style={{ cursor: readonly ? 'default' : 'pointer', flexShrink: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>

            {/* Empty star background */}
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />

            {/* Filled star */}
            {fill !== 'empty' && (
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={fill === 'full' ? '#FFD700' : `url(#${gradId})`}
                stroke="rgba(255,215,0,0.3)"
                strokeWidth="0.5"
              />
            )}

            {/* Left half click area */}
            {!readonly && (
              <rect
                x="0" y="0" width="12" height="24"
                fill="transparent"
                onClick={() => handleClick(s, true)}
              />
            )}
            {/* Right half click area */}
            {!readonly && (
              <rect
                x="12" y="0" width="12" height="24"
                fill="transparent"
                onClick={() => handleClick(s, false)}
              />
            )}
          </svg>
        );
      })}

      {/* Numeric value */}
      <span style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: readonly ? 10 : 14,
        color: '#FFD700',
        fontWeight: 700,
        minWidth: readonly ? 24 : 32,
      }}>
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  );
}
