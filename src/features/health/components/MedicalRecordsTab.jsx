import { useState } from 'react';
import { FileHeart, Trash2, Paperclip, Eye, X } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';

const TYPES = ['Report', 'Prescription', 'Test Result', 'Vaccination', 'Insurance', 'Doctor Note', 'Other'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function MedicalRecordsTab({ memberId }) {
  const { getMemberHealth, addRecord, removeRecord } = useHealthStore();
  const records = getMemberHealth(memberId).records;
  const [form, setForm] = useState({ type: 'Report', provider: '', date: '', notes: '' });
  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File too large. Please choose an image or PDF under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        fileName: file.name,
        fileType: file.type,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.provider.trim()) return;
    const record = { ...form };
    if (attachment) {
      record.attachment = attachment;
    }
    addRecord(memberId, record);
    setForm({ type: 'Report', provider: '', date: '', notes: '' });
    setAttachment(null);
    setFileError('');
  };

  const openAttachment = (att) => {
    const win = window.open();
    if (win) {
      if (att.fileType && att.fileType.indexOf('image') === 0) {
        win.document.write('<img src="' + att.dataUrl + '" style="max-width:100%" />');
      } else {
        win.document.write('<iframe src="' + att.dataUrl + '" style="width:100%;height:100vh;border:none"></iframe>');
      }
    }
  };

  return (
    <HealthSection title="Medical Records" icon={FileHeart}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-2">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Provider / Hospital"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Add Record</Button>
      </form>

      <div className="mb-5">
        <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 cursor-pointer w-fit">
          <Paperclip size={13} />
          Attach a photo or PDF (optional, max 2MB)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-rose-50 file:text-rose-600 file:text-xs file:font-medium hover:file:bg-rose-100"
        />
        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
        {attachment && (
          <div className="flex items-center gap-2 mt-2 bg-rose-50 rounded-lg px-3 py-1.5 w-fit">
            <span className="text-xs text-rose-700 font-medium">{attachment.fileName}</span>
            <button type="button" onClick={() => setAttachment(null)} className="text-rose-400 hover:text-red-600">
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-slate-400">No medical records yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {r.type} - {r.provider}
                </p>
                <p className="text-xs text-slate-500">{r.date || 'No date'}</p>
              </div>
              <div className="flex items-center gap-3">
                {r.attachment && (
                  <button
                    onClick={() => openAttachment(r.attachment)}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                  >
                    <Eye size={12} /> View
                  </button>
                )}
                <button onClick={() => removeRecord(memberId, r.id)} className="text-slate-400 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </HealthSection>
  );
}
