import { IFareInfo, IPointDetail, ITotalFare } from './booking';

export interface Booking {
	record_locator: string;
	net_fare: number;
}

export interface UserDetails {
	id: string;
	max_credit: number;
	is_operating: boolean;
	balance: number;
	company_name: string;
	phone: string;
	email: string;
	admin_role: string;
}

export interface SectorInfo {
	flightNumber: string;
	airline: string;
	airlineId: string;
	journey: string;
	classOfService: string;
	departureDate: string;
	status: string;
}

export interface TravellerInfo {
	paxType: string;
	paxName: string;
}

export interface Pnr {
	travellerInfos: TravellerInfo[];
	rloc: string;
	newSessionId?: string;
	newSequenceNumber?: string;
	newSecurityToken?: string;
}

export interface PriceSummary {
	commRate: string;
	newSessionId?: string;
	newSequenceNumber?: string;
	newSecurityToken?: string;
	totalFare: ITotalFare[];
	faresInfo: {
		[key: string]: {
			faresDetail: IFareInfo[];
			pointDetails: IPointDetail[];
		};
	};
}

export interface PriceList {
	faresInfo: {
		[key: string]: {
			faresDetail: IFareInfo[];
			pointDetails: IPointDetail[];
		};
	};
	fareBasicCode: string;
	commRate: string;
	newSessionId?: string;
	newSequenceNumber?: string;
	newSecurityToken?: string;
}

export interface Ticket {
	ticketNumber: string;
	// TO REMOVE
	// rloc: string;
	paxName: string;
	passengerType?: string;
	price?: number;
}

export interface BookingTickets {
	tickets: Ticket[];
	rloc: string;
	price?: number;
	paymentDate?: Date;
}

export interface Airline {
	id: string;
	name: string;
	short_name: string;
	notes?: string;
}

export interface Commission {
	id: string;
	description: string;
	class: string;
	user_commission: number;
	airline_commission: number;
	service_fee: number;
	fare_basic: string;
}

export interface IFee {
	id: string;
	category: string;
	description: string;
	service_fee: number;
}
export interface AirlineDetail {
	id: string;
	name: string;
	short_name: string;
	notes: string | null;
	commissions: Commission[] | [];
	fees: IFee[] | [];
}

export interface IStatement {
	id: string;
	user_id: string;
	initial_balance: number;
	ending_balance: number;
	start_date: Date;
	end_date: Date;
}

export interface ITransaction {
	id: string;
	user_id: string;
	created_by: string;
	receiver_user: string;
	amount: number;
	currency: string;
	type: string;
	description: string;
	created_at: Date;
}

export interface ITransactionCalc extends ITransaction {
	balance?: number;
}

export enum ETransactionType {
	TOP_UP = 'Top Up',
	ISSUE_TICKET = 'Issue Ticket',
	REFUND = 'Refund',
	REISSUE = 'Reissue',
	REDUCE = 'Reduce',
	VOID = 'Void Ticket',
}

export enum ETransactionDescription {
	TOP_UP = 'Top Up into wallet',
	ISSUE_TICKET = 'User issued ticket',
	REFUND = 'Refund ticket',
	REISSUE = 'Reissue ticket',
	REDUCE = 'Reduce from wallet',
	VOID = 'Void ticket',
}

export interface IBodyTable {
	tableBody: (string | number | JSX.Element)[][];
	count: number;
}

export interface IOption {
	key: string;
	value: string;
}

export interface ILocation {
	[x: string]: any;
	id: string;
	code: string;
	name: string;
	region: string;
	airport: string;
}

export interface IPnrCreated {
	date: string;
	time: string;
}