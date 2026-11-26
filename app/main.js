// HomeBudget: a household budget site on hash routes. The data lives in
// data.js; the household's own changes (new transactions, edited budgets,
// goals) are kept in localStorage under "homebudget-v1", so the site works
// offline and remembers what you did.
//
//   #/                dashboard
//   #/transactions    list, filter, add, delete
//   #/budgets         monthly limits per category, editable
//   #/goals           savings goals, add money, add a goal
//   #/reports         6-month trend + this month by category
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { BILLS, CATEGORIES, GOALS, HOUSEHOLD, INCOME, MONTHS, TRANSACTIONS } from './data.js';
import { budgets, dashboard, goals, missing, reports, transactions } from './views.js';

const KEY = 'homebudget-v1';
const app = document.getElementById('app');

function seed() {
  return {
    household: HOUSEHOLD,
    categories: structuredClone(CATEGORIES),
    income: structuredClone(INCOME),
    transactions: structuredClone(TRANSACTIONS),
    bills: structuredClone(BILLS),
    goals: structuredClone(GOALS),
    months: structuredClone(MONTHS),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const s = JSON.parse(raw);
    if (!Array.isArray(s.transactions) || !Array.isArray(s.categories)) return seed();
    return s;
  } catch {
    return seed();
  }
}

let state = load();
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the site still works for this session.
  }
}

function route() {
  const hash = (location.hash || '#/').split('?')[0];
  const parts = hash.replace(/^#\/?/, '').split('/');
  return { page: parts[0] || '' };
}

function render() {
  window.__shotReady = false;
  const { page } = route();
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  let html;
  let title = 'HomeBudget';
  if (page === '') {
    html = dashboard(state);
    title = 'Dashboard | HomeBudget';
  } else if (page === 'transactions') {
    const filter = { cat: params.get('cat') || '', q: params.get('q') || '' };
    html = transactions(state, filter);
    title = 'Transactions | HomeBudget';
  } else if (page === 'budgets') {
    html = budgets(state);
    title = 'Budgets | HomeBudget';
  } else if (page === 'goals') {
    html = goals(state);
    title = 'Savings goals | HomeBudget';
  } else if (page === 'reports') {
    html = reports(state);
    title = 'Reports | HomeBudget';
  } else {
    html = missing();
    title = 'Not found | HomeBudget';
  }
  document.title = title;
  app.innerHTML = html;
  const nav = document.querySelectorAll('nav a');
  nav.forEach((a) => {
    const href = a.getAttribute('href');
    const p = href.replace(/^#\/?/, '').split('/')[0];
    a.classList.toggle('active', p === page);
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Add transaction (form on the Transactions page).
app.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.id === 'tx-add') {
    e.preventDefault();
    const d = new FormData(form);
    const amount = Number(d.get('amount'));
    if (!d.get('desc') || !(amount > 0)) return;
    state.transactions.push({
      id: `t-${Date.now()}`,
      date: d.get('date') || '2026-11-26',
      desc: String(d.get('desc')).trim(),
      category: String(d.get('category')),
      amount: Math.round(amount * 100) / 100,
    });
    save();
    location.hash = '#/transactions';
    render();
  } else if (form.id === 'tx-filter') {
    e.preventDefault();
    const d = new FormData(form);
    const q = new URLSearchParams();
    if (d.get('cat')) q.set('cat', d.get('cat'));
    if (d.get('q')) q.set('q', d.get('q'));
    const qs = q.toString();
    location.hash = '#/transactions' + (qs ? `?${qs}` : '');
    render();
  } else if (form.id === 'goal-add') {
    e.preventDefault();
    const d = new FormData(form);
    const target = Number(d.get('target'));
    if (!d.get('name') || !(target > 0)) return;
    state.goals.push({
      id: `g-${Date.now()}`,
      name: String(d.get('name')).trim(),
      target,
      saved: Math.max(0, Number(d.get('saved') || 0)),
      note: 'Added today',
    });
    save();
    render();
  } else if (form.classList.contains('budget-edit')) {
    e.preventDefault();
    const d = new FormData(form);
    const cat = state.categories.find((c) => c.id === form.dataset.cat);
    const v = Number(d.get('budget'));
    if (cat && v >= 0) {
      cat.budget = Math.round(v);
      save();
      render();
    }
  }
});

// Buttons: delete a transaction, add money to a goal, delete a goal.
app.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'del-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== id);
    save();
    render();
  } else if (action === 'goal-add') {
    const g = state.goals.find((x) => x.id === id);
    if (g) {
      g.saved = Math.min(g.target, g.saved + Number(btn.dataset.amount || 0));
      save();
      render();
    }
  } else if (action === 'goal-del') {
    state.goals = state.goals.filter((g) => g.id !== id);
    save();
    render();
  }
});

document.getElementById('reset-demo').addEventListener('click', () => {
  localStorage.removeItem(KEY);
  state = seed();
  save();
  render();
});

window.addEventListener('hashchange', render);
render();
