import { IAirlineInfo } from '@/types/airline';
import { Commission, IFee } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface AirlineDetail {
	id: string;
	name: string;
	short_name: string;
	notes: string | null;
	commissions: Commission[] | [];
	fees: IFee[] | [];
	airline_flights_info: IAirlineInfo[];
}

const getAirline = async (airlineId: string): Promise<AirlineDetail> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('airlines')
		.select('id, name, short_name, notes, commissions (*), fees (*), airline_flights_info (*, ticket_prices (*))')
		.eq('id', airlineId)
		.order('updated_at', { foreignTable: 'commissions', ascending: false })
		.order('updated_at', { foreignTable: 'fees', ascending: false })
		.single();

	if (error) {
		console.log(error.message);
	}

	return (data as any) || [];
};

export default getAirline;
