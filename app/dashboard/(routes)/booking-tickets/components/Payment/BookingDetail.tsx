import BookingInfo from './BookingInfo';
import FlightInfo from './FlightInfo';

const BookingDetail = () => {
	return (
		<div className="w-full flex flex-col gap-y-4">
			<BookingInfo />
			<FlightInfo />
		</div>
	);
};

export default BookingDetail;
