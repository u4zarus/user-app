"use client";

type PostFilterProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showAllPosts: () => void;
};

/**
 * A component for filtering posts by a search query.
 *
 * This component renders an input field and a button. The input field
 * is used to enter a search query. When the search query changes, the
 * `setSearchQuery` function is called with the new query. The button
 * is used to reset the search query. When the button is clicked, the
 * `showAllPosts` function is called.
 *
 * @param searchQuery The current search query
 * @param setSearchQuery A function to call when the search query changes
 * @param showAllPosts A function to call when the button is clicked
 */
const PostFilter = ({
    searchQuery,
    setSearchQuery,
    showAllPosts,
}: PostFilterProps) => {
    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 mb-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <button
                onClick={showAllPosts}
                className="w-full py-3 px-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-transform transform hover:scale-105"
            >
                Show All Posts
            </button>
        </div>
    );
};

export default PostFilter;
