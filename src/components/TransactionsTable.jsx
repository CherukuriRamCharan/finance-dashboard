import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';
import { Pencil, Search, Download, X } from 'lucide-react';
import TransactionModal from './TransactionModal';

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function TransactionsTable({ dark, accent, card, text, sub }) {
  const { transactions, role, filters, setFilters, newTxId } = useApp();
  const [editing, setEditing] = useState(null);
  const newRowRef = useRef(null);

  useEffect(() => {
    if (newTxId && newRowRef.current) {
      newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [newTxId]);

  const toggleChip = (cat) => {
    setFilters(f => ({
      ...f,
      chips: f.chips.includes(cat) ? f.chips.filter(c => c !== cat) : [...f.chips, cat]
    }));
  };

  const filtered = transactions
    .filter(t => {
      const q = filters.search.toLowerCase();
      if (q && !t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.chips?.length && !filters.chips.includes(t.category)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'date-desc')    return b.date.localeCompare(a.date);
      if (filters.sort === 'date-asc')     return a.date.localeCompare(b.date);
      if (filters.sort === 'amount-desc')  return b.amount - a.amount;
      if (filters.sort === 'amount-asc')   return a.amount - b.amount;
      return 0;
    });

  function exportCSV() {
    const rows = [['Date','Description','Category','Type','Amount'], ...filtered.map(t => [t.date, t.description, t.category, t.type, t.amount])];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'transactions.csv';
    a.click();
  }

  const inputCls = `border rounded-lg px-2 py-1.5 text-sm outline-none transition-colors ${dark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200 text-gray-600'}`;

  return (
    <div className={`${card} backdrop-blur-sm rounded-2xl border p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className={`text-sm font-semibold ${sub}`}>Transactions <span className={`text-xs font-normal ${sub}`}>({filtered.length})</span></h3>
        <button onClick={exportCSV} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition hover:scale-105 ${dark?'border-gray-600 text-gray-300':'border-gray-200 text-gray-500'}`}>
          <Download size={13}/> Export CSV
        </button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CATEGORIES.map(cat => {
          const active = filters.chips?.includes(cat);
          return (
            <button key={cat} onClick={() => toggleChip(cat)}
              className="text-xs px-2.5 py-1 rounded-full border transition-all duration-200 hover:scale-105"
              style={{
                background: active ? accent : 'transparent',
                color: active ? 'white' : dark ? '#9ca3af' : '#6b7280',
                borderColor: active ? accent : dark ? '#4b5563' : '#e5e7eb',
              }}>
              {cat}
            </button>
          );
        })}
        {filters.chips?.length > 0 && (
          <button onClick={() => setFilters(f => ({ ...f, chips: [] }))}
            className="text-xs px-2 py-1 rounded-full text-red-400 border border-red-200 hover:bg-red-50 transition flex items-center gap-1">
            <X size={10}/> Clear
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`flex items-center gap-1 ${inputCls} flex-1 min-w-[140px]`}>
          <Search size={13} className={sub}/>
          <input className={`outline-none w-full text-sm bg-transparent ${dark?'text-gray-200 placeholder-gray-500':'text-gray-700'}`}
            placeholder="Search..." value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}/>
        </div>
        <select className={inputCls} value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={inputCls} value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" fill={dark?'#1f2937':'#f1f5f9'}/>
            <path d="M20 44 L32 20 L44 44" stroke={dark?'#4b5563':'#cbd5e1'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="38" r="2" fill={dark?'#4b5563':'#cbd5e1'}/>
            <line x1="32" y1="28" x2="32" y2="34" stroke={dark?'#4b5563':'#cbd5e1'} strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className={`text-sm ${sub}`}>No transactions match your filters</p>
          <button onClick={() => setFilters(f => ({ ...f, search:'', type:'all', category:'all', chips:[] }))}
            className="text-xs px-3 py-1.5 rounded-lg text-white transition hover:opacity-90" style={{background: accent}}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className={`text-left text-xs border-b ${dark?'border-gray-700 text-gray-500':'border-gray-100 text-gray-400'}`}>
                <th className="pb-2 font-medium px-4 sm:px-0">Date</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium hidden sm:table-cell">Category</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                {role === 'admin' && <th className="pb-2 font-medium text-right pr-4 sm:pr-0">Edit</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const isNew = t.id === newTxId;
                return (
                  <tr key={t.id}
                    ref={isNew ? newRowRef : null}
                    className={`border-b transition-all duration-300 ${dark?'border-gray-700/50':'border-gray-50'}`}
                    style={{
                      background: isNew ? `${accent}20` : 'transparent',
                      animation: isNew ? 'fadeSlideIn 0.4s ease' : 'none',
                    }}>
                    <td className={`py-2.5 whitespace-nowrap px-4 sm:px-0 text-xs ${sub}`}>{t.date}</td>
                    <td className={`py-2.5 max-w-[150px] truncate ${dark?'text-gray-200':'text-gray-700'}`}>
                      {highlight(t.description, filters.search)}
                    </td>
                    <td className="py-2.5 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dark?'bg-gray-700 text-gray-300':'bg-gray-100 text-gray-600'}`}>{t.category}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.type==='income'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{t.type}</span>
                    </td>
                    <td className={`py-2.5 text-right font-semibold whitespace-nowrap ${t.type==='income'?'text-green-500':'text-red-500'}`}>
                      {t.type==='income'?'+':'-'}${t.amount.toFixed(2)}
                    </td>
                    {role === 'admin' && (
                      <td className="py-2.5 text-right pr-4 sm:pr-0">
                        <button onClick={() => setEditing(t)} className={`transition hover:scale-125 ${sub}`} style={{'--hover-color': accent}}>
                          <Pencil size={13}/>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && <TransactionModal initial={editing} onClose={() => setEditing(null)} dark={dark} accent={accent}/>}

      <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
