import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePlacesStore } from '../store';
import Button from '../../../components/Button';

const TYPES = ['Home', 'School', 'College', 'Office', 'Hospital', 'Relative House', 'Emergency Center', 'Property', 'Other'];

export default function AddPlaceForm() {
  const { addPlace } = usePlacesStore();
  const [form, setForm] = useState({ name: '', type: 'Home', address: '', notes: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addPlace(form);
    setForm({ name: '', type: 'Home', address: '', notes: '' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Add Important Place</h2>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-2">
        <input
          type="text"
          placeholder="Place name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button type="submit" className="!bg-violet-600 hover:!bg-violet-700 shadow-violet-200 flex items-center gap-1.5 justify-center">
          <Plus size={15} /> Add
        </Button>
      </form>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
}
