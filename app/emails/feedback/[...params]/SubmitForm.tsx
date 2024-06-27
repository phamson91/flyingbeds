'use client';
import Input from '@/components/Input/Input';
import { Button } from '@/components/ui/Button';
import { IAdminSendResult } from '@/types/sendEmail';
import { JwtPayload } from 'jsonwebtoken';
import { Loader2 } from 'lucide-react';
import { FC, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm } from 'react-hook-form';
import { MdEast } from 'react-icons/md';
import ContentPage from './content';

interface ISubmitFormProps {
	token: string | null | unknown;
	status: string;
	tokenKey: string;
	ticketsNumber: string;
	decodeData: IAdminSendResult & JwtPayload;
}

const SubmitForm: FC<ISubmitFormProps> = ({
	ticketsNumber,
	tokenKey,
	token,
	status,
	decodeData,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [ticketsChange, setTicketsChange] = useState<{
		[key: string]: string;
	} | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {},
	});

	const fileTicket = 'ticketsChange';
	const handleForm = (data: any) => {
		setIsSubmitting(true);
		setTicketsChange(data.ticketsChange);
		setIsSubmitting(false);
	};
	return (
		<article>
			{ticketsChange && (
				<ContentPage
					tokenKey={tokenKey}
					ticketsNumber={ticketsNumber}
					token={token}
					status={status}
					error=""
					ticketsChange={ticketsChange}
				/>
			)}
			{!ticketsChange && (
				<form
					className="flex flex-col justify-center gap-4"
					onSubmit={handleSubmit(handleForm)}
				>
					{/* Show: Ticket Number */}
					<div className="flex flex-col items-start gap-2 w-full">
						<span className="text-sm font-normal">{'Ticket Number *'}</span>
						<div className="flex flex-col gap-2">
							{decodeData?.booking?.tickets_info
								.filter((item) => item.selected)
								.map((ticket, index) => (
									<div key={index} className="flex items-start gap-2">
										<Input
											id={ticket.ticketNumber.toString()}
											type="text"
											disabled={true}
											value={ticket.ticketNumber}
											className="w-full"
										/>
										<MdEast className="w-[32px] h-[32px]" />
										<Input
											id={ticket.ticketNumber.toString()}
											type="text"
											{...register(
												`${fileTicket}.${ticket.ticketNumber.toString()}`,
												{
													required: 'Please enter new ticket number',
												}
											)}
											errors={errors?.ticketsChange as any}
										/>
									</div>
								))}
						</div>
					</div>
					<div className="flex flex-col items-start gap-2 w-full">
						<span className="text-sm font-normal">{'Amount (AUD)*'}</span>
						<CurrencyInput
							className="border	p-2 text-sm rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed w-full"
							disabled={true}
							id={'amount'}
							name={'amount'}
							decimalsLimit={2}
							value={decodeData?.amount}
						/>
						<span className="text-xs">
							* Please enter the price difference compared to the original
							ticket price. If the reissue amount is greater than the original
							amount, please enter a negative value.
						</span>
					</div>
					<Button disabled={isSubmitting} type="submit">
						{isSubmitting ? (
							<div className="flex gap-2">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</div>
						) : (
							'Submit'
						)}
					</Button>
				</form>
			)}
		</article>
	);
};

export default SubmitForm;
