import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer", () => {
    it("should render the copyright text and the About us link", () => {
        render(<Footer />);

        // Check if the copyright text is displayed
        expect(screen.getByText("© 2024 Core Circuit Software")).toBeInTheDocument();

        // Check if the About us link is displayed with the correct text and href
        const aboutLink = screen.getByText("About us");
        expect(aboutLink).toBeInTheDocument();
        expect(aboutLink).toHaveAttribute("href", "https://corecircuitsoftware.github.io");
        expect(aboutLink).toHaveClass("text-secondary");
    });
});
