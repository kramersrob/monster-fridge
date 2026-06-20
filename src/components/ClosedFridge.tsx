import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

type Particle = { id: number; x: number; key: number };

export default function ClosedFridge() {
  const openFridge = useStore(s => s.openFridge);
  const [opening, setOpening] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  // Spawn mist particles
  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      setParticles(p => [...p, { id, x: Math.random() * 220 + 20, key: id }]);
      setTimeout(() => setParticles(p => p.filter(par => par.id !== id)), 3600);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function handleClick() {
    if (opening) return;
    setOpening(true);
    setTimeout(() => openFridge(), 580);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #050505 70%)',
        padding: 24,
      }}
    >
      {/* Quote above */}
      <p style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 16,
        color: 'rgba(57,255,20,0.5)',
        letterSpacing: 3,
        marginBottom: 32,
        textAlign: 'center',
      }}>
        A MONSTER A DAY KEEPS THE DOCTOR AWAY
      </p>

      {/* Fridge body */}
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: 260,
          height: 420,
          background: 'linear-gradient(160deg, #252525 0%, #1a1a1a 50%, #111 100%)',
          borderRadius: 22,
          cursor: 'pointer',
          boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(57,255,20,0.04)',
          border: '1.5px solid #333',
          overflow: 'hidden',
          animation: opening ? 'doorOpen 0.55s ease-in-out forwards' : 'none',
          transformOrigin: 'left center',
        }}
      >
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(57,255,20,0.06) 0%, transparent 70%)',
          borderRadius: 22,
          pointerEvents: 'none',
        }} />

        {/* Door handle */}
        <div style={{
          position: 'absolute',
          right: 16, top: '50%',
          transform: 'translateY(-50%)',
          width: 8, height: 80,
          background: 'linear-gradient(to right, #444, #777, #444)',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }} />

        {/* Top half: Monster logo */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '58%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #2a2a2a',
          background: 'linear-gradient(180deg, rgba(57,255,20,0.03) 0%, transparent 100%)',
        }}>
          {/* Monster M logo */}
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 88,
            lineHeight: 1,
            color: '#39FF14',
            textShadow: '0 0 20px rgba(57,255,20,0.8), 0 0 50px rgba(57,255,20,0.35), 0 0 80px rgba(57,255,20,0.15)',
            display: 'flex',
            alignItems: 'baseline',
          }}>
            <span style={{ fontSize: 88 }}>M</span>
            <span style={{ fontSize: 40, marginLeft: -2 }}>ONSTER</span>
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 7,
            color: 'rgba(57,255,20,0.5)',
            letterSpacing: 6,
            marginTop: 4,
          }}>
            ENERGY DRINK
          </div>

          {/* Mist particles */}
          {particles.map(p => (
            <div
              key={p.key}
              className="mist-particle"
              style={{
                position: 'absolute',
                bottom: 0,
                left: p.x,
                width: 28 + Math.random() * 18,
                height: 28 + Math.random() * 18,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(180,220,255,0.28) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>

        {/* Bottom half */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '42%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          {/* Temperature display */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 13,
            color: 'rgba(57,255,20,0.7)',
            letterSpacing: 2,
          }}>
            2°C
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 11,
            color: '#555',
            letterSpacing: 4,
          }}>
            MONSTER FRIDGE
          </div>

          {/* Tap hint */}
          <div style={{
            marginTop: 16,
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 8,
            color: '#444',
            letterSpacing: 3,
            animation: 'none',
          }}>
            TAP TO OPEN
          </div>
        </div>

        {/* Bottom mist */}
        {particles.slice(0, 3).map((p, i) => (
          <div
            key={`bot-${p.key}`}
            className="mist-particle"
            style={{
              position: 'absolute',
              bottom: 8,
              left: 30 + i * 70,
              width: 40,
              height: 24,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(180,220,255,0.2) 0%, transparent 70%)',
              animationDelay: `${i * 0.3}s`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      {/* Click hint */}
      <p style={{
        marginTop: 24,
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 9,
        color: '#333',
        letterSpacing: 4,
      }}>
        CLICK THE FRIDGE TO OPEN
      </p>
    </div>
  );
}
