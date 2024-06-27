import Heading from '@/components/Heading';
import BookingProvider from '@/providers/BookingProvider';
import { ESettingKey } from '@/types/setting';
import { getSettingByKey } from '@/actions/setup/server';
import ActionBookingContent from '../components/ActionBookingContent';

const ActionBookingPage = async () => {
	const expirationTime = async () => {
		try {
			const { value } = await getSettingByKey(
				ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN
			);
			return value;
		} catch (error) {
			return <div>Something went wrong</div>;
		}
	};

	const hoursTime = await expirationTime();

	return (
		<>
			<Heading title="Action Bookings" />
			<div className="bg-white p-8 pt-2 rounded-t-md">
				<BookingProvider>
					<ActionBookingContent expirationTime={Number(hoursTime)} />
				</BookingProvider>
			</div>
		</>
	);
};

export default ActionBookingPage;
