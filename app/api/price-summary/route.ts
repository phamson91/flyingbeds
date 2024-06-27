import { getCommByCode } from '@/actions/airlines/server';
import farePricePnrWithBookingClass from '@/lib/farePricePnrWithBookingClass';
import { IGroupFareInfo } from '@/types/booking';
import { PriceList } from '@/types/types';
import { NextResponse } from 'next/server';

interface AttributeDetail {
	attributeType: string[];
	attributeDescription: string[];
}

const getAirlineComRate = (attributeDetails: AttributeDetail[]): number => {
	const comInfo = attributeDetails.find(
		(attributeDetail) => attributeDetail.attributeType[0] === 'COM'
	);

	if (!comInfo) {
		throw new Error('No commission found');
	}
	return Number(comInfo.attributeType[0].slice(3, 7));
};

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { sessionId, sequenceNumber, securityToken } = body;

		const {
			resultBody: { Fare_PricePNRWithBookingClassReply },
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		} = await farePricePnrWithBookingClass({
			sessionId,
			sequenceNumber,
			securityToken,
		});

		const applicationError =
			Fare_PricePNRWithBookingClassReply[0].applicationError;

		if (applicationError) {
			throw new Error(
				`API Error: ${applicationError[0].errorWarningDescription[0].freeText[0]}`
			);
		}

		// return fareDataInformation
		const fareList = Fare_PricePNRWithBookingClassReply[0].fareList;

		const fareBasicCode = getFareBasicCode(fareList);
		const airlineCode = getAirlineCode(fareList);
		console.log('farebasiccode', fareBasicCode, airlineCode);

		const data = await getCommByCode(airlineCode, fareBasicCode);

		// fareBasicCode Commission Rate
		const userComm = data?.commissions[0]?.user_commission ?? 0;
		const airlineComm = data?.commissions[0]?.airline_commission ?? 0;

		const { faresInfo }: IGroupFareInfo = groupFareInfo(
			fareList,
			Number(userComm),
			Number(airlineComm)
		);

		return NextResponse.json<PriceList>({
			faresInfo,
			fareBasicCode,
			commRate: `${userComm * 100}%`,
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		});
	} catch (error: any) {
		console.log(error);
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
const groupFareInfo = (
	fareList: any,
	commRate: number,
	airCommission: number
): IGroupFareInfo => {
	// loop through fareList,
	return fareList.reduce(
		(acc: IGroupFareInfo, fareInfo: any) => {
			// Init params
			const fareBasicCode = getFareBasic(fareInfo.fareComponentDetailsGroup);
			const result = [];

			// find first one with ADT, CH, IN segmentInformation>fareQualifier>fareBasisDetails>discTktDesignator,
			// ADT or CH or IN
			const discTktDesignator =
				fareInfo.segmentInformation[0].fareQualifier[0].fareBasisDetails[0]
					.discTktDesignator[0];

			// Calculate gross fare and total gross
			const fareAmounts = {} as { grossFare: number; totalGross: number };
			console.log(
				'fareInfo.fareDataInformation[0].fareDataSupInformation',
				fareInfo.fareDataInformation[0].fareDataSupInformation
			);
			fareInfo.fareDataInformation[0].fareDataSupInformation.forEach(
				(fareDataSupInfo: any) => {
					if (fareDataSupInfo.fareDataQualifier[0] === '712') {
						fareAmounts.totalGross = Number(fareDataSupInfo.fareAmount[0]);
					}
					// if (fareDataSupInfo.fareDataQualifier[0] === 'E') {
					// 	fareAmounts.grossFare = Number(fareDataSupInfo.fareAmount[0]);
					// }
					else {
						fareAmounts.grossFare = Number(fareDataSupInfo.fareAmount[0]);
					}
				}
			);
			// gross fare, taxes, agent comm, agent net, total gross
			// gross fare + taxes = total gross
			// agent comm = gross fare * commRate
			// agent net = total gross - agent comm

			const { grossFare, totalGross } = fareAmounts;

			const taxes = totalGross - grossFare;
			const agentComm = grossFare * commRate;
			const agentNet = totalGross - agentComm;

			const attributeDetails = fareInfo.otherPricingInfo[0].attributeDetails;
			if (!attributeDetails) {
				throw new Error('No commission found');
			}

			const airlineComRate = getAirlineComRate(attributeDetails);

			if (airlineComRate > airCommission) {
				throw new Error(
					'Commission discrepancy. Please contact administrator.'
				);
			}
			const airlineComm = grossFare * airlineComRate;
			const airlineNet = totalGross - airlineComm;
			const tstRef = fareInfo.fareReference[0].uniqueReference[0];

			const params = {
				tstRef,
				discTktDesignator,
				grossFare,
				totalGross,
				taxes,
				agentComm,
				agentNet,
				airlineNet,
			};
			// If fareBasicCode is set, push params to faresDetail
			if (acc.faresInfo[fareBasicCode]) {
				result.push(...acc.faresInfo[fareBasicCode].faresDetail, params);
				acc.faresInfo[fareBasicCode].faresDetail = result;
			} else {
				// If fareBasicCode is not set, push params to faresDetail and pointDetails
				// Get point details for each fare Component Details Group
				const pointDetails = getPointDetails(
					fareInfo.fareComponentDetailsGroup
				);

				result.push(params);
				acc.faresInfo[fareBasicCode] = {
					faresDetail: result,
					pointDetails: pointDetails,
				};
			}

			return acc;
		},
		{
			faresInfo: {},
		}
	);
};

/**
 * Returns the fare basis details for a given fare detail group.
 */
const getFareBasic = (fareDetailGroup: any) => {
	// If fareDetailGroup is an array, it means there are multiple fare detail groups
	if (Array.isArray(fareDetailGroup)) {
		return fareDetailGroup
			.map(
				(fareDetail: any) =>
					fareDetail?.componentClassInfo[0]?.fareBasisDetails[0]
						?.rateTariffClass[0] ?? 'N/A'
			)
			.join('_');
	}

	return (
		fareDetailGroup?.componentClassInfo[0]?.fareBasisDetails[0]
			?.rateTariffClass[0] ?? 'N/A'
	);
};

/**
 * Returns an array of objects containing point details and short fare basis for a given fare detail group.
 */
const getPointDetails = (fareDetailGroup: any) => {
	// If fareDetailGroup is an array, it means there are multiple fare detail groups
	if (Array.isArray(fareDetailGroup)) {
		return fareDetailGroup.map((fareDetail: any) => {
			const pointGroup = fareDetail?.marketFareComponent[0];

			return {
				point: `${pointGroup?.boardPointDetails[0]?.trueLocationId[0]}-${pointGroup?.offpointDetails[0]?.trueLocationId[0]}`,
				shortFareBasic:
					fareDetail?.componentClassInfo[0].fareBasisDetails[0]
						.rateTariffClass[0],
			};
		});
	}

	return [
		{
			point: `${fareDetailGroup?.marketFareComponent[0]?.boardPointDetails[0]?.trueLocationId[0]}-${fareDetailGroup?.marketFareComponent[0]?.offpointDetails[0]?.trueLocationId[0]}`,
			shortFareBasic:
				fareDetailGroup?.componentClassInfo[0]?.fareBasisDetails[0]
					?.rateTariffClass[0],
		},
	];
};

const getAirlineCode = (fareList: any) => {
	return fareList[0]?.validatingCarrier[0]?.carrierInformation[0]
		?.carrierCode[0];
};

const getFareBasicCode = (fareList: any) => {
	return fareList[0]?.segmentInformation[0]?.fareQualifier[0]
		.fareBasisDetails[0]?.fareBasisCode[0];
};
