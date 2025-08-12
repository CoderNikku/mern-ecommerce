import React, { useEffect, useState } from "react";
import '../../css/dashboard.css';
import logo from '../../assets/images/logo.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt, faPen, faFolderOpen, faFileAlt,
    faDollarSign, faChartLine, faHeadset, faSearch,
    faWallet, faStore, faHeart, faBell, faUser, faEye, faStar,
    faFile
} from '@fortawesome/free-solid-svg-icons';
import Footer from "../footer";


const Admin = () => {
    const navigate = useNavigate();
    const [adminblog, setAdminblog] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");


    // create the sorting by the dropdown base
    const [sortBy, setSortBy] = useState("");
    const [artical, setArtical] = useState("");
    const [category, setCategory] = useState("");

    // search th blog stare  
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showCategoryFilters, setShowCategoryFilters] = useState(false);


    // 🧠 Fetch admin blogs from backend on mount
    useEffect(() => {
        const fetchAdminBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:1000/adminblog/adminblogshow", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdminblog(res.data);
                setFilteredBlogs(res.data); // ✅ Initialize filtered list
            } catch (err) {
                console.error("Error fetching user blogs:", err);
                setError("Something went wrong while fetching blogs.");
            }
        };
        fetchAdminBlogs();
    }, []);


    /// Toggle search input & hide category if open
    const toggleSearchInput = () => {
        setShowSearchInput(prev => !prev);
        if (!showSearchInput) setShowCategoryFilters(false);
    };

    // Toggle category filter & hide search if open
    const toggleCategoryFilters = () => {
        setShowCategoryFilters(prev => !prev);
        if (!showCategoryFilters) setShowSearchInput(false);
    };

    // filter the category icon logic
    const filterByCategory = (category) => {
        setSelectedCategory(category);
        setShowCategoryFilters(false);

        if (category === "") {
            setFilteredBlogs(adminblog);
        } else {
            const filtered = adminblog.filter(blog =>
                (blog.category || "").toLowerCase() === category.toLowerCase()
            );
            setFilteredBlogs(filtered);
        }
    };



    // 🔍 Handle search form submit
    const searchBlogs = (e) => {
        e.preventDefault();
        const search = (searchTitle || "").toLowerCase();

        if (search.trim() === "") {
            setFilteredBlogs(adminblog); // Show all if search is empty
        } else {
            const filtered = adminblog.filter((blog) =>
                (blog.title || "").toLowerCase().includes(search)
            );
            setFilteredBlogs(filtered);
        }
    };

    // 🧼 Clear search
    const clearSearch = () => {
        setSearchTitle("");
        setFilteredBlogs(adminblog);
    };

    // 👤 Admin info from localStorage
    const admin = JSON.parse(localStorage.getItem("admin")) || {};
    const username = admin.username || "Guest";

    // 🚪 Logout handler
    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/adminlogin");
    };


    // filter the seecion catgory base logic 
    useEffect(() => {
        let filtered = [...adminblog];

        if (category) {
            filtered = filtered.filter(blog =>
                (blog.category || "").toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by Category
        if (category && category !== "All") {
            filtered = filtered.filter(blog =>
                (blog.category || "").toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by Course
        if (artical && artical !== "All Artical") {
            filtered = filtered.filter(blog =>
                (blog.artical || "").toLowerCase() === artical.toLowerCase()
            );
        }


        // Sort
        if (sortBy === "Latest") {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === "Popularity") {
            filtered.sort((a, b) => (b.watching || 0) - (a.watching || 0));
        } else if (sortBy === "Top Rated") {
            filtered.sort((a, b) => (b.rate || 0) - (a.rate || 0));
        }

        setFilteredBlogs(filtered);
    }, [sortBy, artical, category, adminblog]);


    // const eye = "\uD83D\uDC41\uFE0F"; //  menuwaly eye emoji

    return (
        <>
        <div className="dashboard">
            {/* SIDEBAR */}
            <div className="nav">
                <div className="logo">
                    <img src={logo} alt="Logo" height={'70px'} width={'90px'} />
                </div>
                <div className="dashnav">
                    <div>
                        <Link><div><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</div></Link>
                        <Link to="/newblog"><div><FontAwesomeIcon icon={faPen} /> New Post</div></Link>
                        <Link><div><FontAwesomeIcon icon={faFolderOpen} /> Category</div></Link>
                        <Link to="/mypost"><div><FontAwesomeIcon icon={faFileAlt} /> My Posts</div></Link>
                        <Link><div><FontAwesomeIcon icon={faDollarSign} /> Earnings</div></Link>
                        <Link><div><FontAwesomeIcon icon={faChartLine} /> Analytics</div></Link>
                    </div>
                </div>
                <div className="support">
                    <Link><div><FontAwesomeIcon icon={faHeadset} /> Support</div></Link>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main">
                <div className="mainNav">
                    <form onSubmit={searchBlogs}>
                        <FontAwesomeIcon icon={faSearch} />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                        <button type="submit">Search</button>
                        <button type="button" onClick={clearSearch}>Clear</button>
                    </form>
                    <Link><div><FontAwesomeIcon icon={faWallet} /> Balance</div></Link>
                    <Link to={'/adminproduct'}><div><FontAwesomeIcon icon={faStore} /> Shop</div></Link>
                    <Link><div><FontAwesomeIcon icon={faHeart} /> Favorites</div></Link>
                    <Link><div><FontAwesomeIcon icon={faBell} /> Notifications</div></Link>
                    <Link to={'/addminaddproduct'}><div><FontAwesomeIcon icon={faStore} /> Add Product</div></Link>
                    <div>
                        <FontAwesomeIcon icon={faUser} /> {username}
                        <span><button onClick={handleLogout}>Logout</button></span>
                    </div>
                </div>
                {/* <AdminNav/> */}

                {/* BLOG CONTENT */}
                <div className="contant">
                    <div className="heading" align="left"><h2>Today Trending</h2></div>

                    {/* Optional Filters (Not functional for now) */}
                    <div className="feature" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '10px' }}>
                        <div>
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="">Select</option>
                                <option>Popularity</option>
                                <option>Latest</option>
                                <option>Top Rated</option>
                            </select>
                        </div>

                        <div>
                            <label>Artical:</label>
                            <select value={artical} onChange={(e) => setArtical(e.target.value)}>
                                <option>All Artical</option>
                                <option>Frontend</option>
                                <option>Backend</option>
                                <option>Full Stack</option>
                            </select>
                        </div>

                        <div>
                            <label>Category:</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">All</option>
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>


                        {/* some open the search input and the category */}
                        <div className="filterblog" style={{ cursor: 'pointer', display: 'flex', gap: '10px' }}>
                            {/* 👇 Search Icon - click to show/hide input */}
                            <div style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faSearch} onClick={toggleSearchInput} />
                                {/* 👇 Conditionally render search form */}
                                {showSearchInput && (
                                    <form onSubmit={searchBlogs} className="search-form" style={{ display: 'flex', gap: '5px', width: "10px" }}>
                                        <input
                                            type="text"
                                            placeholder="Search by title..."
                                            value={searchTitle}
                                            onChange={(e) => setSearchTitle(e.target.value)}
                                        />
                                        <button type="submit">Search</button>
                                        <button type="button" onClick={clearSearch}>Clear</button>
                                    </form>
                                )}
                            </div>

                            {/* clickable category icon */}
                            <div style={{ position: 'relative' }}>
                                <FontAwesomeIcon icon={faFolderOpen} onClick={toggleCategoryFilters} style={{ cursor: "pointer" }} />
                                {showCategoryFilters && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '25px',
                                        background: '#fff',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        zIndex: 100,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <button onClick={() => filterByCategory("")}>All</button>
                                        <button onClick={() => filterByCategory("marketing")}>Marketing</button>
                                        <button onClick={() => filterByCategory("development")}>Development</button>
                                        <button onClick={() => filterByCategory("design")}>Design</button>
                                        <button onClick={() => filterByCategory("business")}>Business</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* DISPLAY BLOGS */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {filteredBlogs.map((item) => (
                            <div key={item._id} style={{ border: '1px solid #ccc', padding: '10px', width: '220px' }}>
                                <Link to={`/post/${item._id}`}><img
                                    src={`http://localhost:1000/adblgim/${item.imagePath}`}
                                    alt={item.title}
                                    height={100}
                                    width={200}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/200x100?text=No+Image";
                                    }}
                                /></Link>
                                <p><strong>{item.title}</strong></p>
                                <p>{item.info}</p>
                                {/* <p>⭐ {item.rate}</p> */}
                                {/* <p>👁️ {item.watching}</p> */}
                                <p><FontAwesomeIcon icon={faStar} style={{ color: "gold" }} /> {item.rate}</p>
                                <p><FontAwesomeIcon icon={faEye} />{item.watching}</p>
                                {/* <p>{eye} {item.watching}</p> */}
                            </div>
                        ))}
                        {filteredBlogs.length === 0 && <p>No blogs found.</p>}
                    </div>
                </div>
            </div>
        </div >
        <Footer/>
          </>
    );
};

export default Admin;
