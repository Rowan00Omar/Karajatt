import {
  UserIcon,
  ReceiptRefundIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment,useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderHistory,setOrderHistory] = useState([])
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        console.log(data);
        if (data) {
          const fullName = data.first_name + " " + data.last_name;
          setUsername(fullName);
          setEmail(data.email);
        }
        const res = await axios.get(`/api/auth/orders/history/${data.id}`);
        setOrderHistory(res.data)
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("");



  const handleDelete = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white py-25 px-4 flex justify-center" dir="rtl">
      <div className="w-full max-w-4xl flex flex-col gap-8 text-right">
        {/* User Info */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#4a60e9] text-white w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#4a60e9]">بيانات المستخدم</h2>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">الاسم الكامل</p>
            <p className="text-lg font-medium text-gray-900">{username}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-lg font-medium text-gray-900">{email}</p>
          </div>

          <button
            onClick={handleDelete}
            className="w-fit mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center gap-1"
          >
          <TrashIcon className="w-5 h-5" /> حذف الحساب
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptRefundIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">الطلبات السابقة</h2>
          </div>
          <table className="min-w-full text-sm text-right">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 pr-4">اسم القطعة</th>
                <th className="py-2 pr-4">تاريخ الطلب</th>
                <th className="py-2 pr-4">السعر</th>
                <th className="py-2">اسم البائع</th>
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

        {/* Confirmation Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    هل أنت متأكد من حذف الحساب؟
                  </Dialog.Title>
                  <div className="mt-4 text-sm text-gray-500">
                    سيتم حذف حسابك نهائيًا ولا يمكن استعادته.
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      إلغاء
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setIsModalOpen(false);
                        // perform actual delete here
                      }}
                    >
                      نعم، احذف
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default UserProfile;
