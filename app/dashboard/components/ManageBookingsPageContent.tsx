'use client';

import { getBookingById, getBookingsClient } from '@/actions/bookings/get';
import ModalCancel from '@/app/admin/components/ModalCancel';
import ModalDisplayPnr from '@/app/admin/components/ModalDisplayPnr';
import ModalVoidTicket from '@/app/admin/components/ModalVoidTicket';
import Input from '@/components/Input/Input';
import Select from '@/components/Select';
import Table from '@/components/Table/Table';
import TableWithCollap from '@/components/Table/TableWithCollap';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/Button';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/Dropdown';
import dateUtils from '@/lib/dateUtils';
import { debounce } from '@/lib/debounce';
import { PATHS } from '@/lib/paths';
import {
	ESttBooking,
	ETypeTicket,
	IBookingRequest,
	IBookingRes,
	IBookingSupa,
	ITicketInfo,
	TSttBooking,
	TTypeTicket,
} from '@/types/booking';
import { IOption } from '@/types/types';
import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'react-hot-toast';
import { FaPollH, FaSyncAlt, FaTrash, FaUndoAlt } from 'react-icons/fa';
import { MdOutlineMoreVert } from 'react-icons/md';
import ModalRefund from './ModalRequest';

const FilterStatus: IOption[] = [
	{
		key: '',
		value: 'All',
	},
	{
		key: ESttBooking.TODO,
		value: ESttBooking.TODO,
	},
	{
		key: ESttBooking.WAITING,
		value: ESttBooking.WAITING,
	},
	{
		key: ESttBooking.DONE,
		value: ESttBooking.DONE,
	},
	{
		key: ESttBooking.CANCEL,
		value: ESttBooking.CANCEL,
	},
];

interface Props {
	pendingPNR: any;
}

const ManageBookingsPageContent: FC<Props> = ({
	pendingPNR,
}: {
	pendingPNR: any;
}) => {
	const [bookings, setBookings] = useState<{
		data: IBookingSupa[];
		count: number;
		isLoading: boolean;
	}>({ data: [], count: 0, isLoading: false });
	const [paramsBooking, setParamsBooking] = useState<IBookingRequest>({
		page: 1,
		perPage: 10,
		startDate: null,
		endDate: null,
		searchValue: '',
		sortBy: 'descending',
		sttBooking: undefined,
	});
	const [modal, setModal] = useState<TTypeTicket | null>(null);
	const [booking, setBooking] = useState<IBookingSupa>();
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});
	const [openPopover, setOpenPopover] = useState<boolean>(false);
	const router = useRouter();

	const isDataChecked = (
		dataRloc: IBookingSupa,
		type: ETypeTicket.REFUNDING | ETypeTicket.REISSUING | ETypeTicket.CANCEL | ETypeTicket.VOID
	) => {
		const isTicketExists = dataRloc?.tickets_info.some(
			(item: ITicketInfo) => item!.selected
		);

		//Show toast if no ticket is selected
		if (!isTicketExists) {
			throw new Error(`Please select at least one ticket for a ${type}`);
		}
	};

	/**
	 * Gets the selected tickets from a booking.
	 */
	const getTicketsSelectedFromDB = async (
		id: string,
		ticketsSelected: string[]
	) => {
		const { tickets_info } = await getBookingById(id);
		const tickets = tickets_info.filter((item) =>
			ticketsSelected.includes(item.ticketNumber)
		);
		return tickets;
	};

	/**
	 * Checks the status of the selected tickets in a booking.
	 */
	const checkTicketStatus = (tickets: ITicketInfo[], type: string) => {
		const isTicketStatus = tickets?.every((item: ITicketInfo) => {
			if (type === ETypeTicket.CANCEL) {
				return [
					ETypeTicket.REFUNDING,
					ETypeTicket.REISSUING,
					ETypeTicket.REFUNDING_CONFIRMING,
					ETypeTicket.REISSUING_CONFIRMING,
				].includes(item?.status as ETypeTicket);
			}
			return item?.status === ETypeTicket.LIVE || !item?.status;
		});

		//Show toast if status ticket isn't refund/reissue
		if (!isTicketStatus) {
			// throw new Error(`Please select tickets with the 'Live' status`);
			throw new Error(
				`Please select ticket have status ${
					type === ETypeTicket.CANCEL
						? 'Reissuing/Refunding or Reissuing/Refunding - Waiting for confirm'
						: 'Live'
				}`
			);
		}
	};

	const handleRequestTicket = async (
		id: string,
		type:
			| ETypeTicket.REFUNDING
			| ETypeTicket.REISSUING
			| ETypeTicket.CANCEL
			| ETypeTicket.DISPLAY_PNR
			| ETypeTicket.VOID
	) => {
		const cloneData = [...bookings.data];

		const dataRloc = cloneData.find((item: IBookingSupa) => item.id === id);

		if (dataRloc && Object.keys(dataRloc).length > 0) {
			// Show toast if no rloc is not exists
			try {
				// Show modal display pnr
				if (type === ETypeTicket.DISPLAY_PNR) {
					setBooking(dataRloc);
					setModal(type);
					return;
				}
				isDataChecked(dataRloc, type);
				const ticketsNumber = dataRloc.tickets_info
					.filter((item) => item.selected)
					.map((item) => item.ticketNumber);

				const ticketsSelected = await getTicketsSelectedFromDB(
					id,
					ticketsNumber
				);
				// Check ticket status is live
				checkTicketStatus(ticketsSelected, type);

				setBooking(dataRloc);
				setModal(type);
			} catch (error: any) {
				toast.error(error.message as string);
			}
			return;
		}
		return;
	};

	/**
	 * Handles the action column of the table.
	 */
	const actionCollap = (id: string) => (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger className="flex justify-end items-center">
					<MdOutlineMoreVert className="hover:text-sky-500 text-sky-600 hover:cursor-pointer text-[30px]" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white">
					<DropdownMenuItem
						onClick={() => handleRequestTicket(id, ETypeTicket.DISPLAY_PNR)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaPollH className="text-sm w-4 h-4" />
						<span>Display PNR</span>
					</DropdownMenuItem>
					<DropdownMenuItem 
						onClick={() => handleRequestTicket(id, ETypeTicket.VOID)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaTrash className="text-sm w-4 h-4" />
						<span>Void Ticket</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleRequestTicket(id, ETypeTicket.REFUNDING)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaUndoAlt className="text-sm w-4 h-4" />
						<span>Request Refund Ticket</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleRequestTicket(id, ETypeTicket.REISSUING)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaSyncAlt className="text-sm w-4 h-4" />
						<span>Reissue Ticket</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleRequestTicket(id, ETypeTicket.CANCEL)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaPollH className="text-sm w-4 h-4" />
						<span>Cancel Ticket</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);

	const fetchBookings = async () => {
		setBookings({ data: [], count: 0, isLoading: true });
		if (true) {
			const { data, count, error }: IBookingRes = await getBookingsClient(
				paramsBooking
			);

			if (error) {
				toast.error(error);
			}

			if (data && data.length > 0) {
				setBookings({ data, count: count || 0, isLoading: false });
				return;
			}
			setBookings({ data: [], count: 0, isLoading: false });
		}
	};

	useEffect(() => {
		fetchBookings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramsBooking]);

	/**
	 * Handles the checkbox change event and updates the bookings data accordingly.
	 */
	const handleCheckbox = (
		e: ChangeEvent<HTMLInputElement>,
		rowLoc: string,
		ticketNumber: string
	) => {
		const { checked } = e.target;
		const newData = [...bookings.data];

		const rowCollapCheckbox = newData.find(
			(item: IBookingSupa) => item.record_locator === rowLoc
		);
		if (rowCollapCheckbox) {
			rowCollapCheckbox.tickets_info = rowCollapCheckbox.tickets_info.map(
				(ticketInfo: ITicketInfo) => {
					if (ticketInfo.ticketNumber === ticketNumber) {
						return {
							...ticketInfo,
							selected: checked,
						};
					}
					return ticketInfo;
				}
			);
		}

		setBookings((prev) => ({ ...prev, data: newData }));
	};

	/**
	 * Handles the checkbox all functionality for a specific row.
	 */
	const handleCheckboxAll = (
		e: ChangeEvent<HTMLInputElement>,
		rowLoc: string
	) => {
		const { checked } = e.target;
		const newData = [...bookings.data];

		const rowCollapCheckbox = newData.find(
			(item: IBookingSupa) => item.record_locator === rowLoc
		);

		// Update the selected value of the ticket
		rowCollapCheckbox?.tickets_info.forEach((ticketInfo: ITicketInfo) => {
			if (!ticketInfo?.status || ticketInfo?.status === ETypeTicket.LIVE) {
				ticketInfo.selected = checked;
			}
		});

		setBookings((prev) => ({ ...prev, data: newData }));
	};

	/**
	 * Handles search rloc.
	 */
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setParamsBooking((prev) => ({ ...prev, searchValue: value || '' }));
	};

	/**
	 * Handles reset date picker.
	 */
	const resetDate = () => {
		setDate({ from: undefined, to: undefined });
		setParamsBooking((prev) => ({
			...prev,
			startDate: null,
			endDate: null,
		}));
	};

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

				setParamsBooking((prev) => ({
					...prev,
					startDate: startDate.toUTCString(),
					endDate: endDate.toUTCString(),
				}));

				setOpenPopover(false);
			}
		} catch (error) {
			setParamsBooking((prev) => ({
				...prev,
				startDate: null,
				endDate: null,
			}));
			toast.error('Error setting date');
		}
	};

	const onClose = () => {
		setModal(null);
		setBooking(undefined);
	};

	/**
	 * Handles filtering the report data based on the selected date.
	 */
	const handleChangeStt = async (e: TSttBooking | '') => {
		setParamsBooking((prev) => ({
			...prev,
			sttBooking: (e as TSttBooking) ?? undefined,
		}));
		return;
	};

	const tableTitle = [
		<div key={0} className="flex items-center gap-2 py-4 font-bold">
			<p>Pnr Pending</p>
		</div>,
	];

	const tableHead = ['Pnr', 'Payment Date', 'Expired Date', 'Status'];

	const tableBody = pendingPNR?.map((item: any) => {
		const action = (
			<DropdownMenu>
				<DropdownMenuTrigger className="flex justify-end items-center">
					<MdOutlineMoreVert className="hover:text-sky-500 text-sky-600 hover:cursor-pointer text-[30px]" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white">
					<DropdownMenuItem
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
						onClick={() =>
							router.push(
								`${PATHS['DASHBOARD_ACTION-BOOKING']}?rloc=${item.rloc}`
							)
						}
					>
						<FaPollH className="text-sm w-4 h-4" />
						<span>Payment</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		return [
			item.rloc,
			dateUtils.formatDateTime(item.paymentDate),
			dateUtils.formatDateTime(item.expireDate),
			'Pending',
			action,
		];
	});


	return (
		<section>
			<article className="mt-4 flex justify-between items-center gap-2">
				<div>
					<DatePickerWithRange
						date={date}
						handleDatePicker={handleDatePicker}
						openPopover={openPopover}
						setOpenPopover={setOpenPopover}
						resetDatePicker={resetDate}
					/>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm font-normal">Filter:</span>
						<Select
							options={FilterStatus}
							onChange={(e) => handleChangeStt(e)}
							defaultValue=""
						/>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-normal">Filter:</span>
						<Input
							className="w-40 p-2 border"
							id="rloc-search"
							placeholder="Record locator"
							onChange={debounce(handleSearch, 500)}
						/>
					</div>
					<div>
						<Button type="button" variant={'outline'} onClick={fetchBookings}>
							<FaSyncAlt className="text-sm w-4 h-4" />
						</Button>
					</div>
				</div>
			</article>
			<TableWithCollap
				tableHead={[
					'',
					'Reloc',
					'Lead Pax',
					'Sectors',
					'Date of Action',
					'Status',
					'',
				]}
				tableBody={bookings.data}
				headCollap={['', 'Pax Name', 'Ticket Number', 'Status']}
				isLoading={bookings.isLoading}
				handleCheckbox={handleCheckbox}
				handleCheckboxAll={handleCheckboxAll}
				actionCollap={actionCollap}
			/>
			<Pagination
				previousPage={(page: number) => {
					setParamsBooking((prev) => ({ ...prev, page }));
				}}
				nextPage={(page: number) => {
					setParamsBooking((prev) => ({ ...prev, page }));
				}}
				total={bookings.count || 0}
				pageSize={10}
				countItems={bookings?.data?.length || 0}
			/>
			{/* Pending PNR */}
			<Table title={tableTitle} tableHead={tableHead} tableBody={tableBody} />
			{booking &&
				(modal === ETypeTicket.REFUNDING ||
					modal === ETypeTicket.REISSUING) && (
					<ModalRefund
						booking={booking}
						typeModal={modal}
						onClose={onClose}
						fetchBookings={fetchBookings}
					/>
				)}
			{booking && modal === ETypeTicket.CANCEL && (
				<ModalCancel
					booking={booking}
					typeModal={modal}
					onClose={() => {
						onClose();
						fetchBookings();
					}}
				/>
			)}
			{booking && modal === ETypeTicket.DISPLAY_PNR && (
				<ModalDisplayPnr
					booking={booking}
					typeModal={modal}
					onClose={onClose}
				/>
			)}
			{booking && modal === ETypeTicket.VOID && (
				<ModalVoidTicket
					booking={booking}
					typeModal={modal}
					onClose={() => {
						onClose();
						fetchBookings();
					}}
				/>
			)}
		</section>
	);
};

export default ManageBookingsPageContent;
