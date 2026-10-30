import { useState } from 'react';
import { Plus, Paperclip, X, Tag } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useDocumentsStore } from '../store';
import Button from '../../../components/Button';

var CATEGORIES = ['Identity', 'Financial', 'Medical', 'Education', 'Property', 'Insurance', 'Legal', 'Certificates', 'Other'];
var MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function AddDocumentForm() {
  var familyStore = useFamilyStore();
  var members = familyStore.members;
  var docsStore = useDocumentsStore();

  var formState = useState({ name: '', category: 'Identity', owner: '', expiryDate: '' });
  var form = formState[0];
  var setForm = formState[1];

  var attachmentsState = useState([]);
  var attachments = attachmentsState[0];
  var setAttachments = attachmentsState[1];

  var fileErrorState = useState('');
  var fileError = fileErrorState[0];
  var setFileError = fileErrorState[1];

  var tagInputState = useState('');
  var tagInput = tagInputState[0];
  var setTagInput = tagInputState[1];

  var tagsState = useState([]);
  var tags = tagsState[0];
  var setTags = tagsState[1];

  function handleFileChange(e) {
    var files = Array.from(e.target.files || []);
    setFileError('');
    var tooLarge = files.some(function (f) { return f.size > MAX_FILE_SIZE; });
    if (tooLarge) {
      setFileError('One or more files exceed 2MB. Please choose smaller files.');
      return;
    }

    var readers = files.map(function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve({ fileName: file.name, fileType: file.type, dataUrl: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(function (results) {
      setAttachments(attachments.concat(results));
    });
  }

  function removeAttachment(index) {
    setAttachments(attachments.filter(function (a, i) { return i !== index; }));
  }

  function handleAddTag(e) {
    e.preventDefault();
    var t = tagInput.trim();
    if (!t || tags.indexOf(t) !== -1) return;
    setTags(tags.concat([t]));
    setTagInput('');
  }

  function removeTag(tag) {
    setTags(tags.filter(function (t) { return t !== tag; }));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    var doc = Object.assign({}, form, { attachments: attachments, tags: tags });
    docsStore.addDocument(doc);
    setForm({ name: '', category: 'Identity', owner: '', expiryDate: '' });
    setAttachments([]);
    setTags([]);
    setFileError('');
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Add Document</h2>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-3">
        <input
          type="text"
          placeholder="Document name"
          value={form.name}
          onChange={function (e) { setForm(Object.assign({}, form, { name: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={form.category}
          onChange={function (e) { setForm(Object.assign({}, form, { category: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {CATEGORIES.map(function (c) { return <option key={c}>{c}</option>; })}
        </select>
        <select
          value={form.owner}
          onChange={function (e) { setForm(Object.assign({}, form, { owner: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Owner (optional)</option>
          {members.map(function (m) { return <option key={m.id} value={m.name}>{m.name}</option>; })}
        </select>
        <input
          type="date"
          value={form.expiryDate}
          onChange={function (e) { setForm(Object.assign({}, form, { expiryDate: e.target.value })); }}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          title="Expiry date (optional)"
        />
        <Button type="submit" className="!bg-sky-600 hover:!bg-sky-700 shadow-sky-200 flex items-center gap-1.5 justify-center">
          <Plus size={15} />
          <span>Add</span>
        </Button>
      </form>

      <div className="mb-3">
        <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 cursor-pointer w-fit">
          <Tag size={13} />
          <span>Tags (optional)</span>
        </label>
        <form onSubmit={handleAddTag} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={function (e) { setTagInput(e.target.value); }}
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </form>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(function (t) {
              return (
                <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700">
                  {t}
                  <button type="button" onClick={function () { removeTag(t); }} className="text-sky-400 hover:text-red-600">
                    <X size={11} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 cursor-pointer w-fit">
          <Paperclip size={13} />
          <span>Attach files (photos or PDFs, multiple allowed, max 2MB each)</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-sky-50 file:text-sky-600 file:text-xs file:font-medium hover:file:bg-sky-100"
        />
        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attachments.map(function (a, i) {
              return (
                <div key={i} className="flex items-center gap-2 bg-sky-50 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-sky-700 font-medium">{a.fileName}</span>
                  <button type="button" onClick={function () { removeAttachment(i); }} className="text-sky-400 hover:text-red-600">
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
