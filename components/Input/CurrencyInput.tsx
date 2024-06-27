import { FC, forwardRef, ForwardedRef } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface ICurrencyInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	errors?: FieldErrors<FieldValues>;
	disabled?: boolean;
	className?: string;
	field?: any;
	allowNegativeValue?: boolean;
}

const InputNumber: FC<ICurrencyInputProps> = forwardRef(
	(
		{
			id,
			field,
			errors,
			disabled = false,
			className,
			allowNegativeValue = false,
			...props
		},
		ref: ForwardedRef<HTMLInputElement>
	) => {
		return (
			<div className={className}>
				<CurrencyInput
					{...props}
					className={twMerge(
						`
							border
							p-2
							text-sm
							rounded-md
							outline-none
							transition
							disabled:opacity-70
							disabled:cursor-not-allowed
							w-full
							${errors && errors[id] ? 'border-rose-500' : 'border-neutral-300'}
							${errors && errors[id] ? 'focus:border-rose-500' : 'focus:border-sky-600'}
						`,
						disabled && 'opacity-70',
						className
					)}
					disabled={disabled}
					id={id}
					name={id}
					defaultValue={0}
					decimalsLimit={2}
					allowNegativeValue={allowNegativeValue}
					value={field.value}
					onValueChange={field.onChange}
					ref={ref}
					step={1}
				/>
				{errors && errors[id] ? (
					<p
						className="text-rose-500 text-xs inline-block"
						data-testid={`${id}-error`}
					>{`${errors[id]?.message}`}</p>
				) : null}
			</div>
		);
	}
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
