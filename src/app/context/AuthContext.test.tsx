import AuthContext from "./AuthContext";
import { AuthProvider } from "./AuthContext";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthContextType } from "./AuthContext";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockGetItem = jest.fn();
Object.defineProperty(window, "localStorage", {
    value: {
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        getItem: mockGetItem,
    },
    writable: true,
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/**
 * Creates a mock JWT token with a given expiration time
 * @param exp The expiration time as a Unix timestamp
 * @returns A mock JWT token in the format of "header.payload.signature"
 */
const createMockToken = (exp: number) => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { exp };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    return `${encodedHeader}.${encodedPayload}.signature`;
};

describe("AuthProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetItem.mockReturnValue(null);
    });

    /**
     * Renders the AuthProvider component with a child component that displays the
     * current authentication state and provides buttons to trigger login, signup, logout, and refresh.
     *
     * The function returns the current value of the AuthContext, which can be used to assert the
     * correctness of the authentication state and functions.
     *
     * @returns The current value of the AuthContext
     */
    const renderAuthProvider = () => {
        let contextValue: AuthContextType | undefined;

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return (
                            <div>
                                <span data-testid="access-token">
                                    {value?.accessToken}
                                </span>
                                <span data-testid="is-authenticated">
                                    {String(value?.isAuthenticated)}
                                </span>
                                <span data-testid="loading">
                                    {String(value?.loading)}
                                </span>
                                <button
                                    onClick={() =>
                                        value?.login(
                                            "test@test.com",
                                            "password"
                                        )
                                    }
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() =>
                                        value?.signup({
                                            email: "test@test.com",
                                            password: "password",
                                            firstname: "John",
                                            lastname: "Doe",
                                        })
                                    }
                                >
                                    Signup
                                </button>
                                <button onClick={() => value?.logout()}>
                                    Logout
                                </button>
                                <button onClick={() => value?.refresh()}>
                                    Refresh
                                </button>
                            </div>
                        );
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );
        return contextValue;
    };

    test("inital state should be unauthenticated and not loading", () => {
        renderAuthProvider();
        expect(screen.getByTestId("access-token").textContent).toBe("");
        expect(screen.getByTestId("is-authenticated").textContent).toBe(
            "false"
        );
        expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    test("login function should handle a successful login", async () => {
        const mockAccessToken = "mock-aceess-token";
        const mockRefreshToken = "mock-refresh-token";
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    accessToken: mockAccessToken,
                    refreshToken: mockRefreshToken,
                }),
        });

        renderAuthProvider();
        const loginButton = screen.getByText("Login");
        await act(async () => {
            loginButton.click();
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `${API_BASE}/auth/login`,
                expect.any(Object)
            );
            expect(mockSetItem).toHaveBeenCalledWith(
                "accessToken",
                mockAccessToken
            );
            expect(mockSetItem).toHaveBeenCalledWith(
                "refreshToken",
                mockRefreshToken
            );
            expect(screen.getByTestId("access-token").textContent).toBe(
                mockAccessToken
            );
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "true"
            );
            expect(mockPush).toHaveBeenCalledWith("/");
            expect(screen.getByTestId("loading").textContent).toBe("false");
        });
    });

    test("login function should handle a failed login", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
        });

        renderAuthProvider();
        const loginButton = screen.getByText("Login");
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        await act(async () => {
            loginButton.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "false"
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                new Error("Login failed")
            );
            expect(screen.getByTestId("loading").textContent).toBe("false");
        });

        consoleErrorSpy.mockRestore();
    });

    test("signup function should handle a successful signup", async () => {
        const mockAccessToken = "new-mock-aceess-token";
        const mockRefreshToken = "new-mock-refresh-token";
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    accessToken: mockAccessToken,
                    refreshToken: mockRefreshToken,
                }),
        });

        renderAuthProvider();
        const signupButton = screen.getByText("Signup");
        await act(async () => {
            signupButton.click();
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `${API_BASE}/auth/signup`,
                expect.any(Object)
            );
            expect(mockSetItem).toHaveBeenCalledWith(
                "accessToken",
                mockAccessToken
            );
            expect(mockSetItem).toHaveBeenCalledWith(
                "refreshToken",
                mockRefreshToken
            );
            expect(screen.getByTestId("access-token").textContent).toBe(
                mockAccessToken
            );
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "true"
            );
            expect(mockPush).toHaveBeenCalledWith("/");
            expect(screen.getByTestId("loading").textContent).toBe("false");
        });
    });

    test("logout function should clear tokens and redirect", async () => {
        mockGetItem.mockReturnValueOnce("existing-access-token");
        mockGetItem.mockReturnValueOnce("existing-refresh-token");

        renderAuthProvider();
        await waitFor(() => {
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "true"
            );
        });

        const logoutButton = screen.getByText("Logout");
        await act(async () => {
            logoutButton.click();
        });

        expect(mockRemoveItem).toHaveBeenCalledWith("accessToken");
        expect(mockRemoveItem).toHaveBeenCalledWith("refreshToken");
        expect(screen.getByTestId("access-token").textContent).toBe("");
        expect(screen.getByTestId("is-authenticated").textContent).toBe(
            "false"
        );
        expect(mockPush).toHaveBeenCalledWith("/login");
    });

    test("refresh function should update token when successful", async () => {
        const expiredToken = createMockToken(
            Math.floor(Date.now() / 1000) - 3600
        );
        const newAccessToken = "refreshed-access-token";
        const existingRefreshToken = "refresh-token-123";

        mockGetItem.mockReturnValueOnce(expiredToken);
        mockGetItem.mockReturnValueOnce(existingRefreshToken);

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ accessToken: newAccessToken }),
        });

        const context = renderAuthProvider();

        await act(async () => {
            if (context) {
                context.refresh();
            }
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `${API_BASE}/auth/refresh-token`,
                expect.objectContaining({
                    body: JSON.stringify({ token: existingRefreshToken }),
                })
            );
            expect(screen.getByTestId("access-token").textContent).toBe(
                newAccessToken
            );
            expect(mockSetItem).toHaveBeenCalledWith(
                "accessToken",
                newAccessToken
            );
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "true"
            );
        });
    });

    test("refresh function should log out user on failure", async () => {
        const expiredToken = createMockToken(
            Math.floor(Date.now() / 1000) - 3600
        );
        const existingRefreshToken = "refresh-token-123";

        mockGetItem.mockReturnValueOnce(expiredToken);
        mockGetItem.mockReturnValueOnce(existingRefreshToken);

        mockFetch.mockResolvedValueOnce({
            ok: false,
        });

        const context = renderAuthProvider();

        await act(async () => {
            if (context) {
                context.refresh();
            }
        });

        await waitFor(() => {
            expect(mockRemoveItem).toHaveBeenCalledWith("accessToken");
            expect(mockRemoveItem).toHaveBeenCalledWith("refreshToken");
            expect(mockPush).toHaveBeenCalledWith("/login");
            expect(screen.getByTestId("is-authenticated").textContent).toBe(
                "false"
            );
        });
    });

    test("isTokenExpired should return true for invalid tokens", async () => {
        const invalidToken = "invalid-token-format";
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        mockGetItem.mockReturnValueOnce(invalidToken);
        mockGetItem.mockReturnValueOnce("valid-refresh-token");

        const context = renderAuthProvider();

        await act(async () => {
            if (context) {
                context.logout();
            }
        });

        await waitFor(() => {
            expect(mockRemoveItem).toHaveBeenCalledTimes(2); // expect both tokens to be removed
            expect(mockRemoveItem).toHaveBeenCalledWith("accessToken");
            expect(mockRemoveItem).toHaveBeenCalledWith("refreshToken");
            expect(mockPush).toHaveBeenCalledWith("/login");
        });

        consoleErrorSpy.mockRestore();
    });
});
