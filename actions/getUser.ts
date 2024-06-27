import { UserDetails } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getUser = async (userId: string): Promise<UserDetails> => {
	const supabase = createServerComponentClient(
		{
			cookies: cookies,
		},
		{
			supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
		}
	);

	const { data: tableData, error: tableError } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single();

	if (tableError) {
		console.log(tableError.message);
	}

	// To not duplicate data and have single source of truth, get email and phone from Supabase Auth
	const { data: authData, error: authError } =
		await supabase.auth.admin.getUserById(userId);

	const email = authData.user?.email;
	const phone = authData.user?.phone;

	if (authError) {
		console.log(authError.message);
	}

	const userData = { ...tableData, email, phone };

	return (userData as any) || {};
};

export default getUser;
