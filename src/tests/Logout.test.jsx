import React from "react";
import { render, screen } from "@testing-library/react";
import { Logout } from "../icons/logout";
import { describe, it, expect } from "vitest";

describe("Logout Component", () => {
  it("renders the SVG icon", () => {
    render(<Logout />);

    // Query the SVG element using data-testid
    const svgElement = screen.getByTestId("logout-icon");

    // Assert that the SVG icon is in the document
    expect(svgElement).toBeInTheDocument();
    // Optionally, check that the SVG has the correct attributes
    expect(svgElement).toHaveAttribute("width", "24");
    expect(svgElement).toHaveAttribute("height", "24");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 24 24");
    // Check the stroke color
    expect(svgElement.querySelector("path")).toHaveAttribute("stroke", "white");
  });
});
