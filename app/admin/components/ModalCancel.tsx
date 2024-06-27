import ViewModal from '@/components/modals/ViewModal';
import { PATHS } from '@/lib/paths';
import { ETypeTicket, IBookingSupa } from '@/types/booking';
import { FC, useState } from 'react';
import { toast } from 'react-hot-toast';

interface IModalRequest {
	typeModal: ETypeTicket.CANCEL;
	onClose: () => void;
	booking: IBookingSupa;
}

const getTokenKeySelected = (booking: IBookingSupa) => {
	const tokenKeySelected = booking?.tickets_info
		?.filter((item) => item?.selected)
		.map((item) => item?.tokenKey ?? item?.ticketNumber);

	return tokenKeySelected ?? [];
};
const ModalCancel: FC<IModalRequest> = ({ onClose, typeModal, booking }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const tokenKeySelected = getTokenKeySelected(booking);

	const uniqueTokenKey = new Set([...tokenKeySelected]);
	const uniqueTokenArray = [...(uniqueTokenKey as any)] ?? [];

	const ticketsNumber = uniqueTokenArray.flatMap((item) => item?.split('_'));

	const onConfirm = async () => {
		setIsLoading(true);
		// Fetch api redis
		const response = await fetch(PATHS.API_REDIS, {
			method: 'POST',
			body: JSON.stringify({
				bookingId: booking?.id,
				uniqueTokenArray,
				ticketsNumber,
			}),
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			setIsLoading(false);
			onClose();
			toast.error(`Error: ${response.statusText}`);
			return;
		}
		setIsLoading(false);
		onClose();
		toast.success('Cancel ticket successfully');
	};

	return (
		<ViewModal
			title="Are you sure you want to cancel?"
			isOpen={typeModal === ETypeTicket.CANCEL}
			onClose={onClose}
			onConfirm={onConfirm}
			isLoading={isLoading}
		>
			<div className="text-sm text-gray-600">
				<div className="mb-2">{`You are about to cancel ${ticketsNumber.length} tickets.`}</div>
				<span className="mb-2">{`The following ticket numbers will be cancelled in the confirmation process:`}</span>
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

export default ModalCancel;
