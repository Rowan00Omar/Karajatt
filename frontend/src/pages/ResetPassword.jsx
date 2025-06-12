import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { KeyRound, X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleClose = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "seller") {
      navigate("/seller");
    } else if (userRole === "user") {
      navigate("/user");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isLoggedIn && !currentPassword) {
      setError("يرجى إدخال كلمة المرور الحالية");
      setLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError("يرجى تعبئة جميع الحقول");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "/api/auth/reset-password",
        {
          token: token || authToken,
          password,
          ...(isLoggedIn && { currentPassword }),
        },
        {
          headers: authToken ? {
            Authorization: `Bearer ${authToken}`
          } : {}
        }
      );
      setMessage(response.data.message || "تم تغيير كلمة المرور بنجاح");
      setTimeout(() => {
        const userRole = localStorage.getItem("userRole");
        if (userRole === "seller") {
          navigate("/seller");
        } else if (userRole === "user") {
          navigate("/user");
        } else if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900/30 backdrop-blur-md px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md relative">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <form className="space-y-6" onSubmit={handleSubmit} dir="rtl">
            {/* Header */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <KeyRound className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {isLoggedIn ? "تغيير كلمة المرور" : "إعادة تعيين كلمة المرور"}
              </h2>
              <p className="text-gray-600 text-center">
                {isLoggedIn ? "قم بإدخال كلمة المرور الحالية والجديدة" : "أدخل كلمة المرور الجديدة"}
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {isLoggedIn && (
                <div>
                  <Input
                    type="password"
                    placeholder="كلمة المرور الحالية"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
              )}
              <div>
                <Input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
