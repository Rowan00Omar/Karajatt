import { UserIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';
import React, { useState } from "react";

const UserProfile = () => {
  const [username] = useState("محمد أحمد");
  const [email] = useState("mohamed@example.com");
  const [orderHistory] = useState([
    {
      id: 1,
      partName: "Brake Pads",
      orderDate: "2024-04-10",
      price: "$45.00",
      seller: "AutoHub Store",
    },
    {
      id: 2,
      partName: "Engine Oil 5W-30",
      orderDate: "2024-03-15",
      price: "$30.00",
      seller: "CarCare Depot",
    },
    {
      id: 3,
      partName: "Air Filter",
      orderDate: "2024-02-22",
      price: "$18.00",
      seller: "FastParts Inc.",
    },
  ]);

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex justify-center" dir="rtl">
      <div className="w-full max-w-3xl flex flex-col gap-8 text-right">
        {/* User Info Card */}
        <div className="w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">بيانات المستخدم</h2>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">الأسم بالكامل</p>
            <p className="text-lg font-medium text-gray-900">{username}</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">البريد الألكتروني</p>
            <p className="text-lg font-medium text-gray-900">{email}</p>
          </div>
          <button className="w-32 mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition">
            حذف الحساب
          </button>
        </div>

        {/* Order History Table */}
        <div className="w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptRefundIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">الطلبات السابقة</h2>
          </div>
          <table className="min-w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 pr-4 text-right">اسم القطعة</th>
                <th className="py-2 pr-4 text-right">تاريخ الطلب</th>
                <th className="py-2 pr-4 text-right">السعر</th>
                <th className="py-2 text-right">اسم البائع</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {orderHistory.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4">{order.partName}</td>
                  <td className="py-3 pr-4">{order.orderDate}</td>
                  <td className="py-3 pr-4">{order.price}</td>
                  <td className="py-3">{order.seller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
