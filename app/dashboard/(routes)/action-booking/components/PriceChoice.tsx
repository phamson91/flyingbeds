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
		<article className="w-full text-lg my-2">
			{!priceChoice ? (
				<Loader />
			) : (
				<div className="w-full flex flex-wrap gap-8">
					{data.map((fareInfo: ITotalFare) => {
						return (
							<Button
								key={fareInfo.fareBasicCode}
								onClick={() => setPriceChoice(fareInfo)}
								className={`flex flex-col items-start gap outline-red-500 py-10 ${
									priceChoice.fareBasicCode === fareInfo.fareBasicCode &&
									'outline outline-[3px] outline-offset-1'
								}`}
							>
								{fareInfo.pointDetails.map((point, index) => (
									<div key={index}>
										{`${point.point} : ${point.shortFareBasic}`}
									</div>
								))}
								<div className="w-full flex justify-center">{`${formatNumber(
									fareInfo.totalAgentNet
								)} (AUD)`}</div>
							</Button>
						);
					})}
				</div>
			)}
		</article>
	);
};

export default PriceChoice;
