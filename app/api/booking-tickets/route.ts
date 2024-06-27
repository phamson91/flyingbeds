import { getAirlineFlightInfo } from '@/actions/airlines/server';
import airMultiAvailability from '@/lib/api/airMultiAvailability';
import { ITicketPrice } from '@/types/airline';
import { IPriceInfo, InfoOnClass } from '@/types/bookingTicket';
import { NextResponse, NextRequest } from 'next/server';

interface IParams {
	departure: string;
	arrival: string;
	departureDate: string;
	countTicket: string;
	tripType: string;
}

export async function GET(request: NextRequest) {
	const {
		nextUrl: { search },
	} = request;
	const urlSearchParams = new URLSearchParams(search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const {
		departure,
		arrival,
		departureDate,
		countTicket,
		airlineCode,
		tripType,
	} = params;

	try {
		const { resultBody, newSessionId, newSequenceNumber, newSecurityToken } =
			await airMultiAvailability({
				departure,
				arrival,
				departureDate,
				countTicket,
				airlineCode: airlineCode.split(','),
			});

		// Fetch data airline from supabase
		const airlineFlightInfo =
			(await getAirlineFlightInfo(
				airlineCode.split(','),
				departure,
				arrival
			)) ?? [];

		const dataElementsIndiv =
			resultBody.Air_MultiAvailabilityReply[0].singleCityPairInfo[0].flightInfo;

		const flightInfos =
			resultBody.Air_MultiAvailabilityReply[0].singleCityPairInfo[0].flightInfo;

		const sectorInfos = flightInfos.map((flightInfo: any) => {
			const basicFlightInfo = flightInfo.basicFlightInfo[0];
			const flightDetails = basicFlightInfo.flightDetails[0];

			const additionalFlightInfo = flightInfo.additionalFlightInfo[0];

			const departureLocation =
				basicFlightInfo.departureLocation[0].cityAirport[0];
			const arrivalLocation = basicFlightInfo.arrivalLocation[0].cityAirport[0];
			const departureDate = flightDetails.departureDate[0];
			const departureTime = flightDetails.departureTime[0];
			const arrivalDate = flightDetails.arrivalDate[0];
			const arrivalTime = flightDetails.arrivalTime[0];
			const airLineCompany = basicFlightInfo.marketingCompany[0].identifier[0];
			const flightIdentifier =
				basicFlightInfo.flightIdentification[0].number[0];
			const typeOfCraft =
				additionalFlightInfo.flightDetails[0].typeOfAircraft[0];
			const timeDuration = additionalFlightInfo.flightDetails[0].legDuration[0];

			const infoOnClasses = flightInfo.infoOnClasses.map((infoOnClass: any) => {
				const productClassDetail = infoOnClass.productClassDetail[0];
				return {
					serviceClass: productClassDetail.serviceClass[0],
					availabilityStatus: productClassDetail.availabilityStatus[0],
				};
			});
			// Find airline info of current flight
			const airlineInfo =
				airlineFlightInfo?.find(
					(airline) => airline.short_name === airLineCompany
				) ?? {};
			if (Object.keys(airlineInfo ?? [])?.length === 0)
				throw new Error('Not found airline!');
			if (airlineInfo?.airline_flights_info?.length === 0)
				throw new Error(
					'The flight route has not been registered on the system!'
				);
			if (airlineInfo?.airline_flights_info[0]?.ticket_prices?.length === 0)
				throw new Error('Prices for ticket classes have not been registered!');
			const ticketPrices =
				airlineInfo?.airline_flights_info[0]?.ticket_prices ?? [];
			console.log('infoOnClasses', infoOnClasses);
			const priceInfo = generatePriceInfo(
				ticketPrices,
				infoOnClasses,
				tripType
			);

			if (!priceInfo.business.class || !priceInfo.economy.class) {
				throw new Error('Class of Service is not exists!');
			}

			return {
				airLineCompany,
				flightIdentifier,
				departureLocation,
				arrivalLocation,
				departureDate,
				arrivalDate,
				departureTime,
				arrivalTime,
				typeOfCraft,
				timeDuration,
				infoOnClasses,
				priceInfo,
			};
		});

		return NextResponse.json({
			sectorInfos,
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		});
	} catch (error: any) {
		console.log('error', error.message);
		return new NextResponse(JSON.stringify({ error: error.message }), {
			status: 400,
		});
	}
}

const initPriceInfo: IPriceInfo = {
	business: {
		type: 'Business',
		price: 0,
		class: '',
		condition: '',
	},
	economy: {
		type: 'Economy',
		price: 0,
		class: '',
		condition: '',
	},
};

const generatePriceInfo = (
	ticketPrices: ITicketPrice[],
	infoOnClasses: InfoOnClass[],
	tripType: string
): IPriceInfo => {
	const result = infoOnClasses.reduce(
		(accumulator: IPriceInfo, row: InfoOnClass) => {
			const serviceClass = row.serviceClass;
			const classInfo = ticketPrices.find(
				(ticketPrice) => ticketPrice.class === serviceClass
			);

			if (!classInfo) return accumulator;
			const price =
				tripType === 'roundtrip' ? classInfo.priceRT : classInfo.priceOW;
			const classType = classInfo.type === 'Business' ? 'business' : 'economy';
			if (
				accumulator[classType].price === 0 ||
				accumulator[classType].price > price
			) {
				accumulator[classType].price = price;
				accumulator[classType].class = classInfo.class;
				accumulator[classType].condition = classInfo.condition;
			}
			return accumulator;
		},
		{
			...initPriceInfo,
		}
	);

	return result;
};
