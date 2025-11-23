import React from 'react'

export default function Input({ label, textarea, value, onChange, placeholder }) {
  return (
    <div>
      {label && <label>{label}</label>}
      {textarea ? (
        <textarea className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50" value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <input className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50" value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </div>
  );
}
