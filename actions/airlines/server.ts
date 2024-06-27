import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getCommByCode = async (
	airlineCode: string,
	fareBasicCode: string
) => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('airlines')
		.select('*, commissions(*)')
		.eq('short_name', airlineCode)
		.eq('commissions.fare_basic', fareBasicCode)
		.limit(1)
		.limit(1, { foreignTable: 'commissions' })
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}

	// if (data && data?.commissions?.length < 1) {
	// 	throw new Error('Fare basis code not found for this airline. Please Contact Administrator');
	// }

	return data;
};

export const getAirlineFlightInfo = async (airlineCodes: string[], departure: string, arrival: string) => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('airlines')
		.select('*, airline_flights_info(*, ticket_prices(*))')
		.in('short_name', airlineCodes)
		.eq('airline_flights_info.departure', departure)
		.eq('airline_flights_info.arrival', arrival)
		.limit(1, { foreignTable: 'airline_flights_info'});

	if (error) {
		// throw new Error(error.message);
		return null;
	}

	return data;
}

export const getAirlineFlightById = async (airlineId: string) => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('airlines')
		.select('*, airline_flights_info(*, ticket_prices(*))')
		.eq('id', airlineId)
		.single();

	if (error) {
		// throw new Error(error.message);
		return null;
	}

	return data;
}
