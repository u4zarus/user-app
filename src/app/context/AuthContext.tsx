"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

export type AuthContextType = {
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

/**
 * Provides authentication state and functions for logging in, signing up, logging out, and refreshing the access token
 *
 * @param children The JSX elements to be rendered within the AuthProvider
 * @returns The AuthProvider component with the given children
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * Sets the access token and refresh token in state and local storage
     * @param access The new access token
     * @param refresh The new refresh token
     */
    const setTokens = (access: string, refresh: string) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
    };

    /**
     * Checks if a given token is expired or not
     *
     * If the token is invalid, it is considered expired
     *
     * @param token The token to check
     * @returns True if the token is expired, false otherwise
     */
    const isTokenExpired = (token: string) => {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true; // Treat invalid token as expired
        }
    };

    /**
     * Refreshes the access token using the stored refresh token
     *
     * If the refresh fails, logs the user out
     */
    const refresh = useCallback(async () => {
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
    }, [refreshToken]);

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedAccess && storedRefresh) {
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);

            if (isTokenExpired(storedAccess)) {
                if (isTokenExpired(storedRefresh)) {
                    logout();
                } else {
                    refresh().catch(() => {
                        logout();
                    });
                }
            }
        } else {
            logout();
        }
    }, [refresh]);

    /**
     * Logs a user in with the given email and password
     *
     * If the login succeeds, logs the user in and redirects to the home page
     *
     * @param email The email of the user to log in
     * @param password The password of the user to log in
     */
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
            setTokens(data.accessToken, data.refreshToken);
            router.push("/");
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Signs up a user with the given email, password, and name
     *
     * If the signup succeeds, logs the user in and redirects to the home page
     * If the signup fails, logs the error to the console
     * @param body The user's email, password, and first and last name
     */
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
            setTokens(data.accessToken, data.refreshToken);
            router.push("/");
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logs the user out by removing access and refresh tokens from local storage
     * and redirecting to the login page
     */
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
