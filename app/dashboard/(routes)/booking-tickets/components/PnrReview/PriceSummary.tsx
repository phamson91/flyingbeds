'use client';

import { sendMailNotice } from '@/actions/sendMail/sendMail';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';
import { useUser } from '@/hooks/useUser';
import dateUtils from '@/lib/dateUtils';
import { PATHS } from '@/lib/paths';
import { ITotalFare } from '@/types/booking';
import { EStateTicket } from '@/types/sendEmail';
import { BookingTickets } from '@/types/types';
import { format } from 'date-fns';
import { Loader2, Wallet } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PaymentMethod from '../Payment/PaymentMethod';
import TotalPrice from '../TotalPrice';
import WarningTime from '../WarningTime';
import ModalPayment from './ModalPayment';
import PriceChoice from './PriceChoice';
import useLeaveConfirmation from '@/hooks/useLeaveConfirmation';
import { useBookingTickets } from '@/hooks/useBookingTickets';

interface Props {}

const PriceSummary: FC<Props> = () => {
	const [priceChoice, setPriceChoice] = useState<ITotalFare | null>(null);
	const [openPayment, setOpenPayment] = useState(false);
	const [isLoadingConfirmModal, setIsLoadingConfirmModal] =
		useState<boolean>(false);
	const [isPaymentLater, setIsPaymentLater] = useState<boolean>(false);
	const [isLeaveConfirm, setIsLeaveConfirm] = useState<boolean>(true);

	const { userDetails } = useUser();
	const router = useRouter();
	const pathname = usePathname();
	const {
		priceSummary,
		bookingInfo,
		showPriceSummary,
		isPriceLoading,
		issueTicket,
		ticketIssued,
		isTicketIssuing,
		sectorInfos,
		pnrDateCreated,
	} = useBooking();

	const { bookingSession } = useBookingTickets();

	const { confirmationDialog } = useLeaveConfirmation({
		shouldPreventRouteChange: isLeaveConfirm,
		sessionInfo: bookingSession!,
		message:
			'Are you sure you want to leave? All the ticket information will be lost',
	});

	useEffect(() => {
		const fetchPriceSummary = async () => {
			await showPriceSummary();
		};
		fetchPriceSummary();
		return () => {
			toast.dismiss();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		priceSummary && setPriceChoice(priceSummary?.totalFare[0]);
	}, [priceSummary]);

	useEffect(() => {
		ticketIssued && setOpenPayment(true);
	}, [ticketIssued]);

	// Handle button send to email of modal
	const handleConfirmModal = async (ticketIssued: BookingTickets) => {
		setIsLeaveConfirm((prev) => !prev);
		setIsLoadingConfirmModal(true);
		const params = {
			emailRecipients: userDetails?.email ?? '',
			ticketIssued,
			sectorInfo: sectorInfos ?? [],
		};
		// Send mail
		await sendMailNotice({
			state: EStateTicket.CUSTOMER_PAYMENT_SUCCESS,
			payload: params,
		});
		setIsLoadingConfirmModal(false);
		setOpenPayment(false);
		router.push(PATHS['DASHBOARD']);
	};

	const handlePayment = async () => {
		try {
			await issueTicket(priceChoice?.fareBasicCode ?? '');
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handlePaymentLater = async () => {
		try {
			setIsLeaveConfirm((prev) => !prev);
			setIsPaymentLater(true);
			if (!bookingInfo || !pnrDateCreated) {
				throw new Error('Booking info or PNR date created is invalid');
			}

			const { date, time } = pnrDateCreated;

			const formatedDate = format(
				new Date(dateUtils.convertDate(date)),
				'MM/dd/yyyy'
			);
			const formatedTime = time.replace(/(\d{2})(\d{2})/, '$1:$2:00');
			const paymentDate = new Date(`${formatedDate} ${formatedTime}`);
			paymentDate.setHours(paymentDate.getHours() + 7);

			const expireDate = new Date(paymentDate);
			expireDate.setDate(expireDate.getDate() + 1);

			const params = {
				id: userDetails?.id,
				rloc: bookingInfo?.rloc,
				paymentDate,
				expireDate,
			};

			const response = await fetch(PATHS.API_REDIS_TICKET, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) {
				toast.error('Payment later failed');
			}

			toast.loading('Loading...');
			setIsPaymentLater(false);
			router.push(PATHS['DASHBOARD']);
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<div className="w-[450px] flex flex-col justify-start gap-4">
			{confirmationDialog}
			<div className="bg-white h-fit rounded-md p-4">
				<div className="w-full flex justify-center text-xl font-semibold">
					Price Summary
				</div>
				{isPriceLoading ? (
					<div className="pb-4">
						<Loader />
					</div>
				) : (
					priceSummary &&
					priceChoice && (
						<>
							{/* Price Choice */}
							<PriceChoice
								data={priceSummary.totalFare}
								priceChoice={priceChoice}
								setPriceChoice={setPriceChoice}
							/>
							{/* Price Summary */}
							<TotalPrice
								priceSummary={priceSummary}
								bookingInfo={bookingInfo!}
								priceChoice={priceChoice}
							/>
						</>
					)
				)}
				{/* <TotalPrice /> */}
				<div className="flex flex-col w-full gap-2 mt-2">
					<Button
						className="flex justify-center items-center gap-1"
						disabled={isPriceLoading || isTicketIssuing}
						onClick={handlePayment}
					>
						{isTicketIssuing ? (
							<div className="flex gap-2">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</div>
						) : (
							<div className="flex justify-center items-center gap-1">
								<p>Payment</p>
								<Wallet size={16} />
							</div>
						)}
					</Button>
					<Button
						onClick={handlePaymentLater}
						className="bg-white border border-sky-600 text-sky-600 hover:text-white flex justify-center items-center gap-1"
						disabled={isPriceLoading || isPaymentLater}
					>
						{isPriceLoading ? (
							<div className="flex gap-2">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</div>
						) : (
							<div className="flex justify-center items-center gap-1">
								<p>Payment Later</p>
							</div>
						)}
					</Button>
				</div>
			</div>
			<PaymentMethod />
			<WarningTime />

			{ticketIssued && (
				<ModalPayment
					isOpen={openPayment}
					onClose={() => {
						setOpenPayment(false), router.push(PATHS['DASHBOARD']);
					}}
					onConfirm={() => handleConfirmModal(ticketIssued)}
					isLoading={isLoadingConfirmModal}
					data={ticketIssued}
				/>
			)}
		</div>
	);
};
export default PriceSummary;
