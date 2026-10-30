import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AppointmentCalendar({ appointments }) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const apptsByDate = {};
  appointments.forEach((a) => {
    if (!a.date) return;
    apptsByDate[a.date] = apptsByDate[a.date] || [];
    apptsByDate[a.date].push(a);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={goPrev} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <p className="text-sm font-semibold text-slate-900">{MONTH_NAMES[month]} {year}</p>
        <button onClick={goNext} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-xs text-slate-400 font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateStr = year + '-' + pad(month + 1) + '-' + pad(d);
          const dayAppts = apptsByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          return (
            <div
              key={i}
              className={
                dayAppts.length > 0
                  ? 'aspect-square flex flex-col items-center justify-center rounded-lg text-xs bg-rose-50 border border-rose-200 relative'
                  : isToday
                  ? 'aspect-square flex flex-col items-center justify-center rounded-lg text-xs bg-blue-50 border border-blue-200'
                  : 'aspect-square flex flex-col items-center justify-center rounded-lg text-xs text-slate-600 hover:bg-slate-50'
              }
              title={dayAppts.map((a) => a.doctor).join(', ')}
            >
              <span className={dayAppts.length > 0 ? 'font-semibold text-rose-700' : ''}>{d}</span>
              {dayAppts.length > 0 && (
                <span className="w-1 h-1 rounded-full bg-rose-500 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
