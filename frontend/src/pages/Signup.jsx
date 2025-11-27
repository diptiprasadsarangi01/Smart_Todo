import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { sendOTP, verifyOTP, signupUser, googleLoginUser } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  // Step states
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Send OTP
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await sendOTP(form.email);
      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
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

  // STEP 3: Final Signup
  const handleSignup = async () => {
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Link to="/login" className="flex-1 py-2 rounded-full bg-white/10 text-white text-center">Login</Link>
          <button className="flex-1 py-2 rounded-full bg-white text-black font-medium">Sign Up</button>
        </div>

        {/* ---------------- EMAIL ENTRY ---------------- */}
        {step === 1 && (
          <>
            <Input label="Full Name" name="name" onChange={handleChange} />
            <Input label="Email" name="email" onChange={handleChange} />
            <button onClick={handleSendOTP} className="w-full py-3 rounded bg-white/10 mt-2">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ---------------- OTP ENTRY ---------------- */}
        {step === 2 && (
          <>
            <Input label="Enter OTP" name="otp" onChange={(e) => setOtp(e.target.value)} />

            <button onClick={handleVerifyOTP} className="w-full py-3 rounded bg-white/10 mt-2">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ---------------- PASSWORD ENTRY ---------------- */}
        {step === 3 && (
          <>
            <Input label="Create Password" type="password" name="password" onChange={handleChange} />

            <button onClick={handleSignup} className="w-full py-3 rounded bg-white/10 mt-2">
              {loading ? "Creating account..." : "Finish Signup"}
            </button>
          </>
        )}

        {/* OAUTH */}
        {step === 1 && (
          <>
            <div className="my-4 text-center opacity-80">Or continue with</div>
            <GoogleLogin
              onSuccess={async (cred) => {
                try {
                  const res = await googleLoginUser(cred.credential);
                  localStorage.setItem("token", res.data.token);
                  nav("/");
                } catch {
                  alert("Google Signup Failed");
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}