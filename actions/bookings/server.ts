import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getBookingById = async (id: string) => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('bookings')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error('Not found booking');
	}

	data.tickets_info = JSON.parse(data.tickets_info);

	return (data as any) || {};
};
