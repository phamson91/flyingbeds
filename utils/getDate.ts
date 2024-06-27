import { ITicketInfo } from '@/types/booking';
import { addHours } from 'date-fns';

/**
 * Returns a date object based on the number of days passed in.
 */
export const getFilterDays = (numberDays: number): Date => {
	const currentDate = new Date();
	const filterDays = new Date();
	filterDays.setDate(currentDate.getDate() - numberDays);
	return filterDays;
};

/**
 * Checks if a given date is expired based on a specified expiration time.
 */
export const isDateExpired = ({
	date,
	expirationTime,
}: {
	date?: string | Date;
	expirationTime: number;
}): boolean => {
	if (!date) throw new Error('No date provided');

	const currentTime = new Date();
	const expirationDate = addHours(new Date(date), expirationTime);

	return expirationDate < currentTime;
};

/**
 * Checks if a given ticket is expired based on a specified expiration time.
 */
export const isTicketExpired = ({
	tickets,
	expirationTime,
}: {
	tickets: ITicketInfo[];
	expirationTime: number;
}): boolean => {
	const currentTime = new Date();
	return tickets.some((ticket) => {
		if (!ticket.confirmReqOn) return false;

		const expirationDate = addHours(
			new Date(ticket.confirmReqOn),
			expirationTime
		);

		return expirationDate < currentTime;
	});
};
