import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed! Please try again."
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
          <h2 className="text-3xl">Sign Up</h2>
        </div>
        {error && <p className="error-message text-red-500">{error}</p>}

        <Input
          className="rounded-md my-2"
          type="text"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          className="rounded-md my-2"
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          className="rounded-md my-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="rounded-md my-2"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          className="rounded-md my-2"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          className="bg-babyJanaBlue text-white text-xl cursor-pointer my-2"
          type="submit"
        >
          Sign Up
        </Button>

        <p className="mt-2.5 text-babyJanaBlue">
          Already have an account?{" "}
          <Link
            className="text-darkerJanaBlue font-bold hover:underline"
            to="/login"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
