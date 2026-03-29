import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddLogbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLogbookDialog({ open, onOpenChange }: AddLogbookDialogProps) {
  const { addLogbook } = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addLogbook(name.trim(), description.trim());
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Logbook</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lb-name">Name</Label>
            <Input
              id="lb-name"
              placeholder="e.g. Personal, Business"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lb-desc">Description</Label>
            <Input
              id="lb-desc"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Logbook
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
