import { useCallback, useState } from 'react';
import type { Monster } from './data/monsters';
import { useStore } from './store/useStore';
import ClosedFridge  from './components/ClosedFridge';
import OpenFridge    from './components/OpenFridge';
import DetailScreen  from './components/DetailScreen';
import Toast         from './components/Toast';
import './index.css';

type Screen = 'closed' | 'open' | 'detail';

export default function App() {
  const fridgeOpen = useStore(s => s.fridgeOpen);

  const [screen,          setScreen]          = useState<Screen>('closed');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [toast,           setToast]           = useState<string | null>(null);

  const handleCanClick = useCallback((m: Monster) => {
    setSelectedMonster(m);
    setScreen('detail');
  }, []);

  const handleBack = useCallback(() => {
    setScreen('open');
    setSelectedMonster(null);
  }, []);

  const effectiveScreen: Screen = !fridgeOpen ? 'closed' : screen === 'closed' ? 'open' : screen;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      {effectiveScreen === 'closed' && <ClosedFridge />}

      {effectiveScreen === 'open' && (
        <OpenFridge onCanClick={handleCanClick} />
      )}

      {effectiveScreen === 'detail' && selectedMonster && (
        <DetailScreen
          monster={selectedMonster}
          onBack={handleBack}
          onToast={(msg) => setToast(msg)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
