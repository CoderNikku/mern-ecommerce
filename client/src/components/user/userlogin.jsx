import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../redux/action/action"; // Import clearCart action
import { addProduct } from "../../../redux/action/action"; // Import addProduct action



const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        try {
            // Step 1: Login and get token + userId
            const loginResponse = await axios.post("http://localhost:1000/user/loginuser", {
                username,
                password,
            }, {
                headers: { "Content-Type": "application/json" },
            });

            const { token, userId } = loginResponse.data;

            if (token && userId) {
                // Store token and userId
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);

                // ✅ Clear Redux cart first (in case another user's cart is present)
                dispatch(clearCart());

                // ✅ Restore cart from localStorage
                const savedCart = localStorage.getItem(`cart_${userId}`);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    parsedCart.forEach(product => dispatch(addProduct(product)));
                }

                // Step 2: Fetch user profile using token
                const profileResponse = await axios.get("http://localhost:1000/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = profileResponse.data.user;

                if (userData) {
                    localStorage.setItem("user", JSON.stringify(userData));
                    window.dispatchEvent(new Event("userLogin"));
                    setError("");
                    navigate("/"); // Redirect to home
                } else {
                    setError("Failed to fetch user profile");
                }
            } else {
                setError("Login failed: token or userId missing");
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(
                err.response?.data?.message || "An error occurred during login. Please try again."
            );
        }
    };

    return (
        <>
            <Nav />
            <div>
                <p>Please fill in your correct username and password!!!</p>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </Form.Group>
                    <Button type="submit">Login</Button>
                    <Link to="/signin">
                        <Button variant="secondary">Register</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="light">Home</Button>
                    </Link>
                </Form>
            </div>
            <Footer />
        </>
    );
};

export default UserLogin;
