import BookingProvider from '@/providers/BookingProvider';
import ActionBooking from '../components/ActionBooking';

export default function ActionBookingHome({
  searchParams,
}: {searchParams?: {[key: string]: string | string[] | undefined}}) {
  return (
    <BookingProvider>
      <ActionBooking searchParams={searchParams} />
    </BookingProvider>
  );
}
