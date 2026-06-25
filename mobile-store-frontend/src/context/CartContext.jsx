import { createContext, useState, useCallback, useEffect } from "react";
import { cartService } from "../services";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.cart);
      toast.success("Added to cart!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
      throw error;
    }
  }, []);

  const updateCartItem = useCallback(async (itemId, quantity) => {
    try {
      const response = await cartService.updateCart(itemId, { quantity });
      setCart(response.cart);
      return response;
    } catch (error) {
      toast.error("Failed to update cart");
      throw error;
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.cart);
      toast.success("Removed from cart!");
      return response;
    } catch (error) {
      toast.error("Failed to remove from cart");
      throw error;
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
