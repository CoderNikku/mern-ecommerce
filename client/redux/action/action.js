// action types
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const UPDATE_QUANTITY= 'UPDATE_QUANTITY';
export const CLEAR_CART ="CLEAR_CART";


// action create 
export const addProduct = (product) => {
    return {
        type: ADD_PRODUCT,
        payload: product
    }
};

export const removeProduct = (productId) => {
    return {
        type: REMOVE_PRODUCT,
        payload: productId
    }
};

export const updateQuantity = (productId, quantity) => {
    return {
        type: UPDATE_QUANTITY,
        payload: { productId, quantity },
    };
};

export const clearCart = () => ({
  type: CLEAR_CART
});


