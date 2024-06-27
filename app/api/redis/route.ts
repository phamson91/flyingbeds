import { getBookingById } from '@/actions/bookings/server';
import { updateBookingServer } from '@/actions/bookings/updateServer';
import redis from '@/lib/redis';
import { ESttBooking, ETypeTicket, ITicketInfo } from '@/types/booking';
import { REDIS_TOKEN_STORAGE_PREFIX } from '@/utils/constant';
import { NextRequest, NextResponse } from 'next/server';

interface IParams {
	bookingId: string;
	uniqueTokenArray: string[];
	ticketsNumber: string[];
}
export async function POST(req: NextRequest) {
	const { bookingId, uniqueTokenArray, ticketsNumber }: IParams =
		await req.json();

	// Check params
	if (!bookingId || !uniqueTokenArray || !ticketsNumber) {
		return new NextResponse(JSON.stringify({ message: 'Params invalid' }), {
			status: 400,
			statusText: 'Params invalid',
		});
	}

	try {
		// Delete token key in redis
		uniqueTokenArray.forEach(async (tokenKey: string) => {
			await redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}user:${tokenKey}`);
			await redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}admin:${tokenKey}`);
		});

		// Update status ticket info to refunded/reissued when cancel ticket
		const { tickets_info, status: sttBooking } = await getBookingById(
			bookingId
		);

		tickets_info.forEach((ticket: ITicketInfo) => {
			// Check token key exist in unique token array
			if (
				(ticket.tokenKey && uniqueTokenArray?.includes(ticket.tokenKey)) ||
				uniqueTokenArray?.includes(ticket.ticketNumber)
			) {
				// Status ticket is refunding/waiting refunding
				delete ticket.tokenKey;
				delete ticket.requestOwner;
				delete ticket.confirmReqOn;
				delete ticket.ticketChange;
				ticket.status = ETypeTicket.LIVE;
			}
			return ticket;
		});

		const sttCheck = [
			ETypeTicket.REFUNDING,
			ETypeTicket.REISSUING,
			ETypeTicket.REFUNDING_CONFIRMING,
			ETypeTicket.REISSUING_CONFIRMING,
		];

		// Update tickets_info booking to refund/reissue when cancel ticket
		// Status ticket: REFUNDING/REISSUING, REFUNDING/REISSUING_CONFIRMING -> LIVE
		// Status booking: CANCEL
		await updateBookingServer({
			id: bookingId,
			ticketsInfo: tickets_info,
			sttCheck,
			rootSttBooking: sttBooking,
			desSttBooking: ESttBooking.CANCEL,
			data: {},
		});

		return new NextResponse(JSON.stringify({ message: 'Success' }), {
			status: 200,
		});
	} catch (error: any) {
		console.log('error:', error);
		return new NextResponse(JSON.stringify({ message: error.message }), {
			status: 400,
			statusText: error.message,
		});
	}
}
