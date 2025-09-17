import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing authentication data when accessing login page
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("يجب ملأ جميع البيانات!");
      return;
    }

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);

        const userInfo = await axios.get("/api/auth/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role = userInfo.data.role;

        localStorage.setItem("userRole", role);

        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event('authChange'));

        navigate(getRedirectPath(role), { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "حدث خطأ اثناء تسجيل الدخول يرجى المحاولة مرة أخرى"
      );
    }
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "seller":
        return "/seller";
      case "user":
        return "/user";
      default:
        return "/";
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول</title>
      </Helmet>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit} dir="rtl">
              {/* Header */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <LogIn className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">تسجيل الدخول</h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Input
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    type="email"
                    placeholder="البريد الألكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    type="password"
                    placeholder="كلمة السر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                type="submit"
              >
                تسجيل الدخول
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    to="/signup"
                  >
                    انشاء حساب
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
