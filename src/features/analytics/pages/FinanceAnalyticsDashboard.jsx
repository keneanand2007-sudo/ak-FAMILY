import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Landmark, X, ArrowLeft, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useFamilyStore } from '../../family/store';
import { useFinanceStore } from '../../finance/store';
import { buildFinanceOverview } from '../../finance/utils/aggregateFinanceAnalytics';

const PIE_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#0ea5e9', '#64748b', '#eab308'];

export default function FinanceAnalyticsDashboard() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { income, expenses, assets, liabilities, goals } = useFinanceStore();
  const [selectedId, setSelectedId] = useState('all');

  const overview = buildFinanceOverview(members, income, expenses, assets, liabilities, goals);

  const memberChartData = overview.perMember
    .filter((p) => p.income > 0 || p.expense > 0)
    .map((p) => ({
      name: p.member.name.split(' ')[0],
      Income: p.income,
      Expense: p.expense,
    }));

  const categoryData = Object.keys(overview.categoryTotals).map((cat) => ({
    name: cat,
    value: overview.categoryTotals[cat],
  }));

  const selectedMember = selectedId === 'all' ? null : members.find((m) => m.id === selectedId);
  const selectedIncome = selectedMember ? income.filter((i) => i.member === selectedMember.name) : [];
  const selectedExpense = selectedMember ? expenses.filter((e) => e.member === selectedMember.name) : [];

  const financeLabel = overview.totalIncome === 0 && overview.totalExpense === 0 ? 'Not set up' : overview.savings >= 0 ? 'Healthy' : 'Overspending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft size={15} /> Family Command Center
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Finance Analytics</h1>
              <p className="text-slate-500 text-sm">Family-wide financial intelligence, powered by your live data</p>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Family Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {selectedId === 'all' ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-emerald-200/50 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                <TrendingUp size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-lg font-bold leading-none">Rs. {overview.totalIncome.toLocaleString('en-IN')}</p>
                <p className="text-xs text-emerald-100 mt-1">Total Income</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-rose-200/50 bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                <TrendingDown size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-lg font-bold leading-none">Rs. {overview.totalExpense.toLocaleString('en-IN')}</p>
                <p className="text-xs text-rose-100 mt-1">Total Expenses</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-blue-200/50 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <PiggyBank size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-lg font-bold leading-none">Rs. {overview.savings.toLocaleString('en-IN')}</p>
                <p className="text-xs text-blue-100 mt-1">Net Savings ({financeLabel})</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <Landmark size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-lg font-bold leading-none">Rs. {overview.totalAssets.toLocaleString('en-IN')}</p>
                <p className="text-xs text-amber-100 mt-1">Total Assets</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Income vs Expense per Member</h2>
                {memberChartData.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">No finance data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={memberChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => 'Rs. ' + Number(v).toLocaleString('en-IN')} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Expense by Category</h2>
                {categoryData.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">No expenses recorded yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                        {categoryData.map((entry, index) => (
                          <Cell key={'cell-' + index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => 'Rs. ' + Number(v).toLocaleString('en-IN')} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Target size={15} className="text-emerald-600" /> Family Goals Progress
              </h2>
              {goals.length === 0 ? (
                <p className="text-sm text-slate-400">No financial goals set yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const target = Number(g.target) || 1;
                    const current = Number(g.current) || 0;
                    const pct = Math.min(100, Math.round((current / target) * 100));
                    return (
                      <div key={g.id} className="border border-slate-100 rounded-xl p-4">
                        <p className="text-sm font-medium text-slate-900 mb-1">{g.name}</p>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-emerald-500" style={{ width: pct + '%' }} />
                        </div>
                        <p className="text-xs text-slate-400">{pct}% complete</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-xl">
                {selectedMember.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                <p className="text-sm text-slate-500">{selectedMember.relationship}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs text-slate-400">Income</p>
                <p className="text-xl font-bold text-emerald-600">
                  Rs. {selectedIncome.reduce((sum, i) => sum + Number(i.amount || 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs text-slate-400">Expenses</p>
                <p className="text-xl font-bold text-rose-500">
                  Rs. {selectedExpense.reduce((sum, e) => sum + Number(e.amount || 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Transactions</h2>
              {selectedIncome.length === 0 && selectedExpense.length === 0 ? (
                <p className="text-sm text-slate-400">No transactions recorded for {selectedMember.name}.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {selectedIncome.map((i) => (
                    <div key={i.id} className="flex items-center justify-between py-2.5">
                      <p className="text-sm text-slate-700">{i.source} (Income)</p>
                      <p className="text-sm font-semibold text-emerald-600">+ Rs. {Number(i.amount).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                  {selectedExpense.map((e) => (
                    <div key={e.id} className="flex items-center justify-between py-2.5">
                      <p className="text-sm text-slate-700">{e.category} (Expense)</p>
                      <p className="text-sm font-semibold text-rose-500">- Rs. {Number(e.amount).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
