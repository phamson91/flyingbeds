import InputWithLabel from '@/components/Input/InputWithLabel';
import EditModal from '@/components/modals/EditModal';
import { handleClose, onSubmit } from '@/lib/utils';
import { Airline } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface AirlinesEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	editData?: Airline;
	setEditData: (data?: Airline) => void;
}

interface IUpdateAirlinesForm {
	short_name: string;
	name: string;
	notes: string;
}

const AirlinesEditModal: React.FC<AirlinesEditModalProps> = ({
	isOpen,
	onClose,
	editData,
	setEditData,
}) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<IUpdateAirlinesForm>({
		defaultValues: {
			short_name: '',
			name: '',
			notes: '',
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				setValue(key as keyof IUpdateAirlinesForm, value);
			}
		}
	}, [editData, setValue]);

	const airlinesOnSubmit = (data: IUpdateAirlinesForm) => {
		onSubmit({
			data,
			setIsSubmitting,
			id: editData?.id,
			routerRefresh: () => router.refresh(),
			handleClose: airlinesHandleClose,
			table: 'airlines',
		});
	};

	const airlinesHandleClose = () =>
		handleClose({ setEditData, onClose, reset });

	return (
		<EditModal
			title={editData ? 'Edit airline' : 'Add new airline'}
			isOpen={isOpen}
			onClose={airlinesHandleClose}
			onSubmit={handleSubmit(airlinesOnSubmit)}
			isSubmitting={isSubmitting}
		>
			<div className="flex gap-4">
				<InputWithLabel
					label="Code"
					id="short_name"
					data-testid="codeAirlineInput"
					{...register('short_name', {
						required: 'Code is required',
						minLength: {
							value: 2,
							message: 'Code must be at least 2 characters',
						},
					})}
					type="text"
					placeholder="Enter airline's code.."
					errors={errors}
					className="basis-1/4"
				/>
				<InputWithLabel
					label="Name"
					id="name"
					data-testid="nameAirlineInput"
					{...register('name', {
						required: 'Name airline is required',
						minLength: {
							value: 2,
							message: 'Name airline must be at least 2 characters',
						},
					})}
					type="text"
					placeholder="Enter airline name.."
					errors={errors}
					className="w-full"
				/>
			</div>
			<InputWithLabel
				label="Notes"
				id="notes"
				data-testid="notesInput"
				type="text"
				{...register('notes')}
				placeholder="Enter airline's notes"
				errors={errors}
			/>
		</EditModal>
	);
};

export default AirlinesEditModal;
