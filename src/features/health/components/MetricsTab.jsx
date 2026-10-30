import { useState } from 'react';
import { LineChart as LineChartIcon, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';

const METRIC_TYPES = ['Weight (kg)', 'Blood Pressure (systolic)', 'Blood Sugar (mg/dL)', 'Heart Rate (bpm)'];

export default function MetricsTab({ memberId }) {
  const { getMemberHealth, addMetric, removeMetric } = useHealthStore();
  const metrics = getMemberHealth(memberId).metrics;
  const [form, setForm] = useState({ type: 'Weight (kg)', value: '', date: '' });
  const [activeType, setActiveType] = useState('Weight (kg)');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.value || !form.date) return;
    addMetric(memberId, form);
    setForm({ type: form.type, value: '', date: '' });
  };

  const filteredMetrics = metrics
    .filter((m) => m.type === activeType)
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = filteredMetrics.map((m) => ({
    date: m.date,
    value: Number(m.value),
  }));

  const typesWithData = Array.from(new Set(metrics.map((m) => m.type)));

  return (
    <HealthSection title="Health Trends" icon={LineChartIcon}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-5">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          {METRIC_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Log Entry</Button>
      </form>

      {typesWithData.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {METRIC_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={
                activeType === t
                  ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition bg-rose-600 text-white'
                  : 'px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {chartData.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">No entries for {activeType} yet.</p>
      ) : (
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Line type="monotone" dataKey="value" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredMetrics.length > 0 && (
        <div className="divide-y divide-slate-100">
          {filteredMetrics.slice().reverse().map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2">
              <p className="text-sm text-slate-700">{m.date}: <span className="font-medium">{m.value}</span></p>
              <button onClick={() => removeMetric(memberId, m.id)} className="text-slate-400 hover:text-red-600 transition">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </HealthSection>
  );
}
