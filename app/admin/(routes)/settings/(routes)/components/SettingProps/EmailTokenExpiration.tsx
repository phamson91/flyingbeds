'use client';
import Input from '@/components/Input/Input';
import { Button } from '@/components/ui/Button';
import { ESettingKey, FormInputs } from '@/types/setting';
import { FC } from 'react';
import {
	FieldErrors,
	FieldValues,
	UseFormClearErrors,
	UseFormRegister,
} from 'react-hook-form';

interface IEmailTokenProps {
	isLoading: string | null;
	value: string | number;
	errors: FieldErrors<FieldValues>;
	register: UseFormRegister<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	onSubmit: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		target: keyof FormInputs
	) => void;
}
const EmailTokenExpiration: FC<IEmailTokenProps> = ({
	isLoading,
	value,
	errors,
	register,
	clearErrors,
	onSubmit,
}) => {
	return (
		<div className="flex items-start justify-start gap-4">
			<label
				htmlFor={ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN}
				className="whitespace-nowrap basis-1/3 h-[38px] flex items-center justify-start"
			>
				Email Token Expiration(hours) *:
			</label>
			<Input
				id={ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN}
				type="text"
				defaultValue={value}
				{...register(ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN)}
				placeholder="24"
				errors={errors}
				className="basis-1/4"
				onChange={(e) => {
					e.preventDefault();
					clearErrors(ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN);
				}}
				disabled={isLoading === ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN}
			/>
			<Button
				data-testid="submitBtn"
				type="submit"
				className="basis-1/3"
				onClick={(e) =>
					onSubmit(e, ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN)
				}
				disabled={isLoading === ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN}
			>
				Save
			</Button>
		</div>
	);
};

export default EmailTokenExpiration;
