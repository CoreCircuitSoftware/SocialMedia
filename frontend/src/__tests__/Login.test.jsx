import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import LoginForm from "../components/LoginForm";

// Mock the LoginForm component
jest.mock("../components/LoginForm", () =>
    jest.fn(() => <div data-testid="login-form">Mocked LoginForm</div>)
);

describe("Login", () => {
    global.React = React

    it("should render the LoginForm component with the correct props", () => {
        render(<Login />);

        // Check if the mocked LoginForm is rendered
        expect(screen.getByTestId("login-form")).toBeInTheDocument();

        // Ensure the LoginForm component is called with the correct props
        expect(LoginForm).toHaveBeenCalledWith(
            { route: "/api/token/" },
            {}
        );
    });
});
