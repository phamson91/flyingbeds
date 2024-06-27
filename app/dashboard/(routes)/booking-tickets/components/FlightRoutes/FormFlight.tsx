import { DatePicker } from '@/components/DatePicker';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import { IFlightData } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { subDays } from 'date-fns';
import { ArrowRightLeft, PlaneLanding, PlaneTakeoff, X } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface IFormatLocations {
	[region: string]: ILocation[];
}
interface Props {
	fieldArray: any;
	form: any;
	tripType: string;
	locations: IFormatLocations;
	onSubmit: any;
	selectedDeparture: string | null;
	setSelectedDeparture: (value: string | null) => void;
}

const FormFlight: FC<Props> = ({
	fieldArray,
	form,
	tripType,
	locations,
	onSubmit,
	selectedDeparture,
	setSelectedDeparture,
}) => {
	const { setListFlightSegment } = useBookingTickets();
	const [departureDate, setDepartureDate] = useState<Date>();
	const [returnDate, setReturnDate] = useState<Date>();

	useEffect(() => {
		setDepartureDate(subDays(new Date(), 1));
		setSelectedDeparture(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tripType]);

	useEffect(() => {
		setListFlightSegment((value: IFlightData[]) => []);
	}, [setListFlightSegment, departureDate, returnDate]);

	/**
	 * Renders the location options for the flight form.
	 *
	 * @returns {JSX.Element[]} An array of JSX elements representing the location options.
	 */
	const renderLocation = () => {
		const rows = [];
		for (let region in locations) {
			rows.push(
				<SelectGroup key={region}>
					<SelectLabel>{region}</SelectLabel>
					{locations[region].map((item: any, index: any) => (
						<SelectItem
							key={index}
							value={item.code}
							disabled={item.code === selectedDeparture}
						>
							{item.name}
						</SelectItem>
					))}
				</SelectGroup>
			);
		}
		return rows;
	};

	const removeField = (index: number) => {
		fieldArray.remove(index);
		setListFlightSegment((value: IFlightData[]) => []);
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-4 items-center"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				{fieldArray.fields.map((field: any, index: any) => (
					<div
						className="w-full grid grid-cols-[200px_30px_200px_200px_200px_20px] grid-flow-col gap-4"
						key={field.id}
					>
						<FormField
							control={form.control}
							name={`data.${index}.departureAirport`}
							render={({ field }) => {
								return (
									<FormItem>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												setSelectedDeparture(value);
											}}
										>
											<FormControl>
												<SelectTrigger>
													<PlaneTakeoff />
													<SelectValue placeholder="FROM" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>{renderLocation()}</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<div className="flex items-center">
							<ArrowRightLeft />
						</div>

						<FormField
							control={form.control}
							name={`data.${index}.arrivalAirport`}
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
										}}
									>
										<FormControl>
											<SelectTrigger>
												<PlaneLanding />
												<SelectValue placeholder="TO" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>{renderLocation()}</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`data.${index}.departureDate`}
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormControl>
										<DatePicker
											label="DEPARTURE DATE"
											selected={field.value}
											onSelect={(value: string) => {
												field.onChange(value);
												setDepartureDate(new Date(value));
											}}
											disabledDates={
												index === 0 ? subDays(new Date(), 1) : departureDate
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{tripType === 'roundtrip' && (
							<FormField
								control={form.control}
								name={`data.${index}.returnDate`}
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormControl>
											<DatePicker
												label="RETURN DATE"
												selected={field.value}
												onSelect={(value: string) => {
													field.onChange(value);
													setReturnDate(new Date(value));
												}}
												disabledDates={departureDate}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className="flex self-center">
							{tripType === 'multicity' && (
								<X
									className="text-lg text-gray-500"
									onClick={() => removeField(index)}
								/>
							)}
						</div>
					</div>
				))}
			</form>
		</Form>
	);
};

export default FormFlight;
