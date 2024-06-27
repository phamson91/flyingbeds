import Heading from '@/components/Heading';
import BookingProvider from '@/providers/BookingProvider';
import ManageBookingsPageContent from '../components/ManageBookingsPageContent';
import { ESettingKey } from '@/types/setting';
import { getSettingByKey } from '@/actions/setup/server';

const BookingPage = async () => {
	const expirationTime = async () => {
		try {
			const { value } = await getSettingByKey(
				ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN
			);
			return value;
		} catch (error) {
			return 0;
		}
	};

	const hoursTime = await expirationTime();

	return (
		<>
			<Heading title="Manage Bookings" />
			<div className="bg-white p-8 pt-2 rounded-t-md">
				<BookingProvider>
					<ManageBookingsPageContent expirationTime={Number(hoursTime)} />
				</BookingProvider>
			</div>
		</>
	);
};

export default BookingPage;
