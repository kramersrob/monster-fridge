import { useCallback, useEffect, useState } from 'react';
import type { Monster } from './data/monsters';
import { useAuth }          from './hooks/useAuth';
import { useLog }           from './hooks/useLog';
import { supabase }         from './lib/supabase';
import type { Profile }     from './lib/supabase';
import { AuthScreen }       from './components/AuthScreen';
import { SetupProfile }     from './components/SetupProfile';
import ClosedFridge         from './components/ClosedFridge';
import OpenFridge           from './components/OpenFridge';
import DetailScreen         from './components/DetailScreen';
import Toast                from './components/Toast';
import { useStore }         from './store/useStore';
import './index.css';

type Screen = 'closed' | 'open' | 'detail';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#050505',
    }}>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 22,
        color: '#39FF14',
        letterSpacing: 4,
        textShadow: '0 0 20px rgba(57,255,20,0.5)',
        animation: 'none',
      }}>
        LADEN…
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const fridgeOpen = useStore(s => s.fridgeOpen);

  const [screen,          setScreen]          = useState<Screen>('closed');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [toast,           setToast]           = useState<string | null>(null);
  const [profile,         setProfile]         = useState<Profile | null | undefined>(undefined); // undefined = not checked yet
  const [profiles,        setProfiles]        = useState<Profile[]>([]);

  const { log, addLog, deleteLog } = useLog(user?.id ?? null);

  // Check if the current user has a profile
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }: { data: unknown }) => setProfile(data as Profile | null));
  }, [user]);

  // Fetch all profiles for CompareView
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').then(({ data }: { data: unknown }) => {
      if (data) setProfiles(data as Profile[]);
    });
  }, [user, profile]); // re-fetch when our own profile changes (just set up)

  const handleCanClick = useCallback((m: Monster) => {
    setSelectedMonster(m);
    setScreen('detail');
  }, []);

  const handleBack = useCallback(() => {
    setScreen('open');
    setSelectedMonster(null);
  }, []);

  const handleToast = useCallback((msg: string) => setToast(msg), []);

  const handleProfileDone = useCallback(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }: { data: unknown }) => setProfile(data as Profile));
  }, [user]);

  // ── Auth gates ────────────────────────────────────────────────────────────

  if (authLoading || profile === undefined) return <LoadingScreen />;
  if (!user)    return <AuthScreen />;
  if (!profile) return <SetupProfile userId={user.id} onDone={handleProfileDone} />;

  // ── Main app ──────────────────────────────────────────────────────────────

  const effectiveScreen: Screen = !fridgeOpen ? 'closed' : screen === 'closed' ? 'open' : screen;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      {effectiveScreen === 'closed' && (
        <ClosedFridge />
      )}

      {effectiveScreen === 'open' && (
        <OpenFridge
          log={log}
          userId={user.id}
          profiles={profiles}
          onCanClick={handleCanClick}
          onDeleteLog={deleteLog}
          onSignOut={signOut}
        />
      )}

      {effectiveScreen === 'detail' && selectedMonster && (
        <DetailScreen
          monster={selectedMonster}
          log={log}
          userId={user.id}
          onBack={handleBack}
          onToast={handleToast}
          addLog={addLog}
        />
      )}

      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
