"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { createPost } from "../lib/postsApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type PostForm = {
    title: string;
    content: string;
};

/**
 * Page for creating a new post.
 *
 * If the user is not logged in, displays a message prompting them to log in.
 * If the user is logged in, displays a form for creating a new post.
 *
 * The form has fields for the post title and content. The form is validated
 * using React Hook Form.
 *
 * When the form is submitted, the page calls the `createPost` function to
 * create the new post. If the post is created successfully, the page displays
 * a success message and redirects the user to the home page. If the post
 * creation fails, the page displays an error message.
 */
const NewPostPage = () => {
    const { accessToken, refresh } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostForm>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Handles the form submission for creating a new post.
     *
     * If the user is not logged in, does nothing.
     *
     * If the user is logged in, calls the `createPost` function with the
     * form data and access token. If the post is created successfully,
     * displays a success message and redirects the user to the home page.
     * If the post creation fails, displays an error message.
     *
     * @param data The form data
     */
    const onSubmit = async (data: PostForm) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            await createPost(data, accessToken!, refresh);
            toast.success("Post created successfully!");
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Failed to create post");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!accessToken) {
        return (
            <p className="text-center mt-10 text-gray-300">
                You must log in to create a post.
            </p>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">
            <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">
                    Create New Post
                </h1>{" "}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title", {
                                required: "Title is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500"
                            placeholder="Enter the post title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="content"
                            className="block text-sm font-semibold mb-1 text-gray-300"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            {...register("content", {
                                required: "Content is required",
                            })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 placeholder-gray-500 resize-none"
                            rows={6}
                            placeholder="Write your post..."
                        />
                        {errors.content && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.content.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPostPage;
