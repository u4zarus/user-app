"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

type SignupForm = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

const SignUpPage = () => {
    const { signup, loading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: SignupForm) => {
        setError(null);
        try {
            await signup(data);
        } catch (error) {
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* First name */}
                    <div>
                        <label
                            htmlFor="firstname"
                            className="block text-sm font-medium mb-1"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            {...register("firstname", {
                                required: "First name is required",
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your first name"
                        />
                        {errors.firstname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstname.message}
                            </p>
                        )}
                    </div>

                    {/* Last name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            {...register("lastname", {
                                required: "Last name is required",
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your last name"
                        />
                        {errors.lastname && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.lastname.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                        <label className="block text-sm font-medium mb-1">
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
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
