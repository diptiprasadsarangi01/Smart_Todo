import React, { useState } from "react";
import Input from "./Input";

export default function PasswordInput({ password, setPassword, confirmPassword, setConfirmPassword, setError, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // PASSWORD STRENGTH CHECK
  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@#$%^&*]/.test(password),
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

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    if (confirmPassword && val !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (password !== val) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <div>
      {/* PASSWORD */}
      <div className="relative">
        <Input
          label="Create Password"
          type={showPassword ? "text" : "password"}
          value={password}
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
      {password.length > 0 && (
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

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* RETURN strengthScore so parent can check before signup */}
      {/** We'll return as an object via props if needed **/}
    </div>
  );
}
