import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { Logbook, LogbookRecord, LogbookSummary, LOGBOOK_COLORS } from "@/types/wallet";
import { Endpoints } from "@/lib/utils";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  logbooks: Logbook[];
  records: LogbookRecord[];
  addLogbook: (name: string, description: string) => void;
  deleteLogbook: (id: string) => void;
  addRecord: (record: Omit<LogbookRecord, "id">) => void;
  updateRecord: (id: string, record: Partial<Omit<LogbookRecord, "id">>) => void;
  deleteRecord: (id: string) => void;
  getLogbookSummary: (logbookId: string) => LogbookSummary | null;
  getAllSummaries: () => LogbookSummary[];
  getRecordsByLogbook: (logbookId: string) => LogbookRecord[];
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [records, setRecords] = useState<LogbookRecord[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const r of records) {
      const amount = Number(r.amount);
      if (r.type === "INCOME") income += amount;
      else expense += amount;
    }

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [records]);

  const summariesByLogbook = useMemo(() => {
    const map: Record<string, LogbookSummary> = {};

    for (const l of logbooks) {
      if (!map[l.id]) {
        map[l.id] = {
          logbook: l,
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          recordCount: 0,
        };
      }
    }

    for (const r of records) {
      const summary = map[r.logbookId];
      if (!summary) continue;

      const amount = Number(r.amount);

      if (r.type === "INCOME") {
        summary.totalIncome += amount;
        summary.balance += amount;
      }
      else {
        summary.totalExpense += amount;
        summary.balance -= amount;
      }

      summary.recordCount += 1;
    }

    return map;
  }, [logbooks, records]);

  const recordsByLogbook = useMemo(() => {
    const map: Record<string, LogbookRecord[]> = {};

    for (const r of records) {
      if (!map[r.logbookId]) {
        map[r.logbookId] = [];
      }
      map[r.logbookId].push(r);
    }

    for (const key in map) {
      map[key].sort((a, b) => b.date.localeCompare(a.date));
    }

    return map;
  }, [records]);

  useEffect(() => {
    if (!user?.email) return;
    fetchWallet();
  }, [user?.email]);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch(Endpoints.wallet.get(user.email), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const data = await res.json();

      setLogbooks(data.logbooks);
      setRecords(data.logbookRecords);
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, [user?.email, toast]);

  const addLogbook = useCallback(async (name: string, description: string) => {
    const payload = {
      userEmail: user.email,
      name: name,
      description: description,
      color: LOGBOOK_COLORS[logbooks.length % LOGBOOK_COLORS.length],
    };

    try {
      const res = await fetch(Endpoints.logbooks.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const data = await res.json();

      // const newLogbook: Logbook = {
      //   id: generateId(),
      //   name,
      //   description,
      //   color: LOGBOOK_COLORS[logbooks.length % LOGBOOK_COLORS.length],
      //   createdAt: new Date().toISOString().split("T")[0],
      // };

      setLogbooks((prev) => [...prev, data]);

      toast({
        title: "Successful",
        description: "Logbook has been created successfully.",
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, [logbooks.length, user]);

  const deleteLogbook = useCallback(async (id: string) => {
    try {
      const res = await fetch(Endpoints.logbooks.delete(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      setLogbooks((prev) => prev.filter((lb) => lb.id !== id));
      setRecords((prev) => prev.filter((r) => r.logbookId !== id));

      toast({
        title: "Successful",
        description: "Logbook has been deleted successfully.",
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, []);

  const addRecord = useCallback(async (record: Omit<LogbookRecord, "id">) => {
    try {
      const res = await fetch(Endpoints.logbookRecords.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
        credentials: "include"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const data = await res.json();
      if (!data) throw new Error("Invalid response");
      // setRecords((prev) => [...prev, { ...record, id: generateId() }]);
      setRecords((prev) => [...prev, { ...data }]);

      toast({
        title: "Successful",
        description: "Logbook record has been created successfully.",
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<Omit<LogbookRecord, "id">>) => {
    try {
      const res = await fetch(Endpoints.logbookRecords.update(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
        credentials: "include"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const data = await res.json();
      if (!data) throw new Error("Invalid response");
      // setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));

      toast({
        title: "Successful",
        description: "Logbook record has been updated successfully.",
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      const res = await fetch(Endpoints.logbookRecords.delete(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const data = await res.json();
      if (!data) throw new Error("Invalid response");

      setRecords((prev) => prev.filter((r) => r.id !== id));

      toast({
        title: "Successful",
        description: "Logbook record has been deleted successfully.",
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: err.message ?? "Something went wrong.",
      });
    }
  }, []);

  const getRecordsByLogbook = (logbookId: string) => recordsByLogbook[logbookId] || [];

  const getLogbookSummary = (logbookId: string) => summariesByLogbook[logbookId] || null;

  const getAllSummaries = () => Object.values(summariesByLogbook);

  const getTotalBalance = () => totals.balance;
  const getTotalIncome = () => totals.income;
  const getTotalExpense = () => totals.expense;

  return (
    <WalletContext.Provider
      value={{
        logbooks, records, addLogbook, deleteLogbook, addRecord, updateRecord,
        deleteRecord, getLogbookSummary, getAllSummaries, getRecordsByLogbook,
        getTotalBalance, getTotalIncome, getTotalExpense
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
