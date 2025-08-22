interface PostCardProps {
    authorId: string;
    title: string;
    content: string;
    createdAt: string;
    onAuthorClick?: (authorId: string) => void;
}

/**
 * A card component for displaying a single post.
 *
 * @param {string} authorId - The ID of the user who created the post.
 * @param {string} title - The title of the post.
 * @param {string} content - The content of the post.
 * @param {string} createdAt - The date and time when the post was created. This
 *                              is converted to a string using the `toLocaleString`
 *                              method.
 * @param {function} onAuthorClick - An optional function to call when the
 *                                   "By: <authorId>" element is clicked. The
 *                                   function is passed the `authorId` as an argument.
 */
const PostCard: React.FC<PostCardProps> = ({
    authorId,
    title,
    content,
    createdAt,
    onAuthorClick,
}) => {
    const formattedDate = new Date(createdAt).toLocaleString();

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <p className="text-gray-700 mb-4">{content}</p>
            <div className="text-sm text-gray-500">
                By:{" "}
                <span
                    className="text-blue-500 cursor-pointer relative group"
                    onClick={() => onAuthorClick?.(authorId)}
                >
                    {authorId}
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white py-1 px-2 rounded">
                        Show posts from this user
                    </span>
                </span>
            </div>
        </div>
    );
};

export default PostCard;
