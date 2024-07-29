import React from "react";
import "../styles/Login.css";
import logo from "../assets/logo.png";
import logo_black from "../assets/logo_black.png"
import googleLogo from "../assets/googleIcon.png";
import { Center } from "@chakra-ui/react";

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
    signInWithGoogle,
    username,
    setUsername,
  } = props;
  const handleSetAccount = () => {
    setHasAccount(!hasAccount);
    setUsername("");
    setEmail("");
    setPassword("");
  };
  return (
    <div className=" min-h-screen flex flex-col">
      <div className="content flex flex-col items-center relative">
        <div className="h-72 w-72">
          <img src={logo_black} />
        </div>
        <button
          className="w-[500px] py-3 my-8 border-[1px] border-gray-400 flex justify-center items-center text-white"
          onClick={signInWithGoogle}
        >
          <img src={googleLogo} className="w-6 h-6 mr-3" alt="google logo" />
          Sign In With Google
        </button>
        <div className="flex justify-center items-center flex-1 w-full">
          <hr className="w-full" />
          <div className="mx-4 text-gray-400">or</div>
          <hr className="w-full" />
        </div>
        <div className="form">
          <div className="form-group">
            <input
              className="w-[500px] py-3 border-[1px] border-gray-400 bg-black rounded-xl h-12 placeholder-white text-white"
              type="text"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!hasAccount && (
            <div className="form-group">
              <input
                className="w-[500px] py-3 border-[1px] border-gray-400 bg-black rounded-xl h-12 placeholder-white text-white"
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <input
              className="w-[500px] py-3 border-[1px] border-gray-400 bg-black rounded-xl h-12 placeholder-white text-white"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* {passwordError && (
              <p
                style={{
                  position: "absolute",
                  marginTop: "78px",
                  marginLeft: "24px",
                }}
                className="errorMsg"
              >
                {passwordError}
              </p>
            )} */}
          </div>
        </div>
      </div>

      <div className="footer relative">
        {hasAccount ? (
          <>
            <button
              className="w-[500px] py-3 my-4 border-[1px] border-gray-400 bg-white rounded-full h-12 text-black font-bold"
              onClick={handleLogin}
            >
              Sign in
            </button>
            <p style={{ color: "white" }}>
              Don't have an account?
              <span
                onClick={handleSetAccount}
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  color: "rgb(17, 150, 250)",
                }}
              >
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={handleSignup}
              className="w-[500px] py-3 my-4 border-[1px] border-gray-400 bg-white rounded-full h-12 text-black font-bold"
            >
              Register
            </button>
            <p style={{ color: "white" }}>
              Have an account?
              <span
                onClick={handleSetAccount}
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  color: "rgb(17, 150, 250)",
                }}
              >
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
