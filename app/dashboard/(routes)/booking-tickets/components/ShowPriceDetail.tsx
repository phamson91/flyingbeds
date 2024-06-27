import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import formatNumber from '@/lib/formatNumber';
import { ICountPassenger } from '@/types/bookingTicket';
import { HandIcon, Landmark, User } from 'lucide-react';

import React, { FC } from 'react';

interface Props {
	passenger: ICountPassenger;
	priceDetail: any;
}

const passengerTypes = [
	{ type: 'ADT', label: 'adults', age: '18 and older' },
	{ type: 'CH', label: 'children', age: '2 and 17' },
	{ type: 'IN', label: 'infants', age: 'less than 2' },
];

const ShowPriceDetail: FC<Props> = ({ passenger, priceDetail }) => {
	
	const adultPrice = priceDetail.ADT ? priceDetail.ADT.totalGross : 0;
	const childPrice = priceDetail.CH ? priceDetail.CH.totalGross : 0;
	const infantPrice = priceDetail.IN ? priceDetail.IN.totalGross : 0;

	const totalPrice =
		adultPrice * passenger.adults +
		childPrice * passenger.children +
		infantPrice * passenger.infants;

	const totalTaxes =
		(priceDetail.ADT ? priceDetail.ADT.taxes : 0) +
		(priceDetail.CH ? priceDetail.CH.taxes : 0) +
		(priceDetail.IN ? priceDetail.IN.taxes : 0);

	const renderPassengerDetails = (type: string, count: number) => {
		const price = priceDetail[type.toUpperCase()]?.totalGross || 0;

		return (
			<div className="w-full flex justify-between items-center">
				<div className="flex justify-start items-center gap-2">
					<User />
					<div className="text-xs">
						<p className="font-semibold">{`${count} ${
							type === 'ADT' ? 'Adults' : type === 'CH' ? 'Children' : 'Infants'
						}`}</p>
						<p className="text-[10px]">
							{type === 'ADT'
								? '18 and older'
								: type === 'CH'
								? '2 and 17 '
								: 'less than 2'}
						</p>
					</div>
				</div>
				<div className="flex justify-start items-center gap-1">
					<span className="font-bold text-[12px]">{formatNumber(price)}</span>
					<span className="text-[10px]">AUD</span>
				</div>
			</div>
		);
	};

	const filteredPassengerTypes = passengerTypes.filter(
		({ label }) => passenger[label as keyof ICountPassenger] > 0
	);


	return (
		<>
			<div>
				<div className="w-full flex justify-between items-center pt-4">
					<div className="flex flex-col justify-center items-start text-xs">
						<p className="font-semibold">Total Price</p>
					</div>
					<div className="flex justify-start items-center gap-1 text-sm">
						<span className="font-bold text-green-600">
							{formatNumber(totalPrice)}
						</span>
						<span className="text-[10px]">AUD</span>
					</div>
				</div>
			</div>
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="py-0 w-full justify-center items-center" />
					<AccordionContent className="p-0">
						<div className="flex flex-col gap-y-4 text-sm  py-4">
							{filteredPassengerTypes.map(({ type, label }) => (
								<div key={type}>
									{renderPassengerDetails(
										type,
										passenger[label as keyof ICountPassenger]
									)}
								</div>
							))}
							<>
								<div className="w-full flex justify-between items-center">
									<div className="flex justify-start items-center gap-2">
										<Landmark />
										<div className="text-xs">
											<p className="font-semibold">Taxes</p>
										</div>
									</div>
									<div className="flex justify-start items-center gap-1">
										<span className="font-bold text-[12px]">
											{formatNumber(totalTaxes)}
										</span>
										<span className="text-[10px]">AUD</span>
									</div>
								</div>
							</>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
};

export default ShowPriceDetail;
