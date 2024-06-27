import React from 'react';
import { BarChartBig, Copy, Ticket, WalletCards } from 'lucide-react';
import LabelWithIcon from '../LabelWithIcon';

const BookingInfo = () => {
	return (
		<div className="w-full h-fit bg-white rounded-lg p-4 grid grid-rows-3 gap-y-4">
			<div className='flex justify-between items-center pl-4'>
				<LabelWithIcon icon={<Ticket size={20} />} label='Booking References' classNameLabel='font-semibold text-sm' />
				<div className='flex items-center gap-4 bg-[#27A76C] text-base font-medium text-white p-2 rounded-md select-none'>
					<p>ABCD123</p>
					<Copy className='cursor-pointer' />
				</div>
			</div>
			<div className='flex justify-between items-center pl-4'>
				<LabelWithIcon icon={<BarChartBig size={20} />} label='Status' classNameLabel='font-semibold text-sm' />
				<div className='flex items-center gap-4 bg-amber-500/60 text-[#FF8800] text-base font-medium p-2 rounded-md select-none'>
					<p>NEED TO PAY</p>
				</div>
			</div>
			<div className='flex justify-between items-center pl-4'>
				<LabelWithIcon icon={<WalletCards size={20} />} label='Price to Pay' classNameLabel='font-semibold text-sm' />
				<div className='flex items-center gap-4 bg-red-300 text-base font-medium text-red-600 p-2 rounded-md select-none'>
					<p>123,456,789 VND</p>
				</div>
			</div>

		</div>
	);
};

export default BookingInfo;
