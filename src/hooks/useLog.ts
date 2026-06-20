import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { DbLogEntry, AddLogPayload } from '../lib/supabase';

export function useLog(userId: string | null) {
  const [log,     setLog]     = useState<DbLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('log_entries')
      .select('*')
      .order('logged_at', { ascending: false });

    if (!error && data) setLog(data as DbLogEntry[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLog([]);
      setLoading(false);
      return;
    }

    fetchLog();

    const channel = supabase
      .channel('log_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'log_entries' },
        () => fetchLog()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchLog]);

  const addLog = useCallback(async (payload: AddLogPayload) => {
    if (!userId) return;
    const { error } = await supabase.from('log_entries').insert({
      user_id: userId,
      ...payload,
    });
    if (!error) fetchLog();
  }, [userId, fetchLog]);

  const deleteLog = useCallback(async (id: string) => {
    const { error } = await supabase.from('log_entries').delete().eq('id', id);
    if (!error) setLog(prev => prev.filter(e => e.id !== id));
  }, []);

  return { log, loading, addLog, deleteLog };
}
