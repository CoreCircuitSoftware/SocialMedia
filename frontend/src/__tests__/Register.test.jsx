import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../pages/Register";
import RegisterForm from "../components/RegisterForm";

// Mock the RegisterForm component
jest.mock("../components/RegisterForm", () =>
    jest.fn(() => <div data-testid="register-form">Mocked RegisterForm</div>)
);

describe("Register", () => {
    global.React = React;
    it("should render the RegisterForm component with the correct props", () => {
        render(<Register />);

        // Check if the mocked RegisterForm is rendered
        expect(screen.getByTestId("register-form")).toBeInTheDocument();

        // Ensure the RegisterForm component is called with the correct props
        expect(RegisterForm).toHaveBeenCalledWith(
            { route: "/api/user/register/" },
            {}
        );
    });
});
