'use client';

import { updateRow } from '@/actions/updateRow';
import { ESettingKey, FormInputs, ISettingFormat } from '@/types/setting';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import EmailTokenExpiration from './SettingProps/EmailTokenExpiration';

interface ISetting {
	data: ISettingFormat;
}

const Setting: FC<ISetting> = ({ data }) => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const {
		register,
		getValues,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<FormInputs>();

	const onSubmit: any = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		target: keyof FormInputs
	) => {
		e.preventDefault();
		try {
			setIsLoading(target);
			clearErrors(target);
			const value = getValues(target);
			if (!value) {
				setError(target, { type: 'custom', message: 'Please enter input!' });
				return;
			}

			await updateRow({
				table: 'settings',
				id: target,
				value,
			});
			toast.success('Successfully updated!');
		} catch (error: any) {
			console.log('error:', error);
			toast.error(error.message);
		}
		setIsLoading(null);
	};

	return (
		<div>
			<EmailTokenExpiration
				isLoading={isLoading}
				value={data[ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN]}
				errors={errors}
				register={register}
				clearErrors={clearErrors}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

export default Setting;
