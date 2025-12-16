const actions = [
  "What should I focus on today?",
  "Show my urgent tasks",
  "Pending tasks today",
  "Work-related tasks",
  "Tasks due tomorrow",
];

export default function AnalystQuickActions({ onSelect }) {
  return (
    <>
      <h4 className="font-semibold mb-3">Quick Insights</h4>
      <div className="space-y-2">
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => onSelect(a)}
            className="w-full text-left p-3 rounded bg-white/5 hover:bg-white/10 text-sm"
          >
            {a}
          </button>
        ))}
      </div>
    </>
  );
}
