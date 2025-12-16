export default function AnalystMessage({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-[85%] p-3 rounded-lg text-sm ${
        isUser
          ? "ml-auto bg-purple-600/40"
          : "mr-auto bg-white/5"
      }`}
    >
      {text}
    </div>
  );
}
