import { useState } from 'react';
import type { Monster } from '../data/monsters';
import type { AddLogPayload, DbLogEntry } from '../lib/supabase';
import CanSVG from './CanSVG';
import StarRating from './StarRating';

type Props = {
  monster: Monster;
  log: DbLogEntry[];
  userId: string;
  onBack: () => void;
  onToast: (msg: string) => void;
  addLog: (payload: AddLogPayload) => Promise<void>;
};

export default function DetailScreen({ monster, log, userId, onBack, onToast, addLog }: Props) {
  const [rating,  setRating]  = useState(0);
  const [note,    setNote]    = useState('');
  const [saving,  setSaving]  = useState(false);

  const drinkCount = log.filter(e => e.monster_id === monster.id && e.user_id === userId).length;

  async function handleLog() {
    if (rating === 0) { onToast('Geef eerst een rating!'); return; }
    setSaving(true);
    await addLog({
      monster_id:     monster.id,
      monster_name:   monster.name,
      monster_flavor: monster.flavor,
      monster_cat:    monster.cat,
      rating_val:     rating,
      note:           note.trim(),
      c1:  monster.c1,
      c2:  monster.c2,
      lbl: monster.lbl,
      str: monster.str,
    });
    onToast(`⚡ ${monster.name} gelogd!`);
    setTimeout(() => onBack(), 300);
    setSaving(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a1a0a 0%, #050505 60%)',
      padding: '24px 20px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 420,
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: '1px solid #333',
          color: '#888',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 10,
          letterSpacing: 2,
          padding: '6px 14px',
          borderRadius: 6,
          cursor: 'pointer',
          marginBottom: 28,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget.style.color = '#39FF14'); (e.currentTarget.style.borderColor = '#39FF14'); }}
        onMouseLeave={e => { (e.currentTarget.style.color = '#888'); (e.currentTarget.style.borderColor = '#333'); }}
      >
        ← TERUG
      </button>

      {/* Big can */}
      <div style={{ marginBottom: 20 }}>
        <CanSVG monster={monster} width={100} height={138} />
      </div>

      {/* Name */}
      <h1 style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 34,
        color: '#39FF14',
        textShadow: '0 0 20px rgba(57,255,20,0.8), 0 0 50px rgba(57,255,20,0.35)',
        margin: '0 0 4px',
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        {monster.name}
      </h1>

      {/* Category + flavor */}
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 9,
        color: '#555',
        letterSpacing: 3,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        {monster.cat} · {monster.flavor}
      </p>

      {/* Caffeine badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(57,255,20,0.1)',
        border: '1px solid rgba(57,255,20,0.25)',
        borderRadius: 100,
        padding: '4px 14px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 10,
        color: '#39FF14',
        letterSpacing: 2,
        marginBottom: 28,
      }}>
        ⚡ {monster.caffeine} cafeïne
        {drinkCount > 0 && (
          <span style={{ color: '#555', marginLeft: 4 }}>· {drinkCount}× gedronken</span>
        )}
      </div>

      {/* Star rating */}
      <div style={{ width: '100%', marginBottom: 20 }}>
        <label style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 9,
          color: '#555',
          letterSpacing: 3,
          display: 'block',
          marginBottom: 10,
        }}>
          JOUW RATING (0–10)
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Note */}
      <div style={{ width: '100%', marginBottom: 24 }}>
        <label style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 9,
          color: '#555',
          letterSpacing: 3,
          display: 'block',
          marginBottom: 8,
        }}>
          NOTITIES (optioneel)
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Wat vond je ervan?"
          rows={3}
          style={{
            width: '100%',
            background: '#0f0f0f',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            color: '#aaa',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            padding: '10px 14px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(57,255,20,0.4)')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Log button */}
      <button
        className="log-btn"
        onClick={handleLog}
        disabled={saving || rating === 0}
        style={{ opacity: saving || rating === 0 ? 0.5 : 1 }}
      >
        {saving ? 'OPSLAAN…' : '⚡ LOG DEZE MONSTER'}
      </button>
    </div>
  );
}
