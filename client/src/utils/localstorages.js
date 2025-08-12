// Save cart to localStorage
export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

// Load cart from localStorage
export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load cart from localStorage", e);
    return undefined;
  }
};
