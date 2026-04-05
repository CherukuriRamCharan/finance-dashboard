import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSACTIONS } from '../data/transactions';

const AppContext = createContext();

const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => load('fd_transactions', TRANSACTIONS));
  const [role,         setRoleState]    = useState(() => load('fd_role', 'viewer'));
  const [theme,        setThemeState]   = useState(() => load('fd_theme', 'light'));
  const [accent,       setAccentState]  = useState(() => load('fd_accent', 'indigo'));
  const [filters,      setFilters]      = useState(() => load('fd_filters', { search: '', type: 'all', category: 'all', sort: 'date-desc', chips: [] }));
  const [newTxId,      setNewTxId]      = useState(null);

  const persist = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const setRole  = v => { setRoleState(v);  persist('fd_role', v); };
  const setTheme = v => { setThemeState(v); persist('fd_theme', v); };
  const setAccent= v => { setAccentState(v);persist('fd_accent', v); };

  useEffect(() => { persist('fd_transactions', transactions); }, [transactions]);
  useEffect(() => { persist('fd_filters', filters); }, [filters]);

  function addTransaction(tx) {
    const id = Date.now();
    setTransactions(prev => [{ ...tx, id }, ...prev]);
    setNewTxId(id);
    setTimeout(() => setNewTxId(null), 1500);
  }

  function editTransaction(updated) {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  return (
    <AppContext.Provider value={{ transactions, role, setRole, theme, setTheme, accent, setAccent, filters, setFilters, addTransaction, editTransaction, newTxId }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
