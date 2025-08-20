"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
    }) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");
        if (storedAccess && storedRefresh) {
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
        }
    }, []);

    // API calls
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }
            const data = await res.json();

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            router.push("/");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (body: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
    }) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error("Signup failed");
            }
            const data = await res.json();

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            router.push("/");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        if (!refreshToken) return;
        try {
            const res = await fetch(`${API_BASE}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: refreshToken }),
            });

            if (!res.ok) throw new Error("Refresh failed");
            const data = await res.json();
            setAccessToken(data.accessToken);
            localStorage.setItem("accessToken", data.accessToken);
        } catch (err) {
            console.error(err);
            logout();
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                login,
                signup,
                logout,
                refresh,
                isAuthenticated: !!accessToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
