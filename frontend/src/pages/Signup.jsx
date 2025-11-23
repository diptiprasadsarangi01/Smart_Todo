import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { signupUser, googleLoginUser } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await signupUser(form);

      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl card-glass shadow-xl border">

        <h2 className="text-center font-bold mb-2">AI Task Manager</h2>
        <p className="text-center text-sm opacity-80 mb-6">
          Manage tasks intelligently
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Link
            to="/login"
            className="flex-1 py-2 rounded-full bg-white/10 text-white text-center"
          >
            Login
          </Link>

          <button className="flex-1 py-2 rounded-full bg-white text-black font-medium">
            Sign Up
          </button>
        </div>

        {/* Inputs */}
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          placeholder="your@email.com"
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••"
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded bg-white/10 mt-2 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="my-4 text-center opacity-80">Or continue with</div>

        {/* OAUTH */}
        <div className="flex flex-col gap-3">

          {/* Google Signup */}
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                const res = await googleLoginUser(cred.credential);
                localStorage.setItem("token", res.data.token);
                nav("/");
              } catch (err) {
                alert("Google Signup Failed");
              }
            }}
            onError={() => alert("Google Signup Failed")}
          />
        </div>
      </div>
    </div>
  );
}
