import docIssuanceIssueTicket from '@/lib/docIssuanceIssueTicket';
import fopCreateFromOfPayment from '@/lib/fopCreateFromOfPayment';
import pnrAddMultiElements from '@/lib/pnrAddMultiElements';
import pnrRetrieveByRloc from '@/lib/pnrRetrieveByRloc';
import redis from '@/lib/redis';
import ticketCreateTstFromPricing from '@/lib/ticketCreateTstFromPricing';
import { BookingTickets } from '@/types/types';
import { REDIS_BOOKING_STORAGE_PREFIX } from '@/utils/constant';
import { NextResponse } from 'next/server';
import ignoreMultiAvailability from '@/lib/api/ignoreMultiAvailability';

interface IParams {
	rloc: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
	try {
		const body = await request.json();
		const { sessionId, sequenceNumber, securityToken, tstRef, userId } = body;

		const ticketCreateRes = await ticketCreateTstFromPricing({
			sessionId,
			sequenceNumber,
			securityToken,
			tstRef,
		});

		const fopCreateRes = await fopCreateFromOfPayment({
			sessionId: ticketCreateRes.newSessionId,
			sequenceNumber: ticketCreateRes.newSequenceNumber,
			securityToken: ticketCreateRes.newSecurityToken,
		});

		const prnAddRes = await pnrAddMultiElements({
			sessionId: fopCreateRes.newSessionId,
			sequenceNumber: fopCreateRes.newSequenceNumber,
			securityToken: fopCreateRes.newSecurityToken,
		});

		const {
			resultBody: docIssueResultBody,
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		} = await docIssuanceIssueTicket({
			sessionId: prnAddRes.newSessionId,
			sequenceNumber: prnAddRes.newSequenceNumber,
			securityToken: prnAddRes.newSecurityToken,
		});

		// Ignore session
		await ignoreMultiAvailability({
			sessionId: newSessionId,
			sequenceNumber: newSequenceNumber,
			securityToken: newSecurityToken,
		});

		// check for error from API
		if (
			docIssueResultBody.DocIssuance_IssueTicketReply[0].processingStatus[0]
				.statusCode[0] !== 'O'
		) {
			throw new Error(
				docIssueResultBody.DocIssuance_IssueTicketReply[0].errorGroup[0].errorWarningDescription[0].freeText[0]
			);
		}

		const { rloc } = params;
		const { resultBody } = await pnrRetrieveByRloc(rloc);

		const dataElementsIndiv =
			resultBody.PNR_Reply[0].dataElementsMaster[0].dataElementsIndiv;

		// check if dataElementsIndiv > elementManagementData > segmentName = 'TK'
		const bookingTickets: BookingTickets = {
			tickets: [],
			rloc,
		};
		for (let dataElementIndiv of dataElementsIndiv) {
			const segmentName =
				dataElementIndiv.elementManagementData[0].segmentName[0];
			if (segmentName === 'TK') {
				// check if dataElementsIndiv > ticketElement > ticket > electronicTicketFlag true or false
				const ifTicketIssued = dataElementIndiv.ticketElement[0].ticket[0]
					.electronicTicketFlag
					? true
					: false;

				if (!ifTicketIssued) {
					throw new Error('Ticket not issued');
				}
			}
			// check for segmentName 'FA' in dataElementsIndiv array
			// extract ticketNumber, rloc, paxName
			if (segmentName === 'FA') {
				const ticketDetail =
					dataElementIndiv.otherDataFreetext[0].longFreetext[0];
				const ticketNumber = ticketDetail.split('/')[0].split(' ')[1];
				const paxType = ticketDetail.split('/')[0].split(' ')[0];

				// find corresponding paxName using reference > qualifier PT
				const paxRef =
					dataElementIndiv.referenceForDataElement[0].reference.find(
						(ref: any) => ref.qualifier[0] === 'PT'
					);
				const travellerInfo = resultBody.PNR_Reply[0].travellerInfo.find(
					(travellerInfo: any) =>
						travellerInfo.elementManagementPassenger[0].reference[0]
							.number[0] === paxRef.number[0]
				);
				const passengerType =
					travellerInfo.passengerData[0].travellerInformation[0].passenger[0]
						.type[0];

				// check if is infant
				const enhancedPassengerData =
					paxType === 'INF'
						? travellerInfo.enhancedPassengerData.find((data: any) => {
								const travellerNameInfo =
									data.enhancedTravellerInformation[0].travellerNameInfo[0];
								return (
									travellerNameInfo.type && travellerNameInfo.type[0] === 'INF'
								);
						  })
						: travellerInfo.enhancedPassengerData[0];

				const otherPaxNamesDetails =
					enhancedPassengerData.enhancedTravellerInformation[0]
						.otherPaxNamesDetails[0];
				const surName = otherPaxNamesDetails.surname[0];
				const firstName = otherPaxNamesDetails.givenName[0];
				const paxName = `${surName}/${firstName}`;

				bookingTickets.tickets.push({ ticketNumber, paxName, passengerType });
			}
		}

		redis.del(`${REDIS_BOOKING_STORAGE_PREFIX}:${userId}:${rloc}`);

		return NextResponse.json<BookingTickets>(bookingTickets);
	} catch (error: any) {
		if (error.message === 'Ticket not issued') {
			return new NextResponse(JSON.stringify({ error: error.message }), {
				status: 400,
			});
		}
		console.log(error.message);
		return new NextResponse(
			JSON.stringify({
				error: `Server or network error. Ref: ${error.message}`,
			}),
			{ status: 500 }
		);
	}
}
