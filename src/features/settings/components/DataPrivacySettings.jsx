import { Download, Database } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../../health/store';
import { useFinanceStore } from '../../finance/store';
import { useEducationStore } from '../../education/store';
import { useDocumentsStore } from '../../documents/store';
import Button from '../../../components/Button';

export default function DataPrivacySettings() {
  const familyState = useFamilyStore();
  const healthState = useHealthStore();
  const financeState = useFinanceStore();
  const educationState = useEducationStore();
  const documentsState = useDocumentsStore();

  const handleExport = () => {
    const exportData = {
      family: familyState.family,
      members: familyState.members,
      health: healthState.healthData,
      finance: {
        income: financeState.income,
        expenses: financeState.expenses,
        budget: financeState.budget,
        assets: financeState.assets,
        liabilities: financeState.liabilities,
        goals: financeState.goals,
      },
      education: educationState.educationData,
      documents: documentsState.documents,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-os-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database size={17} className="text-slate-600" />
        <h2 className="text-sm font-semibold text-slate-900">Data & Privacy</h2>
      </div>

      <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Export Your Data</p>
          <p className="text-xs text-slate-500">
            Download a structured JSON file with all your family data
          </p>
        </div>
        <Button onClick={handleExport} variant="secondary" className="flex items-center gap-1.5">
          <Download size={15} /> Export
        </Button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Your data currently lives in this browser only. It is not sent to any server.
      </p>
    </div>
  );
}
