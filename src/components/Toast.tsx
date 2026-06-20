import { useEffect, useState } from 'react';

type Props = {
  message: string;
  onDone: () => void;
};

export default function Toast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount → slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // after 2.2s → slide out
    const t2 = setTimeout(() => setVisible(false), 2200);
    // after slide-out animation → cleanup
    const t3 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '80px'})`,
        transition: 'transform 0.3s ease',
        background: '#39FF14',
        color: '#000',
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 18,
        letterSpacing: 2,
        padding: '12px 28px',
        borderRadius: 8,
        boxShadow: '0 0 30px rgba(57,255,20,0.6)',
        zIndex: 1000,
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}
