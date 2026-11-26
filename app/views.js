// HTML for each page, built from the household state. Every value is escaped
// before it goes into the page. All totals are computed from the transactions
// in state, so the numbers on screen always add up.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const money = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const money0 = (n) =>
  "$" + Math.round(Number(n)).toLocaleString("en-US");

const catName = (state, id) => (state.categories.find((c) => c.id === id) || { name: id }).name;
const catColor = (state, id) => (state.categories.find((c) => c.id === id) || { color: "#666" }).color;

export function totals(state) {
  const income = state.income.reduce((s, i) => s + i.amount, 0);
  const spent = state.transactions.reduce((s, t) => s + t.amount, 0);
  const byCat = {};
  for (const t of state.transactions) byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  return { income, spent, saved: income - spent, byCat };
}

function progressBar(spent, budget, color) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = spent > budget;
  return `<div class="bar"><div class="bar-fill${over ? " over" : ""}" style="width:${pct}%;background:${over ? "#dc2626" : color}"></div></div>
  <div class="bar-label"><span>${money(spent)} of ${money(budget)}</span><span>${pct}%${over ? " — over budget" : ""}</span></div>`;
}

export function dashboard(state) {
  const t = totals(state);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const topCats = state.categories
    .filter((c) => c.id !== "savings")
    .map((c) => ({ ...c, spent: t.byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const upcoming = [...state.bills].sort((a, b) => (a.due < b.due ? -1 : 1)).slice(0, 4);
  return `<h1>November 2026</h1>
<p class="lede">${escape(state.household.name)} — 4 people · all figures in USD, computed from your transactions.</p>
<section class="cards">
  <div class="card"><span class="card-label">Income</span><strong class="card-value">${money0(t.income)}</strong><span class="card-note">2 sources this month</span></div>
  <div class="card"><span class="card-label">Spent</span><strong class="card-value">${money0(t.spent)}</strong><span class="card-note">${state.transactions.length} transactions</span></div>
  <div class="card good"><span class="card-label">Saved</span><strong class="card-value">${money0(t.saved)}</strong><span class="card-note">${Math.round((t.saved / t.income) * 100)}% of income</span></div>
  <div class="card"><span class="card-label">Left to spend</span><strong class="card-value">${money0(t.income - t.spent)}</strong><span class="card-note">until 30 November</span></div>
</section>
<div class="grid2">
  <section class="panel"><h2>Where the money went</h2>
    ${topCats.map((c) => `<div class="cat-row"><span class="dot" style="background:${c.color}"></span><span class="cat-name">${escape(c.name)}</span><span class="cat-amt">${money(c.spent)}</span></div>${progressBar(c.spent, c.budget, c.color)}`).join("")}
    <p><a href="#/budgets">See all budgets &rarr;</a></p>
  </section>
  <section class="panel"><h2>Recent transactions</h2>
    <ul class="tx-list">${recent.map((x) => `<li><span class="tx-desc">${escape(x.desc)}</span><span class="tx-meta">${escape(x.date)} · ${escape(catName(state, x.category))}</span><span class="tx-amt">−${money(x.amount)}</span></li>`).join("")}</ul>
    <p><a href="#/transactions">All transactions &rarr;</a></p>
    <h2>Upcoming bills</h2>
    <ul class="tx-list">${upcoming.map((b) => `<li><span class="tx-desc">${escape(b.name)}</span><span class="tx-meta">due ${escape(b.due)}${b.autopay ? " · autopay" : ""}</span><span class="tx-amt">${money(b.amount)}</span></li>`).join("")}</ul>
  </section>
</div>
<section class="panel"><h2>Savings goals</h2>
  <div class="goals">${state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<div class="goal"><div class="goal-head"><strong>${escape(g.name)}</strong><span>${money0(g.saved)} of ${money0(g.target)} · ${pct}%</span></div><div class="bar"><div class="bar-fill" style="width:${pct}%;background:#0d9488"></div></div><p class="muted">${escape(g.note)}</p></div>`;
  }).join("")}</div>
  <p><a href="#/goals">Manage goals &rarr;</a></p>
</section>`;
}

export function transactions(state, filter) {
  const cats = state.categories.filter((c) => c.id !== "savings");
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (filter.cat) list = list.filter((t) => t.category === filter.cat);
  if (filter.q) list = list.filter((t) => t.desc.toLowerCase().includes(filter.q.toLowerCase()));
  const total = list.reduce((s, t) => s + t.amount, 0);
  return `<h1>Transactions</h1>
<p class="lede">${list.length} transactions · ${money(total)} shown.</p>
<form class="filters" id="tx-filter">
  <label>Category <select name="cat"><option value="">All categories</option>${cats.map((c) => `<option value="${c.id}"${filter.cat === c.id ? " selected" : ""}>${escape(c.name)}</option>`).join("")}</select></label>
  <label>Search <input name="q" type="search" value="${escape(filter.q || "")}" placeholder="e.g. Shell"></label>
  <button type="submit">Filter</button>
  <a class="btn-link" href="#/transactions">Clear</a>
</form>
<table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
<tbody>${list.map((t) => `<tr><td>${escape(t.date)}</td><td>${escape(t.desc)}</td><td><span class="dot" style="background:${catColor(state, t.category)}"></span> ${escape(catName(state, t.category))}</td><td class="num">−${money(t.amount)}</td><td><button type="button" class="del" data-action="del-tx" data-id="${t.id}" aria-label="Delete ${escape(t.desc)}">Delete</button></td></tr>`).join("") || `<tr><td colspan="5">No transactions match this filter.</td></tr>`}</tbody></table>
<h2>Add a transaction</h2>
<form id="tx-add" class="form-grid">
  <label>Description <input name="desc" required maxlength="80" placeholder="e.g. Weekly shop"></label>
  <label>Amount (USD) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>
  <label>Category <select name="category">${cats.map((c) => `<option value="${c.id}">${escape(c.name)}</option>`).join("")}</select></label>
  <label>Date <input name="date" type="date" value="2026-11-26" required></label>
  <button type="submit">Add transaction</button>
</form>`;
}

export function budgets(state) {
  const t = totals(state);
  const categories = state.categories.filter((c) => c.id !== "savings");
  const over = categories.filter((c) => (t.byCat[c.id] || 0) > c.budget);
  return `<h1>Budgets — November 2026</h1>
<p class="lede">Monthly limits per category. ${over.length ? `${over.length} ${over.length === 1 ? "category is" : "categories are"} over budget: ${over.map((c) => escape(c.name)).join(", ")}.` : "All categories are within budget."}</p>
${categories.map((c) => {
    const spent = t.byCat[c.id] || 0;
    const remaining = c.budget - spent;
    return `<section class="panel budget-row"><div class="budget-head"><strong>${escape(c.name)}</strong><span>${money(spent)} of ${money(c.budget)} · ${remaining < 0 ? `${money(-remaining)} over budget` : `${money(remaining)} left`}</span></div>
    ${progressBar(spent, c.budget, c.color)}
    <form class="budget-edit" data-cat="${c.id}"><label>Monthly budget <input name="budget" type="number" min="0" step="1" value="${c.budget}" aria-label="Monthly budget for ${escape(c.name)}"></label> <button type="submit">Save</button></form></section>`;
  }).join("")}
<section class="panel"><h2>Savings target</h2><p>This month's savings target is <strong>${money(state.categories.find((c) => c.id === "savings").budget)}</strong>. So far the household has saved <strong>${money0(t.saved)}</strong> — above target.</p></section>`;
}

export function goals(state) {
  return `<h1>Savings goals</h1>
<p class="lede">Three goals, tracked against real balances. Add money or start a new goal.</p>
<div class="goals">${state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<section class="panel goal"><div class="goal-head"><strong>${escape(g.name)}</strong><span>${money0(g.saved)} of ${money0(g.target)} · ${pct}%</span></div>
    <div class="bar"><div class="bar-fill" style="width:${pct}%;background:#0d9488"></div></div>
    <p class="muted">${escape(g.note)} · ${money0(g.target - g.saved)} to go.</p>
    <div class="goal-actions"><button type="button" data-action="goal-add" data-id="${g.id}" data-amount="50">Add $50</button><button type="button" data-action="goal-add" data-id="${g.id}" data-amount="100">Add $100</button><button type="button" class="del" data-action="goal-del" data-id="${g.id}">Delete goal</button></div></section>`;
  }).join("")}</div>
<h2>Start a new goal</h2>
<form id="goal-add" class="form-grid">
  <label>Goal name <input name="name" required maxlength="60" placeholder="e.g. New sofa"></label>
  <label>Target (USD) <input name="target" type="number" min="1" step="1" required placeholder="1000"></label>
  <label>Saved so far (USD) <input name="saved" type="number" min="0" step="1" value="0"></label>
  <button type="submit">Add goal</button>
</form>`;
}

export function reports(state) {
  const t = totals(state);
  const maxMonth = Math.max(...state.months.map((m) => Math.max(m.income, m.spent)));
  const cats = state.categories
    .filter((c) => c.id !== "savings")
    .map((c) => ({ ...c, spent: t.byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  return `<h1>Reports</h1>
<p class="lede">Six months of income and spending, and this month by category.</p>
<section class="panel"><h2>Income vs spending — last 6 months</h2>
<div class="chart">${state.months.map((m) => `<div class="chart-col"><div class="chart-bars"><div class="chart-bar income" style="height:${Math.round((m.income / maxMonth) * 140)}px" title="Income ${money0(m.income)}"></div><div class="chart-bar spent" style="height:${Math.round((m.spent / maxMonth) * 140)}px" title="Spent ${money0(m.spent)}"></div></div><span class="chart-label">${escape(m.month)}</span><span class="chart-vals">${money0(m.income)} / ${money0(m.spent)}</span></div>`).join("")}</div>
<p class="legend"><span class="swatch income"></span> Income &nbsp; <span class="swatch spent"></span> Spending</p>
<p>Average monthly saving over the last 6 months: <strong>${money0(state.months.reduce((s, m) => s + (m.income - m.spent), 0) / state.months.length)}</strong>.</p></section>
<section class="panel"><h2>November 2026 by category</h2>
${cats.map((c) => `<div class="cat-row"><span class="dot" style="background:${c.color}"></span><span class="cat-name">${escape(c.name)}</span><span class="cat-amt">${money(c.spent)} · ${Math.round((c.spent / t.spent) * 100)}%</span></div>${progressBar(c.spent, Math.max(c.spent, c.budget), c.color)}`).join("")}
<p>Total spent: <strong>${money(t.spent)}</strong> of <strong>${money0(t.income)}</strong> income.</p></section>
<section class="panel"><h2>Income — November 2026</h2>
<ul class="tx-list">${state.income.map((i) => `<li><span class="tx-desc">${escape(i.source)}</span><span class="tx-meta">${escape(i.date)}</span><span class="tx-amt">+${money(i.amount)}</span></li>`).join("")}</ul></section>`;
}

export function missing() {
  return `<h1>Not found</h1><p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
