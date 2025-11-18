import React, { useState } from 'react'
import Input from '../components/Input'
import TaskCard from '../components/TaskCard'

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project proposal', desc: 'Finalize the Q4 project proposal and send to stakeholders', priority: 'high', due: '2025-11-11' },
    { id: 2, title: 'Review code changes', desc: 'Review PR #234 for the new feature implementation', priority: 'medium', due: '2025-11-11' },
  ])

  const addDummy = () => {
    const id = tasks.length + 1
    setTasks([
      { id, title: 'New task ' + id, desc: 'Task details', priority: 'medium', due: '2025-11-11' },
      ...tasks,
    ])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE (Add Task + Today's Tasks) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Add Task */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add New Task</h3>
          <Input label="Task Title" placeholder="Enter task title" />
          <Input textarea label="Description" placeholder="Enter task description" />
          
          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 rounded border border-white/8 bg-white/5">
              <option>Medium</option>
              <option>High</option>
              <option>Low</option>
            </select>
            <input
              className="p-3 rounded border border-white/8 bg-white/5"
              placeholder="dd-mm-yyyy"
            />
          </div>

          <button
            onClick={addDummy}
            className="mt-4 w-full py-3 rounded bg-white/10"
          >
            + Add Task
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Today's Tasks</h3>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>

        {/* 🟣 AI ASSISTANT (MOVES HERE ON TABLET/MOBILE) */}
        <aside className="lg:hidden card-glass p-6 rounded-lg">
          <h4 className="font-semibold mb-3">AI Assistant</h4>
          <div className="p-4 rounded bg-white/5 mb-4">
            Hello! I'm your AI assistant. How can I help you manage your tasks today?
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded border border-white/8 bg-white/5"
              placeholder="Ask me anything..."
            />
            <button className="p-3 rounded bg-white/10">➤</button>
          </div>
        </aside>
      </div>

      {/* AI Assistant (Desktop only) */}
      <aside className="hidden lg:block card-glass p-6 rounded-lg">
        <h4 className="font-semibold mb-3">AI Assistant</h4>
        <div className="p-4 rounded bg-white/5 mb-4">
          Hello! I'm your AI assistant. How can I help you manage your tasks today?
        </div>
        <div className="flex gap-2 mt-auto">
          <input
            className="flex-1 p-3 rounded border border-white/8 bg-white/5"
            placeholder="Ask me anything..."
          />
          <button className="p-3 rounded bg-white/10">➤</button>
        </div>
      </aside>

    </div>
  )
}
