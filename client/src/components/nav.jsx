import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import menu from "../assets/images/navigate.png";
import remove from "../assets/images/remove.png";
import cheatBot from "../assets/Chatbot Chat Message.jpg";
import "../css/style.css";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/action/action"; // Import clearCart action
const Nav = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch(); // 👈 Add this above in your component


    const navigate = useNavigate();

    const loadUser = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();

        const handleStorageChange = (e) => {
            if (e.key === "user" || e.key === "token" || e.key === "userId") {
                loadUser();
            }
        };

        const handleUserLogin = () => {
            loadUser();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("userLogin", handleUserLogin);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("userLogin", handleUserLogin);
        };
    }, []);

    const handleLogout = () => {
        const userId = localStorage.getItem("userId");

        // 🧹 Clear Redux cart state
        dispatch(clearCart());

        // 🧹 Remove local storage data
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        // localStorage.removeItem(`cart_${userId}`);

        setUser(null);

        // ➡️ Redirect to login
        navigate("/login");
    };

    const toggleChat = () => {
        setChatOpen((prev) => !prev);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Your chatbot code here (unchanged)
    };

    return (
        <div>
            {/* Mobile Menu Icon */}
            <div className="menuicon" onClick={() => setMenuOpen(true)}>
                <img src={menu} alt="menu" height="40px" width="50px" />
            </div>

            {/* Navigation Bar */}
            <div className="homenav" style={{ display: menuOpen ? "flex" : "" }} id="homenav">
                <div className="removeicon" onClick={() => setMenuOpen(false)}>
                    <img src={remove} alt="close" height="40px" width="50px" />
                </div>

                <div><p>Logo</p></div>

                <div className="navtag">
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/blog"><li>Blog</li></Link>
                        <Link to="/product"><li>Product</li></Link>

                        {!user ? (
                            <Link to="/login"><li>Sign</li></Link>
                        ) : (
                            <>
                                <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                                    {user.username} Logout
                                </li>
                                {user.image && (
                                    <li>
                                        <img
                                            src={user.image}
                                            alt="User"
                                            height="40"
                                            width="40"
                                            style={{ borderRadius: "50%" }}
                                        />
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Chatbot Icon */}
            <div className="cheatbotlogo" onClick={toggleChat}>
                <img src={cheatBot} alt="Chatbot Icon" />
            </div>

            {/* Chatbot Box */}
            {chatOpen && (
                <div className="chatbox">
                    <div className="chatbox-header">ChatBot</div>
                    <div className="chatbox-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
                            >
                                <p>
                                    <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="chatbox-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nav;
