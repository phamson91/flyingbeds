import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getUserFromServer = async () => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	return data;
};

export const getUserById = async (userId: string): Promise<any> => {
	const supabase = createServerComponentClient(
		{
			cookies: cookies,
		},
		{
			supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
		}
	);

	const { data, error } = await supabase.auth.admin.getUserById(userId);

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	return data as any;
};
