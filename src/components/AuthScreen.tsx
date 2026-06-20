import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Mode = 'login' | 'register';

export function AuthScreen() {
  const [mode,     setMode]     = useState<Mode>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  async function handleSubmit() {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) setError(error.message);
      else setSuccess('Account aangemaakt! Je kunt nu inloggen.');
    }

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
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={centeredPage}>
      <MonsterLogo />

      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#333', letterSpacing: 6, marginBottom: 32 }}>
        UNLEASH THE BEAST
      </h1>

      {/* Mode toggle */}
      <div style={{ display: 'flex', marginBottom: 28, border: '1px solid #1f1f1f', borderRadius: 8, overflow: 'hidden' }}>
        {(['login', 'register'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '9px 20px',
              background: mode === m ? 'rgba(57,255,20,0.12)' : 'transparent',
              border: 'none',
              color: mode === m ? '#39FF14' : '#444',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 9,
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {m === 'login' ? 'INLOGGEN' : 'REGISTREREN'}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#555', letterSpacing: 3, display: 'block', marginBottom: 8 }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="jouw@email.nl"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(57,255,20,0.5)')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            autoComplete="email"
          />
        </div>

        <div>
          <label style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#555', letterSpacing: 3, display: 'block', marginBottom: 8 }}>
            WACHTWOORD
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(57,255,20,0.5)')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#ff4444', margin: 0 }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#39FF14', margin: 0 }}>
            {success}
          </p>
        )}

        <button
          className="log-btn"
          onClick={handleSubmit}
          disabled={loading || !email.trim() || !password}
          style={{ marginTop: 4, opacity: loading || !email.trim() || !password ? 0.5 : 1 }}
        >
          {loading ? 'BEZIG…' : mode === 'login' ? '⚡ INLOGGEN' : '⚡ ACCOUNT AANMAKEN'}
        </button>
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
