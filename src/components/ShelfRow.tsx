import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Monster } from '../data/monsters';
import { useStore } from '../store/useStore';
import CanSVG from './CanSVG';

type CanItemProps = {
  monster: Monster;
  shelfId: string;
  drinkCount: number;
  onClick: () => void;
};

function SortableCan({ monster, shelfId, drinkCount, onClick }: CanItemProps) {
  const sortableId = `${shelfId}::${monster.id}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 'auto' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="can" style={{ position: 'relative' }} onClick={onClick}>
        <div
          {...listeners}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: -6, left: '50%',
            transform: 'translateX(-50%)', cursor: 'grab',
            color: '#444', fontSize: 10, opacity: 0,
            transition: 'opacity 0.15s', padding: '2px 4px', zIndex: 10,
          }}
          className="drag-handle"
        >
          ⠿
        </div>

        {drinkCount > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: '#39FF14', color: '#000',
            fontFamily: 'Orbitron, sans-serif', fontSize: 8, fontWeight: 700,
            width: 16, height: 16, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 8px rgba(57,255,20,0.6)', zIndex: 10,
          }}>
            {drinkCount > 9 ? '9+' : drinkCount}
          </div>
        )}

        <CanSVG monster={monster} width={46} height={63} />

        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 6, color: '#555',
          marginTop: 4, textAlign: 'center', maxWidth: 46,
          lineHeight: 1.2, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {monster.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

type ShelfRowProps = {
  shelfId: string;
  label: string;
  monsters: Monster[];
  onCanClick: (m: Monster) => void;
};

export default function ShelfRow({ shelfId, label, monsters, onCanClick }: ShelfRowProps) {
  const log = useStore(s => s.log);
  const sortableIds = monsters.map(m => `${shelfId}::${m.id}`);

  function drinkCount(monsterId: string) {
    return log.filter(e => e.monsterId === monsterId).length;
  }

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: 8,
        color: 'rgba(57,255,20,0.5)', letterSpacing: 4,
        padding: '8px 12px 4px', textTransform: 'uppercase',
      }}>
        {label}
      </div>

      <div style={{
        background: 'linear-gradient(180deg, #0f1f0f 0%, #0a140a 100%)',
        borderTop: '1px solid rgba(57,255,20,0.15)',
        borderBottom: '2px solid #0a0a0a',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4), 0 3px 12px rgba(0,0,0,0.5)',
        padding: '10px 12px 6px',
        overflowX: 'auto', overflowY: 'visible',
      }}>
        <SortableContext items={sortableIds} strategy={horizontalListSortingStrategy}>
          <div
            style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement)
                .querySelectorAll<HTMLElement>('.drag-handle')
                .forEach(el => (el.style.opacity = '1'));
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement)
                .querySelectorAll<HTMLElement>('.drag-handle')
                .forEach(el => (el.style.opacity = '0'));
            }}
          >
            {monsters.map(m => (
              <SortableCan
                key={m.id}
                monster={m}
                shelfId={shelfId}
                drinkCount={drinkCount(m.id)}
                onClick={() => onCanClick(m)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
