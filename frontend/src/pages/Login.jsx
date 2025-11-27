import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { loginUser, googleLoginUser } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log("change2---",e.target.name);
  };
  useEffect(() => {
    console.log("Updated form:", form);
  }, [form]);

  const handleSubmit = async () => {
    
    try {
      setLoading(true);
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
          <button className="flex-1 py-2 rounded-full bg-white text-black font-medium">
            Login
          </button>

          <Link
            to="/signup"
            className="flex-1 py-2 rounded-full bg-white/10 text-white text-center"
          >
            Sign Up
          </Link>
        </div>

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="your@email.com"
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="••••••"
        />

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded bg-white/10 mt-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="my-4 text-center opacity-80">Or continue with</div>

        <div className="flex flex-col gap-3">

          {/* GOOGLE LOGIN */}
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                const res = await googleLoginUser(cred.credential);
                localStorage.setItem("token", res.data.token);
                nav("/");
              } catch (err) {
                console.error(err);
                alert("Google Login Failed");
              }
            }}
            onError={() => alert("Google Login Failed")}
          />


        </div>
      </div>
    </div>
  );
}
