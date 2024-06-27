import { getBookingById } from '@/actions/bookings/server';
import { updateBookingServer } from '@/actions/bookings/updateServer';
import { updateRowServer } from '@/actions/updateServer';
import { ITicketInfo, ETypeTicket, ESttBooking } from '@/types/booking';
import { IAdminSendResult } from '@/types/sendEmail';
import { ETransactionDescription, ETransactionType } from '@/types/types';
import { JwtPayload } from 'jsonwebtoken';

/** The functions supporting the processing flow. */

export const updateConfirmedTicketData = async (
	data: IAdminSendResult & JwtPayload
): Promise<null> => {
	// Initial ticket change
	const ticketsChange = createTicketChange(data);
	// Update status ticket info to refunded/reissued when complete ticket
	const { tickets_info, sttBooking } = await changeTicketStatus(
		data,
		ticketsChange,
		'Success'
	);

	// Initial type transaction
	const type: string =
		data.typeTicket === ETypeTicket.REFUNDING
			? ETransactionType.REFUND
			: ETransactionType.REISSUE;
	// Initial description transaction
	const description: string = `${
		data.typeTicket === ETypeTicket.REISSUING
			? ETransactionDescription.REISSUE
			: ETransactionDescription.REFUND
	} ${data!.booking!.record_locator}`;

	const transactionRowData = {
		receiver_user: data!.booking!.user_id,
		created_by: data!.adminId,
		type,
		description,
		amount: Number(data!.amount),
		cost: 0,
		booking_id: data!.booking!.id,
		currency: 'AUD',
	};

	const sttCheck = [
		ETypeTicket.REFUNDING,
		ETypeTicket.REISSUING,
		ETypeTicket.REFUNDING_CONFIRMING,
		ETypeTicket.REISSUING_CONFIRMING,
	];

	// Update status ticket info to refunded
	// Status ticket info: REFUNDING/REISSUING -> REFUNDED/REISSUED
	// If all tickets in the booking have the status REFUNDED/REISSUED, update status booking to DONE
	await updateBookingServer({
		id: data!.booking.id,
		ticketsInfo: tickets_info,
		sttCheck,
		rootSttBooking: sttBooking,
		desSttBooking: ESttBooking.DONE,
		data: {},
	});

	// Create transaction
	await updateRowServer({
		table: 'transactions',
		...transactionRowData,
	});

	return null;
};

// Handle update ticket failed
export const updateTicketFailed = async (
	data: IAdminSendResult & JwtPayload,
	tickets: string
) => {
	const ticketsChange = tickets.split('_');

	const { tickets_info, sttBooking } = await changeTicketStatus(
		data,
		ticketsChange,
		'Failed'
	);

	const sttCheck = [
		ETypeTicket.REFUNDING,
		ETypeTicket.REISSUING,
		ETypeTicket.REFUNDING_CONFIRMING,
		ETypeTicket.REISSUING_CONFIRMING,
	];

	// Update status ticket info to refunded
	// Status ticket: REFUNDING/REISSUING_CONFIRMING -> LIVE
	await updateBookingServer({
		id: data!.booking.id,
		ticketsInfo: tickets_info,
		sttCheck,
		rootSttBooking: sttBooking,
		desSttBooking: ESttBooking.CANCEL,
		data: {},
	});
};

// Update status ticket info
export const changeTicketStatus = async (
	data: IAdminSendResult & JwtPayload,
	ticketsChange: string[],
	type: 'Success' | 'Failed'
) => {
	const { tickets_info, status: sttBooking } = await getBookingById(
		data!.booking!.id
	);

	let status = ETypeTicket.LIVE;
	// Update status ticket info to finished when complete ticket
	if (type === 'Success') {
		status =
			data!.typeTicket === ETypeTicket.REFUNDING
				? ETypeTicket.REFUNDED
				: ETypeTicket.REISSUED;
	}

	// Update ticket info
	tickets_info.forEach((ticket: ITicketInfo) => {
		if (ticketsChange.includes(ticket.ticketNumber)) {
			delete ticket.tokenKey;
			delete ticket.confirmReqOn;
			if (
				ticket.status === ETypeTicket.REFUNDED ||
				ticket.status === ETypeTicket.REISSUED
			)
				throw new Error('There exists a ticket that has been completed');
			ticket.status = status;
		}

		// Update ticket number if type ticket is reissue
		if (data?.ticketsChange && data?.ticketsChange[ticket.ticketNumber]) {
			ticket.ticketNumber = data.ticketsChange[ticket.ticketNumber];
		}

		return ticket;
	});

	return { tickets_info, sttBooking };
};

/**
 * Creates a ticket change array based on the provided data.
 * If the type of ticket is REISSUING, it returns an array of ticket numbers.
 * Otherwise, it returns an array of ticket numbers for selected tickets in the booking.
 */
export const createTicketChange = (data: IAdminSendResult & JwtPayload) => {
	if (data.typeTicket === ETypeTicket.REISSUING) {
		if (data?.tickets_number) return data?.tickets_number.split('_');
		return data.booking.tickets_info
			.filter((item) => item.selected)
			.map((item) => item.ticketNumber)
			.join('_');
	}
	const ticketChange = data.booking.tickets_info
		.map((item) => {
			if (item.selected) return item.ticketNumber;
		})
		.filter((item) => item);

	return ticketChange;
};
