"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const navLinkClass = "text-gray-300 hover:text-white px-3";

const Navbar = () => {
    const { accessToken, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
    };

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link className="text-2xl font-bold text-white" href="/">
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
                            className={`${navLinkClass} cursor-pointer`}
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
        </nav>
    );
};

export default Navbar;
