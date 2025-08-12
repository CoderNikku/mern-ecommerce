import React, { useState, useEffect } from "react";
import { addProduct, removeProduct, clearCart } from "../../redux/action/action";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState("none");
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const user = JSON.parse(localStorage.getItem("user"));


    // Load cart on first mount only if not loaded
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const savedCart = localStorage.getItem(`cart_${userId}`);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                parsedCart.forEach(product => dispatch(addProduct(product)));
            }
        }
    }, [dispatch]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId && cart.length) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        }
    }, [cart]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:1000/adminproduct");
                const data = response.data.data || [];
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    // Apply search and sorting
    useEffect(() => {
        let updated = [...products];

        if (query.trim()) {
            updated = updated.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (filter === "low-to-high") {
            updated.sort((a, b) => a.price - b.price);
        } else if (filter === "high-to-low") {
            updated.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(updated);
    }, [products, query, filter]);

    const handleAddProduct = (product) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        dispatch(addProduct(product));
    };

    const handleRemoveProduct = (productId) => {
        const exists = cart.some((item) => item._id === productId);
        if (exists) {
            dispatch(removeProduct(productId));
        } else {
            alert("Item not in cart");
        }
    };

    const cartCount = cart.length;

    return (
        <>
            <h1>Good price for all items — some with 30% discount!</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
                {/* LEFT SIDE */}
                <div className="left-side">
                    <div>
                        <p>Filter products by discount (not yet functional)</p>
                        <input type="checkbox" /> 10% <br />
                        <input type="checkbox" /> 20% <br />
                        <input type="checkbox" /> 30% <br />
                    </div>
                    <br /><br />
                    <div>
                        <label htmlFor="filter">Sort by Price:</label>
                        <select id="filter" onChange={(e) => setFilter(e.target.value)} value={filter}>
                            <option value="none">None</option>
                            <option value="low-to-high">Low to High</option>
                            <option value="high-to-low">High to Low</option>
                        </select>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="right-side">
                    <div className="main-product">
                        <div className="product-container" style={{ padding: "20px" }}>
                            <div className="filter-section">
                                <h3 align="right">
                                    <Link to="/youritem">
                                        <span>Your Cart: {cartCount}</span>
                                    </Link>
                                </h3>

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
                                    <label htmlFor="filter">Sort by Price:</label>
                                    <select id="filter" onChange={(e) => setFilter(e.target.value)} value={filter}>
                                        <option value="none">None</option>
                                        <option value="low-to-high">Low to High</option>
                                        <option value="high-to-low">High to Low</option>
                                    </select>
                                </div>
                            </div>

                            {/* PRODUCT LIST */}
                            <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                                {filteredProducts.length === 0 ? (
                                    <p>No products found.</p>
                                ) : (
                                    filteredProducts.map((item) => (
                                        <div key={item._id} className="product-item" style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
                                            <Link to={`/showproduct/${item._id}`}>
                                                <img
                                                    src={`http://localhost:1000/adminproducts/${item.productImage}`}
                                                    alt={item.name}
                                                    height={100}
                                                    width={200}
                                                />
                                            </Link>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
