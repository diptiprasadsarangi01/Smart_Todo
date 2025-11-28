// ---------------------------
// SIGNUP WITH PASSWORD STRENGTH + OTP TIMER
// ---------------------------

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import OTPInput from "../components/OTPInput";
import {
  sendOTP,
  verifyOTP,
  signupUser,
  googleLoginUser,
  checkEmail,
} from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";

export default function Signup() {
  const nav = useNavigate();
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [checkingEmail, setCheckingEmail] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---------------------------
  // RESEND OTP TIMER
  // ---------------------------
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;

    if (step === 2) {
      setResendTimer(30);
      setCanResend(false);

      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step]);

  // ---------------------------
  // PASSWORD STRENGTH CHECKER
  // ---------------------------
  const passwordChecks = {
    length: form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[@#$%^&*]/.test(form.password),
  };

  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;

  const strengthLabel =
    strengthScore <= 2
      ? "Weak"
      : strengthScore === 3
      ? "Moderate"
      : strengthScore === 4
      ? "Strong"
      : "Very Strong";

  const strengthColor =
    strengthScore <= 2
      ? "bg-red-500"
      : strengthScore === 3
      ? "bg-yellow-500"
      : strengthScore === 4
      ? "bg-blue-500"
      : "bg-green-500";

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });

    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (form.password !== val) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailError("");
  };

  // ---------------------------
  // STEP 1: SEND OTP
  // ---------------------------
  const handleSendOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    try {
      setCheckingEmail(true);
      setLoading(true);

      const res = await checkEmail(form.email);
      const { exists, hasPassword } = res.data;

      if (exists && hasPassword) {
        setEmailError("Email already registered. Please login.");
        return;
      }

      if (exists && !hasPassword) {
        setStep(3);
        return;
      }

      // Reset OTP boxes and timer
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(30);
      setCanResend(false);

      await sendOTP(form.email);
      setStep(2);
    } catch {
      alert("Failed to process email.");
    } finally {
      setCheckingEmail(false);
      setLoading(false);
    }
  };

  // ---------------------------
  // RESEND OTP (dedicated handler)
  // ---------------------------
  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    try {
      setLoading(true);
      setOtp(["", "", "", "", "", ""]); // clear previous OTP

      await sendOTP(form.email); // resend OTP

      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // STEP 2: VERIFY OTP
  // ---------------------------
  const handleVerifyOTP = async () => {
    if (otp.some((box) => box === "")) {
      alert("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(form.email, otp.join(""));
      setStep(3);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // STEP 3: FINAL SIGNUP
  // ---------------------------
  const handleSignup = async () => {
    if (strengthScore < 3) {
      alert("Password is too weak.");
      return;
    }

    try {
      setLoading(true);
      const res = await signupUser(form);

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await googleLoginUser(credentialResponse.credential);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      nav("/");
    } catch {
      alert("Google Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl card-glass shadow-xl border">
        <h2 className="text-center font-bold mb-2 text-xl">AI Task Manager</h2>

        {/* TABS */}
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

        {/* ----------------- STEP 1 ----------------- */}
        {step === 1 && (
          <>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

            <button
              onClick={handleSendOTP}
              disabled={checkingEmail || loading || !form.email}
              className={`w-full py-3 rounded mt-2 ${
                checkingEmail || loading ? "bg-white/20 cursor-not-allowed" : "bg-white/10"
              }`}
            >
              {checkingEmail
                ? "Checking..."
                : loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

            <div className="my-4 text-center opacity-80">Or continue with</div>
            <GoogleLogin onSuccess={handleGoogleSignup} />
          </>
        )}

        {/* ----------------- STEP 2 ----------------- */}
        {step === 2 && (
          <>
            <p className="text-center mb-3 opacity-80">
              Enter the 6-digit OTP sent to your email
            </p>

            <OTPInput otp={otp} setOtp={setOtp} />

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full py-3 rounded bg-white/10 mt-4 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND TIMER */}
            <div className="mt-4 text-center">
              {canResend ? (
                <button
                  onClick={handleResendOTP} // updated to dedicated handler
                  className="text-blue-400 underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-400">
                  Resend OTP in{" "}
                  <span className="font-semibold">{resendTimer}s</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* ----------------- STEP 3 ----------------- */}
        {step === 3 && (
          <>
            {/* PASSWORD INPUT */}
            <div className="relative">
              <Input
                label="Create Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-white/60"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* STRENGTH BAR */}
            {form.password.length > 0 && (
              <div className="mb-3">
                <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor}`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 opacity-80">{strengthLabel}</p>
              </div>
            )}

            {/* CHECKLIST */}
            <ul className="text-sm mb-3 space-y-1">
              <li className={passwordChecks.length ? "text-green-400" : "text-red-400"}>
                {passwordChecks.length ? "✔" : "✖"} Minimum 6 characters
              </li>
              <li className={passwordChecks.uppercase ? "text-green-400" : "text-red-400"}>
                {passwordChecks.uppercase ? "✔" : "✖"} Uppercase letter
              </li>
              <li className={passwordChecks.lowercase ? "text-green-400" : "text-red-400"}>
                {passwordChecks.lowercase ? "✔" : "✖"} Lowercase letter
              </li>
              <li className={passwordChecks.number ? "text-green-400" : "text-red-400"}>
                {passwordChecks.number ? "✔" : "✖"} Number
              </li>
              <li className={passwordChecks.special ? "text-green-400" : "text-red-400"}>
                {passwordChecks.special ? "✔" : "✖"} Symbol (@ # $ % ^ & *)
              </li>
            </ul>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <Input
                label="Retype Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-white/60"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            <button
              onClick={handleSignup}
              disabled={strengthScore < 3 || !!passwordError}
              className="w-full py-3 rounded bg-white/10 mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Finish Signup"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
