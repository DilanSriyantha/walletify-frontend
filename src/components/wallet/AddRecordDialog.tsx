import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { LogbookRecord, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/types/wallet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logbookId?: string;
  editRecord?: LogbookRecord | null;
}

export function AddRecordDialog({ open, onOpenChange, logbookId, editRecord }: AddRecordDialogProps) {
  const { addRecord, updateRecord, logbooks } = useWallet();
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedLogbook, setSelectedLogbook] = useState(logbookId || "");

  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type);
      setAmount(editRecord.amount.toString());
      setDescription(editRecord.description);
      setCategory(editRecord.category);
      setDate(editRecord.date);
      setSelectedLogbook(editRecord.logbookId);
    } else {
      setType("EXPENSE");
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setSelectedLogbook(logbookId || logbooks[0]?.id || "");
    }
  }, [editRecord, open, logbookId, logbooks]);

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim() || !category || !selectedLogbook) return;

    if (editRecord) {
      updateRecord(editRecord.id, {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
        logbookId: selectedLogbook,
      });
    } else {
      addRecord({
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
        logbookId: selectedLogbook,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editRecord ? "Edit Record" : "Add Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => { setType("INCOME"); setCategory(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${type === "INCOME" ? "bg-income text-white shadow-sm" : "text-muted-foreground"
                }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => { setType("EXPENSE"); setCategory(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${type === "EXPENSE" ? "bg-expense text-white shadow-sm" : "text-muted-foreground"
                }`}
            >
              Expense
            </button>
          </div>

          {!logbookId && (
            <div className="space-y-2">
              <Label>Logbook</Label>
              <Select value={selectedLogbook} onValueChange={setSelectedLogbook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select logbook" />
                </SelectTrigger>
                <SelectContent>
                  {logbooks.map((lb) => (
                    <SelectItem key={lb.id} value={lb.id}>
                      {lb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rec-amount">Amount (LKR)</Label>
            <Input
              id="rec-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-desc">Description</Label>
            <Input
              id="rec-desc"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-date">Date</Label>
            <Input
              id="rec-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {editRecord ? "Save Changes" : "Add Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
