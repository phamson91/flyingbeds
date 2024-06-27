import Table from '@/components/Table/Table';
import { FC } from 'react';

interface IStatementTableProps {
	tableBody: (string | number | JSX.Element)[][];
	isLoading: boolean;
}

const tableHead = [
	'Start Date',
	'End Date',
	'Initial Balance (AUD)',
	'Ending Balance (AUD)',
	'Action',
];
const StatementTable: FC<IStatementTableProps> = ({ tableBody, isLoading }) => {

	return (
		<section>
			<Table
				tableHead={tableHead}
				tableBody={tableBody}
				isLoading={isLoading}
			/>
		</section>
	);
};

export default StatementTable;
