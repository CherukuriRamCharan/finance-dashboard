import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';
import { X } from 'lucide-react';

const empty = { date: '', description: '', category: CATEGORIES[0], type: 'expense', amount: '' };

export default function TransactionModal({ initial, onClose, dark, accent }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(initial ? { ...initial, amount: String(initial.amount) } : empty);

  function handleSubmit(e) {
    e.preventDefault();
    const tx = { ...form, amount: parseFloat(form.amount) };
    initial ? editTransaction(tx) : addTransaction(tx);
    onClose();
  }

  const inputCls = `border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 w-full ${dark ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500/40' : 'bg-white border-gray-200 text-gray-700 focus:ring-indigo-300'}`;
  const labelCls = `text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto`}
        style={{ animation: 'slideUp 0.25s ease' }}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className={`font-bold text-base ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{initial ? 'Edit' : 'Add'} Transaction</h3>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{initial ? 'Update the details below' : 'Fill in the transaction details'}</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition hover:scale-110 ${dark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}><X size={16}/></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[['Date','date','date'],['Description','description','text']].map(([label, key, type]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className={labelCls}>{label}</label>
              <input type={type} className={inputCls} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required/>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Type</label>
              <div className={`flex rounded-lg border overflow-hidden ${dark?'border-gray-600':'border-gray-200'}`}>
                {['expense','income'].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className="flex-1 py-2 text-xs capitalize font-medium transition-colors duration-200"
                    style={{ background: form.type===t ? (t==='income'?'#22c55e':'#ef4444') : 'transparent', color: form.type===t ? 'white' : dark?'#9ca3af':'#6b7280' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelCls}>Amount</label>
            <input type="number" className={inputCls} value={form.amount} min="0.01" step="0.01"
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required/>
          </div>

          <button type="submit"
            className="mt-2 text-white rounded-xl py-2.5 text-sm font-semibold transition hover:opacity-90 hover:scale-[1.02] active:scale-95"
            style={{ background: accent }}>
            {initial ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
