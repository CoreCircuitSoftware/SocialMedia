import React from "react";
import { render, screen } from "@testing-library/react";
import CreatePost from "../pages/CreatePost";
import PostForm from "../components/PostForm";

// Mock the PostForm component
jest.mock("../components/PostForm", () => jest.fn(() => <div data-testid="post-form">Mocked PostForm</div>));

describe("CreatePost", () => {
    global.React = React;
    it("should render the PostForm component with the correct props", () => {
        render(<CreatePost />);

        // Check if the mocked PostForm is rendered
        expect(screen.getByTestId("post-form")).toBeInTheDocument();

        // Ensure the PostForm component is called with the correct props
        expect(PostForm).toHaveBeenCalledWith({ route: "/api/createpost/" }, {});
    });
});
