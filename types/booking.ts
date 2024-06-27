export interface IFareInfo {
	grossFare: number;
	totalGross: number;
	tstRef: string;
	discTktDesignator: 'ADT' | 'CH' | 'IN';
	taxes: number;
	agentComm: number;
	agentNet: number;
	airlineNet: number;
}

export interface IPointDetail {
	point: string;
	shortFareBasic: string;
}

export interface IGroupFareInfo {
	faresInfo: {
		[key: string]: {
			faresDetail: IFareInfo[];
			pointDetails: IPointDetail[];
		};
	};
	// fareBasicCode: string;
}

export interface ITotalFare {
	totalGrossFare: number;
	totalTaxes: number;
	totalAgentComm: number;
	totalAgentNet: number;
	totalTotalGross: number;
	totalAirlineNet: number;
	fareBasicCode: string;
	pointDetails: IPointDetail[];
}

import { IOption } from './types';

export interface IBookingRequest {
	page?: number;
	perPage?: number;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
	searchValue?: string;
	sttBooking?: TSttBooking;
	sortBy: 'ascending' | 'descending';
}

export interface IBookingRes {
	data: IBookingSupa[] | null;
	count: number | null;
	error: string | null;
}

export interface IBookingSupa {
	airline_id: string;
	created_at: string | null;
	id: string;
	pax_name: string;
	record_locator: string;
	sectors: string;
	tickets_info: ITicketInfo[];
	total_ticket: number;
	updated_at: string;
	user_id: string;
	selected?: boolean;
	status?: TSttBooking;
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

export interface ITicketInfo {
	paxName: string;
	ticketNumber: string;
	status?: string;
	selected?: boolean;
	confirmPrice?: boolean;
	ticketChange?: string;
	tokenKey?: string;
	requestOwner?: string;
	confirmReqOn?: string;
}

export interface IFormRefund {
	reason: string;
	notes: string;
	confirmPrice: boolean;
	file?: FormData | null;
}

export interface IAttachmentsFile {
	path: string;
	filename: string;
}

export interface IEmailRequest extends IFormRefund {
	tickets: ITicketInfo[];
	sectorInfos: SectorInfo[];
	rloc: string;
	typeTicket: string;
	attachmentsFile?: IAttachmentsFile[] | null;
	emailRecipients?: string;
}
export interface IFormRefundResponse {
	amount?: number;
	notes: string;
	file?: FormData | null;
	ticketsChange?: Record<string, string>;
}

export enum ETypeTicket {
	REFUNDING = 'Refunding',
	REFUNDING_CONFIRMING = 'Refunding - Confirming',
	REFUNDED = 'Refunded',
	REISSUING = 'Reissuing',
	REISSUING_CONFIRMING = 'Reissuing - Confirming',
	REISSUED = 'Reissued',
	LIVE = 'Live',
	CANCEL = 'Cancel',
	DISPLAY_PNR = 'Display PNR',
	VOID = 'VOID',
}
const typeTicketValues = Object.values(ETypeTicket) as string[];
export type TTypeTicket = (typeof typeTicketValues)[number];

export type TSttBooking = 'TO-DO' | 'WAITING' | 'DONE' | 'CANCEL' | 'NONE' | 'VOID';
export enum ESttBooking {
	TODO = 'TO-DO',
	WAITING = 'WAITING',
	DONE = 'DONE',
	CANCEL = 'CANCEL',
	NONE = 'NONE',
	VOID = 'VOID',
}

export interface IAdminSubmitMail {
	token: string;
}

export interface ITokenProps {
	exp?: number;
	iat?: number;
}

export interface IAdminSubmitMailComponent {
	agreeLink: string;
	rloc: string;
	typeTicket: string;
}

export const optionsRefund: IOption[] = [
	{
		key: 'Voluntary Cancellation',
		value: 'Voluntary Cancellation',
	},
	{
		key: 'Airline Schedule Change',
		value: 'Airline Schedule Change',
	},
	{
		key: 'No Show',
		value: 'No Show',
	},
	{
		key: 'Tax Refund',
		value: 'Tax Refund',
	},
	{
		key: 'Medical',
		value: 'Medical',
	},
	{
		key: 'Death',
		value: 'Death',
	},
	{
		key: 'Compassionate',
		value: 'Compassionate',
	},
	{
		key: 'Name Change',
		value: 'Name Change',
	},
	{
		key: 'Dupe Ticket',
		value: 'Dupe Ticket',
	},
	{
		key: 'Downgrade',
		value: 'Downgrade',
	},
	{
		key: 'Visa Rejection',
		value: 'Visa Rejection',
	},
];
export interface IFareInfo {
	grossFare: number;
	totalGross: number;
	tstRef: string;
	discTktDesignator: 'ADT' | 'CH' | 'IN';
	taxes: number;
	agentComm: number;
	agentNet: number;
	airlineNet: number;
}

export interface IPointDetail {
	point: string;
	shortFareBasic: string;
}

export interface IGroupFareInfo {
	faresInfo: {
		[key: string]: {
			faresDetail: IFareInfo[];
			pointDetails: IPointDetail[];
		};
	};
	// fareBasicCode: string;
}

export interface ITotalFare {
	totalGrossFare: number;
	totalTaxes: number;
	totalAgentComm: number;
	totalAgentNet: number;
	totalTotalGross: number;
	totalAirlineNet: number;
	fareBasicCode: string;
	pointDetails: IPointDetail[];
}

export enum ECurrentPage {
	SEARCH_FLIGHT = 'search-flight',
	USER_INFORMATION = 'user-information',
	PNR_REVIEW = 'pnr-review',
	PAYMENT = 'payment',
}