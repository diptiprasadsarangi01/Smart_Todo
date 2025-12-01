import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export default function DatePicker({ due, setDue, minDate }) {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse incoming due date safely
  const initialDate = due ? new Date(due + "T00:00:00") : null;

  const [date, setDate] = useState(
    initialDate && initialDate >= today ? initialDate : null
  );

  // ⭐ FIX: Sync internal date when external `due` changes (AI Assist)
  useEffect(() => {
    if (due) {
      const newDate = new Date(due + "T00:00:00");
      if (newDate >= today) {
        setDate(newDate);
      }
    }
  }, [due]);

  const handleSelect = (d) => {
    if (!d) return;

    const picked = new Date(d);
    picked.setHours(0, 0, 0, 0);

    if (picked < today) return;

    const yyyy = picked.getFullYear();
    const mm = String(picked.getMonth() + 1).padStart(2, "0");
    const dd = String(picked.getDate()).padStart(2, "0");

    const formatted = `${yyyy}-${mm}-${dd}`;

    setDate(picked);
    setDue(formatted);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded bg-white/5 border border-white/10 w-full hover:text-white hover:bg-white/10"
        >
          <CalendarIcon className="mr-2" />
          {date ? due : "Pick a due date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100 rounded-lg shadow-xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          fromDate={today}
          className="text-white"
          modifiers={{
            disabled: (day) => day < today,
          }}
          modifiersClassNames={{
            disabled: "opacity-30 pointer-events-none cursor-not-allowed",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
