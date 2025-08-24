"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";
import PostCard from "./PostCard";
import { usePosts, Post } from "../hooks/usePosts";
import PostFilter from "./PostFilter";
import Pagination from "./Pagination";

const POSTS_PER_PAGE = 10;

/**
 * A dashboard component for viewing and filtering posts.
 *
 * The component renders a list of posts, with pagination and a search bar.
 * The search bar allows the user to search for posts by title or content.
 * The component also renders a button to fetch all posts, and a button to
 * fetch posts by a given user.
 *
 * If the user is not logged in, the component renders a message indicating
 * that the user must log in to view posts.
 *
 * If the component is loading, the component renders a spinner.
 *
 * @returns The dashboard component
 */
const Dashboard = () => {
    const { accessToken } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        return posts.slice(start, start + POSTS_PER_PAGE);
    }, [posts, currentPage]);

    /**
     * Handles page changes by updating the current page state to the given page.
     *
     * If the page is out of range, the function does nothing.
     *
     * @param page The page to go to
     */
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                showAllPosts={() => {
                    showAllPosts();
                    setCurrentPage(1);
                }}
            />

            {paginatedPosts.length === 0 && (
                <p className="text-center mt-10">No posts yet.</p>
            )}

            <div className="space-y-4">
                {paginatedPosts.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        authorId={post.authorId}
                        title={post.title}
                        content={post.content}
                        createdAt={post.createdAt}
                        onAuthorClick={(authorId) => {
                            fetchUserPosts(authorId);
                            setCurrentPage(1);
                        }}
                    />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Dashboard;
