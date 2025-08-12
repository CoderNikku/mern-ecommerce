import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";

function UserBlog() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const negative = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (file) {
            formData.append("imagePath", file); //  Match backend field name
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        console.log("Token:", token); // for debugging

        try {
            const response = await axios.post(
                "http://localhost:1000/userblog/useraddblog",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}` //  Correct format
                    }
                }
            );
            console.log("Blog uploaded:", response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
        }
    };


    return (
        <>
            <div>
                <Nav />
            </div>
            <div>
                <h1>This is the user blog</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            placeholder="Enter the blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            placeholder="Enter the blog description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3">Submit</Button>
                </Form>
            </div>
            <Footer />
        </>

    );
}
export default UserBlog;
