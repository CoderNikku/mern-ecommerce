import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";

const Blog = () => {
    const [blog, setBlog] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:1000/adminblog/adnblog", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBlog(res.data.data);

                console.log("Total blogs fetched:", res.data.data); // 👈 Debug
            } catch (err) {
                console.error("Error fetching user blogs:", err);
            }
        };
        fetchBlogs();
    }, []);


    // Pagination logic
    const totalPages = Math.ceil(blog.length / itemsPerPage);

    const currentBlogs = useMemo(() => {
        const indexOfLastBlog = currentPage * itemsPerPage;
        const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
        return blog.slice(indexOfFirstBlog, indexOfLastBlog);
    }, [blog, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            console.log("Current page changed:", pageNumber); // 👈 Debug
        }
    };

    return (
        <>
            <div>
                <Nav />
            </div>

            <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <Link to="/">
                        <Button variant="secondary">Back</Button>
                    </Link>
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
                                <Link to={`/showblog/${item._id}`}><img
                                    src={`http://localhost:1000/adblgim/${item.imagePath}`}
                                    alt={item.title}
                                    width={200}
                                    height={150}
                                /></Link>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <div style={{ marginTop: "10px" }}>
                                    <Link to={`/showblog/${item._id}`}>
                                        <button>View</button>
                                    </Link>{" "}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination UI */}
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
            </div>
            <Footer/>
        </>
    );
};

export default Blog;
