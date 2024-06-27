import { useVoidTicket } from '@/app/dashboard/hooks/useVoidTicket';
import ViewModal from '@/components/modals/ViewModal';
import { PATHS } from '@/lib/paths';
import { ETypeTicket, IBookingSupa } from '@/types/booking';
import { FC, useState } from 'react';
import { toast } from 'react-hot-toast';

interface IModalRequest {
	typeModal: ETypeTicket.VOID;
	onClose: () => void;
	booking: IBookingSupa;
}

const getTokenKeySelected = (booking: IBookingSupa) => {
	const tokenKeySelected = booking?.tickets_info
		?.filter((item) => item?.selected)
		.map((item) => item?.tokenKey ?? item?.ticketNumber);

	return tokenKeySelected ?? [];
};

const ModalVoidTicket: FC<IModalRequest> = ({
	onClose,
	typeModal,
	booking,
}) => {
	const { getPnrData, ticketInfo, sectorInfos } = useVoidTicket();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const tokenKeySelected = getTokenKeySelected(booking);

	const uniqueTokenKey = new Set([...tokenKeySelected]);
	const uniqueTokenArray = [...(uniqueTokenKey as any)] ?? [];

	const ticketsNumber = uniqueTokenArray.flatMap((item) => item?.split('_'));
	const formatTicketNumber = ticketsNumber.map((ticket) =>
		ticket.replace(/-/g, '')
	);

	const onConfirm = async () => {
		try {
			setIsLoading(true);
			const ticketSession = await getPnrData(booking.record_locator);

			if (
				!ticketSession.sessionId ||
				!ticketSession.sequenceNumber ||
				!ticketSession.securityToken
			) {
				return;
			}
			
			const response = await fetch(PATHS.API_TICKET_CANCEL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sessionId: ticketSession?.sessionId,
					sequenceNumber: ticketSession?.sequenceNumber,
					securityToken: ticketSession?.securityToken,
					ticketsNumber: formatTicketNumber,
					airlineCompany: ticketSession?.airlineCode,
					booking,
				}),
			});

			if (!response.ok) {
				const { error } = await response.json();
				setIsLoading(false);
				onClose();
				toast.error(`Error: ${error}`);
				return;
			}

			setIsLoading(false);
			onClose();
			toast.success('Cancel ticket successfully');
		} catch (error) {
			setIsLoading(false);
			onClose();
			toast.error(`Error updating row: ${error}`);
		}
	};

	return (
		<ViewModal
			title="Are you sure you want to void ticket?"
			isOpen={typeModal === ETypeTicket.VOID}
			onClose={onClose}
			onConfirm={onConfirm}
			isLoading={isLoading}
		>
			<div className="text-sm text-gray-600">
				<div className="mb-2">{`You are about to void ${ticketsNumber.length} tickets.`}</div>
				<span className="mb-2">{`The following ticket numbers will be void in the confirmation process:`}</span>
				<span className="mb-2 ml-2">
					<strong>{`${ticketsNumber.join(', ')}`}</strong>
				</span>
				<div className="my-2">
					{
						'The confirmation emails for these tickets that have been sent to users will be invalidated.'
					}
				</div>
				<div className="mb-2">{'Are you sure you want to proceed?'}</div>
			</div>
		</ViewModal>
	);
};

export default ModalVoidTicket;
