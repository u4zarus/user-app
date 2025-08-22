"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";
import PostCard from "./PostCard";
import { usePosts, Post } from "../hooks/usePosts";
import PostFilter from "./PostFilter";

const Dashboard = () => {
    const { accessToken } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const {
        posts,
        loading,
        fetchAllPosts,
        fetchUserPosts,
        showAllPosts,
        filterPosts,
    } = usePosts(accessToken);

    useEffect(() => {
        fetchAllPosts();
    }, [accessToken]);

    useEffect(() => {
        filterPosts(searchQuery);
    }, [searchQuery]);

    if (!accessToken)
        return (
            <p className="text-center mt-10">You must log in to view posts.</p>
        );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner sizeClass="h-8 w-8" color="text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h1 className="text-2xl font-bold mb-4">All posts</h1>

            <PostFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showAllPosts={showAllPosts}
            />

            {posts.length === 0 && (
                <p className="text-center mt-10">No posts yet.</p>
            )}

            <div className="space-y-4">
                {posts.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        authorId={post.authorId}
                        title={post.title}
                        content={post.content}
                        createdAt={post.createdAt}
                        onAuthorClick={fetchUserPosts}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
