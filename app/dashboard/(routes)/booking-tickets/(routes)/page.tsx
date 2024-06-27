import { BookingTicketsContextProvider } from '@/hooks/useBookingTickets';
import BookingProvider from '@/providers/BookingProvider';
import { RouteChangesProvider } from 'nextjs-router-events';
import ActionBookingTicket from '../components/ActionBookingTicket';
import { UserFormContextProvider } from '../hooks/useUserForm';

export default function ActionBookingHome({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	return (
		<BookingProvider>
			<BookingTicketsContextProvider>
				<UserFormContextProvider>
					<RouteChangesProvider>
						<ActionBookingTicket searchParams={searchParams} />
					</RouteChangesProvider>
				</UserFormContextProvider>
			</BookingTicketsContextProvider>
		</BookingProvider>
	);
}
