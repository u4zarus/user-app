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
