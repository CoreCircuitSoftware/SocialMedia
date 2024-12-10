import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CommentDisplay from "../components/CommentsDisplay";
import api from "../api";

// Mock `useNavigate`
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("../api");

describe("CommentDisplay", () => {
    const mockNavigate = jest.fn();
    global.React = React

    beforeEach(() => {
        jest.clearAllMocks();
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    });

    const mockComment = {
        commentID: "1",
        user: "testuser",
        commentContent: "This is a test comment",
        commentDate: "2024-12-07T12:00:00Z",
        editDate: "2024-12-07T12:30:00Z",
        hasEdit: true,
        replyTo: null,
    };

    const mockUser = {
        id: "1",
        username: "testuser",
        displayName: "Test User",
        profilePicture: "https://via.placeholder.com/150",
    };

    const mockVotes = [
        { vote: true },
        { vote: false },
        { vote: true },
    ];

    it("should render the comment and user details", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser
        api.get.mockResolvedValueOnce({ data: mockVotes }); // getVoteTotals
        api.get.mockResolvedValueOnce({ data: { vote: -1 } }); // getVote

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for user data to load
        await waitFor(() => {
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        });

        // Check if comment content and details are rendered
        expect(screen.getByText("This is a test comment")).toBeInTheDocument();
        expect(screen.getByText("Edited: Dec 7, 2024, 12:30 PM")).toBeInTheDocument();
    });

    it("should handle upvoting a comment", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser
        api.get.mockResolvedValueOnce({ data: mockVotes }); // getVoteTotals
        api.get.mockResolvedValueOnce({ data: { vote: -1 } }); // getVote

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/profile/getuserdata2/${mockComment.user}/`);
        });

        // Simulate upvote
        const upvoteButton = screen.getByText(/Upvote/i);
        fireEvent.click(upvoteButton);

        // Ensure API call is made
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/comment/vote/new/', {
                vote: true,
                comment: mockComment.commentID,
                user: mockUser.id,
            });
        });
    });

    it("should navigate to the comment edit page when the edit button is clicked", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser
        api.get.mockResolvedValueOnce({ data: mockVotes }); // getVoteTotals
        api.get.mockResolvedValueOnce({ data: { vote: 1 } }); // getVote

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        });

        // Click the Edit button
        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);

        // Ensure navigation occurred
        expect(mockNavigate).toHaveBeenCalledWith(`/comment/edit/${mockComment.commentID}`);
    });

    it("should display the correct vote totals", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser
        api.get.mockResolvedValueOnce({ data: mockVotes }); // getVoteTotals

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for votes to load
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`api/comment/vote/gettotal/${mockComment.commentID}/`);
        });

        // Check vote totals
        expect(screen.getByText("1 votes")).toBeInTheDocument(); // 2 upvotes - 1 downvote = 1 total
    });

    it("should display 'No votes yet' if there are no votes", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser
        api.get.mockResolvedValueOnce({ data: [] }); // getVoteTotals

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for votes to load
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`api/comment/vote/gettotal/${mockComment.commentID}/`);
        });

        // Check message
        expect(screen.getByText("No votes yet")).toBeInTheDocument();
    });

    it("should delete the comment when the delete button is clicked", async () => {
        api.get.mockResolvedValueOnce({ data: mockUser }); // getUser

        render(
            <MemoryRouter>
                <CommentDisplay comment={mockComment} />
            </MemoryRouter>
        );

        // Wait for user data to load
        await waitFor(() => {
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        });

        // Click the Delete button
        const deleteButton = screen.getByText(/Delete/i);
        fireEvent.click(deleteButton);

        // Ensure delete API call is made
        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(`/api/comment/delete/${mockComment.commentID}/`);
        });
    });
});
