import React from 'react';
import { ILocation } from '@/types/types';
import dateUtils from '@/lib/dateUtils';
import { getDay, format } from 'date-fns';
import Image from 'next/image';

interface Props {
	locations: ILocation[];
	data: any;
	index: number;
}

const FlightDetail: React.FC<Props> = ({ locations, data, index }) => {
	const daysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	const departureLocation = locations.find(
		(item) => item.code === data.flight.departureLocation
	);
	const arrivalLocation = locations.find(
		(item) => item.code === data.flight.arrivalLocation
	);

	const renderDate = () => {
		const convertDate = dateUtils.convertDate(data.flight.arrivalDate);
		const dayOfWeek = getDay(new Date(convertDate));
		return `${daysOfWeek[dayOfWeek]}, ${format(
			new Date(convertDate),
			'dd/LL/yyyy'
		)}`;
	};

	const renderLocation = () => {
		return `${departureLocation?.name} - ${arrivalLocation?.name}`;
	};

	const renderTime = (time: string) => {
		return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
	};

	const renderTimeDuration = () => {
		return `${data.flight.timeDuration.substring(
			0,
			2
		)}hr ${data.flight.timeDuration.substring(2, 4)}min`;
	};

	return (
		<div className="w-full">
			{/* Header */}
			<div className="p-4 bg-sky-500 rounded-lg flex items-center gap-4">
				<span className="px-3 py-1 bg-white text-black rounded-lg text-2xl font-semibold">
					{index}
				</span>
				<div className="flex flex-col items-start justify-center text-white">
					<span className="text-xs">{renderDate()}</span>
					<span className="text-sm font-semibold">{renderLocation()}</span>
				</div>
			</div>
			{/* Body */}
			<div className="px-4 py-3 flex flex-col gap-2 font-semibold text-xs">
				<div className="flex justify-center items-center gap-2">
					<Image
						alt="logo"
						className="hidden md:block"
						height="36"
						width="36"
						src={`/images/${data.flight.airLineCompany}Airline.png`}
					/>
					<p className="text-base font-semibold text-sky-500">
						{data.flight.airLineCompany === 'VN' && 'Vietnam Airlines'}
						{data.flight.airLineCompany === 'VJ' && 'VietJet Air'}
						{data.flight.airLineCompany === 'QH' && 'Bamboo Airways'}
					</p>
				</div>
				<p className="text-center">
					{`${renderTime(data.flight.departureTime)} ${
						departureLocation?.airport
					} (${departureLocation?.code})`}
				</p>
				<p className="text-xl text-center">{renderTimeDuration()}</p>
				<p className="text-center">{`${renderTime(data.flight.arrivalTime)} ${
					arrivalLocation?.airport
				} (${arrivalLocation?.code})`}</p>
			</div>
		</div>
	);
};

export default FlightDetail;
