'use client';

import Input from '@/components/Input/Input';
import { PATHS } from '@/lib/paths';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AddFormHeading from './AddFormHeading';
import { Button } from '@/components/ui/Button';
import { EUserType } from '@/types/user';

interface AddFormProps {
	defaultValues?: {
		email: string;
		password: string;
		companyName: string;
		phone: string;
		phonePrefix: string;
		creditLimit: number;
		role?: string;
	};
	userId?: string;
}

const AddForm: React.FC<AddFormProps> = ({
	defaultValues = {
		email: '',
		password: '',
		companyName: '',
		phone: '',
		phonePrefix: '+61',
		creditLimit: 0,
		role: EUserType.USER,
	},
	userId,
}) => {
	const isAddNewUser = defaultValues.email === '';
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	// alway set new password when adding new user
	const [isNewPassword, setIsNewPassword] = useState(isAddNewUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: { ...defaultValues },
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		const { role } = data;
		const adminRole = role === EUserType.USER ? null : role;

		try {
			setIsLoading(true);
			const res = await fetch(PATHS.API_USERS, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...data, adminRole , isAddNewUser, isNewPassword, userId }),
			});
			if (!res.ok) {
				const { error } = await res.json();
				toast.error(error);
				return;
			}
			// refresh data
			router.refresh();
			router.push(PATHS.ADMIN_USERS);
			toast.success(`User ${isAddNewUser ? 'added' : 'updated'} successfully`);
			setIsLoading(false);
		} catch (error: any) {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="bg-white py-8 px-20 rounded-t-md shadow-md flex flex-col gap-y-8"
		>
			<div className="flex flex-col gap-y-2">
				<div className="flex flex-row flex-auto gap-x-4">
					<div className=" w-full">
						<AddFormHeading>Email</AddFormHeading>
						<Input
							data-testid="emailInput"
							id="email"
							type="email"
							disabled={isLoading}
							{...register('email', {
								required: true,
							})}
							placeholder="eg: abc@cba.com"
							errors={errors}
						/>
					</div>
					<div className="w-full">
						<AddFormHeading>Password</AddFormHeading>
						{/* Only display when add new user */}
						{isNewPassword ? (
							<Input
								data-testid="passwordInput"
								id="password"
								type="password"
								disabled={isLoading}
								{...register('password', {
									required: true,
									minLength: 6,
								})}
								placeholder="at least 6 characters"
								errors={errors}
							/>
						) : (
							<Button
								data-testid="changePasswordBtn"
								type="button"
								className="w-full"
								onClick={() => {
									setIsNewPassword(true);
								}}
							>
								Change Password
							</Button>
						)}
					</div>
				</div>
				<div className="flex flex-row flex-auto gap-x-4">
					<div className="w-full">
						<AddFormHeading>Phone Number</AddFormHeading>
						<div className="flex flex-row items-center">
							<div className="w-[40px]">
								<Input
									id="phonePrefix"
									type="tel"
									disabled={true}
									{...register('phonePrefix', {
										required: true,
										pattern: /^[+]{1}[0-9]{2}$/,
									})}
									errors={errors}
									className="rounded-none rounded-l-md w-[40px] px-1"
								/>
							</div>
							<div className="w-full">
								<Input
									data-testid="phoneInput"
									id="phone"
									type="tel"
									disabled={isLoading}
									{...register('phone', {
										required: true,
										pattern: /^[0]{1}[0-9]{9}$/,
									})}
									placeholder="eg: 0123456789"
									errors={errors}
									className="rounded-none rounded-r-md border-l-0"
								/>
							</div>
						</div>
					</div>
					<div className="w-full">
						<AddFormHeading>{'Credit Limit (AUD)'}</AddFormHeading>
						<Input
							data-testid="creditLimitInput"
							id="creditLimit"
							type="number"
							disabled={isLoading}
							{...register('creditLimit', {
								required: true,
								min: 0,
							})}
							placeholder="eg: 10000"
							errors={errors}
						/>
					</div>
				</div>
				<div className="w-full">
					<AddFormHeading>Full Company Name</AddFormHeading>
					<Input
						data-testid="companyNameInput"
						id="companyName"
						type="text"
						disabled={isLoading}
						{...register('companyName', {
							required: true,
							minLength: 3,
						})}
						placeholder="eg: Flyingbeds Company Limited"
						errors={errors}
					/>
				</div>
				<div className="w-full">
					<AddFormHeading>Role</AddFormHeading>
					<div className="flex gap-4">
						<div className="flex items-center space-x-2">
							<input
								type="radio"
								value={EUserType.ADMIN_SUPER}
								id={EUserType.ADMIN_SUPER}
								disabled
								{...register('role')}
							/>
							<label htmlFor={EUserType.ADMIN_SUPER}>
								{EUserType.ADMIN_SUPER}
							</label>
						</div>
						<div className="flex items-center space-x-2">
							<input
								type="radio"
								value={EUserType.ADMIN_TICKETING}
								id={EUserType.ADMIN_TICKETING}
								{...register('role')}
							/>
							<label htmlFor={EUserType.ADMIN_TICKETING}>
								{EUserType.ADMIN_TICKETING}
							</label>
						</div>
						<div className="flex items-center space-x-2">
							<input
								type="radio"
								value={EUserType.USER}
								id={EUserType.USER}
								{...register('role')}
							/>
							<label htmlFor={EUserType.USER}>{EUserType.USER}</label>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-row flex-auto gap-x-4">
				<Button
					type="button"
					onClick={() => router.back()}
					disabled={isLoading}
					variant={'outline'}
					className="
            basis-1/4
          "
				>
					Back
				</Button>
				<Button
					data-testid="submitBtn"
					disabled={isLoading}
					type="submit"
					className="
              basis-3/4
            "
				>
					Submit
				</Button>
			</div>
		</form>
	);
};

export default AddForm;
