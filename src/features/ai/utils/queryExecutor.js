import { calculateFinanceTotals } from '../../finance/utils/financeCalculations';
import { buildAlerts } from '../../alerts/utils/aggregateAlerts';

export function executeQuery(action, stores) {
  var members = stores.members;
  var financeData = stores.financeData;
  var healthData = stores.healthData;
  var educationData = stores.educationData;
  var documents = stores.documents;

  if (action === 'getSavings') {
    var totals = calculateFinanceTotals(financeData.income, financeData.expenses, financeData.assets, financeData.liabilities);
    var status = totals.savings >= 0 ? 'in savings' : 'in deficit';
    return 'Your family has Rs. ' + Math.abs(totals.savings).toLocaleString('en-IN') + ' ' + status + ' (Income: Rs. ' + totals.totalIncome.toLocaleString('en-IN') + ', Expenses: Rs. ' + totals.totalExpense.toLocaleString('en-IN') + ').';
  }

  if (action === 'getUpcomingExams') {
    var examList = [];
    members.forEach(function (m) {
      var edu = educationData[m.id];
      if (edu && edu.exams) {
        edu.exams.forEach(function (ex) {
          if (!ex.date) return;
          var days = Math.round((new Date(ex.date) - new Date(new Date().toDateString())) / 86400000);
          if (days >= 0 && days <= 14) {
            examList.push(m.name + '\'s ' + ex.subject + ' in ' + days + ' day(s)');
          }
        });
      }
    });
    if (examList.length === 0) return 'No exams scheduled in the next 14 days.';
    return 'Upcoming exams: ' + examList.join('; ') + '.';
  }

  if (action === 'getUpcomingAppointments') {
    var apptList = [];
    members.forEach(function (m) {
      var h = healthData[m.id];
      if (h && h.appointments) {
        h.appointments.forEach(function (a) {
          if (!a.date) return;
          var days = Math.round((new Date(a.date) - new Date(new Date().toDateString())) / 86400000);
          if (days >= 0 && days <= 14) {
            apptList.push(m.name + ' with ' + a.doctor + ' in ' + days + ' day(s)');
          }
        });
      }
    });
    if (apptList.length === 0) return 'No appointments scheduled in the next 14 days.';
    return 'Upcoming appointments: ' + apptList.join('; ') + '.';
  }

  if (action === 'getAlerts') {
    var alerts = buildAlerts(members, healthData, educationData, documents, { budget: financeData.budget, expenses: financeData.expenses });
    if (alerts.length === 0) return 'No active alerts. Everything looks under control.';
    var top = alerts.slice(0, 3).map(function (a) { return a.title; });
    return alerts.length + ' active alert(s). Top: ' + top.join('; ') + '.';
  }

  if (action === 'getExpiringDocs') {
    var today = new Date();
    var expiring = documents.filter(function (d) {
      if (!d.expiryDate) return false;
      var days = Math.round((new Date(d.expiryDate) - today) / 86400000);
      return days >= 0 && days <= 30;
    });
    if (expiring.length === 0) return 'No documents expiring in the next 30 days.';
    var names = expiring.map(function (d) { return d.name; });
    return expiring.length + ' document(s) expiring soon: ' + names.join(', ') + '.';
  }

  if (action === 'getMembersList') {
    var names2 = members.map(function (m) { return m.name + ' (' + m.relationship + ')'; });
    return 'Your family has ' + members.length + ' member(s): ' + names2.join(', ') + '.';
  }

  return 'I could not compute an answer for that.';
}
