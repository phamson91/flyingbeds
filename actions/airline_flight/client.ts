import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getAirlineFlightByConditon = async (
	airline_id: string,
	departure: string,
	arrival: string
) => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('airline_flights_info')
		.select('*')
		.eq('airline_id', airline_id)
		.eq('departure', departure)
		.eq('arrival', arrival)
		.maybeSingle();
		

	if (error) {
		throw new Error(error.message);
	}

	return data ? data : null;
};

export const getTicketPriceById = async (flightId: string, serviceClass: string) => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('ticket_prices')
		.select('*')
		.eq('flight_id', flightId)
		.eq('class', serviceClass)
		.maybeSingle();
		

	if (error) {
		throw new Error(error.message);
	}

	return data ? data : null;
}

export const createAirlineFlight = async (airlineId: string, departure: string, arrival: string) => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('airline_flights_info')
		.insert({
			airline_id: airlineId,
			departure,
			arrival,
		})
		.select('*')
		.single();

	if (error) {
		throw new Error(error.message);
	}
	return data;
}

export const createTicketPrice = async (ticketPrice: any[]) => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('ticket_prices')
		.insert(ticketPrice)
		

	if (error) {
		throw new Error(error.message);
	}
	return data;

}

export const deleteAirlineById = async (airlineId: string) => {
	const supabase = createClientComponentClient({});
	const { error } = await supabase
		.from('airline_flights_info')
		.delete()
		.eq('airline_id', airlineId);

	if (error) {
		console.log('error', error);
		throw new Error(error.message);
	}
}