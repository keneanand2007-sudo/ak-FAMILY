import { useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';

const TYPES = ['Education Loan', 'Home Loan', 'Vehicle Loan', 'Credit Card', 'Other Debt'];

export default function LiabilitiesTab() {
  const { liabilities, addLiability, removeLiability } = useFinanceStore();
  const [form, setForm] = useState({ type: 'Home Loan', amount: '', paid: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount) return;
    addLiability(form);
    setForm({ type: 'Home Loan', amount: '', paid: '' });
  };

  const totalLiability = liabilities.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = liabilities.reduce((sum, l) => sum + Number(l.paid || 0), 0);
  const totalRemaining = totalLiability - totalPaid;

  return (
    <FinanceSection title="Liabilities" icon={CreditCard}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-5">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="number"
          placeholder="Total amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          placeholder="Amount paid"
          value={form.paid}
          onChange={(e) => setForm({ ...form, paid: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Add</Button>
      </form>

      {liabilities.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-2 mb-5">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Total Liability</p>
            <p className="text-sm font-semibold text-slate-900">Rs. {totalLiability.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Paid</p>
            <p className="text-sm font-semibold text-emerald-600">Rs. {totalPaid.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="text-sm font-semibold text-red-500">Rs. {totalRemaining.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {liabilities.length === 0 ? (
        <p className="text-sm text-slate-400">No liabilities recorded.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {liabilities.map((l) => (
            <div key={l.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{l.type}</p>
                <p className="text-xs text-slate-500">
                  Paid Rs. {Number(l.paid || 0).toLocaleString('en-IN')} of Rs. {Number(l.amount).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => removeLiability(l.id)} className="text-slate-400 hover:text-red-600 transition">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </FinanceSection>
  );
}
