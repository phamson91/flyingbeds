import EditModal from '@/components/modals/EditModal';
import {
	IBookingSupa,
	ITicketInfo,
	ETypeTicket,
	ESttBooking,
} from '@/types/booking';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RefundSuccess from './RefundSuccess';
import RequestError from './RequestError';
import { sendMailNotice } from '@/actions/sendMail/sendMail';
import { EStateTicket, IResponseTicket, TStateTicket } from '@/types/sendEmail';
import { useUser } from '@/hooks/useUser';
import ReissueSuccess from './ReissueSuccess';
import { getBookingById } from '@/actions/bookings/get';
import { updateBookingClient } from '@/actions/bookings/updateClient';

interface IModalRequestProps {
	typeModal: ETypeTicket.REFUNDING | ETypeTicket.REISSUING;
	onClose: () => void;
	booking: IBookingSupa;
}

enum ETab {
	SUCCESS = 'success',
	ERROR = 'error',
}

const ModalRequest: FC<IModalRequestProps> = ({
	typeModal,
	onClose,
	booking,
}) => {
	const { userDetails } = useUser();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const rloc = booking?.record_locator;
	const ticketsInfo = booking?.tickets_info.filter((item) => item.selected);
	const [tab, setTab] = useState<string>(ETab.SUCCESS);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<any>({
		defaultValues: {
			notes: '',
		},
	});

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
	 * Creates parameters for sending a ticket response.
	 */
	const createParams = async (data: FieldValues): Promise<IResponseTicket> => {
		const { ticketsChange } = data;
		let attachmentsFile = null;
		// Handle upload file and get file name
		if (data.file && data.file.length > 0) {
			const response = await handleUploadFile(data.file);
			if (response.success) {
				attachmentsFile = response.data;
			}
		}

		// Add ticketChange to tickets_info when reissue ticket
		if (ticketsChange && typeModal === ETypeTicket.REISSUING) {
			booking.tickets_info.forEach((ticket) => {
				if (ticketsChange[ticket.ticketNumber]) {
					ticket.ticketChange = ticketsChange[ticket.ticketNumber];
				}
			});
		}

		// Params request send mail
		const params: IResponseTicket = {
			booking,
			rloc: rloc,
			typeTicket: typeModal,
			notes: data.notes,
			attachmentsFile,
			adminId: userDetails!.id || '',
		};
		// Add amount to params when current tab is success
		if (data.amount) params.amount = data.amount;

		// Add ticketsChange to params when ticket is reissue
		if (typeof data.ticketsChange !== undefined)
			params.ticketsChange = data.ticketsChange;

		return params;
	};

	/**
	 * Creates a state based on the given tickets information and tab.
	 */
	const createState = (ticketsInfo: ITicketInfo[]): TStateTicket => {
		const ticketSelected = ticketsInfo.filter((item) => item.selected);
		const firstTicketConfirmPrice = ticketSelected.at(0)?.confirmPrice;
		// Tab success
		if (tab === ETab.SUCCESS) {
			if (!firstTicketConfirmPrice) {
				return EStateTicket.ADMIN_NOTIFY_COMPLETE;
			}
			return EStateTicket.ADMIN_SEND_CONFIRM;
		}
		// Tab error
		return EStateTicket.ADMIN_SEND_ERROR;
	};

	/**
	 * Creates a ticket update object with the given tickets information and status.
	 */
	const createTicketUpdate = (
		ticketsInfo: ITicketInfo[],
		status: ETypeTicket.REFUNDING | ETypeTicket.REISSUING
	) => {
		// Get tickets number requested by the customer
		const ticketsSelected = ticketsInfo
			.filter((ticket) => ticket.selected)
			.map((ticket) => ticket.ticketNumber);

		// Generate token key
		const tokenKey = ticketsSelected.join('_');
		// const tokenKey = ticketsString;

		// Create status ticket
		const statusTicket =
			status === ETypeTicket.REFUNDING
				? ETypeTicket.REFUNDING_CONFIRMING
				: ETypeTicket.REISSUING_CONFIRMING;

		return { tokenKey, statusTicket, ticketsSelected };
	};

	/**
	 * Handles the after submit event of the modal.
	 */
	const handleAfterSubmit = async (
		status: ETypeTicket.REFUNDING | ETypeTicket.REISSUING,
		stateType: TStateTicket
	) => {
		try {
			if (
				stateType === EStateTicket.ADMIN_SEND_CONFIRM ||
				stateType === EStateTicket.ADMIN_NOTIFY_COMPLETE
			) {
				const { tokenKey, statusTicket, ticketsSelected } = createTicketUpdate(
					booking.tickets_info,
					status
				);

				// Get booking by id from database
				const { tickets_info, status: sttBooking } = await getBookingById(
					booking.id
				);
				// Update the status of the ticket
				tickets_info?.forEach((item: ITicketInfo) => {
					if (ticketsSelected.includes(item.ticketNumber)) {
						item.requestOwner = userDetails!.company_name || '';
						if (stateType === EStateTicket.ADMIN_SEND_CONFIRM) {
							item.status = statusTicket;
							item.tokenKey = tokenKey;
							item.confirmReqOn = new Date().toISOString();
						}
					}
					return item;
				});

				const desSttBooking =
					stateType === EStateTicket.ADMIN_SEND_CONFIRM
						? ESttBooking.WAITING
						: ESttBooking.DONE;
				// Update booking
				// Status ticket: ADMIN_SEND_CONFIRM: REFUNDING/REISSUING => REFUNDING/REISSUING_CONFIRMING or ADMIN_NOTIFY_COMPLETE: REFUNDING/REISSUING => REFUNDED/REISSUED
				// If all ticket is REFUNDING/REISSUING_CONFIRMING => ADMIN_SEND_CONFIRM: Status booking: WAITING or ADMIN_NOTIFY_COMPLETE: Status booking: DONE
				const sttCheck =
					stateType === EStateTicket.ADMIN_SEND_CONFIRM
						? [ETypeTicket.REFUNDING, ETypeTicket.REISSUING]
						: [
								ETypeTicket.REFUNDING,
								ETypeTicket.REISSUING,
								ETypeTicket.REFUNDING_CONFIRMING,
								ETypeTicket.REISSUING_CONFIRMING,
						  ];
				await updateBookingClient({
					id: booking!.id,
					ticketsInfo: tickets_info,
					sttCheck,
					rootSttBooking: sttBooking,
					desSttBooking,
					data: {},
				});
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	// Handle submit form
	const handleSubmitForm = async (data: FieldValues): Promise<void> => {
		try {
			setIsSubmitting(true);
			// Check tab and set state
			const state: TStateTicket = createState(ticketsInfo as ITicketInfo[]);
			// Create params
			const params = await createParams(data);

			// Send mail
			await sendMailNotice({
				state,
				payload: params,
			});
			await handleAfterSubmit(typeModal, state);
			setIsSubmitting(false);
			onClose();
			toast.success(
				`Successfully processed the ${typeModal} ticket request. An email has been sent to the user.`
			);
		} catch (error: any) {
			console.log('error:', error);
			onClose();
			toast.error(`Error: ${error.message}`);
		}
		reset();
		return;
	};

	const handleChangeTab = (value: string) => {
		setTab(value);
		reset();
	};

	return (
		<EditModal
			isSubmitting={isSubmitting}
			title={`Confirm ${typeModal} Ticket`}
			isOpen={[ETypeTicket.REISSUING, ETypeTicket.REFUNDING].includes(
				typeModal
			)}
			onClose={() => {
				reset();
				onClose();
			}}
			onSubmit={handleSubmit(handleSubmitForm)}
		>
			{/* Show: Tab success and error */}
			<Tabs
				defaultValue={tab}
				className="w-full"
				onValueChange={handleChangeTab}
			>
				<div className="w-full flex justify-center">
					<TabsList>
						<TabsTrigger value={ETab.SUCCESS} className="w-[180px]">
							Success
						</TabsTrigger>
						<TabsTrigger value={ETab.ERROR} className="w-[180px]">
							Error
						</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value={ETab.SUCCESS}>
					{typeModal === ETypeTicket.REFUNDING ? (
						<RefundSuccess
							register={register}
							errors={errors}
							control={control}
						/>
					) : (
						<ReissueSuccess
							register={register}
							errors={errors}
							control={control}
							ticketsInfo={ticketsInfo as ITicketInfo[]}
						/>
					)}
				</TabsContent>
				<TabsContent value={ETab.ERROR}>
					<RequestError register={register} errors={errors} />
				</TabsContent>
			</Tabs>
		</EditModal>
	);
};

export default ModalRequest;
