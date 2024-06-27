import InputNumber from '@/components/Input/CurrencyInput';
import Input from '@/components/Input/Input';
import { ITicketInfo } from '@/types/booking';
import { FC } from 'react';
import {
	Controller,
	FieldErrors,
	FieldValues,
	RegisterOptions,
	UseFormRegisterReturn,
} from 'react-hook-form';
import { MdEast } from 'react-icons/md';

interface IReissueSuccessProps {
	register: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
	errors: FieldErrors<FieldValues>;
	control: any;
	ticketsInfo: ITicketInfo[];
}

const ReissueSuccess: FC<IReissueSuccessProps> = ({
	register,
	errors,
	control,
	ticketsInfo,
}) => {
	const isConfirmPrice = ticketsInfo[0].confirmPrice;
	const fileTicket = 'ticketsChange';
	return (
		<article className="mt-6 flex flex-col justify-center gap-4">
			{/* Show: Ticket Number */}
			{!isConfirmPrice && (
				<div className="flex flex-col items-start gap-2 w-full">
					<span className="text-sm font-normal">{'Ticket Number *'}</span>
					<div className="flex flex-col gap-2">
						{ticketsInfo.map((ticket, index) => (
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
											required: !ticket.confirmPrice // If confirmPrice is false, then required
												? 'Please enter new ticket number'
												: false,
										}
									)}
									errors={errors?.ticketsChange as any}
								/>
							</div>
						))}
					</div>
				</div>
			)}
			<div className="flex flex-col items-start gap-2 w-full">
				<span className="text-sm font-normal">{'Amount *'}</span>
				<Controller
					name="amount"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<InputNumber
							allowNegativeValue={true}
							className="w-full"
							data-testid="amountInput"
							id="amountInput"
							placeholder="Please enter a number"
							defaultValue={1}
							field={field}
							{...register('amountInput', {
								required: 'Amount is required',
							})}
							errors={errors}
						/>
					)}
				/>
				<span className="text-xs">
					* Please enter the price difference compared to the original ticket
					price. If the reissue amount is greater than the original amount,
					please enter a negative value.
				</span>
			</div>
			{/* Show: Input Notes */}
			<div className="flex flex-col items-start gap-2 w-full">
				<span className="text-sm font-normal">{'Notes *'}</span>
				<textarea
					className="border p-2 w-full"
					id="notes"
					rows={4}
					cols={40}
					{...register('notes', {
						required: 'Please enter notes',
					})}
				/>
				{errors && errors['notes'] ? (
					<span className="text-rose-500 text-xs inline-block">{`${errors['notes']?.message}`}</span>
				) : null}
			</div>
			{/* Show: Attachment file */}
			<div className="flex flex-col items-start gap-2 w-full">
				<span className="text-sm font-normal">Attachment</span>
				<Input
					id="file"
					type="file"
					// disabled={isLoading}
					// onChange={}
					multiple
					className="w-full"
					{...register('file')}
					errors={errors}
				/>
			</div>
		</article>
	);
};

export default ReissueSuccess;
