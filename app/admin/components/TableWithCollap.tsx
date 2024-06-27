import { FaAngleDown } from 'react-icons/fa';
import { ChangeEvent, FC, useState } from 'react';
import { IBookingSupa, ITicketInfo, ETypeTicket } from '@/types/booking';
import Loader from '@/components/Loader';
import dateUtils from '@/lib/dateUtils';
import { format } from 'date-fns';
import { isDateExpired, isTicketExpired } from '@/utils/getDate';

interface TableProps {
	title?: (string | number | JSX.Element)[];
	tableHead?: string[];
	tableBody: IBookingSupa[];
	tableFoot?: string[];
	isLoading?: boolean;
	headCollap: (string | JSX.Element)[];
	expirationTime: number;
	handleCheckbox: (
		e: ChangeEvent<HTMLInputElement>,
		rowLoc: string,
		ticketNumber: string
	) => void;
	handleCheckboxAll: (e: ChangeEvent<HTMLInputElement>, rowLoc: string) => void;
	actionCollap: (id: string) => JSX.Element;
}

const TableWithCollap: React.FC<TableProps> = ({
	title,
	tableHead,
	tableBody,
	tableFoot,
	isLoading = false,
	headCollap,
	handleCheckbox,
	handleCheckboxAll,
	actionCollap,
	expirationTime,
}) => {
	const [expanded, setExpanded] = useState<string>('');
	const isDataExist = tableBody.length > 0 && !isLoading;
	const isLoadingData = isLoading && tableBody.length === 0;

	return (
		<div className="my-2">
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
				<tbody>
					{isDataExist ? (
						tableBody.map((row, index) => [
							<tr
								className={`${
									expanded === row.record_locator && 'bg-gray-100'
								} ${
									isTicketExpired({
										tickets: row.tickets_info,
										expirationTime,
									}) && '!bg-red-100'
								} hover:bg-slate-100 bg-transparent hover:cursor-pointer`}
								key={1}
							>
								<td
									onClick={() =>
										expanded !== row.record_locator
											? setExpanded(row.record_locator as string)
											: setExpanded('')
									}
								>
									<FaAngleDown
										className={`${
											expanded === row.record_locator && 'rotate-0'
										} mx-auto hover:cursor-pointer rotate-[-90deg] transition-all`}
									/>
								</td>
								<td className="px-2 py-2">{row.record_locator}</td>
								<td className="px-2 py-2">{row.pax_name}</td>
								<td className="px-2 py-2">{row.sectors}</td>
								<td className="px-2 py-2">
									{dateUtils.formatDate(row.updated_at)}
								</td>
								<td className="px-2 py-2">{actionCollap(row.id as string)}</td>
							</tr>,
							<tr
								key={2}
								className={`${
									expanded !== row.record_locator && 'hidden opacity-0'
								}`}
							>
								<td key={`ex-${index}`} colSpan={tableHead?.length}>
									<TableCollap
										key={`ex-${index}`}
										headCollap={headCollap}
										bodyCollap={row.tickets_info}
										rowLoc={expanded}
										handleCheckbox={handleCheckbox}
										handleCheckboxAll={handleCheckboxAll}
										expirationTime={expirationTime}
									/>
								</td>
							</tr>,
						])
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

export default TableWithCollap;

interface TableCollapProps {
	headCollap: (string | JSX.Element)[];
	bodyCollap: ITicketInfo[];
	rowLoc: string;
	expirationTime: number;
	handleCheckbox: (
		e: ChangeEvent<HTMLInputElement>,
		rowLoc: string,
		ticketNumber: string
	) => void;
	handleCheckboxAll: (e: ChangeEvent<HTMLInputElement>, rowLoc: string) => void;
}

const TableCollap: FC<TableCollapProps> = ({
	headCollap,
	bodyCollap,
	rowLoc,
	expirationTime,
	handleCheckbox,
	handleCheckboxAll,
}) => {
	return (
		<table className="!w-[calc(100%-25px)] float-right table-auto text-left text-sm my-2 border">
			<thead className="border-b">
				<tr>
					{headCollap.map((head, index) =>
						index === 0 ? (
							<th key={index} className="px-2 py-2">
								<input
									key="checkbox"
									className="uk-checkbox"
									type="checkbox"
									defaultChecked={false}
									onChange={(event) => handleCheckboxAll(event, rowLoc)}
								/>
							</th>
						) : (
							<th key={index} className="px-2 py-2">
								{head}
							</th>
						)
					)}
				</tr>
			</thead>
			<tbody>
				{bodyCollap &&
					bodyCollap?.map((ticket, rowIndex) => (
						<tr
							className={rowIndex % 2 === 1 ? 'bg-slate-100' : 'bg-transparent'}
							key={rowIndex}
						>
							<td className="px-2 py-2">
								<input
									key="checkbox"
									className="uk-checkbox"
									type="checkbox"
									checked={ticket?.selected || false}
									disabled={[
										ETypeTicket.REFUNDED,
										ETypeTicket.REISSUED,
									].includes(ticket.status as ETypeTicket)}
									onChange={(event) =>
										handleCheckbox(event, rowLoc, ticket.ticketNumber)
									}
								/>
							</td>
							<td className="px-2 py-2">{ticket.paxName}</td>
							<td className="px-2 py-2">{ticket.ticketNumber}</td>
							<td className="px-2 py-2">
								<div
									className={`${
										([
											ETypeTicket.LIVE,
											ETypeTicket.REFUNDED,
											ETypeTicket.REISSUED,
											undefined,
										].includes(ticket?.status as ETypeTicket) &&
											'!bg-green-500') ||
										([
											ETypeTicket.REFUNDING,
											ETypeTicket.REISSUING,
											ETypeTicket.REFUNDING_CONFIRMING,
											ETypeTicket.REISSUING_CONFIRMING,
										].includes(ticket?.status as ETypeTicket) &&
											'!bg-red-500') ||
										([ETypeTicket.VOID].includes(
											ticket?.status as ETypeTicket
										) &&
											'!bg-gray-500')
									} py-[4px] px-[10px] text-white rounded-md text-center w-fit`}
								>
									{ticket.status || ETypeTicket.LIVE}
								</div>
							</td>
							<td className="px-2 py-2">
								{ticket.confirmPrice ? 'Yes' : 'No'}
							</td>
							<td className="px-2 py-2">
								{ticket?.requestOwner ?? 'Not created yet'}
							</td>
							<td className="px-2 py-2">
								{!ticket?.confirmReqOn ? (
									'Not created yet'
								) : (
									<div
										className={`${
											isDateExpired({
												date: ticket?.confirmReqOn.toString(),
												expirationTime,
											})
												? 'bg-red-500'
												: 'bg-green-500'
										} py-[4px] px-[10px] text-white rounded-md text-center w-fit`}
									>
										{format(
											new Date(ticket?.confirmReqOn),
											'HH:mm:ss - ddLLLyyyy'
										)}
									</div>
								)}
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};
