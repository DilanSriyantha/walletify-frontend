import { useWallet } from "@/context/WalletContext";
import { BalanceOverview } from "@/components/wallet/BalanceOverview";
import { LogbookCard } from "@/components/wallet/LogbookCard";
import { RecordItem } from "@/components/wallet/RecordItem";
import { useState } from "react";
import { AddRecordDialog } from "@/components/wallet/AddRecordDialog";
import { LogbookRecord } from "@/types/wallet";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const {
    getTotalBalance, getTotalIncome, getTotalExpense,
    getAllSummaries, records, deleteRecord,
  } = useWallet();

  const [editRecord, setEditRecord] = useState<LogbookRecord | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const summaries = getAllSummaries();
  const recentRecords = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your financial overview</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="hidden md:flex gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Balance Card */}
      <BalanceOverview
        totalBalance={getTotalBalance()}
        totalIncome={getTotalIncome()}
        totalExpense={getTotalExpense()}
      />

      {/* Logbook Summaries */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Logbooks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {summaries.map((s) => (
            <LogbookCard key={s.logbook.id} summary={s} />
          ))}
        </div>
        {summaries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No logbooks yet. Create one to get started!
          </p>
        )}
      </section>

      {/* Recent Records */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Recent Transactions</h2>
        <div className="space-y-2">
          {recentRecords.map((r) => (
            <RecordItem
              key={r.id}
              record={r}
              onEdit={(rec) => setEditRecord(rec)}
              onDelete={deleteRecord}
            />
          ))}
        </div>
        {recentRecords.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet.
          </p>
        )}
      </section>

      <AddRecordDialog
        open={showAdd || !!editRecord}
        onOpenChange={(open) => {
          if (!open) { setShowAdd(false); setEditRecord(null); }
        }}
        editRecord={editRecord}
      />
    </div>
  );
};

export default Dashboard;
