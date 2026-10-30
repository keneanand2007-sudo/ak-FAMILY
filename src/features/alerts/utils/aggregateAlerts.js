export function buildAlerts(members, healthData, educationData, documents, financeData) {
  var alerts = [];
  var today = new Date(new Date().toDateString());

  members.forEach(function (m) {
    var health = healthData[m.id];
    if (health && health.appointments) {
      health.appointments.forEach(function (appt) {
        if (!appt.date) return;
        var apptDate = new Date(appt.date);
        var diffDays = Math.round((apptDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 14) {
          alerts.push({
            id: 'ALT-appt-' + appt.id,
            type: 'Medical',
            title: m.name + ' has an appointment with ' + appt.doctor,
            date: appt.date,
            daysLeft: diffDays,
            color: 'rose',
          });
        }
      });
    }

    var edu = educationData[m.id];
    if (edu && edu.exams) {
      edu.exams.forEach(function (exam) {
        if (!exam.date) return;
        var examDate = new Date(exam.date);
        var diffDays = Math.round((examDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 14) {
          alerts.push({
            id: 'ALT-exam-' + exam.id,
            type: 'Education',
            title: m.name + ' has ' + exam.subject + ' exam',
            date: exam.date,
            daysLeft: diffDays,
            color: 'amber',
          });
        }
      });
    }
  });

  documents.forEach(function (doc) {
    if (!doc.expiryDate) return;
    var expiry = new Date(doc.expiryDate);
    var diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 30) {
      alerts.push({
        id: 'ALT-doc-' + doc.id,
        type: 'Documents',
        title: doc.name + ' is expiring soon',
        date: doc.expiryDate,
        daysLeft: diffDays,
        color: 'sky',
      });
    }
  });

  if (financeData) {
    var budget = financeData.budget;
    var expenses = financeData.expenses || [];
    if (budget && budget.total > 0) {
      var totalSpent = expenses.reduce(function (sum, e) { return sum + Number(e.amount || 0); }, 0);
      var usedPercent = Math.round((totalSpent / budget.total) * 100);
      if (usedPercent >= 90) {
        alerts.push({
          id: 'ALT-budget-overall',
          type: 'Finance',
          title: 'Family budget is at ' + usedPercent + '% - nearing the limit',
          date: '',
          daysLeft: 0,
          color: 'emerald',
        });
      }

      if (budget.categories) {
        Object.keys(budget.categories).forEach(function (cat) {
          var limit = Number(budget.categories[cat]) || 0;
          if (limit <= 0) return;
          var catExpenses = expenses.filter(function (e) { return e.category === cat; });
          var catSpent = catExpenses.reduce(function (sum, e) { return sum + Number(e.amount || 0); }, 0);
          var catPercent = Math.round((catSpent / limit) * 100);
          if (catPercent >= 90) {
            alerts.push({
              id: 'ALT-budget-' + cat,
              type: 'Finance',
              title: cat + ' budget is at ' + catPercent + '% of limit',
              date: '',
              daysLeft: 1,
              color: 'emerald',
            });
          }
        });
      }
    }
  }

  alerts.sort(function (a, b) { return a.daysLeft - b.daysLeft; });
  return alerts;
}
