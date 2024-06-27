import { useBookingTickets } from '@/hooks/useBookingTickets';
import dateUtils from '@/lib/dateUtils';
import { IFlightData } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { FC } from 'react';
import DateItem from './DateItem';
import FlightItem from './FlightItem';

interface Props {
	locations: ILocation[];
	listDateFlight: listDateFlight[];
	activeDate?: string | null;
	handleSelectDate: (date: string | null) => void;
	listFlightSegment: IFlightData[] | null;
	activeFlightSegment?: IFlightData | null;
	handleSelectFlightSegment: (activeFlight: IFlightData) => void;
}

interface listDateFlight {
	key: string;
	value: string;
}

const FlightSelection: FC<Props> = ({
	locations,
	listDateFlight,
	activeDate,
	handleSelectDate,
	listFlightSegment,
	activeFlightSegment,
	handleSelectFlightSegment,
}) => {

	const { tmpSegment } = useBookingTickets();
	/**
	 * Determines if a date should be disabled based on the flight segments and active date.
	 * @param date - The date to check.
	 * @returns True if the date should be disabled, false otherwise.
	 */
	const handleDisabledDate = (date: string) => {
		const activeFlightId = activeFlightSegment?.flightId;
		const activeFlightIdx: number = listFlightSegment!.findIndex(
			(item: IFlightData) => item.flightId === activeFlightId
		);

		if (activeFlightIdx >= 0) {
			const prevFlight = listFlightSegment![activeFlightIdx - 1];
			const nextFlight = listFlightSegment![activeFlightIdx + 1];

			const currentDate = new Date(dateUtils.convertDate(date));

			if (
				prevFlight &&
				nextFlight &&
				Object.keys(prevFlight ?? {}).length > 0 &&
				Object.keys(nextFlight ?? {}).length > 0
			) {
				const prevFlightDate = new Date(
					dateUtils.convertDate(prevFlight.departureDate)
				);

				const nextFlightDate = new Date(
					dateUtils.convertDate(nextFlight.departureDate)
				);

				return currentDate < prevFlightDate || currentDate > nextFlightDate;
			} else if (prevFlight && Object.keys(prevFlight ?? {}).length > 0) {
				const prevFlightDate = new Date(
					dateUtils.convertDate(prevFlight.departureDate)
				);

				return currentDate < prevFlightDate;
			} else if (nextFlight && Object.keys(nextFlight ?? {}).length > 0) {
				const nextFlightDate = new Date(
					dateUtils.convertDate(nextFlight.departureDate)
				);

				return currentDate > nextFlightDate;
			}
			return false;
		}
	};

	const departureLocation = locations.find(
		(item) => item.code === activeFlightSegment?.departureAirport
	);
	const arrivalLocation = locations.find(
		(item) => item.code === activeFlightSegment?.arrivalAirport
	);

	const renderLocation = () => {
		return `${departureLocation?.name} (${departureLocation?.code}) - ${arrivalLocation?.name} (${arrivalLocation?.code})`;
	};

	return (
		<div className="py-6 px-8">
			<div className="flex flex-col">
				<div className="flex justify-center text-xl font-semibold pb-4">
					{renderLocation()}
				</div>
				<div className="flex justify-between items-center flex-1 pb-4 gap-2 w-full">
					{listDateFlight?.map((item: any, index: number) => (
						<DateItem
							key={item.key}
							dayOfWeeks={item?.value.split(' ')[0]}
							date={item?.value.split(' ')[1]}
							onClick={() => handleSelectDate(item)}
							isActive={item.key === activeDate}
							disabled={handleDisabledDate(item.key)}
						/>
					))}
				</div>
			</div>

			{listFlightSegment && listFlightSegment[0].tripType === 'roundtrip' && (
				<>
					<div className="flex justify-center text-xl font-semibold">
						Please select your flight itinerary
					</div>
					<div className="flex justify-between items-center flex-1 pt-4 gap-2 w-full">
						{listFlightSegment?.map((flight: IFlightData, index: number) => (
							<FlightItem
								key={index}
								segment={`${flight.departureAirport} - ${flight.arrivalAirport}`}
								date={flight.formatDepartureDate}
								onClick={() => handleSelectFlightSegment(flight)}
								isActive={
									flight.flightId === activeFlightSegment?.flightId &&
									flight.departureDate === activeDate
								}
								disabled={!tmpSegment[flight.flightId]}
							/>
						))}
					</div>
				</>
			)}

			{listFlightSegment && listFlightSegment[0].tripType === 'multicity' && (
				<>
					<div className="w-full flex justify-center text-xl font-semibold">
						Please select your flight itinerary
					</div>
					<div className="flex justify-between items-center flex-1 pt-4 gap-2 w-full">
						{listFlightSegment?.map((flight: IFlightData, index: number) => (
							<FlightItem
								key={index}
								segment={`${flight.departureAirport} - ${flight.arrivalAirport}`}
								date={flight.formatDepartureDate}
								onClick={() => handleSelectFlightSegment(flight)}
								isActive={
									flight.flightId === activeFlightSegment?.flightId &&
									flight.departureDate === activeDate
								}
								disabled={!tmpSegment[flight.flightId]}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default FlightSelection;
