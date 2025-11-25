// src/api/analytics.js
import api from "./axios";

// Get total, completed, pending task stats
export const getTaskStats = async () => {
  const res = await api.get("/analytics/stats");
  return res.data; // { total, completed, pending }
};