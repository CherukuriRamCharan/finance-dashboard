import { useApp } from '../context/AppContext';
import { TrendingDown, BarChart2, Lightbulb, Trophy, Flame } from 'lucide-react';

export default function Insights({ dark, accent, card, text, sub }) {
  const { transactions } = useApp();

  const catMap = {};
  transactions.filter(t => t.type === 'expense').forEach(({ category, amount }) => {
    catMap[category] = (catMap[category] || 0) + amount;
  });
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const topCat = sorted[0];
  const total  = sorted.reduce((s, [,v]) => s + v, 0);

  const monthlyExp = {};
  transactions.filter(t => t.type === 'expense').forEach(({ date, amount }) => {
    const m = date.slice(0, 7);
    monthlyExp[m] = (monthlyExp[m] || 0) + amount;
  });
  const months  = Object.keys(monthlyExp).sort();
  const lastTwo = months.slice(-2);
  const diff    = lastTwo.length === 2
    ? ((monthlyExp[lastTwo[1]] - monthlyExp[lastTwo[0]]) / monthlyExp[lastTwo[0]] * 100).toFixed(1)
    : null;

  const income      = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses    = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;

  // Savings suggestion
  const entAmt = catMap['Entertainment'] || 0;
  const suggestion = entAmt > 0
    ? `Cutting 10% from Entertainment could save $${(entAmt * 0.1).toFixed(0)}/month`
    : null;

  // Streak: consecutive months with positive balance
  const monthlyBal = {};
  transactions.forEach(({ date, type, amount }) => {
    const m = date.slice(0, 7);
    monthlyBal[m] = (monthlyBal[m] || 0) + (type === 'income' ? amount : -amount);
  });
  const streak = Object.values(monthlyBal).filter(v => v > 0).length;

  const dimBg = dark ? 'bg-gray-700/60' : 'bg-gray-50';

  return (
    <div className={`${card} backdrop-blur-sm rounded-2xl border p-4 sm:p-5`}>
      <h3 className={`text-sm font-semibold ${sub} mb-4`}>Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* Category spotlight */}
        <div className="sm:col-span-2 lg:col-span-1 rounded-xl p-4" style={{background: `${accent}15`, border: `1px solid ${accent}30`}}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} style={{color: accent}}/>
            <p className={`text-xs font-semibold ${sub}`}>Top Spending Category</p>
          </div>
          <p className="text-xl font-bold mb-2" style={{color: accent}}>{topCat?.[0] ?? '—'}</p>
          <p className={`text-xs ${sub} mb-2`}>${topCat?.[1].toFixed(2)} total</p>
          {/* Mini bar breakdown */}
          <div className="flex flex-col gap-1">
            {sorted.slice(0, 4).map(([name, val], i) => (
              <div key={name} className="flex items-center gap-2">
                <span className={`text-xs w-20 truncate ${sub}`}>{name}</span>
                <div className={`flex-1 h-1.5 rounded-full ${dark?'bg-gray-600':'bg-gray-200'}`}>
                  <div className="h-1.5 rounded-full transition-all duration-700" style={{width:`${(val/total)*100}%`, background: accent, opacity: 1 - i*0.2}}/>
                </div>
                <span className={`text-xs ${sub}`}>{((val/total)*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Month-over-month */}
        <div className={`${dimBg} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} style={{color: diff >= 0 ? '#f97316' : '#22c55e'}}/>
            <p className={`text-xs font-semibold ${sub}`}>Month-over-Month</p>
          </div>
          <p className="text-2xl font-bold" style={{color: diff >= 0 ? '#f97316' : '#22c55e'}}>
            {diff !== null ? `${diff > 0 ? '+' : ''}${diff}%` : '—'}
          </p>
          <p className={`text-xs ${sub} mt-1`}>{lastTwo.length===2 ? `${lastTwo[0]} → ${lastTwo[1]}` : 'Not enough data'}</p>
          {diff !== null && (
            <p className={`text-xs mt-2 ${sub}`}>
              {diff > 0 ? '⚠️ Spending increased' : '✅ Spending decreased'} vs last month
            </p>
          )}
        </div>

        {/* Savings + streak */}
        <div className={`${dimBg} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} style={{color: '#f59e0b'}}/>
            <p className={`text-xs font-semibold ${sub}`}>Savings Rate</p>
          </div>
          <p className="text-2xl font-bold" style={{color: '#f59e0b'}}>{savingsRate}%</p>
          <div className={`h-1.5 rounded-full mt-2 mb-3 ${dark?'bg-gray-600':'bg-gray-200'}`}>
            <div className="h-1.5 rounded-full transition-all duration-700" style={{width:`${Math.min(savingsRate,100)}%`, background:'#f59e0b'}}/>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-400"/>
            <span className={`text-xs font-semibold ${sub}`}>{streak} month{streak!==1?'s':''} positive balance</span>
            {streak >= 2 && <Trophy size={13} className="text-yellow-500"/>}
          </div>
          {suggestion && <p className={`text-xs mt-2 italic ${sub}`}>{suggestion}</p>}
        </div>
      </div>
    </div>
  );
}
