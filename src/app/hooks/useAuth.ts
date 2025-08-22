import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook to access the current user's authentication state and functions.
 *
 * The hook returns the entire context object, which contains the following:
 * - `accessToken`: The current access token, or null if the user is not logged in.
 * - `refreshToken`: The current refresh token, or null if the user is not logged in.
 * - `login`: A function to log the user in with an email and password.
 * - `logout`: A function to log the user out.
 * - `refresh`: A function to refresh the user's access token when it expires.
 * - `isAuthenticated`: A boolean indicating whether the user is currently logged in.
 * - `loading`: A boolean indicating whether the authentication state is currently loading.
 *
 * The hook must only be used within an `AuthProvider` component.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
