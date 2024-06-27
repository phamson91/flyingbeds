'use client';

import { useForm } from 'react-hook-form';
import InputWithLabel from '@/components/Input/InputWithLabel';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditModal from '@/components/modals/EditModal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { PATHS } from '@/lib/paths';

interface InputLoginProps {
	email: string;
	password: string;
}

interface LoginProps {
	title: string;
}

const Login: FC<LoginProps> = ({ title = 'Welcome' }) => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputLoginProps>({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const onSubmit = async (inputData: InputLoginProps) => {
		setIsSubmitting(true);
		const { email, password } = inputData;
		const supabase = createClientComponentClient();

		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password,
		});
		if (error) {
			toast.error('Email or password is incorrect');
			setIsSubmitting(false);
			return;
		}
		router.push(PATHS.DASHBOARD);
	};

	return (
		<EditModal
			title={title}
			isOpen={true}
			onClose={() => { }}
			onSubmit={handleSubmit((inputData) => onSubmit({ ...inputData }))}
			isSubmitting={isSubmitting}
		>
			<InputWithLabel
				label="Email"
				id="email"
				{...register('email', {
					required: 'Please enter email',
					pattern: {
						value:
							/^(\s{0,}([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})+\s{0,})$/g,
						message: 'Please enter a valid email',
					},
				})}
				type="text"
				placeholder="Enter email"
				disabled={isSubmitting}
				errors={errors}
			/>
			<InputWithLabel
				label="Password"
				id="password"
				{...register('password', {
					required: 'Please enter password',
					minLength: {
						value: 6,
						message: 'Password must be at least 6 characters',
					},
				})}
				type="password"
				placeholder="Enter password"
				disabled={isSubmitting}
				errors={errors}
			/>
		</EditModal>
	);
};

export default Login;
