"use client";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

/**
 * Renders a pagination component with links to the previous and next pages.
 *
 * The component is hidden if there is only one page.
 *
 * The component renders a set of links to the pages in the range of
 * `currentPage - 1` to `currentPage + 2`, with the current page highlighted.
 *
 * The user can navigate to the previous or next page by clicking on the
 * "Previous" or "Next" buttons, respectively.
 *
 * @param {number} currentPage The current page number.
 * @param {number} totalPages The total number of pages.
 * @param {(page: number) => void} onPageChange A callback function to call when the user navigates to a different page.
 * @returns {JSX.Element} The pagination component.
 */
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-6 space-x-2">
            <button
                className="px-4 py-2 rounded-lg bg-gray-800 text-yellow-400 border border-gray-700 hover:border-yellow-400 hover:bg-gray-700 transition disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition ${
                        page === currentPage
                            ? "bg-yellow-400 text-black font-bold"
                            : "bg-gray-800 text-yellow-400 border-gray-700 hover:border-yellow-400 hover:bg-gray-700"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                className="px-4 py-2 rounded-lg bg-gray-800 text-yellow-400 border border-gray-700 hover:border-yellow-400 hover:bg-gray-700 transition disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
