export function executeCommand(action, payload, stores) {
  if (action === 'addExpense') {
    stores.financeStore.addExpense({
      category: payload.category,
      member: payload.member,
      amount: payload.amount,
      date: payload.date,
    });
    return 'Added Rs. ' + payload.amount + ' expense in ' + payload.category + '.';
  }

  if (action === 'addIncome') {
    stores.financeStore.addIncome({
      source: payload.source,
      member: payload.member,
      amount: payload.amount,
      frequency: payload.frequency,
    });
    return 'Added Rs. ' + payload.amount + ' income.';
  }

  if (action === 'setBloodGroup') {
    var healthStore = stores.healthStore;
    var existing = healthStore.getMemberHealth(payload.memberId);
    var updatedProfile = Object.assign({}, existing.profile, { bloodGroup: payload.bloodGroup });
    healthStore.updateProfile(payload.memberId, updatedProfile);
    return 'Blood group updated.';
  }

  return 'Could not execute that action.';
}
