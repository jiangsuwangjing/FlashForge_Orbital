import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  var error = 0;

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

    fetch("http://localhost:3000/login", requestOptions)
      .then((response) => {
        console.log(response.status, "response");
        if (response.status != 401) {
          goNext();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className="title login">Login Form</div>
        <div className="title signup">Signup Form</div>
      </div>
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Create an account <a href="\signup">Signup now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
