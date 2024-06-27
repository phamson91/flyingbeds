import { FC } from 'react';
import Table from '@/components/Table/Table';
import Select from '@/components/Select';
import { EReportType, FilterReports } from '@/types/report';

interface IIReportByAirlineProps {
	handleSelectDate: (e: string, type: string) => void;
	tableBody: (string | number)[][];
	isLoading: boolean;
}

const tableHead = ['Code', 'Name', 'Total Ticket', 'Total Price (AUD)'];

const ReportByAirline: FC<IIReportByAirlineProps> = ({
	handleSelectDate,
	tableBody,
	isLoading,
}) => {
	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>Airlines</p>
		</div>,
		<div key={1} className="flex items-center gap-2">
			<span className="text-sm font-normal">Filter:</span>
			<Select
				options={FilterReports}
				onChange={(e) => handleSelectDate(e, EReportType.AIRLINE)}
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

export default ReportByAirline;
