'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import Loader from '@/components/Loader';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import dateUtils from '@/lib/dateUtils';
import { IFlightData, SectorInfo } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import {
	addDays,
	differenceInDays,
	eachDayOfInterval,
	format,
	setHours,
	subDays,
} from 'date-fns';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import FlightSelection from './FlightSelection';
import Ticket from './Ticket';

interface Props {
	locations: ILocation[];
}

interface listDateFlight {
	key: string;
	value: string;
}

const FlightList: FC<Props> = ({ locations }) => {
	const {
		sectorInfos,
		getBookingTicketData,
		listFlightSegment,
		tmpSegment,
		setTmpSegment,
		setListFlightSegment,
		selectedAirlines,
		timeRange,
		setTimeRange,
		tripType,
	} = useBookingTickets();
	const [activeDate, setActiveDate] = useState<string>(
		listFlightSegment![0].departureDate
	);
	const [activeFlightSegment, setActiveFlightSegment] = useState<IFlightData>(
		listFlightSegment![0]
	);

	const [listDateFlight, setListDateFlight] = useState<
		listDateFlight[] | null
	>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Generates a date with range + 7 next days based on the provided start date.
	 */
	useEffect(() => {
		const departDate = dateUtils.convertDate(activeFlightSegment.departureDate);
		generateDateRage({ chooseDate: departDate });
	}, [activeFlightSegment]);

	useEffect(() => {
		//Hanle
		if (tmpSegment && listFlightSegment) {
			const activeFlight = listFlightSegment.find(
				(item) => item.flightId === activeFlightSegment?.flightId
			);
			handleSelectFlightSegment(activeFlight || listFlightSegment[0]);
		}
	}, [tmpSegment, listFlightSegment]);

	/**
	 * Generates a date with range + 7 next days based on the provided start date.
	 * @param {Object} options - The options for generating the date range.
	 * @param {string} options.chooseDate - The start date in string format.
	 */
	const generateDateRage = ({ chooseDate }: { chooseDate: string }) => {
		const currentDate = new Date();

		const diffInDays = differenceInDays(
			setHours(new Date(chooseDate), 0),
			setHours(currentDate.setHours(0, 0, 0, 0), 0)
		);
		let startDate: Date, endDate: Date;

		if (diffInDays < 3) {
			startDate = subDays(new Date(chooseDate), diffInDays);
			endDate = addDays(new Date(chooseDate), 6 - diffInDays);
		} else {
			startDate = subDays(new Date(chooseDate), 3);
			endDate = addDays(new Date(chooseDate), 3);
		}
		const dateRage = eachDayOfInterval({
			start: new Date(startDate),
			end: new Date(endDate),
		});
		const convertDateRage = dateRage.map((item) => ({
			value: format(new Date(item), 'EEEE dd/LL'),
			key: format(new Date(item), 'ddLLyy'),
		}));
		setListDateFlight(convertDateRage);
	};

	/**
	 * Handles the selection of a date.
	 * @param value - The selected date value.
	 */
	const handleSelectDate = async (value: any) => {
		setActiveDate(value.key);
		setIsLoading(true);

		try {
			const res = await getBookingTicketData(
				{
					departureAirport: sectorInfos![0]?.departureLocation,
					arrivalAirport: sectorInfos![0]?.arrivalLocation,
					departureDate: value.key,
					countTicket: activeFlightSegment.countTicket,
					airlineCode: selectedAirlines.join(','),
					tripType,
				},
				false
			);

			if (!res) return;

			setTmpSegment({
				...tmpSegment,
				[activeFlightSegment?.flightId ?? '']: res,
			} as Record<string, SectorInfo[]>);

			setActiveFlightSegment((prev: IFlightData) => ({
				...prev,
				departureDate: value.key,
				formatDepartureDate: format(
					new Date(dateUtils.convertDate(value.key)),
					'dd/LL'
				),
			}));

			setListFlightSegment((prev: IFlightData[]) => {
				return prev.map((item: IFlightData) => {
					if (
						activeFlightSegment &&
						item.flightId === activeFlightSegment.flightId
					) {
						return {
							...item,
							departureDate: value.key as string,
							formatDepartureDate: format(
								new Date(dateUtils.convertDate(value.key)),
								'dd/LL'
							),
						};
					}
					return item;
				});
			});
		} catch (error) {
			toast.error('Error fetching data');
			console.error('Error fetching data:', error);
		}

		setTimeRange([0, 23]);
		setIsLoading(false);
		const departDate = dateUtils.convertDate(value.key);
		generateDateRage({ chooseDate: departDate });
	};

	/**
	 * Handles the selection of a flight segment.
	 * @param activeFlight The selected flight segment.
	 * @returns {Promise<void>}
	 */
	const handleSelectFlightSegment = async (
		activeFlight: IFlightData
	): Promise<void> => {
		setActiveDate(activeFlight.departureDate);
		setActiveFlightSegment(activeFlight);
		setIsLoading(true);

		if (!tmpSegment[activeFlight.flightId]) {
			try {
				const res = await getBookingTicketData(
					{
						departureAirport: activeFlight.departureAirport,
						arrivalAirport: activeFlight.arrivalAirport,
						departureDate: activeFlight.departureDate,
						countTicket: activeFlight.countTicket,
						airlineCode: selectedAirlines.join(','),
						tripType,
					},
					false
				);

				if (!res) return;

				setTmpSegment({
					...tmpSegment,
					[activeFlight.flightId]: res,
				} as Record<string, SectorInfo[]>);
			} catch (error) {
				toast.error('Error fetching data');
				console.error('Error fetching data:', error);
			}
		}
		setTimeRange([0, 23]);
		setIsLoading(false);
		const departDate = dateUtils.convertDate(activeFlight.departureDate);
		generateDateRage({ chooseDate: departDate });
	};

	const isSegmentInTimeRange = (segment: SectorInfo): boolean => {
		const departureTime = parseInt(segment.departureTime.substring(0, 2));
		return departureTime >= timeRange[0] && departureTime <= timeRange[1];
	};

	const filteredSegments = tmpSegment[activeFlightSegment!.flightId]?.filter(
		(segment: SectorInfo) =>
			selectedAirlines.includes(segment.airLineCompany) &&
			isSegmentInTimeRange(segment)
	);

	return (
		<div className="bg-white w-full rounded-md">
			<FlightSelection
				locations={locations}
				listDateFlight={listDateFlight || []}
				activeDate={activeDate}
				handleSelectDate={handleSelectDate}
				activeFlightSegment={activeFlightSegment}
				handleSelectFlightSegment={handleSelectFlightSegment}
				listFlightSegment={listFlightSegment}
			/>

			<div className="px-4">
				<div className="flex flex-col gap-4 my-6">
					{isLoading ? (
						<Loader />
					) : filteredSegments?.length > 0 ? (
						filteredSegments?.map((item: SectorInfo, index: number) => (
							<Ticket
								key={index}
								flight={item}
								activeFlightSegment={activeFlightSegment}
								handleSelectFlightSegment={handleSelectFlightSegment}
							/>
						))
					) : (
						<p>NO FLIGHT</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FlightList;
