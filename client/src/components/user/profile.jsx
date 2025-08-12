import axios from "axios";
import React, { useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Nav from "../nav";
import Footer from "../footer";

const Profile = () => {
    const [userblog, setUserblog] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:1000/userblog/myblogs", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserblog(res.data);

                console.log("Total blogs fetched:", res.data.length); // 👈 Debug
            } catch (err) {
                console.error("Error fetching user blogs:", err);
            }
        };
        fetchUserBlogs();
    }, []);

    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.username || "Guest"; // Fallback if no username

    const handleLogout = () => {
        // Clear user data and redirect to login
        localStorage.removeItem("user");
        // axios.post('http://localhost:1000/user/logout')
        // console.log("logout token is break.....")
        navigate("/login");
    };


    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:1000/userblog/deleteblog/${id}`, {
                header: {
                    Authorization: `Bearer${token}`
                }
            });

            // remove the delete post from ui
            setUserblog(preveBlog => preveBlog.filter(blog => blog._id !== id))
        }
        catch (err) {
            console.log("blog delete error", err)
            setError("occupy some error")
        }
    }

    const totalPages = Math.ceil(userblog.length / itemsPerPage);

    const currentBlogs = useMemo(() => {
        const indexOfLastBlog = currentPage * itemsPerPage;
        const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
        return userblog.slice(indexOfFirstBlog, indexOfLastBlog);
    }, [userblog, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            console.log("Current page changed:", pageNumber); // 👈 Debug
        }
    };

    return (
        <>
        <div>
            <Nav/>
        </div>
            <div style={{ padding: "20px" }}>
                <h2>Profile Page</h2>
                <p>Welcome, <strong>{username}</strong>!</p>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
                <Link to={'/userBlog'}><button>addblog</button></Link>
            </div>

            <h1>Blogs</h1>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center",
                    minHeight: "300px"
                }}
            >
                {currentBlogs.length === 0 ? (
                    <p>No blogs found.</p>
                ) : (
                    currentBlogs.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                width: "280px",
                                boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                                textAlign: "center"
                            }}
                        >
                            <img
                                src={`http://localhost:1000/userimages/${item.imagePath}`}
                                alt={item.title}
                                width={200}
                                height={150}
                            />
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <div style={{ marginTop: "10px" }}>
                                <Link to={`/userupdateBlog/${item._id}`}>
                                    <button>Edit</button>
                                </Link>{" "}
                                <Link to={`/viewUserblog/${item._id}`}>
                                    <button>View</button>
                                </Link>{" "}
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination UI */}
            <div>
                {totalPages > 1 && (
                    <div
                        className="pagination"
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            flexWrap: "wrap"
                        }}
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ padding: "6px 12px" }}
                        >
                            &laquo; Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    padding: "6px 12px",
                                    fontWeight: currentPage === index + 1 ? "bold" : "normal",
                                    backgroundColor: currentPage === index + 1 ? "#007bff" : "#f0f0f0",
                                    color: currentPage === index + 1 ? "#fff" : "#000",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ padding: "6px 12px" }}
                        >
                            Next &raquo;
                        </button>
                    </div>
                )}
            </div >
            <Footer/>
        </>
    );
};

export default Profile;


