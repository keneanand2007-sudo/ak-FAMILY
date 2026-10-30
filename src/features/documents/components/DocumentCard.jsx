import { useState } from 'react';
import { FileText, Trash2, User, Calendar, Eye, Pencil, Check, X, Paperclip } from 'lucide-react';
import { useDocumentsStore } from '../store';

var CATEGORY_COLORS = {
  Identity: 'bg-blue-50 text-blue-600',
  Financial: 'bg-emerald-50 text-emerald-600',
  Medical: 'bg-rose-50 text-rose-600',
  Education: 'bg-amber-50 text-amber-600',
  Property: 'bg-violet-50 text-violet-600',
  Insurance: 'bg-indigo-50 text-indigo-600',
  Legal: 'bg-slate-100 text-slate-600',
  Certificates: 'bg-yellow-50 text-yellow-600',
  Other: 'bg-slate-100 text-slate-500',
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  var today = new Date(new Date().toDateString());
  var target = new Date(dateStr);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default function DocumentCard({ doc }) {
  var docsStore = useDocumentsStore();

  var editingState = useState(false);
  var editing = editingState[0];
  var setEditing = editingState[1];

  var nameEditState = useState(doc.name);
  var nameEdit = nameEditState[0];
  var setNameEdit = nameEditState[1];

  var expiryEditState = useState(doc.expiryDate || '');
  var expiryEdit = expiryEditState[0];
  var setExpiryEdit = expiryEditState[1];

  var catColor = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.Other;
  var expiryDays = daysUntil(doc.expiryDate);
  var attachments = doc.attachments || (doc.attachment ? [doc.attachment] : []);

  function openAttachment(att) {
    var win = window.open();
    if (win) {
      if (att.fileType && att.fileType.indexOf('image') === 0) {
        win.document.write('<img src="' + att.dataUrl + '" style="max-width:100%" />');
      } else {
        win.document.write('<iframe src="' + att.dataUrl + '" style="width:100%;height:100vh;border:none"></iframe>');
      }
    }
  }

  function saveEdit() {
    docsStore.updateDocument(doc.id, { name: nameEdit, expiryDate: expiryEdit });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="border border-sky-200 rounded-xl p-4 bg-sky-50/40">
        <input
          type="text"
          value={nameEdit}
          onChange={function (e) { setNameEdit(e.target.value); }}
          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="date"
          value={expiryEdit}
          onChange={function (e) { setExpiryEdit(e.target.value); }}
          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <div className="flex items-center gap-2">
          <button onClick={saveEdit} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
            <Check size={12} />
            <span>Save</span>
          </button>
          <button onClick={function () { setEditing(false); }} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
            <X size={12} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{doc.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + catColor}>
                {doc.category}
              </span>
              {doc.owner && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User size={11} />
                  <span>{doc.owner}</span>
                </span>
              )}
              {doc.expiryDate && (
                <span className={
                  expiryDays !== null && expiryDays <= 30
                    ? 'text-xs text-red-500 flex items-center gap-1 font-medium'
                    : 'text-xs text-slate-400 flex items-center gap-1'
                }>
                  <Calendar size={11} />
                  <span>{expiryDays !== null && expiryDays >= 0 ? expiryDays + ' days left' : 'Expired'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={function () { setEditing(true); }} className="text-slate-400 hover:text-sky-600 transition" title="Edit">
            <Pencil size={14} />
          </button>
          <button onClick={function () { docsStore.removeDocument(doc.id); }} className="text-slate-400 hover:text-red-600 transition" title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {(doc.tags && doc.tags.length > 0) && (
        <div className="flex flex-wrap gap-1 mt-2 ml-[52px]">
          {doc.tags.map(function (t) {
            return (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {t}
              </span>
            );
          })}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-[52px]">
          {attachments.map(function (att, i) {
            return (
              <button
                key={i}
                onClick={function () { openAttachment(att); }}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
              >
                <Eye size={11} />
                <span>{att.fileName.length > 18 ? att.fileName.slice(0, 15) + '...' : att.fileName}</span>
              </button>
            );
          })}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Paperclip size={11} />
            <span>{attachments.length}</span>
          </span>
        </div>
      )}
    </div>
  );
}
