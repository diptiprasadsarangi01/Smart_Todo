import React from 'react'

export default function TaskCard({task}){
  return (
    <div className="card-glass border rounded-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm opacity-80 mt-1">{task.desc}</p>
          <div className="flex items-center gap-3 mt-3 text-xs opacity-90">
            <span className={`px-2 py-1 rounded text-[11px] ${task.priority === 'high' ? 'bg-red-600/60' : 'bg-yellow-500/40'}`}>{task.priority}</span>
            <span>{task.due}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-80">
          <button title="Complete" className="p-2 rounded hover:bg-white/5">✓</button>
          <button title="Edit" className="p-2 rounded hover:bg-white/5">✎</button>
          <button title="Delete" className="p-2 rounded hover:bg-white/5">🗑</button>
        </div>
      </div>
    </div>
  )
}
