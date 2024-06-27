import { ILocation } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getLocations = async (): Promise<ILocation[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('locations')
		.select('id, code, name, region, airport')
		.order('region', { ascending: false });

	if (error) {
		console.log(error.message);
	}

	return (data as ILocation[]) || [];
};