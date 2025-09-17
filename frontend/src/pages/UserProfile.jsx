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
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [visiblePhoneOrderId, setVisiblePhoneOrderId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Pagination state
  const [pendingPage, setPendingPage] = useState(1);
  const [finishedPage, setFinishedPage] = useState(1);
  const rowsPerPage = 5;

  // Pagination logic
  const paginatedPending = pendingOrders.slice((pendingPage - 1) * rowsPerPage, pendingPage * rowsPerPage);
  const paginatedFinished = orderHistory.slice((finishedPage - 1) * rowsPerPage, finishedPage * rowsPerPage);
  const pendingTotalPages = Math.ceil(pendingOrders.length / rowsPerPage);
  const finishedTotalPages = Math.ceil(orderHistory.length / rowsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserInfo = async () => {
        console.log('fetching')
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        // Get user info
        const userResponse = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userResponse.data;
        if (userData) {
          setUserId(userData.id);
          const fullName = userData.first_name + " " + userData.last_name;
          setUsername(fullName);
          setEmail(userData.email);
          
          // Get passed orders
          const ordersResponse = await axios.get(
            `/api/auth/orders/passed/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log('fetchin1', ordersResponse)
          setOrderHistory(ordersResponse.data);

          // Get pending inspection orders
          const pendingResponse = await axios.get(
            `/api/auth/orders/pending/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log('fetchin2', pendingResponse)

          setPendingOrders(pendingResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "حدث خطأ في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {username}
            </p>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500">
              البريد الإلكتروني
            </p>
            <p className="text-base sm:text-lg font-medium text-gray-900 break-all">
              {email}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Link
              to={`/reset-forgotten-password/${token}`}
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

        {/* Pending Inspection Orders */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <MagnifyingGlassIcon className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-600">
              الطلبات قيد الفحص
            </h2>
          </div>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              لا توجد طلبات قيد الفحص
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-sm text-right">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-2 pr-4 text-xs sm:text-sm font-medium">رقم الطلب</th>
                      <th className="py-2 pr-4 text-xs sm:text-sm font-medium">اسم القطعة</th>
                      <th className="py-2 pr-4 text-xs sm:text-sm font-medium">تاريخ الطلب</th>
                      <th className="py-2 pr-4 text-xs sm:text-sm font-medium">السعر</th>
                      <th className="py-2 text-xs sm:text-sm font-medium">اسم البائع</th>
                      <th className="py-2 text-xs sm:text-sm font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {paginatedPending.map((order) => (
                      <tr key={order.uniqueKey} className="border-b hover:bg-gray-50">
                        <td className="py-3 pr-4 text-xs sm:text-sm">{order.id}</td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">{order.partName}</td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">{order.orderDate}</td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">{order.price}</td>
                        <td className="py-3 text-xs sm:text-sm">{order.seller}</td>
                        <td className="py-3 text-xs sm:text-sm text-yellow-600">بانتظار الفحص</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {pendingTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                      disabled={pendingPage === 1}
                      className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                    >
                      السابق
                    </button>
                    <span className="text-sm">
                      صفحة {pendingPage} من {pendingTotalPages}
                    </span>
                    <button
                      onClick={() => setPendingPage((p) => Math.min(pendingTotalPages, p + 1))}
                      disabled={pendingPage === pendingTotalPages}
                      className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptRefundIcon className="w-5 sm:w-6 h-5 sm:h-6 text-[#4a60e9]" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#4a60e9]">
              الطلبات المفحوصة السليمة
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-sm text-right">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">رقم الطلب</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">اسم القطعة</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">تاريخ الطلب</th>
                    <th className="py-2 pr-4 text-xs sm:text-sm font-medium">السعر</th>
                    <th className="py-2 text-xs sm:text-sm font-medium">اسم البائع</th>
                    <th className="py-2 text-xs sm:text-sm font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {orderHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        لا توجد طلبات مفحوصة سليمة
                      </td>
                    </tr>
                  ) : (
                    paginatedFinished.map((order) => (
                      <tr
                        key={order.uniqueKey}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 pr-4 text-xs sm:text-sm">{order.id}</td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">
                          {order.partName}
                        </td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">
                          {order.orderDate}
                        </td>
                        <td className="py-3 pr-4 text-xs sm:text-sm">
                          {order.price}
                        </td>
                        <td className="py-3 text-xs sm:text-sm">
                          {order.seller}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  const response = await axios.get(
                                    `/api/auth/orders/${order.id}/report/download`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                      responseType: "blob",
                                    }
                                  );

                                  // Create blob link to download
                                  const url = window.URL.createObjectURL(
                                    new Blob([response.data])
                                  );
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.setAttribute(
                                    "download",
                                    `inspection_report_${order.id}.pdf`
                                  );
                                  document.body.appendChild(link);
                                  link.click();

                                  // Clean up
                                  link.parentNode.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                } catch (error) {
                                  console.error(
                                    "Error downloading report:",
                                    error
                                  );
                                  const errorMessage =
                                    error.response?.data?.message ||
                                    "فشل في تحميل التقرير";
                                  setError(errorMessage);
                                }
                              }}
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            >
                              <DocumentTextIcon className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
                              تقرير الفحص
                            </button>
                            {order.inspectorPhone &&
                              (visiblePhoneOrderId === order.id ? (
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 whitespace-nowrap">
                                  <PhoneIcon className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
                                  {order.inspectorPhone}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setVisiblePhoneOrderId(order.id)
                                  }
                                  className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
                                >
                                  <PhoneIcon className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
                                </button>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {finishedTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setFinishedPage((p) => Math.max(1, p - 1))}
                    disabled={finishedPage === 1}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <span className="text-sm">
                    صفحة {finishedPage} من {finishedTotalPages}
                  </span>
                  <button
                    onClick={() => setFinishedPage((p) => Math.min(finishedTotalPages, p + 1))}
                    disabled={finishedPage === finishedTotalPages}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              )}
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
                      onClick={async () => {
                        setIsModalOpen(false);
                        try {
                          setLoading(true);
                          setError(null);
                          await axios.delete("/api/auth/me", {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          localStorage.removeItem("token");
                          localStorage.removeItem("userRole");
                          window.location.href = "/";
                        } catch (err) {
                          setError(
                            err.response?.data?.message || "فشل في حذف الحساب. حاول مرة أخرى."
                          );
                        } finally {
                          setLoading(false);
                        }
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
