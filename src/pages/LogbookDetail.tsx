import { useParams, useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { RecordItem } from "@/components/wallet/RecordItem";
import { AddRecordDialog } from "@/components/wallet/AddRecordDialog";
import { useState } from "react";
import { LogbookRecord } from "@/types/wallet";
import { ArrowLeft, Plus, Trash2, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LogbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLogbookSummary, getRecordsByLogbook, deleteRecord, deleteLogbook } = useWallet();

  const [showAdd, setShowAdd] = useState(false);
  const [editRecord, setEditRecord] = useState<LogbookRecord | null>(null);
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const summary = getLogbookSummary(id || "");
  const records = getRecordsByLogbook(id || "");

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Logbook not found</p>
        <Button variant="outline" onClick={() => navigate("/logbooks")}>
          Back to Logbooks
        </Button>
      </div>
    );
  }

  const filteredRecords = filter === "ALL" ? records : records.filter((r) => r.type === filter);
  const { logbook, totalIncome, totalExpense, balance } = summary;

  const handleDeleteLogbook = () => {
    deleteLogbook(logbook.id);
    navigate("/logbooks");
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: logbook.color }}
            >
              {logbook.name.charAt(0)}
            </div>
            <h1 className="text-xl font-bold text-foreground">{logbook.name}</h1>
          </div>
          {logbook.description && (
            <p className="text-sm text-muted-foreground mt-0.5 ml-10">{logbook.description}</p>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{logbook.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this logbook and all its records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLogbook} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-income-muted p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowDownRight className="h-3 w-3 text-income" />
            Income
          </div>
          <p className="font-bold text-income text-lg">{Math.abs(totalIncome).toLocaleString("en-LK")} LKR</p>
        </div>
        <div className="rounded-xl bg-expense-muted p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowUpRight className="h-3 w-3 text-expense" />
            Expense
          </div>
          <p className="font-bold text-expense text-lg">{Math.abs(totalExpense).toLocaleString("en-LK")} LKR</p>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          <div className="text-xs text-muted-foreground mb-1">Balance</div>
          <p className={`font-bold text-lg ${balance >= 0 ? "text-income" : "text-expense"}`}>
            {Math.abs(balance).toLocaleString()} LKR
          </p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-xl bg-secondary p-1 text-sm">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors capitalize ${filter === f ? "bg-card card-shadow text-foreground" : "text-muted-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Records */}
      <div className="space-y-2">
        {filteredRecords.map((r) => (
          <RecordItem
            key={r.id}
            record={r}
            onEdit={(rec) => setEditRecord(rec)}
            onDelete={deleteRecord}
          />
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          {filter === "ALL" ? "No records yet. Add your first one!" : `No ${filter} records.`}
        </p>
      )}

      <AddRecordDialog
        open={showAdd || !!editRecord}
        onOpenChange={(open) => {
          if (!open) { setShowAdd(false); setEditRecord(null); }
        }}
        logbookId={id}
        editRecord={editRecord}
      />
    </div>
  );
};

export default LogbookDetail;
