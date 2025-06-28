import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const success = params.get("success") === "true";
  const amountCents = params.get("amount_cents");
  const message = params.get("data.message") || params.get("txn_response_code") || "";
  const orderId = params.get("order");
  const currency = params.get("currency") || "SAR";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className={`text-2xl font-bold mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
          {success ? "تم الدفع بنجاح" : "فشل الدفع"}
        </h2>
        <div className="mb-4">
          <p className="text-lg font-semibold">رقم الطلب: {orderId}</p>
          <p className="text-lg">المبلغ: {(amountCents / 100).toFixed(2)} {currency}</p>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        <Button className="w-full mt-4" onClick={() => navigate("/user")}>العودة للوحة المستخدم</Button>
      </div>
    </div>
  );
};

export default PaymentResult;
