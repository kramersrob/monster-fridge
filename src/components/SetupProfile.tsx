import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Props = {
  userId: string;
  onDone: () => void;
};

export function SetupProfile({ userId, onDone }: Props) {
  const [username, setUsername] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  async function handleSave() {
    const name = username.trim();
    if (!name) return;
    setSaving(true);
    setError('');
    const { error } = await supabase.from('profiles').insert({ id: userId, username: name });
    if (error) {
      // If duplicate (user already has profile), just continue
      if (error.code === '23505') { onDone(); return; }
      setError(error.message);
      setSaving(false);
    } else {
      onDone();
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #050505 70%)',
      padding: '40px 24px',
    }}>
      <div style={{
        fontFamily: 'Bebas Neue',
        lineHeight: 1,
        color: '#39FF14',
        textShadow: '0 0 20px rgba(57,255,20,0.8)',
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: 32,
      }}>
        <span style={{ fontSize: 60 }}>M</span>
        <span style={{ fontSize: 28, marginLeft: -2 }}>ONSTER FRIDGE</span>
      </div>

      <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#fff', letterSpacing: 2, marginBottom: 8 }}>
          KIES JE NAAM
        </h2>
        <p style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#444', letterSpacing: 2, marginBottom: 28 }}>
          ZO ZIE JE JEZELF IN DE VERGELIJKINGSTAB
        </p>

        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="bijv. Rob of Broertje"
          maxLength={20}
          autoFocus
          style={{
            width: '100%',
            background: '#0f0f0f',
            border: '1.5px solid #2a2a2a',
            borderRadius: 10,
            color: '#fff',
            fontFamily: 'Bebas Neue',
            fontSize: 22,
            letterSpacing: 2,
            padding: '12px 18px',
            outline: 'none',
            textAlign: 'center',
            marginBottom: 16,
          }}
        />

        {error && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#ff4444', marginBottom: 12 }}>{error}</p>
        )}

        <button
          className="log-btn"
          onClick={handleSave}
          disabled={saving || !username.trim()}
          style={{ opacity: saving || !username.trim() ? 0.5 : 1 }}
        >
          {saving ? 'OPSLAAN…' : '⚡ LATEN WE GAAN'}
        </button>
      </div>
    </div>
  );
}
