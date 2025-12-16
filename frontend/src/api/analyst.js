import api from "./axios";

export const askAnalyst = async (query) => {
  const res = await api.post("/assistant/ask", { query });
  return res.data; // { success, answer, meta }
};