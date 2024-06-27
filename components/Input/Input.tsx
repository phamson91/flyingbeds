import { forwardRef } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	errors?: FieldErrors<FieldValues>;
	id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, disabled, errors, id, ...props }, ref) => {
		return (
			<div className='flex flex-col gap-2 w-full'>
				<input
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
          ${id && errors && errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${
						id && errors && errors[id]
							? 'focus:border-rose-500'
							: 'focus:border-sky-600'
					}
      `,
						disabled && 'opacity-70',
						className
					)}
					type={type}
					disabled={disabled}
					ref={ref}
					{...props}
				/>
				{id && errors && errors[id] ? (
					<span
						className="text-rose-500 text-xs inline-block w-max"
						data-testid={`${id}-error`}
					>{`${errors[id]?.message}`}</span>
				) : null}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;