import { LogbookSummary } from "@/types/wallet";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";

interface LogbookCardProps {
  summary: LogbookSummary;
}

export function LogbookCard({ summary }: LogbookCardProps) {
  const { logbook, totalIncome, totalExpense, balance, recordCount } = summary;

  return (
    <Link
      to={`/logbooks/${logbook.id}`}
      className="block rounded-xl bg-card p-4 card-shadow transition-all hover:card-shadow-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: logbook.color }}
          >
            {logbook.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{logbook.name}</h3>
            <p className="text-xs text-muted-foreground">{recordCount} records</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ArrowDownRight className="h-3 w-3 text-income" />
            <span className="text-xs">Income</span>
          </div>
          <p className="font-semibold text-income">{Math.abs(totalIncome).toLocaleString("en-LK")} LKR</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-expense" />
            <span className="text-xs">Expense</span>
          </div>
          <p className="font-semibold text-expense">{Math.abs(totalExpense).toLocaleString("en-LK")} LKR</p>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Balance</div>
          <p className={`font-semibold ${balance >= 0 ? "text-income" : "text-expense"}`}>
            {Math.abs(balance).toLocaleString()} LKR
          </p>
        </div>
      </div>
    </Link>
  );
}
