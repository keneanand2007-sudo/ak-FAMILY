import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useFamilyStore } from '../store';
import { useHealthStore } from '../../health/store';
import { useFinanceStore } from '../../finance/store';
import { useEducationStore } from '../../education/store';
import { useDocumentsStore } from '../../documents/store';
import { usePlacesStore } from '../../places/store';
import { usePermissionsStore } from '../../permissions/store';
import { seedDemoData } from '../../../utils/seedDemoData';
import Button from '../../../components/Button';

export default function CreateFamily({ onFamilyCreated }) {
  var createFamily = useFamilyStore(function (s) { return s.createFamily; });

  var nameState = useState('');
  var name = nameState[0];
  var setName = nameState[1];

  var descriptionState = useState('');
  var description = descriptionState[0];
  var setDescription = descriptionState[1];

  var countryState = useState('India');
  var country = countryState[0];
  var setCountry = countryState[1];

  function handleSubmit(e) {
    e.preventDefault();
    createFamily(name, description, country);
    onFamilyCreated();
  }

  function handleDemoData() {
    useFamilyStore.setState({ family: null, members: [] }, true);
    useHealthStore.setState({ healthData: {} }, true);
    useFinanceStore.setState({ income: [], expenses: [], budget: { total: 0, categories: {} }, assets: [], liabilities: [], goals: [] }, true);
    useEducationStore.setState({ educationData: {} }, true);
    useDocumentsStore.setState({ documents: [] }, true);
    usePlacesStore.setState({ places: [], locationSharing: {} }, true);
    usePermissionsStore.setState({ roles: {}, auditLog: [] }, true);

    seedDemoData({
      familyStore: useFamilyStore,
      healthStore: useHealthStore,
      financeStore: useFinanceStore,
      educationStore: useEducationStore,
      documentsStore: useDocumentsStore,
      placesStore: usePlacesStore,
      permissionsStore: usePermissionsStore,
    });
    onFamilyCreated();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Step 1 of 2</p>
          <h1 className="text-2xl font-bold text-slate-900">Create Your Family</h1>
          <p className="text-slate-500 text-sm mt-1">This becomes your family's secure workspace</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Family Name</label>
              <input
                type="text"
                value={name}
                onChange={function (e) { setName(e.target.value); }}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Kene Family"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={function (e) { setDescription(e.target.value); }}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="A short note about your family workspace"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Primary Country</label>
              <select
                value={country}
                onChange={function (e) { setCountry(e.target.value); }}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-2">
              Continue
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleDemoData}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-sm font-medium transition shadow-sm shadow-violet-200"
          >
            <Sparkles size={15} />
            <span>Try with Demo Family Data</span>
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            Instantly loads a sample family with health, finance, education and document records to explore. Safe to click multiple times - always resets first.
          </p>
        </div>
      </div>
    </div>
  );
}
