'use client';
import Input from '@/components/Input/Input';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
	form: any;
	field: any;
	index: number;
}

const UserInfoDetail: React.FC<Props> = ({ form, field, index }) => {
	const [gender, setGender] = useState('mr');

	return (
		<div className="flex flex-col gap-4 py-4">
			<FormField
				control={form.control}
				name={`usersInfo.${index}.gender`}
				render={({ field }) => (
					<FormItem className="space-y-3">
						<FormLabel>Please select your gender</FormLabel>
						<FormControl>
							<RadioGroup
								onValueChange={(value) => {
									field.onChange(value);
									setGender(value);
								}}
								defaultValue={field.value}
								className="flex gap-8"
							>
								<FormItem className="flex items-center space-x-2 space-y-0">
									<FormControl>
										<RadioGroupItem
											value="mr"
											id="mr"
											className="text-sky-500 border-sky-500"
										/>
									</FormControl>
									<FormLabel className="font-normal">Mr</FormLabel>
								</FormItem>
								<FormItem className="flex items-center space-x-2 space-y-0">
									<FormControl>
										<RadioGroupItem
											value="mrs"
											id="mrs"
											className="text-sky-500 border-sky-500"
										/>
									</FormControl>
									<FormLabel className="font-normal">Mrs</FormLabel>
								</FormItem>
								<FormItem className="flex items-center space-x-2 space-y-0">
									<FormControl>
										<RadioGroupItem
											value="master"
											id="master"
											className="text-sky-500 border-sky-500"
										/>
									</FormControl>
									<FormLabel className="font-normal">Master</FormLabel>
								</FormItem>
								<FormItem className="flex items-center space-x-2 space-y-0">
									<FormControl>
										<RadioGroupItem
											value="miss"
											id="miss"
											className="text-sky-500 border-sky-500"
										/>
									</FormControl>
									<FormLabel className="font-normal">Miss</FormLabel>
								</FormItem>
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="w-full grid grid-cols-3 gap-2">
				<FormField
					control={form.control}
					name={`usersInfo.${index}.firstName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input placeholder="Please enter your First name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`usersInfo.${index}.middleName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Middle name</FormLabel>
							<FormControl>
								<Input placeholder="Please enter your Middle name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`usersInfo.${index}.lastName`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input placeholder="Please enter your Last name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{['master', 'miss'].includes(
					// form.getValues(`usersInfo.${index}.gender`)
					gender
				) && (
					<FormField
						control={form.control}
						name={`usersInfo.${index}.birthDay`}
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Date of birth</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(field.value as any, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value as any}
											onSelect={field.onChange}
											disabled={(date) => date > new Date()}
											initialFocus
											captionLayout="dropdown-buttons"
											fromYear={1930}
											toYear={2025}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			</div>
		</div>
	);
};

export default UserInfoDetail;
