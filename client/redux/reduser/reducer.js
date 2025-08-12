import { ADD_PRODUCT, REMOVE_PRODUCT, UPDATE_QUANTITY, CLEAR_CART } from "../action/action";

// Load cart from localStorage on first load
const initialState = {
  cart: [],
};

const reducer = (state = initialState, action) => {
  let updatedCart;

  switch (action.type) {
    case ADD_PRODUCT:
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return { ...state, cart: updatedCart };

    case REMOVE_PRODUCT:
      updatedCart = state.cart.filter((item) => item._id !== action.payload);
      return { ...state, cart: updatedCart };

    case UPDATE_QUANTITY:
      updatedCart = state.cart.map((item) =>
        item._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, cart: updatedCart };

    case CLEAR_CART:
      return { ...state, cart: [] };

    default:
      return state;
  }
};

export default reducer;