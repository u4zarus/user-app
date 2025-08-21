const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const getAllPosts = async (token: string) => {
    const res = await fetch(`${API_BASE}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }
    return res.json();
};

export const getUserPosts = async (userId: string, token: string) => {
    const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch user posts");
    }
    return res.json();
};

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

export async function fetchWithAuth(
    url: string,
    options: RequestInit,
    token: string,
    refresh: () => Promise<void>
) {
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
}
