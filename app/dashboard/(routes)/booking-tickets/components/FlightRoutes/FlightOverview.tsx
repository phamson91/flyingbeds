'use client';
import Loader from '@/components/Loader';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import {
	IFlightData,
	ISelectedTickets,
	SectorInfo,
} from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { FC, useEffect, useState } from 'react';
import FilterInfo from './FilterInfo';
import FlightList from './FlightList';
interface Props {
	locations: ILocation[];
}

const FlightOverview: FC<Props> = ({ locations }) => {
	const {
		isLoading,
		tripType,
		listFlightSegment,
		setListFlightSegment,
		setSelectedTickets,
		setTimeRange
	} = useBookingTickets();

	useEffect(() => {
		setListFlightSegment((value: IFlightData[]) => []);
		setSelectedTickets((value: ISelectedTickets) => ({
			countTicket: '',
			flightInfo: {},
		}));
		setTimeRange([0, 23]);
	}, [tripType, setListFlightSegment, setSelectedTickets, setTimeRange]);

	return (
		<>
			{isLoading && <Loader />}
			{listFlightSegment && listFlightSegment.length > 0 && (
				<div className="w-full text-lg my-8 flex gap-4">
					<FlightList locations={locations} />
					<FilterInfo locations={locations} />
				</div>
			)}
		</>
	);
};

export default FlightOverview;
