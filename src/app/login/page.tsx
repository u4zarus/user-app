"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

type LoginForm = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { login, loading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: LoginForm) => {
        setError(null);
        try {
            await login(data.email, data.password);
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                {error && (
                    <p className="text-red-500 test-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {" "}
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
