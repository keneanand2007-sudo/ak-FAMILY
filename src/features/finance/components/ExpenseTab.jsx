import { useState } from 'react';
import { TrendingDown, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import { useFamilyStore } from '../../family/store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';

var CATEGORIES = [
  'Housing', 'Food', 'Education', 'Healthcare', 'Transportation',
  'Utilities', 'Entertainment', 'Shopping', 'Insurance', 'Other',
];

export default function ExpenseTab() {
  var financeStore = useFinanceStore();
  var expenses = financeStore.expenses;
  var addExpense = financeStore.addExpense;
  var removeExpense = financeStore.removeExpense;
  var members = useFamilyStore(function (s) { return s.members; });

  var formState = useState({ category: 'Food', member: '', amount: '', date: '' });
  var form = formState[0];
  var setForm = formState[1];

  function handleAdd(e) {
    e.preventDefault();
    if (!form.amount) return;
    addExpense(form);
    setForm({ category: 'Food', member: '', amount: '', date: '' });
  }

  var categoryTotals = {};
  expenses.forEach(function (e) {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  var totalExpense = expenses.reduce(function (sum, e) { return sum + Number(e.amount); }, 0);

  return (
    <FinanceSection title="Expense Management" icon={TrendingDown}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <select
          value={form.category}
          onChange={function (e) { setForm(Object.assign({}, form, { category: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {CATEGORIES.map(function (c) { return <option key={c}>{c}</option>; })}
        </select>
        <select
          value={form.member}
          onChange={function (e) { setForm(Object.assign({}, form, { member: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select member</option>
          {members.map(function (m) {
            return <option key={m.id} value={m.name}>{m.name}</option>;
          })}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={function (e) { setForm(Object.assign({}, form, { amount: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={function (e) { setForm(Object.assign({}, form, { date: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Add</Button>
      </form>

      {expenses.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-2 mb-5">
          {Object.keys(categoryTotals).map(function (cat) {
            var pct = totalExpense > 0 ? Math.round((categoryTotals[cat] / totalExpense) * 100) : 0;
            return (
              <div key={cat} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">{cat}</p>
                <p className="text-sm font-semibold text-slate-900">
                  Rs. {categoryTotals[cat].toLocaleString('en-IN')} ({pct}%)
                </p>
              </div>
            );
          })}
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-sm text-slate-400">No expense records yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {expenses.map(function (e) {
            return (
              <div key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {e.category}{e.member ? ' - ' + e.member : ''}
                  </p>
                  <p className="text-xs text-slate-500">{e.date || 'No date'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-red-500">
                    Rs. {Number(e.amount).toLocaleString('en-IN')}
                  </span>
                  <button onClick={function () { removeExpense(e.id); }} className="text-slate-400 hover:text-red-600 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FinanceSection>
  );
}
