import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import formatNumber from '@/lib/formatNumber';
import { IFareInfo, ITotalFare } from '@/types/booking';
import { Pnr, PriceSummary, TravellerInfo } from '@/types/types';
import { User } from 'lucide-react';
import { FC } from 'react';

interface Props {
	priceSummary: PriceSummary;
	bookingInfo: Pnr;
	priceChoice: ITotalFare;
}

const definePax = {
	ADT: 'Adults',
	CHD: 'Children',
	INF: 'Infants',
};

const defineDescriptionPax = {
	ADT: '18 and older',
	CHD: 'Age 2 through 17',
	INF: 'Younger than 2',
};

type TPaxType = keyof typeof definePax;

const TotalPrice: FC<Props> = ({ priceSummary, bookingInfo, priceChoice }) => {
	const countPaxType = (travelerInfos: TravellerInfo[]) => {
		return travelerInfos.reduce(
			(acc: Record<string, number>, current: TravellerInfo) => {
				acc[current.paxType] = (acc[current.paxType] || 0) + 1;
				return acc;
			},
			{}
		);
	};

	const renderTravellerPrice = () => {
		// Count pax type by ADT, CHD, INF
		const paxTypes = countPaxType(bookingInfo?.travellerInfos);
		const result = [];
		let index = 0;
		for (const paxType in paxTypes) {
			index = index + 1;
			// Find fare info with same value as pax type
			const fareInfo: IFareInfo | undefined = priceSummary.faresInfo[
				priceChoice.fareBasicCode
			]?.faresDetail.find((fareItem) =>
				paxType.includes(fareItem.discTktDesignator)
			);

			result.unshift(
				<div className="w-full flex justify-between items-center" key={index}>
					<div className="flex justify-start items-center gap-2">
						<User />
						<div className="text-xs">
							<p className="font-semibold">{`${paxTypes[paxType]} ${
								definePax[paxType as TPaxType]
							}`}</p>
							<p>{defineDescriptionPax[paxType as TPaxType]}</p>
						</div>
					</div>
					<div className="flex justify-start items-center gap-1">
						<span className="font-bold">
							{fareInfo && formatNumber(fareInfo.agentNet * paxTypes[paxType])}
						</span>
						<span className="text-[10px]">AUD</span>
					</div>
				</div>
			);
		}
		return result;
	};

	const renderTotalPaxType = () => {
		const paxTypes = countPaxType(bookingInfo?.travellerInfos);
		const result = [];
		for (const paxType in paxTypes) {
			result.push(`${paxTypes[paxType]} ${definePax[paxType as TPaxType]}`);
		}

		return `(${result.join(', ')})`;
	};

	return (
		<div>
			{/* Number Traveler */}
			<p className="p-4 text-base font-semibold text-center">
				{bookingInfo?.travellerInfos.length < 10 ? '0' : ''}
				{bookingInfo?.travellerInfos.length} Traveller(s)
			</p>
			<div className="flex flex-col gap-y-4 text-sm border-b py-4">
				{/* Item */}
				{renderTravellerPrice()}
			</div>
			{/* Price Summary */}
			{/* Total Price */}
			<div className="w-full flex justify-between items-center pt-4">
				<div className="flex flex-col justify-center items-start text-xs">
					<p className="font-semibold">Total Price</p>
					<p className="text-[10px] text-center">{renderTotalPaxType()}</p>
				</div>
				<div className="flex justify-start items-center gap-1 text-sm">
					<span className="font-bold text-green-600">
						{formatNumber(priceChoice.totalAgentNet)}
					</span>
					<span className="text-[10px]">AUD</span>
				</div>
			</div>
			{/* Total Price */}
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="py-0 w-full justify-center items-center" />
					<AccordionContent className="p-0">
						<div className="w-full flex justify-between items-center p-0">
							<div className="flex flex-col justify-center items-start text-xs">
								<p className="text-[12px] font-semibold text-center">
									Base Fare
								</p>
							</div>
							<div className="flex justify-start items-center gap-1 text-sm">
								<span className="font-bold text-xs">
									{formatNumber(priceChoice.totalGrossFare)}
								</span>
								<span className="text-[10px]">AUD</span>
							</div>
						</div>
						<div className="w-full flex justify-between items-center p-0">
							<div className="flex flex-col justify-center items-start text-xs">
								<p className="text-[12px] font-semibold text-center">Taxes</p>
							</div>
							<div className="flex justify-start items-center gap-1 text-sm">
								<span className="font-bold text-xs">
									{formatNumber(priceChoice.totalTaxes)}
								</span>
								<span className="text-[10px]">AUD</span>
							</div>
						</div>
						<div className="w-full flex justify-between items-center p-0">
							<div className="flex flex-col justify-center items-start text-xs">
								<p className="text-[12px] font-semibold text-center">
									Total Gross
								</p>
							</div>
							<div className="flex justify-start items-center gap-1 text-sm">
								<span className="font-bold text-xs">
									{formatNumber(priceChoice.totalTotalGross)}
								</span>
								<span className="text-[10px]">AUD</span>
							</div>
						</div>
						<div className="w-full flex justify-between items-center p-0">
							<div className="flex flex-col justify-center items-start text-xs">
								<p className="text-[12px] font-semibold text-center">
									Agent Comm
								</p>
							</div>
							<div className="flex justify-start items-center gap-1 text-sm">
								<span className="font-bold text-xs">
									{formatNumber(priceChoice.totalAgentComm)}
								</span>
								<span className="text-[10px]">AUD</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default TotalPrice;
