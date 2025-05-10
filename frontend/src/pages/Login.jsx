import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed! Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-auto mt-48">
      <form
        className="p-16 rounded-lg shadow-lg text-center flex flex-col w-1/3"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row space-x-3 justify-center items-center">
          <LogIn className="text-babyJanaBlue self-center my-2" size={32} />
          <h2 className="text-3xl">Login</h2>
        </div>
        {error && <p className="text-red-500 text-lg">{error}</p>}

        <Input
          className="rounded-md my-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="rounded-md my-3"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="bg-babyJanaBlue text-white  text-xl cursor-pointer my-3"
          type="submit"
        >
          Login
        </Button>

        <p className="mt-2.5">
          Don't have an account?{" "}
          <Link
            className="text-babyJanaBlue font-bold hover:underline"
            to="/sign-up"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
