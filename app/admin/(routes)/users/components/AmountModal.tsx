import { insertTransaction } from '@/actions/insertTransaction';
import EditModal from '@/components/modals/EditModal';
import { handleClose } from '@/lib/utils';
import { ETransactionDescription, ETransactionType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import InputNumber from '@/components/Input/CurrencyInput';

interface IAmountModalProps {
	isOpen: boolean;
	onClose: () => void;
	adminId: string;
	userId: string;
	type: 'topUp' | 'reduce';
}

interface IInsertData {
	amount: number;
	type: string;
	description: string;
	msgSuccess: string;
	msgError: string;
}

const AmountModal: React.FC<IAmountModalProps> = ({
	isOpen,
	onClose,
	adminId,
	userId,
	type,
}) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<FieldValues>({
		defaultValues: {
			amountInput: 0,
		},
	});

	const parseNumber = (value: string): number => {
		return Number(value.replace(/[^0-9.-]+/g, ''));
	};
	/**
	 * Function that handles the submission of the top up form.
	 */
	const amountOnSubmit = async (data: FieldValues): Promise<void> => {
		setIsSubmitting(true);
		const amount = parseNumber(data.amountInput);
		const insertData: Partial<IInsertData> = {};
		if (type === 'topUp') {
			insertData.amount = amount;
			insertData.type = ETransactionType.TOP_UP;
			insertData.description = ETransactionDescription.TOP_UP;
			insertData.msgSuccess = 'Top Up Successful';
			insertData.msgError = 'Top Up Failed';
		} else {
			insertData.amount = -amount;
			insertData.type = ETransactionType.REDUCE;
			insertData.description = ETransactionDescription.REDUCE;
			insertData.msgSuccess = 'Reduce Amount Successful';
			insertData.msgError = 'Reduce Amount Failed';
		}
		// TO DO - ADD TO CURRENT USER BALANCE
		try {
			await insertTransaction({
				createdBy: adminId,
				receiverUser: userId,
				type: insertData.type,
				description: insertData.description,
				amount: insertData.amount,
			});
			setIsSubmitting(false);
			router.refresh();
			topUpClose();
			toast.success(insertData.msgSuccess);
		} catch (error) {
			toast.error(insertData.msgError);
			console.log(error);
		}
	};

	const topUpClose = () =>
		handleClose({ setEditData: () => {}, onClose, reset });

	return (
		<EditModal
			title={type === 'topUp' ? 'Top Up (AUD)' : 'Reduce Amount (AUD)'}
			isOpen={isOpen}
			onClose={topUpClose}
			onSubmit={handleSubmit(amountOnSubmit)}
			isSubmitting={isSubmitting}
		>
			<Controller
				name="description"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<InputNumber
						data-testid="amountInput"
						id="amountInput"
						placeholder="Please enter a number"
						defaultValue={1}
						field={field}
						{...register('amountInput', {
							required: 'Amount is required',
							min: {
								value: 1,
								message: 'Amount must be greater than 1',
							},
						})}
						errors={errors}
					/>
				)}
			/>
		</EditModal>
	);
};

export default AmountModal;
