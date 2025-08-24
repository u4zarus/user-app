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
            <p className="text-center mt-10">
                You must log in to create a post.
            </p>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-gray-800 shadow rounded">
            <h1 className="text-xl font-bold mb-4">Create New Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        {...register("title", {
                            required: "Title is required",
                        })}
                        className="w-full border p-2 rounded"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-xs">
                            {errors.title.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="content" className="block mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        {...register("content", {
                            required: "Content is required",
                        })}
                        className="w-full border p-2 rounded"
                    />
                    {errors.content && (
                        <p className="text-red-500 text-xs">
                            {errors.content.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Create Post"}
                </button>
            </form>
        </div>
    );
};

export default NewPostPage;
