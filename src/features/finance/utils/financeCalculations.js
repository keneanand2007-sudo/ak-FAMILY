export function toPrecise(num) {
  var n = Number(num);
  if (isNaN(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function sumAmounts(items, field) {
  var key = field || 'amount';
  var total = 0;
  items.forEach(function (item) {
    var val = Number(item[key]);
    if (!isNaN(val)) {
      total = toPrecise(total + val);
    }
  });
  return total;
}

export function calculateFinanceTotals(income, expenses, assets, liabilities) {
  var totalIncome = sumAmounts(income, 'amount');
  var totalExpense = sumAmounts(expenses, 'amount');
  var totalAssets = sumAmounts(assets, 'value');
  var totalLiabilities = sumAmounts(liabilities, 'amount');
  var savings = toPrecise(totalIncome - totalExpense);
  var netWorth = toPrecise(totalAssets - totalLiabilities);

  return {
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    savings: savings,
    totalAssets: totalAssets,
    totalLiabilities: totalLiabilities,
    netWorth: netWorth,
  };
}

export function calculateBudgetUsage(budgetTotal, expenses) {
  var totalSpent = sumAmounts(expenses, 'amount');
  var budget = Number(budgetTotal) || 0;
  var usedPercent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 1000) / 10) : 0;
  var remaining = toPrecise(budget - totalSpent);
  return {
    totalSpent: totalSpent,
    budget: budget,
    usedPercent: usedPercent,
    remaining: remaining,
  };
}

export function calculateCategoryBudgetUsage(categoryBudget, expenses, category) {
  var categoryExpenses = expenses.filter(function (e) { return e.category === category; });
  var spent = sumAmounts(categoryExpenses, 'amount');
  var limit = Number(categoryBudget) || 0;
  var usedPercent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 1000) / 10) : 0;
  return {
    spent: spent,
    limit: limit,
    usedPercent: usedPercent,
    remaining: toPrecise(limit - spent),
  };
}

export function calculateGoalProgress(goal) {
  var target = Number(goal.target) || 0;
  var current = Number(goal.current) || 0;
  var percent = target > 0 ? Math.min(100, Math.round((current / target) * 1000) / 10) : 0;
  return {
    target: target,
    current: current,
    percent: percent,
    remaining: toPrecise(target - current),
  };
}

export function calculateMemberFinance(memberName, income, expenses) {
  var memberIncome = income.filter(function (i) { return i.member === memberName; });
  var memberExpenses = expenses.filter(function (e) { return e.member === memberName; });
  var totalIncome = sumAmounts(memberIncome, 'amount');
  var totalExpense = sumAmounts(memberExpenses, 'amount');
  return {
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    savings: toPrecise(totalIncome - totalExpense),
    incomeItems: memberIncome,
    expenseItems: memberExpenses,
  };
}
