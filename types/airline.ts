export interface IAirlineInfo {
	id: string;
	airline_id: string;
	departure: string;
	arrival: string;
	created_at: Date;
	updated_at: Date;
	ticket_prices: ITicketPrice[];
}

export interface ITicketPrice {
	id: string;
	flight_id: string;
	type: 'Business' | 'Economy';
	class: string;
	priceOW: number;
	priceRT: number;
	condition: string;
	created_at: Date;
	updated_at: Date;
}