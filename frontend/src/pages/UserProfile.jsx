import {
  UserIcon,
  ReceiptRefundIcon,
  TrashIcon,
  DocumentTextIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showInspectionOnly, setShowInspectionOnly] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        if (data) {
          const fullName = data.first_name + " " + data.last_name;
          setUsername(fullName);
          setEmail(data.email);
        }
        const res = await axios.get(`/api/auth/orders/history/${data.id}`);
        setOrderHistory(res.data);
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

  const filteredOrders = showInspectionOnly
    ? orderHistory.filter((order) => order.status !== "pending")
    : orderHistory;

  return (
    <div
      className="min-h-screen bg-white py-0 px-4 flex justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-8 text-right pt-16 md:pt-20">
        {/* User Info */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="bg-[#4a60e9] text-white w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full text-base sm:text-lg font-semibold">
              {initials}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#4a60e9]">
                بيانات المستخدم
              </h2>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-500">الاسم الكامل</p>
            <p className="text-base sm:text-lg font-medium text-gray-900">{username}</p>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-base sm:text-lg font-medium text-gray-900 break-all">{email}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Link
              to="/forgot-password"
              className="w-full sm:w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
            >
              <KeyRound className="w-4 sm:w-5 h-4 sm:h-5" />
              تغيير كلمة المرور
            </Link>

            <button
              onClick={handleDelete}
              className="w-full sm:w-fit bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
            >
              <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5" /> حذف الحساب
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => setShowInspectionOnly(!showInspectionOnly)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <MagnifyingGlassIcon className="h-4 w-4 ml-2" />
              {showInspectionOnly ? "عرض جميع الطلبات" : "عرض طلبات الفحص فقط"}
            </button>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ReceiptRefundIcon className="w-5 sm:w-6 h-5 sm:h-6 text-[#4a60e9]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#4a60e9]">
                الطلبات السابقة
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-sm text-right">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">اسم القطعة</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">تاريخ الطلب</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">السعر</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">حالة الفحص</th>
                    <th className="py-2 text-xs sm:text-sm font-medium">اسم البائع</th>
                    <th className="py-2 text-xs sm:text-sm font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-4 text-xs sm:text-sm">{order.partName}</td>
                      <td className="py-3 pr-4 text-xs sm:text-sm">{order.orderDate}</td>
                      <td className="py-3 pr-4 text-xs sm:text-sm">{order.price}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "passed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "passed"
                            ? "تم الفحص - القطعة سليمة"
                            : order.status === "failed"
                            ? "تم الفحص - القطعة غير صالحة"
                            : "بانتظار الفحص"}
                        </span>
                      </td>
                      <td className="py-3 text-xs sm:text-sm">{order.seller}</td>
                      <td className="py-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {(order.status === "passed" ||
                            order.status === "failed") && (
                            <a
                              href={`/api/admin/inspection/orders/${order.id}/report`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            >
                              <DocumentTextIcon className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
                              تحميل تقرير الفحص
                            </a>
                          )}
                          {order.status === "failed" && order.inspectorPhone && (
                            <a
                              href={`tel:${order.inspectorPhone}`}
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
                            >
                              <PhoneIcon className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
                              اتصال بالفاحص
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsModalOpen(false)}
          >
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
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      إلغاء
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
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
