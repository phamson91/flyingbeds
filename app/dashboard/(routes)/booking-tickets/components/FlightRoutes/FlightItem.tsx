import { cn } from '@/lib/utils';
import { FC } from 'react';

interface Props {
	segment: string;
	date: string;
	onClick: () => void;
	isActive: boolean;
	disabled?: boolean;
}

const FlightItem: FC<Props> = ({
	segment,
	date,
	onClick,
	isActive,
	disabled,
}) => {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center text-sm w-full',
				'gap px-2 py-1 rounded-lg border border-gray-600 cursor-pointer',
				{ 'bg-sky-600 text-white border-transparent': isActive },
				{ 'opacity-50 cursor-not-allowed': disabled }
			)}
			onClick={!disabled ? onClick : undefined}
		>
			<p className="text-center text-xs font-medium">{segment}</p>
			<p className="text-center text-sm font-semibold">{date}</p>
		</div>
	);
};

export default FlightItem;
