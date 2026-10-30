function calculateAge(dummy) {
  return null;
}

function detectTrend(values) {
  if (values.length < 2) return 'stable';
  const first = values[0];
  const last = values[values.length - 1];
  const diff = last - first;
  const pctChange = first !== 0 ? (diff / Math.abs(first)) * 100 : 0;
  if (pctChange > 5) return 'up';
  if (pctChange < -5) return 'down';
  return 'stable';
}

export function calculateHealthScore(memberData) {
  let score = 0;
  const profile = memberData.profile || {};
  const appointments = memberData.appointments || [];
  const emergencyContacts = memberData.emergencyContacts || [];
  const vaccinations = memberData.vaccinations || [];
  const medications = memberData.medications || [];

  if (profile.bloodGroup) score += 25;
  if (emergencyContacts.length > 0) score += 25;

  const today = new Date(new Date().toDateString());
  const recentAppointment = appointments.some((a) => {
    if (!a.date) return false;
    const apptDate = new Date(a.date);
    const diffDays = Math.round((today - apptDate) / 86400000);
    return diffDays >= -400 && diffDays <= 365;
  });
  if (recentAppointment) score += 20;

  const overdueVaccinations = vaccinations.filter((v) => {
    if (!v.nextDue) return false;
    return new Date(v.nextDue) < today;
  });
  if (vaccinations.length > 0 && overdueVaccinations.length === 0) score += 15;
  else if (vaccinations.length > 0) score += 5;

  if (medications.length === 0 || medications.every((m) => m.dosage)) score += 15;

  return Math.min(100, score);
}

export function buildSmartInsights(members, healthData) {
  const insights = [];
  const today = new Date(new Date().toDateString());

  members.forEach((m) => {
    const data = healthData[m.id] || {};
    const profile = data.profile || {};
    const emergencyContacts = data.emergencyContacts || [];
    const appointments = data.appointments || [];
    const vaccinations = data.vaccinations || [];
    const metrics = data.metrics || [];

    if (emergencyContacts.length === 0) {
      insights.push({
        id: 'ins-noec-' + m.id,
        severity: 'critical',
        text: 'No emergency contact set for ' + m.name + ' - action needed for Emergency Mode to work.',
      });
    }

    if (!profile.bloodGroup) {
      insights.push({
        id: 'ins-nobg-' + m.id,
        severity: 'important',
        text: m.name + '\'s blood group is not recorded yet.',
      });
    }

    const lastAppointment = appointments
      .filter((a) => a.date && new Date(a.date) <= today)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (lastAppointment) {
      const daysSince = Math.round((today - new Date(lastAppointment.date)) / 86400000);
      if (daysSince > 180) {
        insights.push({
          id: 'ins-nocheckup-' + m.id,
          severity: 'important',
          text: m.name + ' has not had a checkup in ' + daysSince + ' days.',
        });
      }
    }

    const overdueVac = vaccinations.filter((v) => v.nextDue && new Date(v.nextDue) < today);
    if (overdueVac.length > 0) {
      insights.push({
        id: 'ins-vacoverdue-' + m.id,
        severity: 'critical',
        text: overdueVac.length + ' overdue vaccination(s) for ' + m.name + '.',
      });
    }

    const metricTypes = Array.from(new Set(metrics.map((mt) => mt.type)));
    metricTypes.forEach((type) => {
      const points = metrics
        .filter((mt) => mt.type === type)
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((mt) => Number(mt.value));

      if (points.length >= 2) {
        const trend = detectTrend(points);
        if (trend !== 'stable') {
          const direction = trend === 'up' ? 'increasing' : 'decreasing';
          const isGoodDirection = (type.indexOf('Weight') === 0 || type.indexOf('Blood Sugar') === 0 || type.indexOf('Blood Pressure') === 0) ? trend === 'down' : trend === 'up';
          insights.push({
            id: 'ins-trend-' + m.id + '-' + type,
            severity: isGoodDirection ? 'good' : 'important',
            text: m.name + '\'s ' + type + ' is ' + direction + ' (' + points[0] + ' to ' + points[points.length - 1] + ').',
          });
        }
      }
    });

    const medications = data.medications || [];
    const times = medications.filter((med) => med.reminderTime).map((med) => med.reminderTime);
    const timeCounts = {};
    times.forEach((t) => {
      timeCounts[t] = (timeCounts[t] || 0) + 1;
    });
    Object.keys(timeCounts).forEach((t) => {
      if (timeCounts[t] > 1) {
        insights.push({
          id: 'ins-medconflict-' + m.id + '-' + t,
          severity: 'important',
          text: m.name + ' has ' + timeCounts[t] + ' medications scheduled at the same time (' + t + ').',
        });
      }
    });
  });

  const order = { critical: 0, important: 1, good: 2 };
  insights.sort((a, b) => order[a.severity] - order[b.severity]);

  return insights;
}

export function buildFamilyReadiness(members, healthData) {
  let ready = 0;
  members.forEach((m) => {
    const data = healthData[m.id] || {};
    const profile = data.profile || {};
    const emergencyContacts = data.emergencyContacts || [];
    if (profile.bloodGroup && emergencyContacts.length > 0) ready++;
  });
  return {
    ready,
    total: members.length,
    percent: members.length > 0 ? Math.round((ready / members.length) * 100) : 0,
  };
}
