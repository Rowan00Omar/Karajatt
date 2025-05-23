import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import Button from "./Button";

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <div
        className={`bg-white shadow-xl overflow-hidden transition-all duration-300 pointer-events-auto flex flex-col
          ${cartItems.length > 0 ? "w-80 h-[80vh]" : "w-64 h-64"}`}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-lg font-bold text-babyJanaBlue">سلة التسوق</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="p-4 text-center h-full flex items-center justify-center">
              <p className="text-gray-500">سلة التسوق فارغة</p>
            </div>
          ) : (
            <div className="px-4 pb-20">
              {" "}
              {/* Added padding-bottom for footer */}
              {cartItems.map((item) => (
                <div key={item.id} className="py-2 flex gap-3 items-center">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm text-babyJanaBlue">
                      {item.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 border rounded flex items-center text-gray-500 hover:text-red-500 justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm text-gray-500">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 border rounded flex items-center justify-center text-gray-500 hover:text-green-800 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-600">{item.price} ر.س</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer - Only visible when items exist */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 border-t bg-white p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium text-sm text-gray-500">
                المجموع:
              </span>
              <span className="font-bold text-babyJanaBlue">
                {cartTotal.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
            <Button className="w-full py-2 text-sm">اتمام الشراء</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
