import { useBooking } from '@/hooks/useBooking';
import { addDays, format } from 'date-fns';
import { CalendarDays, Copy, Ticket } from 'lucide-react';
import { FC } from 'react';
import LabelWithIcon from '../LabelWithIcon';
import toast from 'react-hot-toast';

interface Props {}
const BookingReference: FC<Props> = ({}) => {
	const { bookingInfo } = useBooking();
	const date = addDays(new Date(), 1);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(bookingInfo?.rloc ?? '');
		toast.success('Copied to clipboard');
	}

	return (
		<div className="pb-4">
			<div className="text-base font-medium pb-4">Booking Reference</div>
			<div className="flex justify-between items-center pl-4">
				<LabelWithIcon icon={<Ticket />} label="PNR NUMBER" />
				<div className="flex items-center gap-4 bg-[#27A76C] text-base font-medium text-white p-2 rounded-md select-none">
					<p>{bookingInfo?.rloc}</p>
					<Copy className="cursor-pointer" onClick={copyToClipboard} />
				</div>
			</div>
			<div className="flex justify-between items-center pl-4">
				<LabelWithIcon icon={<CalendarDays />} label="Date of Issue" />
				<div className="text-base font-medium p-2">
					<p className="">{format(date, 'dd MMM yyyy')}</p>
				</div>
			</div>
		</div>
	);
};

export default BookingReference;
