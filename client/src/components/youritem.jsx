import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeProduct, addProduct } from "../../redux/action/action";
import Nav from "./nav";
import Footer from "./footer";
import { store } from "../../redux/store";
import { persistStore } from 'redux-persist';

const YourItem = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    console.log("Cart in Redux:", cart);
    const persistor = persistStore(store);


    // Track custom quantities per item
    const [customQuantities, setCustomQuantities] = useState({});

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

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 1) return;
        dispatch(updateQuantity(productId, quantity));
    };

    const handleRemoveItem = (productId) => {
        const exists = cart.some((item) => item._id === productId);
        if (exists) {
            dispatch(removeProduct(productId));
        } else {
            alert("Item not in cart");
        }
    };

    const handleCustomQuantityChange = (productId, value) => {
        setCustomQuantities((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    const handleCustomQuantitySubmit = (productId) => {
        const quantity = parseInt(customQuantities[productId] || 11);
        if (quantity > 10) {
            handleQuantityChange(productId, quantity);
        }
    };

    return (
        <>
            <Nav />
            <div className="your-items-container">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>No items in your cart.</p>
                ) : (
                    <div className="cart-items">
                        {cart.map((item) => {
                            const isCustom = item.quantity > 10;
                            const customValue = customQuantities[item._id] ?? item.quantity;

                            return (
                                <div key={item._id} className="cart-item">
                                    <img
                                        src={`http://localhost:1000/product/${item.imagePath}`}
                                        alt={item.name} 
                                        height={100}
                                        width={200}
                                    />
                                    <h5>{item.name}</h5>
                                    <p>{item.description}</p>
                                    <p>Price: {item.price}</p>

                                    <div className="quantity-controls">
                                        <label>Quantity: </label>
                                        <select
                                            value={isCustom ? "11+" : item.quantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "11+") {
                                                    handleCustomQuantityChange(item._id, item.quantity);
                                                } else {
                                                    handleQuantityChange(item._id, parseInt(val));
                                                }
                                            }}
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                            <option value="11+">11+</option>
                                        </select>
                                    </div>

                                    {isCustom && (
                                        <div className="custom-quantity">
                                            <input
                                                type="number"
                                                min="11"
                                                value={customValue}
                                                onChange={(e) =>
                                                    handleCustomQuantityChange(item._id, parseInt(e.target.value))
                                                }
                                            />
                                            <button onClick={() => handleCustomQuantitySubmit(item._id)}>
                                                Update
                                            </button>
                                        </div>
                                    )}

                                    <button onClick={() => handleRemoveItem(item._id)}>
                                        Remove from Cart
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div>
                    <button>Buy</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default YourItem;
