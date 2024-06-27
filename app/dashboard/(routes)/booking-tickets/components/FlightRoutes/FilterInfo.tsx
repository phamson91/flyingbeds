'use client';
import { Button } from '@/components/ui/Button';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import { ECurrentPage } from '@/types/booking';
import { ILocation } from '@/types/types';
import { ArrowRight, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ChooseAirlines from './ChooseAirline';
import TicketInfo from './TicketInfo';
import TimeRange from './TimeRange';
import {
	ICountPassenger,
	IFlightData,
	IPassengers,
} from '@/types/bookingTicket';
import formatNumber from '@/lib/formatNumber';
import useLeaveConfirmation from '@/hooks/useLeaveConfirmation';
import { useUserForm } from '../../hooks/useUserForm';
import { PATHS } from '@/lib/paths';
import ShowPriceDetail from '../ShowPriceDetail';

interface Props {
	locations: ILocation[];
}

const FilterInfo: FC<Props> = ({ locations }) => {
	const router = useRouter();
	const pathname = usePathname();
	const {
		tmpSegment,
		selectedTickets,
		listFlightSegment,
		selectedAirlines,
		handleAirlinesChange,
		bookingSession,
		setBookingSession,
		tripType,
	} = useBookingTickets();
	const { formPassenger, pricePerUser, setPricePerUser } = useUserForm();
	const [isTotalPrice, setIsTotalPrice] = useState<boolean>(false);
	const [showTotalPrice, setShowTotalPrice] = useState(false);

	const [isLeaveConfirm, setIsLeaveConfirm] = useState<boolean>(true);
	const [activeFlightSegment, setActiveFlightSegment] = useState<IFlightData>(
		listFlightSegment![0]
	);
	const [countUser, setCountUser] = useState<ICountPassenger>({
		adults: 1,
		children: 0,
		infants: 0,
	});

	useEffect(() => {
		const passengerValues = formPassenger.getValues('passengers');
		setCountUser(passengerValues);
	}, [formPassenger]);

	const { confirmationDialog } = useLeaveConfirmation({
		shouldPreventRouteChange: isLeaveConfirm,
		sessionInfo: bookingSession!,
		message:
			'Are you sure you want to leave? All the flight information will be lost',
	});

	const renderTicketInfo = () => {
		if (Object.keys(selectedTickets.flightInfo ?? {}).length === 0) {
			return (
				<p className="text-center font-semi">
					{"I haven't chosen any flights."}
				</p>
			);
		}
		const rows: any = [];
		let totalPrice: number = 0;
		let index: number = 0;
		for (const flightId in selectedTickets.flightInfo) {
			index = index + 1;
			totalPrice += selectedTickets.flightInfo[flightId]?.price;
			rows.push(
				<TicketInfo
					key={flightId}
					data={selectedTickets.flightInfo[flightId]}
					locations={locations}
					index={index}
					passenger={countUser}
				/>
			);
		}
		rows.push(
			<p
				key={0}
				className="text-xl text-center pt-5 font-semibold"
			>{`Price: $ ${formatNumber(
				totalPrice * Number(selectedTickets.countTicket)
			)}`}</p>
		);
		return rows;
	};

	const handleShowPriceDetail = async () => {
		setIsTotalPrice(true);
		setShowTotalPrice(true);

		const passengerCodes: Record<string, string> = {
			ADT: countUser.adults > 0 ? 'ADT' : '',
			CHD: countUser.children > 0 ? 'CHD' : '',
			INF: countUser.infants > 0 ? 'INF' : '',
		};

		const passengersArray = Object.values(passengerCodes).filter(
			(code) => code !== ''
		);

		try {
			const orgDesDetails = [];
			for (const flightId in selectedTickets.flightInfo) {
				const flight = selectedTickets.flightInfo[flightId];
				orgDesDetails.push({
					origin: flight.flight.departureLocation,
					destination: flight.flight.arrivalLocation,
					depDate: flight.flight.departureDate,
					arrivalDate: flight.flight.arrivalDate,
					airlineCompany: flight.flight.airLineCompany,
					flightIdentifier: flight.flight.flightIdentifier,
					classOfService: flight.serviceClass,
				});
			}

			const response = await fetch(PATHS.API_PRICE_WITHOUT_PNR, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sessionId: bookingSession?.sessionId,
					sequenceNumber: bookingSession?.sequenceNumber,
					securityToken: bookingSession?.securityToken,
					orgDesDetail: orgDesDetails,
					passengers: passengersArray,
				}),
			});

			if (!response.ok) {
				const { error } = await response.json();
				setIsTotalPrice(false);
				toast.error(error);
				return;
			}
			const dataPriceDetail = await response.json();

			if (dataPriceDetail) {
				setPricePerUser(dataPriceDetail.faresInfo);
				setBookingSession({
					sessionId: dataPriceDetail.newSessionId,
					sequenceNumber: dataPriceDetail.newSequenceNumber,
					securityToken: dataPriceDetail.newSecurityToken,
				});
			}
		} catch (error: any) {
			toast.error(error.message);
			console.log(error);
		}
		setIsTotalPrice(false);
	};

	const handlePassengerInformation = () => {
		setIsLeaveConfirm((prev) => !prev);
		toast.loading('Loading...');
		router.push(`${pathname}?page=${ECurrentPage.USER_INFORMATION}`);
	};

	useEffect(() => {
		return () => {
			toast.dismiss();
		};
	}, []);

	const showPriceCondition =
		listFlightSegment?.length === Object.keys(tmpSegment).length &&
		listFlightSegment?.length ===
			Object.keys(selectedTickets.flightInfo).length &&
		tripType !== 'oneway';

	return (
		<div className="w-[450px] flex flex-col justify-start gap-4">
			{confirmationDialog}
			<div className="w-full bg-white h-fit rounded-md p-4">
				<p className="text-xl font-semibold text-center">Flight Info</p>
				<div className="w-full pt-4">{renderTicketInfo()}</div>
				{showPriceCondition && (
						<div className="flex justify-center items-center pt-4">
							<Button
								variant="outlineBlue"
								className="py-0 px-2 h-9"
								onClick={handleShowPriceDetail}
								disabled={isTotalPrice}
							>
								Show Total Price
							</Button>
						</div>
					)}
				{isTotalPrice ? (
					<div className="flex gap-2 justify-center items-center mt-2">
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Loading...
					</div>
				) : (
					showTotalPrice && (
						<>
							<ShowPriceDetail
								passenger={countUser}
								priceDetail={pricePerUser}
							/>
						</>
					)
				)}
				<Button
					className="w-full my-4 flex justify-center items-center gap-2"
					disabled={
						Object.keys(selectedTickets.flightInfo ?? {}).length !==
							listFlightSegment?.length || isTotalPrice
					}
					onClick={() => {
						handleShowPriceDetail();
						handlePassengerInformation();
					}}
				>
					<span>Enter Passenger Information</span>
					<ArrowRight />
				</Button>

				{/* component */}
			</div>
			<div className="w-full bg-white h-fit rounded-md p-4">
				<p className="flex items-center justify-center font-semibold">
					Only search for airline
				</p>
				<ChooseAirlines
					className="flex flex-col"
					selectedAirlines={selectedAirlines}
					onAirlinesChange={handleAirlinesChange}
				/>
			</div>
			<div className="w-full bg-white h-fit rounded-md p-8">
				<div className="flex text-xl justify-center font-semibold mb-4">
					Flight time
				</div>
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						<p className="text-sm">Thời gian bay từ MEL (Úc)</p>
						<div className="flex items-center justify-center">
							<TimeRange key={activeFlightSegment.flightId} min={0} max={23} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterInfo;
