'use client';

import { useState } from 'react';

import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerProps {
	selected?: any;
	onSelect?: (date: any) => void;
	label?: string;
	disabledDates?: Date;
}

export function DatePicker({
	selected,
	onSelect,
	label,
	disabledDates = subDays(new Date(), 1),
}: DatePickerProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const handleOnSelect: SelectSingleEventHandler = (date) => {
		onSelect?.(date);
		setIsPopoverOpen(false);
	};

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!selected && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{selected ? format(selected, 'PPP') : <span>{label}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 bg-white">
				<Calendar
					mode="single"
					selected={selected}
					onSelect={handleOnSelect}
					disabled={(date) => date < disabledDates}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
