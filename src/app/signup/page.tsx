"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

type SignupForm = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

/**
 * Page for signing up a user.
 *
 * If the user is not logged in, displays a form for signing up.
 * The form has fields for the first name, last name, email, and password.
 * The form is validated using React Hook Form.
 *
 * When the form is submitted, the page calls the `signup` function to
 * create the new user. If the user is created successfully, the page
 * displays a success message and redirects the user to the home page.
 * If the user creation fails, the page displays an error message.
 */
const SignUpPage = () => {
    const { signup, loading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>();

    /**
     * Handles the form submission for signing up a user.
     *
     * If the signup fails, an error message is displayed above the form.
     * If the signup is successful, a success message is displayed, and the user is
     * redirected to the home page.
     *
     * @param data The form data
     */
    const onSubmit = async (data: SignupForm) => {
        try {
            await signup(data);
            toast.success("Account created successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Signup failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">
            <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">
                    Sign Up
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* First name */}
                    <div>
                        <label
                            htmlFor="firstname"
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            {...register("firstname", {
                                required: "First name is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500"
                            placeholder="Enter your first name"
                        />
                        {errors.firstname && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.firstname.message}
                            </p>
                        )}
                    </div>

                    {/* Last name */}
                    <div>
                        <label
                            htmlFor="lastname"
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            {...register("lastname", {
                                required: "Last name is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500"
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
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500"
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
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500"
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
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
