import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFinanceStore } from '../../finance/store';

export default function FinanceChart() {
  const { income, expenses } = useFinanceStore();

  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const data = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#f43f5e' },
  ];

  const hasData = totalIncome > 0 || totalExpense > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Income vs Expenses</h2>
      {!hasData ? (
        <p className="text-sm text-slate-400 py-8 text-center">No finance data yet. Add income or expenses to see this chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => 'Rs. ' + Number(value).toLocaleString('en-IN')}
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
