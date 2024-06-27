import { getAirlineFlightByConditon } from '@/actions/airline_flight/client';
import { updateRow } from '@/actions/updateRow';
import EditModal from '@/components/modals/EditModal';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select';
import { handleClose } from '@/lib/utils';
import { IAirlineInfo } from '@/types/airline';
import { ILocation } from '@/types/types';
import { PlaneLanding, PlaneTakeoff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


interface AirlinesEditModalProps {
	title: string;
	locations: ILocation[];
	isOpen: boolean;
	onClose: () => void;
	airlineId: string;
	editData?: IAirlineInfo;
	setEditData?: (data?: IAirlineInfo) => void;
}

interface IUpdateAirlinesForm {
	departure: string;
	arrival: string;
}

const ManagePriceModal: FC<AirlinesEditModalProps> = ({
	title,
	isOpen,
	onClose,
	airlineId,
	locations,
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
		control,
	} = useForm<IUpdateAirlinesForm>({
		defaultValues: {
			departure: '',
			arrival: '',
		},
	});

	useEffect(() => {
		if (editData) {
			for (const [key, value] of Object.entries(editData)) {
				setValue(key as keyof IUpdateAirlinesForm, value as string);
			}
		}
	}, [editData, setValue]);

	// console.log(classServiceData);

	const airlinesOnSubmit = async (data: IUpdateAirlinesForm) => {
		const { departure, arrival } = data;
		setIsSubmitting(true);

		try {
			const data = await getAirlineFlightByConditon(
				airlineId,
				departure,
				arrival
			);

			if (data) {
				throw new Error('Airline flight already exists');
			}

			await updateRow({
				table: 'airline_flights_info',
				airline_id: airlineId,
				departure: departure,
				arrival: arrival,
				id: editData?.id ?? '',
			});

			setIsSubmitting(false);
			router.refresh();
			airlinesHandleClose();
		} catch (error: any) {
			toast.error(error.message);
			setIsSubmitting(false);
		}
	};

	const airlinesHandleClose = () =>
		handleClose({ onClose, reset, setEditData: () => {} });

	const formatLocations = (locations: ILocation[]) => {
		const formattedLocations: { [key: string]: ILocation[] } = {};

		locations.forEach((location) => {
			if (!formattedLocations[location.region]) {
				formattedLocations[location.region] = [];
			}

			formattedLocations[location.region].push(location);
		});

		return formattedLocations;
	};

	const formattedLocations = formatLocations(locations);

	const renderLocations = () => {
		return Object.entries(formattedLocations).map(
			([region, regionLocations]) => (
				<SelectGroup key={region}>
					<SelectLabel>{region}</SelectLabel>
					{regionLocations.map((location) => (
						<SelectItem key={location.id} value={location.code}>
							{location.name}
						</SelectItem>
					))}
				</SelectGroup>
			)
		);
	};

	return (
		<EditModal
			title={title}
			isOpen={isOpen}
			onClose={airlinesHandleClose}
			onSubmit={handleSubmit((inputData) => {
				const data = { ...inputData, airline_id: airlineId };
				airlinesOnSubmit(data);
			})}
			isSubmitting={isSubmitting}
		>
			<div className="flex gap-4">
				<div className="pb-4 w-1/2">
					<Controller
						name="departure"
						control={control}
						rules={{ required: 'Departure is required' }}
						render={({ field }) => (
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<PlaneTakeoff />
									<SelectValue placeholder="FROM" />
								</SelectTrigger>
								<SelectContent>{renderLocations()}</SelectContent>
							</Select>
						)}
					/>
					{errors['departure'] && (
						<span className="text-rose-500 text-xs inline-block w-max">
							{errors['departure'].message}
						</span>
					)}
				</div>

				<div className="pb-4 w-1/2">
					<Controller
						name="arrival"
						control={control}
						rules={{ required: 'Arrival is required' }}
						render={({ field }) => (
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<PlaneLanding />
									<SelectValue placeholder="TO" defaultValue="" />
								</SelectTrigger>
								<SelectContent>{renderLocations()}</SelectContent>
							</Select>
						)}
					/>
					{errors['arrival'] && (
						<span className="text-rose-500 text-xs inline-block w-max">
							{errors['arrival'].message}
						</span>
					)}
				</div>
			</div>
		</EditModal>
	);
};

export default ManagePriceModal;
