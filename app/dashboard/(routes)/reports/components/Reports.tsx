'use client';
import { FC, useEffect, useState } from 'react';
import ReportByDate from './ReportByDate';
import ReportByAirline from './ReportByAirline';
import { useUser } from '@/hooks/useUser';
import { getReportByAirline, getReportByDate } from '@/actions/fetchReports';

import { IReportByDate, IReportByAirline, EReportType, EReportKeys } from '@/types/report';
import formatNumber from '@/lib/formatNumber';
import dateUtils from '@/lib/dateUtils';
import { getFilterDays } from '@/utils/getDate';

const Reports: FC = () => {
	const { userDetails } = useUser();
	const [bodyReportDate, setBodyReportDate] = useState<(string | number)[][]>(
		[]
	);
	const [bodyReportAirline, setBodyReportAirline] = useState<
		(string | number)[][]
	>([]);
	const [isLoadingDate, setIsLoadingDate] = useState<boolean>(false);
	const [isLoadingAirline, setIsLoadingAirline] = useState<boolean>(false);

	/**
	 * Fetches report data from the server based on the default date filter and user ID.
	 * Sets the report data and table body state based on the fetched data.
	 */
	const fetchReportByDate = async (filterDate: Date | null) => {
		setIsLoadingDate(true);
		setBodyReportDate([]);
		if (!filterDate) {
			filterDate = getFilterDays(7);
		}
		if (userDetails?.id) {
			const data: IReportByDate | null = await getReportByDate({
				userId: userDetails.id,
				filterDate,
			});
			if (data) {
				// Map the data object to an array of arrays for the table body
				const _tableBody = Object.keys(data).map((key) => {
					return [
						dateUtils.formatDate(key),
						data[key].totalTicket,
						formatNumber(data[key].totalPrice, { minimumFractionDigits: 2 }),
					];
				});
				// Set the table body state based on the mapped data
				setBodyReportDate(_tableBody);
			}
			setIsLoadingDate(false);
		}
	};

	/**
	 * Fetches report data from the server based on the default date filter and user ID.
	 * Sets the report data and table body state based on the fetched data.
	 */
	const fetchReportByAirline = async (filterDate: Date | null) => {
		setIsLoadingAirline(true);
		setBodyReportAirline([]);
		if (!filterDate) {
			filterDate = getFilterDays(7);
		}
		if (userDetails?.id) {
			const data: IReportByAirline | null = await getReportByAirline({
				userId: userDetails.id,
				filterDate,
			});
			if (data) {
				// Map the data object to an array of arrays for the table body
				const _tableBody = Object.keys(data).map((key) => {
					return [
						key,
						data[key].name,
						data[key].totalTicket,
						formatNumber(data[key].totalPrice, { minimumFractionDigits: 2 }),
					];
				});
				// Set the table body state based on the mapped data
				setBodyReportAirline(_tableBody);
			}
			setIsLoadingAirline(false);
		}
	};

	/**
	 * Handles filtering the report data based on the selected date or airline.
	 */
	const handleFilterReport = async (e: string, type: string) => {
		if (type === EReportType.DATE) {
			if (e !== EReportKeys.ONE_WEEK) {
				const filterDate = getFilterDays(14);
				await fetchReportByDate(filterDate);
				return;
			}
			await fetchReportByDate(null);
			return;
		}
		if (type === EReportType.AIRLINE) {
			if (e !== EReportKeys.ONE_WEEK) {
				const filterDate = getFilterDays(14);
				await fetchReportByAirline(filterDate);
				return;
			}
			await fetchReportByAirline(null);
			return;
		}
	};

	useEffect(() => {
		fetchReportByDate(null);
		fetchReportByAirline(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userDetails?.id]);

	return (
		<section className="flex flex-col gap-12">
			<article>
				<ReportByDate
					handleSelectDate={handleFilterReport}
					tableBody={bodyReportDate}
					isLoading={isLoadingDate}
				/>
			</article>
			<article>
				<ReportByAirline
					handleSelectDate={handleFilterReport}
					tableBody={bodyReportAirline}
					isLoading={isLoadingAirline}
				/>
			</article>
		</section>
	);
};

export default Reports;
