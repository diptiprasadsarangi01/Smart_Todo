import API from "./axios";

// ------------------------------
// 🟢 NORMAL SIGNUP
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
// credential = response.credential (from Google OneTap / Google Login Button)
export const googleLoginUser = async (credential) => {
  return API.post("/auth/google", { credential });
};

