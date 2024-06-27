'use client';

import { useForm } from 'react-hook-form';
import InputWithLabel from '@/components/Input/InputWithLabel';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IFee } from '@/types/types';
import EditModal from '@/components/modals/EditModal';
import { handleClose, onSubmit } from '@/lib/utils';

interface AddFeeProps {
	airline_id: string;
	category: string;
	description: string;
	service_fee: number;
}

interface FeeEditModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	airline_id: string;
	editData?: IFee;
	setEditData: (data?: IFee) => void;
}

const FeeEditModal: React.FC<FeeEditModalProps> = ({
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
		reset,
		setValue,
	} = useForm<AddFeeProps>({
		defaultValues: {
			description: '',
			category: '',
			service_fee: 0,
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				setValue(key as keyof AddFeeProps, value);
			}
		}
	}, [editData, setValue]);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const feeHandleClose = () => handleClose({ setEditData, onClose, reset });

	const feeOnSubmit = (data: AddFeeProps) =>
		onSubmit<AddFeeProps>({
			data,
			setIsSubmitting,
			id: editData?.id,
			routerRefresh: () => router.refresh(),
			handleClose: feeHandleClose,
			table: 'fees',
		});

	return (
		<EditModal
			title={title}
			isOpen={isOpen}
			onClose={feeHandleClose}
			onSubmit={handleSubmit((inputData) => {
				const data = { ...inputData, airline_id };
				feeOnSubmit(data);
			})}
			isSubmitting={isSubmitting}
		>
			<InputWithLabel
				label="Category"
				id="category"
				data-testid="category"
				{...register('category', {
					required: 'Category is required.',
				})}
				type="text"
				placeholder="Enter category name.."
				errors={errors}
			/>
			<InputWithLabel
				label="Description"
				id="description"
				data-testid="description"
				{...register('description', {
					required: 'Description is required.',
				})}
				type="text"
				placeholder="Enter fee description.."
				errors={errors}
			/>
			<InputWithLabel
				data-testid="service_fee"
				label="Service Fee ($)"
				id="service_fee"
				type="number"
				step="any"
				{...register('service_fee', {
					required: 'Service fee is required.',
					min: {
						value: 0,
						message: 'Service fee must be greater than or equal to 0.',
					},
					pattern: {
						value: /^[0-9]+(\.[0-9]{1,2})?$/,
						message:
							'Service fee must be a number with up to 2 decimal places.',
					},
				})}
				placeholder="Enter service fee.."
				errors={errors}
			/>
		</EditModal>
	);
};

export default FeeEditModal;
