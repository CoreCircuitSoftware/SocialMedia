import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import React from 'react';
import api from '../api';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

describe("PostForm", () => {
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    const mockNavigate = jest.fn();
    const mockPost = jest.fn();

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
        api.createPost = mockPost;
    });

    it("Form renders properly", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)

        render(<PostForm />)

        const titleInput = screen.getByPlaceholderText(/Enter Post Title/i);
        const descriptionInput = screen.getByPlaceholderText(/Enter Post Description/i);
        const createButton = screen.getByRole("button", {name: /Submit Post/i});
        const returnButton = screen.getByRole("button", {name: /Go Back/i});
        expect(titleInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
        expect(createButton).toBeInTheDocument();
        expect(returnButton).toBeInTheDocument();
    })

    it("Post created when title and/or description is entered which navigates user to /profile", async () => {
        api.post.mockResolvedValue({ status: 201 });

        render(<PostForm />)

        fireEvent.change(screen.getByPlaceholderText(/Enter Post Title/i), {target: {value: "Test Title"}})
        fireEvent.change(screen.getByPlaceholderText(/Enter Post Description/i), {target: {value: "Test Description"}})
        fireEvent.click(screen.getByRole("button", {name: /Submit Post/i}))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/createpost/', {
                title: "Test Title",
                description: "Test Description"
            });
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        })

    })

    it("Go back button nagivates to home", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)

        render(<PostForm />)

        const returnButton = screen.getByRole("button", {name: /Go Back/i});
        fireEvent.click(returnButton);

        expect(mockNavigate).toHaveBeenCalledWith("/profile");
    })

    it("Error given when no title and description is entered", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)

        render(<PostForm />)

        const createButton = screen.getByRole("button", {name: /Submit Post/i});
        fireEvent.click(createButton);

        const titleError = screen.getByText(/Error: Title required for post/i);
        expect(titleError).toBeInTheDocument();
    })

    it("Error given when no title is entered", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)

        render(<PostForm />)

        const descriptionInput = screen.getByPlaceholderText(/Enter Post Description/i);
        fireEvent.change(descriptionInput, {target: {value: "Test Description"}})
        const createButton = screen.getByRole("button", {name: /Submit Post/i});
        fireEvent.click(createButton);

        const titleError = screen.getByText(/Error: Title required for post/i);
        expect(titleError).toBeInTheDocument();
    })

    it("Descripton updated when text is entered", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
        render(<PostForm />)
        const descriptionInput = screen.getByPlaceholderText(/Enter Post Description/i);
        fireEvent.change(descriptionInput, {target: {value: "Test Description"}})
        expect(descriptionInput.value).toBe("Test Description");
    })

    it("Title updated when text is entered", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
        render(<PostForm />)
        const titleInput = screen.getByPlaceholderText(/Enter Post Title/i);
        fireEvent.change(titleInput, {target: {value: "Test Title"}})
        expect(titleInput.value).toBe("Test Title");
    })

})