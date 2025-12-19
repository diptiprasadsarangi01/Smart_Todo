import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";
import OTPInput from "../components/OTPInput"; 
import PasswordInput from "../components/PasswordInput"; 
import { sendOTP, verifyOTP, resetPasswordAPI } from "../api/auth";

export const showWarning = (msg) =>
  toast(msg, {
    icon: "⚠️",
    style: {
      background: "#f59e0b",
      color: "#000",
    },
  });
export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // OTP is an array of 6 strings (from your OTPInput)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // password states (used by PasswordInput)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // resend timer
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // start / manage timer when entering step 2
  useEffect(() => {
    let interval;
    if (step === 2) {
      setResendTimer(30);
      setCanResend(false);

      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  // ---------------------------
  // STEP 1: Send OTP
  // ---------------------------
  const handleSendOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    try {
      setEmailError("");
      setLoading(true);

      // use existing route
      await sendOTP(email);

      // clear otp boxes and go to otp step
      setOtp(["", "", "", "", "", ""]);
      setStep(2);
    } catch (err) {
      console.error("sendOTP error:", err);
      setEmailError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // RESEND OTP (dedicated)
  // ---------------------------
  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    try {
      setLoading(true);
      setOtp(["", "", "", "", "", ""]);
      await sendOTP(email);

      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error("resendOTP error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // STEP 2: Verify OTP
  // ---------------------------
  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      showWarning("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      // your existing verify route expects { email, code } (auth.js uses verifyOTP(email, code))
      await verifyOTP(email, code);
      setStep(3);
      // clear password states to be safe
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (err) {
      console.error("verifyOTP error:", err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // STEP 3: Reset Password
  // ---------------------------
  const handleResetPassword = async () => {
    // basic client-side validations
    if (!password) {
      setPasswordError("Enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    // optionally enforce minimal length here (PasswordInput already shows checks)
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordAPI(email, password);
      toast.success("Password reset successful. Please login.");;
      nav("/login");
    } catch (err) {
      console.error("resetPassword error:", err);
      alert(err.response?.data?.message || "Password reset failed");
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

        <h2 className="text-center font-bold mb-2 text-xl">Reset Password</h2>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <>
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="your@email.com"
            />
            {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

            <button
              onClick={handleSendOTP}
              disabled={loading || !email}
              className={`w-full py-3 rounded mt-2 ${loading || !email ? "bg-white/20 cursor-not-allowed" : "bg-white/10"}`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="text-center text-sm opacity-80 mt-3">
              Remembered your password? <a href="/login" className="text-blue-300 underline">Login</a>
            </p>
          </>
        )}

        {/* STEP 2: OTP VERIFY */}
        {step === 2 && (
          <>
            <p className="text-center mb-3 opacity-80">
              Enter the 6-digit OTP sent to <br/><span className="font-semibold">{email}</span>
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
                <button onClick={handleResendOTP} className="text-blue-400 underline">Resend OTP</button>
              ) : (
                <p className="text-gray-400">Resend OTP in <span className="font-semibold">{resendTimer}s</span></p>
              )}
            </div>

            <div className="text-center mt-3">
              <button onClick={() => setStep(1)} className="text-sm text-white/80 underline">Change email</button>
            </div>
          </>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <>
            <PasswordInput
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              setError={setPasswordError}
              error={passwordError}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading || !!passwordError || password.length < 6 || password !== confirmPassword}
              className="w-full py-3 rounded bg-white/10 mt-2 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

