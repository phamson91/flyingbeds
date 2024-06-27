import { forwardRef } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import Input from './Input';

interface TProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	errors: FieldErrors<FieldValues>;
	label: string;
	id: string;
}
const InputWithLabel = forwardRef<HTMLInputElement, TProps>(
	({ className, errors, label, id, ...props }, ref) => {
		return (
			<div className={twMerge('pb-4', className)}>
				<h3 className="pb-2">{label}</h3>
				<Input
					className="p-2 border"
					id={id}
					errors={errors}
					ref={ref}
					{...props}
				/>
			</div>
		);
	}
);

InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
