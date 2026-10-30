import { useState } from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import { useFamilyStore } from '../../family/store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';

var SOURCES = ['Salary', 'Business', 'Freelancing', 'Pension', 'Rent', 'Investments', 'Other'];

export default function IncomeTab() {
  var financeStore = useFinanceStore();
  var income = financeStore.income;
  var addIncome = financeStore.addIncome;
  var removeIncome = financeStore.removeIncome;
  var members = useFamilyStore(function (s) { return s.members; });

  var formState = useState({ source: 'Salary', member: '', amount: '', frequency: 'Monthly' });
  var form = formState[0];
  var setForm = formState[1];

  function handleAdd(e) {
    e.preventDefault();
    if (!form.amount) return;
    addIncome(form);
    setForm({ source: 'Salary', member: '', amount: '', frequency: 'Monthly' });
  }

  return (
    <FinanceSection title="Income Tracking" icon={TrendingUp}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <select
          value={form.source}
          onChange={function (e) { setForm(Object.assign({}, form, { source: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {SOURCES.map(function (s) { return <option key={s}>{s}</option>; })}
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
        <select
          value={form.frequency}
          onChange={function (e) { setForm(Object.assign({}, form, { frequency: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option>Monthly</option>
          <option>Yearly</option>
          <option>One-time</option>
        </select>
        <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Add</Button>
      </form>

      {income.length === 0 ? (
        <p className="text-sm text-slate-400">No income records yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {income.map(function (i) {
            return (
              <div key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {i.source}{i.member ? ' - ' + i.member : ''}
                  </p>
                  <p className="text-xs text-slate-500">{i.frequency}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-emerald-600">
                    Rs. {Number(i.amount).toLocaleString('en-IN')}
                  </span>
                  <button onClick={function () { removeIncome(i.id); }} className="text-slate-400 hover:text-red-600 transition">
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
