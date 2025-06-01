import { useEffect, useState } from 'react';
import axios from "axios";
import { UserPlus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Signup from "@/pages/Signup";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [events, setEvents] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.id) {
          setUserId(response.data.id);
          fetchUsers(response.data.id, token);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError(error.response?.data?.message || "Failed to fetch user information");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchUsers = async (currentUserId, token) => {
    try {
      const res = await axios.get("/api/auth/getAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userIdToDelete) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/auth/deleteUser/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userIdToDelete));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const toggleUserExpansion = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setEvents([]);
    } else {
      setExpandedUserId(userId);
      try {
        // You'll need to implement this API endpoint
        const response = await axios.get(`/api/users/${userId}/events`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Error fetching user events:", error);
        setEvents([]);
      }
    }
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
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>إضافة مستخدم</span>
        </button>
      </div>
    );
  }

  return (
    <section className="w-full animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">إدارة المستخدمين</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      <div className="grid gap-4">
        {currentUsers.map((user) => (
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
                  <p className="text-gray-600 text-sm mt-1">{user.email || "لا يوجد بريد إلكتروني"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100">{user.role}</span>
                  <button
                    onClick={() => toggleUserExpansion(user.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedUserId === user.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Expanded User Details */}
              {expandedUserId === user.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">نشاط المستخدم:</h4>
                  {events.length > 0 ? (
                    <ul className="space-y-2">
                      {events.map((event) => (
                        <li key={event.id} className="text-sm text-gray-600">
                          {event.description} - {new Date(event.timestamp).toLocaleDateString('ar-SA')}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">لا يوجد نشاط حالياً</p>
                  )}
                </div>
              )}
            </div>
          )
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {isAddingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة مستخدم جديد</h3>
              <button
                onClick={() => setIsAddingUser(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Signup flag={true} />
          </div>
        </div>
      )}
    </section>
  );
} 