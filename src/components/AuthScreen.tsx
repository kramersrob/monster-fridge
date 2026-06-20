import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleLogin() {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: 'https://monster-fridge.vercel.app' },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  const inputStyle = {
    width: '100%',
    background: '#0f0f0f',
    border: '1.5px solid #2a2a2a',
    borderRadius: 10,
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    padding: '14px 18px',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as const;

  if (sent) {
    return (
      <div style={centeredPage}>
        <MonsterLogo />
        <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#39FF14', letterSpacing: 2, margin: '0 0 12px' }}>
          CHECK JE EMAIL
        </h2>
        <p style={{ fontFamily: 'Orbitron', fontSize: 10, color: '#555', letterSpacing: 3, lineHeight: 2 }}>
          WE HEBBEN EEN INLOGLINK GESTUURD NAAR<br />
          <span style={{ color: '#39FF14' }}>{email}</span>
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#333', marginTop: 20 }}>
          Klik de link in je email om in te loggen.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(''); }}
          style={{ marginTop: 28, background: 'none', border: '1px solid #222', color: '#444', fontFamily: 'Orbitron', fontSize: 9, letterSpacing: 2, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
        >
          ANDERE EMAIL PROBEREN
        </button>
      </div>
    );
  }

  return (
    <div style={centeredPage}>
      <MonsterLogo />

      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#333', letterSpacing: 6, marginBottom: 40 }}>
        UNLEASH THE BEAST
      </h1>

      <div style={{ width: '100%', maxWidth: 340 }}>
        <label style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#555', letterSpacing: 3, display: 'block', marginBottom: 10 }}>
          EMAIL ADRES
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="jouw@email.nl"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(57,255,20,0.5)')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          autoComplete="email"
        />

        {error && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#ff4444', marginTop: 8 }}>
            {error}
          </p>
        )}

        <button
          className="log-btn"
          onClick={handleLogin}
          disabled={loading || !email.trim()}
          style={{ marginTop: 16, opacity: loading || !email.trim() ? 0.5 : 1 }}
        >
          {loading ? 'BEZIG…' : '⚡ STUUR INLOGLINK'}
        </button>

        <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#2a2a2a', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          Geen wachtwoord nodig. Je ontvangt een magische inloglink per email.
        </p>
      </div>
    </div>
  );
}

function MonsterLogo() {
  return (
    <div style={{ marginBottom: 16, textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Bebas Neue',
        lineHeight: 1,
        color: '#39FF14',
        textShadow: '0 0 20px rgba(57,255,20,0.8), 0 0 60px rgba(57,255,20,0.3)',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 80 }}>M</span>
        <span style={{ fontSize: 36, marginLeft: -2 }}>ONSTER</span>
      </div>
      <div style={{ fontFamily: 'Orbitron', fontSize: 7, color: 'rgba(57,255,20,0.4)', letterSpacing: 8, marginTop: 2 }}>
        FRIDGE
      </div>
    </div>
  );
}

const centeredPage = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #050505 70%)',
  padding: '40px 24px',
};
