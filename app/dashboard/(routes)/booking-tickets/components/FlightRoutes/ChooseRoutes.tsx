'use client';
import Input from '@/components/Input/Input';
import { Button } from '@/components/ui/Button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import dateUtils from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { SectorInfo } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUserForm } from '../../hooks/useUserForm';
import ChooseAirlines from './ChooseAirline';
import FormFlight from './FormFlight';

interface IFormatLocations {
	[region: string]: ILocation[];
}
interface Props {
	locations: IFormatLocations;
}

const FormSchema = z.object({
	data: z.array(
		z.object({
			departureAirport: z.string().refine((value) => value.trim() !== '', {
				message: 'Departure airport is required',
			}),
			arrivalAirport: z.string().refine((value) => value.trim() !== '', {
				message: 'Arrival airport is required',
			}),
			departureDate: z.any().refine((value) => value !== '', {
				message: 'Departure date is required',
			}),
			returnDate: z.any().refine((value) => value !== '', {
				message: 'Return date is required',
			}),
		})
	),
});

interface FormSchemaSearch {
	data: {
		departureAirport: string;
		arrivalAirport: string;
		departureDate: string;
		returnDate?: string;
	}[];
	countTicket?: string;
}

const ChooseRoutes: FC<Props> = ({ locations }) => {
	const {
		getBookingTicketData,
		setTmpSegment,
		setListFlightSegment,
		tripType,
		setTripType,
		isLoading,
		selectedAirlines,
		handleAirlinesChange,
	} = useBookingTickets();

	const { formPassenger } = useUserForm();

	const [countTicket, setCountTicket] = useState<string>('1');
	const [flightCount, setFlightCount] = useState<number>(1);
	const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
		null
	);

	const form = useForm<FormSchemaSearch>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			data: [
				{
					departureAirport: '',
					arrivalAirport: '',
					departureDate: '',
					returnDate: undefined,
				},
			],
		},
	});

	const fieldArray = useFieldArray({
		control: form.control,
		name: 'data',
	});

	const addNewFlight = () => {
		if (flightCount < 9) {
			fieldArray.append({
				departureAirport: '',
				arrivalAirport: '',
				departureDate: '',
				returnDate: undefined,
			});
			setFlightCount((prevCount) => prevCount + 1);
			setSelectedDeparture(null);
		}
	};

	const handleChangeRadio = (e: string) => {
		setTripType(e);
		if (['multicity', 'oneway'].includes(e)) {
			form.reset({
				data: [
					{
						departureAirport: '',
						arrivalAirport: '',
						departureDate: '',
						returnDate: undefined,
					},
				],
			});
			return;
		}
		form.reset({
			data: [
				{
					departureAirport: '',
					arrivalAirport: '',
					departureDate: '',
					returnDate: undefined,
				},
			],
		});
	};

	/**
	 * Handles the flight search based on the provided data and trip type.
	 * @param data - The flight data.
	 * @param tripType - The type of trip (e.g., 'roundtrip', 'oneway').
	 */
	const handleFlightSearch = async (data: any, tripType: string) => {
		const flightData = data.flatMap((segment: any, index: number) => {
			if (tripType === 'roundtrip') {
				const departureLocation = {
					flightId: `flight-0${index}`,
					tripType: tripType,
					departureAirport: segment.departureAirport,
					arrivalAirport: segment.arrivalAirport,
					departureDate: format(new Date(segment.departureDate), 'ddLLyy'),
					formatDepartureDate: format(
						new Date(dateUtils.convertDate(segment.departureDate)),
						'dd/LL'
					),
					countTicket: countTicket,
				};

				const returnLocation = {
					flightId: `flight-0${index + 1}`,
					tripType: tripType,
					departureAirport: segment.arrivalAirport,
					arrivalAirport: segment.departureAirport,
					departureDate: format(new Date(segment.returnDate), 'ddLLyy'),
					formatDepartureDate: format(
						new Date(dateUtils.convertDate(segment.returnDate)),
						'dd/LL'
					),
					countTicket: countTicket,
				};

				return [departureLocation, returnLocation];
			} else {
				return [
					{
						flightId: `flight-0${index}`,
						tripType: tripType,
						departureAirport: segment.departureAirport,
						arrivalAirport: segment.arrivalAirport,
						departureDate: format(new Date(segment.departureDate), 'ddLLyy'),
						formatDepartureDate: format(
							new Date(dateUtils.convertDate(segment.departureDate)),
							'dd/LL'
						),
						countTicket: countTicket,
					},
				];
			}
		});

		if (countTicket.length > 0) {
			const res = await getBookingTicketData(
				{
					departureAirport: flightData[0].departureAirport,
					arrivalAirport: flightData[0].arrivalAirport,
					departureDate: flightData[0].departureDate,
					countTicket: countTicket,
					airlineCode: selectedAirlines.join(','),
					tripType,
				},
				true
			);

			if (!res) return;

			setTmpSegment({
				[flightData[0].flightId]: res,
			} as Record<string, SectorInfo[]>);
			setListFlightSegment(flightData);
		}
	};

	const updateCountTicket = () => {
		formPassenger.setValue('passengers', {
			adults: 1,
			children: 0,
			infants: 0,
		});

		const totalPassengers =
			formPassenger.getValues('passengers').adults +
			formPassenger.getValues('passengers').children +
			formPassenger.getValues('passengers').infants;

		setCountTicket(totalPassengers.toString());
	};

	useEffect(() => {
		updateCountTicket();
		setFlightCount(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tripType]);

	return (
		<div className="bg-white p-8 rounded-b-md">
			<div className="flex flex-col space-x-2 gap-4 mb-6">
				<RadioGroup
					defaultValue={tripType}
					className="flex gap-8"
					onValueChange={handleChangeRadio}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="oneway"
							id="oneway"
							className="text-sky-500 border-sky-500"
						/>
						<Label htmlFor="oneway">Oneway</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="roundtrip"
							id="roundtrip"
							className="text-sky-500 border-sky-500"
						/>
						<Label htmlFor="roundtrip">Round trip</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="multicity"
							id="multicity"
							className="text-sky-500 border-sky-500"
						/>
						<Label htmlFor="multicity">Multicity</Label>
					</div>
					<div className="-ml-0.5 w-px h-8 bg-gray-500"></div>
					{/* Number of Passengers */}
					<Form {...formPassenger}>
						<FormField
							control={formPassenger.control}
							name={`passengers`}
							render={({ field }) => (
								<FormItem>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												PASSENGERS ({countTicket})
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-80">
											<div className="grid gap-4">
												<div className="grid gap-2">
													<div className="grid grid-cols-3 items-center gap-4">
														<Label htmlFor="adults">Adults</Label>
														<Input
															{...field}
															type="number"
															min={1}
															max={9}
															id="adults"
															className="col-span-2 h-8"
															name={`passengers.adults`}
															value={field.value.adults}
															onChange={(e) => {
																const newValue = parseInt(e.target.value);
																field.onChange({
																	...field.value,
																	adults: newValue,
																});
																setCountTicket((prev) => {
																	const totalPassengers =
																		newValue +
																		field.value.children +
																		field.value.infants;
																	return totalPassengers.toString();
																});
															}}
														/>
													</div>
													<div className="grid grid-cols-3 items-center gap-4">
														<div className="flex flex-col">
															<Label htmlFor="children">Children</Label>
															<span className="text-[9px]">2-18 Years</span>
														</div>
														<Input
															{...field}
															id="children"
															type="number"
															min={0}
															max={8}
															className="col-span-2 h-8"
															name={`passengers.children`}
															value={field.value.children}
															onChange={(e) => {
																const newValue = parseInt(e.target.value);
																field.onChange({
																	...field.value,
																	children: newValue,
																});
																setCountTicket((prev) => {
																	const totalPassengers =
																		newValue +
																		field.value.adults +
																		field.value.infants;
																	return totalPassengers.toString();
																});
															}}
														/>
													</div>
													<div className="grid grid-cols-3 items-center gap-4">
														<div className="flex flex-col">
															<Label htmlFor="infants">Infants</Label>
															<span className="text-[9px]">0-2 Years</span>
														</div>
														<Input
															{...field}
															id="infants"
															type="number"
															min={0}
															max={3}
															className="col-span-2 h-8"
															name={`passengers.infants`}
															value={field.value.infants}
															onChange={(e) => {
																const newValue = parseInt(e.target.value);
																field.onChange({
																	...field.value,
																	infants: newValue,
																});
																setCountTicket((prev) => {
																	const totalPassengers =
																		newValue +
																		field.value.adults +
																		field.value.children;
																	return totalPassengers.toString();
																});
															}}
														/>
													</div>
												</div>
											</div>
										</PopoverContent>
									</Popover>
								</FormItem>
							)}
						/>
					</Form>
				</RadioGroup>

				<div className="flex">
					<FormFlight
						onSubmit={form.handleSubmit((data) => console.log(data))}
						form={form}
						tripType={tripType}
						fieldArray={fieldArray}
						locations={locations}
						selectedDeparture={selectedDeparture}
						setSelectedDeparture={setSelectedDeparture}
					/>
				</div>

				<div className="flex items-center">
					{tripType === 'multicity' && flightCount < 9 && (
						<Button onClick={addNewFlight}>Add new flight</Button>
					)}
				</div>
				<p className="font-semibold mt-6">Only search for airline:</p>
				<ChooseAirlines
					className="flex gap-6 mt-2"
					selectedAirlines={selectedAirlines}
					onAirlinesChange={handleAirlinesChange}
				/>
				<div className="flex items-center justify-center mt-8">
					<Button
						onClick={form.handleSubmit((data) => {
							handleFlightSearch(data.data, tripType);
						})}
						className="gap-2"
						disabled={isLoading}
					>
						Flight Search <Search />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChooseRoutes;
