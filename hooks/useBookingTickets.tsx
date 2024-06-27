'use client';
import { PATHS } from '@/lib/paths';
import {
	IFlightData,
	IFlightSearch,
	ISelectedTickets,
	ISessionInfo,
	SectorInfo,
	TripType,
} from '@/types/bookingTicket';
import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

interface BookingTicketsContextType {
	isLoading: boolean;
	tripType: string;
	setTripType: (value: string) => void;
	sectorInfos: SectorInfo[] | null;
	getBookingTicketData: (
		params: IFlightSearch,
		showLoading: boolean
	) => Promise<SectorInfo[] | undefined>;
	listFlightSegment: IFlightData[] | null;
	setListFlightSegment: (cb: (value: IFlightData[]) => IFlightData[]) => void;
	tmpSegment: Record<string, SectorInfo[]>;
	setTmpSegment: (value: Record<string, SectorInfo[]>) => void;
	selectedTickets: ISelectedTickets;
	setSelectedTickets: (
		cb: (value: ISelectedTickets) => ISelectedTickets
	) => void;
	bookingSession: ISessionInfo | null;
	setBookingSession: (value: ISessionInfo) => void;
	selectedAirlines: string[];
	handleAirlinesChange: (selected: string[]) => void;
	timeRange: number[];
	setTimeRange: (value: number[]) => void;
}

const BookingTicketsContext = createContext<
	BookingTicketsContextType | undefined
>(undefined);

interface Props {
	[propName: string]: any;
}

export const BookingTicketsContextProvider = (props: Props) => {
	const [bookingSession, setBookingSession] = useState<ISessionInfo | null>(
		null
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [bookingTicketInfo, setBookingTicketInfo] = useState<any>(null);
	const [sectorInfos, setSectorInfos] = useState<SectorInfo[] | null>(null);
	const [listFlightSegment, setListFlightSegment] = useState<IFlightData[]>([]);
	const [tmpSegment, setTmpSegment] = useState<Record<string, SectorInfo[]>>(
		{}
	);
	const [tripType, setTripType] = useState<string>(TripType.OneWay);
	const [selectedAirlines, setSelectedAirlines] = useState<string[]>([
		'QH',
		'VN',
		'VJ',
	]);
	const [timeRange, setTimeRange] = useState<number[]>([0, 23]);

	// State manages the tickets that the user has selected
	const [selectedTickets, setSelectedTickets] = useState<ISelectedTickets>({
		countTicket: '',
		flightInfo: {},
	});

	const handleAirlinesChange = (selected: string[]) => {
		setSelectedAirlines(selected);
	};

	const getBookingTicketData = async (
		params: IFlightSearch,
		showLoading: boolean = true
	): Promise<SectorInfo[] | undefined> => {
		const {
			departureAirport,
			arrivalAirport,
			departureDate,
			countTicket,
			airlineCode,
			tripType
		} = params;

		if (showLoading) {
			setIsLoading(true);
		}

		try {
			const res = await fetch(
				`${PATHS.API_BOOKING_TICKET}?departure=${departureAirport}&arrival=${arrivalAirport}&departureDate=${departureDate}&countTicket=${countTicket}&airlineCode=${airlineCode}&tripType=${tripType}`
			);

			if (!res.ok) {
				const { error } = await res.json();
				toast.error(error);
				return;
			}

			const result = await res.json();

			const { newSessionId, newSequenceNumber, newSecurityToken } = result;

			if (!newSessionId || !newSequenceNumber || !newSecurityToken) {
				toast.error('Invalid response from API');
				return;
			}

			setBookingSession({
				sessionId: newSessionId,
				sequenceNumber: newSequenceNumber,
				securityToken: newSecurityToken,
			});

			// save sector info to show on confirm screen
			setSectorInfos(result.sectorInfos);
			setBookingTicketInfo({ ...result });
			setIsLoading(false);

			return result.sectorInfos;
		} catch (error) {
			toast.error('Error fetching data');
			console.error('Error fetching data:', error);
		} finally {
			if (showLoading) {
				setIsLoading(false);
			}
		}
	};

	const value = {
		isLoading,
		tripType,
		setTripType,
		bookingTicketInfo,
		sectorInfos,
		listFlightSegment,
		tmpSegment,
		setTmpSegment,
		getBookingTicketData,
		setListFlightSegment,
		selectedTickets,
		setSelectedTickets,
		bookingSession,
		selectedAirlines,
		handleAirlinesChange,
		timeRange,
		setTimeRange,
		setBookingSession,
	};

	return <BookingTicketsContext.Provider value={value} {...props} />;
};

export const useBookingTickets = () => {
	const context = useContext(BookingTicketsContext);
	if (context === undefined) {
		throw new Error(
			'useBookingTicket must be used within a BookingTicketContext'
		);
	}
	return context;
};
