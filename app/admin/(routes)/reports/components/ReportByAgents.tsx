import Input from '@/components/Input/Input';
import Select from '@/components/Select';
import Table from '@/components/Table/Table';
import { EReportType, FilterReports } from '@/types/report';
import { ChangeEvent, FC } from 'react';

interface IReportByDateProps {
	handleSelectDate: (e: string, type: string) => void;
	tableBody: (string | number)[][];
	isLoading: boolean;
	filterAgents: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ReportByAgents: FC<IReportByDateProps> = ({
	handleSelectDate,
	tableBody,
	isLoading,
	filterAgents,
}) => {
	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>Agents</p>
		</div>,
		<div key={1} className="flex items-center gap-2">
			<div className="flex items-center gap-2">
				<span className="text-sm font-normal">Filter:</span>
				<Select
					options={FilterReports}
					onChange={(e) => handleSelectDate(e, EReportType.DATE)}
					defaultValue="1"
				/>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm font-normal">Agents:</span>
				<Input
					placeholder="Search by agent"
					className="w-40 p-2 border"
					id="commission-search"
					onChange={filterAgents}
				/>
			</div>
		</div>,
	];

	return (
		<>
			<Table
				title={tableTitle}
				tableHead={['Agents', 'Revenue (AUD)', 'Cost (AUD)', 'Profit (AUD)']}
				tableBody={tableBody}
				isLoading={isLoading}
			/>
		</>
	);
};

export default ReportByAgents;
