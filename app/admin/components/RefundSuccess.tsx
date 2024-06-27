import InputNumber from '@/components/Input/CurrencyInput';
import Input from '@/components/Input/Input';
import { FC } from 'react';
import {
	Controller,
	FieldErrors,
	FieldValues,
	RegisterOptions,
	UseFormRegisterReturn,
} from 'react-hook-form';

interface IRefundSuccessProps {
	register: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
	errors: FieldErrors<FieldValues>;
	control: any;
}

const RefundSuccess: FC<IRefundSuccessProps> = ({
	register,
	errors,
	control,
}) => {
	return (
		<article className="mt-6 flex flex-col justify-center gap-4">
			<div className="flex flex-col items-start gap-2 w-full">
				<span className="text-sm font-normal">{'Amount'}</span>
				<Controller
					name="amount"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<InputNumber
							className="w-full"
							data-testid="amountInput"
							id="amountInput"
							placeholder="Please enter a number"
							defaultValue={1}
							field={field}
							{...register('amountInput', {
								required: 'Amount is required',
								min: {
									value: 1,
									message: 'Amount must be greater than 1',
								},
							})}
							errors={errors}
						/>
					)}
				/>
				<span className="text-xs">* Please enter the full refund amount</span>
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

export default RefundSuccess;
