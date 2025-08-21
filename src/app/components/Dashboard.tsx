"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllPosts } from "../lib/postsApi";

type Post = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

const Dashboard = () => {
    const { accessToken } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) return;
        setLoading(true);
        const fetchPosts = async () => {
            const data = await getAllPosts(accessToken);
            if (!data) {
                setError("Failed to fetch posts");
                setLoading(false);
                return;
            }
            setPosts(data);
            setLoading(false);
        };

        fetchPosts();
    }, [accessToken]);

    if (!accessToken) {
        return (
            <p className="text-center mt-10">You must log in to view posts.</p>
        );
    }

    if (loading) {
        // spinner
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h1 className="text-2xl font-bold mb-4">All posts</h1>
            {posts.length === 0 && (
                <p className="text-center mt-10">No posts yet.</p>
            )}
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.id} className="border rounded-lg p-4 shadow">
                        <h2 className="text-lg font-semibold">{post.title}</h2>
                        <p className="text-gray-700">{post.content}</p>
                        <p className="text-sm text-gray-400">
                            Created: {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
