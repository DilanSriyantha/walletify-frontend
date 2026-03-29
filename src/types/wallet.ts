export interface User {
  name: string;
  email: string;
  access_token: string;
};

export interface LogbookRecord {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  category: string;
  date: string;
  logbookId: string;
}

export interface Logbook {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface LogbookSummary {
  logbook: Logbook;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recordCount: number;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  name: string;
  email: string;
  access_token: string;
}

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other Income",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food & Drinks",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Education",
  "Travel",
  "Other Expense",
] as const;

export const LOGBOOK_COLORS = [
  "#4F46E5",
  "#0891B2",
  "#059669",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
  "#2563EB",
] as const;
