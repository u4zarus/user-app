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

describe("AuthProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetItem.mockReturnValue(null);
    });

    /**
     * Renders the AuthProvider component and returns the context value.
     *
     * The function returns the context value, which is the object containing the authentication state and functions.
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
