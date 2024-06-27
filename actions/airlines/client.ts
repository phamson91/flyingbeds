import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getAirlineById = async (id: string, fare_basic: string) => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('airlines')
		.select('*, commissions(id, fare_basic, user_commission)')
		.eq('id', id)
		.eq('commissions.fare_basic', fare_basic)
		.limit(1)
		.limit(1, { foreignTable: 'commissions' })
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
};
