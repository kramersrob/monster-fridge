import { useStore } from '../store/useStore';
import { MONSTER_MAP } from '../data/monsters';
import CanSVG from './CanSVG';
import StarRating from './StarRating';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      flex: 1,
      background: '#0f0f0f',
      border: '1px solid #1f1f1f',
      borderRadius: 10,
      padding: '14px 12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 20,
        fontWeight: 900,
        color: '#39FF14',
        marginBottom: 4,
        textShadow: '0 0 10px rgba(57,255,20,0.4)',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 7,
        color: '#444',
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function LogView() {
  const log       = useStore(s => s.log);
  const deleteLog = useStore(s => s.deleteLog);

  const total     = log.length;
  const unique    = new Set(log.map(e => e.monsterId)).size;
  const avgRating = total > 0
    ? (log.reduce((s, e) => s + e.ratingVal, 0) / total).toFixed(1)
    : '—';

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#333' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🥤</div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#333', letterSpacing: 2 }}>
          NOG GEEN BLIKJES GELOGD
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#2a2a2a', marginTop: 8 }}>
          Open de koelkast, kies een smaak en log hem!
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 12px 40px', maxWidth: 680, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <StatCard label="Totaal gedronken" value={total}     />
        <StatCard label="Unieke smaken"    value={unique}    />
        <StatCard label="Gem. rating"      value={avgRating} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {log.map(entry => {
          const monster = MONSTER_MAP.get(entry.monsterId);
          const displayMonster = monster ?? {
            id: entry.monsterId, name: entry.name,
            flavor: entry.flavor, caffeine: '',
            cat: 'Special' as const,
            c1: entry.c1, c2: entry.c2, str: entry.str, lbl: entry.lbl,
          };

          const date = new Date(entry.date).toLocaleDateString('nl-NL', {
            day: 'numeric', month: 'short', year: 'numeric',
          });

          return (
            <div
              key={entry.id}
              style={{
                background: '#0d0d0d',
                border: '1px solid #1a1a1a',
                borderLeft: `3px solid ${entry.c2}`,
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <CanSVG monster={displayMonster} width={28} height={38} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, color: '#ddd', letterSpacing: 1 }}>
                  {entry.name}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#444', marginTop: 1 }}>
                  {date}
                </div>
                {entry.note && (
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#555',
                    marginTop: 3, fontStyle: 'italic',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    "{entry.note}"
                  </div>
                )}
              </div>

              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <StarRating value={entry.ratingVal} onChange={() => {}} readonly />
                <button
                  onClick={() => deleteLog(entry.id)}
                  style={{
                    background: 'none', border: 'none', color: '#2a2a2a',
                    cursor: 'pointer', fontSize: 12, padding: '2px 4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#2a2a2a')}
                  title="Verwijder entry"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
