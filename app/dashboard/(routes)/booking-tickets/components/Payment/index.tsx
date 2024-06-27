import { FC } from 'react';
import BookingDetail from './BookingDetail';
import PaymentDetail from './PaymentDetail';

interface PaymentProps {}

const Payment: FC<PaymentProps> = () => {
	return (
		<article className="w-full text-lg my-2 flex gap-4">
			<BookingDetail />
			<PaymentDetail />
		</article>
	);
};

export default Payment;
