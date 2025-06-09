import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { KeyRound, User } from "lucide-react";

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdminInfo({
          username: `${response.data.first_name} ${response.data.last_name}`,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className="p-6" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            الملف الشخصي للمشرف
          </h2>
          <Link
            to="/forgot-password"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition flex items-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            تغيير كلمة المرور
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                معلومات المشرف
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المستخدم
              </label>
              <p className="text-lg font-medium text-gray-900">
                {adminInfo.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <p className="text-lg font-medium text-gray-900">
                {adminInfo.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
