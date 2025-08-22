"use client";

type PostFilterProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showAllPosts: () => void;
};

const PostFilter = ({
    searchQuery,
    setSearchQuery,
    showAllPosts,
}: PostFilterProps) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <button
                onClick={showAllPosts}
                className="py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            >
                Show All Posts
            </button>
        </div>
    );
};

export default PostFilter;
