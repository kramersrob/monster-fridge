import { MONSTER_MAP } from '../data/monsters';
import type { DbLogEntry, Profile } from '../lib/supabase';
import CanSVG from './CanSVG';
import StarRating from './StarRating';

type Props = {
  log: DbLogEntry[];
  userId: string;
  profiles: Profile[];
};

type UserStats = {
  profile: Profile | null;
  total: number;
  unique: number;
  avgRating: number;
  monsterIds: Set<string>;
  logById: Map<string, DbLogEntry[]>;
};

function buildStats(log: DbLogEntry[], uid: string, profiles: Profile[]): UserStats {
  const profile = profiles.find(p => p.id === uid) ?? null;
  const myLog   = log.filter(e => e.user_id === uid);
  const ids     = new Set(myLog.map(e => e.monster_id));
  const avg     = myLog.length ? myLog.reduce((s, e) => s + e.rating_val, 0) / myLog.length : 0;
  const byId    = new Map<string, DbLogEntry[]>();
  for (const e of myLog) {
    if (!byId.has(e.monster_id)) byId.set(e.monster_id, []);
    byId.get(e.monster_id)!.push(e);
  }
  return { profile, total: myLog.length, unique: ids.size, avgRating: avg, monsterIds: ids, logById: byId };
}

function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Orbitron',
        fontSize: 22,
        fontWeight: 900,
        color: highlight ? '#39FF14' : '#bbb',
        textShadow: highlight ? '0 0 10px rgba(57,255,20,0.4)' : 'none',
      }}>
        {value}
      </div>
      <div style={{ fontFamily: 'Orbitron', fontSize: 7, color: '#444', letterSpacing: 2, marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}

type UserColProps = { stats: UserStats; isMe: boolean };
function UserColumn({ stats, isMe }: UserColProps) {
  const name = stats.profile?.username ?? (isMe ? 'Jij' : 'Onbekend');
  const myBetter = stats.avgRating;
  return (
    <div style={{
      flex: 1,
      background: isMe ? 'rgba(57,255,20,0.04)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isMe ? 'rgba(57,255,20,0.15)' : '#1a1a1a'}`,
      borderRadius: 12,
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: isMe ? '#39FF14' : '#888', letterSpacing: 2 }}>
          {name}
        </div>
        {isMe && <div style={{ fontFamily: 'Orbitron', fontSize: 7, color: 'rgba(57,255,20,0.4)', letterSpacing: 2 }}>JIJ</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <StatCard label="GEDRONKEN" value={stats.total}                       highlight={isMe} />
        <StatCard label="SMAKEN"    value={stats.unique}                      highlight={isMe} />
        <StatCard label="GEM. ★"   value={myBetter > 0 ? myBetter.toFixed(1) : '—'} highlight={isMe} />
      </div>
    </div>
  );
}

export default function CompareView({ log, userId, profiles }: Props) {
  const otherUsers = [...new Set(log.map(e => e.user_id))].filter(id => id !== userId);
  const otherId    = otherUsers[0] ?? null;

  const me    = buildStats(log, userId,     profiles);
  const other = otherId ? buildStats(log, otherId, profiles) : null;

  if (log.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#222' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#2a2a2a', letterSpacing: 2 }}>
          NOG GEEN DATA
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#1a1a1a', marginTop: 8 }}>
          Log eerst een paar Monsters!
        </div>
      </div>
    );
  }

  // Shared monsters (both logged)
  const sharedIds = other
    ? [...me.monsterIds].filter(id => other.monsterIds.has(id))
    : [];
  const onlyMeIds = [...me.monsterIds].filter(id => !other?.monsterIds.has(id));
  const onlyOtherIds = other ? [...other.monsterIds].filter(id => !me.monsterIds.has(id)) : [];

  return (
    <div style={{ padding: '16px 12px 60px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

      {/* Side-by-side user stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <UserColumn stats={me}    isMe={true}  />
        {other
          ? <UserColumn stats={other} isMe={false} />
          : (
            <div style={{ flex: 1, border: '1px dashed #1a1a1a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, color: '#2a2a2a', fontFamily: 'Orbitron', fontSize: 8, letterSpacing: 2, textAlign: 'center' }}>
              WACHT OP<br />JE PARTNER
            </div>
          )
        }
      </div>

      {/* Beiden gedronken */}
      {sharedIds.length > 0 && (
        <Section title="BEIDEN GEDRONKEN" accent="#39FF14">
          {sharedIds.map(id => {
            const monster  = MONSTER_MAP.get(id);
            const myEntry  = me.logById.get(id)?.[0];
            const hisEntry = other?.logById.get(id)?.[0];
            const myName   = me.profile?.username ?? 'Jij';
            const hisName  = other?.profile?.username ?? 'Partner';
            if (!monster || !myEntry) return null;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #111' }}>
                <CanSVG monster={monster} width={28} height={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 13, color: '#ccc', letterSpacing: 1 }}>
                    {monster.name}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 3 }}>
                    <RatingLine label={myName}  rating={myEntry.rating_val} />
                    {hisEntry && <RatingLine label={hisName} rating={hisEntry.rating_val} />}
                  </div>
                </div>
              </div>
            );
          })}
        </Section>
      )}

      {/* Alleen jij */}
      {onlyMeIds.length > 0 && (
        <Section title={`ALLEEN ${(me.profile?.username ?? 'JIJ').toUpperCase()} GEPROBEERD`} accent="#39FF14">
          <MonsterList ids={onlyMeIds} log={me.logById} />
        </Section>
      )}

      {/* Alleen partner */}
      {other && onlyOtherIds.length > 0 && (
        <Section title={`ALLEEN ${(other.profile?.username ?? 'PARTNER').toUpperCase()} GEPROBEERD`} accent="#888">
          <MonsterList ids={onlyOtherIds} log={other.logById} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: 'Orbitron',
        fontSize: 8,
        color: accent,
        letterSpacing: 4,
        marginBottom: 10,
        opacity: 0.7,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function RatingLine({ label, rating }: { label: string; rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: 'Orbitron', fontSize: 7, color: '#444', letterSpacing: 1 }}>{label}:</span>
      <StarRating value={rating} onChange={() => {}} readonly />
    </div>
  );
}

function MonsterList({ ids, log }: { ids: string[]; log: Map<string, DbLogEntry[]> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {ids.map(id => {
        const monster = MONSTER_MAP.get(id);
        const entry   = log.get(id)?.[0];
        if (!monster) return null;
        return (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <CanSVG monster={monster} width={36} height={50} />
            {entry && (
              <span style={{ fontFamily: 'Orbitron', fontSize: 7, color: '#FFD700', fontWeight: 700 }}>
                {entry.rating_val.toFixed(1)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
