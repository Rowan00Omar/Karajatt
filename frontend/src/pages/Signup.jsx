import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Select, SelectItem } from "@/components/Select";

const Signup = ({ flag = false }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      role === ""
    ) {
      setError("يجب ملأ جميع البيانات!");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة!");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        alert("تم إنشاء الحساب بنجاح!");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "فشل إنشاء الحساب! الرجاء المحاولة مرة أخرى."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} dir="rtl">
            {/* Header */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <LogIn className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">انشاء حساب</h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  type="text"
                  placeholder="الاسم الاول"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  type="text"
                  placeholder="اسم العائلة"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <Input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                type="email"
                placeholder="البريد الألكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Select
                value={role}
                onValueChange={setRole}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors text-right"
              >
                <SelectItem disabled value="">
                  نوع الحساب
                </SelectItem>
                <SelectItem value="user">مشتري</SelectItem>
                <SelectItem value="seller">بائع</SelectItem>
                {flag && <SelectItem value="admin">مدير</SelectItem>}
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              type="submit"
            >
              انشاء حساب
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب؟{" "}
                <Link
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  to="/login"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
