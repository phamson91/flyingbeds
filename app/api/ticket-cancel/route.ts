import { NextResponse } from 'next/server';
import ticketCancelDoc from '@/lib/api/ticketCancelDoc';
import { updateBookingServer } from '@/actions/bookings/updateServer';
import { getBookingById } from '@/actions/bookings/server';
import { ESttBooking, ETypeTicket, ITicketInfo } from '@/types/booking';
import { updateRowServer } from '@/actions/updateServer';
import { ETransactionDescription } from '@/types/types';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const {
			sessionId,
			sequenceNumber,
			securityToken,
			ticketsNumber,
			airlineCompany,
			booking,
		} = body;

		const result = await ticketCancelDoc({
			sessionId,
			sequenceNumber,
			securityToken,
			ticketsNumber,
			airlineCompany,
		});

		console.log('result', result);
		const ticketCancelDocReply =
			result.resultBody.Ticket_CancelDocumentReply[0];

		const transactionResults = ticketCancelDocReply.transactionResults[0];

		const responseDetails = transactionResults.responseDetails[0];

		const statusCode = responseDetails.statusCode[0];
		console.log('statusCode', statusCode);

		// Update status ticket info to refunded/reissued when cancel ticket
		if (statusCode === 'O') {
			const { tickets_info, status: sttBooking } = await getBookingById(
				booking.id
			);

			const sttCheck = [ETypeTicket.VOID];

			// Handle ticket info
			let amountVoid = 0;
			const ticketInfo = tickets_info.map((ticket: any) => {
				if (ticketsNumber.includes(ticket?.ticketNumber.replace(/-/g, ''))) {
					delete ticket.selected;
					ticket.status = ETypeTicket.VOID;
					amountVoid = amountVoid + Number(ticket?.price || 0);
				}
				return ticket;
			});

			// Update tickets_info booking to void when void ticket
			// Status booking: VOID
			await updateBookingServer({
				id: booking.id,
				ticketsInfo: ticketInfo,
				sttCheck,
				rootSttBooking: sttBooking,
				desSttBooking: ESttBooking.VOID,
				data: {},
			});

			const transactionRowData = {
				receiver_user: booking!.user_id,
				created_by: booking!.user_id,
				type: ETypeTicket.VOID,
				description: ETransactionDescription.VOID,
				amount: Number(amountVoid),
				cost: 0,
				booking_id: booking!.id,
				currency: 'AUD',
			};
			// Create transaction
			await updateRowServer({
				table: 'transactions',
				...transactionRowData,
			});

			return NextResponse.json({
				result,
			});
		} else {
			const error = transactionResults.errorGroup[0].errorWarningDescription[0].freeText[0];
			console.log('error', error);
			return new NextResponse(
				JSON.stringify({
					error,
					data: transactionResults,
				}),
				{
					status: 500,
				}
			);
		}
	} catch (error: any) {
		console.log('error', error);
		return new NextResponse(
			JSON.stringify({
				error: "Can't cancel ticket",
			}),
			{
				status: 500,
			}
		);
	}
}
