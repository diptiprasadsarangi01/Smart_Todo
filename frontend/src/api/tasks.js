// src/api/tasks.js
import api from "./axios";

export const getTodayTasks = async () => {
  const res = await api.get("/tasks/today");
  return res.data; // array of tasks
};

export const addTask = async ({ title, summary, priority, dueDate }) => {
  const res = await api.post("/tasks/add", { title, summary, priority, dueDate });
  return res.data; // { message, task }
};

export const updateTask = async (id, payload) => {
  const res = await api.put(`/tasks/${id}`, payload);
  return res.data; // updated task
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
