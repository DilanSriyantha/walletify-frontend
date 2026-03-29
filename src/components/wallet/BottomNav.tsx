import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Plus, User } from "lucide-react";
import { useState } from "react";
import { AddRecordDialog } from "./AddRecordDialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Logbooks", icon: BookOpen, path: "/logbooks" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    // navigate("/");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card card-shadow md:hidden">
        <div className="flex items-center justify-around py-2">
          {user && navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${active ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {user && <button
            onClick={() => setShowQuickAdd(true)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs text-primary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full wallet-gradient text-primary-foreground -mt-5 shadow-lg">
              <Plus className="h-5 w-5" />
            </div>
            <span>Add</span>
          </button>}

          {/* Account button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin" className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs text-muted-foreground">
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
      <AddRecordDialog open={showQuickAdd} onOpenChange={setShowQuickAdd} />
    </>
  );
}
