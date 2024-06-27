import { Button } from '@/components/ui/Button';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import dateUtils from '@/lib/dateUtils';
import formatNumber from '@/lib/formatNumber';
import { PATHS } from '@/lib/paths';
import { ICountPassenger, IPassengers } from '@/types/bookingTicket';
import { ILocation } from '@/types/types';
import { format, getDay } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ShowPriceDetail from '../ShowPriceDetail';

interface Props {
	data: any;
	locations: ILocation[];
	index: number;
	passenger: ICountPassenger;
}

const TicketInfo: FC<Props> = ({ data, locations, index, passenger }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { bookingSession, setBookingSession, tripType } = useBookingTickets();
	const [priceDetail, setPriceDetail] = useState<IPassengers>({
		ADT: 0,
		CH: 0,
		IN: 0,
	});

	const [showTotalPrice, setShowTotalPrice] = useState(false);

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

	const convertTime = (time: string) => {
		return `${time.substring(0, 2)} hr ${time.substring(2, 4)} min`;
	};

	const handleShowPriceDetail = async () => {
		setIsLoading(true);
		setShowTotalPrice(true);

		const { adults, children, infants } = passenger;

		const passengerCodes: Record<string, string> = {
			ADT: adults > 0 ? 'ADT' : '',
			CHD: children > 0 ? 'CHD' : '',
			INF: infants > 0 ? 'INF' : '',
		};

		const passengersArray = Object.values(passengerCodes).filter(
			(code) => code !== ''
		);

		try {
			const response = await fetch(PATHS.API_PRICE_WITHOUT_PNR, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sessionId: bookingSession?.sessionId,
					sequenceNumber: bookingSession?.sequenceNumber,
					securityToken: bookingSession?.securityToken,
					orgDesDetail: [
						{
							origin: data.flight.departureLocation,
							destination: data.flight.arrivalLocation,
							depDate: data.flight.departureDate,
							arrivalDate: data.flight.arrivalDate,
							airlineCompany: data.flight.airLineCompany,
							flightIdentifier: data.flight.flightIdentifier,
							classOfService: data.serviceClass,
						},
					],
					passengers: passengersArray,
				}),
			});

			if (!response.ok) {
				const { error } = await response.json();
				setIsLoading(false);
				toast.error(error);
				return;
			}
			const dataPriceDetail = await response.json();

			if (dataPriceDetail) {
				setPriceDetail(dataPriceDetail.faresInfo);
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
		setIsLoading(false);
	};

	useEffect(() => {
		setShowTotalPrice(false);
	}, [data]);

	return (
		<div className="w-full p-2">
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
			<div className="px-4 py-4 flex flex-col gap-2 font-semibold text-xs">
				<div className="flex items-center gap-2">
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
				<p className="pt-1">
					{/* 10:30 AM Tan Son Nhat International Airport (SGN) */}
					{`${renderTime(data.flight.departureTime)} ${
						departureLocation?.airport
					} (${departureLocation?.code})`}
				</p>
				<div className="flex gap-1">
					<p className="text-xs font-normal">{`${data.flight.airLineCompany}${data.flight.flightIdentifier}`}</p>
					<p className="text-xs">{`${data.type} Class`}</p>
				</div>
				<div className="flex gap-1">
					<p className="text-xs font-normal">Travel time:</p>
					<p className="text-xs">{convertTime(data.flight.timeDuration)}</p>
				</div>
				<p>{`${renderTime(data.flight.arrivalTime)} ${
					arrivalLocation?.airport
				} (${arrivalLocation?.code})`}</p>
			</div>
			<div className="flex justify-center items-center">
				{tripType !== 'roundtrip' && (
					<Button
						variant="outlineBlue"
						className="py-0 px-2 h-9"
						onClick={data && handleShowPriceDetail}
						disabled={isLoading}
					>
						{tripType === 'oneway' ? 'Show Total Price' : 'Show Price Detail'}
					</Button>
				)}
			</div>
			{isLoading ? (
				<div className="flex gap-2 justify-center items-center mt-2">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Loading...
				</div>
			) : (
				showTotalPrice && (
					<>
						<ShowPriceDetail passenger={passenger} priceDetail={priceDetail} />
					</>
				)
			)}
		</div>
	);
};

export default TicketInfo;
