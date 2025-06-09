import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Trash2, Phone } from "lucide-react";
import Signup from "../Signup";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (userIdToDelete) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/auth/users/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh the users list after deletion
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleAddUser = () => {
    console.log("Opening add user modal");
    setIsAddingUser(true);
  };

  const indexOfLast = currentPage * usersPerPage;
  const currentUsers = users.slice(indexOfLast - usersPerPage, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
      <section className="w-full animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">إدارة المستخدمين</h2>
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
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {isAddingUser && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsAddingUser(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    إضافة مستخدم جديد
                  </h3>
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <Signup
                  flag={true}
                  onSuccess={() => {
                    console.log("User added successfully");
                    setIsAddingUser(false);
                    fetchUsers();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
