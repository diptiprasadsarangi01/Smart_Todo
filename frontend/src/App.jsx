import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WeekView from './pages/WeekView'
import Completed from './pages/Completed'
import Summarizer from './pages/Summarizer'


export default function App(){
return (
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />


  <Route path="/" element={<MainLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="week" element={<WeekView />} />
    <Route path="completed" element={<Completed />} />
    <Route path="summarizer" element={<Summarizer />} />
  </Route>


  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
)
}
