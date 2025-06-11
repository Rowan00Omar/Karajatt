import { useState } from "react";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import { ShoppingCart } from "lucide-react";

const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2  text-gray-400 hover:text-white"
        >
          <ShoppingCart className="w-6 h-6" />
        </button>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
      {isOpen && <Cart onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default CartButton;
