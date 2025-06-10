import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, Phone, UserPlus } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Select, SelectItem } from "@/components/Select";

const Signup = ({ flag = false, onSuccess }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const requiredFields = [
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
    ];

    if (role === "seller") {
      requiredFields.push(bankName, accountNumber, address, phoneNumber);
    }

    if (requiredFields.some((field) => !field)) {
      setError("يجب ملأ جميع البيانات!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة!");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        phone_number: phoneNumber,
      };

      if (role === "seller") {
        userData.seller_info = {
          bank_name: bankName,
          account_number: accountNumber,
          address,
          phone_number: phoneNumber,
        };
      }

      const response = await axios.post("/api/auth/register", userData);

      if (flag && onSuccess) {
        onSuccess();
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form className="space-y-6" onSubmit={handleSubmit} dir="rtl">
      {/* Header */}
      {!flag && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <UserPlus className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h2>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <Input
            type="text"
            required
            placeholder="الاسم الأول"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Last Name */}
        <div>
          <Input
            type="text"
            required
            placeholder="الاسم الأخير"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Phone Number */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="tel"
            dir="ltr"
            placeholder="05xxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pr-10 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <Input
            type="password"
            required
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            type="password"
            required
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Role Selection */}
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors py-2 px-3"
          >
            <option value="user">مستخدم</option>
            <option value="seller">بائع</option>
            {flag && <option value="admin">مشرف</option>}
          </select>
        </div>
      </div>

      {/* Seller-specific fields */}
      {role === "seller" && (
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="اسم البنك"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="رقم الحساب"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="العنوان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        disabled={loading}
      >
        {loading ? "جاري التسجيل..." : flag ? "إضافة المستخدم" : "إنشاء حساب"}
      </Button>

      {!flag && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      )}
    </form>
  );

  if (flag) {
    return formContent;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          {formContent}
        </div>
      </div>
    </div>
  );
};

export default Signup;
