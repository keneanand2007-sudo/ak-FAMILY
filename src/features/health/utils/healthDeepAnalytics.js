import { calculateHealthScore } from './healthIntelligence';

export function buildVaccinationCoverage(members, healthData) {
  var total = 0;
  var upToDate = 0;
  var today = new Date();

  members.forEach(function (m) {
    var data = healthData[m.id];
    if (!data || !data.vaccinations) return;
    data.vaccinations.forEach(function (v) {
      total++;
      var overdue = v.nextDue && new Date(v.nextDue) < today;
      if (!overdue) upToDate++;
    });
  });

  var overdue = total - upToDate;
  return {
    total: total,
    upToDate: upToDate,
    overdue: overdue,
    data: total === 0 ? [{ name: 'No Data', value: 1 }] : [
      { name: 'Up to date', value: upToDate },
      { name: 'Overdue', value: overdue },
    ],
  };
}

export function buildMedicationCountByMember(members, healthData) {
  return members.map(function (m) {
    var data = healthData[m.id];
    var count = data && data.medications ? data.medications.length : 0;
    return { name: m.name.split(' ')[0], count: count };
  });
}

export function buildHealthScoreComparison(members, healthData) {
  return members.map(function (m) {
    var score = calculateHealthScore(healthData[m.id] || {});
    return { name: m.name.split(' ')[0], score: score };
  });
}

export function buildAppointmentTimeline(members, healthData) {
  var monthCounts = {};
  var now = new Date();

  for (var i = -3; i <= 3; i++) {
    var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    var key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthCounts[key] = 0;
  }

  members.forEach(function (m) {
    var data = healthData[m.id];
    if (!data || !data.appointments) return;
    data.appointments.forEach(function (a) {
      if (!a.date) return;
      var apptDate = new Date(a.date);
      var key = apptDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthCounts.hasOwnProperty(key)) {
        monthCounts[key]++;
      }
    });
  });

  return Object.keys(monthCounts).map(function (key) {
    return { month: key, count: monthCounts[key] };
  });
}
