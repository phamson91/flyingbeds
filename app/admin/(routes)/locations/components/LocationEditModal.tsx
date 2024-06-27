import InputWithLabel from '@/components/Input/InputWithLabel';
import EditModal from '@/components/modals/EditModal';
import { handleClose, onSubmit } from '@/lib/utils';
import { ILocation } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface LocationEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	editData?: ILocation;
	setEditData: (data?: ILocation) => void;
}

interface IUpdateLocationForm {
	code: string;
	name: string;
	region: string;
}

const LocationEditModal: React.FC<LocationEditModalProps> = ({
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
	} = useForm<IUpdateLocationForm>({
		defaultValues: {
			code: '',
			name: '',
			region: '',
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				setValue(key as keyof IUpdateLocationForm, value);
			}
		}
	}, [editData, setValue]);

	const locationsOnSubmit = (data: IUpdateLocationForm) => {
		onSubmit({
			data,
			setIsSubmitting,
			id: editData?.id,
			routerRefresh: () => router.refresh(),
			handleClose: locationsHandleClose,
			table: 'locations',
		});
	};

	const locationsHandleClose = () =>
		handleClose({ setEditData, onClose, reset });

	return (
		<EditModal
			title={editData ? "Edit location" : "Add new location"}
			isOpen={isOpen}
			onClose={locationsHandleClose}
			onSubmit={handleSubmit(locationsOnSubmit)}
			isSubmitting={isSubmitting}
		>
			<div className="flex gap-4">
				<InputWithLabel
					label="Code"
					id="code"
					{...register('code', {
						required: 'Code location is required',
						minLength: {
							value: 2,
							message: 'Code location must be at least 2 characters',
						},
					})}
					type="text"
					placeholder="Enter location's code.."
					errors={errors}
					className="basis-1/4"
				/>
				<InputWithLabel
					label="Name"
					id="name"
					{...register('name', {
						required: 'Name location is required',
						minLength: {
							value: 2,
							message: 'Name location must be at least 2 characters',
						},
					})}
					type="text"
					placeholder="Enter location name.."
					errors={errors}
					className="w-full"
				/>
			</div>
			<InputWithLabel
				label="Region"
				id="region"
				type="text"
				{...register('region', {
					required: 'Region is required',
				})}
				placeholder="Enter region..."
				errors={errors}
			/>
		</EditModal>
	);
};

export default LocationEditModal;