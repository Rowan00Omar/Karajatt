import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Trash2, Phone } from "lucide-react";
import Signup from "../Signup";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
    fetchCurrentUserId();
  }, []);

  const fetchCurrentUserId = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("/api/auth/userInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(response.data.id);
    } catch (err) {
      console.error("Error fetching current user ID:", err);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.users) {
        setUsers(response.data.users);
      } else {
        setError("No users data received");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId) => {
    if (userId === currentUserId) {
      toast.error("لا يمكنك حذف حسابك الخاص.");
      return;
    }
    setUserIdToDelete(userId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/auth/users/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف المستخدم بنجاح.");
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setUserIdToDelete(null);
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  const filteredUsers = users.filter(user => {
    if (selectedRole === "all") return true;
    return user.role === selectedRole;
  });

  const indexOfLast = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLast - usersPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">خطأ</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 mb-4">لا يوجد مستخدمين حالياً</p>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>إضافة مستخدم</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>إدارة المستخدمين</title>
      </Helmet>
      <section className="w-full animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">إدارة المستخدمين</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">جميع المستخدمين</option>
                <option value="admin">المشرفين</option>
                <option value="seller">البائعين</option>
                <option value="user">المستخدمين</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            <span>إضافة مستخدم</span>
          </button>
        </div>

        <div className="grid gap-4">
          {currentUsers.map((user) =>
            user.role === "master" ? null : (
              <div
                key={user.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.first_name || "مستخدم بدون اسم"} {user.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {user.email || "لا يوجد بريد إلكتروني"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="inline-flex items-center">
                        <Phone className="w-4 h-4 ml-1" />
                        {user.phone_number || "لا يوجد رقم هاتف"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.role === "admin"
                          ? "bg-indigo-100 text-indigo-800"
                          : user.role === "seller"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin"
                        ? "مشرف"
                        : user.role === "seller"
                        ? "بائع"
                        : "مستخدم"}
                    </span>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors font-bold ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors font-bold ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              التالي
            </button>
          </div>
        )}
      </section>

      {isAddingUser && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
              onClick={() => setIsAddingUser(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-right align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
              <div className="bg-white px-6 py-8">
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      إضافة مستخدم جديد
                    </h3>
                    <button
                      onClick={() => setIsAddingUser(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <Signup flag={true} onSuccess={() => {
                  setIsAddingUser(false);
                  fetchUsers();
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">تأكيد حذف المستخدم</h3>
            <p className="mb-6">هل أنت متأكد أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">حذف</button>
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
