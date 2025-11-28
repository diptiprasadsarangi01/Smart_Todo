import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { sendOTP, verifyOTP, signupUser, googleLoginUser, checkEmail } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";

export default function Signup() {
  const nav = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  // Step states
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password
  const [checkingEmail, setCheckingEmail] = useState(false); // Loader for email check

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailError(""); // reset error on change
  };

  // ---------------------------
  // STEP 1: Check Email + Send OTP
  // ---------------------------
  const handleSendOTP = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      setCheckingEmail(true);
      setLoading(true);

      // Check email existence
      const res = await checkEmail(form.email);
      const { exists, hasPassword } = res.data;

      if (exists && hasPassword) {
        setEmailError("Email already registered. Please login.");
        return;
      }

      if (exists && !hasPassword) {
        // Google-only user → allow password setup
        setStep(3);
        return;
      }

      // New email → send OTP
      await sendOTP(form.email);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Failed to process email.");
    } finally {
      setCheckingEmail(false);
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await verifyOTP(form.email, otp);
      setStep(3);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Final Signup / Set Password
  const handleSignup = async () => {
    try {
      setLoading(true);
      const res = await signupUser(form);

      // Save token
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP / LOGIN
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await googleLoginUser(credentialResponse.credential);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Update UserContext
      setUser(res.data.user);

      nav("/");
    } catch (err) {
      console.error("Google Signup Error", err);
      alert("Google Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl card-glass shadow-xl border">

        <h2 className="text-center font-bold mb-2">AI Task Manager</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Link to="/login" className="flex-1 py-2 rounded-full bg-white/10 text-white text-center">
            Login
          </Link>
          <button className="flex-1 py-2 rounded-full bg-white text-black font-medium">
            Sign Up
          </button>
        </div>

        {/* ---------------- STEP 1: EMAIL ENTRY ---------------- */}
        {step === 1 && (
          <>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

            <button
              onClick={handleSendOTP}
              disabled={checkingEmail || loading || !form.email}
              className={`w-full py-3 rounded mt-2 ${checkingEmail || loading || !form.email ? "bg-white/20 cursor-not-allowed" : "bg-white/10"}`}
            >
              {checkingEmail ? "Checking..." : loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="my-4 text-center opacity-80">Or continue with</div>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => alert("Google Signup Failed")}
            />
          </>
        )}

        {/* ---------------- STEP 2: OTP ENTRY ---------------- */}
        {step === 2 && (
          <>
            <Input
              label="Enter OTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
              className={`w-full py-3 rounded mt-2 ${loading || !otp ? "bg-white/20 cursor-not-allowed" : "bg-white/10"}`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ---------------- STEP 3: PASSWORD ENTRY ---------------- */}
        {step === 3 && (
          <>
            <Input
              label="Create Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              onClick={handleSignup}
              disabled={loading || !form.password}
              className={`w-full py-3 rounded mt-2 ${loading || !form.password ? "bg-white/20 cursor-not-allowed" : "bg-white/10"}`}
            >
              {loading ? "Creating account..." : "Finish Signup"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
