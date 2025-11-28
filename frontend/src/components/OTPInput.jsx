// utils/OTPInput.jsx
import React, { useEffect, useRef } from "react";

export default function OTPInput({ otp = [], setOtp }) {
  const inputRefs = useRef([]);

  // Auto focus first empty box
  useEffect(() => {
    const emptyIndex = otp.findIndex((digit) => digit === "");
    if (emptyIndex !== -1 && inputRefs.current[emptyIndex]) {
      inputRefs.current[emptyIndex].focus();
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center bg-white/10 text-white border border-white/20 rounded-lg text-xl"
        />
      ))}
    </div>
  );
}

