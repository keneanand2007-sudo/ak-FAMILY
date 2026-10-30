function detectTrend(values) {
  if (values.length < 2) return 'stable';
  var first = values[0];
  var last = values[values.length - 1];
  var diff = last - first;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

export function calculateAcademicScore(memberData) {
  var score = 0;
  var profile = memberData.profile || {};
  var performance = memberData.performance || [];
  var assignments = memberData.assignments || [];
  var exams = memberData.exams || [];

  if (profile.institution) score += 20;

  if (performance.length > 0) {
    var latest = Number(performance[performance.length - 1].percentage);
    score += Math.round((latest / 100) * 40);
  }

  if (assignments.length > 0) {
    var submitted = assignments.filter(function (a) { return a.status === 'Submitted'; }).length;
    var completionRate = submitted / assignments.length;
    score += Math.round(completionRate * 25);
  } else {
    score += 15;
  }

  var today = new Date(new Date().toDateString());
  var overdueExams = exams.filter(function (ex) {
    if (!ex.date) return false;
    var days = Math.round((new Date(ex.date) - today) / 86400000);
    return days >= 0 && days <= 3;
  });
  if (overdueExams.length === 0) score += 15;

  return Math.min(100, score);
}

export function buildEducationInsights(members, educationData) {
  var insights = [];
  var today = new Date(new Date().toDateString());

  members.forEach(function (m) {
    var data = educationData[m.id] || {};
    var profile = data.profile || {};
    var performance = data.performance || [];
    var exams = data.exams || [];
    var assignments = data.assignments || [];

    if (!profile.institution) return;

    if (performance.length >= 2) {
      var points = performance.map(function (p) { return Number(p.percentage); });
      var trend = detectTrend(points);
      if (trend === 'down') {
        insights.push({
          id: 'edu-decline-' + m.id,
          severity: 'important',
          text: m.name + '\'s academic performance is declining (' + points[0] + '% to ' + points[points.length - 1] + '%). Consider extra support.',
        });
      } else if (trend === 'up') {
        insights.push({
          id: 'edu-improve-' + m.id,
          severity: 'good',
          text: m.name + '\'s academic performance is improving (' + points[0] + '% to ' + points[points.length - 1] + '%). Keep it up!',
        });
      }
    }

    exams.forEach(function (ex) {
      if (!ex.date) return;
      var daysLeft = Math.round((new Date(ex.date) - today) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 3) {
        insights.push({
          id: 'edu-examsoon-' + ex.id,
          severity: 'critical',
          text: m.name + ' has ' + ex.subject + ' exam in ' + daysLeft + ' day(s). Time to focus on preparation.',
        });
      }
    });

    var overdueAssignments = assignments.filter(function (a) {
      if (!a.deadline || a.status === 'Submitted') return false;
      return new Date(a.deadline) < today;
    });
    if (overdueAssignments.length > 0) {
      insights.push({
        id: 'edu-overdue-' + m.id,
        severity: 'critical',
        text: m.name + ' has ' + overdueAssignments.length + ' overdue assignment(s).',
      });
    }

    var pendingAssignments = assignments.filter(function (a) { return a.status === 'Pending'; });
    if (pendingAssignments.length >= 3) {
      insights.push({
        id: 'edu-backlog-' + m.id,
        severity: 'important',
        text: m.name + ' has ' + pendingAssignments.length + ' pending assignments building up.',
      });
    }
  });

  var order = { critical: 0, important: 1, good: 2 };
  insights.sort(function (a, b) { return order[a.severity] - order[b.severity]; });

  return insights;
}
