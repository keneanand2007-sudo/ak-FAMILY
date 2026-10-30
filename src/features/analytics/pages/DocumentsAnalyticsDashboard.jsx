import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, X, ArrowLeft, FolderOpen, Paperclip } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useFamilyStore } from '../../family/store';
import { useDocumentsStore } from '../../documents/store';

const COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1', '#64748b', '#eab308', '#ec4899'];

export default function DocumentsAnalyticsDashboard() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { documents, getExpiringSoon } = useDocumentsStore();
  const [selectedId, setSelectedId] = useState('all');

  const expiring = getExpiringSoon(60);
  const withAttachment = documents.filter((d) => d.attachment).length;

  const categoryTotals = {};
  documents.forEach((d) => {
    categoryTotals[d.category] = (categoryTotals[d.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryTotals).map((cat) => ({ name: cat, count: categoryTotals[cat] }));

  const selectedMember = selectedId === 'all' ? null : members.find((m) => m.id === selectedId);
  const selectedDocs = selectedMember ? documents.filter((d) => d.owner === selectedMember.name) : [];

  const today = new Date(new Date().toDateString());
  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    return Math.round((new Date(dateStr) - today) / 86400000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition"
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
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Documents Analytics</h1>
              <p className="text-slate-500 text-sm">Family document vault intelligence</p>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Family Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {selectedId === 'all' ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-sky-200/50 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
                <FileText size={50} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{documents.length}</p>
                <p className="text-xs text-sky-100 mt-1">Total Documents</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-emerald-200/50 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                <Paperclip size={50} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{withAttachment}</p>
                <p className="text-xs text-emerald-100 mt-1">Files Attached</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-red-200/50 bg-gradient-to-br from-red-500 to-red-700 text-white">
                <AlertTriangle size={50} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{expiring.length}</p>
                <p className="text-xs text-red-100 mt-1">Expiring within 60 days</p>
              </div>
            </div>

            {expiring.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
                <p className="text-sm font-semibold text-red-700 mb-2">Expiry Intelligence</p>
                <div className="space-y-1">
                  {expiring.map((d) => {
                    const days = daysUntil(d.expiryDate);
                    return (
                      <p key={d.id} className="text-sm text-red-600">
                        {d.name} - {days <= 0 ? 'Expired' : days + ' days left'}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Documents by Category</h2>
              {categoryData.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No documents added yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-bold text-xl">
                {selectedMember.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                <p className="text-sm text-slate-500">{selectedDocs.length} documents owned</p>
              </div>
            </div>

            {selectedDocs.length === 0 ? (
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <FolderOpen size={15} /> No documents owned by {selectedMember.name}.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedDocs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{d.name}</p>
                      {d.attachment && <Paperclip size={12} className="text-emerald-500" />}
                    </div>
                    {d.expiryDate && <p className="text-xs text-slate-400">{d.expiryDate}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
