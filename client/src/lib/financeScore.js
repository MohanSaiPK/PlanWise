// Finance scoring utilities reused across pages

export function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

export function safeNumber(num, fallback = 0) {
  return Number.isFinite(num) ? num : fallback;
}

export function getDaysInMonth(year, monthZeroBased) {
  return new Date(year, monthZeroBased + 1, 0).getDate();
}

// Spending speed score at a given date in month using payday day-of-month
export function computeSpendingSpeedScore({
  income,
  expenses,
  paydayDayOfMonth,
  year,
  monthZeroBased,
  dayOfMonth,
}) {
  const totalIncome = Math.max(0, safeNumber(income, 0));
  const totalExpenses = Math.max(0, safeNumber(expenses, 0));
  if (totalIncome <= 0) return 50;
  if (totalExpenses === 0) return 100;

  const daysInMonth = getDaysInMonth(year, monthZeroBased);
  const dom = Math.min(
    Math.max(1, Math.floor(safeNumber(dayOfMonth, 1))),
    daysInMonth
  );
  const pd = Math.min(
    Math.max(1, Math.floor(safeNumber(paydayDayOfMonth, 1))),
    31
  );

  // approximate cycle elapsed percentage by day-of-month alignment
  let t; // 0..1
  if (dom >= pd) {
    t = (dom - pd) / Math.max(1, daysInMonth - pd + 1);
  } else {
    // wrap from previous month payday
    t = (daysInMonth - (pd - dom)) / Math.max(1, daysInMonth - pd + 1);
  }
  t = clamp01(t);

  const s = clamp01(totalExpenses / Math.max(1, totalIncome));

  const overshoot = Math.max(0, s - t);
  const undershoot = Math.max(0, t - s);

  let score = 70 - Math.min(70, (overshoot / 0.3) * 70);
  score += Math.min(20, (undershoot / 0.3) * 20);

  if (t >= 0.95) {
    if (s >= 0.6 && s <= 0.75) score += 5;
    if (s < 0.5) score -= 10;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function computeIncomeExpenseScore({ income, expenses }) {
  const totalIncome = Math.max(0, safeNumber(income, 0));
  const totalExpenses = Math.max(0, safeNumber(expenses, 0));
  if (totalIncome <= 0) return null;
  const s = clamp01(totalExpenses / Math.max(1, totalIncome));
  return Math.round((1 - s) * 100);
}

export function computeFinancialScore({
  goalProgressPct = null,
  spendingSpeedScore = null,
  incomeExpenseScore = null,
  weights = { goal: 0.0, spending: 0.4, ratio: 0.6 },
}) {
  let total = 0;
  let denom = 0;

  if (Number.isFinite(goalProgressPct)) {
    const gp = Math.max(0, Math.min(100, goalProgressPct));
    total += gp * weights.goal;
    denom += weights.goal;
  }

  if (Number.isFinite(spendingSpeedScore)) {
    const ss = Math.max(0, Math.min(100, spendingSpeedScore));
    total += ss * weights.spending;
    denom += weights.spending;
  }

  if (Number.isFinite(incomeExpenseScore)) {
    const ier = Math.max(0, Math.min(100, incomeExpenseScore));
    total += ier * weights.ratio;
    denom += weights.ratio;
  }

  if (denom === 0) return 0;
  return Math.round(total / denom);
}
