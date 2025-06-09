import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems;
      }

      let price = 0;
      if (typeof product.price === "string") {
        price = parseFloat(product.price.replace(/[^\d.]/g, ""));
      } else if (typeof product.price === "number") {
        price = product.price;
      } else if (product.priceValue) {
        price = parseFloat(product.priceValue);
      }

      if (isNaN(price)) price = 0;

      let image_url = product.image_url;
      if (!image_url && product.images?.[0]) {
        image_url = product.images[0];
      }
      if (!image_url && product.extra_image1) {
        image_url = product.extra_image1;
      }
      if (!image_url) {
        image_url = "/placeholder.jpg";
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          price: price,
          image_url: image_url,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return total + itemPrice;
  }, 0);

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post("/api/coupons/validate", { code });
      if (response.data.valid) {
        setAppliedCoupon({
          code,
          discount_percentage: response.data.discount_percentage,
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setAppliedCoupon(null);
      return {
        success: false,
        error: error.response?.data?.message || "Invalid coupon code",
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount_percentage) / 100
    : 0;

  const cartTotal = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        cartTotal,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
