import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [inspectionFee, setInspectionFee] = useState(49); // Default, can be updated from API

  // Optionally, fetch inspection fee from API here if needed

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Use product_id as the unique identifier, fallback to id
      const productId = product.product_id || product.id;
      const existingItem = prevItems.find((item) => (item.product_id || item.id) === productId);
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
          id: productId, // Ensure id is set to product_id
          product_id: productId, // Also keep product_id for consistency
          quantity: 1,
          price: price,
          image_url: image_url,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.product_id || item.id) !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.product_id || item.id) === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate discounts based on coupon type
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return total + itemPrice;
  }, 0);

  const totalInspectionFees = cartItems.length * inspectionFee;

  let discountOnSubtotal = 0;
  let discountOnInspection = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "inspection_fee") {
      discountOnInspection = (totalInspectionFees * appliedCoupon.discount_percentage) / 100;
    } else {
      discountOnSubtotal = (subtotal * appliedCoupon.discount_percentage) / 100;
    }
  }

  const cartTotal = subtotal - discountOnSubtotal + totalInspectionFees - discountOnInspection;

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post("/api/coupons/validate", { code });
      if (response.data.valid) {
        setAppliedCoupon({
          code,
          discount_percentage: response.data.discount_percentage,
          type: response.data.type || "total",
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        cartTotal,
        discount: discountOnSubtotal + discountOnInspection,
        discountOnSubtotal,
        discountOnInspection,
        totalInspectionFees,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        inspectionFee,
        setInspectionFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
