import {
	createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';

interface UpdateRowProps {
	[key: string]: any;
	table: string;
	id?: string;
}

export const updateRow = async ({
	id,
	table,
	...data
}: UpdateRowProps): Promise<void> => {
	const supabase = createClientComponentClient({});

	const { error } = id
		? await supabase
				.from(table)
				.update({ ...data, updated_at: new Date().toUTCString() })
				.eq('id', id)
				.select()
		: await supabase.from(table).insert([{ ...data }]);

	console.log("data", data);
	if (error) {
		console.log('error:', error);
		throw new Error(error.message);
	}
};
