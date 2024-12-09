import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecsDisplay from "../components/RecsDisplay";

// Mock the `useNavigate` hook from React Router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockSingleUser = {
    "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
    "username": "123",
    "email": "123@123.com",
    "displayName": "123",
    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
    "bio": "bio",
    "backgroundColor": "",
    "backgroundImage": ""
}


describe("RecsDisplay", () => {
    global.React = React
    const mockUser = {
        username: "123",
        displayName: "123",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
    };

    it("should render user details correctly", () => {
        render(
            <MemoryRouter>
                <RecsDisplay rec={mockSingleUser} />
            </MemoryRouter>
        );

        // Check if the user's display name and username are rendered
        expect(screen.getByText("123")).toBeInTheDocument();
        expect(screen.getByText("@123")).toBeInTheDocument();

        // Check if the user's profile picture is rendered
        const avatar = screen.getByAltText("123");
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute("src", mockSingleUser.profilePicture);
    });

    it("should navigate to the user's profile when 'View Profile' is clicked", () => {
        render(
            <MemoryRouter>
                <RecsDisplay rec={mockSingleUser} />
            </MemoryRouter>
        );

        // Click the "View Profile" button
        const viewProfileButton = screen.getByText("View Profile");
        fireEvent.click(viewProfileButton);

        // Check if the navigation function was called with the correct path
        expect(mockNavigate).toHaveBeenCalledWith("/profile/123/");
    });
});
