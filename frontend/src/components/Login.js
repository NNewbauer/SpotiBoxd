import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Accepts username or email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://127.0.0.1:8000/users/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
          });
  
      if (response.ok) {
        const data = await response.json();
        setMessage(`Welcome, ${data.user.username}`);
        navigate("/profile"); // Redirect to profile page
      } else {
        const error = await response.json();
        setMessage(error.error);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleSignupClick = () => {
    navigate("/signup"); // Navigate to signup page
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text" // Allow text input for both username and email
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <div>
        <p>Don't have an account?</p>
        <button onClick={handleSignupClick}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;