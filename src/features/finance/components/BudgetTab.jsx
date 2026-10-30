import { useState } from 'react';
import { Wallet2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';
import { calculateBudgetUsage, calculateCategoryBudgetUsage } from '../utils/financeCalculations';

var CATEGORIES = ['Food', 'Education', 'Healthcare', 'Transport', 'Utilities', 'Other'];

export default function BudgetTab() {
  var financeStore = useFinanceStore();
  var budget = financeStore.budget;
  var expenses = financeStore.expenses;
  var setBudget = financeStore.setBudget;

  var totalState = useState(budget.total || '');
  var total = totalState[0];
  var setTotal = totalState[1];

  var catAmountsState = useState(budget.categories || {});
  var catAmounts = catAmountsState[0];
  var setCatAmounts = catAmountsState[1];

  function handleCatChange(cat, value) {
    var updated = Object.assign({}, catAmounts);
    updated[cat] = value;
    setCatAmounts(updated);
  }

  function handleSave(e) {
    e.preventDefault();
    setBudget(Number(total) || 0, catAmounts);
  }

  var usage = calculateBudgetUsage(budget.total, expenses);

  return (
    <FinanceSection title="Budget Management" icon={Wallet2}>
      <form onSubmit={handleSave} className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Monthly Family Budget (Rs.)</label>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={total}
            onChange={function (e) { setTotal(e.target.value); }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="50000"
          />
          <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Save Budget</Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          {CATEGORIES.map(function (cat) {
            return (
              <div key={cat}>
                <label className="text-xs text-slate-500 mb-1 block">{cat}</label>
                <input
                  type="number"
                  value={catAmounts[cat] || ''}
                  onChange={function (e) { handleCatChange(cat, e.target.value); }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
            );
          })}
        </div>
      </form>

      {usage.budget > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm text-slate-700 font-medium">Overall Budget Used</p>
            <p className="text-sm text-slate-500">
              Rs. {usage.totalSpent.toLocaleString('en-IN')} / Rs. {usage.budget.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={
                usage.usedPercent >= 90
                  ? 'h-full bg-red-500 transition-all'
                  : usage.usedPercent >= 70
                  ? 'h-full bg-amber-500 transition-all'
                  : 'h-full bg-emerald-500 transition-all'
              }
              style={{ width: usage.usedPercent + '%' }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{usage.usedPercent}% used - Rs. {usage.remaining.toLocaleString('en-IN')} remaining</p>
        </div>
      )}

      {Object.keys(catAmounts).some(function (c) { return Number(catAmounts[c]) > 0; }) && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Category-wise Usage</p>
          <div className="space-y-3">
            {CATEGORIES.filter(function (cat) { return Number(catAmounts[cat]) > 0; }).map(function (cat) {
              var catUsage = calculateCategoryBudgetUsage(catAmounts[cat], expenses, cat);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-slate-600">{cat}</p>
                    <p className="text-xs text-slate-400">Rs. {catUsage.spent.toLocaleString('en-IN')} / Rs. {catUsage.limit.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={
                        catUsage.usedPercent >= 90
                          ? 'h-full bg-red-500'
                          : catUsage.usedPercent >= 70
                          ? 'h-full bg-amber-500'
                          : 'h-full bg-emerald-500'
                      }
                      style={{ width: catUsage.usedPercent + '%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </FinanceSection>
  );
}
