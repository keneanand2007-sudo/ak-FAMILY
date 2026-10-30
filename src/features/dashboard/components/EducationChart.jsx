import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useFamilyStore } from '../../family/store';
import { useEducationStore } from '../../education/store';

const LINE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9'];

export default function EducationChart() {
  const { members } = useFamilyStore();
  const { educationData } = useEducationStore();

  const studentsWithData = members.filter((m) => {
    const edu = educationData[m.id];
    return edu && edu.performance && edu.performance.length > 0;
  });

  const maxSemesters = studentsWithData.reduce((max, m) => {
    const len = educationData[m.id].performance.length;
    return len > max ? len : max;
  }, 0);

  const chartData = [];
  for (let i = 0; i < maxSemesters; i++) {
    const point = { semester: 'Sem ' + (i + 1) };
    studentsWithData.forEach((m) => {
      const perf = educationData[m.id].performance[i];
      if (perf) point[m.name] = Number(perf.percentage);
    });
    chartData.push(point);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Academic Performance Trend</h2>
      {studentsWithData.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No academic performance data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {studentsWithData.map((m, i) => (
              <Line
                key={m.id}
                type="monotone"
                dataKey={m.name}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
