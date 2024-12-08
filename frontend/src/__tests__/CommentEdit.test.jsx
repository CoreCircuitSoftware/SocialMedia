import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useParams, useNavigate } from "react-router-dom";
import React from "react";
import CommentEdit from "../components/CommentEdit";
import api from "../api";

// Mock the API module
jest.mock("../api");

// Mock `useParams` to simulate route params
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe("CommentEdit", () => {
    const commentID = 123
    global.React = React;

    beforeEach(() => {
        useParams.mockReturnValue({ "commentID": commentID });
        useNavigate.mockImplementation(() => mockNavigate);
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ commentID: "123" });
        jest.mock("react-router-dom", () => ({
            useNavigate: () => mockNavigate,
        }));
    });

    it('Fetches comment', async () => {
        api.get.mockResolvedValue({ data: { "commentContent": "TEST_COMMENT" }});
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
        })
    })

    it('Error fetching comment', async () => {
        const mockError = new Error("Error");
        api.get.mockRejectedValue(mockError);
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
        })
    })

    it('Display comment', async () => {
        api.get.mockResolvedValue({ data: { "commentContent": "TEST_COMMENT" }});
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
            //const inputElement = screen.getByDisplayValue("TEST_COMMENT");
            //expect(inputElement).toBeInTheDocument();
            const inputElement = screen.getByLabelText("Comment content");
            expect(inputElement).toHaveValue("TEST_COMMENT")
        })
    })

    it('Edit comment updates text', async () => {
        api.get.mockResolvedValue({ data: { "commentContent": "TEST_COMMENT" }});
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
            fireEvent.change(screen.getByLabelText("Comment content"), { target: { value: 'New Comment' } });
            expect(screen.getByLabelText("Comment content")).toHaveValue('New Comment');
        })
    })

    it('Go back to comment page', async () => {
        api.get.mockResolvedValue({  data: { commentContent: "TEST_COMMENT", replyTo: "321", post: "555" }});
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)            
        })

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
            expect(mockNavigate).toHaveBeenCalledWith(`/comment/view/321`);
        })
    })

    it('Go back to post page', async () => {
        api.get.mockResolvedValue({  data: { commentContent: "TEST_COMMENT", "replyTo": "", post: "555" }});
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)            
        })

       

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
            expect(mockNavigate).toHaveBeenCalledWith(`/post/view/555`);
        })
    })

    it('Submit', async () => {
        api.get.mockResolvedValue({  data: { commentContent: "TEST_COMMENT", commentID: "123", replyTo: "321", post: "555" }});
        api.patch.mockResolvedValue({ data: {} });
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)            
        })

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
            fireEvent.change(screen.getByLabelText("Comment content"), { target: { value: 'New Comment' } });
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
            expect(api.patch).toHaveBeenCalledWith(`/api/comment/edit/123/`, { commentContent: 'New Comment'});
            expect(mockNavigate).toHaveBeenCalledWith(`/comment/view/321`);
        })
    })

    it('Submit and navigate to post page', async () => {
        api.get.mockResolvedValue({  data: { commentContent: "TEST_COMMENT", commentID: "123", replyTo: "", post: "555" }});
        api.patch.mockResolvedValue({ data: {} });
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)            
        })

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
            fireEvent.change(screen.getByLabelText("Comment content"), { target: { value: 'New Comment' } });
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
            expect(api.patch).toHaveBeenCalledWith(`/api/comment/edit/123/`, { commentContent: 'New Comment'});
            expect(mockNavigate).toHaveBeenCalledWith(`/post/view/555`);
        })
    })

    it('Error submit', async () => {
        api.get.mockResolvedValue({  data: { commentContent: "TEST_COMMENT", commentID: "123", replyTo: "", post: "555" }});
        api.patch.mockRejectedValue({ response: { status: 401 } });
        render(
            <MemoryRouter>
                <CommentEdit/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)            
        })

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/comment/${commentID}/`)
            fireEvent.change(screen.getByLabelText("Comment content"), { target: { value: 'New Comment' } });
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
            expect(api.patch).toHaveBeenCalledWith(`/api/comment/edit/123/`, { commentContent: 'New Comment'});
        })
    })
});
