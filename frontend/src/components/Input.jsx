import React from 'react'

export default function Input({label, type='text', placeholder, className='', textarea=false, ...props}){
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm mb-2 opacity-80">{label}</label>}
      {textarea ? (
        <textarea className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50" placeholder={placeholder} {...props} />
      ) : (
        <input type={type} className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50" placeholder={placeholder} {...props} />
      )}
    </div>
  )
}