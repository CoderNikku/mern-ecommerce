import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../nav";
import Footer from "../footer";

const SignIn = () => {
  const [name, setName] = useState(""); // We'll treat this as username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (password !== confpassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    // Include all fields expected by the backend
    const userdata = {
      username: name, // Map 'name' to 'username'
      email,
      password,
      confpassword, // Send confpassword as required by backend
    };
    console.log("Sending data:", userdata); // For debugging

    try {
      const response = await axios.post("http://localhost:1000/user/adduser", userdata, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Server response:", response.data);
      setError(""); // Clear any previous errors
      navigate("/login"); // Redirect on success
    } catch (err) {
      console.error("Error details:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.message || "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <>
      <div>
        <Nav />
      </div>

      <div>
        <p>Please fill in the necessary details and continue the process</p>
        <div>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confpassword}
                onChange={(e) => setConfpassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" disabled={password !== confpassword}>
              Register
            </Button>

            <Link to={"/login"}>
              <Button variant="secondary">Login</Button>
            </Link>

            <Link to={"/"}>
              <Button variant="light">Back</Button>
            </Link>
          </Form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SignIn;