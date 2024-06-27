import { useBookingTickets } from '@/hooks/useBookingTickets';
import dateUtils from '@/lib/dateUtils';
import { ILocation } from '@/types/types';
import { format } from 'date-fns';
import { CalendarDays, PlaneLanding, PlaneTakeoff } from 'lucide-react';
import { FC } from 'react';

interface Props {
	locations: ILocation[];
}

const FlightDetail: FC<Props> = ({ locations }) => {
	const { selectedTickets } = useBookingTickets();

	const renderFlightDetail = () => {
		const flightDetail = [];
		let index = 1;
		for (const flightId in selectedTickets.flightInfo) {
			const departureLocation = locations.find(
				(item) =>
					item.code ===
					selectedTickets.flightInfo[flightId].flight.departureLocation
			);
			const arrivalLocation = locations.find(
				(item) =>
					item.code ===
					selectedTickets.flightInfo[flightId].flight.arrivalLocation
			);
			flightDetail.push(
				<div key={flightId} className="w-full border-b">
					<p className="text-xs font-semibold">
						{`Flight ${index.toString().padStart(2, '0')}`}
					</p>
					<div className="flex justify-between items-center py-4 w-full">
						<div className="flex justify-start items-center gap-4 w-[200px]">
							<PlaneTakeoff />
							<div className="flex flex-col justify-center items-start text-xs gap-2">
								<p>DEPARTING</p>
								<p className="font-semibold text-sky-500">
									{departureLocation?.name} ({departureLocation?.code})
								</p>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4 w-[200px]">
							<PlaneLanding />
							<div className="flex flex-col justify-center items-start text-xs gap-2">
								<p>ARRIVING</p>
								<p className="font-semibold text-sky-500">
									{arrivalLocation?.name} ({arrivalLocation?.code})
								</p>
							</div>
						</div>
						<div className="flex justify-start items-center gap-4">
							<CalendarDays />
							<div className="flex flex-col justify-center items-start text-xs gap-2">
								<p>DATE</p>
								<p className="font-semibold text-sky-500">
									{format(
										new Date(
											dateUtils.convertDate(
												selectedTickets.flightInfo[flightId].flight
													.departureDate
											)
										),
										'LLL dd, yyyy'
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
			);
			index++;
		}
		return flightDetail;
	};

	return (
		<div className="pb-4">
			<div className="pb-4 flex justify-between items-center">
				<div className="text-base font-medium">Flight Detail</div>
			</div>
			<div className="flex flex-col items-start gap-2 pl-4">
				{/* Flight Item */}
				{renderFlightDetail()}
			</div>
		</div>
	);
};

export default FlightDetail;
