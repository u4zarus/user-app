"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { getAllPosts, getUserPosts } from "../lib/postsApi";

export type Post = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    createdAt: string;
};

export const usePosts = (accessToken: string | null) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all posts
    const fetchAllPosts = async () => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getAllPosts(accessToken);
            if (!data) throw new Error("Failed to fetch posts");

            const sorted = sortPostsByDate(data);
            setOriginalPosts(sorted);
            setPosts(sorted);
            toast.success("Posts loaded successfully!");
        } catch (err) {
            setError("Failed to fetch posts");
            toast.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts by author
    const fetchUserPosts = async (authorId: string) => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getUserPosts(authorId, accessToken);
            const sorted = sortPostsByDate(data);
            setPosts(sorted);
            toast.success("User posts loaded!");
        } catch {
            setError("Failed to fetch posts by this author");
            toast.error("Failed to fetch posts by this author");
        } finally {
            setLoading(false);
        }
    };

    // Sort posts by createdAt descending
    const sortPostsByDate = (posts: Post[]) => {
        return [...posts].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    };

    const showAllPosts = () => {
        setPosts(originalPosts);
        toast.info("Showing all posts");
    };

    // Search filtering
    const filterPosts = (query: string) => {
        const filtered = originalPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.content.toLowerCase().includes(query.toLowerCase())
        );
        setPosts(filtered);
    };

    return {
        posts,
        loading,
        error,
        fetchAllPosts,
        fetchUserPosts,
        showAllPosts,
        filterPosts,
    };
};
