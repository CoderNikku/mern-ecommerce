import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";


const Mypost = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('')


    // DELETE FUNCTION
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:1000/adminblog/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Remove the deleted post from UI
            setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
        } catch (error) {
            console.error("Error deleting the post:", error);
            setError("Failed to delete post");
        }
    };


    useEffect(() => {
        const fetchAdminBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log(token)
                const res = await axios.get("http://localhost:1000/adminblog/adminblogshow", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(res.data);
                console.log(res.data)
            } catch (err) {
                setError("occpai some error")
                console.error("Error fetching user blogs:", err);
            }
        };
        fetchAdminBlogs();
    }, []);



    return (
        <>
            <div className="container">
                <h2>This is mypost</h2>
                {posts.map((item) => (
                    <div key={item._id}>
                        <img
                            src={`http://localhost:1000/adblgim/${item.imagePath}`}
                            alt={item.title}
                            height={100}
                            width={200}
                            onError={(e) =>
                                console.log(`Failed to load image: ${imageUrl}`, e)
                            }
                        />
                        <p>{item.title}</p>
                        <p>{item.info}</p>
                        <p>{item.rate}</p>
                        <p>{item.watching}</p>
                        <div>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                            <Link to={`/adminpostupdate/${item._id}`}><button>Edit</button></Link>
                            <Link to={`/post/${item._id}`}><button>view</button></Link>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: "20px" }}>
                    <Link to={'/admin'}><button>back</button></Link>
                </div>
            </div>
            <Footer/>
        </>
    );
}
export default Mypost;
// This component is a placeholder for the My Post page.