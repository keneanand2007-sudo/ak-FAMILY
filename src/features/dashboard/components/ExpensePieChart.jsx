import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinanceStore } from '../../finance/store';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#0ea5e9', '#64748b', '#eab308', '#ec4899', '#14b8a6'];

export default function ExpensePieChart() {
  const { expenses } = useFinanceStore();

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Expense by Category</h2>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No expenses recorded yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => 'Rs. ' + Number(value).toLocaleString('en-IN')}
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
