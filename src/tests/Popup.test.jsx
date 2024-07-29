// src/tests/Popup.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Popup from "../components/flashcards/Popup";

describe("Popup Component", () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();
  const mockSetNewDeckName = vi.fn();

  const renderPopup = () => {
    return render(
      <Popup
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        setNewDeckName={mockSetNewDeckName}
      />
    );
  };

  it("renders the popup with initial elements", () => {
    renderPopup();
    expect(screen.getByText("Enter a deck name")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    renderPopup();
    fireEvent.click(screen.getByText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onAdd and onClose when Add button is clicked", () => {
    renderPopup();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "New Deck" },
    });
    fireEvent.click(screen.getByText("Add"));
    expect(mockOnAdd).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("updates input value and calls setNewDeckName on input change", () => {
    renderPopup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Deck" } });
    expect(input.value).toBe("New Deck");
    expect(mockSetNewDeckName).toHaveBeenCalledWith("New Deck");
  });
});
