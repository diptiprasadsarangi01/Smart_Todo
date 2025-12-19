import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";
import OTPInput from "../components/OTPInput";
import PasswordInput from "../components/PasswordInput";
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
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailError, setEmailError] = useState("");

  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP resend timer
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  /* ---------------------------
     RESEND OTP TIMER
  --------------------------- */
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

  /* ---------------------------
     HANDLERS
  --------------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailError("");
  };

  /* ---------------------------
     STEP 1: SEND OTP
  --------------------------- */
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

      setOtp(["", "", "", "", "", ""]);
      await sendOTP(form.email);
      setStep(2);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setCheckingEmail(false);
      setLoading(false);
    }
  };

  /* ---------------------------
     RESEND OTP
  --------------------------- */
  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    try {
      setLoading(true);
      setOtp(["", "", "", "", "", ""]);
      await sendOTP(form.email);
      setResendTimer(30);
      setCanResend(false);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     STEP 2: VERIFY OTP
  --------------------------- */
  const handleVerifyOTP = async () => {
    if (otp.some((o) => o === "")) {
      toast("Enter complete OTP", {
        icon: "⚠️",
        style: { background: "#f59e0b", color: "#000" },
      });
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(form.email, otp.join(""));
      setStep(3);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     STEP 3: FINAL SIGNUP
  --------------------------- */
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser({
        name: form.name,
        email: form.email,
        password, // ✅ correct password
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Account created successfully");
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     GOOGLE SIGNUP
  --------------------------- */
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await googleLoginUser(credentialResponse.credential);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Signed up with Google");
      nav("/");
    } catch {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     UI
  --------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl card-glass shadow-xl border">
        <h2 className="text-center font-bold mb-2 text-xl">
          AI Task Manager
        </h2>

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

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            {emailError && (
              <p className="text-red-500 text-sm">{emailError}</p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={checkingEmail || loading || !form.email}
              className="w-full py-3 rounded mt-2 bg-white/10 disabled:opacity-50"
            >
              {checkingEmail
                ? "Checking..."
                : loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

            <div className="my-4 text-center opacity-80">
              Or continue with
            </div>

            <GoogleLogin onSuccess={handleGoogleSignup} />
          </>
        )}

        {/* STEP 2 */}
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

            <div className="mt-4 text-center">
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-blue-400 underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-400">
                  Resend OTP in{" "}
                  <span className="font-semibold">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <PasswordInput
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={passwordError}
              setError={setPasswordError}
            />

            <button
              onClick={handleSignup}
              disabled={
                Boolean(passwordError) ||
                password.length === 0 ||
                loading
              }
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

