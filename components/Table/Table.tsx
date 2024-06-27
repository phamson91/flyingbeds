import Loader from '../Loader';

interface TableProps {
	title?: (string | number | JSX.Element)[];
	tableHead?: string[];
	tableBody: (string | number | JSX.Element)[][];
	tableFoot?: string[];
	isLoading?: boolean;
	actionCollap?: (id: string) => JSX.Element;
}

const Table: React.FC<TableProps> = ({
	title,
	tableHead,
	tableBody,
	tableFoot,
	isLoading = false,
	actionCollap,
}) => {
	const isDataExist = tableBody.length > 0 && !isLoading;
	const isLoadingData = isLoading && tableBody.length === 0;
	return (
		<div className="my-2 bg-white">
			{title && (
				<div className="flex justify-between border-b pb-2 font-medium text-md items-center">
					{title.map((item, index) => (
						<div key={index}>{item}</div>
					))}
				</div>
			)}

			<table className="table-auto text-left text-sm w-full">
				{tableHead && (
					<thead className="border-b">
						<tr>
							{tableHead.map((head, index) => (
								<th key={index} className="px-2 py-2">
									{head}
								</th>
							))}
						</tr>
					</thead>
				)}
				{/**
				 * Renders the table body based on the provided data.
				 * If data exists, it maps through the rows and renders each row as a table row.
				 * If data is loading, it displays a loader.
				 * If no data exists, it displays a message indicating that no data was found.
				 */}
				<tbody className="justify-center">
					{isDataExist ? (
						tableBody.map((row) => (
							<tr className="even:bg-slate-100" key={tableBody.indexOf(row)}>
								{row.map((data, index) =>
									typeof data === 'string' ? (
										<td
											dangerouslySetInnerHTML={{ __html: data }}
											key={index}
											className="px-2 py-2"
										/>
									) : (
										<td key={index} className="px-2 py-2">
											{data}
										</td>
									)
								)}
							</tr>
						))
					) : isLoadingData ? (
						<tr>
							<td className="text-center" colSpan={tableHead?.length}>
								<Loader />
							</td>
						</tr>
					) : (
						<tr>
							<td className="text-center" colSpan={tableHead?.length}>
								No data found
							</td>
						</tr>
					)}
				</tbody>
				{tableFoot && (
					<tfoot>
						<tr className="bg-slate-400">
							{tableFoot.map((data, index) => (
								<td key={index} className="px-2 py-2 text-white">
									{data}
								</td>
							))}
						</tr>
					</tfoot>
				)}
			</table>
		</div>
	);
};

export default Table;
