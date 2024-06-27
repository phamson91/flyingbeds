import { UserDetails } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getUsers = async (): Promise<UserDetails[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('users')
		.select('*')
		.order('balance', { ascending: true });

	if (error) {
		console.log(error.message);
	}

	return (data as any) || [];
};

export default getUsers;
