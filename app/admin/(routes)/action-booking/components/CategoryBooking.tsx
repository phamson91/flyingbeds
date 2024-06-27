'use client';

import { getAllBookingsClient, getBookingById } from '@/actions/bookings/get';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/Dropdown';
import {
	IBookingRes,
	IBookingSupa,
	ITicketInfo,
	ETypeTicket,
	TTypeTicket,
	IBookingRequest,
	TSttBooking,
} from '@/types/booking';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSyncAlt, FaTimesCircle, FaTrash, FaUndoAlt } from 'react-icons/fa';
import { MdOutlineMoreVert } from 'react-icons/md';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import ModalCancel from '@/app/admin/components/ModalCancel';
import ModalRequest from '@/app/admin/components/ModalRequest';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import Input from '@/components/Input/Input';
import { debounce } from '@/lib/debounce';
import { Button } from '@/components/ui/Button';
import TableWithCollap from '@/app/admin/components/TableWithCollap';
import Pagination from '@/components/pagination';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface BookingsPageProps {
	expirationTime: number;
	typeStatus: TSttBooking;
	sortBy: 'ascending' | 'descending';
}
const CategoryBooking: React.FC<BookingsPageProps> = ({
	expirationTime,
	typeStatus,
	sortBy,
}) => {
	const supabase = createClientComponentClient({});
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
		sttBooking: typeStatus,
		sortBy,
	});
	const [modal, setModal] = useState<TTypeTicket | null>(null);
	const [booking, setBooking] = useState<IBookingSupa>();
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});
	const [openPopover, setOpenPopover] = useState<boolean>(false);

	/**
	 * Checks if the given booking data has any selected tickets for refund.
	 */
	const isDataChecked = (
		dataRloc: IBookingSupa,
		type: ETypeTicket.REFUNDING | ETypeTicket.REISSUING | ETypeTicket.CANCEL
	) => {
		const isTicketExists = dataRloc?.tickets_info.some(
			(item: ITicketInfo) => item?.selected
		);

		//Show toast if no ticket is selected
		if (!isTicketExists) {
			throw new Error(`Please select at least one ticket for a ${type}`);
		}
	};

	/**
	 * Checks the status of the selected tickets in a booking.
	 */
	const checkTicketStatus = (tickets: ITicketInfo[], type: string) => {
		const isTicketStatus = tickets?.every((item: ITicketInfo) => {
			if (type === ETypeTicket.CANCEL) {
				return [
					ETypeTicket.REFUNDING_CONFIRMING,
					ETypeTicket.REISSUING_CONFIRMING,
				].includes(item?.status as ETypeTicket);
			}
			return item?.status === type;
		});

		//Show toast if status ticket isn't refund/reissue
		if (!isTicketStatus) {
			throw new Error(
				`Please select ticket have status ${
					type === ETypeTicket.CANCEL
						? 'Reissuing/Refunding -Waiting for confirm'
						: type
				}`
			);
		}
	};

	/**
	 * Checks if the confirm price of all selected tickets in a booking is consistent.
	 */
	const checkTicketConfirmPriceConsistent = (tickets: ITicketInfo[]) => {
		let flag = false;

		const firstConfirmPrice = tickets[0]?.confirmPrice;

		if (firstConfirmPrice === undefined) {
			flag = true; // No confirmPrice value to compare
		}

		for (const ticket of tickets) {
			if (ticket.confirmPrice !== firstConfirmPrice) {
				flag = true; // At least one confirmPrice value differs
			}
		}

		//Show toast if confirm price isn't consistent
		if (flag) {
			throw new Error('Please select ticket have confirm price consistent');
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
	 * Handles refunding a ticket with the given record locator (rloc).
	 */
	const handleRequestTicket = async (
		id: string,
		type: ETypeTicket.REFUNDING | ETypeTicket.REISSUING | ETypeTicket.CANCEL
	) => {
		const cloneData = [...bookings.data];

		const dataRloc = cloneData.find((item: IBookingSupa) => item.id === id);

		if (dataRloc && Object.keys(dataRloc).length > 0) {
			// Show toast if no rloc is not exists
			try {
				isDataChecked(dataRloc, type);
				const ticketsInfo = dataRloc.tickets_info
					.filter((item) => item.selected)
					.map((item) => item.ticketNumber);

				const ticketsSelected = await getTicketsSelectedFromDB(id, ticketsInfo);

				checkTicketStatus(ticketsSelected, type);
				checkTicketConfirmPriceConsistent(ticketsSelected);

				setBooking(dataRloc);
				setModal(type);
			} catch (error: any) {
				toast.error(error.message as string);
			}
			return;
		}
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
					<DropdownMenuItem className="flex gap-2 hover:cursor-pointer hover:bg-slate-50">
						<FaTrash className="text-sm w-4 h-4" />
						<span>Void Ticket</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleRequestTicket(id, ETypeTicket.REFUNDING)}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FaUndoAlt className="text-sm w-4 h-4" />
						<span>Refund Ticket</span>
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
						<FaTimesCircle className="text-sm w-4 h-4" />
						<span>Cancel Ticket Confirmation</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);

	const fetchBookings = async () => {
		setBookings({ data: [], count: 0, isLoading: true });
		const { data, count, error }: IBookingRes = await getAllBookingsClient(
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
	};

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
			if (
				// ticketInfo?.status |
				[
					ETypeTicket.REISSUING,
					ETypeTicket.REFUNDING,
					ETypeTicket.LIVE,
					undefined,
				].includes(ticketInfo?.status as ETypeTicket)
			) {
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
			console.log(error);
			toast.error('Error setting date');
		}
	};

	useEffect(() => {
		fetchBookings();

		const channel = supabase
			.channel(typeStatus)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'bookings',
				},
				() => {
					fetchBookings();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase, paramsBooking]);

	return (
		<section>
			<article className="text-xl font-bold">{typeStatus}</article>
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
				tableHead={['', 'Reloc', 'Lead Pax', 'Sectors', 'Date of Action', '']}
				tableBody={bookings.data}
				headCollap={[
					'',
					'Pax Name',
					'Ticket Number',
					'Status',
					'Confirm Price',
					'Request Owner',
					'Confirm Requested On',
				]}
				isLoading={bookings.isLoading}
				handleCheckbox={handleCheckbox}
				handleCheckboxAll={handleCheckboxAll}
				actionCollap={actionCollap}
				expirationTime={expirationTime}
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
			{booking &&
				(modal === ETypeTicket.REFUNDING ||
					modal === ETypeTicket.REISSUING) && (
					<ModalRequest
						booking={booking}
						typeModal={modal}
						onClose={() => {
							setModal(null);
							setBooking(undefined);
						}}
					/>
				)}
			{booking && modal === ETypeTicket.CANCEL && (
				<ModalCancel
					booking={booking}
					typeModal={modal}
					onClose={() => {
						setModal(null);
						setBooking(undefined);
					}}
				/>
			)}
		</section>
	);
};

export default CategoryBooking;
