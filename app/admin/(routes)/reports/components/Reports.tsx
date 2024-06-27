'use client';

import { ChangeEvent, FC, useEffect, useState } from 'react';
import ReportByAgents from './ReportByAgents';
import { getAdminReportByAgents } from '@/actions/transactions/adminReport';
import { getFilterDays } from '@/utils/getDate';
import { toast } from 'react-hot-toast';
import formatNumber from '@/lib/formatNumber';
import { EReportKeys } from '@/types/report';

const Report: FC = () => {
	const [agents, setAgents] = useState<string[][]>([]);
	const [tableBodyAgents, setTableBodyAgents] = useState<string[][]>([]);
	const [isLoadingAgents, setIsLoadingAgents] = useState<boolean>(false);

	/**
	 * Fetches the report data by agents from the server and updates the state accordingly.
	 */
	const fetchReportByAgents = async (filterDate: Date | null) => {
		setIsLoadingAgents(true);
		setTableBodyAgents([]);
		setAgents([]);
		if (!filterDate) {
			filterDate = getFilterDays(7);
		}

		const { data, error } = await getAdminReportByAgents({
			filterDate,
		});

		if (data) {
			// Map the data object to an array of arrays for the table body
			const _tableBody = Object.keys(data.data).map((key) => {
				return [
					key,
					formatNumber(data.data[key].amount, { minimumFractionDigits: 2 }),
					formatNumber(data.data[key].cost, { minimumFractionDigits: 2 }),
					formatNumber(data.data[key].profit, { minimumFractionDigits: 2 }),
				];
			});

			_tableBody.unshift([
				'<b>Total</b>',
				`<b>${formatNumber(data.totalAmount, {
					minimumFractionDigits: 2,
				})}</b>`,
				`<b>${formatNumber(data.totalCost, { minimumFractionDigits: 2 })}</b>`,
				`<b>${formatNumber(data.totalAmount - data.totalCost, {
					minimumFractionDigits: 2,
				})}</b>`,
			]);

			setAgents(_tableBody);
			setTableBodyAgents(_tableBody);
		}

		error && toast(error);
		setIsLoadingAgents(false);
	};

	useEffect(() => {
		fetchReportByAgents(null);
	}, []);

	/**
	 * Handles filtering the agents based on the input value.
	 */
	const filterAgents = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (value === '') return setTableBodyAgents(agents);

		const result = agents.filter((agent) =>
			agent[0].toLowerCase().includes(value.toLowerCase())
		);
		result.unshift(agents[0]);
		setTableBodyAgents(result);
	};

	/**
	 * Handles filtering the report data based on the selected date.
	 */
	const handleChangeDate = async (e: string, type: string) => {
		if (e !== EReportKeys.ONE_WEEK) {
			const filterDate = getFilterDays(14);
			await fetchReportByAgents(filterDate);
			return;
		}
		await fetchReportByAgents(null);
		return;
	};

	return (
		<section>
			<ReportByAgents
				handleSelectDate={handleChangeDate}
				isLoading={isLoadingAgents}
				tableBody={tableBodyAgents}
				filterAgents={filterAgents}
			/>
		</section>
	);
};

export default Report;
