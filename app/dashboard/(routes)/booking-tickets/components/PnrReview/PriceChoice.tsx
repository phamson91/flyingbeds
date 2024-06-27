import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import formatNumber from '@/lib/formatNumber';
import { ITotalFare } from '@/types/booking';
import { FC } from 'react';

interface IPriceChoiceProps {
	data: ITotalFare[];
	priceChoice: ITotalFare | null;
	setPriceChoice: (fareInfo: ITotalFare) => void;
}

const PriceChoice: FC<IPriceChoiceProps> = ({
	data,
	priceChoice,
	setPriceChoice,
}) => {
	return (
		<article className="w-full text-xs my-1">
			<div className="w-full flex justify-center flex-wrap gap-8">
				{data.map((fareInfo: ITotalFare, index: number) => {
					return (
						<Button
							key={index}
							onClick={() => setPriceChoice(fareInfo)}
							className={`flex flex-col items-start gap outline-red-500 py-1 px-2 text-xs ${
								priceChoice && priceChoice.fareBasicCode === fareInfo.fareBasicCode &&
								'outline outline-[3px] outline-offset-1'
							}`}
						>
							{fareInfo.pointDetails.map((point, indexFare: number) => (
								<div key={indexFare} className="text-center w-full">
									{`${point.shortFareBasic}`}
								</div>
							))}
							<div className="w-full flex justify-center">{`${formatNumber(
								fareInfo.totalAgentNet
							)} (AUD)`}</div>
						</Button>
					);
				})}
			</div>
		</article>
	);
};

export default PriceChoice;
