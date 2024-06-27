'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';
import { MdCalendarMonth } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';

interface IDatePickerWithRangeProps {
	className?: string;
	date?: DateRange;
	openPopover?: boolean;
	handleDatePicker: (date: any) => void;
	setOpenPopover?: (open: boolean) => void;
	resetDatePicker?: () => void;
}
export function DatePickerWithRange({
	className,
	date,
	handleDatePicker,
	openPopover,
	setOpenPopover,
	resetDatePicker,
}: IDatePickerWithRangeProps) {
	return (
		<div className={cn('grid gap-2 relative', className)}>
			<Popover open={openPopover} onOpenChange={setOpenPopover}>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[250px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<MdCalendarMonth className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'dd LLL y')} -{' '}
									{format(date.to, 'dd LLL y')}
								</>
							) : (
								format(date.from, 'dd LLL y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 bg-white" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={new Date()}
						selected={date}
						onSelect={handleDatePicker}
						numberOfMonths={2}
						disabled={(date) =>
							date > new Date() || date < new Date('2023-01-01')
						}
					/>
				</PopoverContent>
			</Popover>
			<FaTimes
				fontSize={8}
				className="absolute right-[10px] top-[13px]
				 hover:fill-slate-400 fill-slate-400 hover:cursor-pointer w-4 h-4"
				onClick={resetDatePicker}
			/>
		</div>
	);
}
