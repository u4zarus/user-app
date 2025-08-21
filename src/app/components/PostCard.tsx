interface PostCardProps {
    authorId: string;
    title: string;
    content: string;
    createdAt: string;
    onAuthorClick?: (authorId: string) => void;
}

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
            <div
                className="text-sm text-blue-500 cursor-pointer hover:underline"
                onClick={() => onAuthorClick?.(authorId)}
            >
                By: {authorId}
            </div>
        </div>
    );
};

export default PostCard;
