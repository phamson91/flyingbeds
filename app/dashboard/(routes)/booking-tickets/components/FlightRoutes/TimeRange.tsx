import { SliderMulti } from '@/components/ui/slider';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import { cn } from '@/lib/utils';
import { FC, useState } from 'react';

interface Props {
	min: number;
	max: number;
}

const TimeRange: FC<Props> = ({min, max}) => {
	const { timeRange, setTimeRange } = useBookingTickets();

	const handleRangeChange = (value: number[]) => {
		setTimeRange(value);
	};

	return (
		<SliderMulti
			className={cn('w-full')}
			defaultValue={[0, 23]}
			max={max}
			min={min}
			step={1}
			value={timeRange}
			onValueChange={handleRangeChange}
			// formatLabel={(value) => `${value} hrs`}
		/>
	);
};

export default TimeRange;
