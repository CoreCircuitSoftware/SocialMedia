import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FriendsList from "../pages/FriendsList";
import api from "../api";

// Mock API module
jest.mock("../api");

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("MessageListPage", () => {
    const mockNavigate = jest.fn();
    global.React = React
    const mockmyProfile = "undefined"
    beforeEach(() => {
        jest.clearAllMocks();
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    });

    it("should fetch and display my profile", async () => {
        const mockMyProfile = {
            id: "1",
            username: "myprofile",
            profilePicture: "https://via.placeholder.com/150",
        };

        api.get.mockResolvedValueOnce({ data: mockMyProfile });
        api.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter>
                <FriendsList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
        });

    });

    it("should fetch and display conversations", async () => {
        const mockMyProfile = {
            id: "1",
            username: "myprofile",
        };
        const mockConversations = [
            { convo: "123", user: "2" },
            { convo: "456", user: "3" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/message/findconvos/`)) {
                return Promise.resolve({ data: mockConversations });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <FriendsList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
        });
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/message/findconvos/${mockmyProfile}/`);
        });
    });

    it("should display 'No Conversations' message if no conversations exist", async () => {
        const mockMyProfile = {
            id: "1",
            username: "myprofile",
        };

        api.get.mockImplementation((url) => {
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/message/findconvos/`)) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <FriendsList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/message/findconvos/${mockMyProfile.id}/`);
        });

        expect(screen.getByText("No Conversations :(")).toBeInTheDocument();
    });
 
    it("should navigate to login on 401 error for profile", async () => {
        const mockError = { response: { status: 401 } };
        api.get.mockRejectedValueOnce(mockError); // Simulate 401 for profile

        render(
            <MemoryRouter>
                <FriendsList />
            </MemoryRouter>
        );

        // Wait for navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("should navigate to login on 401 error for conversations", async () => {
        const mockMyProfile = {
            id: "1",
            username: "myprofile",
        };
        const mockError = { response: { status: 401 } };

        api.get.mockResolvedValueOnce({ data: mockMyProfile }); // Get my profile
        api.get.mockRejectedValueOnce(mockError); // Simulate 401 for conversations

        render(
            <MemoryRouter>
                <FriendsList />
            </MemoryRouter>
        );

        // Wait for navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });
});

