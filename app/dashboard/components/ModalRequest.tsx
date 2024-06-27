import { getBookingById } from '@/actions/bookings/get';
import { updateBookingClient } from '@/actions/bookings/updateClient';
import { sendMailNotice } from '@/actions/sendMail/sendMail';
import Input from '@/components/Input/Input';
import Select from '@/components/Select';
import Table from '@/components/Table/Table';
import EditModal from '@/components/modals/EditModal';
import { useBooking } from '@/hooks/useBooking';
import {
	IBookingSupa,
	IFormRefund,
	ITicketInfo,
	ETypeTicket,
	optionsRefund,
	ESttBooking,
} from '@/types/booking';
import { EStateTicket, IRequestTicket } from '@/types/sendEmail';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface IModalRefundProps {
	typeModal: ETypeTicket.REFUNDING | ETypeTicket.REISSUING;
	onClose: () => void;
	booking: IBookingSupa;
	fetchBookings: () => Promise<void>;
}

const ModalRequest: FC<IModalRefundProps> = ({
	typeModal,
	onClose,
	booking,
	fetchBookings,
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { getPnrData, sectorInfos } = useBooking();
	const rloc = booking!.record_locator;
	const ticketShow =
		booking!.tickets_info!.filter((item) => item.selected) || [];

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<IFormRefund>({
		defaultValues: {
			notes: '',
			confirmPrice: true,
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				rloc && (await getPnrData(rloc));
			} catch (error) {
				reset();
				onClose();
				toast.error(`Error API: ${error}. Please contact admin.`);
			}
			setIsLoading(false);
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rloc]);

	// Handles uploading files to the server.
	const handleUploadFile = async (files: File[]) => {
		// Init form data
		const formData = new FormData();
		formData.append('rloc', rloc);
		// Append files to form data
		for (const file of files) {
			formData.append('files', file);
		}

		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		return res.json();
	};

	/**
	 * Creates a ticket update object with the given tickets information and status.
	 */
	const createTicketUpdate = (ticketsInfo: ITicketInfo[]) => {
		// Get tickets number requested by the customer
		const ticketsSelected = ticketsInfo
			.filter((ticket) => ticket.selected)
			.map((ticket) => ticket.ticketNumber);

		return { ticketsSelected };
	};

	/**
	 * Handles the after submit event of the modal.
	 */
	const handleAfterSubmit = async (
		confirmPrice: boolean,
		status: ETypeTicket.REFUNDING | ETypeTicket.REISSUING
	) => {
		const { ticketsSelected } = createTicketUpdate(booking!.tickets_info);
		// Get booking by id from database

		const { tickets_info } = await getBookingById(booking.id);
		// Update the status of the ticket
		tickets_info?.forEach((item: ITicketInfo) => {
			if (ticketsSelected.includes(item.ticketNumber)) {
				item.status = status; // Status ticket: LIVE -> REFUNDING/REISSUING
				item.confirmPrice = confirmPrice;
			}
			return item;
		});

		// Status ticket: LIVE -> REFUNDING/REISSUING
		// Status booking: TODO
		await updateBookingClient({
			id: booking!.id,
			data: {
				tickets_info: JSON.stringify(tickets_info),
				status: ESttBooking.TODO,
			},
		});
	};

	// Handle submit form
	const handleSubmitForm = async (data: FieldValues): Promise<void> => {
		try {
			setIsSubmitting(true);
			let attachmentsFile = null;
			// Handle upload file and get file name
			if (data.file && data.file.length > 0) {
				const response = await handleUploadFile(data.file);
				if (response.success) {
					attachmentsFile = response.data;
				}
			}

			// Params request send mail
			const requestRefund: IRequestTicket = {
				booking,
				sectorInfos: sectorInfos!,
				rloc: rloc,
				typeTicket: typeModal,
				reason: data.reason,
				notes: data.notes,
				confirmPrice: data.confirmPrice,
				attachmentsFile,
			};
			// Send mail
			await sendMailNotice({
				state: EStateTicket.CUSTOMER_SEND_REQUEST,
				payload: requestRefund,
			});
			setIsSubmitting(false);
			// Handle after submit
			await handleAfterSubmit(data.confirmPrice, typeModal);
			onClose();
			toast.success(`${typeModal} ticket request successful. An email has been sent to the admin.`);
			await fetchBookings();
		} catch (error) {
			onClose();
			toast.error(`Error: ${error}`);
		}
		reset();
		router.refresh();
		return;
	};

	return (
		<EditModal
			isSubmitting={isSubmitting || isLoading}
			title={`Request ${typeModal} Ticket`}
			isOpen={[ETypeTicket.REISSUING, ETypeTicket.REFUNDING].includes(
				typeModal
			)}
			onClose={() => {
				onClose();
				reset();
			}}
			onSubmit={handleSubmit(handleSubmitForm)}
			className="max-w-[900px]"
		>
			{/* Top: Ticket Info */}
			<article className="flex justify-start bg-slate-200 px-4 py-4 gap-4 rounded-md w-full">
				<section className="w-[300px]">
					<h3 className="text-lg font-medium mb-2">Tickets</h3>
					{ticketShow?.map((item: ITicketInfo) => (
						<div key={item.ticketNumber} className="bg-white mb-2 p-3">
							<p className="font-medium text-xl">{item.paxName}</p>
							<p>{item.ticketNumber}</p>
						</div>
					))}
				</section>
				<section className="w-[calc(100%-300px)]">
					<h3 className="text-lg font-medium mb-2">Sectors</h3>

					<Table
						tableHead={[
							'No.',
							'Airline',
							'Flight',
							'Class',
							'Journey',
							'Departure',
						]}
						tableBody={
							(sectorInfos &&
								sectorInfos!.map((item, index) => [
									index + 1,
									item.airline,
									item.flightNumber,
									item.classOfService,
									item.journey,
									item.departureDate,
								])) ||
							[]
						}
						isLoading={isLoading}
					/>
				</section>
			</article>
			{/* Bottom: Reason Refund Ticket */}
			<article className="mt-6 flex justify-center gap-8">
				<div className="w-1/2 flex flex-col justify-start gap-4">
					<div className="flex flex-col items-start gap-2 w-full">
						<span className="text-sm font-normal">Refund Reason</span>
						<Controller
							name="reason"
							control={control}
							rules={{ required: 'Please choose a reason' }}
							render={({ field }) => (
								<Select
									options={optionsRefund}
									className="!w-full"
									field={field}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors['reason'] && (
							<span className="text-rose-500 text-xs inline-block w-max">
								{errors['reason'].message}
							</span>
						)}
					</div>
					<div className="flex flex-col items-start gap-2 w-full">
						<span className="text-sm font-normal">Attachment</span>
						<Input
							id="file"
							type="file"
							// disabled={isLoading}
							// onChange={}
							multiple
							className="w-full"
							{...register('file')}
							errors={errors}
						/>
					</div>
					<div className="flex items-center gap-2 w-full">
						<input
							key="checkbox"
							type="checkbox"
							id="confirmPrice"
							defaultChecked
							{...register('confirmPrice')}
						/>
						<span className="text-sm font-normal">Must confirm price</span>
					</div>
				</div>
				<div className="flex flex-col items-start gap-2 w-1/2">
					<span className="text-sm font-normal">Notes</span>
					<textarea
						className="border p-2"
						id="notes"
						rows={6}
						cols={40}
						{...register('notes', {
							required: 'Please enter notes',
						})}
					/>
					{errors['notes'] && (
						<span className="text-rose-500 text-xs inline-block w-max">
							{errors['notes'].message}
						</span>
					)}
				</div>
			</article>
		</EditModal>
	);
};

export default ModalRequest;
