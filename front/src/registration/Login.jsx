import React from "react";
import "../styles/Login.css";
import logo from "../assets/logo.png";

export const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleSignup,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
    signInWithGoogle,
  } = props;
  return (
    <div className="base-container">
      <div className="content">
        <div className="image">
          <img src={logo} />
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="errorMsg">{emailError}</p>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="errorMsg">{passwordError}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="footer">
          {hasAccount ? (
            <>
              <button className="btn" onClick={handleLogin}>
                Sign in
              </button>
              <p>
                Don't have an account?
                <span
                  onClick={() => setHasAccount(!hasAccount)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                >
                  Register
                </span>
              </p>
            </>
          ) : (
            <>
              <button onClick={handleSignup} className="btn">
                {" Register"}
              </button>
              <p>
                Have an account?
                <span
                  onClick={() => setHasAccount(!hasAccount)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                >
                  Sign in
                </span>
              </p>
            </>
          )}
        </div>
        <button onClick={signInWithGoogle}>Sign In With Google</button>
      </div>
    </div>
  );
};
