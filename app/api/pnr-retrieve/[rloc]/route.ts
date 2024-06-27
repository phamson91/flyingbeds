import { formatMonth } from '@/lib/formatMonth';
import pnrRetrieveByRloc from '@/lib/pnrRetrieveByRloc';
import { TravellerInfo } from '@/types/types';
import { Database } from '@/types/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

interface IParams {
	rloc: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const supabase = createServerActionClient<Database>(
			{ cookies },
			{ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY }
		);

		const { data: airlinesData, error } = await supabase
			.from('airlines')
			.select('short_name, id');

		if (error) {
			return new NextResponse(
				JSON.stringify({
					error: 'Cannot get supported airlines list. Please contact support',
				}),
				{ status: 500 }
			);
		}

		const { rloc } = params;

		const { resultBody, newSessionId, newSequenceNumber, newSecurityToken } =
			await pnrRetrieveByRloc(rloc);

		const dataElementsIndiv =
			resultBody.PNR_Reply[0].dataElementsMaster[0].dataElementsIndiv;

		// // check if dataElementsIndiv > elementManagementData > segmentName = 'TK'
		// for (let dataElementIndiv of dataElementsIndiv) {
		// 	if (dataElementIndiv.elementManagementData[0].segmentName[0] === 'TK') {
		// 		// check if dataElementsIndiv > ticketElement > ticket > electronicTicketFlag true or false
		// 		const ifTicketIssued = dataElementIndiv.ticketElement[0].ticket[0]
		// 			.electronicTicketFlag
		// 			? true
		// 			: false;

		// 		if (ifTicketIssued) {
		// 			throw new Error('Ticket already issued');
		// 		}
		// 		break;
		// 	}
		// }

		// passenger info
		// Create list of passengers by checking travellerInfo
		// Check if passenger including infant
		let travellerInfos: TravellerInfo[] = [];
		resultBody.PNR_Reply[0].travellerInfo.forEach((info: any) => {
			const enhancedPassengerData = info.enhancedPassengerData;
			enhancedPassengerData.forEach((data: any) => {
				const enhancedTravellerInformation =
					data.enhancedTravellerInformation[0];
				const travellerNameInfo =
					enhancedTravellerInformation.travellerNameInfo[0];
				// assume if no type, then type is adult -> fix: infant
				const paxType = travellerNameInfo.type
					? travellerNameInfo.type[0]
					: 'INF';

				const otherPaxNamesDetails =
					enhancedTravellerInformation.otherPaxNamesDetails[0];
				const surName = otherPaxNamesDetails.surname[0];
				const givenName = otherPaxNamesDetails.givenName[0];
				const paxName = `${surName}/${givenName}`;

				travellerInfos.push({ paxType, paxName });
			});
		});

		if (!resultBody.PNR_Reply[0]?.originDestinationDetails) {
			throw new Error('No itinerary found');
		}

		// sector info: [{}, {}]
		const itineraryInfos =
			resultBody.PNR_Reply[0].originDestinationDetails[0].itineraryInfo;

		const sectorInfos = itineraryInfos.map((itineraryInfo: any) => {
			const travelProduct = itineraryInfo.travelProduct[0];
			const flightDetails = travelProduct.productDetails[0];
			const boardPoint = travelProduct.boardpointDetail[0].cityCode[0];
			const offPoint = travelProduct.offpointDetail[0].cityCode[0];

			const flightNumber = flightDetails.identification[0];
			const airlineCode = travelProduct.companyDetail[0].identification[0];
			const airlineDetail = airlinesData.find(
				(airlineData) => airlineData.short_name === airlineCode
			);

			if (!airlineDetail) {
				throw new Error('Booking code is not from supported airline');
			}

			const journey = `${boardPoint}->${offPoint}`;
			const classOfService = flightDetails.classOfService[0];
			const depDate = travelProduct.product[0].depDate[0];
			const date = depDate.slice(0, 2);
			const monthNumber = depDate.slice(2, 4);
			const monthWord = formatMonth(monthNumber);
			const year = depDate.slice(4);
			const departureDate = `${date} ${monthWord} ${year}`;
			const status = itineraryInfo.relatedProduct[0].status[0];

			return {
				flightNumber,
				airline: airlineCode,
				airlineId: airlineDetail.id,
				journey,
				classOfService,
				departureDate,
				status,
			};
		});

		return NextResponse.json({
			sectorInfos,
			travellerInfos,
			rloc,
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		});
	} catch (error: any) {
		console.log(error);
		if (error.code === 'ERR_BAD_RESPONSE') {
			const { response } = error;
			const json = await parseStringPromise(response.data);
			const fault = json['soapenv:Envelope']['soapenv:Body'][0][
				'soap:Fault'
			][0]['faultstring'][0] as string;
			if (fault.includes('INVALID RECORD LOCATOR')) {
				return new NextResponse(
					JSON.stringify({ error: 'Invalid record locator' }),
					{ status: 400 }
				);
			}
		}

		if (
			[
				'Booking code is not from supported airline',
				'No itinerary found',
			].includes(error.message as string)
		) {
			return new NextResponse(JSON.stringify({ error: error.message }), {
				status: 400,
			});
		}

		return new NextResponse(
			JSON.stringify({
				error: `Server or network error. Ref: ${error.message}`,
			}),
			{ status: 500 }
		);
	}
}
