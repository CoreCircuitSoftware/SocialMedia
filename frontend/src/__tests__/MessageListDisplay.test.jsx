import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MessageListDisplay from "../components/MessageListDisplay";
import api from "../api";


// Mock the `useNavigate` hook from React Router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock('../api');

const mockSlug = {
    myProfile: {
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": ""
        },
    convo: {
        "convo": "1",
        "user": "h"     
    }
  };

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



describe("RecsDisplay", () => {
    global.React = React

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render user details correctly", async () => {
        api.get.mockImplementation((url) => {
            if (url === `/api/message/latest/${mockSlug.convo.convo}/`) {
                return Promise.resolve({ data: mockLatestMessage });
            }
            if (url === `/api/profile/getuserdata2/${mockSlug.convo.user}/`) {
                return Promise.resolve({ data: mockOtherUser });
            }
            return Promise.reject(new Error("Unknown API call"));
        });

        render(
            <MemoryRouter>
                <MessageListDisplay convo={mockSlug.convo} myProfile={mockSlug.myProfile} />
            </MemoryRouter>
        );

        expect(api.get).toHaveBeenCalledWith(`/api/message/latest/${mockSlug.convo.convo}/`);
        expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockSlug.convo.user}/`);

        await waitFor(() => {
            expect(screen.getByAltText("profile")).toHaveAttribute("src", mockOtherUser.profilePicture);
        });
        
    });

    it("other user no pfp", async () => {
        api.get.mockImplementation((url) => {
            if (url === `/api/message/latest/${mockSlug.convo.convo}/`) {
                return Promise.resolve({ data: mockLatestMessage });
            }
            if (url === `/api/profile/getuserdata2/${mockSlug.convo.user}/`) {
                return Promise.resolve({ data: mockOtherUserNoPFP });
            }
            return Promise.reject(new Error("Unknown API call"));
        });

        render(
            <MemoryRouter>
                <MessageListDisplay convo={mockSlug.convo} myProfile={mockSlug.myProfile} />
            </MemoryRouter>
        );

        expect(api.get).toHaveBeenCalledWith(`/api/message/latest/${mockSlug.convo.convo}/`);
        expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockSlug.convo.user}/`);

        await waitFor(() => {
            expect(screen.getByAltText("profile")).toHaveAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
        });
        
    });

    it("should display 'You said' for messages sent by the user", async () => {
        // Mock API responses
        api.get.mockImplementation((url) => {
            if (url === `/api/message/latest/${mockSlug.convo.convo}/`) {
                return Promise.resolve({ data: { sender: mockSlug.myProfile.id, message: "Hi there!" }});
            }
            if (url === `/api/profile/getuserdata2/${mockSlug.convo.user}/`) {
                return Promise.resolve({ data: mockOtherUser });
            }
            return Promise.reject(new Error("Unknown API call"));
        });

        render(
            <MemoryRouter>
                <MessageListDisplay convo={mockSlug.convo} myProfile={mockSlug.myProfile} />
            </MemoryRouter>
        );

        // Wait for API calls to resolve
        await waitFor(() => {
            expect(screen.getByText("You said:")).toBeInTheDocument();
        });
    });
});
