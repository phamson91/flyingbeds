import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import formatNumber from '@/lib/formatNumber';
import { BookingTickets, Ticket } from '@/types/types';
import { format } from 'date-fns';
import { Copy, Loader2, WalletCards } from 'lucide-react';

interface IViewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	className?: string;
	data: BookingTickets;
}

const ModalPayment: React.FC<IViewModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	className,
	data,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="flex flex-col justify-center text-center bg-[#F1F5F9]"
			disableInteractOutside={true}
		>
			<WalletCards
				color="#27A76C"
				size={60}
				className="flex justify-center w-full"
			/>
			<p className="pt-2 text-green-600 text-3xl font-semibold">Thank You!</p>
			<p className="p-2 text-green-600 text-sm font-semibold">
				Payment Success
			</p>
			<p className="p-2 text-sm font-semibold">
				Congratulations! Your payment has been successful. Below are the details
				of your booking. A confirmation email will be sent immediately.
			</p>
			<div className="mt-4 bg-white rounded-md p-4 text-start">
				<p className="font-bold text-center text-base">Ticket Overview</p>
				<p className="font-bold text-sm pt-4">Payment Information</p>
				<div className="p-2 border-b">
					<div className="flex justify-between items-center font-semibold">
						<span className="text-sm">Amount</span>
						<span>{`$${formatNumber(data.price ?? 0)}`}</span>
					</div>
					<div className="flex justify-between items-center font-semibold">
						<span className="text-sm">Payment Time</span>
						<span>
							{format(new Date(data.paymentDate ?? ''), 'LLL dd, yyyy HH:mm:ss')}
						</span>
					</div>
				</div>
				<p className="font-bold text-sm pt-4">Passenger Ticket</p>
				{data.tickets.map((item: Ticket, index: number) => (
					<div
						className="flex justify-between items-center p-2 border-b"
						key={index}
					>
						<span className="font-semibold text-sm">{item.paxName}</span>
						<div className="flex items-center gap-2 bg-[#27A76C] text-base font-medium text-white px-3 py-1 rounded-md select-none">
							<p>{item.ticketNumber}</p>
							<Copy className="cursor-pointer" />
						</div>
					</div>
				))}
			</div>
			{/* Button */}
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button disabled={isLoading} onClick={onClose}>
					Print to Ticket
				</Button>
				<Button variant="outline" disabled={isLoading} onClick={onConfirm}>
					{isLoading ? (
						<div className="flex gap-2">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</div>
					) : (
						<span>Send Ticket to email</span>
					)}
				</Button>
			</div>
		</Modal>
	);
};

export default ModalPayment;
