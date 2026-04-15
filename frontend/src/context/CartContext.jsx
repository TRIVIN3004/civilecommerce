import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Cart retrieval error", error);
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        (item.product.id && item.product.id === product.id) || 
        (item.product._id && item.product._id === product._id)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        if (newCart[existingItemIndex].quantity < (product.stock || 99)) {
           newCart[existingItemIndex].quantity += 1;
        }
        return newCart;
      }

      return [...prev, { 
        product, 
        price: product.price || 0,
        dealer: { storeName: "ConstructMart Official" },
        quantity: 1,
        maxQuantity: product.stock || 10
      }];
    });
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const updateQuantity = (index, newQuantity) => {
    setCartItems(prev => {
      const newCart = [...prev];
      if (newQuantity > 0 && newQuantity <= newCart[index].maxQuantity) {
        newCart[index].quantity = newQuantity;
      }
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
