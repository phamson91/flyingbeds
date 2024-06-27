import { insertTransaction } from '@/actions/insertTransaction';
import InputWithLabel from '@/components/Input/InputWithLabel';
import EditModal from '@/components/modals/EditModal';
import { handleClose } from '@/lib/utils';
import { ETransactionDescription, ETransactionType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface TopUpModalProps {
	isOpen: boolean;
	onClose: () => void;
	adminId: string;
	userId: string;
}

const TopUpModal: React.FC<TopUpModalProps> = ({
	isOpen,
	onClose,
	adminId,
	userId,
}) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldValues>({
		defaultValues: {
			topUpAmount: 0,
		},
	});

	/**
	 * Function that handles the submission of the top up form.
	 * @param {FieldValues} data - The form data.
	 * @returns {Promise<void>} - A promise that resolves when the top up is successful or rejects when it fails.
	 */
	const topUpOnSubmit = async (data: FieldValues): Promise<void> => {
		setIsSubmitting(true);
		const { topUpAmount } = data;
		// TO DO - ADD TO CURRENT USER BALANCE
		try {
			await insertTransaction({
				createdBy: adminId,
				receiverUser: userId,
				type: ETransactionType.TOP_UP,
				description: ETransactionDescription.TOP_UP,
				amount: topUpAmount,
			});
			setIsSubmitting(false);
			router.refresh();
			topUpClose();
			toast.success('Top Up Successful');
		} catch (error) {
			toast.error('Top Up Failed');
		}
	};

	const topUpClose = () =>
		handleClose({ setEditData: () => {}, onClose, reset });

	return (
		<EditModal
			title="Reduce Amount"
			isOpen={isOpen}
			onClose={topUpClose}
			onSubmit={handleSubmit(topUpOnSubmit)}
			isSubmitting={isSubmitting}
		>
			<InputWithLabel
				label="Reduce Amount"
				id="reduceAmount"
				data-testid="topUpAmount"
				{...register('topUpAmount', {
					required: 'Top Up Amount is required',
					min: {
						value: 0,
						message: 'Top Up Amount must be greater than 0',
					},
					pattern: {
						value: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
						message: 'Top Up Amount must be a number',
					},
				})}
				placeholder="Enter Top Up Amount"
				errors={errors}
			/>
		</EditModal>
	);
};

export default TopUpModal;
