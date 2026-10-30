import { useState } from 'react';
import { Target, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';
import { calculateGoalProgress } from '../utils/financeCalculations';

export default function GoalsTab() {
  var financeStore = useFinanceStore();
  var goals = financeStore.goals;
  var addGoal = financeStore.addGoal;
  var removeGoal = financeStore.removeGoal;

  var formState = useState({ name: '', target: '', current: '', deadline: '' });
  var form = formState[0];
  var setForm = formState[1];

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.target) return;
    addGoal(form);
    setForm({ name: '', target: '', current: '', deadline: '' });
  }

  return (
    <FinanceSection title="Financial Goals" icon={Target}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <input
          type="text"
          placeholder="Goal name"
          value={form.name}
          onChange={function (e) { setForm(Object.assign({}, form, { name: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          placeholder="Target amount"
          value={form.target}
          onChange={function (e) { setForm(Object.assign({}, form, { target: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          placeholder="Current amount"
          value={form.current}
          onChange={function (e) { setForm(Object.assign({}, form, { current: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          placeholder="Deadline (2028)"
          value={form.deadline}
          onChange={function (e) { setForm(Object.assign({}, form, { deadline: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Add Goal</Button>
      </form>

      {goals.length === 0 ? (
        <p className="text-sm text-slate-400">No financial goals set yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {goals.map(function (g) {
            var progress = calculateGoalProgress(g);
            return (
              <div key={g.id} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">{g.name}</p>
                  <button onClick={function () { removeGoal(g.id); }} className="text-slate-400 hover:text-red-600 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Rs. {progress.current.toLocaleString('en-IN')} of Rs. {progress.target.toLocaleString('en-IN')}
                  {g.deadline ? ' - Deadline ' + g.deadline : ''}
                </p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: progress.percent + '%' }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{progress.percent}% complete - Rs. {progress.remaining.toLocaleString('en-IN')} remaining</p>
              </div>
            );
          })}
        </div>
      )}
    </FinanceSection>
  );
}
