import redis from '@/lib/redis';
import { REDIS_TOKEN_STORAGE_PREFIX } from '@/utils/constant';
import ContentPage from './content';
import { getBookingById } from '@/actions/bookings/server';
import { ITicketInfo, ETypeTicket, ESttBooking } from '@/types/booking';
import { decodedToken } from '@/utils/token';
import { IAdminSendResult } from '@/types/sendEmail';
import SubmitForm from './SubmitForm';
import Container from '@/components/Container';
import { JwtPayload } from 'jsonwebtoken';
import { isDateExpired } from '@/utils/getDate';
import { getSettingByKey } from '@/actions/setup/server';
import { ESettingKey } from '@/types/setting';
import { updateBookingServer } from '@/actions/bookings/updateServer';

type TDecodeData = (IAdminSendResult & JwtPayload) | null;
const ConfirmTicketPage = async ({
	params,
}: {
	params: { params: string[] };
}) => {
	// Get params
	const [status, ticketsNumber, bookingId]: string[] = params.params;

	// Add prefix key for token
	const prefixKey = [
		'CUSTOMER_AGREE_CHANGE',
		'CUSTOMER_DECLINE_CHANGE',
	].includes(status)
		? 'user'
		: 'admin';
	let tokenKey: string = `${prefixKey}:${ticketsNumber}`;
	let error: string = '';

	// Redis get
	const token = await redis.get(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);

	const arrTicket = ticketsNumber.split('_');
	/**
	 * Checks if a ticket complete request has been made.
	 */
	const isTicketCompleteRequested = async (): Promise<boolean> => {
		try {
			const { tickets_info } = await getBookingById(bookingId);

			return tickets_info?.some(
				(ticket: ITicketInfo) =>
					arrTicket.includes(ticket.ticketNumber) &&
					(ticket.status === ETypeTicket.REFUNDED ||
						ticket.status === ETypeTicket.REISSUED)
			);
		} catch (error) {
			throw new Error('ERROR_NOT_FOUND_TICKET');
		}
	};

	const isTicketExpiration = async (): Promise<void> => {
		try {
			const { tickets_info, status: sttBooking } = await getBookingById(
				bookingId
			);
			//Get email expire time from table settings
			const { value } = await getSettingByKey(
				ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN
			);
			const isExpired = tickets_info?.some(
				(ticket: ITicketInfo) =>
					arrTicket.includes(ticket.ticketNumber) &&
					ticket?.requestOwner &&
					isDateExpired({
						date: ticket?.confirmReqOn,
						expirationTime: Number(value),
					})
			);

			if (isExpired) {
				redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);

				tickets_info?.forEach((ticket: ITicketInfo) => {
					if (arrTicket.includes(ticket.ticketNumber)) {
						ticket.status = ETypeTicket.LIVE;
						delete ticket.tokenKey;
						delete ticket.requestOwner;
						delete ticket.confirmReqOn;
					}
				});

				const sttCheck = [
					ETypeTicket.REFUNDING,
					ETypeTicket.REISSUING,
					ETypeTicket.REFUNDING_CONFIRMING,
					ETypeTicket.REISSUING_CONFIRMING,
				];

				// Status ticket: REFUNDING/REISSUING_CONFIRMING => REFUNDING/REISSUING
				// Status booking: CANCEL
				await updateBookingServer({
					id: bookingId,
					ticketsInfo: tickets_info,
					sttCheck,
					rootSttBooking: sttBooking,
					desSttBooking: ESttBooking.CANCEL,
					data: {},
				});
				throw new Error('ERROR_TOKEN_FINISHED');
			}

			return;
		} catch (error: any) {
			throw new Error('ERROR_TOKEN_FINISHED');
		}
	};

	// Decode token
	const decodeData = (): TDecodeData => {
		if (status === 'ADMIN_CONFIRM_COMPLETE') {
			try {
				return decodedToken(token as string) as IAdminSendResult & JwtPayload;
			} catch (error) {
				error = 'ERROR';
				return null;
			}
		}
		return null;
	};

	const main = async () => {
		try {
			const isTicketComplete = await isTicketCompleteRequested();
			await isTicketExpiration();

			// Check tickets complete in request
			if (isTicketComplete) {
				redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);
				return 'ERROR_TICKET_CONFLICT';
			}

			// Check token
			if (!token) {
				return 'ERROR_TOKEN_FINISHED';
			}
			return '';
		} catch (error: any) {
			return error.message;
		}
	};

	error = await main();
	console.log('error:', error);

	const isShowSubmitForm =
		status === 'ADMIN_CONFIRM_COMPLETE' &&
		decodeData() &&
		typeof decodeData() === 'object' &&
		decodeData()?.typeTicket === ETypeTicket.REISSUING &&
		!error;

	return (
		<Container>
			<article className="w-full text-center bg-white p-8 rounded-t-md">
				{isShowSubmitForm ? (
					<SubmitForm
						tokenKey={tokenKey}
						ticketsNumber={ticketsNumber}
						token={token}
						status={status}
						decodeData={decodeData() as IAdminSendResult & JwtPayload}
					/>
				) : (
					<ContentPage
						tokenKey={tokenKey}
						ticketsNumber={ticketsNumber}
						token={token}
						status={status}
						error={error}
					/>
				)}
			</article>
		</Container>
	);
};

export default ConfirmTicketPage;
