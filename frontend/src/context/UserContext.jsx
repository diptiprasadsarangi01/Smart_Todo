import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// 🔥 Auto-detect API URL (works in dev + production)
const API_BASE =
  import.meta.env.VITE_API_URL?.trim(); // fallback

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // 🟦 FETCH CURRENT USER (/api/user/me)
  // =========================================================
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If backend returned HTML → wrong URL
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ HTML received instead of JSON. Wrong API URL.");
          console.log("Received:", await res.text());
          setLoading(false);
          return;
        }

        if (!res.ok) {
          console.error("Failed to fetch user:", await res.text());
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================================================
  // 🟩 UPDATE USER (/api/user/update)
  // =========================================================
  const updateUser = async (updatedFields) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/user/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ HTML received instead of JSON.", await res.text());
        return;
      }

      if (!res.ok) {
        console.error("Failed to update user", await res.text());
        return;
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("❌ Error updating user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
