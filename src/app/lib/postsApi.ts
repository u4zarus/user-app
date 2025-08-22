const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/**
 * Fetches all posts from the API.
 *
 * @param token The access token to use for authentication.
 * @returns A JSON representation of the posts.
 * @throws If the request fails, throws an Error with a message indicating the status code.
 */
export const getAllPosts = async (token: string) => {
    const res = await fetch(`${API_BASE}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch posts ${res.status}`);
    }
    return res.json();
};

/**
 * Fetches the posts created by a given user.
 *
 * @param userId The id of the user whose posts are to be fetched.
 * @param token The access token to use for authentication.
 * @returns The posts created by the user.
 * @throws An error if the request fails.
 */
export const getUserPosts = async (userId: string, token: string) => {
    const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch user posts ${res.status}`);
    }
    return res.json();
};

/**
 * Creates a new post with the given title and content.
 *
 * @param data The title and content of the post.
 * @param token The access token to use for authorization.
 * @param refresh The function to call when the access token needs to be refreshed.
 * @returns The response from the server.
 */
export const createPost = async (
    data: { title: string; content: string },
    token: string,
    refresh: () => Promise<void>
) => {
    return fetchWithAuth(
        `${API_BASE}/posts`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        },
        token,
        refresh
    );
};

/**
 * Makes a request to the given URL with the given options, but first
 * checks if the request needs authorization. If the request needs
 * authorization, it first checks if there is a valid access token in
 * local storage. If there is, it adds the access token to the request
 * headers. If there is not, it calls the refresh function to get a new
 * access token. If the refresh function fails, it throws an error.
 * If the request is successful, it returns the parsed JSON response.
 * If the request fails, it throws an error.
 * @param url The URL to make the request to.
 * @param options The options to use when making the request.
 * @param token The access token to use for authorization.
 * @param refresh The function to call when the access token needs to be refreshed.
 * @returns The parsed JSON response.
 */
const fetchWithAuth = async (
    url: string,
    options: RequestInit,
    token: string,
    refresh: () => Promise<void>
) => {
    let res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401) {
        await refresh();
        const newToken = localStorage.getItem("accessToken") || "";

        res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${newToken}`,
            },
        });
    }

    if (!res.ok) throw new Error("Request failed");
    return res.json();
};
