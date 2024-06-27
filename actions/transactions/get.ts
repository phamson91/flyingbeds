import { ITransactionCalc, ITransaction } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getTransactionById = async (
	userId: string,
	startDate: Date,
	endDate: Date,
	initialBalance: number
): Promise<ITransactionCalc[] | null> => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('transactions')
		.select('*')
		.eq('receiver_user', userId)
		.gte('created_at', startDate)
		.lte('created_at', endDate)
		.order('created_at', { ascending: true });

	if (error) {
		console.log(error);
		return null;
	}

	if (data.length === 0) return null;

	const transactions = calcBalance(data as ITransactionCalc[], initialBalance);

	return transactions;
};

/**
 * Calculates the balance for each transaction.
 */
const calcBalance = (
	transactions: ITransaction[],
	initialBalance: number
): ITransactionCalc[] => {
	return transactions.reduce(
		(accumulator: ITransactionCalc[], row: ITransactionCalc) => {
			const balance = +row.amount;
			if (accumulator.length > 0) {
				// If the accumulator array already has an element, update the balance value of the row
				const lastBalance = accumulator[accumulator.length - 1].balance ?? 0;
				row.balance = lastBalance + balance;
			} else {
				// If the accumulator array is empty, use the initialBalance value
				row.balance = initialBalance + balance;
			}

			// Add the updated row to the accumulator array
			accumulator.push(row);
			return accumulator;
		},
		[]
	);
};
