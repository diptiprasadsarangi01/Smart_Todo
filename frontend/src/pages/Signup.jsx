import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'

export default function Signup(){
  const nav = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl card-glass shadow-xl border">
        <h2 className="text-center font-bold mb-2">AI Task Manager</h2>
        <p className="text-center text-sm opacity-80 mb-6">Manage tasks intelligently</p>

        <div className="flex gap-2 mb-6">
          <Link to="/login" className="flex-1 py-2 rounded-full bg-white/10 text-white text-center">Login</Link>
          <button className="flex-1 py-2 rounded-full bg-white text-black font-medium">Sign Up</button>
        </div>

        <Input label="Full Name" placeholder="John Doe" />
        <Input label="Email" placeholder="your@email.com" />
        <Input label="Password" type="password" placeholder="••••••" />

        <button onClick={()=>nav('/')} className="w-full py-3 rounded bg-white/10 mt-2">Sign Up</button>

        <div className="my-4 text-center opacity-80">Or continue with</div>
        <div className="flex gap-3">
          <button className="flex-1 py-2 rounded bg-white/10">G Google</button>
          <button className="flex-1 py-2 rounded bg-white/10">in LinkedIn</button>
        </div>
      </div>
    </div>
  )
}
