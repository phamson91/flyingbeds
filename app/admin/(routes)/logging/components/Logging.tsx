'use client';

import { getLogging } from '@/actions/transactions/getLogging';
import Input from '@/components/Input/Input';
import Table from '@/components/Table/Table';
import Pagination from '@/components/pagination';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import dateUtils from '@/lib/dateUtils';
import { debounce } from '@/lib/debounce';
import formatNumber from '@/lib/formatNumber';
import { addDays } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'react-hot-toast';

interface ILoggingProps {
	tableBody: (string | number | JSX.Element)[][];
	count: number | null;
}

interface IGetLogging {
	page?: number;
	perPage?: number;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
	companyName?: string;
}

const tableHead = [
	'Create by',
	'Description',
	'Receiver',
	'Amount (AUD)',
	'Date',
];

const Logging: FC = () => {
	const [bodyLogging, setBodyLogging] = useState<ILoggingProps>({
		tableBody: [],
		count: 0,
	});
	const [isLoadingLogging, setIsLoadingLogging] = useState<boolean>(false);
	const [paramsLogging, setParamsLogging] = useState<IGetLogging>({
		page: 1,
		perPage: 10,
		startDate: null,
		endDate: null,
		companyName: '',
	});
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});
	const [openPopover, setOpenPopover] = useState<boolean>(false);

	const fetchLogging = async ({
		page,
		perPage,
		startDate,
		endDate,
		companyName,
	}: IGetLogging) => {
		setIsLoadingLogging(true);
		setBodyLogging({ tableBody: [], count: 0 });
		const { data, count, error } = await getLogging({
			page,
			perPage,
			startDate,
			endDate,
			companyName,
		});

		if (error) {
			toast.error(error);
		}

		if (data && data.length > 0) {
			// Map the data object to an array of arrays for the table body
			const _tableBody = data.map((item) => {
				return [
					item.created_by.company_name,
					item.description,
					item.receiver_user.company_name,
					formatNumber(Math.abs(item.amount), { minimumFractionDigits: 2 }),
					dateUtils.formatDateTime(item.created_at),
				];
			});
			setBodyLogging({ tableBody: _tableBody, count });
		}

		setIsLoadingLogging(false);
	};

	useEffect(() => {
		const { page, perPage, startDate, endDate, companyName } = paramsLogging;
		fetchLogging({ page, perPage, startDate, endDate, companyName });
	}, [paramsLogging]);

	/**
	 * Handles the date picker change event
	 */
	const handleDatePicker = (date: any) => {
		try {
			setDate(date);
			if (date.from && date.to) {
				const startDate = addDays(new Date(date.from), 1);
				const endDate = addDays(new Date(date.to), 1);

				//Set the time to 00:00:00 for the start date and 23:59:59 for the end date
				startDate.setUTCHours(0, 0, 0, 0);
				endDate.setUTCHours(23, 59, 59, 0);

				setParamsLogging((prev) => ({
					...prev,
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				}));
				setOpenPopover(false);
			}
		} catch (error) {
			setParamsLogging((prev) => ({
				...prev,
				startDate: null,
				endDate: null,
			}));
			toast.error('Error setting date');
		}
	};

	const resetDate = () => {
		setDate({ from: undefined, to: undefined });
		setParamsLogging((prev) => ({
			...prev,
			startDate: null,
			endDate: null,
		}));
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setParamsLogging((prev) => ({ ...prev, companyName: value || '' }));
	};

	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>Logging</p>
		</div>,
		<div key={1} className="flex items-center gap-2">
			<div className="flex items-center gap-2">
				<span className="text-sm font-normal">Filter:</span>
				<Input
					className="w-40 p-2 border"
					id="logging-search"
					placeholder="Company name"
					onChange={debounce(handleSearch, 500)}
				/>
			</div>
			<div>
				<DatePickerWithRange
					date={date}
					handleDatePicker={handleDatePicker}
					openPopover={openPopover}
					setOpenPopover={setOpenPopover}
					resetDatePicker={resetDate}
				/>
			</div>
		</div>,
	];

	return (
		<section className="flex flex-col">
			<Table
				title={tableTitle}
				tableHead={tableHead}
				tableBody={bodyLogging.tableBody}
				isLoading={isLoadingLogging}
			/>
			<Pagination
				previousPage={(page: number) => {
					setParamsLogging((prev) => ({ ...prev, page }));
				}}
				nextPage={(page: number) => {
					setParamsLogging((prev) => ({ ...prev, page }));
				}}
				total={bodyLogging.count || 0}
				pageSize={10}
				countItems={bodyLogging.tableBody.length}
			/>
		</section>
	);
};

export default Logging;
