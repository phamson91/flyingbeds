import Input from '@/components/Input/Input';
import { FC } from 'react';
import {
	FieldErrors,
	FieldValues,
	RegisterOptions,
	UseFormRegisterReturn,
} from 'react-hook-form';

interface IRequestErrorProps {
	register: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
	errors: FieldErrors<FieldValues>;
}

const RequestError: FC<IRequestErrorProps> = ({ register, errors }) => {
	return (
		<article className="mt-6 flex flex-col justify-center gap-8">
			{/* Show: Input Notes */}
			<div className="flex flex-col items-start gap-2 w-full">
				<span className="text-sm font-normal">{'Notes'}</span>
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

export default RequestError;
