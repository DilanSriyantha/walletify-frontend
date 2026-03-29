import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface BalanceOverviewProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export function BalanceOverview({ totalBalance, totalIncome, totalExpense }: BalanceOverviewProps) {
  return (
    <div className="rounded-2xl wallet-gradient p-5 text-primary-foreground">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="h-5 w-5 opacity-80" />
        <span className="text-sm opacity-80">Total Balance</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {Math.abs(totalBalance).toLocaleString("en-LK", { minimumFractionDigits: 2 })} LKR
      </p>
      {totalBalance < 0 && <span className="text-xs opacity-70">deficit</span>}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
          <div className="flex items-center gap-1.5 text-xs opacity-80">
            <TrendingUp className="h-3.5 w-3.5" />
            Income
          </div>
          <p className="mt-1 text-lg font-semibold">{Math.abs(totalIncome).toLocaleString("en-LK")} LKR</p>
        </div>
        <div className="rounded-xl bg-white/15 backdrop-blur-sm p-3">
          <div className="flex items-center gap-1.5 text-xs opacity-80">
            <TrendingDown className="h-3.5 w-3.5" />
            Expenses
          </div>
          <p className="mt-1 text-lg font-semibold">{Math.abs(totalExpense).toLocaleString("en-LK")} LKR</p>
        </div>
      </div>
    </div>
  );
}
