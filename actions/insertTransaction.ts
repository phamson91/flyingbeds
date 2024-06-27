import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface InsertTransactionProps {
	createdBy: string;
	receiverUser: string;
	amount: number;
	type: string;
	description: string;
}

// Also trigger update user.balance on supabase
export const insertTransaction = async (data: InsertTransactionProps) => {
	const { createdBy, receiverUser, amount, type, description } = data;
	const supabase = createClientComponentClient();
	const { error } = await supabase.from('transactions').insert([
		{
			created_by: createdBy,
			receiver_user: receiverUser,
			amount,
			type,
			description,
			currency: 'AUD',
		},
	]);

	if (error) {
		throw new Error(error.message);
	}
};
