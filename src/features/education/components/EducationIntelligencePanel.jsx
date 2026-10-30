import { Sparkles, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateAcademicScore, buildEducationInsights } from '../utils/educationIntelligence';

var SEVERITY_STYLE = {
  critical: { icon: AlertCircle, color: 'bg-red-50 text-red-700 border-red-100' },
  important: { icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  good: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
};

function scoreColor(score) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

export default function EducationIntelligencePanel({ students, educationData }) {
  var insights = buildEducationInsights(students, educationData);

  if (students.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-amber-600" />
          <h2 className="text-sm font-semibold text-slate-900">Academic Scores</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {students.map(function (m) {
            var score = calculateAcademicScore(educationData[m.id] || {});
            return (
              <div key={m.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                <p className="text-sm font-medium text-slate-900">{m.name}</p>
                <span className={'text-lg font-bold ' + scoreColor(score)}>{score}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-amber-600" />
          <h2 className="text-sm font-semibold text-slate-900">Smart Insights</h2>
        </div>
        {insights.length === 0 ? (
          <p className="text-sm text-slate-400">No insights yet - add more academic data to see automated observations here.</p>
        ) : (
          <div className="space-y-2">
            {insights.map(function (ins) {
              var style = SEVERITY_STYLE[ins.severity];
              var Icon = style.icon;
              return (
                <div key={ins.id} className={'flex items-start gap-2 border rounded-xl p-3 ' + style.color}>
                  <Icon size={15} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{ins.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
