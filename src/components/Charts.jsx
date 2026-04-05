import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#14b8a6','#8b5cf6','#f97316','#ec4899'];

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`${dark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-100 text-gray-700'} border rounded-xl shadow-lg px-3 py-2 text-xs`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{color: p.color}}>{p.name}: ${Number(p.value).toLocaleString()}</p>)}
    </div>
  );
};

export default function Charts({ dark, accent, card, text, sub }) {
  const { transactions } = useApp();
  const [activeSlice, setActiveSlice] = useState(null);
  const [tab, setTab] = useState('line');

  const monthlyMap = {};
  transactions.forEach(({ date, type, amount }) => {
    const m = date.slice(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { income: 0, expenses: 0 };
    monthlyMap[m][type === 'income' ? 'income' : 'expenses'] += amount;
  });
  const trendData = Object.entries(monthlyMap).sort(([a],[b]) => a.localeCompare(b)).map(([m, d]) => ({
    month: new Date(m+'-01').toLocaleString('default', { month: 'short', year:'2-digit' }),
    Income: +d.income.toFixed(2), Expenses: +d.expenses.toFixed(2),
    Balance: +(d.income - d.expenses).toFixed(2),
  }));

  const catMap = {};
  transactions.filter(t => t.type === 'expense').forEach(({ category, amount }) => {
    catMap[category] = (catMap[category] || 0) + amount;
  });
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  const total   = pieData.reduce((s, d) => s + d.value, 0);

  const axisStyle = { fontSize: 11, fill: dark ? '#9ca3af' : '#6b7280' };
  const gridColor = dark ? '#374151' : '#f3f4f6';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Line / Bar chart with tab toggle */}
      <div className={`${card} backdrop-blur-sm rounded-2xl border p-4 sm:p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-semibold ${sub}`}>Monthly Overview</h3>
          <div className={`flex text-xs rounded-lg overflow-hidden border ${dark?'border-gray-600':'border-gray-200'}`}>
            {['line','bar'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1 capitalize transition-colors duration-200"
                style={{ background: tab===t ? accent : 'transparent', color: tab===t ? 'white' : dark?'#9ca3af':'#6b7280' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          {tab === 'line' ? (
            <LineChart data={trendData} margin={{top:5,right:10,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
              <XAxis dataKey="month" tick={axisStyle}/>
              <YAxis tick={axisStyle} width={52} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/>
              <Tooltip content={<CustomTooltip dark={dark}/>}/>
              <Line type="monotone" dataKey="Income"   stroke="#22c55e" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
              <Line type="monotone" dataKey="Balance"  stroke={accent}  strokeWidth={2.5} dot={{r:4,fill:accent}} activeDot={{r:6}}/>
            </LineChart>
          ) : (
            <BarChart data={trendData} margin={{top:5,right:10,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
              <XAxis dataKey="month" tick={axisStyle}/>
              <YAxis tick={axisStyle} width={52} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/>
              <Tooltip content={<CustomTooltip dark={dark}/>}/>
              <Bar dataKey="Income"   fill="#22c55e" radius={[4,4,0,0]}/>
              <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]}/>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Pie chart with drill-down */}
      <div className={`${card} backdrop-blur-sm rounded-2xl border p-4 sm:p-5`}>
        <h3 className={`text-sm font-semibold ${sub} mb-1`}>Spending by Category</h3>
        {activeSlice && (
          <p className="text-xs mb-2 font-medium" style={{color: COLORS[pieData.findIndex(d=>d.name===activeSlice.name) % COLORS.length]}}>
            {activeSlice.name}: ${activeSlice.value.toLocaleString()} ({((activeSlice.value/total)*100).toFixed(1)}% of total)
          </p>
        )}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
              innerRadius={45} outerRadius={80}
              onMouseEnter={(d) => setActiveSlice(d)}
              onMouseLeave={() => setActiveSlice(null)}
              paddingAngle={2}>
              {pieData.map((d, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]}
                  opacity={activeSlice && activeSlice.name !== d.name ? 0.4 : 1}
                  style={{cursor:'pointer', transition:'opacity 0.2s'}}/>
              ))}
            </Pie>
            <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Spent']}
              contentStyle={{ background: dark?'#1f2937':'white', border: dark?'1px solid #374151':'1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }}/>
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {pieData.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1 text-xs" style={{color: dark?'#9ca3af':'#6b7280'}}>
              <span className="w-2 h-2 rounded-full inline-block" style={{background: COLORS[i%COLORS.length]}}/>
              {d.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
