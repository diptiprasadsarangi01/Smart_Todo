import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import WeekView from './pages/WeekView';
import Completed from './pages/Completed';
import AIAnalyst from './pages/AIAnalyst';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <>
      {/* 🔔 Global Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937", // dark bg
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="week" element={<WeekView />} />
          <Route path="completed" element={<Completed />} />
          <Route path="analyst" element={<AIAnalyst />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
