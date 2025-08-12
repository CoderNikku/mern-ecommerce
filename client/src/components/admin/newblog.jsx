import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";

const NewBlog = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const [rate, setRate] = useState("");
    const [watching, setWatching] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData();
        formData.append("title", title)
        formData.append("info", info);
        formData.append("rate", rate);
        formData.append("watching", watching);

        if (file) {
            formData.append("imagePath", file); // Match backend field name
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:1000/adminblog/adminblogadd",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Blog uploaded:", response.data);
            navigate("/admin");
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <div>
                <h1>Add a New Blog/Article</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <div>
                        <label>title:</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Info:</label>
                        <input
                            type="text"
                            name="title"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>rate:</label>
                        <input
                            type="text"
                            name="rate"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Watching:</label>
                        <input
                            type="text"
                            name="watching"
                            value={watching}
                            onChange={(e) => setWatching(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div style={{ marginTop: "20px" }}>
                <Link to={'/admin'}><button>back</button></Link>
            </div>
            <Footer/>
        </>
    );
};

export default NewBlog;
