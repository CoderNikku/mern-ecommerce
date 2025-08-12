import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, removeProduct } from "../../../redux/action/action";
import { Link } from "react-router-dom";
import Nav from "../nav";
import Footer from "../footer";
import { Button } from "react-bootstrap";


const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [filter, setFilter] = useState("none");
    const [query, setQuery] = useState("");

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart || []);

    const user = JSON.parse(localStorage.getItem("user"));


    // Fetch and filter products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:1000/adminproduct");
                setProducts(response.data.data);
                console.log(response.data.data)
                const searched = response.data.data.filter((item) =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredProducts(searched); // ✅ Apply filtered results here
            } catch (err) {
                console.error("Error fetching products: ", err);
            }
        };

        fetchProducts();
    }, [query]);

    // Sort filtered products
    const sortedProducts = () => {
        let sorted = [...filteredProducts];
        if (filter === "low-to-high") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (filter === "high-to-low") {
            sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
    };


    // Pagination
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = sortedProducts().slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts().length / itemsPerPage);

    const handleAddProduct = (product) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        dispatch(addProduct(product));
    };

    const handleRemoveProduct = (productId) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        const productExists = cart.some((item) => item._id === productId);
        if (productExists) {
            dispatch(removeProduct(productId));
        } else {
            alert("Item not in cart");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const cartCount = cart.length;

    return (
        <>
            <div className="product-container" style={{ padding: "20px" }}>
                <div className="filter-section">
                    <h3 align="right">
                        <Link to={'/youritem'}>
                            <span>Your Cart: {cartCount}</span>
                        </Link>
                    </h3>
                    <h3>Choose a product and get 30% off</h3>

                    <div style={{ margin: "10px 0" }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ padding: "8px", width: "50%" }}
                        />
                    </div>

                    <div align="right">
                        <label htmlFor="filter">Sort by Price: </label>
                        <select id="filter" onChange={(e) => setFilter(e.target.value)} value={filter}>
                            <option value="none">None</option>
                            <option value="low-to-high">Low to High</option>
                            <option value="high-to-low">High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Product Listing */}
                <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {currentProducts.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        currentProducts.map((item) => (
                            <div className="product-item" key={item._id} style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
                                <Link to={`/adminshowproduct/${item._id}`}><img
                                    src={`http://localhost:1000/adminproducts/${item.productImage}`}
                                    alt={item.name}
                                    height={100}
                                    width={200}
                                /></Link>
                                <h5>{item.name}</h5>
                                <p>{item.description}</p>
                                <p>Price: ₹{item.price}</p>

                                <div className="product-actions">
                                    <button onClick={() => handleAddProduct(item)}>Add +</button>
                                    <button onClick={() => handleRemoveProduct(item._id)}>Remove -</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination" style={{ marginTop: "20px" }}>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </div>
            <Link to={'/admin'}><Button>Admin</Button></Link>
            <Footer />
        </>
    );
};
export default Product;
