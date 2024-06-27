import { FC } from 'react';
import Table from '@/components/Table/Table';
import Select from '@/components/Select';
import { EReportType, FilterReports } from '@/types/report';

interface IReportByDateProps {
	handleSelectDate: (e: string, type: string) => void;
	tableBody: (string | number)[][];
	isLoading: boolean;
}

const tableHead = ['Date', 'Total Ticket', 'Total Price (AUD)'];

const ReportByDate: FC<IReportByDateProps> = ({
	handleSelectDate,
	tableBody,
	isLoading,
}) => {
	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>Date</p>
		</div>,
		<div key={1} className="flex items-center gap-2">
			<span className="text-sm font-normal">Filter:</span>
			<Select
				options={FilterReports}
				onChange={(e) => handleSelectDate(e, EReportType.DATE)}
				defaultValue="1"
			/>
		</div>,
	];

	return (
		<article>
			<Table
				title={tableTitle}
				tableHead={tableHead}
				tableBody={tableBody}
				isLoading={isLoading}
			/>
		</article>
	);
};

export default ReportByDate;
