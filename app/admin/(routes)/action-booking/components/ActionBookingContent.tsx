import { ESttBooking } from '@/types/booking';
import CategoryBooking from './CategoryBooking';

interface BookingsPageProps {
	expirationTime: number;
}
const ActionBookingContent = ({ expirationTime }: BookingsPageProps) => {
	return (
		<section>
			<CategoryBooking
				expirationTime={expirationTime}
				typeStatus={ESttBooking.TODO}
				sortBy={'ascending'}
			/>
			<CategoryBooking
				expirationTime={expirationTime}
				typeStatus={ESttBooking.WAITING}
				sortBy={'ascending'}
			/>
			<CategoryBooking
				expirationTime={expirationTime}
				typeStatus={ESttBooking.DONE}
				sortBy={'descending'}
			/>
			<CategoryBooking
				expirationTime={expirationTime}
				typeStatus={ESttBooking.CANCEL}
				sortBy={'descending'}
			/>
		</section>
	);
};

export default ActionBookingContent;
