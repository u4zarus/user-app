"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllPosts, getUserPosts } from "../lib/postsApi";
import Spinner from "./Spinner";
import PostCard from "./PostCard";

type Post = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    createdAt: string;
};

const Dashboard = () => {
    const { accessToken } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!accessToken) return;
        setLoading(true);

        const fetchPosts = async () => {
            try {
                const data = await getAllPosts(accessToken);
                if (!data) {
                    setError("Failed to fetch posts");
                    setLoading(false);
                    return;
                }

                const sortedPosts = data.sort(
                    (a: Post, b: Post) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                setOriginalPosts(sortedPosts);
                setPosts(sortedPosts);
                setLoading(false);
            } catch {
                setError("Failed to fetch posts");
                setLoading(false);
            }
        };

        fetchPosts();
    }, [accessToken]);

    useEffect(() => {
        const filteredPosts = originalPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPosts(filteredPosts);
    }, [searchQuery, originalPosts]);

    const handleAuthorClick = async (authorId: string) => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getUserPosts(authorId, accessToken);
            const sorted = data.sort(
                (a: Post, b: Post) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
            setPosts(sorted);
        } catch {
            setError("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    const handleShowAllPosts = () => {
        setPosts(originalPosts);
        setSearchQuery("");
    };

    if (!accessToken) {
        return (
            <p className="text-center mt-10">You must log in to view posts.</p>
        );
    }

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h1 className="text-2xl font-bold mb-4">All posts</h1>
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <button
                onClick={handleShowAllPosts}
                className="mb-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            >
                Show All Posts
            </button>
            {posts.length === 0 && (
                <p className="text-center mt-10">No posts yet.</p>
            )}
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        authorId={post.authorId}
                        title={post.title}
                        content={post.content}
                        createdAt={post.createdAt}
                        onAuthorClick={handleAuthorClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
