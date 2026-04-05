import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const diff  = value - start;
    const steps = 40;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplay(start + diff * (i / steps));
      if (i >= steps) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <>${Math.abs(display).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>;
}

export default function SummaryCards({ dark, accent, card, text, sub }) {
  const { transactions } = useApp();
  const [hovered, setHovered] = useState(null);

  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const savingsPct = income > 0 ? Math.min((balance / income) * 100, 100) : 0;

  const cards = [
    { label: 'Total Balance',  value: balance,  icon: Wallet,       color: accent,     bgLight: '#eff6ff', bgDark: '#1e3a5f', goal: savingsPct, goalLabel: 'savings rate' },
    { label: 'Total Income',   value: income,   icon: TrendingUp,   color: '#22c55e',  bgLight: '#f0fdf4', bgDark: '#14532d', goal: null },
    { label: 'Total Expenses', value: expenses, icon: TrendingDown, color: '#ef4444',  bgLight: '#fff1f2', bgDark: '#4c0519', goal: null },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bgLight, bgDark, goal, goalLabel }) => (
        <div key={label}
          className={`${card} backdrop-blur-sm rounded-2xl border p-4 sm:p-5 cursor-default transition-all duration-200`}
          style={{ boxShadow: hovered === label ? `0 8px 30px ${color}30` : '0 1px 3px rgba(0,0,0,0.06)', transform: hovered === label ? 'translateY(-3px)' : 'none' }}
          onMouseEnter={() => setHovered(label)}
          onMouseLeave={() => setHovered(null)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl transition-transform duration-200" style={{ background: dark ? bgDark : bgLight, transform: hovered === label ? 'rotate(8deg) scale(1.1)' : 'none' }}>
              <Icon size={20} style={{ color }}/>
            </div>
            <p className={`text-xs font-medium ${sub}`}>{label}</p>
          </div>
          <p className="text-2xl font-bold" style={{ color }}>
            <AnimatedNumber value={value} />
          </p>
          {goal !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1" style={{ color }}>
                <span>{goalLabel}</span><span>{goal.toFixed(1)}%</span>
              </div>
              <div className={`h-1.5 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${goal}%`, background: color }}/>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
