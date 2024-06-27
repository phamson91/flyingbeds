'use client';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import useLeaveConfirmation from '@/hooks/useLeaveConfirmation';
import { PATHS } from '@/lib/paths';
import { ECurrentPage } from '@/types/booking';
import { ICountPassenger, IFormUserInfo } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { differenceInYears } from 'date-fns';
import { Loader2, MoveRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserForm } from '../../hooks/useUserForm';
import ShowPriceDetail from '../ShowPriceDetail';
import FlightDetail from './FlightDetail';

interface Props {
	locations: ILocation[];
}

const FlightInfo: React.FC<Props> = ({ locations }) => {
	const router = useRouter();
	const pathname = usePathname();

	const { getPnrData, setPnrDateCreated } = useBooking();
	const { formUserInfo, setFormUserData, formPassenger, pricePerUser } =
		useUserForm();
	const { selectedTickets, bookingSession } = useBookingTickets();
	const [countUser, setCountUser] = useState<ICountPassenger>({
		adults: 1,
		children: 0,
		infants: 0,
	});

	const [isPnrLoading, setIsPnrLoading] = useState<boolean>(false);
	const [isLeaveConfirm, setIsLeaveConfirm] = useState<boolean>(true);

	useEffect(() => {
		if (Object.keys(selectedTickets.flightInfo).length === 0) {
			router.push(pathname);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const passengerValues = formPassenger.getValues('passengers');
		setCountUser(passengerValues);
	}, [formPassenger]);

	// Hook show dialog leave confirmation
	const { confirmationDialog } = useLeaveConfirmation({
		shouldPreventRouteChange: isLeaveConfirm,
		sessionInfo: bookingSession!,
		message:
			'Are you sure you want to leave? All the user information will be lost',
	});

	const renderFlight = () => {
		const rows: any = [];
		let index: number = 0;

		for (const flightId in selectedTickets.flightInfo) {
			index = index + 1;
			rows.push(
				<FlightDetail
					key={flightId}
					data={selectedTickets.flightInfo[flightId]}
					locations={locations}
					index={index}
				/>
			);
		}

		return rows;
	};

	const renderTotalPrice = () => {
		return <ShowPriceDetail passenger={countUser} priceDetail={pricePerUser} />;
	};

	const checkPassengerType = (birthDay: Date) => {
		let age = differenceInYears(new Date(), birthDay);

		if (age <= 1) return 'INF';
		else if (age <= 17) return 'CHD';
		else return 'ADT';
	};

	const generateParamPnr = (data: IFormUserInfo) => {
		const travellerInfo = data.usersInfo.map((item) => ({
			surname: `${item.lastName} ${item.middleName}`,
			firstName: item.firstName,
			passengerType: ['mr', 'mrs'].includes(item.gender)
				? 'ADT'
				: checkPassengerType(item.birthDay || new Date()),
		}));

		//Generate origin destination detail
		const orgDesDetails = [];
		for (const flightId in selectedTickets.flightInfo) {
			orgDesDetails.push({
				origin: selectedTickets.flightInfo[flightId].flight.departureLocation,
				destination:
					selectedTickets.flightInfo[flightId].flight.arrivalLocation,
				depDate: selectedTickets.flightInfo[flightId].flight.departureDate,
				airlineCompany:
					selectedTickets.flightInfo[flightId].flight.airLineCompany,
				flightIdentifier:
					selectedTickets.flightInfo[flightId].flight.flightIdentifier,
				classOfService: selectedTickets.flightInfo[flightId]?.serviceClass,
			});
		}
		return {
			...bookingSession,
			travellerInfo,
			orgDesDetails,
		};
	};

	const handleCreatePnr = async (data: IFormUserInfo) => {
		setIsLeaveConfirm(false);
		setIsPnrLoading(true);
		toast.loading('Loading...');

		setFormUserData(data);

		const params = generateParamPnr(data);

		// Fetch pnr information from api
		const response = await fetch(PATHS.API_PNR_RETRIEVE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			const { error } = await response.json();
			toast.error(error);
			setIsPnrLoading(false);
			return;
		}
		const dataPnr = await response.json();

		// Get pnr session
		const { newSessionId, newSequenceNumber, newSecurityToken } = dataPnr;

		// Ignore pnr session
		await fetch(`${PATHS.API_IGNORE_SESSION}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId: newSessionId,
				sequenceNumber: newSequenceNumber,
				securityToken: newSecurityToken,
			}),
		});

		if (dataPnr?.pnr?.controlNumber) {
			setPnrDateCreated({
				date: dataPnr?.pnr?.date[0],
				time: dataPnr?.pnr?.time[0],
			});
			await getPnrData(dataPnr?.pnr?.controlNumber[0]);
			router.push(`${pathname}?page=${ECurrentPage.PNR_REVIEW}`);
		} else {
			toast.error('Failed to create PNR');
		}
		setIsPnrLoading(false);
	};

	useEffect(() => {
		return () => {
			toast.dismiss();
		};
	}, []);

	return (
		<div className="w-[450px] h-fit bg-white rounded-lg p-4">
			{confirmationDialog}
			<p className="text-xl font-semibold text-center">Flight Info</p>
			<div className="w-full py-4">{renderFlight()}</div>
			{renderTotalPrice()}
			<Button
				onClick={formUserInfo.handleSubmit(
					async (data: IFormUserInfo) =>
						await handleCreatePnr(data as IFormUserInfo)
				)}
				className="w-full my-4 flex justify-center items-center gap-2"
				disabled={isPnrLoading}
			>
				{isPnrLoading ? (
					<div className="flex gap-2">
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Loading...
					</div>
				) : (
					<span>Create PNR</span>
				)}
				<MoveRight />
			</Button>
		</div>
	);
};

export default FlightInfo;
