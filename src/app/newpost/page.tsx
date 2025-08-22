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

const NewPostPage = () => {
    const { accessToken, refresh } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostForm>();
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (data: PostForm) => {
        if (!accessToken) return;
        try {
            await createPost(data, accessToken!, refresh);
            setMessage("Post created successfully");
            toast.success("Post created successfully!");

            router.push("/");
        } catch {
            setMessage("Failed to create post");
            toast.error("Failed to create post");
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
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1">Title</label>
                    <input
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
                    <label className="block mb-1">Content</label>
                    <textarea
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default NewPostPage;
