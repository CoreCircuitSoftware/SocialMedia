import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import NotFound from "../pages/NotFound";

describe("notfound1", () => {
    global.React = React;

    it('Not found', async () => {
        render(<NotFound/>)

        expect(screen.getByText("404 Not Found")).toBeInTheDocument();
        expect(screen.getByText("The page you're looking for does not exist!")).toBeInTheDocument();
    })
})