import { useEffect, useRef, useState } from "react";

const SellerChat = ({ product, onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;

    const userMessage = `اريد صورة واضحة لـ ${product.name}`;
    setChatHistory([{ from: "user", text: userMessage }]);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { from: "seller", image: product.extraImages?.[0] },
      ]);
    }, 1000);

    hasSent.current = true;
  }, [product]);

  return (
    <div className="fixed bottom-5 right-5 bg-white border shadow-lg rounded-lg w-96 max-w-full z-50">
      <div className="p-4 border-b flex justify-between items-center bg-blue-100">
        <span className="font-semibold text-blue-900">محادثة مع البائع</span>
        <button onClick={onClose} className="text-red-500 text-lg">
          &times;
        </button>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto space-y-2 text-right">
        {chatHistory.map((msg, idx) =>
          msg.text ? (
            <div
              key={idx}
              className={`p-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-200 ml-auto"
                  : "bg-gray-200 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ) : (
            <img
              key={idx}
              src={msg.image}
              alt="رد البائع"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )
        )}
      </div>
    </div>
  );
};

export default SellerChat;
