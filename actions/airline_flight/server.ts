import { IAirlineInfo } from '@/types/airline';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getAirlineFlights = async (
	flightIds: {id: string}[]
): Promise<IAirlineInfo[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const flightIdsArr = flightIds.map((flightId) => (flightId.id));

	const { data, error } = await supabase
		.from('airline_flights_info')
		.select('*, ticket_prices (*)')
		.in('id', flightIdsArr)

	if (error) {
		// throw new Error(error.message);
		console.log("error", error)
	}

	// if (data && data?.commissions?.length < 1) {
	// 	throw new Error('Fare basis code not found for this airline. Please Contact Administrator');
	// }

	return data as IAirlineInfo[];
};

interface IAirlineFlightsByAirlineParams {
	departure: string;
	arrival: string;
	airlineIds: string[];
}

export const getAirlineFlightsByAirline = async ({
	departure,
	arrival,
	airlineIds,
}: IAirlineFlightsByAirlineParams): Promise<IAirlineInfo[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('airline_flights_info')
		.select('*, ticket_prices (*)')
		.eq('departure', departure)
		.eq('arrival', arrival)
		.in('airline_id', airlineIds)

	if (error) {
		// throw new Error(error.message);
		console.log("error", error)
	}

	// if (data && data?.commissions?.length < 1) {
	// 	throw new Error('Fare basis code not found for this airline. Please Contact Administrator');
	// }

	return data as IAirlineInfo[];
};
