import { getUserFromServer } from '@/actions/users/server';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import redis from '@/lib/redis';
import BookingProvider from '@/providers/BookingProvider';
import { REDIS_BOOKING_STORAGE_PREFIX } from '@/utils/constant';
import ManageBookingsPageContent from '../components/ManageBookingsPageContent';
import { VoidTicketContextProvider } from '../hooks/useVoidTicket';

const Home = async () => {
	const user = await getUserFromServer();

	const fetchPendingPNR = async () => {
		try {
			const res = await redis.getKeys(
				`${REDIS_BOOKING_STORAGE_PREFIX}:${user.user.id}:*`
			);
			const pendingPNR = await redis.mget(res);
			return pendingPNR;
		} catch (error: any) {
			return [];
		}
	};

	const pendingPNR = await fetchPendingPNR();

	return (
		<Container>
			<div className="my-4">
				<Heading title="Manage Bookings" />
			</div>
			<div className="bg-white p-8 pt-2 rounded-t-md">
				<BookingProvider>
					<VoidTicketContextProvider>
						<ManageBookingsPageContent pendingPNR={pendingPNR} />
					</VoidTicketContextProvider>
				</BookingProvider>
			</div>
		</Container>
	);
};

export default Home;
