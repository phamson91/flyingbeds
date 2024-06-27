import Container from '@/components/Container';
import Heading from '@/components/Heading';
import FlightRoutes from './FlightRoutes';
import UserInformation from './UserInformation';
import Payment from './Payment/index';
import PnrReview from './PnrReview/index';
import { ECurrentPage } from '@/types/booking';

export default function ActionBooking({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	return (
		<Container>
			<div className="my-4">
				<Heading title="Booking Tickets" />
			</div>
			<div className="rounded-t-md">
				{/* @ts-expect-error Server Component */}
				{Object.keys(searchParams ?? {}).length === 0 && <FlightRoutes />}
				{searchParams &&
					searchParams.page === ECurrentPage.USER_INFORMATION && (
						/* @ts-expect-error Server Component */
						<UserInformation />
					)}
				{searchParams && searchParams.page === ECurrentPage.PNR_REVIEW && (
					/* @ts-expect-error Server Component */
					<PnrReview />
				)}
				{/* {searchParams && searchParams.page === ECurrentPage.PAYMENT && (
					<Payment />
				)} */}
			</div>
		</Container>
	);
}
