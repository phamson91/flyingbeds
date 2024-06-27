import { ChevronDown } from 'lucide-react';
import React from 'react';

interface Props {
	totalPrice: any;
}
const TotalPrice: React.FC<Props> = ({ totalPrice }) => {
	return (
		<div className="w-full">
			<p className="text-xl font-semibold">Total Price</p>
			<div className="p-2 border-b border-black flex justify-between items-center">
				<span className="text-sm">Total</span>
				<div className="flex justify-start items-center gap-2">
					<span className="font-semibold">{`${totalPrice ?? 0} AUD`}</span>
					{/* <ChevronDown color="#0284C7" /> */}
				</div>
			</div>
		</div>
	);
};

export default TotalPrice;
