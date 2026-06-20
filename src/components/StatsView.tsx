import { useStore } from '../store/useStore';
import { MONSTER_MAP } from '../data/monsters';
import CanSVG from './CanSVG';
import StarRating from './StarRating';

const COFFEE_MG  = 95;
const REDBULL_MG = 80;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 9,
      color: 'rgba(57,255,20,0.6)',
      letterSpacing: 4,
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: '1px solid #1a1a1a',
    }}>
      {children}
    </div>
  );
}

export default function StatsView() {
  const log = useStore(s => s.log);

  // ── Cafeïne totaal ────────────────────────────────────────────────────────
  const totalCaffeine = log.reduce((sum, e) => {
    const m   = MONSTER_MAP.get(e.monsterId);
    const mg  = m ? parseInt(m.caffeine) || 0 : 0;
    return sum + mg * (e.quantity ?? 1);
  }, 0);

  const coffees  = (totalCaffeine / COFFEE_MG).toFixed(1);
  const redbulls = (totalCaffeine / REDBULL_MG).toFixed(1);

  // ── Top 10 op gemiddelde rating ───────────────────────────────────────────
  const ratingMap = new Map<string, { total: number; count: number; name: string }>();
  log.forEach(e => {
    const cur = ratingMap.get(e.monsterId) ?? { total: 0, count: 0, name: e.name };
    ratingMap.set(e.monsterId, {
      total: cur.total + e.ratingVal,
      count: cur.count + 1,
      name:  e.name,
    });
  });

  const top10 = [...ratingMap.entries()]
    .map(([id, { total, count, name }]) => ({ id, avg: total / count, count, name }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  // ── Meest gedronken (op quantity) ────────────────────────────────────────
  const drinkMap = new Map<string, { total: number; name: string }>();
  log.forEach(e => {
    const cur = drinkMap.get(e.monsterId) ?? { total: 0, name: e.name };
    drinkMap.set(e.monsterId, { total: cur.total + (e.quantity ?? 1), name: e.name });
  });

  const top5drinks = [...drinkMap.entries()]
    .map(([id, { total, name }]) => ({ id, total, name }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (log.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#333', letterSpacing: 2 }}>
          NOG GEEN DATA
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#2a2a2a', marginTop: 8 }}>
          Log je eerste blikje om stats te zien!
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 14px 60px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

      {/* ── Totale cafeïne ── */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: 14,
        padding: '20px 18px',
        marginBottom: 28,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 8,
          color: '#444', letterSpacing: 4, marginBottom: 8,
        }}>
          TOTALE CAFEÏNE GECONSUMEERD
        </div>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 64,
          color: '#39FF14',
          lineHeight: 1,
          textShadow: '0 0 20px rgba(57,255,20,0.6), 0 0 50px rgba(57,255,20,0.25)',
          marginBottom: 4,
        }}>
          {totalCaffeine.toLocaleString('nl-NL')}
          <span style={{ fontSize: 24, marginLeft: 6, opacity: 0.6 }}>mg</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#555' }}>
            ☕ <span style={{ color: '#aaa' }}>{coffees}</span> kopjes koffie
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#555' }}>
            🐂 <span style={{ color: '#aaa' }}>{redbulls}</span> Red Bulls
          </div>
        </div>
      </div>

      {/* ── Top 10 rating ── */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>JOUW TOP 10</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {top10.map((item, rank) => {
            const monster = MONSTER_MAP.get(item.id);
            const displayMonster = monster ?? {
              id: item.id, name: item.name, flavor: '', caffeine: '',
              cat: 'Special' as const, c1: '#111', c2: '#333', str: '#555', lbl: '#fff',
            };
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: rank === 0 ? 'rgba(57,255,20,0.06)' : '#0a0a0a',
                  border: `1px solid ${rank === 0 ? 'rgba(57,255,20,0.2)' : '#1a1a1a'}`,
                  borderRadius: 10,
                  padding: '8px 12px',
                }}
              >
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 10,
                  color: rank === 0 ? '#39FF14' : '#333',
                  fontWeight: 700, minWidth: 20, textAlign: 'center',
                }}>
                  #{rank + 1}
                </div>
                <CanSVG monster={displayMonster} width={28} height={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, color: '#ddd', letterSpacing: 0.5 }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#444' }}>
                    {item.count}× gelogd
                  </div>
                </div>
                <StarRating value={item.avg} onChange={() => {}} readonly />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Meest gedronken ── */}
      <div>
        <SectionTitle>MEEST GEDRONKEN</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {top5drinks.map((item, rank) => {
            const monster = MONSTER_MAP.get(item.id);
            const displayMonster = monster ?? {
              id: item.id, name: item.name, flavor: '', caffeine: '',
              cat: 'Special' as const, c1: '#111', c2: '#333', str: '#555', lbl: '#fff',
            };
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  borderRadius: 10,
                  padding: '8px 12px',
                }}
              >
                <CanSVG monster={displayMonster} width={28} height={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, color: '#ddd', letterSpacing: 0.5 }}>
                    {item.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: 32,
                    color: rank === 0 ? '#39FF14' : '#aaa',
                    lineHeight: 1,
                    textShadow: rank === 0 ? '0 0 12px rgba(57,255,20,0.4)' : 'none',
                  }}>
                    {item.total}
                  </div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 7, color: '#444', letterSpacing: 2 }}>
                    BLIKJES
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
