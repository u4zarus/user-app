"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

type LoginForm = {
    email: string;
    password: string;
};

/**
 * The login page component
 *
 * This component is responsible for rendering the login form
 * and handling the login process. The component uses the `useAuth` hook
 * to get the `login` and `loading` states, and the `useForm` hook to
 * handle form validation and submission.
 *
 * The component renders a form with two input fields for the email and
 * password, and a submit button. If the login fails, an error message
 * is displayed above the form. If the login is successful, a success message
 * is displayed, and the user is redirected to the home page.
 *
 * @returns The login page component
 */
const LoginPage = () => {
    const { login, loading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    /**
     * Handles the login form submission
     *
     * If the login fails, an error message is displayed above the form.
     * If the login is successful, a success message is displayed, and the user is
     * redirected to the home page.
     *
     * @param data The login form data
     */
    const onSubmit = async (data: LoginForm) => {
        try {
            await login(data.email, data.password);
            toast.success("Login successful!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Invalid email or password");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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
                            id="email"
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
                            id="password"
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
