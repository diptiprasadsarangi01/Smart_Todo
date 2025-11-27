import React from "react";

export default function Input({ label, name, textarea, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="mb-3">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}

      {textarea ? (
        <textarea
          name={name}           // must have name
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50"
        />
      ) : (
        <input
          type={type}
          name={name}           // must have name
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 rounded border border-white/8 bg-white/5 text-white placeholder-white/50"
        />
      )}
    </div>
  );
}
