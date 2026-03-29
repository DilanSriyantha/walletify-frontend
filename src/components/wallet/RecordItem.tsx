import { LoghookRecord } from "@/types/wallet";
import { ArrowDownRight, ArrowUpRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecordItemProps {
  record: LoghookRecord;
  onEdit: (record: LoghookRecord) => void;
  onDelete: (id: string) => void;
}

export function RecordItem({ record, onEdit, onDelete }: RecordItemProps) {
  const isIncome = record.type === "INCOME";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-3 card-shadow">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome ? "bg-income-muted" : "bg-expense-muted"
          }`}
      >
        {isIncome ? (
          <ArrowDownRight className="h-5 w-5 text-income" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-expense" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-card-foreground truncate">{record.description}</p>
        <p className="text-xs text-muted-foreground">
          {record.category} · {new Date(record.date).toLocaleDateString("en-LK", { month: "short", day: "numeric" })}
        </p>
      </div>

      <p className={`font-semibold tabular-nums ${isIncome ? "text-income" : "text-expense"}`}>
        {isIncome ? "+" : "-"}{Math.abs(record.amount).toLocaleString("en-LK")} LKR
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(record)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(record.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
