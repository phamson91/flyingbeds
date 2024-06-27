import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface UpdateRowProps {
	[key: string]: any;
	table: string;
	id?: string;
}

export const updateRowServer = async ({
	id,
	table,
	...data
}: UpdateRowProps): Promise<void> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { error } = id
		? await supabase
				.from(table)
				.update({ ...data, updated_at: new Date().toUTCString() })
				.eq('id', id)
				.select()
		: await supabase.from(table).insert([{ ...data }]);

	if (error) {
		console.log('error:', error);
		throw new Error(error.message);
	}
};
