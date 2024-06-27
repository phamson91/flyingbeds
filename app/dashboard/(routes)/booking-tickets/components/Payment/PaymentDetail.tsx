'use client';
import { Button } from '@/components/ui/Button';
import { Wallet } from 'lucide-react';
import React from 'react';
import WarningTime from '../WarningTime';
import PaymentMethod from './PaymentMethod';

const PaymentDetail = () => {
	const [openPayment, setOpenPayment] = React.useState(false);
	
	return (
		<div className="w-[450px]">
			<div className="flex flex-col justify-start gap-4">
				{/* Top */}
				<div className="bg-white h-fit rounded-md p-4">
					<div className="w-full flex justify-center text-xl font-semibold">
						Price Summary
					</div>
					{/* <TotalPrice priceSummary={priceSummary} /> */}
					{/* {priceSummary && <TotalPrice priceSummary={priceSummary} />} */}
				</div>
				{/* Payment method */}
				<PaymentMethod />
				{/* Button Payment */}
				<div className="flex flex-col w-full gap-2">
					<Button
						className="flex justify-center items-center gap-1"
						onClick={() => setOpenPayment(true)}
					>
						<p>Payment</p>
						<Wallet size={16} />
					</Button>
				</div>
				{/* Button Payment */}
				{/* Top */}
				{/* Bottom */}
				<WarningTime />
				{/* Bottom */}
				{/* Modal payment success */}
			</div>
		</div>
	);
};

export default PaymentDetail;
