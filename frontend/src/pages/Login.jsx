import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import Footer from "@/components/Footer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("يجب ملأ جميع البيانات!");
      return;
    }

    try {
      // Login request
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (token) {
        // Save token to localStorage
        localStorage.setItem("token", token);
        alert("Login successful!");

        // Fetch user info (including role)
        const userInfo = await axios.get("/api/auth/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role = userInfo.data.role;

        // Redirect based on role
        if (role === "admin") {
          navigate("/adminHome");
        } else if (role === "user") {
          navigate("/home");
        } else if (role === "seller") {
          navigate("/sellerHome");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed! Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-auto pb-48 mt-48">
      <form
        className="p-16 rounded-lg shadow-lg text-center flex flex-col w-1/3"
        onSubmit={handleSubmit}
        dir="rtl"
      >
        <div className="flex flex-row space-x-3 justify-center items-center">
          <LogIn className="text-babyJanaBlue self-center my-2" size={32} />
          <h2 className="text-3xl">تسجيل الدخول</h2>
        </div>
        {error && <p className="text-red-500 text-lg">{error}</p>}

        <Input
          className="rounded-md my-3"
          type="email"
          placeholder="ادخل البريد الألكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="rounded-md my-3"
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="bg-babyJanaBlue text-white text-xl cursor-pointer my-3"
          type="submit"
        >
          تسجيل الدخول
        </Button>

        <p className="mt-2.5">
          ليس لديك حساب؟
          <Link
            className="text-babyJanaBlue font-bold hover:underline"
            to="/signup"
          >
            انشاء حساب
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
