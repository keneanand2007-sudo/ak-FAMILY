import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet2, Landmark, CreditCard, Target, PiggyBank } from 'lucide-react';
import { useFinanceStore } from '../store';
import IncomeTab from '../components/IncomeTab';
import ExpenseTab from '../components/ExpenseTab';
import BudgetTab from '../components/BudgetTab';
import AssetsTab from '../components/AssetsTab';
import LiabilitiesTab from '../components/LiabilitiesTab';
import GoalsTab from '../components/GoalsTab';

const TABS = [
  { key: 'income', label: 'Income', icon: TrendingUp },
  { key: 'expenses', label: 'Expenses', icon: TrendingDown },
  { key: 'budget', label: 'Budget', icon: Wallet2 },
  { key: 'assets', label: 'Assets', icon: Landmark },
  { key: 'liabilities', label: 'Liabilities', icon: CreditCard },
  { key: 'goals', label: 'Goals', icon: Target },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('income');
  const { getTotals } = useFinanceStore();
  const totals = getTotals();

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Finance</h1>
      <p className="text-slate-500 text-sm mb-8">
        Family income, expenses, assets, liabilities and financial goals.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div className="relative overflow-hidden rounded-2xl p-4 shadow-md shadow-emerald-200/50 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <TrendingUp size={40} className="absolute -right-2 -bottom-2 text-white/15" />
          <p className="text-xs text-emerald-100">Income</p>
          <p className="text-lg font-bold mt-1">Rs. {totals.totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 shadow-md shadow-rose-200/50 bg-gradient-to-br from-rose-500 to-rose-700 text-white">
          <TrendingDown size={40} className="absolute -right-2 -bottom-2 text-white/15" />
          <p className="text-xs text-rose-100">Expenses</p>
          <p className="text-lg font-bold mt-1">Rs. {totals.totalExpense.toLocaleString('en-IN')}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 shadow-md shadow-blue-200/50 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <PiggyBank size={40} className="absolute -right-2 -bottom-2 text-white/15" />
          <p className="text-xs text-blue-100">Savings</p>
          <p className="text-lg font-bold mt-1">Rs. {totals.savings.toLocaleString('en-IN')}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-500 to-amber-700 text-white">
          <Landmark size={40} className="absolute -right-2 -bottom-2 text-white/15" />
          <p className="text-xs text-amber-100">Assets</p>
          <p className="text-lg font-bold mt-1">Rs. {totals.totalAssets.toLocaleString('en-IN')}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 shadow-md shadow-slate-300/50 bg-gradient-to-br from-slate-600 to-slate-800 text-white">
          <CreditCard size={40} className="absolute -right-2 -bottom-2 text-white/15" />
          <p className="text-xs text-slate-300">Liabilities</p>
          <p className="text-lg font-bold mt-1">Rs. {totals.totalLiabilities.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={
              activeTab === key
                ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'income' && <IncomeTab />}
      {activeTab === 'expenses' && <ExpenseTab />}
      {activeTab === 'budget' && <BudgetTab />}
      {activeTab === 'assets' && <AssetsTab />}
      {activeTab === 'liabilities' && <LiabilitiesTab />}
      {activeTab === 'goals' && <GoalsTab />}
    </div>
  );
}
