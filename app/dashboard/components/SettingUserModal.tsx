'use client';

import AddFormHeading from '@/app/admin/(routes)/users/components/AddFormHeading';
import Input from '@/components/Input/Input';
import Loader from '@/components/Loader';
import EditModal from '@/components/modals/EditModal';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/hooks/useUser';
import { PATHS } from '@/lib/paths';
import { handleClose } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export interface TEditFormProps {
	email?: string;
	password?: string;
	companyName?: string;
	phone?: string;
	phonePrefix?: string;
}
interface TProps {
	userId?: string;
	defaultValues: TEditFormProps;
	isOpen: boolean;
	onClose: () => void;
	title: string;
	isUserLoading: boolean;
}
const SettingUserModal: FC<TProps> = ({
	userId,
	defaultValues = {
		email: '',
		password: '',
		companyName: '',
		phone: '',
		phonePrefix: '+61',
	},
	isOpen,
	onClose,
	title,
	isUserLoading,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isNewPassword, setIsNewPassword] = useState(false);
	const { fetchUserDetails } = useUser();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<TEditFormProps>({
		defaultValues: {
			...defaultValues,
		},
	});

	useEffect(() => {
		if (typeof defaultValues === 'object' && defaultValues !== null) {
			for (const [key, value] of Object.entries(defaultValues)) {
				setValue(key as keyof TEditFormProps, value);
			}
		}
	}, [defaultValues, setValue]);

	//Handle close modal
	const userHandleClose = () => {
		setIsNewPassword(false);
		handleClose({ setEditData: () => {}, onClose, reset });
	};

	//Submit form and then update data user with admin on supabase
	const onSubmit = async (data: TEditFormProps, userId: string) => {
		try {
			setIsSubmitting(true);

			//Call API to update user
			const res = await fetch(PATHS.API_USERS, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...data, isNewPassword, userId }),
			});

			if (!res.ok) {
				const { error } = await res.json();
				toast.error(error);
				return;
			}
			toast.success('User edit successfully');
			setIsSubmitting(false);
			fetchUserDetails();
			userHandleClose();
		} catch (error: any) {
			toast.error('Something went wrong');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<EditModal
			title={title}
			isOpen={isOpen}
			onClose={userHandleClose}
			onSubmit={handleSubmit((inputData) => {
				const data = { ...inputData };
				userId && onSubmit(data, userId);
			})}
			isSubmitting={isSubmitting || isUserLoading}
		>
			{!isUserLoading ? (
				<div className="flex flex-col gap-y-2">
					<div className="flex flex-row flex-auto gap-x-4">
						<div className=" w-full">
							<AddFormHeading>Email</AddFormHeading>
							<Input
								id="email"
								type="text"
								data-testid="email"
								disabled={isSubmitting}
								{...register('email', {
									required: 'Please enter email',
									pattern: {
										value:
											/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
										message: 'Please enter a valid email',
									},
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
									id="password"
									type="password"
									data-testid="password"
									disabled={isSubmitting}
									{...register('password', {
										required: 'Please enter password',
										minLength: {
											value: 6,
											message: 'Password must be at least 6 characters',
										},
									})}
									placeholder="at least 6 characters"
									errors={errors}
								/>
							) : (
								<Button
									type="button"
									className="w-full"
									data-testid="changePassword"
									onClick={() => {
										setIsNewPassword(true);
									}}
								>
									Change Password
								</Button>
							)}
						</div>
					</div>
					<div className="flex flex-row flex-auto gap-x-4 pt-2">
						<div className="w-full">
							<AddFormHeading>Phone Number</AddFormHeading>
							<div className="flex flex-row items-start">
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
								<Input
									id="phone"
									type="tel"
									data-testid="phone"
									disabled={isSubmitting}
									{...register('phone', {
										required: 'Please enter phone number',
										pattern: {
											value: /^[0]{1}[0-9]{9}$/,
											message: 'Please enter a valid phone number',
										},
									})}
									placeholder="eg: 0123456789"
									errors={errors}
									className="rounded-none rounded-r-md border-l-0"
								/>
							</div>
						</div>
						<div className="w-full">
							<AddFormHeading>Full Company Name</AddFormHeading>
							<Input
								id="companyName"
								type="text"
								data-testid="companyName"
								disabled={isSubmitting}
								{...register('companyName', {
									required: 'Please enter company name',
									minLength: {
										value: 3,
										message: "Company name can't be less than 3 characters",
									},
								})}
								placeholder="eg: Flyingbeds Company Limited"
								errors={errors}
							/>
						</div>
					</div>
				</div>
			) : (
				<Loader />
			)}
		</EditModal>
	);
};

export default SettingUserModal;
