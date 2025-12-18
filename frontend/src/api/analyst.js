import api from "./axios";

export const askAnalyst = async (query) => {
  console.log("📤 [AIAnalyst] Sending query to backend:", query);

  console.log(
    "🔐 [AIAnalyst] Authorization header:",
    api.defaults.headers.common["Authorization"]
  );

  const res = await api.post("/assistant/analyze", { query });

  console.log("📥 [AIAnalyst] Backend response:", res.data);

  return res.data; // { success, answer, meta }
};
