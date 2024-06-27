import {
	IReportAirlineRes,
	IReportDateRes,
	IReportConditionReq,
	IReportByDate,
	IReportByAirline,
} from '@/types/report';
import { ETransactionType } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getReportByDate = async ({
	userId,
	filterDate,
}: IReportConditionReq): Promise<IReportByDate | null> => {
	const filterDateFormatted = filterDate.toISOString().slice(0, 10);
	const supabase = createClientComponentClient({});

	//Fetch transaction by date
	const { data, error } = await supabase
		.from('transactions')
		.select('created_at, amount, bookings (total_ticket))')
		.eq('receiver_user', userId)
		.eq('type', ETransactionType.ISSUE_TICKET)
		.gte('created_at', filterDateFormatted)
		.order('created_at', { ascending: false })
		.limit(1, { foreignTable: 'bookings' });

	if (error) {
		console.error(error);
		return null;
	}

	const reportByDate: IReportByDate = reportGroupDate(data as any);

	return reportByDate;
};

/**
 * Groups transactions by date and calculates the total price and total ticket count for each date.
 */
const reportGroupDate = (data: IReportDateRes[]) => {
	const groupByDate = data.reduce(
		(accumulator: IReportByDate, row: IReportDateRes) => {
			const date = row.created_at.slice(0, 10);
			const price = +row.amount;
			const ticket = row.bookings?.total_ticket || 0;

			// If the date already exists in the accumulator, add the price and ticket count to the existing values.
			if (accumulator[date]) {
				accumulator[date].totalPrice += price;
				accumulator[date].totalTicket += ticket;
			} else {
				accumulator[date] = { totalPrice: price, totalTicket: ticket };
			}
			return accumulator;
		},
		{}
	);

	return groupByDate;
};

export const getReportByAirline = async ({
	userId,
	filterDate,
}: IReportConditionReq): Promise<IReportByAirline | null> => {
	const filterDateFormatted = filterDate.toISOString().slice(0, 10);
	const supabase = createClientComponentClient({});

	//Fetch transaction by airline
	const { data, error } = await supabase
		.from('transactions')
		.select(
			'created_at, amount, bookings (total_ticket, airlines (name, short_name)) '
		)
		.eq('receiver_user', userId)
		.eq('type', ETransactionType.ISSUE_TICKET)
		.gte('created_at', filterDateFormatted)
		.limit(1, { foreignTable: 'bookings' });

	if (error) {
		console.error(error);
		return null;
	}
	const reportByAirline: IReportByAirline = reportGroupAirline(data as any);

	return reportByAirline;
};

/**
 * Groups transaction by airline and calculates the total price and total ticket count for each date.
 */
const reportGroupAirline = (
	bookings: IReportAirlineRes[]
): IReportByAirline => {
	const groupByAirline = bookings.reduce(
		(accumulator: IReportByAirline, row: IReportAirlineRes) => {
			const airline = row.bookings.airlines.short_name;
			const price = +row.amount;
			const ticket = row.bookings?.total_ticket || 0;

			// If the airline already exists in the accumulator, add the name, price and ticket count to the existing values.
			if (accumulator[airline]) {
				accumulator[airline].totalPrice += price;
				accumulator[airline].totalTicket += ticket;
			} else {
				accumulator[airline] = {
					name: row.bookings.airlines.name,
					totalPrice: price,
					totalTicket: ticket,
				};
			}
			return accumulator;
		},
		{}
	);

	return groupByAirline;
};
