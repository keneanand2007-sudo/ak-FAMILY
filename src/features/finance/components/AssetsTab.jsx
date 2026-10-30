import { useState } from 'react';
import { Landmark, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../store';
import Button from '../../../components/Button';
import FinanceSection from './FinanceSection';

const TYPES = ['Property', 'Vehicle', 'Investments', 'Savings', 'Gold/Jewelry', 'Business', 'Other'];

export default function AssetsTab() {
  const { assets, addAsset, removeAsset } = useFinanceStore();
  const [form, setForm] = useState({ name: '', type: 'Property', owner: '', value: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.value) return;
    addAsset(form);
    setForm({ name: '', type: 'Property', owner: '', value: '' });
  };

  const totalValue = assets.reduce((sum, a) => sum + Number(a.value), 0);

  return (
    <FinanceSection title="Assets" icon={Landmark}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <input
          type="text"
          placeholder="Asset name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Owner"
          value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Button type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-200">Add</Button>
      </form>

      {assets.length > 0 && (
        <p className="text-sm text-slate-500 mb-3">
          Total Asset Value: <span className="font-semibold text-emerald-600">Rs. {totalValue.toLocaleString('en-IN')}</span>
        </p>
      )}

      {assets.length === 0 ? (
        <p className="text-sm text-slate-400">No assets recorded yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {assets.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{a.name}</p>
                <p className="text-xs text-slate-500">
                  {a.type} {a.owner ? '- ' + a.owner : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-emerald-600">
                  Rs. {Number(a.value).toLocaleString('en-IN')}
                </span>
                <button onClick={() => removeAsset(a.id)} className="text-slate-400 hover:text-red-600 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </FinanceSection>
  );
}
