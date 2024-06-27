import { IStatement } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface IGetStatementById {
	userId: string;
	page?: number;
	perPage?: number;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
}

interface IStatementRes {
	data: IStatement[] | null;
	count: number | null;
	error: string | null;
}

export const getStatementById = async ({
	userId,
	page = 1,
	perPage = 10,
	startDate = null,
	endDate = null,
}: IGetStatementById): Promise<IStatementRes> => {
	const supabase = createClientComponentClient({});

	let query = supabase
		.from('statements')
		.select(
			'id, user_id, start_date, end_date, initial_balance, ending_balance',
			{ count: 'exact' }
		)
		.eq('user_id', userId);

	// If the page and perPage values are provided, add the range to the query
	if (page && perPage) {
		query = query.range((page - 1) * perPage, page * perPage - 1);
	}
	//If the startDate and endDate values are provided, add the range to the query
	if (startDate && endDate) {
		query = query.gte('start_date', startDate).lte('end_date', endDate);
	}

	// Order the query by start_date in descending order
	query = query.order('start_date', { ascending: false });

	const { data, count, error } = await query;

	if (error) {
		return { data: null, count: null, error: error.message };
	}

	return { data, count, error: null };
};
