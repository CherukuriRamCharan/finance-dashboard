import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import TransactionsTable from './components/TransactionsTable';
import Insights from './components/Insights';
import SpendingAlert from './components/SpendingAlert';
import TransactionModal from './components/TransactionModal';
import { ShieldCheck, Eye, Sun, Moon, Plus, Palette } from 'lucide-react';

const ACCENTS = [
  { name: 'indigo', hex: '#6366f1' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'rose',   hex: '#f43f5e' },
  { name: 'teal',   hex: '#14b8a6' },
  { name: 'amber',  hex: '#f59e0b' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function BgDecorations({ dark }) {
  const c = dark ? '#818cf8' : '#6366f1';
  const g = dark ? '#34d399' : '#22c55e';
  const wrap = { position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 };
  const s = (top,left,right,bottom,w,h,o) => ({ position:'absolute',top,left,right,bottom,width:w,height:h,opacity:o });
  return (
    <div style={wrap} aria-hidden>
      <svg style={s('-60px','-40px',undefined,undefined,'280px','280px',dark?0.12:0.18)} viewBox="0 0 200 200">
        <ellipse cx="100" cy="170" rx="72" ry="20" fill="#c7d2fe"/><ellipse cx="100" cy="148" rx="72" ry="20" fill="#a5b4fc"/>
        <ellipse cx="100" cy="126" rx="72" ry="20" fill="#818cf8"/><ellipse cx="100" cy="104" rx="72" ry="20" fill={c}/>
        <ellipse cx="100" cy="82" rx="72" ry="20" fill="#4f46e5"/>
        <text x="100" y="88" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">$</text>
      </svg>
      <svg style={s('-20px',undefined,'-20px',undefined,'300px','300px',dark?0.10:0.15)} viewBox="0 0 200 200">
        <rect x="15" y="130" width="30" height="55" rx="5" fill="#86efac"/><rect x="55" y="90" width="30" height="95" rx="5" fill="#4ade80"/>
        <rect x="95" y="55" width="30" height="130" rx="5" fill={g}/><rect x="135" y="100" width="30" height="85" rx="5" fill="#16a34a"/>
        <line x1="8" y1="188" x2="192" y2="188" stroke="#15803d" strokeWidth="4"/>
      </svg>
      <svg style={s(undefined,'-30px',undefined,'-30px','300px','300px',dark?0.10:0.15)} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#fde68a" strokeWidth="38" strokeDasharray="160 352"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#818cf8" strokeWidth="38" strokeDasharray="110 352" strokeDashoffset="-160"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#6ee7b7" strokeWidth="38" strokeDasharray="82 352" strokeDashoffset="-270"/>
        <circle cx="100" cy="100" r="48" fill={dark?'#1e293b':'#f8fafc'}/>
        <text x="100" y="107" textAnchor="middle" fontSize="18" fill={c} fontWeight="bold">%</text>
      </svg>
      <svg style={s(undefined,undefined,'-20px','-20px','340px','220px',dark?0.12:0.18)} viewBox="0 0 240 160">
        <polyline points="10,140 55,105 95,118 135,65 175,80 230,25" stroke="#a5b4fc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {[[10,140],[55,105],[95,118],[135,65],[175,80],[230,25]].map(([x,y])=>(
          <circle key={x} cx={x} cy={y} r="7" fill={c}/>
        ))}
      </svg>
      <svg style={s('38%','20px',undefined,undefined,'120px','120px',dark?0.08:0.12)} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 3H8L4 7h16l-4-4z"/><circle cx="17" cy="14" r="1.5" fill={c}/>
      </svg>
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:dark?0.02:0.03}}>
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={c} strokeWidth="1"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>
  );
}

function Dashboard() {
  const { role, setRole, theme, setTheme, accent, setAccent } = useApp();
  const [showPalette, setShowPalette] = useState(false);
  const [adding, setAdding] = useState(false);
  const [roleAnim, setRoleAnim] = useState(false);
  const dark = theme === 'dark';

  const accentHex = ACCENTS.find(a => a.name === accent)?.hex || '#6366f1';

  function handleRoleChange(v) {
    setRoleAnim(true);
    setTimeout(() => { setRole(v); setRoleAnim(false); }, 300);
  }

  const bg    = dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';
  const card  = dark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100';
  const text  = dark ? 'text-gray-100' : 'text-gray-800';
  const sub   = dark ? 'text-gray-400' : 'text-gray-500';
  const hdr   = dark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-100';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`} style={{position:'relative',zIndex:1}}>
      <BgDecorations dark={dark} />

      {/* Header */}
      <header className={`${hdr} backdrop-blur-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="text-white p-2 rounded-xl shadow-md transition-transform hover:scale-110" style={{background: accentHex}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <h1 className={`text-base sm:text-lg font-bold ${text} leading-tight`}>Finance Dashboard</h1>
            <p className={`text-xs ${sub} hidden sm:block`}>{greeting()}, Alex — here's your financial snapshot</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Accent palette */}
          <div className="relative">
            <button onClick={() => setShowPalette(p => !p)} className={`p-1.5 rounded-lg border ${dark?'border-gray-600 text-gray-300':'border-gray-200 text-gray-500'} hover:scale-110 transition-transform`} title="Theme color">
              <Palette size={15}/>
            </button>
            {showPalette && (
              <div className={`absolute right-0 top-9 ${dark?'bg-gray-800 border-gray-700':'bg-white border-gray-100'} border rounded-xl shadow-lg p-2 flex gap-1.5 z-30`}>
                {ACCENTS.map(a => (
                  <button key={a.name} onClick={() => { setAccent(a.name); setShowPalette(false); }}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-125 ring-offset-1"
                    style={{background: a.hex, outline: accent===a.name ? `2px solid ${a.hex}` : 'none', outlineOffset: 2}}
                    title={a.name}/>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button onClick={() => setTheme(dark ? 'light' : 'dark')}
            className={`p-1.5 rounded-lg border ${dark?'border-gray-600 text-yellow-300':'border-gray-200 text-gray-500'} hover:scale-110 transition-transform`}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>

          {/* Role switcher */}
          <div className={`flex items-center gap-1.5 border rounded-lg px-2 py-1.5 text-sm transition-all duration-300 ${dark?'border-gray-600 bg-gray-800':'border-gray-200 bg-white'} ${roleAnim ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {role === 'admin' ? <ShieldCheck size={14} style={{color:accentHex}}/> : <Eye size={14} className={sub}/>}
            <select className={`outline-none text-sm ${dark?'bg-gray-800 text-gray-200':'bg-white text-gray-600'}`}
              value={role} onChange={e => handleRoleChange(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </header>

      {/* Admin banner — animated */}
      <div className={`overflow-hidden transition-all duration-500 ${role==='admin' ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{borderBottom: role==='admin' ? `1px solid ${accentHex}22` : 'none', background: role==='admin' ? `${accentHex}11` : 'transparent'}}>
        <p className="px-4 sm:px-6 py-2 text-xs font-medium" style={{color: accentHex}}>
          ✦ Admin mode — you can add and edit transactions
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-6 flex flex-col gap-4 sm:gap-5">
        <SpendingAlert dark={dark} accent={accentHex} />
        <SummaryCards dark={dark} accent={accentHex} card={card} text={text} sub={sub} />
        <Charts dark={dark} accent={accentHex} card={card} text={text} sub={sub} />
        <Insights dark={dark} accent={accentHex} card={card} text={text} sub={sub} />
        <TransactionsTable dark={dark} accent={accentHex} card={card} text={text} sub={sub} />
      </main>

      {/* Floating Add button (admin only) */}
      <div className={`fixed bottom-6 right-6 z-30 transition-all duration-500 ${role==='admin' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button onClick={() => setAdding(true)}
          className="text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          style={{background: accentHex}} title="Add transaction">
          <Plus size={24}/>
        </button>
      </div>

      {adding && <TransactionModal onClose={() => setAdding(false)} dark={dark} accent={accentHex} />}
    </div>
  );
}

export default function App() {
  return <AppProvider><Dashboard /></AppProvider>;
}
