'use client';

import { getTicketPriceById } from '@/actions/airline_flight/client';
import { updateRow } from '@/actions/updateRow';
import InputNumber from '@/components/Input/CurrencyInput';
import InputWithLabel from '@/components/Input/InputWithLabel';
import EditModal from '@/components/modals/EditModal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select';
import { handleClose } from '@/lib/utils';
import { ITicketPrice } from '@/types/airline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddClassServiceProps {
	class_of_service: string;
	type: string;
	priceOW: number;
	priceRT: number;
	airline_id: string;
	condition: string;
	flightId: string;
}

interface ClassServiceModalProps {
	title: string;
	flightId: string;
	onClose: () => void;
	airline_id: string;
	editData?: ITicketPrice;
	setEditData?: (data?: ITicketPrice) => void;
}

const ClassServiceModal: React.FC<ClassServiceModalProps> = ({
	title,
	flightId,
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
	} = useForm<AddClassServiceProps>({
		defaultValues: {
			class_of_service: '',
			type: '',
			priceOW: 0,
			priceRT: 0,
			condition: '',
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				key === 'class'
					? setValue('class_of_service', value)
					: setValue(key as any, value);
			}
		}
	}, [editData, setValue]);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const handleCloseClassService = () =>
		handleClose({ onClose, reset, setEditData: () => {} });

	const classOfServiceSubmit = async (data: AddClassServiceProps) => {
		const { class_of_service, type, priceOW, priceRT, condition, flightId } =
			data;
		setIsSubmitting(true);

		console.log('condition', condition);
		try {
			const ticketPriceData = await getTicketPriceById(
				flightId,
				class_of_service
			);

			if (ticketPriceData && !editData) {
				throw new Error('Class of Service is exists in system!');
			}

			await updateRow({
				table: 'ticket_prices',
				id: editData?.id,
				flight_id: flightId,
				type,
				class: class_of_service,
				priceOW: Number(priceOW),
				priceRT: Number(priceRT),
				condition,
			});
			setIsSubmitting(false);
			router.refresh();
			handleCloseClassService();
		} catch (error: any) {
			toast.error(error.message);
			setIsSubmitting(false);
		}
	};

	return (
		<EditModal
			title={title}
			isOpen={!!flightId}
			onClose={handleCloseClassService}
			onSubmit={handleSubmit((inputData) => {
				const data = { ...inputData, airline_id, flightId };
				classOfServiceSubmit(data);
			})}
			isSubmitting={isSubmitting}
		>
			<div className="w-full flex justify-between gap-5 pt-4">
				<InputWithLabel
					label="Class of Service"
					id="class_of_service"
					data-testid="class_of_service"
					{...register('class_of_service', {
						required: 'Class of Service is required',
					})}
					type="text"
					placeholder="Enter Class of Service"
					errors={errors}
					className="w-1/2"
				/>
				<div className="pb-4 w-1/2">
					<p className="pb-2">Type</p>
					<Controller
						name="type"
						control={control}
						rules={{ required: 'Type is required' }}
						render={({ field }) => (
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select Type" />
								</SelectTrigger>
								<SelectContent ref={field.ref}>
									<SelectItem value="Economy">Economy</SelectItem>
									<SelectItem value="Business">Business</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors['type'] && (
						<span className="text-rose-500 text-xs inline-block w-max">
							{errors['type'].message}
						</span>
					)}
				</div>
			</div>
			<div className="w-full flex justify-between items-center gap-4">
				<div className="w-full">
					<p className="pb-2">Price OW (AUD)</p>
					<Controller
						name="priceOW"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<InputNumber
								allowNegativeValue={true}
								className="w-full"
								id="priceOW"
								placeholder="Please enter a number"
								defaultValue={1}
								field={field}
								{...register('priceOW', {
									required: 'Price OneWay is required',
									min: {
										value: 1,
										message: 'Amount must be greater than 1',
									},
								})}
								errors={errors}
							/>
						)}
					/>
				</div>
				<div className="w-full">
					<p className="pb-2">Price RT (AUD)</p>
					<Controller
						name="priceRT"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<InputNumber
								allowNegativeValue={true}
								className="w-full"
								id="priceRT"
								placeholder="Please enter a number"
								defaultValue={1}
								field={field}
								{...register('priceRT', {
									required: 'Price RoundTrip is required',
									min: {
										value: 1,
										message: 'Amount must be greater than 1',
									},
								})}
								errors={errors}
							/>
						)}
					/>
				</div>
			</div>
			<div className="w-full flex justify-start gap-5 mt-4">
				<InputWithLabel
					label="Condition"
					id="condition"
					type="string"
					{...register('condition', {
						required: 'condition is required',
					})}
					placeholder="Enter your condition.."
					errors={errors}
					className="w-full"
				/>
			</div>
		</EditModal>
	);
};

export default ClassServiceModal;
