import farePriceWithoutPnr from '@/lib/api/farePriceWithoutPnr';
import { NextResponse } from 'next/server';

interface AttributeDetail {
	attributeType: string[];
	attributeDescription: string[];
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// const {
		// 	sessionId,
		// 	sequenceNumber,
		// 	securityToken,
		// 	orgDesDetails,
		// 	passengers,
		// } = body;

		const {
			resultBody: { Fare_InformativePricingWithoutPNRReply },
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		} = await farePriceWithoutPnr(body);

		// Case api return error text
		const applicationError =
			Fare_InformativePricingWithoutPNRReply[0].errorGroup;

		if (applicationError) {
			throw new Error(
				`API Error: ${applicationError[0].errorWarningDescription[0].freeText[0]}`
			);
		}

		// return fareDataInformation
		const fareList =
			Fare_InformativePricingWithoutPNRReply[0].mainGroup[0]
				.pricingGroupLevelGroup;

		const faresInfo = groupFareInfo(fareList);

		return NextResponse.json<any>({
			data: fareList,
			faresInfo,
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		});
	} catch (error: any) {
		if (error.message.includes('API Error')) {
			return new NextResponse(JSON.stringify({ error: error.message }), {
				status: 500,
			});
		}
		return new NextResponse(
			JSON.stringify({
				error: error.message,
			}),
			{
				status: 500,
			}
		);
	}
}

/**
 * Groups fare information based on fare basis code and calculates gross fare, total gross, taxes, agent commission, agent net, airline commission, airline net, and TST reference.
 */
const groupFareInfo = (fareList: any) => {
	const initFareInfo: any = {
		ADT: {
			totalGross: 0,
			taxes: 0,
		},
		CH: {
			totalGross: 0,
			taxes: 0,
		},
		IN: {
			totalGross: 0,
			taxes: 0,
		},
	};
	// loop through fareList,
	// return fareList.reduce((acc: any, fareInfo: any) => {
	// 	// ADT, CH, INF
	// 	const passengerType =
	// }, {
	// 	faresInfo: {},
	// });
	fareList.forEach((fareInfo: any) => {
		const passengerType =
			fareInfo.fareInfoGroup[0].segmentLevelGroup[0].ptcSegment[0]
				.quantityDetails[0].unitQualifier[0];
		// Gross fare
		const grossAmount =
			fareInfo.fareInfoGroup[0].fareAmount[0].monetaryDetails[0].amount[0];
		// Total gross
		const fareAmount =
			fareInfo.fareInfoGroup[0].fareAmount[0].otherMonetaryDetails[0].amount[0];
		if (
			initFareInfo[passengerType].totalGross === 0 ||
			initFareInfo[passengerType].totalGross > fareAmount
		) {
			// initFareInfo[passengerType].grossFare = Number(grossAmount);
			initFareInfo[passengerType].totalGross = Number(fareAmount);
			initFareInfo[passengerType].taxes =
				Number(fareAmount) - Number(grossAmount);
		}
	});

	return initFareInfo;
};
