/* import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MessageDisplay from "../components/MessageDisplay";
import api from "../api";


// Mock the `useNavigate` hook from React Router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock('../api');

const myProfile = {
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": ""
        }

const mockMessage = {
    "sender": "321",
    "message": "YO"
}

const mockOtherUser = {
    username: "testuser",
    profilePicture: "https://via.placeholder.com/150",
};

const mockOtherUserNoPFP = {
    username: "testuser",
    profilePicture: "",
};

const mockLatestMessage = {
    sender: "456",
    message: "Hello!",
};

const mockProfileData = {
    username: "testuser",
    profilePicture: "https://via.placeholder.com/150",
};


describe("RecsDisplay", () => {
    global.React = React

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render user details correctly", async () => {
        api.get.mockResolvedValueOnce({ data: mockProfileData });

        <MessageDisplay message={mockMessage} myProfileId={myProfile.username} />
        
        await waitFor(() => {
            //expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockMessage.sender}/`);
        });
    });

   
});
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CommentDisplay from "../components/CommentsDisplay";
import api from "../api";

// Mock the API module
jest.mock("../api");

// Mock the `useNavigate` hook from React Router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("MessageDisplay", () => {
    global.React = React
    const mockMessage = {
        sender: "123",
        message: "Hello there!",
    };

    const mockMyProfileId = "789";

    const mockProfileData = {
        username: "testuser",
        profilePicture: "https://via.placeholder.com/150",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch and render profile data for the sender", async () => {
        // Mock API response
        api.get.mockResolvedValueOnce({ data: mockProfileData });

        render(
            <MemoryRouter>
                <CommentDisplay message={mockMessage} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        // Wait for the profile data to load
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockMessage.sender}/`);
        });

        // Check if the username and profile picture are rendered
        await waitFor(() => {
            expect(screen.getByAltText("testuser's Avatar")).toBeInTheDocument();
            expect(screen.getByAltText("testuser's Avatar")).toHaveAttribute("src", mockProfileData.profilePicture);
        });
        
    });

    it("should display the message content", async () => {
        api.get.mockResolvedValueOnce({ data: mockProfileData });
        render(
            <MemoryRouter>
                <CommentDisplay message={mockMessage} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        // Check if the message content is rendered
        await waitFor(() => {
            expect(screen.getByText("Hello there!")).toBeInTheDocument();
        });
        
    });

    it("should apply the correct CSS class for 'me' messages",  () => {
        api.get.mockResolvedValueOnce({ data: {username: "ME", profilePicture: "https://via.placeholder.com/150"}});
        render(
            <MemoryRouter>
                <CommentDisplay message={{ ...mockMessage, sender: mockMyProfileId }} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        const messageBubble = screen.getByTestId("message-bubble");
        expect(messageBubble).toHaveClass("me");
    });

    it("should apply the correct CSS class for 'them' messages", async () => {
        // Mock API response
        api.get.mockResolvedValueOnce({ data: mockProfileData });

        render(
            <MemoryRouter>
                <CommentDisplay message={mockMessage} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        const messageBubble = screen.getByTestId("message-bubble");
        expect(messageBubble).toHaveClass("them");
    });

    it("should navigate to the sender's profile when the avatar is clicked", async () => {
        // Mock API response
        api.get.mockResolvedValueOnce({ data: mockProfileData });

        render(
            <MemoryRouter>
                <CommentDisplay message={mockMessage} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        // Wait for the profile data to load
        await waitFor(() => {
            const avatar = screen.getByAltText("testuser's Avatar");
            fireEvent.click(avatar);
        });

        // Check if the navigation function was called with the correct path
        expect(mockNavigate).toHaveBeenCalledWith("/profile/testuser");
    });

    it("should handle API errors gracefully", async () => {
        // Mock API to reject the request
        api.get.mockRejectedValueOnce(new Error("API Error"));

        render(
            <MemoryRouter>
                <CommentDisplay message={mockMessage} myProfileId={mockMyProfileId} />
            </MemoryRouter>
        );

        // Ensure no crash occurs
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockMessage.sender}/`);
        });

        // Check that the username and avatar are not rendered
        expect(screen.queryByAltText("testuser's Avatar")).not.toBeInTheDocument();
    });
});
