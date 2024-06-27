import {
	IAdminReportByAgents,
	IReportConditionReq,
	IReportAgentsRes,
} from '@/types/report';
import { ETransactionType } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface IAdminReportByAgentsRes {
	data: IAdminReportByAgents | null;
	error: string | null;
}

export const getAdminReportByAgents = async ({
	filterDate,
}: Omit<IReportConditionReq, 'userId'>): Promise<IAdminReportByAgentsRes> => {
	const filterDateFormatted = filterDate.toISOString().slice(0, 10);
	const supabase = createClientComponentClient({});

	//Fetch transaction by date
	const { data, error } = await supabase
		.from('transactions')
		.select('amount, cost, receiver_user (company_name)')
		.eq('type', ETransactionType.ISSUE_TICKET)
		.gte('created_at', filterDateFormatted)
		.order('created_at', { ascending: false })
		.limit(1, { foreignTable: 'receiver_user' });

	if (error) {
		return { data: null, error: error.message };
	}

	const reportByAgents: IAdminReportByAgents = reportGroupAgents(data as any);

	return { data: reportByAgents, error: null };
};

/**
 * Groups transaction data by receiver user (agent) and calculates the total amount, cost and profit for each agent.
 */
const reportGroupAgents = (data: IReportAgentsRes[]) => {
	const reportAgent = data.reduce(
		(acc: IAdminReportByAgents, row: IReportAgentsRes) => {
			const name = row.receiver_user.company_name;
			const amount = Math.abs(row.amount) || 0;
			const cost = row.cost || 0;
			const totalAmount = acc.totalAmount + amount;
			const totalCost = acc.totalCost + cost;

			// If user name already exists in the acc, add the name, amount, cost and profit
			if (acc.data[name]) {
				acc.data[name].amount += amount;
				acc.data[name].cost += cost;
				acc.data[name].profit += amount - cost;
				acc.totalAmount = totalAmount;
				acc.totalCost = totalCost;
			} else {
				acc.data[name] = {
					amount: amount,
					cost: cost,
					profit: amount - cost,
				};
				acc.totalAmount = totalAmount;
				acc.totalCost = totalCost;
			}
			return acc;
		},
		{ data: {}, totalAmount: 0, totalCost: 0 }
	);
	return reportAgent;
};
