import { IGetLogging, ILogging } from '@/types/logging';
import { ETransactionType } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ITransactionRes {
	data: ILogging[] | null;
	count: number | null;
	error: string | null;
}

export const getLogging = async ({
	page = 1,
	perPage = 10,
	startDate,
	endDate,
	companyName,
}: IGetLogging): Promise<ITransactionRes> => {
	const supabase = createClientComponentClient({});

	let query = supabase
		.from('transactions')
		.select(
			'id, created_by (company_name), receiver_user!inner (company_name), amount, currency, description, created_at',
			{
				count: 'exact',
			}
		)
		.in('type', [ETransactionType.TOP_UP, ETransactionType.REDUCE])
		.limit(1, { foreignTable: 'created_by' })
		.limit(1, { foreignTable: 'receiver_user' });

	//If company name value are provided, add the like to query.
	if (companyName) {
		query = query.filter(
			'receiver_user.company_name',
			'ilike',
			`%${companyName}%`
		);
	}

	// If the page and perPage values are provided, add the range to the query
	if (page && perPage) {
		query = query.range((page - 1) * perPage, page * perPage - 1);
	}

	//If the startDate and endDate values are provided, add the range to the query
	if (startDate && endDate) {
		query = query.gte('created_at', startDate).lte('created_at', endDate);
	}

	// Order the query by start_date in descending order
	query = query.order('created_at', { ascending: false });

	const { data, count, error } = await query;

	if (error) {
		return { data: null, count: null, error: error.message };
	}

	return { data: data as any, count, error: null };
};
