"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { getAllPosts, getUserPosts } from "../lib/postsApi";

export type Post = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    createdAt: string;
};

/**
 * Provides functions for fetching and manipulating the posts state.
 *
 * The hook will fetch all posts when called with a valid access token.
 * If the user is not logged in (i.e. the token is null), the hook will do nothing.
 *
 * @param accessToken The access token to use for authentication
 * @returns An object containing the posts state, loading state, and the following functions:
 *          - `fetchAllPosts`: Fetches all posts from the API and sets them in state.
 *          - `fetchUserPosts`: Fetches the posts created by a given user and sets them in state.
 *          - `showAllPosts`: Resets the posts state to the original posts (i.e. all posts) and displays a toast message
 *          - `filterPosts`: Filters the posts by a given search query, and updates the `posts` state.
 */
export const usePosts = (accessToken: string | null) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    /**
     * Fetches all posts from the API and sets them in state.
     *
     * If the user is not logged in, does nothing.
     *
     * @throws If the request fails, throws an Error with a message indicating the status code.
     */
    const fetchAllPosts = async () => {
        if (!accessToken) return;
        setLoading(true);

        try {
            const data = await getAllPosts(accessToken);
            if (!data) throw new Error("Failed to fetch posts");

            const sorted = sortPostsByDate(data);
            setOriginalPosts(sorted);
            setPosts(sorted);
            toast.success("Posts loaded successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Failed to fetch posts");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches the posts created by a given user and sets them in state.
     *
     * If the user is not logged in, does nothing.
     *
     * @param authorId The id of the user whose posts are to be fetched
     */
    const fetchUserPosts = async (authorId: string) => {
        if (!accessToken) return;
        setLoading(true);

        try {
            const data = await getUserPosts(authorId, accessToken);
            const sorted = sortPostsByDate(data);
            setPosts(sorted);
            toast.success("User posts loaded!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Failed to fetch user's posts");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sorts an array of posts in descending order of their creation date.
     * @param posts The array of posts to be sorted
     * @returns A new array with the sorted posts
     */
    const sortPostsByDate = (posts: Post[]) => {
        return [...posts].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    };

    /**
     * Resets the posts state to the original posts (i.e. all posts) and displays a toast message
     */
    const showAllPosts = () => {
        setPosts(originalPosts);
        toast.info("Showing all posts");
    };

    /**
     * Filters the posts by a given search query, and updates the `posts` state.
     * The query is matched against the title and content of each post, case-insensitively.
     * If the query is empty, the function does nothing.
     * @param query The search query to filter the posts with
     */
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
        fetchAllPosts,
        fetchUserPosts,
        showAllPosts,
        filterPosts,
    };
};
