import { useApp } from '../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function SpendingAlert({ dark, accent }) {
  const { transactions } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const months = {};
  transactions.filter(t => t.type === 'expense').forEach(({ date, category, amount }) => {
    const m = date.slice(0, 7);
    if (!months[m]) months[m] = {};
    months[m][category] = (months[m][category] || 0) + amount;
  });
  const sorted = Object.keys(months).sort();
  if (sorted.length < 2 || dismissed) return null;

  const [prev, curr] = sorted.slice(-2).map(m => months[m]);
  const alerts = [];
  Object.keys(curr || {}).forEach(cat => {
    if (prev?.[cat] && curr[cat] > prev[cat] * 1.2) {
      const pct = (((curr[cat] - prev[cat]) / prev[cat]) * 100).toFixed(0);
      alerts.push({ cat, pct });
    }
  });
  if (!alerts.length) return null;

  const { cat, pct } = alerts[0];
  return (
    <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border transition-all duration-300 ${dark ? 'bg-amber-900/30 border-amber-700/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500"/>
      <p className="flex-1 text-xs">You spent <strong>{pct}% more</strong> on <strong>{cat}</strong> this month compared to last month.</p>
      <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600 transition shrink-0"><X size={14}/></button>
    </div>
  );
}
