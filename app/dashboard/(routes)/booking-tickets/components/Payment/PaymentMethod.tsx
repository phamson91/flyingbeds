import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/hooks/useUser';
import formatNumber from '@/lib/formatNumber';
import { WalletCards } from 'lucide-react';
import React from 'react';

const PaymentMethod = () => {
	const { userDetails } = useUser();

	return (
		<div className="bg-white rounded-lg p-4 flex flex-col gap-4">
			<p className="text-sm font-semibold">Please choose Payment method</p>
			{/* Radio group */}
			<RadioGroup defaultValue="option-one">
				<div className="flex items-center space-x-2 bg-sky-600/80 py-2 px-4 rounded-md text-white">
					<RadioGroupItem
						value="option-one"
						className="text-white border-white"
						id="option-one"
					/>
					<Label htmlFor="option-one" className="flex flex-col gap-1">
						<div className="text-sm">Top-up Payment</div>
						{/* <div className='text-[10px]'></div> */}
					</Label>
				</div>
			</RadioGroup>
			{/* Radio group */}
			<p className="text-sm font-semibold">Debt limit information</p>
			<div className="flex items-center gap-4">
				<WalletCards size={24} color="#1AA7EC" />
				<div className="flex flex-col ">
					<p className="text-[10px] font-normal leading-normal">
						Limit balance
					</p>
					<p className="text-xl text-sky-500 font-semibold">
						{userDetails &&
							`$ ${formatNumber(
								userDetails?.max_credit + userDetails?.balance
							)}`}
					</p>
				</div>
			</div>
		</div>
	);
};

export default PaymentMethod;
