import { useWallet } from "@/context/WalletContext";
import { LogbookCard } from "@/components/wallet/LogbookCard";
import { AddLogbookDialog } from "@/components/wallet/AddLogbookDialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Logbooks = () => {
  const { getAllSummaries } = useWallet();
  const [showAdd, setShowAdd] = useState(false);
  const summaries = getAllSummaries();

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logbooks</h1>
          <p className="text-sm text-muted-foreground">Manage your financial logbooks</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Logbook</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {summaries.map((s) => (
          <LogbookCard key={s.logbook.id} summary={s} />
        ))}
      </div>

      {summaries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No logbooks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first logbook to start tracking</p>
          <Button onClick={() => setShowAdd(true)}>Create Logbook</Button>
        </div>
      )}

      <AddLogbookDialog open={showAdd} onOpenChange={setShowAdd} />
    </div>
  );
};

export default Logbooks;
