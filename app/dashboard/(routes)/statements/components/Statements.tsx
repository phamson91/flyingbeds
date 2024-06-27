'use client';

import { getStatementById } from '@/actions/statements/get';
import { useUser } from '@/hooks/useUser';
import { IStatement } from '@/types/types';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import StatementTable from './StatementTable';
import { MdRemoveRedEye } from 'react-icons/md';
import formatNumber from '@/lib/formatNumber';
import ModalStatementDetail from './ModalStatementDetail';
import { getTransactionById } from '@/actions/transactions/get';
import Pagination from '@/components/pagination';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { format, utcToZonedTime } from 'date-fns-tz';
import dateUtils from '@/lib/dateUtils';
import { FaTimes } from 'react-icons/fa';
import { addDays } from 'date-fns';

interface IStatementsProps {
	tableBody: (string | number | JSX.Element)[][];
	count: number | null;
}
interface IGetStatement {
	page?: number;
	perPage?: number;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
}

const Statements: FC = () => {
	const { userDetails } = useUser();
	const [statement, setStatement] = useState<IStatement | null>(null);
	const [bodyStatement, setBodyStatement] = useState<IStatementsProps>({
		tableBody: [],
		count: 0,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [transactions, setTransactions] = useState<(string | number)[][]>([]);
	const [paramsStatement, setParamsStatement] = useState<IGetStatement>({
		page: 1,
		perPage: 10,
		startDate: null,
		endDate: null,
	});
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});
	const [openPopover, setOpenPopover] = useState<boolean>(false);

	const fetchTransactions = async (
		userId: string,
		startDate: Date,
		endDate: Date,
		initialBalance: number
	) => {
		const data = await getTransactionById(
			userId,
			startDate,
			endDate,
			initialBalance
		);
		if (!data) {
			toast.error('Error fetching transactions');
			return;
		}

		const tableBody = data.map((item) => {
			return [
				item.description,
				formatNumber(item.amount, { minimumFractionDigits: 2 }),
				item.balance
					? formatNumber(item.balance, { minimumFractionDigits: 2 })
					: 0,
				dateUtils.formatDateTime(item.created_at),
			];
		});

		tableBody.unshift([
			'Initial Balance',
			'',
			formatNumber(initialBalance, { minimumFractionDigits: 2 }),
			format(new Date(startDate), 'HH:mm:ss - dd LLL yyyy', {
				timeZone: 'Australia/Sydney',
			}),
		]);
		setTransactions(tableBody);
	};

	const handleView = async (statement: IStatement) => {
		await fetchTransactions(
			statement.user_id,
			statement.start_date,
			statement.end_date,
			statement.initial_balance
		);
		setStatement(statement);
	};

	const action = (statement: IStatement) => (
		<div className="flex justify-around items-center">
			<MdRemoveRedEye
				data-testid="view-statement"
				className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
				onClick={() => handleView(statement)}
			/>
		</div>
	);

	const fetchStatements = async ({
		page,
		perPage,
		startDate,
		endDate,
	}: IGetStatement) => {
		setIsLoading(true);
		setBodyStatement({
			tableBody: [],
			count: 0,
		});
		if (userDetails?.id) {
			const { data, count, error } = await getStatementById({
				userId: userDetails.id,
				page,
				perPage,
				startDate,
				endDate,
			});

			if (data && data.length > 0) {
				// Map the data object to an array of arrays for the table body
				const _tableBody = data.map((item) => {
					return [
						dateUtils.formatDate(item.start_date),
						dateUtils.formatDate(item.end_date),
						formatNumber(item.initial_balance, { minimumFractionDigits: 2 }),
						formatNumber(item.ending_balance, { minimumFractionDigits: 2 }),
						action(item),
					];
				});
				setBodyStatement({ tableBody: _tableBody, count });
			}
			if (error) {
				toast.error('Error fetching statement');
			}
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const { page, perPage, startDate, endDate } = paramsStatement;
		fetchStatements({ page, perPage, startDate, endDate });
		return () => {
			setStatement(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		userDetails?.id,
		paramsStatement.page,
		paramsStatement.perPage,
		paramsStatement.startDate,
		paramsStatement.endDate,
	]);

	/**
	 * Handles the previous page button click
	 */
	const previousPage = (page: number) => {
		setParamsStatement((prev) => ({ ...prev, page }));
	};

	/**
	 * Handles the next page button click
	 */
	const nextPage = (page: number) => {
		setParamsStatement((prev) => ({ ...prev, page }));
	};

	/**
	 * Handles the date picker change event
	 */
	const handleDatePicker = (date: any) => {
		try {
			setDate(date);
			if (date.from && date.to) {
				const startDateInUTC = new Date(date.from);
				const endDateInUTC = addDays(new Date(date.to), 1);
				//Sets the start date to 00:00 in the Australia/Sydney timezone
				startDateInUTC.setUTCHours(14, 0, 0, 0); // 00:00 + 10 giờ = 14:00
				//Sets the start date to 23:55 in the Australia/Sydney timezone.
				endDateInUTC.setUTCHours(13, 55, 0, 0); // 23:55 + 10 giờ = 13:55

				const startDate = utcToZonedTime(startDateInUTC, 'Australia/Sydney');
				const endDate = utcToZonedTime(endDateInUTC, 'Australia/Sydney');
				setParamsStatement((prev) => ({
					...prev,
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				}));
				setOpenPopover(false);
			}
		} catch (error) {
			setParamsStatement((prev) => ({
				...prev,
				startDate: null,
				endDate: null,
			}));
			console.log(error);
		}
	};

	const handleResetDatePicker = () => {
		setDate({ from: undefined, to: undefined });
		setParamsStatement((prev) => ({
			...prev,
			startDate: null,
			endDate: null,
		}));
	};

	return (
		<section>
			<div className="flex justify-start items-center gap-2">
				<DatePickerWithRange
					date={date}
					handleDatePicker={handleDatePicker}
					openPopover={openPopover}
					setOpenPopover={setOpenPopover}
					resetDatePicker={handleResetDatePicker}
				/>
			</div>
			<StatementTable
				tableBody={bodyStatement.tableBody}
				isLoading={isLoading}
			/>
			<Pagination
				previousPage={previousPage}
				nextPage={nextPage}
				total={bodyStatement.count || 0}
				pageSize={10}
				countItems={bodyStatement.tableBody.length}
			/>
			{userDetails && statement && (
				<ModalStatementDetail
					isOpen={Object.keys(statement).length > 0}
					onClose={() => setStatement(null)}
					statement={statement}
					user={userDetails}
					transactions={transactions}
				/>
			)}
		</section>
	);
};

export default Statements;
