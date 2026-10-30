import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useDocumentsStore } from '../../documents/store';

const COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1', '#64748b', '#eab308', '#ec4899'];

export default function DocumentsChart() {
  const { documents } = useDocumentsStore();

  const categoryTotals = {};
  documents.forEach((d) => {
    categoryTotals[d.category] = (categoryTotals[d.category] || 0) + 1;
  });

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    count: categoryTotals[cat],
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Documents by Category</h2>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No documents added yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
