'use client';

import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Loader from '@/components/Loader';
import PnrDetail from './PnrDetail';
import PriceSummary from './PriceSummary';
import RetrievePnrForm from './RetrievePnrForm';
import TicketConfirm from './TicketConfirm';

import { useBooking } from '@/hooks/useBooking';

const ActionBooking = ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const {
		bookingInfo,
		showRetrievePnrForm,
		isPnrLoading,
		isPriceLoading,
		priceSummary,
		isTicketIssuing,
		ticketIssued,
	} = useBooking();

	return (
		<Container>
			<div className="my-4">
				<Heading title="Action Booking" />
			</div>
			{showRetrievePnrForm && <RetrievePnrForm searchParams={searchParams} />}
			{isPnrLoading ? (
				<div className="bg-white p-8 pt-2 rounded-b-md">
					<Loader />
				</div>
			) : (
				bookingInfo && <PnrDetail />
			)}
			{isPriceLoading ? (
				<div className="bg-white p-8 pt-2 rounded-b-md">
					<Loader />
				</div>
			) : (
				bookingInfo && priceSummary && <PriceSummary />
			)}
			{isTicketIssuing ? (
				<div className="bg-white p-8 rounded-t-md border-b-2">
					<Loader />
				</div>
			) : (
				ticketIssued && <TicketConfirm />
			)}
		</Container>
	);
};

export default ActionBooking;
