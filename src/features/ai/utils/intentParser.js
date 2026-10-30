function findMemberByName(members, text) {
  var lower = text.toLowerCase();
  var found = null;
  members.forEach(function (m) {
    var firstName = m.name.split(' ')[0].toLowerCase();
    if (lower.indexOf(firstName) !== -1) {
      found = m;
    }
  });
  return found;
}

function extractAmount(text) {
  var match = text.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

var EXPENSE_CATEGORIES = ['housing', 'food', 'education', 'healthcare', 'transportation', 'utilities', 'entertainment', 'shopping', 'insurance'];
var BLOOD_GROUPS = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'];

export function parseIntent(text, context) {
  var lower = text.toLowerCase().trim();
  var members = context.members || [];

  if (lower.indexOf('add expense') !== -1 || (lower.indexOf('expense') !== -1 && lower.indexOf('add') !== -1)) {
    var amount = extractAmount(lower);
    var category = 'Other';
    EXPENSE_CATEGORIES.forEach(function (c) {
      if (lower.indexOf(c) !== -1) category = c.charAt(0).toUpperCase() + c.slice(1);
    });
    var member = findMemberByName(members, lower);
    if (amount) {
      return {
        type: 'command',
        action: 'addExpense',
        summary: 'Add Rs. ' + amount + ' expense in ' + category + (member ? ' for ' + member.name : ''),
        payload: { amount: amount, category: category, member: member ? member.name : '', date: new Date().toISOString().slice(0, 10) },
      };
    }
  }

  if (lower.indexOf('add income') !== -1 || (lower.indexOf('income') !== -1 && lower.indexOf('add') !== -1)) {
    var incAmount = extractAmount(lower);
    var member2 = findMemberByName(members, lower);
    if (incAmount) {
      return {
        type: 'command',
        action: 'addIncome',
        summary: 'Add Rs. ' + incAmount + ' income' + (member2 ? ' for ' + member2.name : ''),
        payload: { amount: incAmount, source: 'Other', member: member2 ? member2.name : '', frequency: 'One-time' },
      };
    }
  }

  if (lower.indexOf('blood group') !== -1) {
    var member3 = findMemberByName(members, lower);
    var bg = null;
    BLOOD_GROUPS.forEach(function (b) {
      if (lower.indexOf(b) !== -1) bg = b.toUpperCase();
    });
    if (member3 && bg) {
      return {
        type: 'command',
        action: 'setBloodGroup',
        summary: 'Set ' + member3.name + '\'s blood group to ' + bg,
        payload: { memberId: member3.id, bloodGroup: bg },
      };
    }
  }

  if (lower.indexOf('saving') !== -1 || lower.indexOf('balance') !== -1) {
    return { type: 'query', action: 'getSavings' };
  }

  if (lower.indexOf('exam') !== -1) {
    return { type: 'query', action: 'getUpcomingExams' };
  }

  if (lower.indexOf('appointment') !== -1) {
    return { type: 'query', action: 'getUpcomingAppointments' };
  }

  if (lower.indexOf('alert') !== -1 || lower.indexOf('attention') !== -1) {
    return { type: 'query', action: 'getAlerts' };
  }

  if (lower.indexOf('expir') !== -1) {
    return { type: 'query', action: 'getExpiringDocs' };
  }

  if (lower.indexOf('member') !== -1 && (lower.indexOf('how many') !== -1 || lower.indexOf('list') !== -1)) {
    return { type: 'query', action: 'getMembersList' };
  }

  return { type: 'unknown' };
}
