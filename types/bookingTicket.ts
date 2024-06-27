import { IOption } from './types';

export interface FlightDetails {
	departureAirport: string;
	arrivalAirport: string;
	departureDate: Date;
}

export interface ISessionInfo {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
}

export interface IFlightSearch {
	departureAirport: string;
	arrivalAirport: string;
	departureDate: string;
	countTicket: string;
	airlineCode: string;
	tripType: string;
}

export interface IFlightData extends IFlightSearch {
	flightId: string;
	tripType: string;
	formatDepartureDate: string;
}

export interface SectorInfo {
	airLineCompany: string;
	departureLocation: string;
	arrivalLocation: string;
	departureDate: string;
	arrivalDate: string;
	departureTime: string;
	arrivalTime: string;
	typeOfCraft: string;
	flightIdentifier: string;
	timeDuration: string;
	infoOnClasses: InfoOnClass[];
	priceInfo: IPriceInfo;
}

export interface IPriceInfo {
	business: IPriceItem,
	economy: IPriceItem,
}
export interface IPriceItem {
	type: 'Business' | 'Economy';
	price: number;
	class: string;
	condition: string;
}

export interface InfoOnClass {
	serviceClass: string;
  availabilityStatus: string;
}

export enum TripType {
	OneWay = 'oneway',
	RoundTrip = 'roundtrip',
	MultiCity = 'multicity',
}

export interface TicketInfo {
	type: string;
	price: number;
	serviceClass: string;
	flight: SectorInfo;
}

export interface ISelectedTickets {
	countTicket: string;
	flightInfo: Record<string, TicketInfo>;
}

export enum EBookingTicketKeys {
	ONE = '1',
	TWO = '2',
	THREE = '3',
	FOUR = '4',
	FIVE = '5',
	SIX = '6',
	SEVEN = '7',
	EIGHT = '8',
	NINE = '9',
}

export const FilterBookingTickets: IOption[] = [
	{
		key: EBookingTicketKeys.ONE,
		value: '1 Person',
	},
	{
		key: EBookingTicketKeys.TWO,
		value: '2 People',
	},
	{
		key: EBookingTicketKeys.THREE,
		value: '3 People',
	},
	{
		key: EBookingTicketKeys.FOUR,
		value: '4 People',
	},
	{
		key: EBookingTicketKeys.FIVE,
		value: '5 People',
	},
	{
		key: EBookingTicketKeys.SIX,
		value: '6 People',
	},
	{
		key: EBookingTicketKeys.SEVEN,
		value: '7 People',
	},
	{
		key: EBookingTicketKeys.EIGHT,
		value: '8 People',
	},
	{
		key: EBookingTicketKeys.NINE,
		value: '9 People',
	},
];

export interface IFormUserInfo {
	usersInfo: IUserInformation[];
	contactInfo: IContactInformation;
}

export interface IUserInformation {
	gender: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	birthDay?: Date;
}

export interface IContactInformation {
	fullName: string;
	email: string;
	region: string;
	phoneNumber: string;
}

export enum EPassengerType {
	ADULT = 'ADT',
	CHILD = 'CHD',
	Infant = 'INF',
}

export interface ITravellerInfo {
	surname: string;
	firstName: string;
	passengerType: 'ADT' | 'CHD' | 'INF'; // Adult, Child, Infant
}
export interface IOrgDesDetails {
	origin: string;
	destination: string;
	depDate: string;
	arrivalDate?: string;
	airlineCompany: string;
	flightIdentifier: string;
	classOfService: string;
}
export interface ICreatePnrParams {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
	travellerInfo: ITravellerInfo[];
	orgDesDetails: IOrgDesDetails[];
}

export interface IFarePriceWithoutPnr {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
	orgDesDetail: IOrgDesDetails[];
	passengers: string[];
}

export interface IPassengers {
	'ADT': number;
	'CH': number;
	'IN': number;
}

export interface ICountPassenger {
	adults: number;
	children: number;
	infants: number;
}
