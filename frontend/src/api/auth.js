import API from "./axios";

// ------------------------------
// 🔵 SEND OTP (Step 1)
// ------------------------------
export const sendOTP = async (email) => {
  return API.post("/auth/send-otp", { email });
};

// ------------------------------
// 🔵 VERIFY OTP (Step 2)
// ------------------------------
export const verifyOTP = async (email, code) => {
  return API.post("/auth/verify-otp", { email, code });
};

// ------------------------------
// 🟢 FINAL SIGNUP (Step 3)
// ------------------------------
export const signupUser = async (data) => {
  return API.post("/auth/signup", data);
};

// ------------------------------
// 🟢 NORMAL LOGIN
// ------------------------------
export const loginUser = async (data) => {
  return API.post("/auth/login", data);
};

// ------------------------------
// 🔵 GOOGLE LOGIN
// credential = response.credential
// ------------------------------
export const googleLoginUser = async (credential) => {
  return API.post("/auth/google", { credential });
};



