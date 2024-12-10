"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { AvailabilityFormInput } from "@/app/participant/availability/__types/availability-form-input.type";

export default function DatePicker({
  field,
  option,
  date,
  placeholder,
}: {
  date: Date | undefined;
  option: "start" | "end";
  field: ControllerRenderProps<AvailabilityFormInput, "date_range">;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="bg-slate-300">
        <Button
          className={cn(
            "w-full text-left font-normal flex items-center justify-between bg-slate-300 hover:bg-slate-300 text-black !rounded-sm py-3",
            !date && "text-muted-foreground"
          )}
        >
          <>{date ? format(date, "PPP") : <span>{placeholder}</span>}</>
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => {
            field.onChange({
              ...field.value,
              [option]: e,
            });
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
