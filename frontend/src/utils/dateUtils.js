export function formatShortDate(dateString) {
  const date = new Date(dateString);

  const options = {
    weekday: "short", // Mon, Tue
    day: "2-digit",   // 01, 02
    month: "short",   // Jan, Feb
  };

  return date.toLocaleDateString("en-GB", options);
}