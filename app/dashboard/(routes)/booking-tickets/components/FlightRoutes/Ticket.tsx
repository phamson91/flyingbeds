import { Button } from '@/components/ui/Button';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import {
	IFlightData,
	ISelectedTickets,
	SectorInfo,
} from '@/types/bookingTicket';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import PopoverConfirm from '../PopoverConfirm';

interface Props {
	flight: SectorInfo;
	activeFlightSegment: IFlightData;
	handleSelectFlightSegment: (activeFlight: IFlightData) => void;
}

const Ticket: FC<Props> = ({
	flight,
	activeFlightSegment,
	handleSelectFlightSegment,
}) => {
	const { selectedTickets, setSelectedTickets, listFlightSegment } =
		useBookingTickets();

	const renderTime = (time: string) => {
		return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
	};

	const [openPopoverBusiness, setOpenPopoverBusiness] =
		useState<boolean>(false);
	const [openPopoverEconomy, setOpenPopoverEconomy] = useState<boolean>(false);

	const handleConfirmTicket =
		({ type }: any) =>
		(e: React.MouseEvent<HTMLButtonElement>) => {};

	const handleSubmit =
		({ type, price, serviceClass }: any) =>
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const params = {
				type,
				price,
				serviceClass,
				flight,
			};
			setSelectedTickets((prev: ISelectedTickets) => ({
				flightInfo: {
					...prev.flightInfo,
					[activeFlightSegment.flightId]: params,
				},
				countTicket: activeFlightSegment.countTicket,
			}));

			// Find the index of the current active flight segment
			const currentIndex = listFlightSegment!.findIndex(
				(item) => item.flightId === activeFlightSegment.flightId
			);

			// Get the next segment
			const nextSegment =
				currentIndex < listFlightSegment!.length - 1
					? listFlightSegment![currentIndex + 1]
					: null;

			// Update the active flight segment state
			if (nextSegment) {
				handleSelectFlightSegment(nextSegment);
			}

			setOpenPopoverBusiness(false);
			setOpenPopoverEconomy(false);
		};

	const isFlightSelected =
		flight ===
		selectedTickets?.flightInfo[activeFlightSegment.flightId]?.flight;

	const isPriceSelected =
		isFlightSelected &&
		selectedTickets?.flightInfo[activeFlightSegment.flightId].type;

	return (
		<div
			className={`w-full flex justify-between items-center gap-8 border shadow rounded-md px-4 ${
				isFlightSelected && 'bg-slate-100'
			}`}
		>
			<div className="flex items-center gap-8 m-4">
				<Image
					alt="logo"
					className="hidden md:block"
					height="74"
					width="74"
					src={`/images/${flight.airLineCompany}Airline.png`}
				/>
				<div className="flex gap-8">
					<div className="flex items-center justify-center flex-col text-nowrap">
						<div className="text-sm">
							{flight?.departureLocation} - {flight?.arrivalLocation}
						</div>
						<div className="text-sm font-semibold">
							{renderTime(flight?.departureTime)} -{' '} {renderTime(flight?.arrivalTime)}
						</div>
					</div>
					<div className="flex items-center justify-center flex-col text-nowrap">
						<div className="text-sm">Stop</div>
						<div className="text-sm font-semibold text-nowrap">Non-stop</div>
					</div>
					<div className="flex items-center justify-center flex-col text-nowrap">
						<div className="text-sm">Aircraft</div>
						<div className="text-sm font-semibold text-nowrap">
							{flight?.typeOfCraft}
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center justify-center flex-col gap-1">
					<div className="text-sm font-semibold">Business</div>
					<PopoverConfirm
						title={
							<Button
								variant="outlineBlue"
								className={`py-0 px-2 h-9 ${
									isPriceSelected === 'Business' && 'bg-blue-500 text-white'
								}`}
								onClick={handleConfirmTicket({ type: 'Business' })}
							>
								{`${flight?.priceInfo?.business.price}$`}
							</Button>
						}
						openPopover={openPopoverBusiness}
						setOpenPopover={setOpenPopoverBusiness}
						onSubmit={handleSubmit({ type: 'Business', price: flight?.priceInfo?.business?.price, serviceClass: flight?.priceInfo?.business?.class })}
					/>
				</div>
				<div className="flex items-center justify-center flex-col gap-1">
					<div className="text-sm font-semibold">Economy</div>
					<PopoverConfirm
						title={
							<Button
								variant="outlineBlue"
								className={`py-0 px-2 h-9 ${
									isPriceSelected === 'Economy' && 'bg-blue-500 text-white'
								} `}
								onClick={handleConfirmTicket({ type: 'Economy' })}
							>
								{`${flight?.priceInfo?.economy.price}$`}
							</Button>
						}
						openPopover={openPopoverEconomy}
						setOpenPopover={setOpenPopoverEconomy}
						onSubmit={handleSubmit({ type: 'Economy', price: flight?.priceInfo?.economy?.price, serviceClass: flight?.priceInfo?.economy?.class })}
					/>
				</div>
			</div>
		</div>
	);
};

export default Ticket;
