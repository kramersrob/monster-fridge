import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { MONSTER_MAP } from '../data/monsters';
import type { Monster } from '../data/monsters';
import { useStore } from '../store/useStore';
import ShelfRow  from './ShelfRow';
import LogView   from './LogView';
import StatsView from './StatsView';

type Tab = 'fridge' | 'log' | 'stats';
type Particle = { id: number; x: number };

type Props = {
  onCanClick: (m: Monster) => void;
};

export default function OpenFridge({ onCanClick }: Props) {
  const [tab, setTab] = useState<Tab>('fridge');
  const { shelves, canOrder, setCanOrder, closeFridge } = useStore();
  const [particles,  setParticles]  = useState<Particle[]>([]);
  const [isClosing,  setIsClosing]  = useState(false);
  const nextId = useRef(0);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => closeFridge(), 440);
  }, [closeFridge]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      setParticles(p => [...p, { id, x: Math.random() * 90 + 5 }]);
      setTimeout(() => setParticles(p => p.filter(par => par.id !== id)), 3600);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeShelf, activeMonsterId] = String(active.id).split('::');
    const [overShelf,   overMonsterId]   = String(over.id).split('::');

    if (activeShelf === overShelf) {
      const current = canOrder[activeShelf] ?? [];
      const oldIdx  = current.indexOf(activeMonsterId);
      const newIdx  = current.indexOf(overMonsterId);
      if (oldIdx !== -1 && newIdx !== -1) {
        setCanOrder(activeShelf, arrayMove(current, oldIdx, newIdx));
      }
    } else {
      const srcList = [...(canOrder[activeShelf] ?? [])];
      const dstList = [...(canOrder[overShelf]   ?? [])];
      srcList.splice(srcList.indexOf(activeMonsterId), 1);
      const dstIdx = dstList.indexOf(overMonsterId);
      dstList.splice(dstIdx >= 0 ? dstIdx : dstList.length, 0, activeMonsterId);
      setCanOrder(activeShelf, srcList);
      setCanOrder(overShelf,   dstList);
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 9,
    letterSpacing: 2,
    padding: '10px 18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? '#39FF14' : '#444',
    borderBottom: active ? '2px solid #39FF14' : '2px solid transparent',
    transition: 'color 0.2s',
  });

  return (
    <div className={isClosing ? 'fridge-closing' : undefined} style={{ width: '100%', minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        background: '#080808',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 15,
          color: '#39FF14', letterSpacing: 2, marginRight: 8,
          textShadow: '0 0 10px rgba(57,255,20,0.5)', flexShrink: 0,
        }}>
          M
        </div>
        <button style={tabStyle(tab === 'fridge')} onClick={() => setTab('fridge')}>KOELKAST</button>
        <button style={tabStyle(tab === 'log')}    onClick={() => setTab('log')}>MIJN LOG</button>
        <button style={tabStyle(tab === 'stats')}  onClick={() => setTab('stats')}>STATS</button>

        {/* Sluit knop rechts */}
        <button
          onClick={handleClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: '1px solid #2a2a2a',
            color: '#555',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 8,
            letterSpacing: 2,
            padding: '6px 10px',
            borderRadius: 5,
            cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget.style.color = '#39FF14'); (e.currentTarget.style.borderColor = '#39FF14'); }}
          onMouseLeave={e => { (e.currentTarget.style.color = '#555'); (e.currentTarget.style.borderColor = '#2a2a2a'); }}
        >
          ✕ SLUIT
        </button>
      </div>

      {tab === 'log'   && <LogView />}
      {tab === 'stats' && <StatsView />}

      {tab === 'fridge' && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(180deg, #071007 0%, #050805 100%)',
          boxShadow: 'inset 0 0 60px rgba(57,255,20,0.04)',
          position: 'relative',
          overflowY: 'auto',
          paddingBottom: 60,
        }}>
          <div style={{ height: 3, background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.3), transparent)', margin: '0 0 2px' }} />

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {shelves.map(shelf => {
              const ids = canOrder[shelf.id] ?? shelf.ids;
              const monsters = ids.map(id => MONSTER_MAP.get(id)).filter((m): m is Monster => !!m);
              return (
                <ShelfRow
                  key={shelf.id}
                  shelfId={shelf.id}
                  label={shelf.label}
                  monsters={monsters}
                  onCanClick={onCanClick}
                />
              );
            })}
          </DndContext>

          <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, height: 40, pointerEvents: 'none', overflow: 'hidden' }}>
            {particles.map(p => (
              <div key={p.id} className="mist-particle" style={{
                position: 'absolute', bottom: 0, left: `${p.x}%`,
                width: 36, height: 24, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(180,220,255,0.18) 0%, transparent 70%)',
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
