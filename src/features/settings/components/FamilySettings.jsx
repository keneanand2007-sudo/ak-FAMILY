import { useState } from 'react';
import { Home, Save, AlertOctagon } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { factoryReset } from '../../../utils/factoryReset';
import Button from '../../../components/Button';

export default function FamilySettings() {
  const { family, members } = useFamilyStore();
  const [name, setName] = useState(family ? family.name : '');
  const [description, setDescription] = useState(family ? family.description : '');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Home size={17} className="text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Family Details</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Family Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" className="flex items-center gap-1.5">
              <Save size={15} /> Save Changes
            </Button>
            {saved && <span className="text-sm text-emerald-600 font-medium">Saved</span>}
          </div>
          <p className="text-xs text-slate-400">
            {members.length} members in this family workspace.
          </p>
        </form>
      </div>

      <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon size={17} className="text-red-600" />
          <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          This clears ALL data across every module (family, health, finance, education, documents, places, permissions) from this browser. This cannot be undone.
        </p>

        {!confirmReset ? (
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Full Factory Reset
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="danger" onClick={factoryReset}>
              Confirm Full Reset
            </Button>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
