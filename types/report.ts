export interface IReportConditionReq {
	userId: string;
	filterDate: Date;
}

export interface IReportByDate {
	[date: string]: {
		totalPrice: number;
		totalTicket: number;
	};
}

export interface IReportDateRes {
	created_at: string;
	amount: number;
	bookings: {
		total_ticket: number;
	};
}

export interface IReportByAirline {
	[airline: string]: {
		name: string;
		totalPrice: number;
		totalTicket: number;
	};
}

export interface IReportAirlineRes {
	created_at: string;
	amount: number;
	bookings: {
		total_ticket: number;
		airlines: {
			name: string;
			short_name: string;
		};
	};
}

export interface IAdminReportByAgents {
	data: {
		[index: string]: {
			amount: number;
			cost: number;
			profit: number;
		};
	};
	totalAmount: number;
	totalCost: number;
}

export interface IReportAgentsRes {
	amount: number;
	cost: number;
	receiver_user: {
		company_name: string;
	};
}

export enum EReportKeys {
	ONE_WEEK = '1',
	TWO_WEEK = '2',
}

export enum EReportType {
	DATE = 'date',
	AIRLINE = 'airline',
}

export interface IOption {
	key: string;
	value: string;
}

export const FilterReports: IOption[] = [
	{
		key: EReportKeys.ONE_WEEK,
		value: '7 days',
	},
	{
		key: EReportKeys.TWO_WEEK,
		value: '14 days',
	},
];
