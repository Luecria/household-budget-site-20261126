// HomeBudget seed data: one household, November 2026. All figures are real
// within the demo: the dashboard, budgets and reports are computed from these
// transactions, so every total on the site adds up. Amounts are USD.
export const HOUSEHOLD = {
  name: "The Alvarez Household",
  month: "November 2026",
  members: 4,
  currency: "USD",
};

export const CATEGORIES = [
  { id: "housing", name: "Housing", budget: 1650, color: "#2563eb" },
  { id: "groceries", name: "Groceries", budget: 720, color: "#16a34a" },
  { id: "transport", name: "Transport", budget: 380, color: "#d97706" },
  { id: "utilities", name: "Utilities", budget: 290, color: "#0891b2" },
  { id: "dining", name: "Dining out", budget: 240, color: "#db2777" },
  { id: "entertainment", name: "Entertainment", budget: 150, color: "#7c3aed" },
  { id: "health", name: "Health", budget: 220, color: "#dc2626" },
  { id: "kids", name: "Kids", budget: 310, color: "#65a30d" },
  { id: "shopping", name: "Shopping", budget: 180, color: "#4f46e5" },
  { id: "savings", name: "Savings", budget: 900, color: "#0d9488" },
];

export const INCOME = [
  { id: "inc-1", date: "2026-11-01", source: "Salary — Maya Alvarez", amount: 4850 },
  { id: "inc-2", date: "2026-11-15", source: "Freelance design — Daniel Alvarez", amount: 1000 },
];

// 29 spending transactions, November 2026. Totals by category are computed
// from this list, so the site never shows a number it cannot explain.
export const TRANSACTIONS = [
  { id: "t-01", date: "2026-11-01", desc: "Monthly rent", category: "housing", amount: 1650.0 },
  { id: "t-02", date: "2026-11-02", desc: "Whole Foods Market", category: "groceries", amount: 142.3 },
  { id: "t-03", date: "2026-11-03", desc: "Shell — fuel", category: "transport", amount: 48.2 },
  { id: "t-04", date: "2026-11-04", desc: "Electric bill — City Power", category: "utilities", amount: 112.4 },
  { id: "t-05", date: "2026-11-05", desc: "Luigi's Pizzeria", category: "dining", amount: 34.5 },
  { id: "t-06", date: "2026-11-06", desc: "Trader Joe's", category: "groceries", amount: 96.45 },
  { id: "t-07", date: "2026-11-07", desc: "Metro monthly pass", category: "transport", amount: 96.0 },
  { id: "t-08", date: "2026-11-08", desc: "CVS Pharmacy", category: "health", amount: 42.3 },
  { id: "t-09", date: "2026-11-09", desc: "Movie night — Regal Cinemas", category: "entertainment", amount: 28.0 },
  { id: "t-10", date: "2026-11-10", desc: "Safeway", category: "groceries", amount: 128.9 },
  { id: "t-11", date: "2026-11-11", desc: "Water bill — City Water", category: "utilities", amount: 48.9 },
  { id: "t-12", date: "2026-11-12", desc: "Sushi House", category: "dining", amount: 42.1 },
  { id: "t-13", date: "2026-11-13", desc: "School supplies — Target", category: "kids", amount: 68.4 },
  { id: "t-14", date: "2026-11-14", desc: "Shell — fuel", category: "transport", amount: 52.1 },
  { id: "t-15", date: "2026-11-15", desc: "Streaming — Netflix + Spotify", category: "entertainment", amount: 15.99 },
  { id: "t-16", date: "2026-11-16", desc: "Internet — FiberNet", category: "utilities", amount: 79.99 },
  { id: "t-17", date: "2026-11-17", desc: "Gym membership — FitLife", category: "health", amount: 39.0 },
  { id: "t-18", date: "2026-11-18", desc: "Whole Foods Market", category: "groceries", amount: 154.6 },
  { id: "t-19", date: "2026-11-19", desc: "Soccer club fees — Leo", category: "kids", amount: 75.0 },
  { id: "t-20", date: "2026-11-20", desc: "Concert tickets — The Lumineers", category: "entertainment", amount: 85.0 },
  { id: "t-21", date: "2026-11-21", desc: "Phone bill — T-Mobile", category: "utilities", amount: 65.0 },
  { id: "t-22", date: "2026-11-22", desc: "Trader Joe's", category: "groceries", amount: 76.35 },
  { id: "t-23", date: "2026-11-23", desc: "Dentist — Dr. Patel", category: "health", amount: 120.0 },
  { id: "t-24", date: "2026-11-24", desc: "Kids' books — Bookshop", category: "kids", amount: 45.2 },
  { id: "t-25", date: "2026-11-25", desc: "Safeway", category: "groceries", amount: 110.15 },
  { id: "t-26", date: "2026-11-25", desc: "Parking — downtown garage", category: "transport", amount: 18.0 },
  { id: "t-27", date: "2026-11-26", desc: "Clothes — H&M", category: "shopping", amount: 89.99 },
  { id: "t-28", date: "2026-11-26", desc: "Shell — fuel", category: "transport", amount: 44.75 },
  { id: "t-29", date: "2026-11-26", desc: "Household goods — Target", category: "shopping", amount: 54.2 },
];

export const BILLS = [
  { id: "b-1", name: "Rent", due: "2026-12-01", amount: 1650.0, autopay: true },
  { id: "b-2", name: "Electric — City Power", due: "2026-12-05", amount: 112.0, autopay: true },
  { id: "b-3", name: "Internet — FiberNet", due: "2026-12-08", amount: 79.99, autopay: true },
  { id: "b-4", name: "Car insurance — Geico", due: "2026-12-12", amount: 145.0, autopay: false },
  { id: "b-5", name: "Gym — FitLife", due: "2026-12-15", amount: 39.0, autopay: true },
  { id: "b-6", name: "Phone — T-Mobile", due: "2026-12-20", amount: 65.0, autopay: true },
];

export const GOALS = [
  { id: "g-1", name: "Emergency fund", target: 12000, saved: 8400, note: "6 months of expenses" },
  { id: "g-2", name: "Family vacation — Bali", target: 2500, saved: 1150, note: "Flights + hotel, July 2027" },
  { id: "g-3", name: "New car", target: 8000, saved: 2300, note: "Down payment" },
];

// Six-month trend for the Reports view (income and spending per month).
export const MONTHS = [
  { month: "Jun 2026", income: 5750, spent: 3720 },
  { month: "Jul 2026", income: 5850, spent: 3980 },
  { month: "Aug 2026", income: 5750, spent: 3610 },
  { month: "Sep 2026", income: 5950, spent: 3840 },
  { month: "Oct 2026", income: 5850, spent: 3910 },
  { month: "Nov 2026", income: 5850, spent: 3663.77 },
];
