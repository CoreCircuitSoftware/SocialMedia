import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import React from 'react';
import api from '../api';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../api');

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedURL");
});

describe("PostForm", () => {
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    beforeEach(() => {
        jest.clearAllMocks();
      })

    it("Form renders correctly", async () => {
        const mockData = { "profile": { "username": "example_user" } };
        api.get.mockResolvedValue({ data: mockData });
        render(
        <MemoryRouter>
            <PostForm />
        </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/profile/');
        })

        expect(screen.getByPlaceholderText("Enter Post Title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter Post Description")).toBeInTheDocument();
        expect(screen.getByText("Upload Image")).toBeInTheDocument();
        expect(screen.getByText("Submit Post")).toBeInTheDocument();
        expect(screen.getByText("Go Back")).toBeInTheDocument();
    });

    it("should navigate to login if user is not authenticated", async () => {
        api.get.mockRejectedValue({ response: { status: 401 } });
    
        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(api.get).toHaveBeenCalledWith("/api/profile/");
          expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
      });

      it("should navigate to 404 if 404", async () => {
        api.get.mockRejectedValue({ response: { status: 404 } });
    
        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(api.get).toHaveBeenCalledWith("/api/profile/");
          expect(mockNavigate).toHaveBeenCalledWith("/404");
        });
      });

      it("Window alert error", async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {}) 
        api.get.mockRejectedValue({ response: { status: 500 } });
        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(api.get).toHaveBeenCalledWith("/api/profile/");
          expect(window.alert).toHaveBeenCalled();
        });
      });

      it("Post Success -> navigate to profile", async () => {
        api.post.mockResolvedValue({});

        render(
        <MemoryRouter>
            <PostForm />
        </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Post Title"), {
            target: { value: "Test Post" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Post Description"), {
            target: { value: "This is a test description." },
        });

        fireEvent.click(screen.getByText("Submit Post"));

        await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
            "/api/createpost/",
            expect.any(FormData),
            expect.objectContaining({
            headers: { "Content-Type": "multipart/form-data" },
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
        });
      });

      it("Post error", async () => {
        api.post.mockRejectedValue({ response: { status: 401 } });

        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Post Title"), {
          target: { value: "Test Post" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Post Description"), {
          target: { value: "This is a test description." },
        });

        fireEvent.click(screen.getByText("Submit Post"));

        await waitFor(() => {
          expect(api.post).toHaveBeenCalledWith(
            "/api/createpost/",
            expect.any(FormData),
            expect.objectContaining({
              headers: { "Content-Type": "multipart/form-data" },
            })
          );
          expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
      })

      it("should show title error when title is not provided", async () => {
        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );
    
        fireEvent.click(screen.getByText("Submit Post"));
    
        expect(await screen.findByText("Error: Title required for post")).toBeInTheDocument();
      });

      it("should navigate back to profile when 'Go Back' is clicked", () => {
        render(
          <MemoryRouter>
            <PostForm />
          </MemoryRouter>
        );
    
        fireEvent.click(screen.getByText("Go Back"));
    
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });

      it("should handle file uploads and display image previews", async () => {
        render(
            <MemoryRouter>
                <PostForm />
            </MemoryRouter>
        );

        // Create mock files for file input
        const file1 = new File(["file1"], "file1.png", { type: "image/png" });
        const file2 = new File(["file2"], "file2.jpg", { type: "image/jpeg" });

        // Find the hidden input element by its label text
        const fileInput = screen.getByLabelText("Upload Image");

        // Fire the change event with the mock files
        fireEvent.change(fileInput, {
            target: { files: [file1, file2] }
        });

        // Wait for image previews to be displayed
        await waitFor(() => {
            expect(screen.getAllByRole("img")).toHaveLength(2);
        });

        // Check if image previews are displayed with the correct src
        const previews = screen.getAllByRole("img");
        expect(previews[0]).toHaveAttribute("src", "mockedURL");
        expect(previews[1]).toHaveAttribute("src", "mockedURL");
    });
})