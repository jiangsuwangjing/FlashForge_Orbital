import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./App.css";
function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goNext = () => {
    navigate("/home");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Username: ${username}, Password: ${password}`);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/signup", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    goNext();
  };

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    if (passwordValue.length < 8) {
      setError("Password must be at least 8 characters");
    } else {
      setError("");
    }
    setPassword(passwordValue);
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <div className="form-inner">
          <form action="#" className="login" onSubmit={handleSubmit}>
            <pre></pre>
            <div className="field">
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="field">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={handlePasswordChange}
              />
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Signup" />
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="signup-link">
              Go back to <a href="\">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
