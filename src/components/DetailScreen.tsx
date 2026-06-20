import { useState } from 'react';
import type { Monster } from '../data/monsters';
import { useStore } from '../store/useStore';
import type { LogEntry } from '../store/useStore';
import CanSVG from './CanSVG';
import StarRating from './StarRating';

type Props = {
  monster: Monster;
  onBack: () => void;
  onToast: (msg: string) => void;
};

export default function DetailScreen({ monster, onBack, onToast }: Props) {
  const addLog = useStore(s => s.addLog);
  const log    = useStore(s => s.log);

  const [rating,   setRating]   = useState(0);
  const [note,     setNote]     = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saving,   setSaving]   = useState(false);

  const drinkCount = log.filter(e => e.monsterId === monster.id)
                        .reduce((s, e) => s + (e.quantity ?? 1), 0);

  function handleLog() {
    if (rating === 0) { onToast('Geef eerst een rating!'); return; }
    setSaving(true);
    const entry: LogEntry = {
      id:        crypto.randomUUID(),
      monsterId: monster.id,
      name:      monster.name,
      flavor:    monster.flavor,
      cat:       monster.cat,
      ratingVal: rating,
      quantity,
      note:      note.trim(),
      date:      new Date().toISOString(),
      c1:        monster.c1,
      c2:        monster.c2,
      lbl:       monster.lbl,
      str:       monster.str,
    };
    addLog(entry);
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

      <div style={{ marginBottom: 20 }}>
        <CanSVG monster={monster} width={100} height={138} />
      </div>

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

      {/* Aantal blikjes */}
      <div style={{ width: '100%', marginBottom: 20 }}>
        <label style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 9,
          color: '#555', letterSpacing: 3, display: 'block', marginBottom: 10,
        }}>
          AANTAL BLIKJES
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setQuantity(n)}
              style={{
                width: 40, height: 40,
                background: quantity === n ? 'rgba(57,255,20,0.15)' : '#0f0f0f',
                border: `1.5px solid ${quantity === n ? '#39FF14' : '#2a2a2a'}`,
                borderRadius: 8,
                color: quantity === n ? '#39FF14' : '#555',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

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
