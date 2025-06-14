"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateString } from "@/app/utils/format-date";

interface DatePickerProps {
	date: Date;
	setDate: (date: Date) => void;
	className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal bg-[#222] text-zinc-300 hover:bg-[#111] hover:text-zinc-100 border-none",
						className
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? formatDateString(date) : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 bg-[#111] text-zinc-300 border-none">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
					className="border-none"
					required
				/>
			</PopoverContent>
		</Popover>
	);
}
