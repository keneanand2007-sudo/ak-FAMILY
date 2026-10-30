export function buildFinanceOverview(members, income, expenses, assets, liabilities, goals) {
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalAssets = assets.reduce((sum, a) => sum + Number(a.value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + Number(l.amount || 0), 0);

  const perMember = members.map((m) => {
    const memberIncome = income.filter((i) => i.member === m.name);
    const memberExpense = expenses.filter((e) => e.member === m.name);
    return {
      member: m,
      income: memberIncome.reduce((sum, i) => sum + Number(i.amount || 0), 0),
      expense: memberExpense.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    };
  });

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });

  return {
    totalIncome,
    totalExpense,
    savings: totalIncome - totalExpense,
    totalAssets,
    totalLiabilities,
    perMember,
    categoryTotals,
    goals,
  };
}
