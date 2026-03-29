import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Endpoints } from "@/lib/utils";
import { SignInRequest, SignUpRequest, User } from "@/types/wallet";
import React, { createContext, useContext, useCallback } from "react";

interface AuthContextType {
    user: User | null;
    signIn: (req: SignInRequest) => Promise<boolean>;
    signUp: (req: SignUpRequest) => Promise<boolean>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useLocalStorage<User | null>("user", null);

    const { toast } = useToast();

    const signIn = useCallback(async (req: SignInRequest) => {
        try {
            const res = await fetch(Endpoints.user.signIn, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
                credentials: "include",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }

            const data = await res.json();
            if (!data) throw new Error("Invalid response");

            setUser(data);

            toast({
                title: "Successful",
                description: "Signed in successfully."
            });
            return true;
        } catch (err) {
            console.log(err);
            toast({
                title: "Error",
                description: err.message ?? "Something went wrong",
            });
            return false;
        }
    }, []);

    const signUp = useCallback(async (req: SignUpRequest) => {
        try {
            const res = await fetch(Endpoints.user.signUp, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
                credentials: "include",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }

            const data = await res.json();
            if (!data) throw new Error("Invalid response");

            setUser(data);

            toast({
                title: "Successful",
                description: "Signed up successfully."
            });
            return true;
        } catch (err) {
            console.log(err);
            toast({
                title: "Error",
                description: err.message ?? "Something went wrong",
            });
            return false;
        }
    }, []);

    const signOut = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
