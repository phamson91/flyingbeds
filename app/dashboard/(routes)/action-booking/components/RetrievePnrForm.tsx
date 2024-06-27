import Input from '@/components/Input/Input';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';
import { FC, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FaKey } from 'react-icons/fa';

interface Props {
	searchParams?: { [key: string]: string | string[] | undefined };
}

const RetrievePnrForm: FC<Props> = ({searchParams}) => {
	const { getPnrData, bookingInfo, isPnrLoading } = useBooking();

	const disabledState = bookingInfo || isPnrLoading ? true : false;

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			relocator: searchParams || '',
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		await getPnrData(data.relocator);
	};

	useEffect(() => {
		if (searchParams) {
			setValue('relocator', searchParams.rloc);
		}
	}, [searchParams, setValue]);


	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="
        bg-white 
        p-8 
        rounded-t-md 
        border-b-2 
        flex
        gap-8"
		>
			<div className="flex">
				<div className="border-l border-y border-neutral-300 rounded-l-md p-2 pt-2 bg-slate-100">
					<FaKey size={20} className="text-slate-400" />
				</div>
				<Input
					className={`
            rounded-none
            rounded-r-md
            py-2.5
          `}
					id="relocator"
					disabled={disabledState}
					{...register('relocator', {
						required: true,
						minLength: 6,
						maxLength: 6,
					})}
					placeholder="Enter Relocator"
					errors={errors}
				/>
			</div>
			<Button type="submit" disabled={disabledState}>
				Retrieve PNR
			</Button>
		</form>
	);
};

export default RetrievePnrForm;
