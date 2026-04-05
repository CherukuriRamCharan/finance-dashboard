# 💰 Finance Dashboard

A clean, interactive personal finance dashboard built with **React + Vite + Tailwind CSS**. Designed as a frontend assignment showcasing UI design, component architecture, role-based access, data visualization, and thoughtful UX.

🔗 **Live Demo**: [finance-dashboard-wine-two.vercel.app](https://finance-dashboard-wine-two.vercel.app)

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary cards** — Total Balance, Income, and Expenses with animated number counters and hover micro-interactions
- **Savings progress bar** on the Balance card showing your savings rate at a glance
- **Monthly Overview chart** — toggle between Line and Bar chart views (Income vs Expenses vs Balance)
- **Spending by Category** — interactive donut chart with drill-down hover (dim other slices, see exact %)

### 💳 Transactions
- Full transaction list with **Date, Description, Category, Type, Amount**
- **Category chips** — toggle-filter by one or more categories instantly
- **Search with highlighting** — matching text is highlighted yellow in results
- **Sort** by date (newest/oldest) or amount (highest/lowest)
- **Filter** by type (income/expense)
- **Export to CSV** — download filtered transactions
- **Empty state illustration** with a clear-filters shortcut
- **New transaction row animation** — slides in with accent highlight when added

### 🔐 Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Floating FAB button | ❌ | ✅ |

- Role switcher in the header with animated banner on Admin mode
- Floating **+** button animates in when switching to Admin

### 💡 Insights
- **Category spotlight** — top spending category with mini bar breakdown of top 4
- **Month-over-month comparison** — % change in expenses with contextual message
- **Savings rate** with progress bar and streak counter (🏆 badge for 2+ positive months)
- **Savings suggestion** — e.g. *"Cutting 10% from Entertainment could save $X/month"*
- **Spending alert banner** — auto-detects categories with 20%+ increase, dismissable

### 🎨 UI/UX
- **Personalized greeting** — "Good morning/afternoon/evening, Alex" based on time of day
- **Dark mode** toggle (sun/moon) with smooth transition
- **5 accent color themes** — Indigo, Violet, Rose, Teal, Amber (color picker in header)
- **Finance-themed SVG background** — coin stack, bar chart, donut chart, trend line, wallet, grid
- **Glass morphism cards** — `bg-white/80 backdrop-blur-sm`
- Fully **responsive** — mobile-first, table columns collapse on small screens, modal slides up from bottom on mobile

### 🛠 Technical
- **localStorage persistence** — transactions, role, theme, accent color, and filters all saved across refreshes
- **Context API** state management (transactions, filters, role, theme, accent)
- Modular component structure
- Zero external UI library — pure Tailwind CSS

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/<your-username>/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```


### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Charts.jsx           # Line/Bar + Donut charts (Recharts)
│   ├── Insights.jsx         # Category spotlight, MoM, savings, streak
│   ├── SpendingAlert.jsx    # Auto-detected spending alert banner
│   ├── SummaryCards.jsx     # Balance / Income / Expenses cards
│   ├── TransactionModal.jsx # Add / Edit modal (slide-up on mobile)
│   └── TransactionsTable.jsx# Table with chips, search highlight, export
├── context/
│   └── AppContext.jsx       # Global state + localStorage persistence
├── data/
│   └── transactions.js      # 24 mock transactions across 3 months
├── App.jsx                  # Layout, header, dark mode, accent, FAB
├── main.jsx
└── index.css
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| Recharts | Charts (Line, Bar, Pie) |
| Lucide React | Icons |
| localStorage | Client-side persistence |

---

## 📸 Screenshots

> *(Add screenshots here after deployment)*
<img width="1919" height="787" alt="image" src="https://github.com/user-attachments/assets/f4e52c9e-b79f-460e-bde0-68fa6409ae54" />
<img width="1876" height="872" alt="Screenshot 2026-04-05 200117" src="https://github.com/user-attachments/assets/859de41a-f96d-4df4-a0dd-daa64a9f2d46" />
<img width="1884" height="886" alt="Screenshot 2026-04-05 200046" src="https://github.com/user-attachments/assets/c92d6f7b-1c39-4f69-bafa-cdff483e6605" />
<img width="1919" height="787" alt="Screenshot 2026-04-05 200134" src="https://github.com/user-attachments/assets/8f2f9429-8a8a-4b48-b2d4-2de7aeacf761" />

---

## 📋 Evaluation Checklist

| Criteria | Status |
|---|---|
| Design & Creativity | ✅ Glass morphism, SVG backgrounds, accent themes |
| Responsiveness | ✅ Mobile-first, collapsing columns, bottom-sheet modal |
| Functionality | ✅ All dashboard features + RBAC |
| User Experience | ✅ Animations, greeting, alerts, empty states |
| Technical Quality | ✅ Modular components, clean context |
| State Management | ✅ Context API + localStorage |
| Documentation | ✅ This README |
| Attention to Detail | ✅ Highlights, streaks, suggestions, FAB animation |

---

## 📄 License

MIT
