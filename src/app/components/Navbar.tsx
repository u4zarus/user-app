"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const navLinkClass = "text-gray-300 hover:text-white px-3";

/**
 * A navigation bar component for the app.
 *
 * The navbar displays a "New Post" link if the user is logged in, and
 * "Login" and "Signup" links if the user is not logged in. The navbar
 * also contains a logout button if the user is logged in.
 *
 * @returns The navbar component
 */
const Navbar = () => {
    const { accessToken, logout } = useAuth();

    /**
     * Logs the user out of the app and displays a toast message
     * when the logout is successful.
     */
    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md border-b border-gray-700 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    className="text-2xl font-extrabold text-yellow-400 tracking-wide hover:text-yellow-300 transition"
                    href="/"
                >
                    <span className="font-black">Blog</span>App
                </Link>

                {/* Links */}
                <div className="flex items-center space-x-4">
                    {accessToken && (
                        <Link className={navLinkClass} href="/newpost">
                            New Post
                        </Link>
                    )}

                    {accessToken ? (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 hover:shadow-[0_0_8px_#facc15] transition"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link className={navLinkClass} href="/login">
                                Login
                            </Link>
                            <Link className={navLinkClass} href="/signup">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500"></div>
        </nav>
    );
};

export default Navbar;
