import { PATHS } from '@/lib/paths';
import {
	BookingTickets,
	ETransactionDescription,
	ETransactionType,
	IPnrCreated,
	Pnr,
	PriceList,
	PriceSummary,
	SectorInfo,
	TravellerInfo,
} from '@/types/types';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from './useUser';
import { useRouter } from 'next/navigation';
import { IGroupFareInfo, ITotalFare } from '@/types/booking';

type BookingContextType = {
	showRetrievePnrForm: boolean;
	bookingInfo: Pnr | null;
	isPnrLoading: boolean;
	isPriceLoading: boolean;
	priceSummary: PriceSummary | null;
	isTicketIssuing: boolean;
	ticketIssued: BookingTickets | null;
	resetForm: () => void;
	getPnrData: (rloc: string) => Promise<void>;
	showPriceSummary: () => Promise<void>;
	issueTicket: (fareBasicCode: string) => Promise<void>;
	sectorInfos: SectorInfo[] | null;
	pnrDateCreated: IPnrCreated | null;
	setPnrDateCreated: (date: IPnrCreated) => void;
	pnrSession: ISessionInfo | null;
	setPnrSession: (pnrSession: ISessionInfo) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface Props {
	[propName: string]: any;
}

interface ISessionInfo {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
}

export const BookingContextProvider = (props: Props) => {
	const router = useRouter();
	const [bookingSession, setBookingSession] = useState<ISessionInfo | null>(
		null
	);
	const [pnrSession, setPnrSession] = useState<ISessionInfo | null>(
		null
	);
	const [showRetrievePnrForm, setShowRetrievePnrForm] = useState(true);
	const [bookingInfo, setBookingInfo] = useState<Pnr | null>(null);
	const [sectorInfos, setSectorInfos] = useState<SectorInfo[] | null>(null);
	const [isPnrLoading, setIsPnrLoading] = useState(false);
	const [isPriceLoading, setIsPriceLoading] = useState(false);
	const [priceSummary, setPriceSummary] = useState<PriceSummary | null>(null);
	const [isTicketIssuing, setIsTicketIssuing] = useState(false);
	const [ticketIssued, setTicketIssued] = useState<BookingTickets | null>(null);
	const { supabaseClient: supabase } = useSessionContext();
	const { userDetails, fetchUserDetails } = useUser();
	const [pnrDateCreated, setPnrDateCreated] = useState<IPnrCreated | null>(
		null
	);

	const resetForm = (): void => {
		setShowRetrievePnrForm(true);
		setBookingInfo(null);
		setIsPnrLoading(false);
		setIsPriceLoading(false);
		setPriceSummary(null);
		setIsTicketIssuing(false);
		setTicketIssued(null);
		setSectorInfos(null);
	};

	const getPnrData = async (rloc: string): Promise<void> => {
		setIsPnrLoading(true);

		const res = await fetch(`${PATHS.API_PNR_RETRIEVE}/${rloc}`);

		if (!res.ok) {
			const { error } = await res.json();
			toast.error(error);
			setIsPnrLoading(false);
			return;
		}
		const result = await res.json();

		const { newSessionId, newSequenceNumber, newSecurityToken } = result;

		if (!newSessionId || !newSequenceNumber || !newSecurityToken) {
			toast.error('Invalid response from API');
			setIsPnrLoading(false);
			return;
		}

		setBookingSession({
			sessionId: newSessionId,
			sequenceNumber: newSequenceNumber,
			securityToken: newSecurityToken,
		});
		// save sector info to show on confirm screen
		setSectorInfos(result.sectorInfos);
		setBookingInfo({ ...result });

		setIsPnrLoading(false);
	};

	const showPriceSummary = async (): Promise<void> => {
		setIsPriceLoading(true);

		if (!bookingSession) {
			toast.error('Invalid booking session');
			setIsPriceLoading(false);
			return;
		}

		const { sessionId, sequenceNumber, securityToken } = bookingSession;

		const res = await fetch(PATHS.API_PRICE_SUMMARY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ sessionId, sequenceNumber, securityToken }),
		});
		if (!res.ok) {
			const { error } = await res.json();
			toast.error(error);
			setIsPriceLoading(false);
			return;
		}
		const result: PriceList = await res.json();

		const { newSessionId, newSequenceNumber, newSecurityToken } = result;

		if (!newSessionId || !newSequenceNumber || !newSecurityToken) {
			toast.error('Invalid response from API');
			setIsPriceLoading(false);
			return;
		}

		setBookingSession({
			sessionId: newSessionId,
			sequenceNumber: newSequenceNumber,
			securityToken: newSecurityToken,
		});

		// calculate total fare by sum up price for each traveller
		// check each traveller price by comparing paxType and discTktDesignator
		if (!bookingInfo) {
			toast.error('Application Error. Please contact admin');
			resetForm();
			return;
		}

		// Calc total fare for each fare basic code
		const totalFares: ITotalFare[] = calculateTotalFare(
			result.faresInfo as IGroupFareInfo['faresInfo'],
			bookingInfo.travellerInfos as TravellerInfo[]
		);

		setPriceSummary({ ...result, totalFare: totalFares });
		setIsPriceLoading(false);
	};

	const issueTicket = async (fareBasicCode: string): Promise<void> => {
		setIsTicketIssuing(true);

		// Check if all required data is available
		if (!bookingInfo || !fareBasicCode || !priceSummary) {
			!fareBasicCode && toast.error('Invalid select fare');
			!bookingSession && toast.error('Invalid booking session');
			!priceSummary &&
				(toast.error('Application Error. Please contact admin'), resetForm());
			setIsTicketIssuing(false);
			return;
		}

		const { sessionId, sequenceNumber, securityToken } = bookingSession!;

		// get price by fareBasicCode
		const priceByFareBasicCode: ITotalFare | null =
			priceSummary?.totalFare?.find(
				(item) => item.fareBasicCode === fareBasicCode
			) ?? null;

		if (!priceByFareBasicCode) {
			toast.error('Not found price summary for selected fare');
			setIsTicketIssuing(false);
			return;
		}

		const airlineNet = priceByFareBasicCode.totalAirlineNet;
		const net_fare = priceByFareBasicCode.totalAgentNet;

		// check if user have enough credit by add users.balance and users.max_credit and compare with net_fare
		// get balance from server to make sure it's up to date in case admin updated
		const { data, error: getBalanceError } = await supabase
			.from('users')
			.select('balance, is_operating')
			.single();

		// check if user is still operating & getBalanceError exists
		if (getBalanceError || !data.is_operating) {
			getBalanceError && toast.error(getBalanceError.message);
			data &&
				!data.is_operating &&
				toast.error('User is not operating. Please contact admin');
			setIsTicketIssuing(false);
			return;
		}

		const balance = data?.balance;
		const maxCredit = userDetails!.max_credit;
		if (net_fare > maxCredit + balance) {
			toast.error('Insufficient credit balance');
			setIsTicketIssuing(false);
			return;
		}

		// get tstRef from priceSummary
		const tstRef =
			priceSummary?.faresInfo[fareBasicCode]?.faresDetail?.map(
				(fareInfo) => fareInfo.tstRef
			) ?? [];

		const res = await fetch(`${PATHS.API_ISSUE_TICKET}/${bookingInfo!.rloc}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId,
				sequenceNumber,
				securityToken,
				tstRef,
				userId: userDetails?.id,
			}),
		});

		if (!res.ok) {
			const { error } = await res.json();
			toast.error(error);
			setIsTicketIssuing(false);
			return;
		}

		const result: BookingTickets = await res.json();
		// Get journey from sectorInfos
		const sectors = sectorInfos!.map((sectorInfo) => sectorInfo.journey);

		const ticketsInfo = result.tickets.map((ticket) => ({
			...ticket,
			price: priceSummary?.faresInfo[fareBasicCode]?.faresDetail?.find(
				(fareInfo) => ticket.passengerType?.includes(fareInfo.discTktDesignator)
			)?.agentNet || 0,
		}));

		// insert row into supabase (trigger updates users.balance on supabase)
		const bookingRowData = {
			record_locator: bookingInfo!.rloc,
			user_id: userDetails!.id,
			total_ticket: result.tickets.length,
			// only allow booking for 1 airline
			airline_id: sectorInfos![0].airlineId,
			pax_name: result!.tickets![0].paxName,
			sectors: sectors!.length > 1 ? sectors!.join(', ') : sectors![0],
			tickets_info: JSON.stringify(ticketsInfo),
		};

		const { data: bookingData, error: bookingError } = await supabase
			.from('bookings')
			.insert(bookingRowData)
			.select('id');

		if (bookingError) {
			toast.error(bookingError.message);
			setIsTicketIssuing(false);
			return;
		}

		// insert row into transactions table
		const transactionRowData = {
			receiver_user: userDetails!.id,
			created_by: userDetails!.id,
			type: ETransactionType.ISSUE_TICKET,
			description: `${ETransactionDescription.ISSUE_TICKET} ${
				bookingInfo!.rloc
			}`,
			amount: -net_fare,
			cost: airlineNet,
			booking_id: bookingData![0].id,
			currency: 'AUD',
		};

		const { error: insertTransactionError } = await supabase
			.from('transactions')
			.insert(transactionRowData);

		if (insertTransactionError) {
			toast.error(insertTransactionError.message);
			setIsTicketIssuing(false);
			return;
		}

		fetchUserDetails();
		router.refresh();

		setTicketIssued({
			...result,
			price: priceByFareBasicCode.totalAgentNet,
			paymentDate: new Date(),
		});

		// hide ui part and show confirm screen
		setPriceSummary(null);
		setBookingInfo(null);
		setShowRetrievePnrForm(false);

		setIsTicketIssuing(false);
	};

	const value = {
		showRetrievePnrForm,
		bookingInfo,
		isPnrLoading,
		isPriceLoading,
		priceSummary,
		isTicketIssuing,
		ticketIssued,
		resetForm,
		getPnrData,
		showPriceSummary,
		issueTicket,
		sectorInfos,
		pnrDateCreated,
		setPnrDateCreated,
		pnrSession,
		setPnrSession,
	};

	return <BookingContext.Provider value={value} {...props} />;
};

export const useBooking = () => {
	const context = useContext(BookingContext);
	if (context === undefined) {
		throw new Error('useBooking must be used within a BookingContextProvider');
	}
	return context;
};

/**
 * Calculates the total fare for each fare basis code based on the given faresInfo and travellerInfos.
 */
const calculateTotalFare = (
	faresInfo: IGroupFareInfo['faresInfo'],
	travellerInfos: any
): ITotalFare[] => {
	const result: ITotalFare[] = [];
	for (const key in faresInfo) {
		const totalFare = travellerInfos.reduce(
			(acc: ITotalFare, travellerInfo: TravellerInfo) => {
				const fareInfo = faresInfo[key].faresDetail.find((fareInfo) =>
					travellerInfo.paxType.includes(fareInfo.discTktDesignator)
				);
				const {
					grossFare,
					taxes,
					agentComm,
					agentNet,
					totalGross,
					airlineNet,
				} = fareInfo!;
				return {
					totalGrossFare: acc.totalGrossFare + grossFare,
					totalTaxes: acc.totalTaxes + taxes,
					totalAgentComm: acc.totalAgentComm + agentComm,
					totalAgentNet: acc.totalAgentNet + agentNet,
					totalTotalGross: acc.totalTotalGross + totalGross,
					totalAirlineNet: acc.totalAirlineNet + airlineNet,
				};
			},
			{
				totalGrossFare: 0,
				totalTaxes: 0,
				totalAgentComm: 0,
				totalAgentNet: 0,
				totalTotalGross: 0,
				totalAirlineNet: 0,
			}
		);

		result.push({
			fareBasicCode: key,
			...totalFare,
			pointDetails: faresInfo[key].pointDetails,
		});
	}

	return result.sort((a, b) => a.totalAgentNet - b.totalAgentNet);
};
