'use client';

import { Controller, useForm } from 'react-hook-form';
import InputWithLabel from '@/components/Input/InputWithLabel';
import CustomEditor from '@/components/CustomEditor';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditModal from '@/components/modals/EditModal';
import { Commission } from '@/types/types';
import { handleClose } from '@/lib/utils';
import { getAirlineById } from '@/actions/airlines/client';
import { updateRow } from '@/actions/updateRow';
import { toast } from 'react-hot-toast';

interface AddCommissionProps {
	airline_id: string;
	description: string;
	class: string;
	user_commission: number;
	airline_commission: number;
	service_fee: number;
	fare_basic: string;
}

interface ComEditModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	airline_id: string;
	editData?: Commission;
	setEditData: (data?: Commission) => void;
}

const ComEditModal: React.FC<ComEditModalProps> = ({
	title,
	isOpen,
	onClose,
	airline_id,
	editData,
	setEditData,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset,
		setValue,
	} = useForm<AddCommissionProps>({
		defaultValues: {
			description: '',
			class: '',
			fare_basic: '',
			user_commission: 0,
			airline_commission: 0,
			service_fee: 0,
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				if (key === 'user_commission' || key === 'airline_commission') {
					setValue(key as keyof AddCommissionProps, value * 100);
					continue;
				}
				setValue(key as keyof AddCommissionProps, value);
			}
		}
	}, [editData, setValue]);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const comHandleClose = () => handleClose({ setEditData, onClose, reset });

	const comOnSubmit = async (data: AddCommissionProps) => {
		const { airline_id, fare_basic } = data;
		setIsSubmitting(true);
		try {
			const { commissions } = await getAirlineById(airline_id, fare_basic);
			if (commissions.length > 0 && editData?.id !== commissions[0].id) {
				throw new Error(
					'Fare basis already exists in airline. Please try again.'
				);
			}

			await updateRow({
				...data,
				user_commission: Number(data.user_commission / 100),
				airline_commission: Number(data.airline_commission / 100),
				table: 'commissions',
				id: editData?.id,
			});

			setIsSubmitting(false);
			router.refresh();
			comHandleClose();
		} catch (error: any) {
			toast.error(error.message);
			setIsSubmitting(false);
		}
	};

	return (
		<EditModal
			title={title}
			isOpen={isOpen}
			onClose={comHandleClose}
			onSubmit={handleSubmit((inputData) => {
				const data = { ...inputData, airline_id };
				comOnSubmit(data);
			})}
			isSubmitting={isSubmitting}
		>
			<h3 className="pb-2">Description</h3>
			<Controller
				name="description"
				control={control}
				rules={{ required: 'Description is required' }}
				render={({ field }) => (
					<CustomEditor
						id="description"
						errors={errors}
						value={field.value}
						onChange={field.onChange}
						data-testid="description"
						containerProps={{
							style: {
								border:
									errors && errors['description']
										? '1px solid #ed0202'
										: '1px solid #ddd',
							},
						}}
					/>
				)}
			/>
			<div className="w-full flex justify-between gap-5 pt-4">
				<InputWithLabel
					label="Fare Basis Code"
					id="fare_basic"
					data-testid="fare_basic"
					{...register('fare_basic', {
						required: 'Fare Basis Code is required',
					})}
					type="text"
					placeholder="Enter fare basis code"
					errors={errors}
					className="w-1/2"
				/>
				<InputWithLabel
					label="Class"
					id="class"
					data-testid="class"
					{...register('class', {
						required: 'Class is required',
					})}
					type="text"
					placeholder="Enter applicable class"
					className="w-1/2"
					errors={errors}
				/>
			</div>
			<div className="w-full flex justify-between gap-5">
				<InputWithLabel
					label="User Commission (%)"
					id="user_commission"
					data-testid="commission"
					{...register('user_commission', {
						required: 'User Commission rate is required',
						min: 0,
						pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
					})}
					type="number"
					step="any"
					placeholder="Enter commission rate.."
					errors={errors}
					className="w-1/2"
				/>
				<InputWithLabel
					label="Airline Commission (%)"
					id="airline_commission"
					data-testid="airline_commission"
					{...register('airline_commission', {
						required: 'Airline Commission rate is required',
						min: 0,
						pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
					})}
					type="number"
					step="any"
					placeholder="Enter commission rate.."
					errors={errors}
					className="w-1/2"
				/>
			</div>
			<div className="w-full flex justify-start gap-5">
				<InputWithLabel
					label="Service Fee ($)"
					id="service_fee"
					data-testid="service_fee"
					type="number"
					step="any"
					{...register('service_fee', {
						required: 'Service fee is required',
						min: {
							value: 0,
							message: 'Service fee must be greater than 0',
						},
						pattern: {
							value: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
							message: 'Invalid service fee',
						},
					})}
					placeholder="Enter service fee.."
					errors={errors}
					className="w-full"
				/>
			</div>
		</EditModal>
	);
};

export default ComEditModal;
