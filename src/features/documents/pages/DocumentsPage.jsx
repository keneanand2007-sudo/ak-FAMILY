import { useState } from 'react';
import { FileText, AlertTriangle, Paperclip, Grid3x3, List, Lightbulb } from 'lucide-react';
import { useDocumentsStore } from '../store';
import AddDocumentForm from '../components/AddDocumentForm';
import DocumentCard from '../components/DocumentCard';
import { buildMissingDocSuggestions } from '../utils/documentIntelligence';

var CATEGORIES = ['All', 'Identity', 'Financial', 'Medical', 'Education', 'Property', 'Insurance', 'Legal', 'Certificates', 'Other'];
var SORT_OPTIONS = [
  { key: 'recent', label: 'Recently Added' },
  { key: 'name', label: 'Name (A-Z)' },
  { key: 'expiry', label: 'Expiry Date' },
];

export default function DocumentsPage() {
  var docsStore = useDocumentsStore();
  var documents = docsStore.documents;
  var expiring = docsStore.getExpiringSoon(60);

  var filterState = useState('All');
  var filter = filterState[0];
  var setFilter = filterState[1];

  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  var sortState = useState('recent');
  var sortBy = sortState[0];
  var setSortBy = sortState[1];

  var viewState = useState('list');
  var view = viewState[0];
  var setView = viewState[1];

  var withAttachment = documents.filter(function (d) {
    return (d.attachments && d.attachments.length > 0) || d.attachment;
  }).length;

  var missingDocs = buildMissingDocSuggestions(documents);

  var filtered = documents.filter(function (d) {
    var matchesCategory = filter === 'All' || d.category === filter;
    var searchLower = search.toLowerCase();
    var matchesSearch =
      d.name.toLowerCase().indexOf(searchLower) !== -1 ||
      (d.tags && d.tags.some(function (t) { return t.toLowerCase().indexOf(searchLower) !== -1; }));
    return matchesCategory && matchesSearch;
  });

  filtered = filtered.slice().sort(function (a, b) {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'expiry') {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    }
    return (b.id || '').localeCompare(a.id || '');
  });

  var categoryCounts = {};
  documents.forEach(function (d) {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Documents</h1>
      <p className="text-slate-500 text-sm mb-8">
        Centralized family document vault with expiry tracking and file storage.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-sky-200/50 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
          <FileText size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <FileText size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{documents.length}</p>
          <p className="text-xs text-sky-100 mt-1">Total Documents</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-emerald-200/50 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
          <Paperclip size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <Paperclip size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{withAttachment}</p>
          <p className="text-xs text-emerald-100 mt-1">Files Attached</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-red-200/50 bg-gradient-to-br from-red-500 to-red-700 text-white">
          <AlertTriangle size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <AlertTriangle size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{expiring.length}</p>
          <p className="text-xs text-red-100 mt-1">Expiring within 60 days</p>
        </div>
      </div>

      {missingDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
            <Lightbulb size={15} />
            <span>You might be missing these important documents</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {missingDocs.map(function (m) {
              return (
                <span key={m.category} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white text-amber-700 border border-amber-200">
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {expiring.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-red-700 mb-2">Document Expiring Soon</p>
          <div className="space-y-1">
            {expiring.map(function (d) {
              return (
                <p key={d.id} className="text-sm text-red-600">
                  {d.name} - {d.expiryDate}
                </p>
              );
            })}
          </div>
        </div>
      )}

      <AddDocumentForm />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-slate-900">All Documents</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={function () { setView('list'); }}
                className={view === 'list' ? 'p-1.5 rounded-md bg-white text-sky-600 shadow-sm' : 'p-1.5 rounded-md text-slate-400'}
              >
                <List size={14} />
              </button>
              <button
                onClick={function () { setView('grid'); }}
                className={view === 'grid' ? 'p-1.5 rounded-md bg-white text-sky-600 shadow-sm' : 'p-1.5 rounded-md text-slate-400'}
              >
                <Grid3x3 size={14} />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={function (e) { setSortBy(e.target.value); }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {SORT_OPTIONS.map(function (s) {
                return <option key={s.key} value={s.key}>{s.label}</option>;
              })}
            </select>
            <input
              type="text"
              placeholder="Search name or tag..."
              value={search}
              onChange={function (e) { setSearch(e.target.value); }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map(function (c) {
            var count = categoryCounts[c] ? categoryCounts[c] : (c === 'All' && documents.length ? documents.length : 0);
            return (
              <button
                key={c}
                onClick={function () { setFilter(c); }}
                className={
                  filter === c
                    ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition bg-sky-600 text-white'
                    : 'px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              >
                {c}{count ? ' (' + count + ')' : ''}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400">No documents found.</p>
        ) : (
          <div className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'grid sm:grid-cols-2 gap-3'}>
            {filtered.map(function (doc) {
              return <DocumentCard key={doc.id} doc={doc} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
