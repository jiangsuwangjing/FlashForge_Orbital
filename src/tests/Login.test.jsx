// Login.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Login } from "../registration/Login"; // Adjust the import path as needed
import { ChakraProvider } from "@chakra-ui/react";

describe("Login Component", () => {
  const mockProps = {
    email: "",
    setEmail: vi.fn(),
    password: "",
    setPassword: vi.fn(),
    handleLogin: vi.fn(),
    handleSignup: vi.fn(),
    hasAccount: false,
    setHasAccount: vi.fn(),
    signInWithGoogle: vi.fn(),
    username: "",
    setUsername: vi.fn(),
  };

  beforeEach(() => {
    render(
      <ChakraProvider>
        <Login {...mockProps} />
      </ChakraProvider>
    );
  });

  it("renders the logo image", () => {
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
  });

  it("renders the Sign In With Google button", () => {
    const googleButton = screen.getByText("Sign In With Google");
    expect(googleButton).toBeInTheDocument();
  });

  it("renders the email input field", () => {
    const emailInput = screen.getByPlaceholderText("Your email");
    expect(emailInput).toBeInTheDocument();
  });

  it("renders the password input field", () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("calls signInWithGoogle on Google Sign In button click", () => {
    const googleButton = screen.getByText("Sign In With Google");
    fireEvent.click(googleButton);
    expect(mockProps.signInWithGoogle).toHaveBeenCalled();
  });
});
