"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
    const { accessToken, logout } = useAuth();

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            className="text-2xl font-bold text-white"
                            href="/"
                        >
                            <span className="font-black">Blog</span>App
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {accessToken && (
                            <Link
                                className="text-gray-300 hover:text-white px-3"
                                href="/newpost"
                            >
                                New Post
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center">
                        {accessToken ? (
                            <button
                                onClick={logout}
                                className="text-gray-300 hover:text-white px-3 cursor-pointer"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    className="text-gray-300 hover:text-white px-3"
                                    href="/login"
                                >
                                    Login
                                </Link>
                                <Link
                                    className="text-gray-300 hover:text-white px-3"
                                    href="/signup"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
